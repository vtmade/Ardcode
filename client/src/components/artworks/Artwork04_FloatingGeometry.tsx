import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Artwork04_FloatingGeometry() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mothsRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Soft ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
    scene.add(ambientLight);

    // Create light sources that moths are drawn to
    const lightSources = [
      new THREE.Vector3(5, 3, 2),
      new THREE.Vector3(-4, -2, 6),
      new THREE.Vector3(2, -5, -3)
    ];

    // Mouse/touch interaction for creating new light sources
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    function onPointerMove(event: PointerEvent) {
      // Calculate normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onPointerClick(event: PointerEvent) {
      // Convert mouse position to 3D world coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Create new light source at clicked position in 3D space
      const distance = 5; // Distance from camera
      const worldPosition = new THREE.Vector3();
      worldPosition.copy(raycaster.ray.direction).multiplyScalar(distance).add(camera.position);
      
      // Add new light source
      lightSources.push(worldPosition);
      
      // Add visual representation of new light
      const light = new THREE.PointLight(0xffffff, 0.5, 10);
      light.position.copy(worldPosition);
      scene.add(light);

      const glowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffaa, 
        transparent: true, 
        opacity: 0.8 
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(worldPosition);
      scene.add(glow);
      
      // Add gentle pulsing animation to new light
      const originalScale = glow.scale.clone();
      let pulsePhase = 0;
      const pulseAnimation = () => {
        pulsePhase += 0.1;
        const pulse = 1 + Math.sin(pulsePhase) * 0.3;
        glow.scale.copy(originalScale).multiplyScalar(pulse);
        glow.material.opacity = 0.6 + Math.sin(pulsePhase) * 0.2;
      };
      
      // Store animation function for cleanup if needed
      (glow as any).pulseAnimation = pulseAnimation;

      // Remove oldest light sources if too many (keep maximum 8)
      if (lightSources.length > 8) {
        lightSources.shift();
        // Find and remove oldest light from scene
        scene.children.forEach(child => {
          if (child instanceof THREE.PointLight && child !== light) {
            scene.remove(child);
            return;
          }
        });
      }
    }

    // Add point lights at light sources
    lightSources.forEach(pos => {
      const light = new THREE.PointLight(0xffffff, 0.5, 10);
      light.position.copy(pos);
      scene.add(light);

      // Visual representation of light source
      const glowGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.6 
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(pos);
      scene.add(glow);
    });

    // Create Digital Moths
    class DigitalMoth {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      wingPhase: number;
      wingSpeed: number;
      maxSpeed: number;
      mesh: THREE.Mesh;

      constructor() {
        this.position = new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        
        this.velocity = new THREE.Vector3();
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.1 + Math.random() * 0.05;
        this.maxSpeed = 0.02;
        
        // Create delicate wing geometry
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(1.5, 0.8, 2, 0);
        shape.quadraticCurveTo(1.5, -0.3, 0, 0);
        
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshLambertMaterial({
          color: 0xf8f8ff,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.setScalar(0.6);
        
        // Add second wing
        const wing2 = this.mesh.clone();
        wing2.scale.x = -0.6;
        wing2.scale.y = 0.6;
        wing2.scale.z = 0.6;
        this.mesh.add(wing2);
        
        scene.add(this.mesh);
      }

      seekLight(lightPositions: THREE.Vector3[]) {
        // Find nearest light
        let closestLight = lightPositions[0];
        let minDistance = this.position.distanceTo(closestLight);
        
        lightPositions.forEach(light => {
          const distance = this.position.distanceTo(light);
          if (distance < minDistance) {
            minDistance = distance;
            closestLight = light;
          }
        });

        // Spiral approach - never quite arriving
        const direction = closestLight.clone().sub(this.position);
        const distance = direction.length();
        
        if (distance > 1) {
          direction.normalize().multiplyScalar(0.02);
          
          // Add orbital component for spiraling
          const perpendicular = new THREE.Vector3()
            .crossVectors(direction, new THREE.Vector3(0, 1, 0))
            .normalize()
            .multiplyScalar(0.015);
          
          this.velocity.add(direction).add(perpendicular);
        }
        
        // Limit speed for graceful movement
        if (this.velocity.length() > this.maxSpeed) {
          this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }
        
        this.velocity.multiplyScalar(0.95); // Gentle dampening
        this.position.add(this.velocity);
      }

      flutter() {
        this.wingPhase += this.wingSpeed;
        const flutter = Math.sin(this.wingPhase) * 0.3;
        
        this.mesh.position.copy(this.position);
        this.mesh.rotation.z = flutter;
        
        // Orient towards movement direction
        if (this.velocity.length() > 0.001) {
          const lookTarget = this.position.clone().add(this.velocity);
          this.mesh.lookAt(lookTarget);
        }
        
        // Wing beat affects scale slightly
        const wingBeat = 1 + Math.sin(this.wingPhase * 2) * 0.1;
        this.mesh.scale.y = 0.6 * wingBeat;
      }
    }

    // Create moths
    const mothCount = 15;
    const moths: DigitalMoth[] = [];
    
    for (let i = 0; i < mothCount; i++) {
      moths.push(new DigitalMoth());
    }
    mothsRef.current = moths;

    // Add event listeners for interaction
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerClick);
    renderer.domElement.style.cursor = 'crosshair';

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      moths.forEach(moth => {
        moth.seekLight(lightSources);
        moth.flutter();
      });

      // Animate interactive lights (pulsing effect)
      scene.children.forEach(child => {
        if ((child as any).pulseAnimation) {
          (child as any).pulseAnimation();
        }
      });

      // Gentle camera movement
      const time = Date.now() * 0.0005;
      camera.position.x = Math.sin(time) * 2;
      camera.position.y = Math.cos(time * 0.7) * 1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Remove interaction event listeners
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerClick);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Cleanup
      moths.forEach(moth => {
        scene.remove(moth.mesh);
        moth.mesh.geometry.dispose();
        if (Array.isArray(moth.mesh.material)) {
          moth.mesh.material.forEach(mat => mat.dispose());
        } else {
          moth.mesh.material.dispose();
        }
      });
      
      renderer.dispose();
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      style={{ 
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#0a0a0f'
      }}
    />
  );
}
