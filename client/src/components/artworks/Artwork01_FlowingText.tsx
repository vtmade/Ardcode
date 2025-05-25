import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork01_FlowingText() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let dewdrops: any[] = [];
    let spiderWeb: any[] = [];
    let mouseInfluence = 120;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      // Create natural spider web structure
      createNaturalSpiderWeb();

      // Create dewdrops on the web
      createDewdropsOnWeb();
    };

    function createNaturalSpiderWeb() {
      spiderWeb = [];
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const maxRadius = Math.min(p.width, p.height) * 0.35;

      // Create anchor points (outer frame)
      const anchorPoints = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * p.TWO_PI;
        const variation = p.random(0.8, 1.2); // Natural irregularity
        const radius = maxRadius * variation;
        anchorPoints.push({
          x: centerX + p.cos(angle) * radius,
          y: centerY + p.sin(angle) * radius,
        });
      }

      // Create radial threads from center to anchor points
      anchorPoints.forEach((anchor) => {
        // Add natural sag to the threads
        const midX = (centerX + anchor.x) / 2 + p.random(-15, 15);
        const midY = (centerY + anchor.y) / 2 + p.random(-10, 10);

        spiderWeb.push({
          type: "radial",
          points: [
            { x: centerX, y: centerY },
            { x: midX, y: midY },
            { x: anchor.x, y: anchor.y },
          ],
        });
      });

      // Create spiral capture threads
      const spiralRings = 6;
      for (let ring = 1; ring <= spiralRings; ring++) {
        const ringRadius = (ring / spiralRings) * maxRadius * 0.9;
        const points = [];

        // Create points along the ring with natural variation
        for (let i = 0; i <= 8; i++) {
          const angle = (i / 8) * p.TWO_PI;
          const radiusVariation = p.random(0.85, 1.15);
          const currentRadius = ringRadius * radiusVariation;

          points.push({
            x: centerX + p.cos(angle) * currentRadius + p.random(-8, 8),
            y: centerY + p.sin(angle) * currentRadius + p.random(-8, 8),
          });
        }

        spiderWeb.push({
          type: "spiral",
          points: points,
          ring: ring,
        });
      }

      // Add some broken/damaged sections for realism
      for (let i = 0; i < 3; i++) {
        const angle = p.random(0, p.TWO_PI);
        const startRadius = p.random(maxRadius * 0.3, maxRadius * 0.7);
        const endRadius = startRadius + p.random(30, 80);

        spiderWeb.push({
          type: "broken",
          x1: centerX + p.cos(angle) * startRadius,
          y1: centerY + p.sin(angle) * startRadius,
          x2: centerX + p.cos(angle) * endRadius,
          y2: centerY + p.sin(angle) * endRadius,
        });
      }
    }

    function createDewdropsOnWeb() {
      dewdrops = [];

      // Place dewdrops at web intersections and along threads
      spiderWeb.forEach((thread) => {
        if (thread.type === "spiral" && thread.points) {
          thread.points.forEach((point, index) => {
            if (p.random() < 0.4) {
              // Not every intersection has dew
              dewdrops.push(
                createDewdrop(
                  point.x + p.random(-3, 3),
                  point.y + p.random(-3, 3),
                  p.random(2, 5),
                ),
              );
            }
          });
        }

        if (thread.type === "radial" && thread.points) {
          // Add dew along radial threads
          for (let i = 1; i < thread.points.length; i++) {
            if (p.random() < 0.3) {
              const prev = thread.points[i - 1];
              const curr = thread.points[i];
              const t = p.random(0.2, 0.8);
              const x = p.lerp(prev.x, curr.x, t);
              const y = p.lerp(prev.y, curr.y, t);

              dewdrops.push(createDewdrop(x, y, p.random(1.5, 3.5)));
            }
          }
        }
      });

      // Add some random dew drops for natural distribution
      for (let i = 0; i < 15; i++) {
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        const angle = p.random(0, p.TWO_PI);
        const radius = p.random(50, Math.min(p.width, p.height) * 0.3);

        dewdrops.push(
          createDewdrop(
            centerX + p.cos(angle) * radius + p.random(-20, 20),
            centerY + p.sin(angle) * radius + p.random(-20, 20),
            p.random(1, 4),
          ),
        );
      }
    }

    function createDewdrop(x: number, y: number, size: number) {
      return {
        originalX: x,
        originalY: y,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: size,
        alpha: p.random(0.4, 0.95),
        shimmer: p.random(0, p.TWO_PI),
        wobble: p.random(0.008, 0.025),
        refraction: p.random(0.5, 1.5),
        swayPhase: p.random(0, p.TWO_PI),
      };
    }

    p.draw = () => {
      // Dark background like other artworks
      p.background(10, 10, 10);

      // Draw spider web with natural movement
      spiderWeb.forEach((thread) => {
        const time = p.frameCount * 0.01;
        const shimmer = p.sin(time) * 0.15 + 0.85;

        if (thread.type === "radial" && thread.points) {
          p.stroke(120, 120, 120, 60 * shimmer);
          p.strokeWeight(0.8);
          p.noFill();

          // Draw curved radial threads
          p.beginShape();
          p.noFill();
          thread.points.forEach((point, index) => {
            const sway = p.sin(time * 0.7 + point.x * 0.01) * 1.5;
            if (index === 0) {
              p.vertex(point.x, point.y);
            } else {
              p.vertex(point.x + sway, point.y + sway * 0.5);
            }
          });
          p.endShape();
        } else if (thread.type === "spiral" && thread.points) {
          p.stroke(120, 120, 120, 70 * shimmer);
          p.strokeWeight(0.6);
          p.noFill();

          // Draw spiral with natural sag
          p.beginShape();
          thread.points.forEach((point, index) => {
            const sway = p.sin(time * 0.5 + index * 0.3) * 2;
            const sag = thread.ring * 0.5; // More sag for outer rings

            if (index === 0) {
              p.vertex(point.x + sway, point.y + sag + sway * 0.5);
            } else {
              p.vertex(point.x + sway, point.y + sag + sway * 0.5);
            }
          });
          p.endShape(p.CLOSE);
        } else if (thread.type === "broken") {
          p.stroke(120, 120, 120, 40 * shimmer);
          p.strokeWeight(0.5);

          // Draw broken threads with more sway
          const sway1 = p.sin(time + thread.x1 * 0.01) * 3;
          const sway2 = p.sin(time + thread.x2 * 0.01) * 2;
          p.line(
            thread.x1 + sway1,
            thread.y1 + sway1 * 0.5,
            thread.x2 + sway2,
            thread.y2 + sway2 * 0.5,
          );
        }
      });

      // Draw dewdrops with natural movement
      dewdrops.forEach((drop, index) => {
        const time = p.frameCount * 0.01;

        // Very gentle mouse interaction
        let mouseDistance = p.dist(p.mouseX, p.mouseY, drop.x, drop.y);
        if (mouseDistance < mouseInfluence) {
          let angle = p.atan2(drop.y - p.mouseY, drop.x - p.mouseX);
          let force = (mouseInfluence - mouseDistance) / mouseInfluence;

          // Extremely soft repulsion
          drop.vx += p.cos(angle) * force * 0.08;
          drop.vy += p.sin(angle) * force * 0.08;
        }

        // Gentle return to original position
        drop.vx += (drop.originalX - drop.x) * 0.003;
        drop.vy += (drop.originalY - drop.y) * 0.003;

        // Natural swaying like hanging on silk
        const sway = p.sin(time * drop.wobble + drop.swayPhase) * 0.8;
        const bounce = p.sin(time * drop.wobble * 1.3 + drop.swayPhase) * 0.3;

        drop.vx += sway * 0.02;
        drop.vy += bounce * 0.01;

        // Apply velocity with strong damping
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vx *= 0.97;
        drop.vy *= 0.97;

        // Update shimmer
        drop.shimmer += 0.015;

        // Draw dewdrop with natural light refraction
        p.push();
        p.translate(drop.x, drop.y);

        // Natural twinkling based on movement and time
        const movement = p.abs(drop.vx) + p.abs(drop.vy);
        const twinkle = p.sin(drop.shimmer * 1.2) * 0.3 + 0.7 + movement * 2;
        const sparkle = p.sin(drop.shimmer * 2.1 + index) * 0.25 + 0.75;
        const currentAlpha = drop.alpha * p.constrain(twinkle, 0.4, 1.0);

        // Main dewdrop body in subtle brown/ochre
        p.fill(139, 115, 85, currentAlpha * 110);
        p.noStroke();
        p.ellipse(0, 0, drop.size * 1.1, drop.size * 1.1);

        // Natural light reflection (offset based on light source)
        const reflectionIntensity = twinkle * sparkle;
        p.fill(180, 150, 100, reflectionIntensity * 140);
        p.ellipse(
          -drop.size * 0.2,
          -drop.size * 0.25,
          drop.size * 0.4,
          drop.size * 0.35,
        );

        // Bright highlight for strong twinkle
        if (twinkle > 0.8 && sparkle > 0.8) {
          p.fill(220, 190, 130, (twinkle - 0.8) * (sparkle - 0.8) * 25 * 200);
          p.ellipse(
            -drop.size * 0.15,
            -drop.size * 0.2,
            drop.size * 0.15,
            drop.size * 0.15,
          );
        }

        // Subtle outer glow when catching light
        if (reflectionIntensity > 0.85) {
          p.fill(160, 130, 90, (reflectionIntensity - 0.85) * 6.67 * 40);
          p.ellipse(0, 0, drop.size * 2.8, drop.size * 2.8);
        }

        p.pop();
      });
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      createNaturalSpiderWeb();
      createDewdropsOnWeb();
    };

    p.mousePressed = () => {
      // Create new dewdrops at mouse position
      for (let i = 0; i < 2; i++) {
        dewdrops.push(
          createDewdrop(
            p.mouseX + p.random(-25, 25),
            p.mouseY + p.random(-25, 25),
            p.random(1.5, 4),
          ),
        );
      }

      // Remove excess dewdrops to maintain performance
      if (dewdrops.length > 100) {
        dewdrops.splice(0, 8);
      }
    };

    p.mouseMoved = () => {
      // Occasionally add tiny dewdrops when moving mouse
      if (p.random() < 0.05) {
        dewdrops.push(
          createDewdrop(
            p.mouseX + p.random(-40, 40),
            p.mouseY + p.random(-40, 40),
            p.random(0.8, 2),
          ),
        );
      }
    };
  };

  useP5(sketch, containerRef);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-crosshair"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
      }}
    />
  );
}
