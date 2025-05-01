"use client";

import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const shapes = Array.from({ length: 15 }).map(() => {
      const size = 60 + Math.random() * 40;
      return {
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size,
        rotation: Math.random() * Math.PI * 2,
        isTriangle: Math.random() > 0.5,
        offset: Math.random() * Math.PI * 2,
        driftX: Math.random() * 1.5,
        driftY: Math.random() * 1.5,
      };
    });

    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    bgGrad.addColorStop(0, "#0a0a1a");
    bgGrad.addColorStop(1, "#14001c");

    let frame = 0;
    function animate() {
      frame += 0.004;

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      for (const shape of shapes) {
        const pulse = Math.sin(frame + shape.offset) * 0.3 + 1;
        const adjustedSize = shape.size * (0.95 + 0.05 * pulse);
        const driftX = Math.cos(frame + shape.offset) * shape.driftX * 6;
        const driftY = Math.sin(frame + shape.offset) * shape.driftY * 6;

        ctx.save();
        ctx.translate(shape.baseX + driftX, shape.baseY + driftY);
        ctx.rotate(shape.rotation);

        ctx.shadowColor = "rgba(200, 150, 255, 0.25)";
        ctx.shadowBlur = 40; // lowered

        ctx.beginPath();
        if (shape.isTriangle) {
          ctx.moveTo(0, -adjustedSize);
          ctx.lineTo(adjustedSize, adjustedSize);
          ctx.lineTo(-adjustedSize, adjustedSize);
        } else {
          ctx.moveTo(-adjustedSize, -adjustedSize);
          ctx.lineTo(adjustedSize, -adjustedSize);
          ctx.lineTo(adjustedSize, adjustedSize);
          ctx.lineTo(-adjustedSize, adjustedSize);
        }
        ctx.closePath();

        const fillGrad = ctx.createLinearGradient(-adjustedSize, -adjustedSize, adjustedSize, adjustedSize);
        fillGrad.addColorStop(0, "#0a0a1a");
        fillGrad.addColorStop(1, "#1a001f");

        const glowPulse = Math.sin(frame * 1.5 + shape.offset) * 0.5 + 1;
        const glowGrad = ctx.createLinearGradient(-adjustedSize, -adjustedSize, adjustedSize, adjustedSize);
        glowGrad.addColorStop(0, `hsla(280, 100%, 70%, 0.05)`);
        glowGrad.addColorStop(0.5, `hsla(300, 100%, 80%, ${0.3 * glowPulse})`);
        glowGrad.addColorStop(1, `hsla(330, 100%, 60%, 0.05)`);

        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 1.2 + glowPulse;
        ctx.stroke();

        ctx.restore();
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
}
