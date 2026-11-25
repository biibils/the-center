"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface RelicSceneProps {
  currentScene: number;
  totalScenes: number;
  isWarping?: boolean;
}

/**
 * Volumetric God Rays: Berkas cahaya dramatis yang menembus celah kubah dari atas
 */
function VolumetricLightShafts({
  color,
  intensity,
}: {
  color: string;
  intensity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const shafts = useMemo(
    () => [
      { pos: [-1.8, 1.5, -2.5], rot: [0.1, 0, -0.22], scale: [1.4, 9, 1.4] },
      { pos: [0.2, 1.8, -1.8], rot: [0.05, 0, -0.14], scale: [2.1, 10, 2.1] },
      { pos: [2.1, 1.4, -3.0], rot: [-0.08, 0, -0.26], scale: [1.3, 8.5, 1.3] },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = intensity * (0.045 + Math.sin(t * 0.8 + idx * 1.7) * 0.015);
    });
  });

  return (
    <group ref={groupRef}>
      {shafts.map((s, idx) => (
        <mesh
          key={idx}
          position={s.pos as [number, number, number]}
          rotation={s.rot as [number, number, number]}
          scale={s.scale as [number, number, number]}
        >
          <cylinderGeometry args={[0.35, 1.45, 1, 24, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.05}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Siluet Sosok Berjubah Misterius dengan Halo Astrolabe (Muncul di Adegan III)
 */
function CloakedStrangerSilhouette({
  visibleFactor,
  accentColor,
  isDark,
}: {
  visibleFactor: number;
  accentColor: string;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const cloakMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const hoodMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { cloakGeo, hoodGeo, innerVoidGeo, trimGeo } = useMemo(() => {
    const bodyPoints = [
      new THREE.Vector2(0.85, -1.5),
      new THREE.Vector2(0.72, -0.85),
      new THREE.Vector2(0.56, -0.15),
      new THREE.Vector2(0.48, 0.42),
      new THREE.Vector2(0.55, 0.72), // Bahu jubah megah
      new THREE.Vector2(0.26, 0.9),
    ];
    const body = new THREE.LatheGeometry(bodyPoints, 48);

    const pos = body.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const angle = Math.atan2(z, x);
      const fold =
        Math.sin(angle * 9 + y * 2.4) * 0.032 * (1 - (y + 1.5) / 2.4);
      pos.setX(i, x + Math.cos(angle) * fold);
      pos.setZ(i, z + Math.sin(angle) * fold);
    }
    body.computeVertexNormals();

    const hood = new THREE.SphereGeometry(0.3, 32, 24);
    hood.scale(0.95, 1.22, 1.15);

    const faceVoid = new THREE.SphereGeometry(0.23, 24, 24);
    faceVoid.scale(0.82, 1.05, 0.85);

    const trimCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.88, 0.24),
      new THREE.Vector3(-0.28, 0.25, 0.49),
      new THREE.Vector3(-0.38, -0.65, 0.65),
      new THREE.Vector3(-0.46, -1.48, 0.74),
    ]);
    const trim = new THREE.TubeGeometry(trimCurve, 36, 0.007, 6, false);

    return {
      cloakGeo: body,
      hoodGeo: hood,
      innerVoidGeo: faceVoid,
      trimGeo: trim,
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const targetY = THREE.MathUtils.lerp(-1.15, -0.1, visibleFactor);
    groupRef.current.position.y =
      THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05) +
      Math.sin(t * 1.3) * 0.03 * visibleFactor;

    const targetScale = THREE.MathUtils.lerp(0.86, 1.12, visibleFactor);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05),
    );

    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.15;
    }

    if (cloakMatRef.current) {
      cloakMatRef.current.opacity = THREE.MathUtils.lerp(
        cloakMatRef.current.opacity,
        visibleFactor * 0.96,
        0.07,
      );
    }
    if (hoodMatRef.current) {
      hoodMatRef.current.opacity = THREE.MathUtils.lerp(
        hoodMatRef.current.opacity,
        visibleFactor * 0.98,
        0.07,
      );
    }
  });

  const robeColor = isDark ? "#060807" : "#181c18";

  return (
    <group ref={groupRef} position={[0, -1.15, 0.55]}>
      {/* Jubah & Tudung */}
      <mesh geometry={cloakGeo}>
        <meshStandardMaterial
          ref={cloakMatRef}
          color={robeColor}
          roughness={0.92}
          metalness={0.12}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        geometry={hoodGeo}
        position={[0, 1.08, -0.02]}
        rotation={[0.16, 0, 0]}
      >
        <meshStandardMaterial
          ref={hoodMatRef}
          color={robeColor}
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Wajah Gelap Misterius */}
      <mesh geometry={innerVoidGeo} position={[0, 1.05, 0.11]}>
        <meshBasicMaterial
          color="#020303"
          transparent
          opacity={visibleFactor * 0.99}
        />
      </mesh>

      {/* Sulam Emas di Tepi Jubah */}
      <mesh geometry={trimGeo}>
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={visibleFactor * 0.65}
        />
      </mesh>
      <mesh geometry={trimGeo} scale={[-1, 1, 1]}>
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={visibleFactor * 0.65}
        />
      </mesh>

      {/* Halo Lingkaran Astrolabe di Belakang Kepala Sang Sosok */}
      <mesh ref={haloRef} position={[0, 1.02, -0.35]}>
        <ringGeometry args={[0.72, 0.76, 64]} />
        <meshBasicMaterial
          color={accentColor}
          side={THREE.DoubleSide}
          transparent
          opacity={visibleFactor * 0.45}
        />
      </mesh>

      {/* Dramatic Rim Backlight */}
      <pointLight
        position={[0, 1.0, -0.75]}
        intensity={visibleFactor * (isDark ? 5.5 : 2.5)}
        distance={6}
        color={accentColor}
      />
    </group>
  );
}

