import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Blob {
  x: number;
  y: number;
  r: number;
  xSpeed: number;
  ySpeed: number;
  noiseOffset: number;
  hue: number;
}

const LavaLampBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let blobs: Blob[] = [];
      const numBlobs = 8;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.noStroke();

        // Initialize blobs with golden/amber tones
        for (let i = 0; i < numBlobs; i++) {
          blobs.push({
            x: p.random(p.width),
            y: p.random(p.height),
            r: p.random(100, 250),
            xSpeed: p.random(-0.3, 0.3),
            ySpeed: p.random(-0.3, 0.3),
            noiseOffset: p.random(1000),
            hue: p.random(25, 55) // Golden/amber range
          });
        }
      };

      p.draw = () => {
        // Dark background with slight transparency for trail effect
        p.background(220, 40, 8, 15);

        // Update and draw blobs
        for (let blob of blobs) {
          // Update position with smooth movement
          blob.x += blob.xSpeed;
          blob.y += blob.ySpeed;

          // Add noise-based movement for organic feel
          blob.x += p.map(p.noise(blob.noiseOffset), 0, 1, -0.5, 0.5);
          blob.y += p.map(p.noise(blob.noiseOffset + 100), 0, 1, -0.5, 0.5);
          blob.noiseOffset += 0.005;

          // Bounce off edges with smooth transition
          if (blob.x < -blob.r) blob.x = p.width + blob.r;
          if (blob.x > p.width + blob.r) blob.x = -blob.r;
          if (blob.y < -blob.r) blob.y = p.height + blob.r;
          if (blob.y > p.height + blob.r) blob.y = -blob.r;

          // Morphing radius
          const morphingR = blob.r + p.sin(p.frameCount * 0.02 + blob.noiseOffset) * 20;

          // Draw blob with gradient effect using multiple circles
          for (let i = 5; i > 0; i--) {
            const alpha = p.map(i, 5, 0, 10, 40);
            const size = morphingR * (i / 3);
            p.fill(blob.hue, 70, 60, alpha);
            
            // Draw organic shape using bezier curves
            p.push();
            p.translate(blob.x, blob.y);
            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += 0.1) {
              const noiseVal = p.noise(
                p.cos(a) * 2 + blob.noiseOffset,
                p.sin(a) * 2 + blob.noiseOffset,
                p.frameCount * 0.01
              );
              const r = size * (0.8 + noiseVal * 0.4);
              const x = r * p.cos(a);
              const y = r * p.sin(a);
              p.curveVertex(x, y);
            }
            p.endShape(p.CLOSE);
            p.pop();
          }
        }

        // Add subtle glow overlay
        for (let blob of blobs) {
          const glowSize = blob.r * 2;
          for (let i = 0; i < 3; i++) {
            p.fill(blob.hue, 80, 70, 3 - i);
            p.ellipse(blob.x, blob.y, glowSize + i * 50);
          }
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

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default LavaLampBackground;
