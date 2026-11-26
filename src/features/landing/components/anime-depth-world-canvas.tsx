"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AnimeDepthWorldCanvasProps {
  progressRef: React.MutableRefObject<number>;
  colorMapSrc?: string;
  depthMapSrc?: string;
}

// Membuat tekstur lingkaran cahaya lembut (soft radial glow) tanpa file gambar tambahan
function createSparkleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 252, 235, 1)");
    gradient.addColorStop(0.28, "rgba(255, 224, 145, 0.85)");
    gradient.addColorStop(0.65, "rgba(255, 196, 95, 0.25)");
    gradient.addColorStop(1, "rgba(255, 196, 95, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function AnimeDepthWorldCanvas({
  progressRef,
  colorMapSrc = "/images/landing-world.webp",
  depthMapSrc = "/images/landing-world-depth.webp",
}: AnimeDepthWorldCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load(colorMapSrc);
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.minFilter = THREE.LinearFilter;

    const depthTexture = textureLoader.load(depthMapSrc);
    depthTexture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(16, 9, 160, 90);
    const material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      displacementMap: depthTexture,
      displacementScale: 2.4,
      displacementBias: -1.1,
      roughness: 1,
      metalness: 0,
    });

    const worldMesh = new THREE.Mesh(geometry, material);
    scene.add(worldMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    scene.add(ambientLight);

    // =========================================================
    // SPARKLE & CAHAYA EMAS MELAYANG TERUS-MENERUS
    // =========================================================
    const sparkleTexture = createSparkleTexture();
    const particleCount = 85;

    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const driftOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15; // Sebar selebar lanskap
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8.5; // Tinggi layar
      positions[i * 3 + 2] = Math.random() * 4.5 + 0.5; // Kedalaman 3D di depan tebing & lembah

      speeds[i] = 0.14 + Math.random() * 0.24; // Kecepatan naik tiap partikel bervariasi
      driftOffsets[i] = Math.random() * Math.PI * 2; // Fase ayunan angin acak
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMat = new THREE.PointsMaterial({
      map: sparkleTexture,
      color: 0xffebb3,
      size: 0.14,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Efek pendar cahaya menyatu dengan sinar matahari
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 0.7;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * -0.4;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    const clock = new THREE.Clock();
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.elapsedTime;
      const p = progressRef.current;

      // Gerakan kamera meluncur ke Kubah Emas
      const targetZ = 7.2 - p * 3.6;
      const targetX = p * 2.45 + pointer.x;
      const targetY = p * 0.22 + pointer.y;

      const lookTargetX = p * 2.75 + pointer.x * 0.35;
      const lookTargetY = p * 0.28 + pointer.y * 0.35;

      const smoothSpeed = 6.5;
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetZ,
        smoothSpeed,
        delta,
      );
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetX,
        smoothSpeed,
        delta,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetY,
        smoothSpeed,
        delta,
      );

      currentLookAt.x = THREE.MathUtils.damp(
        currentLookAt.x,
        lookTargetX,
        smoothSpeed,
        delta,
      );
      currentLookAt.y = THREE.MathUtils.damp(
        currentLookAt.y,
        lookTargetY,
        smoothSpeed,
        delta,
      );
      camera.lookAt(currentLookAt);

      // Update tiap sparkle: melayang naik + bergoyang tertiup angin + recycle saat lewat batas atas
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const phase = driftOffsets[i];

        // Gerak naik perlahan + gelombang angin lembut ke kanan
        posArray[idx + 1] += speeds[i] * delta;
        posArray[idx] += Math.sin(elapsed * 0.65 + phase) * 0.18 * delta;

        // Jika partikel melewati batas atas layar, kembalikan ke bawah secara mulus
        if (posArray[idx + 1] > 4.4) {
          posArray[idx + 1] = -4.4;
          posArray[idx] = (Math.random() - 0.5) * 15;
        }
      }
      posAttr.needsUpdate = true;

      // Efek kelip lembut (breathing shimmer)
      particleMat.opacity = 0.65 + Math.sin(elapsed * 1.8) * 0.16;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      colorTexture.dispose();
      depthTexture.dispose();
      sparkleTexture.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colorMapSrc, depthMapSrc, progressRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-background/95 via-background/65 to-transparent" />
    </div>
  );
}
