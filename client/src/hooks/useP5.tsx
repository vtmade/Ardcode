import { useEffect, useRef, RefObject } from "react";

// Type definitions for p5.js instance
interface P5Instance {
  // Core functions
  setup?: () => void;
  draw?: () => void;
  preload?: () => void;
  
  // Canvas
  createCanvas: (width: number, height: number, renderer?: string) => any;
  resizeCanvas: (width: number, height: number) => void;
  background: (...args: any[]) => void;
  
  // Drawing properties
  fill: (...args: any[]) => void;
  stroke: (...args: any[]) => void;
  strokeWeight: (weight: number) => void;
  noFill: () => void;
  noStroke: () => void;
  
  // Shapes
  rect: (x: number, y: number, w: number, h: number) => void;
  circle: (x: number, y: number, d: number) => void;
  ellipse: (x: number, y: number, w: number, h: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  point: (x: number, y: number) => void;
  
  // Text
  text: (text: string, x: number, y: number) => void;
  textAlign: (horizontalAlign: any, verticalAlign?: any) => void;
  textSize: (size: number) => void;
  
  // Math and utilities
  random: (min?: number, max?: number) => number;
  sin: (angle: number) => number;
  cos: (angle: number) => number;
  atan2: (y: number, x: number) => number;
  dist: (x1: number, y1: number, x2: number, y2: number) => number;
  map: (value: number, start1: number, stop1: number, start2: number, stop2: number) => number;
  constrain: (value: number, min: number, max: number) => number;
  lerp: (start: number, stop: number, amt: number) => number;
  
  // Transformations
  translate: (x: number, y: number) => void;
  rotate: (angle: number) => void;
  scale: (s: number) => void;
  push: () => void;
  pop: () => void;
  
  // Input
  mouseX: number;
  mouseY: number;
  pmouseX: number;
  pmouseY: number;
  mouseIsPressed: boolean;
  key: string;
  keyCode: number;
  
  // Event handlers
  mousePressed?: () => void;
  mouseReleased?: () => void;
  mouseMoved?: () => void;
  keyPressed?: () => void;
  keyReleased?: () => void;
  windowResized?: () => void;
  
  // Canvas properties
  width: number;
  height: number;
  windowWidth: number;
  windowHeight: number;
  frameCount: number;
  
  // Shape properties
  beginShape: () => void;
  endShape: (mode?: any) => void;
  vertex: (x: number, y: number) => void;
  
  // Constants
  PI: number;
  TWO_PI: number;
  HALF_PI: number;
  CENTER: any;
  LEFT: any;
  RIGHT: any;
  TOP: any;
  BOTTOM: any;
  
  // Advanced drawing
  alpha: (color: any) => number;
  red: (color: any) => number;
  green: (color: any) => number;
  blue: (color: any) => number;
  
  // Remove canvas
  remove: () => void;
}

export function useP5(
  sketch: (p: P5Instance) => void,
  containerRef: RefObject<HTMLElement>
) {
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Dynamically import p5 to avoid SSR issues
    const loadP5 = async () => {
      // p5 should be available globally from the CDN
      if (typeof window !== 'undefined' && (window as any).p5) {
        const p5 = (window as any).p5;
        
        // Create p5 instance
        p5InstanceRef.current = new p5((p: P5Instance) => {
          // Set up the sketch
          sketch(p);
          
          // Ensure canvas is properly sized and positioned
          const originalSetup = p.setup;
          p.setup = () => {
            if (originalSetup) originalSetup();
            
            // Make sure canvas fills container
            if (p.canvas) {
              p.canvas.style.width = '100%';
              p.canvas.style.height = '100%';
              p.canvas.style.display = 'block';
            }
          };
          
          // Handle window resize
          const originalWindowResized = p.windowResized;
          p.windowResized = () => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              p.resizeCanvas(rect.width, rect.height);
            }
            if (originalWindowResized) originalWindowResized();
          };
          
        }, containerRef.current);
      } else {
        console.error('p5.js not found. Make sure p5.js is loaded from CDN.');
      }
    };

    loadP5();

    // Cleanup function
    return () => {
      if (p5InstanceRef.current) {
        try {
          p5InstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing p5 instance:', e);
        }
        p5InstanceRef.current = null;
      }
    };
  }, [sketch, containerRef]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current || !p5InstanceRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (p5InstanceRef.current && width > 0 && height > 0) {
          p5InstanceRef.current.resizeCanvas(width, height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return p5InstanceRef.current;
}
