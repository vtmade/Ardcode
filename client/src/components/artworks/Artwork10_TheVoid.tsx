import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

function VoidSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!sphereRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Subtle breathing effect
    const breathe = Math.sin(time * 0.3) * 0.05 + 1;
    sphereRef.current.scale.setScalar(breathe);
    
    // Gentle rotation
    sphereRef.current.rotation.y = time * 0.02;
    sphereRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    // Mouse interaction - gentle distortion
    if (hovered) {
      const mouse = state.mouse;
      sphereRef.current.rotation.y += mouse.x * 0.1;
      sphereRef.current.rotation.x += mouse.y * 0.1;
    }
  });

  return (
    <mesh
      ref={sphereRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={hovered ? 0.15 : 0.05}
        side={THREE.BackSide}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function FloatingDots() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate minimal floating points representing potential
  const dots = useMemo(() => {
    const dotData = [];
    for (let i = 0; i < 12; i++) {
      dotData.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002
      });
    }
    return dotData;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, index) => {
      const dot = dots[index];
      if (child instanceof THREE.Mesh) {
        // Gentle floating motion
        child.position.y = dot.position[1] + Math.sin(time * dot.speed + dot.phase) * 2;
        child.position.x = dot.position[0] + Math.cos(time * dot.speed * 0.7 + dot.phase) * 1;
        
        // Fade in and out
        const alpha = (Math.sin(time * 0.5 + dot.phase) + 1) * 0.3 + 0.1;
        (child.material as THREE.MeshBasicMaterial).opacity = alpha;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((dot, index) => (
        <mesh key={index} position={dot.position as [number, number, number]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial 
            color="#8b7355" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function VoidText() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!textRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Very subtle breathing
    const breathe = Math.sin(time * 0.2) * 0.02 + 1;
    textRef.current.scale.setScalar(breathe);
    
    // Fade in and out slowly
    const alpha = (Math.sin(time * 0.1) + 1) * 0.3 + 0.4;
    textRef.current.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.material) {
        (child.material as any).opacity = alpha;
      }
    });
  });

  return (
    <group ref={textRef}>
      {/* Central void wisdom */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#c4b59a"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
        
      >
        {"In emptiness,\nall possibilities exist"}
      </Text>
      
      {/* Code meditation */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.2}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        textAlign="center"
        
      >
        {"function void() {\n  return null;\n}\n\n// In nothingness,\n// everything begins"}
      </Text>
    </group>
  );
}

function MinimalGrid() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!linesRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Very subtle movement
    linesRef.current.rotation.y = time * 0.005;
    
    // Fade lines in and out
    linesRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.LineSegments) {
        const alpha = Math.sin(time * 0.1 + index * 0.5) * 0.1 + 0.1;
        (child.material as THREE.LineBasicMaterial).opacity = alpha;
      }
    });
  });

  // Create minimal grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const size = 10;
    const divisions = 5;
    
    for (let i = 0; i <= divisions; i++) {
      const position = (i / divisions - 0.5) * size;
      
      // Horizontal lines
      lines.push(
        new THREE.Vector3(-size/2, position, 0),
        new THREE.Vector3(size/2, position, 0)
      );
      
      // Vertical lines  
      lines.push(
        new THREE.Vector3(position, -size/2, 0),
        new THREE.Vector3(position, size/2, 0)
      );
    }
    
    return lines;
  }, []);

  return (
    <group ref={linesRef} position={[0, 0, -8]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={gridLines.length}
            array={new Float32Array(gridLines.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#8b7355" 
          transparent 
          opacity={0.1}
        />
      </lineSegments>
    </group>
  );
}

function VoidParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Very sparse particles representing quantum foam
  const particleData = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const material = particlesRef.current.material as THREE.PointsMaterial;
    
    // Barely visible, slowly pulsing
    material.opacity = Math.sin(time * 0.1) * 0.05 + 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particleData}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#8b7355"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Artwork10_TheVoid() {
  return (
    <>
      {/* Minimal lighting - mostly darkness */}
      <ambientLight intensity={0.05} color="#1a1a1a" />
      
      {/* Single point of light in the void */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.2} 
        color="#8b7355"
        distance={15}
        decay={2}
      />

      {/* Very subtle rim lighting */}
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.1} 
        color="#4a3f35"
        distance={20}
      />

      {/* The void itself */}
      <VoidSphere />
      
      {/* Minimal elements representing potential */}
      <FloatingDots />
      <VoidText />
      <MinimalGrid />
      <VoidParticles />

      {/* Meditation on emptiness */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.25}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        textAlign="center"
        
        transparent
        opacity={0.6}
      >
        {"Before the first line of code\nAfter the last commit\nIn the space between thoughts\nThe void remains"}
      </Text>

      {/* Zen symbol in the distance */}
      <Text
        position={[0, -6, -5]}
        fontSize={1}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
        
        transparent
        opacity={0.2}
      >
        ○
      </Text>
    </>
  );
}
