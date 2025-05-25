import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

function SacredGeometry({ position, rotation, scale }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = rotation[0] + time * 0.2;
    meshRef.current.rotation.y = rotation[1] + time * 0.3;
    meshRef.current.rotation.z = rotation[2] + time * 0.1;
    
    // Breathing effect
    const breathe = Math.sin(time * 0.5) * 0.1 + 1;
    meshRef.current.scale.setScalar(scale * breathe * (hovered ? 1.2 : 1));
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={hovered ? "#b8956a" : "#8b7355"}
        transparent
        opacity={0.7}
        wireframe={true}
      />
    </mesh>
  );
}

function InterconnectedNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const nodes = [
    { pos: [-4, 2, 0], label: "Observer" },
    { pos: [0, 3, -2], label: "Pattern" },
    { pos: [4, 1, 1], label: "Code" },
    { pos: [-2, -2, 2], label: "Reality" },
    { pos: [2, -1, -3], label: "Void" },
  ];

  useFrame((state) => {
    if (!groupRef.current || !lineRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1;
    
    // Animate connection lines
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity = (Math.sin(time * 2) + 1) * 0.3 + 0.2;
  });

  // Create connection lines between nodes
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions: number[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      linePositions.push(...nodes[i].pos, ...nodes[j].pos);
    }
  }
  
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#8b7355" 
          transparent 
          opacity={0.3}
        />
      </lineSegments>
      
      {/* Node spheres and labels */}
      {nodes.map((node, index) => (
        <group key={index} position={node.pos as [number, number, number]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#8b7355" 
                emissive="#8b7355" 
                emissiveIntensity={0.3}
              />
            </mesh>
            
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.3}
              color="#c4b59a"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {node.label}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}

function PhilosophicalShapes() {
  return (
    <group>
      {/* Platonic solids representing fundamental forms */}
      <SacredGeometry position={[-6, 2, -3]} rotation={[0, 0, 0]} scale={0.8} />
      <SacredGeometry position={[6, -1, 2]} rotation={[1, 0, 0]} scale={1.2} />
      <SacredGeometry position={[0, 4, -5]} rotation={[0, 1, 0]} scale={0.6} />
      <SacredGeometry position={[-3, -3, 4]} rotation={[1, 1, 0]} scale={1.0} />
      <SacredGeometry position={[5, 3, -1]} rotation={[0, 0, 1]} scale={0.9} />
    </group>
  );
}

function AmbientOrbs() {
  const orbsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbsRef.current) return;
    
    const time = state.clock.elapsedTime;
    orbsRef.current.children.forEach((child, index) => {
      child.position.x = Math.sin(time * 0.3 + index) * 8;
      child.position.y = Math.cos(time * 0.2 + index) * 5;
      child.position.z = Math.sin(time * 0.4 + index * 2) * 6;
    });
  });

  return (
    <group ref={orbsRef}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#8b7355" 
            transparent 
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Artwork04_FloatingGeometry() {
  return (
    <>
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.3} color="#4a3f35" />
      
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.8} 
        color="#8b7355"
        castShadow
      />
      
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.4} 
        color="#5a4d42"
      />

      {/* Main geometric elements */}
      <PhilosophicalShapes />
      
      {/* Interconnected network */}
      <InterconnectedNodes />
      
      {/* Ambient floating orbs */}
      <AmbientOrbs />

      {/* Central meditation text */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={1}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#c4b59a"
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          textAlign="center"
          font="/fonts/inter.json"
        >
          {"Form is emptiness\nEmptiness is form"}
        </Text>
      </Float>
    </>
  );
}
