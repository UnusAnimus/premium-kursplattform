'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Slowly-rotating sacred-geometry icosahedron ── */
function CrystalSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.04;
      meshRef.current.rotation.y = t * 0.06;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.03;
      innerRef.current.rotation.y = -t * 0.05;
    }
  });

  return (
    <group position={[1.2, 0.2, -2]}>
      {/* Outer wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial
          color="#c9a84c"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Inner solid */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#1a0844"
          emissive="#3d1a8a"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#c9a84c"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ── Orbiting ring ── */
function OrbitalRing({ radius, tilt, speed, color, opacity }: {
  radius: number; tilt: number; speed: number; color: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]} position={[1.2, 0.2, -2]}>
      <torusGeometry args={[radius, 0.008, 12, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Floating particle field ── */
function StarField() {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
      sizes[i] = Math.random() * 1.5 + 0.3;
    }
    return { positions, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.008;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.004) * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e8d5a3"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.55}
        fog={false}
      />
    </points>
  );
}

/* ── Atmospheric nebula spheres ── */
function NebulaSphere({ position, radius, color, opacity }: {
  position: [number, number, number]; radius: number; color: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.003 + Math.random() * 0.004, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * speed;
      const mat = Array.isArray(ref.current.material)
        ? ref.current.material[0]
        : ref.current.material;
      if (mat && 'opacity' in mat) {
        (mat as THREE.MeshBasicMaterial).opacity = opacity + Math.sin(clock.elapsedTime * 0.5) * 0.02;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.BackSide} />
    </mesh>
  );
}

/* ── Main scene ── */
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#c9a84c" />
      <pointLight position={[-4, 3, 2]} intensity={1.2} color="#c9a84c" distance={12} />
      <pointLight position={[6, -2, -3]} intensity={0.8} color="#7c3aed" distance={14} />
      <pointLight position={[0, 6, -5]} intensity={0.5} color="#ffffff" distance={16} />

      {/* Main crystal */}
      <CrystalSphere />

      {/* Orbital rings */}
      <OrbitalRing radius={3.6} tilt={0.5}  speed={0.05}  color="#c9a84c" opacity={0.22} />
      <OrbitalRing radius={4.4} tilt={1.1}  speed={-0.03} color="#a78bfa" opacity={0.14} />
      <OrbitalRing radius={5.2} tilt={0.8}  speed={0.02}  color="#e8d5a3" opacity={0.08} />

      {/* Nebula atmosphere */}
      <NebulaSphere position={[1.2, 0.2, -2]}  radius={5}  color="#3d1a8a" opacity={0.06} />
      <NebulaSphere position={[-2,   1,   -5]}  radius={6}  color="#1a0844" opacity={0.08} />
      <NebulaSphere position={[4,   -1,   -6]}  radius={4}  color="#7c3aed" opacity={0.04} />

      {/* Particle field */}
      <StarField />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  );
}
