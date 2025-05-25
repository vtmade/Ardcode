export interface Artwork {
  title: string;
  type: '2D' | '3D';
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
    description: "Watch as philosophical text flows like water, responding to your touch with ripples of understanding.",
    codeSnippet: `function draw() {\n  textParticles.forEach(p => {\n    p.drift();\n    p.display();\n  });\n}`
  },
  {
    title: "Particle Galaxy", 
    type: "3D",
    technique: "Three.js Point Cloud",
    philosophy: "The ten thousand things arise from emptiness",
    description: "Navigate through a galaxy of particles representing the infinite manifestations of the Tao.",
    codeSnippet: `const particles = new Points(\n  geometry,\n  new PointMaterial({\n    size: 0.02,\n    vertexColors: true\n  })\n);`
  },
  {
    title: "Code Ripples",
    type: "2D", 
    technique: "p5.js Wave Simulation",
    philosophy: "Every action creates ripples across the digital pond",
    description: "Touch creates ripples that distort code, showing how observation changes reality.",
    codeSnippet: `function mousePressed() {\n  ripples.push({\n    x: mouseX, y: mouseY,\n    radius: 0, amplitude: 50\n  });\n}`
  },
  {
    title: "Floating Geometry",
    type: "3D",
    technique: "Three.js Sacred Forms", 
    philosophy: "Form is emptiness, emptiness is form",
    description: "Platonic solids float in meditative space, connected by invisible threads of meaning.",
    codeSnippet: `<octahedronGeometry args={[1, 0]} />\n<meshStandardMaterial\n  wireframe={true}\n  transparent\n  opacity={0.7}\n/>`
  },
  {
    title: "Breathing Mandala",
    type: "2D",
    technique: "p5.js Generative Art",
    philosophy: "Breathe in code, breathe out wisdom", 
    description: "A living mandala that breathes with the rhythm of meditation, expanding and contracting like consciousness itself.",
    codeSnippet: `let breathPhase = sin(frameCount * 0.02);\nlet size = baseSize * (breathPhase + 1);`
  },
  {
    title: "Infinite Loop",
    type: "3D",
    technique: "Three.js Möbius Strip",
    philosophy: "The path that can be traveled has no beginning or end",
    description: "Journey along impossible geometries where ending becomes beginning in eternal recursion.",
    codeSnippet: `while (true) {\n  seek();\n  find();\n  lose();\n  begin();\n}`
  },
  {
    title: "Nature's Code",
    type: "2D",
    technique: "p5.js L-Systems", 
    philosophy: "Nature is the first programmer",
    description: "Watch trees grow according to algorithmic rules, as code rain falls from digital skies.",
    codeSnippet: `class LSystem {\n  generate() {\n    this.rules.forEach(rule => {\n      this.apply(rule);\n    });\n  }\n}`
  },
  {
    title: "Quantum Field",
    type: "3D",
    technique: "Three.js Particle Physics",
    philosophy: "Observation collapses infinite possibilities into singular reality",
    description: "Explore quantum mechanics through interactive particles that exist in superposition until observed.",
    codeSnippet: `if (observed) {\n  particle.collapse();\n} else {\n  particle.superposition();\n}`
  },
  {
    title: "Sacred Code",
    type: "3D", 
    technique: "Three.js Sacred Geometry",
    philosophy: "As above, so below - as in mathematics, so in code",
    description: "Sacred geometric patterns merge with programming symbols in divine mathematical harmony.",
    codeSnippet: `const phi = 1.618033988749;\nconst fibonacci = n => \n  n < 2 ? n : \n  fibonacci(n-1) + fibonacci(n-2);`
  },
  {
    title: "The Void",
    type: "3D",
    technique: "Three.js Minimalism",
    philosophy: "In emptiness, all possibilities exist",
    description: "Enter the void where all code begins and ends - a space of pure potential and infinite silence.",
    codeSnippet: `function void() {\n  return null;\n}\n\n// In nothingness,\n// everything begins`
  }
];
