import { useEffect, useRef } from "react";

export default function AsteroidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const pixels = Array.from({ length: 100 }).map(() => ({
      x: Math.floor(Math.random() * w),
      y: Math.floor(Math.random() * h),
      size: 10 + Math.floor(Math.random() * 6),
      speed: 0.4 + Math.random() * 0.6,
      alpha: 0.3 + Math.random() * 0.3,
      hue: Math.floor(Math.random() * 360),
    }));

    function animate() {
      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, w, h);

      for (const p of pixels) {
        // Draw trailing streak first
        const trailLength = p.size * 3;
        const trailGradient = ctx.createLinearGradient(p.x, p.y - trailLength, p.x, p.y);
        trailGradient.addColorStop(0, `hsla(${p.hue}, 80%, 30%, 0)`);
        trailGradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, ${p.alpha * 0.6})`);

        ctx.fillStyle = trailGradient;
        ctx.fillRect(p.x, p.y - trailLength, p.size, trailLength);

        // Draw the main pixel
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.size);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.alpha})`);
        gradient.addColorStop(1, `hsla(${(p.hue + 60) % 360}, 80%, 40%, 0.2)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.y += p.speed;
        if (p.y > h + p.size) {
          p.y = -p.size;
          p.x = Math.floor(Math.random() * w);
          p.hue = Math.floor(Math.random() * 360);
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
}
