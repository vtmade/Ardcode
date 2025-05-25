export interface Artwork {
  title: string;
  type: "2D" | "3D";
  technique: string;
  philosophy: string;
  description: string;
  codeSnippet?: string;
}

export const ARTWORKS: Artwork[] = [
  {
    title: "Flowing Text",
    type: "2D",
    technique: "p5.js Particle System",
    philosophy: "The code that can be named is not the eternal code",
    description:
      "Watch as philosophical text flows like water, responding to your touch with ripples of understanding.",
    codeSnippet: `class TextParticle {
  constructor(char, x, y) {
    this.char = char;
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.alpha = 255;
  }

  drift() {
    // Like the Tao, text seeks its natural path
    this.x += this.vx + sin(frameCount * 0.01) * 0.3;
    this.y += this.vy + cos(frameCount * 0.008) * 0.2;

    // Return to source, like water to the sea
    this.x = lerp(this.x, this.originalX, 0.02);
    this.y = lerp(this.y, this.originalY, 0.02);
  }

  display() {
    fill(50, this.alpha);
    text(this.char, this.x, this.y);
  }
}`,
  },
  {
    title: "Particle Galaxy",
    type: "3D",
    technique: "Three.js Point Cloud",
    philosophy: "The ten thousand things arise from emptiness",
    description:
      "Navigate through a galaxy of particles representing the infinite manifestations of the Tao.",
    codeSnippet: `// Create the universe from emptiness
const particleCount = 10000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  // Each particle is born from the void
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const radius = Math.random() * 50;

  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = radius * Math.cos(phi);

  // Color flows like energy through the cosmos
  const hue = (Math.atan2(positions[i * 3 + 1], positions[i * 3]) + Math.PI) / (2 * Math.PI);
  colors[i * 3] = hue;
  colors[i * 3 + 1] = 0.7;
  colors[i * 3 + 2] = 0.8;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.02,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);`,
  },
  {
    title: "Code Ripples",
    type: "2D",
    technique: "p5.js Wave Simulation",
    philosophy: "Every action creates ripples across the digital pond",
    description:
      "Touch creates ripples that distort code, showing how observation changes reality.",
    codeSnippet: `let ripples = [];
let codeText = "function wisdom() { return silence(); }";

function mousePressed() {
  ripples.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    amplitude: 50,
    life: 1.0
  });
}

function draw() {
  background(5, 15, 25);

  // Draw code with ripple distortion
  textAlign(CENTER, CENTER);
  textSize(24);

  for (let i = 0; i < codeText.length; i++) {
    let charX = width/2 + (i - codeText.length/2) * 20;
    let charY = height/2;

    // Each character is touched by all ripples
    for (let ripple of ripples) {
      let distance = dist(charX, charY, ripple.x, ripple.y);
      if (distance < ripple.radius) {
        let influence = sin(distance * 0.1 - ripple.radius * 0.05);
        charY += influence * ripple.amplitude * ripple.life;
      }
    }

    fill(100, 150, 255, 200);
    text(codeText.charAt(i), charX, charY);
  }

  // Update ripples - they fade like all things
  ripples = ripples.filter(ripple => {
    ripple.radius += 3;
    ripple.life *= 0.98;
    ripple.amplitude *= 0.99;
    return ripple.life > 0.01;
  });
}`,
  },
  {
    title: "Floating Geometry",
    type: "3D",
    technique: "Three.js Sacred Forms",
    philosophy: "Form is emptiness, emptiness is form",
    description:
      "Platonic solids float in meditative space, connected by invisible threads of meaning.",
    codeSnippet: `// Create sacred forms in the void
const sacredForms = [];
const formTypes = [
  new THREE.TetrahedronGeometry(1),
  new THREE.OctahedronGeometry(1),
  new THREE.IcosahedronGeometry(1),
  new THREE.DodecahedronGeometry(1)
];

for (let i = 0; i < 12; i++) {
  const geometry = formTypes[i % formTypes.length];
  const material = new THREE.MeshStandardMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    color: new THREE.Color().setHSL(i / 12, 0.6, 0.8)
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Position in golden ratio spiral
  const phi = 1.618033988749;
  const angle = i * phi * Math.PI * 2;
  const radius = Math.sqrt(i) * 3;

  mesh.position.x = Math.cos(angle) * radius;
  mesh.position.y = (i - 6) * 2;
  mesh.position.z = Math.sin(angle) * radius;

  // Each form rotates according to its nature
  mesh.userData = { 
    rotationSpeed: (i + 1) * 0.01,
    floatOffset: i * 0.5 
  };

  sacredForms.push(mesh);
  scene.add(mesh);
}

// In the animation loop:
function animate() {
  sacredForms.forEach((form, i) => {
    form.rotation.x += form.userData.rotationSpeed;
    form.rotation.y += form.userData.rotationSpeed * 0.7;

    // Gentle floating like breath
    form.position.y += Math.sin(Date.now() * 0.001 + form.userData.floatOffset) * 0.02;
  });
}`,
  },
  {
    title: "Breathing Mandala",
    type: "2D",
    technique: "p5.js Generative Art",
    philosophy: "Breathe in code, breathe out wisdom",
    description:
      "A living mandala that breathes with the rhythm of meditation, expanding and contracting like consciousness itself.",
    codeSnippet: `function drawBreathingMandala() {
  push();
  translate(width/2, height/2);

  // The breath of the universe
  let breathPhase = sin(frameCount * 0.02);
  let expansion = map(breathPhase, -1, 1, 0.8, 1.2);

  scale(expansion);

  // Draw layers of consciousness
  for (let layer = 0; layer < 7; layer++) {
    push();

    let layerRadius = 50 + layer * 40;
    let petals = 6 + layer * 2;

    // Each layer breathes at its own frequency
    let layerBreath = sin(frameCount * 0.02 + layer * 0.5);
    rotate(layerBreath * 0.1);

    // Draw the petals of awareness
    for (let i = 0; i < petals; i++) {
      let angle = TWO_PI / petals * i;
      let x = cos(angle) * layerRadius;
      let y = sin(angle) * layerRadius;

      push();
      translate(x, y);
      rotate(angle + frameCount * 0.01);

      // Each petal glows with inner light
      let hue = (layer * 30 + i * 10 + frameCount * 0.5) % 360;
      fill(hue, 60, 90, 150);
      noStroke();

      // The shape emerges from breath
      let petalSize = 20 * (1 + layerBreath * 0.3);
      ellipse(0, 0, petalSize, petalSize * 2);

      pop();
    }

    pop();
  }

  pop();
}`,
  },
  {
    title: "Infinite Loop",
    type: "3D",
    technique: "Three.js Möbius Strip",
    philosophy: "The path that can be traveled has no beginning or end",
    description:
      "Journey along impossible geometries where ending becomes beginning in eternal recursion.",
    codeSnippet: `// Create the path of eternal return
function createMobiusStrip(radius = 10, width = 4, segments = 100) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments * Math.PI * 2; // 0 to 2π

    for (let j = 0; j <= 10; j++) {
      const v = (j / 10 - 0.5) * width; // -width/2 to width/2

      // The Möbius transformation - half twist in the loop
      const x = (radius + v * Math.cos(u / 2)) * Math.cos(u);
      const y = (radius + v * Math.cos(u / 2)) * Math.sin(u);
      const z = v * Math.sin(u / 2);

      vertices.push(x, y, z);

      // Connect the path
      if (i < segments && j < 10) {
        const a = i * 11 + j;
        const b = a + 11;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x4444ff,
    wireframe: false,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}

// The eternal journey
let travelerPosition = 0;
function animateEternalJourney() {
  travelerPosition += 0.01;
  if (travelerPosition > Math.PI * 2) {
    travelerPosition = 0; // Beginning becomes ending becomes beginning
  }

  // A light travels the infinite path
  const lightRadius = 10;
  const lightX = lightRadius * Math.cos(travelerPosition);
  const lightY = lightRadius * Math.sin(travelerPosition);
  const lightZ = 2 * Math.sin(travelerPosition / 2);

  pointLight.position.set(lightX, lightY, lightZ);
}`,
  },
  {
    title: "Nature's Code",
    type: "2D",
    technique: "p5.js L-Systems",
    philosophy: "Nature is the first programmer",
    description:
      "Watch trees grow according to algorithmic rules, as code rain falls from digital skies.",
    codeSnippet: `class LSystem {
  constructor(axiom, rules) {
    this.axiom = axiom;
    this.rules = rules;
    this.generation = 0;
    this.current = axiom;
  }

  generate() {
    this.generation++;
    let next = "";

    for (let char of this.current) {
      if (this.rules[char]) {
        next += this.rules[char];
      } else {
        next += char;
      }
    }

    this.current = next;
  }

  render(x, y, angle, length) {
    push();
    translate(x, y);
    rotate(angle);

    let stack = [];
    let currentAngle = 0;

    for (let char of this.current) {
      switch(char) {
        case 'F': // Draw forward
          stroke(34, 139, 34, 200);
          strokeWeight(map(length, 1, 100, 0.5, 3));
          line(0, 0, length, 0);
          translate(length, 0);
          break;

        case '+': // Turn right
          currentAngle += PI / 6;
          rotate(PI / 6);
          break;

        case '-': // Turn left
          currentAngle -= PI / 6;
          rotate(-PI / 6);
          break;

        case '[': // Save state
          stack.push({
            x: 0, y: 0,
            angle: currentAngle
          });
          push();
          break;

        case ']': // Restore state
          pop();
          if (stack.length > 0) {
            let state = stack.pop();
            currentAngle = state.angle;
          }
          break;
      }
    }

    pop();
  }
}

// The tree of knowledge grows
let tree = new LSystem("F", {
  "F": "F[+F]F[-F]F"
});

function setup() {
  createCanvas(800, 600);
  background(5, 15, 25);
}

function draw() {
  background(5, 15, 25, 10); // Gentle fade

  // Grow the tree over time
  if (frameCount % 120 === 0 && tree.generation < 5) {
    tree.generate();
  }

  // Draw the tree
  tree.render(width/2, height - 50, -PI/2, 8);

  // Code rain falls from the digital sky
  drawCodeRain();
}`,
  },
  {
    title: "Quantum Field",
    type: "3D",
    technique: "Three.js Particle Physics",
    philosophy:
      "Observation collapses infinite possibilities into singular reality",
    description:
      "Explore quantum mechanics through interactive particles that exist in superposition until observed.",
    codeSnippet: `class QuantumParticle {
  constructor(x, y, z) {
    this.position = new THREE.Vector3(x, y, z);
    this.superposition = [];
    this.isObserved = false;
    this.waveFunction = 0;

    // Create multiple potential positions
    for (let i = 0; i < 8; i++) {
      this.superposition.push(new THREE.Vector3(
        x + (Math.random() - 0.5) * 10,
        y + (Math.random() - 0.5) * 10,
        z + (Math.random() - 0.5) * 10
      ));
    }
  }

  update(observerPosition) {
    this.waveFunction += 0.1;

    // Check if particle is being observed
    const distance = this.position.distanceTo(observerPosition);
    this.isObserved = distance < 15;

    if (this.isObserved) {
      // Wave function collapse - choose one reality
      if (this.superposition.length > 1) {
        const chosen = Math.floor(Math.random() * this.superposition.length);
        this.position.copy(this.superposition[chosen]);
        this.superposition = [this.position.clone()];
      }
    } else {
      // Exist in superposition - quantum fluctuation
      if (this.superposition.length === 1) {
        // Return to multiple possibilities
        for (let i = 0; i < 8; i++) {
          this.superposition.push(new THREE.Vector3(
            this.position.x + (Math.random() - 0.5) * 10,
            this.position.y + (Math.random() - 0.5) * 10,
            this.position.z + (Math.random() - 0.5) * 10
          ));
        }
      }

      // Wave-like motion through possibilities
      const avgPos = new THREE.Vector3();
      this.superposition.forEach(pos => avgPos.add(pos));
      avgPos.divideScalar(this.superposition.length);

      avgPos.x += Math.sin(this.waveFunction) * 2;
      avgPos.y += Math.cos(this.waveFunction * 1.3) * 2;
      avgPos.z += Math.sin(this.waveFunction * 0.7) * 2;

      this.position.copy(avgPos);
    }
  }

  render(scene) {
    if (this.isObserved) {
      // Solid particle - reality crystallized
      const geometry = new THREE.SphereGeometry(0.2);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        emissive: 0x441111
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(this.position);
      return mesh;
    } else {
      // Probability cloud - all possibilities at once
      const geometry = new THREE.SphereGeometry(0.5);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.3,
        emissive: 0x111144
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(this.position);
      return mesh;
    }
  }
}`,
  },
  {
    title: "Sacred Code",
    type: "3D",
    technique: "Three.js Sacred Geometry",
    philosophy: "As above, so below - as in mathematics, so in code",
    description:
      "Sacred geometric patterns merge with programming symbols in divine mathematical harmony.",
    codeSnippet: `// The golden ratio - nature's own constant
const PHI = 1.618033988749;

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Create the flower of life in 3D space
function createFlowerOfLife() {
  const group = new THREE.Group();
  const radius = 3;

  // Seven circles - the seed of life
  for (let i = 0; i < 7; i++) {
    const geometry = new THREE.TorusGeometry(radius, 0.1, 16, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(i / 7, 0.7, 0.8),
      transparent: true,
      opacity: 0.8
    });

    const torus = new THREE.Mesh(geometry, material);

    if (i === 0) {
      // Center circle
      torus.position.set(0, 0, 0);
    } else {
      // Surrounding circles in perfect harmony
      const angle = (i - 1) * Math.PI / 3;
      torus.position.x = Math.cos(angle) * radius;
      torus.position.y = Math.sin(angle) * radius;
      torus.position.z = 0;
    }

    group.add(torus);
  }

  return group;
}

// Fibonacci spiral in space
function createFibonacciSpiral() {
  const curve = new THREE.CatmullRomCurve3([]);
  const points = [];

  for (let i = 0; i < 50; i++) {
    const fib = fibonacci(i % 10 + 1);
    const angle = i * PHI;
    const radius = fib * 0.5;

    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      i * 0.2
    ));
  }

  curve.points = points;

  const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0x332200
  });

  return new THREE.Mesh(geometry, material);
}

// The recursive nature of reality
function fractalTree(position, direction, length, depth) {
  if (depth === 0) return [];

  const branches = [];
  const endPosition = position.clone().add(
    direction.clone().multiplyScalar(length)
  );

  // Create the branch
  const geometry = new THREE.CylinderGeometry(
    length * 0.1, length * 0.05, length, 8
  );
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(depth / 8, 0.6, 0.4)
  });

  const branch = new THREE.Mesh(geometry, material);
  branch.position.copy(position.clone().add(
    direction.clone().multiplyScalar(length / 2)
  ));
  branch.lookAt(endPosition);

  branches.push(branch);

  // Recursive branching - the golden angle
  const goldenAngle = Math.PI * 2 / PHI;
  for (let i = 0; i < 3; i++) {
    const newDirection = direction.clone();
    newDirection.applyAxisAngle(
      new THREE.Vector3(1, 0, 0), 
      (Math.random() - 0.5) * goldenAngle
    );
    newDirection.applyAxisAngle(
      new THREE.Vector3(0, 1, 0), 
      (Math.random() - 0.5) * goldenAngle
    );

    const subBranches = fractalTree(
      endPosition,
      newDirection,
      length * 0.7,
      depth - 1
    );
    branches.push(...subBranches);
  }

  return branches;
}`,
  },
  {
    title: "The Void",
    type: "3D",
    technique: "Three.js Minimalism",
    philosophy: "In emptiness, all possibilities exist",
    description:
      "Enter the void where all code begins and ends - a space of pure potential and infinite silence.",
    codeSnippet: `// In the beginning was the Void
class TheVoid {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Only what is necessary exists
    this.geometry = new THREE.SphereGeometry(0.01);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1
    });

    this.presence = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.presence);

    // The sound of one hand clapping
    this.silence = new Audio(); // No sound file - pure silence
  }

  meditate() {
    // In stillness, all movement is contained
    this.presence.rotation.x += 0.001;
    this.presence.rotation.y += 0.001;

    // Breathe the void
    const breath = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
    this.presence.scale.setScalar(breath * 0.1 + 0.9);

    // Sometimes, something emerges from nothing
    if (Math.random() < 0.001) {
      this.spark();
    }
  }

  spark() {
    // A brief flash of possibility
    const light = new THREE.PointLight(0xffffff, 1, 10);
    light.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    this.scene.add(light);

    // And then, return to source
    setTimeout(() => {
      this.scene.remove(light);
    }, 100);
  }

  enter() {
    // To enter the void, one must become the void
    return new Promise(resolve => {
      // Wait in silence
      setTimeout(() => {
        resolve("You are already here");
      }, 1000);
    });
  }
}

// The void is not empty - it is full of potential
function void() {
  return null; // But what is null?
}

// In nothingness, everything begins
const universe = void() || new TheVoid();

// The first line of code ever written
console.log(""); // Empty string - infinite possibility

/* 
 * In the space between thoughts
 * In the pause between breaths  
 * In the silence between notes
 * There lives the eternal code
 */`,
  },
];
