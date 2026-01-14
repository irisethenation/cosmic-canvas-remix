import { useEffect, useRef } from "react";

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "triangle" | "hexagon" | "diamond" | "circle";
  vx: number;
  vy: number;
}

const GeometricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shapesRef = useRef<Shape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize shapes
    const shapeTypes: Shape["type"][] = ["triangle", "hexagon", "diamond", "circle"];
    shapesRef.current = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      opacity: Math.random() * 0.08 + 0.02,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = `hsla(262, 83%, 58%, ${shape.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      switch (shape.type) {
        case "triangle":
          const h = shape.size * Math.sqrt(3) / 2;
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(-shape.size / 2, h / 2);
          ctx.lineTo(shape.size / 2, h / 2);
          ctx.closePath();
          break;
        case "hexagon":
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = Math.cos(angle) * shape.size / 2;
            const py = Math.sin(angle) * shape.size / 2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          break;
        case "diamond":
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 3, 0);
          ctx.lineTo(0, shape.size / 2);
          ctx.lineTo(-shape.size / 3, 0);
          ctx.closePath();
          break;
        case "circle":
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          break;
      }

      ctx.stroke();
      ctx.restore();
    };

    const drawConnections = () => {
      const shapes = shapesRef.current;
      ctx.strokeStyle = "hsla(262, 83%, 58%, 0.03)";
      ctx.lineWidth = 1;

      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[i].x - shapes[j].x;
          const dy = shapes[i].y - shapes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            ctx.beginPath();
            ctx.moveTo(shapes[i].x, shapes[i].y);
            ctx.lineTo(shapes[j].x, shapes[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        drawShape(shape);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default GeometricBackground;
