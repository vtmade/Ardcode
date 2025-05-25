import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);

  // Generate particles representing "the ten thousand things"
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const colors = new Float32Array(3000 * 3);
    
    for (let i = 0; i < 3000; i++) {
      // Create galaxy spiral pattern
      const radius = Math.random() * 15 + 2;
      const angle = Math.random() * Math.PI * 4;
      const height = (Math.random() - 0.5) * 8;
      
      positions[i * 3] = Math.cos(angle) * radius + Math.random() * 2 - 1;
      positions[i * 3 + 1] = height + Math.sin(angle * 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius + Math.random() * 2 - 1;
      
      // Color gradient from center
      const distance = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);
      const colorIntensity = Math.max(0.2, 1 - distance / 15);
      
      colors[i * 3] = 0.5 + colorIntensity * 0.3; // R
      colors[i * 3 + 1] = 0.4 + colorIntensity * 0.2; // G
      colors[i * 3 + 2] = 0.2 + colorIntensity * 0.4; // B
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate the entire galaxy
    pointsRef.current.rotation.y = time * 0.1;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    // Mouse interaction
    const mouse = state.mouse;
    const influence = hovered ? 2 : 1;
    
    pointsRef.current.rotation.y += mouse.x * 0.5 * influence;
    pointsRef.current.rotation.x += mouse.y * 0.3 * influence;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particlePositions.positions}
      colors={particlePositions.colors}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <PointMaterial
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingQuotes() {
  const quotes = [
    "The ten thousand things",
    "Empty yet full",
    "One becomes two",
    "Two becomes three",
    "Three becomes all"
  ];

  return (
    <group>
      {quotes.map((quote, index) => (
        <FloatingText
          key={index}
          text={quote}
          position={[
            Math.sin(index * 2) * 8,
            Math.cos(index * 1.5) * 4,
            Math.sin(index * 3) * 6
          ]}
          rotation={[0, index * 0.5, 0]}
        />
      ))}
    </group>
  );
}

function FloatingText({ text, position, rotation }: { 
  text: string; 
  position: [number, number, number]; 
  rotation: [number, number, number] 
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.5;
    meshRef.current.rotation.y = rotation[1] + time * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[2, 0.3]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.7} 
        color="#8b7355"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Artwork02_ParticleGalaxy() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#4a4a4a" />
      
      {/* Point light at center */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={1} 
        color="#8b7355"
        distance={20}
        decay={2}
      />
      
      {/* Particle galaxy */}
      <ParticleField />
      
      {/* Floating philosophical texts */}
      <FloatingQuotes />
      
      {/* Central void sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.1} 
          color="#000000"
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
