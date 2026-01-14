import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Blob {
  x: number;
  y: number;
  baseR: number;
  vx: number;
  vy: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  noiseOffsetR: number;
  hue: number;
  saturation: number;
  brightness: number;
  density: number; // Affects buoyancy
}

const LavaLampBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let blobs: Blob[] = [];
      const numBlobs = 6;
      const gravity = 0.0008; // Very subtle gravity
      const buoyancy = 0.001; // Upward force when warm
      const friction = 0.998; // Slow down over time
      const noiseScale = 0.0003; // Very slow noise evolution

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.noStroke();

        // Initialize blobs with realistic properties
        for (let i = 0; i < numBlobs; i++) {
          const baseHue = p.random([
            p.random(15, 35),   // Deep amber/orange
            p.random(35, 50),   // Golden yellow
            p.random(5, 20),    // Warm red-orange
          ]);
          
          blobs.push({
            x: p.random(p.width * 0.2, p.width * 0.8),
            y: p.random(p.height * 0.3, p.height * 0.7),
            baseR: p.random(120, 280),
            vx: 0,
            vy: 0,
            noiseOffsetX: p.random(1000),
            noiseOffsetY: p.random(2000),
            noiseOffsetR: p.random(3000),
            hue: baseHue,
            saturation: p.random(65, 85),
            brightness: p.random(55, 75),
            density: p.random(0.8, 1.2)
          });
        }
      };

      p.draw = () => {
        // Deep dark background - slight warm tint
        p.background(225, 35, 6);

        // Update physics for each blob
        for (let blob of blobs) {
          // Temperature-based buoyancy (bottom is warmer)
          const heatFactor = p.map(blob.y, 0, p.height, -0.5, 1);
          const buoyancyForce = (buoyancy * heatFactor) / blob.density;
          
          // Apply forces
          blob.vy += gravity * blob.density; // Gravity
          blob.vy -= buoyancyForce; // Buoyancy (opposes gravity when warm)
          
          // Very subtle noise-based lateral movement
          const noiseX = p.noise(blob.noiseOffsetX) - 0.5;
          const noiseY = p.noise(blob.noiseOffsetY) - 0.5;
          blob.vx += noiseX * 0.003;
          blob.vy += noiseY * 0.001;
          
          // Apply friction
          blob.vx *= friction;
          blob.vy *= friction;
          
          // Update position
          blob.x += blob.vx;
          blob.y += blob.vy;
          
          // Advance noise
          blob.noiseOffsetX += noiseScale;
          blob.noiseOffsetY += noiseScale;
          blob.noiseOffsetR += noiseScale * 0.5;
          
          // Soft boundary bouncing
          const margin = blob.baseR * 0.3;
          if (blob.x < margin) {
            blob.x = margin;
            blob.vx *= -0.3;
          }
          if (blob.x > p.width - margin) {
            blob.x = p.width - margin;
            blob.vx *= -0.3;
          }
          if (blob.y < margin) {
            blob.y = margin;
            blob.vy *= -0.3;
          }
          if (blob.y > p.height - margin) {
            blob.y = p.height - margin;
            blob.vy *= -0.5; // Stronger bounce at bottom (heated)
          }
        }

        // Draw blobs with metaball-like effect
        // First pass: draw glow layers
        for (let blob of blobs) {
          const morphR = blob.baseR + p.sin(p.frameCount * 0.008 + blob.noiseOffsetR * 100) * 15;
          
          // Outer glow
          for (let i = 4; i >= 0; i--) {
            const glowAlpha = p.map(i, 4, 0, 2, 12);
            const glowSize = morphR * (1 + i * 0.4);
            p.fill(blob.hue, blob.saturation * 0.7, blob.brightness * 0.6, glowAlpha);
            drawOrganicBlob(p, blob.x, blob.y, glowSize, blob.noiseOffsetR, 0.3);
          }
        }
        
        // Second pass: draw main blob bodies
        for (let blob of blobs) {
          const morphR = blob.baseR + p.sin(p.frameCount * 0.008 + blob.noiseOffsetR * 100) * 15;
          
          // Inner gradient layers
          for (let i = 3; i >= 0; i--) {
            const layerAlpha = p.map(i, 3, 0, 25, 65);
            const layerSize = morphR * (0.4 + i * 0.2);
            const layerBrightness = blob.brightness + (3 - i) * 8;
            p.fill(blob.hue, blob.saturation, p.min(layerBrightness, 90), layerAlpha);
            drawOrganicBlob(p, blob.x, blob.y, layerSize, blob.noiseOffsetR, 0.25 - i * 0.03);
          }
          
          // Hot core
          const coreSize = morphR * 0.25;
          p.fill(blob.hue - 5, blob.saturation * 0.6, 95, 40);
          p.ellipse(blob.x, blob.y - morphR * 0.1, coreSize, coreSize * 0.8);
        }

        // Subtle glass/liquid refraction overlay
        drawRefractionOverlay(p);
      };

      const drawOrganicBlob = (p: p5, cx: number, cy: number, radius: number, noiseOffset: number, noiseMagnitude: number) => {
        p.beginShape();
        const resolution = 60;
        for (let i = 0; i < resolution; i++) {
          const angle = p.map(i, 0, resolution, 0, p.TWO_PI);
          const noiseVal = p.noise(
            p.cos(angle) * 1.5 + noiseOffset,
            p.sin(angle) * 1.5 + noiseOffset,
            p.frameCount * 0.002
          );
          const r = radius * (1 - noiseMagnitude + noiseVal * noiseMagnitude * 2);
          const x = cx + r * p.cos(angle);
          const y = cy + r * p.sin(angle);
          p.curveVertex(x, y);
        }
        p.endShape(p.CLOSE);
      };

      const drawRefractionOverlay = (p: p5) => {
        // Subtle vertical gradient for glass effect
        const gradientSteps = 5;
        for (let i = 0; i < gradientSteps; i++) {
          const y = p.map(i, 0, gradientSteps, 0, p.height);
          const alpha = i < 2 ? 3 : 1;
          p.fill(200, 10, 100, alpha);
          p.rect(0, y, p.width, p.height / gradientSteps);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ isolation: 'isolate' }}
    />
  );
};

export default LavaLampBackground;
