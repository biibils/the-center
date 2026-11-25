"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  progressRef: React.MutableRefObject<number>;
}

/**
 * Gerbang Lengkung Runcing Klasik (Pointed Islamic Arch / Iwan)
 * Dibangun dari kurva arsitektural presisi
 */
function PointedArchGate({
  width = 6.2,
  height = 7.4,
  color,
  metalness,
  roughness,
  opacity = 0.75,
}: {
  width?: number;
  height?: number;
  color: string;
  metalness: number;
  roughness: number;
  opacity?: number;
}) {
  const { outerGeo, innerGeo } = useMemo(() => {
    const createArchCurve = (w: number, h: number) => {
      const hw = w / 2;
      const springY = h * 0.12; // Titik mulai lengkungan
      const topY = h * 0.56; // Puncak lancip kubah lengkung
      const bottomY = -h * 0.48;

      const points = [
        new THREE.Vector3(-hw, bottomY, 0),
        new THREE.Vector3(-hw, springY, 0),
        new THREE.Vector3(-hw * 0.72, topY * 0.68, 0),
        new THREE.Vector3(0, topY, 0), // Puncak runcing khas Iwan/Mihrab
        new THREE.Vector3(hw * 0.72, topY * 0.68, 0),
        new THREE.Vector3(hw, springY, 0),
        new THREE.Vector3(hw, bottomY, 0),
      ];

      return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
    };

    const outerCurve = createArchCurve(width, height);
    const innerCurve = createArchCurve(width - 0.38, height - 0.38);

    return {
      outerGeo: new THREE.TubeGeometry(outerCurve, 96, 0.028, 12, false),
      innerGeo: new THREE.TubeGeometry(innerCurve, 96, 0.014, 8, false),
    };
  }, [width, height]);

  return (
    <group>
      <mesh geometry={outerGeo}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={innerGeo}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent
          opacity={opacity * 0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * Maragha Armillary Sphere (Instrumen Observatorium Astronomi Klasik)
 * Terdiri dari Cincin Meridian, Sabuk Ekliptika Miring 23.5°, & Jarum Poros Langit
 */
function ArmillaryObservatoryCore({
  color,
  metalness,
  roughness,
  opacity,
}: {
  color: string;
  metalness: number;
  roughness: number;
  opacity: number;
}) {
  const outerGimbalRef = useRef<THREE.Group>(null);
  const eclipticRef = useRef<THREE.Group>(null);

  const degreeTicks = useMemo(
    () => Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2),
    [],
  );

  useFrame((_, delta) => {
    if (outerGimbalRef.current) {
      outerGimbalRef.current.rotation.y += delta * 0.14;
    }
    if (eclipticRef.current) {
      eclipticRef.current.rotation.z -= delta * 0.18;
    }
  });

  return (
    <group>
      {/* 1. Cincin Meridian Statis Luar */}
      <mesh>
        <torusGeometry args={[1.65, 0.026, 16, 120]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* 2. Cincin Cakrawala (Horizon Ring) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.022, 16, 120]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent
          opacity={opacity * 0.9}
        />
      </mesh>

      {/* 3. Gimbal Berputar & Sabuk Ekliptika (Kemiringan Bumi 23.5°) */}
      <group ref={outerGimbalRef}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.42, 0.018, 12, 100]} />
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>

        {/* Sabuk Ekliptika dengan Skala Derajat */}
        <group ref={eclipticRef} rotation={[0.41, 0, 0.25]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.28, 1.28, 0.16, 72, 1, true]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.75}
            />
          </mesh>

          {degreeTicks.map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.28, 0, Math.sin(angle) * 1.28]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[0.03, i % 4 === 0 ? 0.14 : 0.07, 0.012]} />
              <meshStandardMaterial
                color={color}
                metalness={metalness}
                roughness={roughness}
                transparent
                opacity={opacity}
              />
            </mesh>
          ))}
        </group>

        {/* 4. Jarum Poros Langit (Polar Axis Spire) & Inti Bola */}
        <group rotation={[0, 0, 0.41]}>
          <mesh>
            <cylinderGeometry args={[0.014, 0.014, 3.8, 16]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Ujung Finial Atas & Bawah */}
          <mesh position={[0, 1.92, 0]}>
            <coneGeometry args={[0.055, 0.18, 16]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh position={[0, -1.92, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.055, 0.18, 16]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Bola Bumi / Titik Pusat Observasi */}
          <mesh>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transparent
              opacity={opacity}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function ObservatoryTunnel({ progressRef }: SceneProps) {
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

  const palette = isDark
    ? {
        bg: "#0d1110",
        brass: "#c7a66a",
        metalness: 0.85,
        roughness: 0.26,
        opacity: 0.85,
      }
    : {
        bg: "#f5f1e8",
        brass: "#9e7b47",
        metalness: 0.28,
        roughness: 0.62,
        opacity: 0.56,
      };

  useFrame((state) => {
    const p = progressRef.current;

    // Kamera meluncur menembus deretan gerbang lengkung menuju Bola Armilar
    const targetZ = THREE.MathUtils.lerp(12, -9.2, p);
    const pointerX = state.pointer.x * 0.35;
    const pointerY = state.pointer.y * 0.22;

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.07,
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointerX,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      pointerY,
      0.04,
    );
    state.camera.lookAt(0, 0.1, targetZ - 8);
  });

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 5, 23]} />

      <ambientLight intensity={isDark ? 0.65 : 1.75} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={isDark ? 1.6 : 0.95}
        color={palette.brass}
      />

      <Environment preset={isDark ? "night" : "apartment"} />

      {/* Deretan 4 Gerbang Lengkung Mihrab / Iwan Membentuk Lorong Sejarah */}
      <group position={[0, 0.2, 6]}>
        <PointedArchGate
          width={8.4}
          height={8.8}
          color={palette.brass}
          metalness={palette.metalness}
          roughness={palette.roughness}
          opacity={palette.opacity}
        />
      </group>

      <group position={[0, 0.2, 1]}>
        <PointedArchGate
          width={7.4}
          height={7.8}
          color={palette.brass}
          metalness={palette.metalness}
          roughness={palette.roughness}
          opacity={palette.opacity}
        />
      </group>

      <group position={[0, 0.2, -4]}>
        <PointedArchGate
          width={6.4}
          height={6.8}
          color={palette.brass}
          metalness={palette.metalness}
          roughness={palette.roughness}
          opacity={palette.opacity}
        />
      </group>

      <group position={[0, 0.2, -9]}>
        <PointedArchGate
          width={5.4}
          height={5.8}
          color={palette.brass}
          metalness={palette.metalness}
          roughness={palette.roughness}
          opacity={palette.opacity}
        />
      </group>

      {/* Inti Observatorium: Bola Armilar Klasik di Ujung Lorong */}
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.18}>
        <group position={[0, 0.15, -14.8]}>
          <ArmillaryObservatoryCore
            color={palette.brass}
            metalness={palette.metalness}
            roughness={palette.roughness}
            opacity={isDark ? 0.9 : 0.52}
          />
        </group>
      </Float>
    </>
  );
}

export function CivilizationCanvas({ progressRef }: SceneProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <ObservatoryTunnel progressRef={progressRef} />
      </Canvas>
      <div className="archival-grain pointer-events-none absolute inset-0" />
      <div className="cinematic-vignette pointer-events-none absolute inset-0 opacity-80" />
    </div>
  );
}