/**
 * Arsitektur Monumental Baitul Maqdis (Reruntuhan -> Pemulihan Keemasan)
 */
function MonumentalSanctuary({
  currentScene,
  isDark,
}: {
  currentScene: number;
  isDark: boolean;
}) {
  const domeGroupRef = useRef<THREE.Group>(null);
  const ribRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pillarRefs = useRef<(THREE.Mesh | null)[]>([]);

  const ribConfigs = useMemo(() => {
    const count = 10;
    return Array.from({ length: count }, (_, idx) => {
      const angle = (idx / count) * Math.PI;
      const points: THREE.Vector3[] = [];
      const segments = 44;
      const maxT = idx % 2 === 0 ? Math.PI * 0.68 : Math.PI;

      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * maxT;
        const r = 5.2;
        const x = Math.cos(t) * r;
        const y =
          Math.sin(t) * (r * 0.88) + Math.pow(Math.sin(t), 3) * 0.48 - 1.4;
        const vec = new THREE.Vector3(x, y, 0);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        points.push(vec);
      }

      const curve = new THREE.CatmullRomCurve3(points);
      return {
        geo: new THREE.TubeGeometry(curve, 64, 0.028, 8, false),
        ruinOffset: new THREE.Vector3(
          Math.sin(idx * 2.3) * 0.7,
          -Math.abs(Math.cos(idx * 1.7)) * 0.55,
          Math.cos(idx * 1.5) * 0.6,
        ),
        ruinRot: new THREE.Euler(
          Math.sin(idx) * 0.28,
          Math.cos(idx) * 0.22,
          Math.sin(idx * 2) * 0.34,
        ),
      };
    });
  }, []);

  // Barisan Pilar Kolosal Kiri & Kanan (Membentuk Kedalaman Perspektif)
  const colonnadePillars = useMemo(
    () => [
      { pos: [-3.8, -0.3, 2.2], brokenRot: 0.14, height: 5.5 },
      { pos: [3.8, -0.3, 2.2], brokenRot: -0.18, height: 5.5 },
      { pos: [-4.4, -0.2, -1.2], brokenRot: -0.12, height: 6.2 },
      { pos: [4.4, -0.2, -1.2], brokenRot: 0.16, height: 6.2 },
      { pos: [-3.4, -0.1, -4.5], brokenRot: 0.08, height: 6.8 },
      { pos: [3.4, -0.1, -4.5], brokenRot: -0.09, height: 6.8 },
    ],
    [],
  );

  const restorationFactor =
    currentScene === 0
      ? 0
      : currentScene === 1
        ? 0.15
        : currentScene === 2
          ? 0.4
          : currentScene === 3
            ? 0.78
            : 1;

  const structureColor = useMemo(() => {
    if (currentScene <= 1) return isDark ? "#7d3c35" : "#695749";
    if (currentScene === 2) return isDark ? "#9c8359" : "#7c6749";
    return isDark ? "#c7a66a" : "#967443";
  }, [currentScene, isDark]);

  useFrame((_, delta) => {
    const ruinAmount = 1 - restorationFactor;

    if (domeGroupRef.current) {
      domeGroupRef.current.rotation.y +=
        delta * (0.018 + restorationFactor * 0.045);
    }

    ribConfigs.forEach((cfg, idx) => {
      const mesh = ribRefs.current[idx];
      if (!mesh) return;
      mesh.position.lerp(
        new THREE.Vector3(
          cfg.ruinOffset.x * ruinAmount,
          cfg.ruinOffset.y * ruinAmount,
          cfg.ruinOffset.z * ruinAmount,
        ),
        0.05,
      );
      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        cfg.ruinRot.x * ruinAmount,
        0.05,
      );
      mesh.rotation.z = THREE.MathUtils.lerp(
        mesh.rotation.z,
        cfg.ruinRot.z * ruinAmount,
        0.05,
      );
    });

    colonnadePillars.forEach((p, idx) => {
      const mesh = pillarRefs.current[idx];
      if (!mesh) return;
      mesh.rotation.z = THREE.MathUtils.lerp(
        mesh.rotation.z,
        p.brokenRot * ruinAmount,
        0.05,
      );
    });
  });

  return (
    <group>
      {/* Kubah Monumental */}
      <group ref={domeGroupRef} position={[0, 0, -2.0]}>
        {ribConfigs.map((cfg, i) => (
          <mesh
            key={i}
            ref={(el) => {
              ribRefs.current[i] = el;
            }}
            geometry={cfg.geo}
          >
            <meshStandardMaterial
              color={structureColor}
              metalness={isDark ? 0.78 : 0.32}
              roughness={currentScene <= 1 ? 0.75 : 0.28}
              transparent
              opacity={isDark ? 0.88 : 0.62}
            />
          </mesh>
        ))}
      </group>

      {/* Pilar-Pilar Kolosal (Colonnade) */}
      {colonnadePillars.map((p, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            pillarRefs.current[idx] = el;
          }}
          position={p.pos as [number, number, number]}
        >
          <cylinderGeometry args={[0.16, 0.22, p.height, 12]} />
          <meshStandardMaterial
            color={structureColor}
            metalness={isDark ? 0.65 : 0.25}
            roughness={0.6}
            transparent
            opacity={isDark ? 0.65 : 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function RelicChamber({
  currentScene,
  totalScenes,
  isWarping = false,
}: RelicSceneProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const atmosphere = useMemo(() => {
    if (isDark) {
      switch (currentScene) {
        case 0:
          return {
            bg: "#130b0b",
            fog: "#180c0c",
            light: "#b53e32",
            rayIntensity: 0.75,
            ember: "#d95343",
          };
        case 1:
          return {
            bg: "#110f0e",
            fog: "#151210",
            light: "#9c7446",
            rayIntensity: 0.9,
            ember: "#b88952",
          };
        case 2:
          return {
            bg: "#090e10",
            fog: "#0c1316",
            light: "#c7a66a",
            rayIntensity: 1.35,
            ember: "#dfbd7c",
          };
        case 3:
          return {
            bg: "#0d1210",
            fog: "#111815",
            light: "#d9b777",
            rayIntensity: 1.5,
            ember: "#e6c687",
          };
        default:
          return {
            bg: "#121713",
            fog: "#19201a",
            light: "#f0d399",
            rayIntensity: 2.1,
            ember: "#fae0ab",
          };
      }
    } else {
      switch (currentScene) {
        case 0:
          return {
            bg: "#e5dcd2",
            fog: "#ddd2c6",
            light: "#944940",
            rayIntensity: 0.6,
            ember: "#944940",
          };
        case 1:
          return {
            bg: "#e9e1d5",
            fog: "#e2d9cb",
            light: "#8f6e45",
            rayIntensity: 0.7,
            ember: "#8f6e45",
          };
        case 2:
          return {
            bg: "#e7e3dc",
            fog: "#dfd9d0",
            light: "#967443",
            rayIntensity: 0.95,
            ember: "#967443",
          };
        case 3:
          return {
            bg: "#f2ede2",
            fog: "#ece6d9",
            light: "#a68049",
            rayIntensity: 1.1,
            ember: "#a68049",
          };
        default:
          return {
            bg: "#f8f4eb",
            fog: "#f3eee3",
            light: "#ba9154",
            rayIntensity: 1.4,
            ember: "#ba9154",
          };
      }
    }
  }, [currentScene, isDark]);

  const sceneRatio = currentScene / Math.max(1, totalScenes - 1);
  const strangerVisibility =
    currentScene === 2 ? 1 : currentScene === 3 ? 0.3 : 0;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Saat isWarping aktif (klik Masuki Sejarah), kamera melesat masuk ke portal
    const baseZ = isWarping ? 1.2 : THREE.MathUtils.lerp(9.4, 5.2, sceneRatio);

    // Subtle cinematic handheld breathing
    const breatheX = Math.sin(t * 0.6) * 0.08;
    const breatheY = Math.cos(t * 0.45) * 0.06;

    const pointerX = state.pointer.x * 0.45 + breatheX;
    const pointerY = state.pointer.y * 0.28 + breatheY;

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      baseZ,
      isWarping ? 0.09 : 0.05,
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointerX,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      pointerY + 0.12,
      0.04,
    );
    state.camera.lookAt(0, 0.1, -1);
  });

  return (
    <>
      <color attach="background" args={[atmosphere.bg]} />
      <fog attach="fog" args={[atmosphere.fog, 4.2, 16.5]} />

      <ambientLight intensity={isDark ? 0.55 : 1.65} />
      <directionalLight
        position={[4, 9, 5]}
        intensity={isDark ? 2.0 : 1.1}
        color={atmosphere.light}
      />

      <Environment preset={isDark ? "night" : "apartment"} />

      {/* Berkas Cahaya Volumetrik (God Rays) */}
      <VolumetricLightShafts
        color={atmosphere.light}
        intensity={atmosphere.rayIntensity}
      />

      {/* Badai Bara Reruntuhan & Partikel Emas 2 Lapisan Kedalaman */}
      <Sparkles
        count={150}
        scale={[14, 9, 14]}
        size={currentScene <= 1 ? 2.6 : 2.1}
        speed={currentScene <= 1 ? 0.25 : 0.45}
        opacity={isDark ? 0.7 : 0.45}
        color={atmosphere.ember}
      />

      {/* Kubah & Pilar Monumental */}
      <MonumentalSanctuary currentScene={currentScene} isDark={isDark} />

      {/* Siluet Sosok Berjubah Misterius */}
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.14}>
        <CloakedStrangerSilhouette
          visibleFactor={strangerVisibility}
          accentColor={isDark ? "#c7a66a" : "#967443"}
          isDark={isDark}
        />
      </Float>
    </>
  );
}

export function BaitulMaqdisCanvas({
  currentScene,
  totalScenes,
  isWarping,
}: RelicSceneProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.12, 9.4], fov: 44, near: 0.1, far: 55 }}
        gl={{ antialias: true, alpha: false }}
      >
        <RelicChamber
          currentScene={currentScene}
          totalScenes={totalScenes}
          isWarping={isWarping}
        />
      </Canvas>
      <div className="archival-grain pointer-events-none absolute inset-0" />
      <div className="cinematic-vignette pointer-events-none absolute inset-0 opacity-85" />
    </div>
  );
}
