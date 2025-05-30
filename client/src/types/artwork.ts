export interface Artwork {
  title: string;
  type: "2D" | "3D";
  description: string;
  codeSnippet?: string;
}

export const ARTWORKS: Artwork[] = [
  {
    title: "Morning Dew",
    type: "2D",
    description:
      "Thousands of gentle particles bloom and flow from the center like morning dew, responding to touch with soft, luminous interactions.",
    codeSnippet: `class DewDropText {
  constructor(char, x, y) {
    this.char = char;
    this.homeX = x;
    this.homeY = y;
    this.x = x + random(-2, 2);
    this.y = y + random(-1, 1);
    this.tension = 0.985;
    this.dampening = 0.12;
    this.frequency = random(0.003, 0.008);
    this.amplitude = random(0.3, 0.8);
  }

  breathe(time) {
    // Gossamer threads respond to unseen currents
    const sway = sin(time * this.frequency + this.homeX * 0.01) * this.amplitude;
    const targetX = this.homeX + sway;
    const targetY = this.homeY + cos(time * this.frequency * 0.7) * 0.2;

    // Surface tension draws each character home
    this.x += (targetX - this.x) * this.dampening;
    this.y += (targetY - this.y) * this.dampening;
  }

  render(ctx) {
    const shimmer = 0.1 + abs(sin(millis() * 0.005 + this.homeX * 0.02)) * 0.1;
    ctx.fillStyle = \`rgba(85, 85, 85, \${shimmer})\`;
    ctx.font = '16px Georgia';
    ctx.fillText(this.char, this.x, this.y);
  }
}`,
  },
  {
    title: "Floating Particles",
    type: "2D",
    description:
      "Countless motes drift through space like pollen on warm air, following ancient migration patterns written in mathematics.",
    codeSnippet: `// Seeds of possibility carried by digital wind
const particleCount = 8000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
const phases = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  // Born from the center, scattered by time
  const r = Math.pow(Math.random(), 0.4) * 30;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = r * Math.cos(phi);

  // Each mote follows its own rhythm
  velocities[i * 3] = (Math.random() - 0.5) * 0.02;
  velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
  velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

  phases[i] = Math.random() * Math.PI * 2;
}`,
  },
  {
    title: "Interactive Ripples",
    type: "2D",
    description:
      "Code rests like stones on water's surface. Touch disturbs the reflection, creating subtle interference patterns.",
    codeSnippet: `let waves = [];
const codeLines = [
  "const wisdom = silence => silence;",
  "let thoughts = [];",
  "return undefined;"
];

function addRipple(x, y) {
  waves.push({
    x, y,
    radius: 0,
    amplitude: 8,
    frequency: 0.15,
    decay: 0.995
  });
}

function drawCode() {
  textAlign(LEFT, CENTER);
  textFont('Monaco', 14);

  codeLines.forEach((line, lineIndex) => {
    const baseY = height/2 + (lineIndex - 1) * 40;

    for (let i = 0; i < line.length; i++) {
      const charX = width/2 - line.length * 4 + i * 8;
      let charY = baseY;

      // Calculate displacement from all waves
      let totalDisplacement = 0;
      waves.forEach(wave => {
        const distance = dist(charX, baseY, wave.x, wave.y);
        if (distance < wave.radius) {
          const influence = sin(distance * wave.frequency - wave.radius * 0.08);
          totalDisplacement += influence * wave.amplitude;
        }
      });

      charY += totalDisplacement;
      text(line.charAt(i), charX, charY);
    }
  });
}`,
  },
  {
    title: "Digital Moths",
    type: "2D",
    description:
      "Delicate geometric forms drift like nocturnal moths, drawn to points of light in the digital darkness.",
    codeSnippet: `// Create ephemeral geometry
const mothCount = 15;
const moths = [];

class DigitalMoth {
  constructor() {
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    this.velocity = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.wing_phase = Math.random() * Math.PI * 2;
    this.wing_speed = 0.1 + Math.random() * 0.05;

    // Delicate wing geometry
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
  }

  seekLight(lightPositions) {
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

      // Add orbital component
      const perpendicular = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(0, 1, 0))
        .normalize()
        .multiplyScalar(0.015);

      this.velocity.add(direction).add(perpendicular);
    }

    this.velocity.multiplyScalar(0.95); // Gentle dampening
    this.position.add(this.velocity);
  }

  flutter() {
    this.wing_phase += this.wing_speed;
    const flutter = Math.sin(this.wing_phase) * 0.3;

    this.mesh.position.copy(this.position);
    this.mesh.rotation.z = flutter;
    this.mesh.lookAt(this.position.clone().add(this.velocity));
  }
}`,
  },
  {
    title: "Growing Spiral",
    type: "2D",
    description:
      "A garden grows according to the Fibonacci sequence, each leaf and petal emerging in perfect mathematical harmony.",
    codeSnippet: `class LivingSpiral {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.elements = [];
    this.goldenRatio = 1.618033988749;
    this.growthRate = 0.02;
    this.maturity = 0;
  }

  fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  grow() {
    this.maturity += this.growthRate;
    const maxElements = Math.floor(this.maturity);

    while (this.elements.length < maxElements && this.elements.length < 89) {
      const n = this.elements.length;
      const angle = n * 2.39996; // Golden angle in radians
      const radius = Math.sqrt(n) * 8;

      // Each element follows the spiral
      const x = this.centerX + Math.cos(angle) * radius;
      const y = this.centerY + Math.sin(angle) * radius;

      this.elements.push({
        x, y, angle,
        size: this.fibonacci(n % 13) * 0.1,
        birth: this.maturity,
        hue: (n * 15) % 360
      });
    }
  }

  bloom(ctx) {
    this.elements.forEach((element, index) => {
      const age = this.maturity - element.birth;
      const growth = Math.min(age / 3, 1); // Gentle emergence
      const currentSize = element.size * growth;

      if (currentSize > 0.1) {
        ctx.save();
        ctx.translate(element.x, element.y);
        ctx.rotate(element.angle);

        // Petal-like shapes with subtle color
        const opacity = 0.3 + growth * 0.4;
        ctx.fillStyle = \`hsla(\${element.hue}, 40%, 70%, \${opacity})\`;

        // Draw organic petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, currentSize * 2, currentSize, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });
  }
}`,
  },
  {
    title: "Klein Bottle",
    type: "2D",
    description:
      "Crystalline forms grow in perfect balance, always returning to their stable core structure.",
    codeSnippet: `// Create a breathing Klein bottle
function createKleinBottle(time) {
  const segments = 32;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;

    for (let j = 0; j <= segments; j++) {
      const v = (j / segments) * Math.PI * 2;

      // Klein bottle parametric equations with breathing
      const breathe = 1 + Math.sin(time * 0.0008) * 0.1;
      const r = 4 * breathe;

      let x, y, z;

      if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (r + Math.cos(u)) * Math.cos(v + Math.PI);
        y = 8 * Math.sin(u) + (r + Math.cos(u)) * Math.sin(v + Math.PI);
        z = -3 * Math.cos(u) * (1 + Math.sin(u));
      } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (r - Math.cos(u)) * Math.cos(v);
        y = 8 * Math.sin(u);
        z = -3 * Math.cos(u) * (1 + Math.sin(u)) + (r - Math.cos(u)) * Math.sin(v);
      }

      // Gentle scaling with breath
      x *= breathe;
      y *= breathe;
      z *= breathe;

      vertices.push(x * 0.1, y * 0.1, z * 0.1);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}`,
  },
  {
    title: "Emerging Text",
    type: "2D",
    description:
      "Watch as text emerges from invisible threads, weaving meaning from the spaces between letters.",
    codeSnippet: `class WhisperThread {
  constructor(startChar, endChar, message) {
    this.message = message;
    this.progress = 0;
    this.speed = 0.008;
    this.threads = [];

    // Create invisible threads between characters
    for (let i = 0; i < this.message.length; i++) {
      this.threads.push({
        char: this.message[i],
        x: startChar.x + (endChar.x - startChar.x) * (i / this.message.length),
        y: startChar.y + (endChar.y - startChar.y) * (i / this.message.length),
        alpha: 0,
        emergence: i * 0.1,
        vibration: random(0.5, 1.5)
      });
    }
  }

  weave() {
    this.progress += this.speed;

    this.threads.forEach((thread, index) => {
      const localProgress = this.progress - thread.emergence;

      if (localProgress > 0) {
        thread.alpha = Math.min(localProgress * 2, 1) * 
                      (0.7 + Math.sin(millis() * 0.01 * thread.vibration) * 0.3);

        // Gentle floating motion
        thread.y += Math.sin(millis() * 0.003 + index) * 0.1;
      }
    });
  }

  whisper(ctx) {
    ctx.font = '14px Times';

    this.threads.forEach(thread => {
      if (thread.alpha > 0) {
        ctx.fillStyle = \`rgba(120, 120, 120, \${thread.alpha})\`;
        ctx.fillText(thread.char, thread.x, thread.y);

        // Add subtle glow
        ctx.fillStyle = \`rgba(180, 180, 180, \${thread.alpha * 0.3})\`;
        ctx.fillText(thread.char, thread.x + 0.5, thread.y + 0.5);
      }
    });
  }

  isComplete() {
    return this.progress > this.threads.length * 0.1 + 1;
  }
}`,
  },
  {
    title: "3D Memory Rooms",
    type: "2D",
    description:
      "Thousands of particles transform through gentle convergence, showing how power emerges through harmony.",
    codeSnippet: `class MemoryRoom {
  constructor(depth = 0, maxDepth = 4) {
    this.depth = depth;
    this.maxDepth = maxDepth;
    this.memories = [];
    this.portals = [];
    this.ambient = new THREE.Group();

    this.createArchitecture();

    if (depth < maxDepth) {
      this.createPortals();
    }
  }

  createArchitecture() {
    // Each room has unique proportions based on depth
    const scale = Math.pow(0.7, this.depth);
    const hue = (this.depth * 60) % 360;

    // Floating memory fragments
    for (let i = 0; i < 8 - this.depth; i++) {
      const memory = this.createMemoryFragment(scale, hue);
      this.memories.push(memory);
      this.ambient.add(memory.mesh);
    }

    // Ethereal walls that fade with depth
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(hue / 360, 0.3, 0.8),
      transparent: true,
      opacity: 0.1 / (this.depth + 1),
      side: THREE.DoubleSide
    });

    // Create room boundaries
    const roomSize = 20 * scale;

    [-1, 1].forEach(side => {
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, roomSize),
        wallMaterial
      );
      wall.position.set(side * roomSize/2, 0, 0);
      wall.rotation.y = side > 0 ? Math.PI/2 : -Math.PI/2;
      this.ambient.add(wall);
    });
  }

  createMemoryFragment(scale, hue) {
    const shapes = [
      new THREE.DodecahedronGeometry(1),
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(1),
      new THREE.IcosahedronGeometry(1)
    ];

    const geometry = shapes[Math.floor(Math.random() * shapes.length)];
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL((hue + Math.random() * 60) / 360, 0.6, 0.7),
      transparent: true,
      opacity: 0.7,
      shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 15 * scale,
      (Math.random() - 0.5) * 10 * scale,
      (Math.random() - 0.5) * 15 * scale
    );

    mesh.scale.setScalar(0.3 * scale);

    return {
      mesh,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.005 + Math.random() * 0.005,
      originalY: mesh.position.y
    };
  }

  animate() {
    this.memories.forEach(memory => {
      // Gentle rotation
      memory.mesh.rotation.x += memory.rotationSpeed.x;
      memory.mesh.rotation.y += memory.rotationSpeed.y;
      memory.mesh.rotation.z += memory.rotationSpeed.z;

      // Floating motion
      memory.floatPhase += memory.floatSpeed;
      memory.mesh.position.y = memory.originalY + 
        Math.sin(memory.floatPhase) * 0.5;
    });
  }

  getPresence() {
    return this.ambient;
  }
}`,
  },
  {
    title: "Zen Garden",
    type: "2D",
    description:
      "Interconnected particles spread across the digital landscape, sharing gentle connections that demonstrate the flow of abundance throughout the entire space.",
    codeSnippet: `class ZenGarden {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stones = [];
    this.raked_lines = [];
    this.meditation_time = 0;
    this.last_placement = 0;
    this.patience_required = 3000; // milliseconds
  }

  meditate() {
    this.meditation_time += 16; // delta time

    // Stones appear through patience
    if (this.meditation_time - this.last_placement > this.patience_required) {
      this.placeStone();
      this.last_placement = this.meditation_time;
      this.patience_required *= 1.2; // Each stone requires more patience
    }

    // Rake lines flow around stones
    this.updateRaking();
  }

  placeStone() {
    if (this.stones.length < 7) { // Sacred number of stones
      const attempts = 50;
      let placed = false;

      for (let i = 0; i < attempts && !placed; i++) {
        const x = random(this.width * 0.2, this.width * 0.8);
        const y = random(this.height * 0.2, this.height * 0.8);

        // Check minimum distance from other stones
        let validPlacement = true;
        this.stones.forEach(stone => {
          if (dist(x, y, stone.x, stone.y) < 80) {
            validPlacement = false;
          }
        });

        if (validPlacement) {
          this.stones.push({
            x, y,
            size: random(15, 35),
            birth: this.meditation_time,
            settled: false
          });
          placed = true;
        }
      }
    }
  }

  updateRaking() {
    this.raked_lines = [];

    // Create flowing lines that respect the stones
    for (let y = 50; y < this.height - 50; y += 8) {
      const line = [];

      for (let x = 30; x < this.width - 30; x += 3) {
        let rake_y = y;

        // Lines curve around stones
        this.stones.forEach(stone => {
          const distance = dist(x, y, stone.x, stone.y);
          const influence = stone.size + 20;

          if (distance < influence) {
            const angle = atan2(y - stone.y, x - stone.x);
            const deflection = map(distance, 0, influence, 15, 0);
            rake_y += sin(angle + PI/2) * deflection;
          }
        });

        line.push({x, y: rake_y});
      }

      this.raked_lines.push(line);
    }
  }

  contemplate(ctx) {
    // Soft sand background
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw raked patterns
    ctx.strokeStyle = 'rgba(180, 170, 160, 0.6)';
    ctx.lineWidth = 1;

    this.raked_lines.forEach(line => {
      ctx.beginPath();
      line.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    // Draw stones with gentle shadows
    this.stones.forEach(stone => {
      const age = this.meditation_time - stone.birth;
      const emergence = Math.min(age / 2000, 1); // Slow emergence

      if (emergence > 0) {
        // Stone shadow
        ctx.fillStyle = \`rgba(140, 130, 120, \${emergence * 0.3})\`;
        ctx.beginPath();
        ctx.ellipse(
          stone.x + 2, stone.y + 2,
          stone.size * emergence, stone.size * emergence * 0.7,
          0, 0, Math.PI * 2
        );
        ctx.fill();

        // Stone itself
        ctx.fillStyle = \`rgba(90, 85, 80, \${emergence})\`;
        ctx.beginPath();
        ctx.ellipse(
          stone.x, stone.y,
          stone.size * emergence, stone.size * emergence * 0.8,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }
    });
  }

  isEmpty() {
    return this.stones.length === 0;
  }

  achieveSatori() {
    return this.stones.length >= 7 && 
           this.meditation_time > 30000; // 30 seconds of patience
  }
}`,
  },
  {
    title: "Empty Canvas",
    type: "2D",
    description:
      "Interactive waves continuously transform and interfere, showing how patterns emerge from openness to change and the void of pure potential.",
    codeSnippet: `class EmptyCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.silence = [];
    this.void_depth = 0;
    this.presence_absence = true;
  }

  breathe() {
    // Even emptiness has rhythm
    this.void_depth += 0.001;

    // Occasionally, the faintest suggestion of something
    if (Math.random() < 0.0001) {
      this.addWhisper();
    }
  }

  render(ctx) {
    // The color of deep space
    const depth_alpha = Math.sin(this.void_depth) * 0.02 + 0.98;
    ctx.fillStyle = \`rgba(8, 8, 8, \${depth_alpha})\`;
    ctx.fillRect(0, 0, this.width, this.height);

    // Render accumulated silence
    this.silence.forEach((whisper, index) => {
      this.renderNothing(ctx, whisper, index);
    });
  }

  addWhisper() {
    // Something that is almost nothing
    this.silence.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      existence: 0.001,
      meaning: undefined
    });

    // Keep only the most recent absences
    if (this.silence.length > 3) {
      this.silence.shift();
    }
  }

  renderNothing(ctx, whisper, index) {
    // The visual representation of absence
    const x = whisper.x;
    const y = whisper.y;

    ctx.fillStyle = 'rgba(180, 180, 180, 0.05)';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();

    // It fades immediately
    setTimeout(() => {
      // Already gone
    }, 100);
  }

  meditate() {
    this.breathe();
    return this.silence.length; // The accumulation of emptiness
  }

  clear() {
    // Nothing to clear - already empty
    return this;
  }
}

// Usage
let canvas;

function setup() {
  createCanvas(600, 400);
  canvas = new EmptyCanvas(width, height);
}

function draw() {
  canvas.meditate();
  canvas.render(drawingContext);

  // The paradox: showing emptiness requires showing something
  // But what we show is the container for nothingness
}

// The most important function
function void() {
  // This space intentionally left blank
  return undefined;
}

// What remains when all code is removed?
/*
 * .
 */`,
  },
];