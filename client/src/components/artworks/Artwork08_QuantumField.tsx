import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { Points, PointMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

function QuantumParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Generate quantum field particles
  const { positions, colors, velocities } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Quantum field distribution
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Quantum state colors (probability amplitudes)
      const quantum = Math.random();
      colors[i * 3] = quantum; // Red - excited state
      colors[i * 3 + 1] = 1 - quantum; // Green - ground state  
      colors[i * 3 + 2] = Math.sin(quantum * Math.PI); // Blue - superposition
      
      // Quantum fluctuations
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, colors, velocities };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionsAttribute = pointsRef.current.geometry.attributes.position;
    const colorsAttribute = pointsRef.current.geometry.attributes.color;
    
    // Observer effect - mouse interaction collapses wave function
    const observerX = state.mouse.x * 10;
    const observerY = state.mouse.y * 10;
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      
      // Current position
      let x = positionsAttribute.array[i3];
      let y = positionsAttribute.array[i3 + 1];
      let z = positionsAttribute.array[i3 + 2];
      
      // Quantum wave function
      const waveX = Math.sin(time * 0.5 + x * 0.1) * 0.5;
      const waveY = Math.cos(time * 0.3 + y * 0.1) * 0.5;
      const waveZ = Math.sin(time * 0.7 + z * 0.1) * 0.5;
      
      // Observer effect - collapse wave function near mouse
      const distanceToObserver = Math.sqrt(
        (x - observerX) ** 2 + (y - observerY) ** 2
      );
      
      const collapseRadius = 3;
      const collapseStrength = Math.max(0, 1 - distanceToObserver / collapseRadius);
      
      // Apply quantum effects
      x += velocities[i3] + waveX * (1 - collapseStrength);
      y += velocities[i3 + 1] + waveY * (1 - collapseStrength);
      z += velocities[i3 + 2] + waveZ * (1 - collapseStrength);
      
      // Quantum tunneling - particles can teleport
      if (Math.random() < 0.001) {
        x = (Math.random() - 0.5) * 20;
        y = (Math.random() - 0.5) * 20;
        z = (Math.random() - 0.5) * 20;
      }
      
      // Boundary conditions
      if (Math.abs(x) > 10) x *= -0.9;
      if (Math.abs(y) > 10) y *= -0.9;
      if (Math.abs(z) > 10) z *= -0.9;
      
      positionsAttribute.array[i3] = x;
      positionsAttribute.array[i3 + 1] = y;
      positionsAttribute.array[i3 + 2] = z;
      
      // Update color based on quantum state
      const energyLevel = Math.sin(time + distanceToObserver) * 0.5 + 0.5;
      colorsAttribute.array[i3] = energyLevel * 0.8 + 0.2; // R
      colorsAttribute.array[i3 + 1] = (1 - energyLevel) * 0.6 + 0.4; // G
      colorsAttribute.array[i3 + 2] = collapseStrength * 0.9 + 0.1; // B
    }
    
    positionsAttribute.needsUpdate = true;
    colorsAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={2000}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WaveFunction() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
    const positionAttribute = geometry.attributes.position;
    
    // Update wave function vertices
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      
      const wave1 = Math.sin(x * 0.5 + time) * 0.5;
      const wave2 = Math.cos(y * 0.3 + time * 0.7) * 0.3;
      const interference = Math.sin(x * 0.2 + y * 0.2 + time * 0.5) * 0.2;
      
      positionAttribute.setZ(i, wave1 + wave2 + interference);
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color="#8b7355"
        transparent
        opacity={0.3}
        wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ProbabilityDensity() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1;
    
    // Update probability clouds
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        const scale = Math.abs(Math.sin(time * 0.5 + index)) * 0.5 + 0.5;
        child.scale.setScalar(scale);
        
        // Quantum superposition
        child.material.opacity = scale * 0.3;
      }
    });
  });

  // Create probability density clouds
  const orbitalShapes = useMemo(() => {
    const shapes = [];
    
    // S orbital
    shapes.push({
      geometry: new THREE.SphereGeometry(1, 16, 16),
      position: [0, 2, 0],
      color: "#8b7355"
    });
    
    // P orbitals
    for (let i = 0; i < 3; i++) {
      shapes.push({
        geometry: new THREE.CapsuleGeometry(0.3, 2, 8, 16),
        position: [
          Math.cos(i * Math.PI * 2 / 3) * 3,
          0,
          Math.sin(i * Math.PI * 2 / 3) * 3
        ],
        color: "#a68b5b",
        rotation: [0, i * Math.PI * 2 / 3, Math.PI / 2]
      });
    }
    
    return shapes;
  }, []);

  return (
    <group ref={groupRef}>
      {orbitalShapes.map((shape, index) => (
        <mesh
          key={index}
          geometry={shape.geometry}
          position={shape.position as [number, number, number]}
          rotation={shape.rotation as [number, number, number] || [0, 0, 0]}
        >
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function QuantumEquations() {
  const equations = [
    "Ψ(x,t) = A e^(i(kx-ωt))",
    "ΔxΔp ≥ ℏ/2",
    "Ĥ|ψ⟩ = E|ψ⟩",
    "|ψ⟩ = α|0⟩ + β|1⟩"
  ];

  return (
    <group>
      {equations.map((equation, index) => (
        <Text
          key={index}
          position={[
            Math.sin(index * Math.PI / 2) * 8,
            4 + Math.cos(index * Math.PI / 3) * 2,
            Math.cos(index * Math.PI / 2) * 8
          ]}
          fontSize={0.3}
          color="#c4b59a"
          anchorX="center"
          anchorY="middle"

        >
          {equation}
        </Text>
      ))}
    </group>
  );
}

export default function Artwork08_QuantumField() {
  return (
    <>
      {/* Quantum lighting */}
      <ambientLight intensity={0.1} color="#2a2a4a" />
      
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        color="#8b7355"
        distance={15}
      />
      
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.3}
        color="#a68b5b"
      />

      {/* Quantum field components */}
      <QuantumParticles />
      <WaveFunction />
      <ProbabilityDensity />
      <QuantumEquations />

      {/* Observer consciousness */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.4}
        color="#c4b59a"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        textAlign="center"
        font="/fonts/inter.json"
      >
        {"The act of observation\ncollapses infinite possibilities\ninto singular reality"}
      </Text>
    </>
  );
}
