import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";

function SacredGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate sacred geometric patterns
  const geometryData = useMemo(() => {
    const patterns = [];
    
    // Flower of Life pattern
    const flowerOfLife = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      
      flowerOfLife.push({
        position: [x, y, 0],
        radius: 1,
        segments: 32
      });
    }
    patterns.push({ name: 'flowerOfLife', circles: flowerOfLife });
    
    // Metatron's Cube vertices
    const metatronVertices = [
      [0, 0, 0],
      [2, 0, 0], [-2, 0, 0],
      [1, 1.732, 0], [-1, 1.732, 0],
      [1, -1.732, 0], [-1, -1.732, 0],
      [0, 0, 2], [0, 0, -2],
      [1.414, 0, 1.414], [-1.414, 0, 1.414],
      [1.414, 0, -1.414], [-1.414, 0, -1.414],
    ];
    patterns.push({ name: 'metatron', vertices: metatronVertices });
    
    return patterns;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Flower of Life circles */}
      {geometryData[0].circles.map((circle, index) => (
        <mesh key={`flower-${index}`} position={circle.position as [number, number, number]}>
          <ringGeometry args={[0.9, 1.1, circle.segments]} />
          <meshBasicMaterial 
            color="#8b7355" 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Central circle */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 32]} />
        <meshBasicMaterial 
          color="#c4b59a" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Metatron's Cube connections */}
      {geometryData[1].vertices.map((vertex, index) => (
        <group key={`vertex-${index}`}>
          <mesh position={vertex as [number, number, number]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#8b7355" />
          </mesh>
          
          {/* Connect to other vertices */}
          {geometryData[1].vertices.slice(index + 1).map((otherVertex, otherIndex) => (
            <Line
              key={`line-${index}-${otherIndex}`}
              points={[vertex, otherVertex]}
              color="#8b7355"
              transparent
              opacity={0.3}
              lineWidth={1}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function FibonacciSpiral() {
  const spiralRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!spiralRef.current) return;
    
    const time = state.clock.elapsedTime;
    spiralRef.current.rotation.z = time * 0.2;
  });

  // Generate Fibonacci spiral
  const spiralPoints = useMemo(() => {
    const points = [];
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    
    let angle = 0;
    let radius = 0;
    
    for (let i = 0; i < fibonacci.length; i++) {
      const fibValue = fibonacci[i];
      
      for (let j = 0; j < fibValue * 4; j++) {
        angle += 0.1;
        radius = angle * 0.1;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.sin(angle * 0.1) * 0.5;
        
        points.push(new THREE.Vector3(x, y, z));
      }
    }
    
    return points;
  }, []);

  return (
    <group position={[6, 0, 0]}>
      <Line
        ref={spiralRef}
        points={spiralPoints}
        color="#c4b59a"
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Golden ratio markers */}
      {[1, 1, 2, 3, 5, 8].map((fib, index) => (
        <Text
          key={index}
          position={[
            Math.cos(index * 1.618) * (index + 1),
            Math.sin(index * 1.618) * (index + 1),
            0
          ]}
          fontSize={0.3}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          {fib.toString()}
        </Text>
      ))}
    </group>
  );
}

function CodeMandala() {
  const mandalaRef = useRef<THREE.Group>(null);
  
  const codeSymbols = ['{}', '[]', '()', ';;', '//', '&&', '||', '==', '!=', '++'];
  
  useFrame((state) => {
    if (!mandalaRef.current) return;
    
    const time = state.clock.elapsedTime;
    mandalaRef.current.rotation.y = time * 0.15;
    
    // Breathing effect for individual symbols
    mandalaRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Group) {
        const breathe = Math.sin(time * 0.5 + index * 0.5) * 0.1 + 1;
        child.scale.setScalar(breathe);
      }
    });
  });

  return (
    <group ref={mandalaRef} position={[-6, 0, 0]}>
      {/* Inner ring of code symbols */}
      {codeSymbols.slice(0, 5).map((symbol, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 2;
        
        return (
          <group 
            key={`inner-${index}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}
          >
            <Text
              fontSize={0.4}
              color="#c4b59a"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {symbol}
            </Text>
          </group>
        );
      })}
      
      {/* Outer ring of code symbols */}
      {codeSymbols.slice(5).map((symbol, index) => {
        const angle = (index / 5) * Math.PI * 2 + Math.PI / 5;
        const radius = 4;
        
        return (
          <group 
            key={`outer-${index}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}
          >
            <Text
              fontSize={0.3}
              color="#8b7355"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {symbol}
            </Text>
          </group>
        );
      })}
      
      {/* Center symbol */}
      <Text
        fontSize={0.6}
        color="#d4c4a9"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        ∞
      </Text>
    </group>
  );
}

function GoldenRatioVisualization() {
  const rectanglesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!rectanglesRef.current) return;
    
    const time = state.clock.elapsedTime;
    rectanglesRef.current.rotation.z = time * 0.05;
  });

  // Generate golden ratio rectangles
  const rectangles = useMemo(() => {
    const phi = 1.618033988749;
    const rects = [];
    
    let size = 3;
    let rotation = 0;
    
    for (let i = 0; i < 8; i++) {
      rects.push({
        width: size,
        height: size / phi,
        rotation: rotation,
        position: [0, 0, i * 0.1]
      });
      
      size *= 0.618; // 1/phi
      rotation += Math.PI / 2;
    }
    
    return rects;
  }, []);

  return (
    <group ref={rectanglesRef} position={[0, -6, 0]}>
      {rectangles.map((rect, index) => (
        <mesh 
          key={index}
          position={rect.position as [number, number, number]}
          rotation={[0, 0, rect.rotation]}
        >
          <planeGeometry args={[rect.width, rect.height]} />
          <meshBasicMaterial 
            color="#8b7355" 
            transparent 
            opacity={0.3 - index * 0.03}
            wireframe={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Artwork09_SacredCode() {
  return (
    <>
      {/* Sacred lighting */}
      <ambientLight intensity={0.3} color="#4a3f35" />
      
      <pointLight 
        position={[0, 10, 5]} 
        intensity={0.8} 
        color="#c4b59a"
        castShadow
      />
      
      <pointLight 
        position={[-5, -5, 5]} 
        intensity={0.4} 
        color="#8b7355"
      />

      {/* Sacred geometry components */}
      <SacredGeometry />
      <FibonacciSpiral />
      <CodeMandala />
      <GoldenRatioVisualization />

      {/* Central wisdom text */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.4}
        color="#d4c4a9"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        textAlign="center"
        font="/fonts/inter.json"
      >
        {"As above, so below\nAs in mathematics, so in code\nAs in nature, so in algorithm"}
      </Text>

      {/* Mathematical constants */}
      <group position={[0, -8, 0]}>
        <Text
          position={[-3, 0, 0]}
          fontSize={0.3}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          π = 3.14159...
        </Text>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          φ = 1.618...
        </Text>
        
        <Text
          position={[3, 0, 0]}
          fontSize={0.3}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          e = 2.71828...
        </Text>
      </group>
    </>
  );
}
