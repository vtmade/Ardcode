import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Trail, Line, Text } from "@react-three/drei";
import * as THREE from "three";

function MoebiusStrip() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create Möbius strip geometry manually
  const geometry = useMemo(() => {
    const uSegments = 100;
    const vSegments = 20;
    const vertices = [];
    const indices = [];
    
    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = (i / uSegments) * 2 * Math.PI;
        const v = ((j / vSegments) - 0.5) * 2;
        
        const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u);
        const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u);
        const z = v / 2 * Math.sin(u / 2);
        
        vertices.push(x * 3, y * 3, z * 3);
        
        if (i < uSegments && j < vSegments) {
          const a = i * (vSegments + 1) + j;
          const b = i * (vSegments + 1) + j + 1;
          const c = (i + 1) * (vSegments + 1) + j + 1;
          const d = (i + 1) * (vSegments + 1) + j;
          
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.2;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#8b7355"
        transparent
        opacity={0.4}
        wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function InfiniteParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create particles along infinite paths
      const t = (i / count) * Math.PI * 4;
      const radius = 2 + Math.sin(t * 0.5) * 1;
      
      positions[i * 3] = Math.cos(t) * radius;
      positions[i * 3 + 1] = Math.sin(t * 2) * 2;
      positions[i * 3 + 2] = Math.sin(t) * radius;
      
      // Color based on position in loop
      const intensity = (Math.sin(t) + 1) * 0.5;
      colors[i * 3] = 0.5 + intensity * 0.3;
      colors[i * 3 + 1] = 0.4 + intensity * 0.2;
      colors[i * 3 + 2] = 0.2 + intensity * 0.4;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionsAttribute = particlesRef.current.geometry.attributes.position;
    
    for (let i = 0; i < 1000; i++) {
      const t = (i / 1000) * Math.PI * 4 + time * 0.5;
      const radius = 2 + Math.sin(t * 0.5) * 1;
      
      positionsAttribute.array[i * 3] = Math.cos(t) * radius;
      positionsAttribute.array[i * 3 + 1] = Math.sin(t * 2) * 2;
      positionsAttribute.array[i * 3 + 2] = Math.sin(t) * radius;
    }
    
    positionsAttribute.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={1000}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function RecursiveLines() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.z = time * 0.05;
  });

  // Generate recursive line patterns
  const linePoints = useMemo(() => {
    const generateFractal = (depth: number, length: number, angle: number): THREE.Vector3[] => {
      if (depth === 0) return [];
      
      const points: THREE.Vector3[] = [];
      const segments = 4;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = Math.cos(angle + t * Math.PI * 2) * length;
        const y = Math.sin(angle + t * Math.PI * 2) * length;
        const z = Math.sin(t * Math.PI * 4) * length * 0.3;
        
        points.push(new THREE.Vector3(x, y, z));
        
        if (depth > 1 && i < segments) {
          const subPoints = generateFractal(depth - 1, length * 0.6, angle + t * Math.PI);
          points.push(...subPoints.map(p => p.clone().add(new THREE.Vector3(x, y, z))));
        }
      }
      
      return points;
    };
    
    return generateFractal(3, 4, 0);
  }, []);

  return (
    <group ref={groupRef}>
      <Line
        points={linePoints}
        color="#8b7355"
        lineWidth={2}
        transparent
        opacity={0.6}
      />
    </group>
  );
}

function CodeLoop() {
  const textRef = useRef<THREE.Group>(null);
  
  const codeText = [
    "while (true) {",
    "  seek();",
    "  find();",
    "  lose();",
    "  begin();",
    "}"
  ];

  useFrame((state) => {
    if (!textRef.current) return;
    
    const time = state.clock.elapsedTime;
    textRef.current.position.y = Math.sin(time * 0.3) * 2;
    textRef.current.rotation.y = time * 0.1;
  });

  return (
    <group ref={textRef} position={[0, 6, 0]}>
      {codeText.map((line, index) => (
        <Text
          key={index}
          position={[0, -index * 0.6, 0]}
          fontSize={0.3}
          color="#c4b59a"
          anchorX="center"
          anchorY="middle"

        >
          {line}
        </Text>
      ))}
    </group>
  );
}

function InfinitySymbol() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.z = time * 0.2;
    
    // Breathing effect
    const breathe = Math.sin(time * 0.5) * 0.2 + 1;
    meshRef.current.scale.setScalar(breathe);
  });

  // Create infinity symbol curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, -1, 0),
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1, -1, 0),
      new THREE.Vector3(-2, 0, 0),
    ]);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.05, 8, true);
  }, [curve]);

  return (
    <mesh ref={meshRef} geometry={tubeGeometry} position={[0, -6, 0]}>
      <meshStandardMaterial
        color="#8b7355"
        emissive="#8b7355"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export default function Artwork06_InfiniteLoop() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#4a3f35" />
      
      <pointLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        color="#8b7355"
      />
      
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        color="#c4b59a"
        castShadow
      />

      {/* Main elements */}
      <MoebiusStrip />
      <InfiniteParticles />
      <RecursiveLines />
      <CodeLoop />
      <InfinitySymbol />

      {/* Floating meditation */}
      <Text
        position={[0, 0, 6]}
        fontSize={0.4}
        color="#c4b59a"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"

      >
        {"The path that can be traveled\nhas no beginning or end"}
      </Text>
    </>
  );
}
