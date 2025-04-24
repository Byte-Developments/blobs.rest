"use client";

import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = w() * dpr;
      canvas.height = h() * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const shapes = Array.from({ length: 20 }).map(() => {
      const size = 80 + Math.random() * 60;
      const x = Math.random() * w();
      const y = Math.random() * h();
      const rotation = Math.random() * Math.PI * 2;
      const isTriangle = Math.random() > 0.5;
      return {
        baseX: x,
        baseY: y,
        size,
        rotation,
        isTriangle,
        offset: Math.random() * Math.PI * 2,
        driftX: Math.random() * 2,
        driftY: Math.random() * 2,
      };
    });

    let frame = 0;

    function animate() {
      const bgGrad = ctx.createRadialGradient(w() / 2, h() / 2, 0, w() / 2, h() / 2, Math.max(w(), h()));
      bgGrad.addColorStop(0, "#0a0a1a");
      bgGrad.addColorStop(1, "#14001c");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      frame += 0.004;

      for (const shape of shapes) {
        const pulse = Math.sin(frame + shape.offset) * 0.3 + 1;
        const adjustedSize = shape.size * (0.95 + 0.05 * pulse);

        const driftX = Math.cos(frame + shape.offset) * shape.driftX * 8;
        const driftY = Math.sin(frame + shape.offset) * shape.driftY * 8;

        ctx.save();
        ctx.translate(shape.baseX + driftX, shape.baseY + driftY);
        ctx.rotate(shape.rotation);

        ctx.shadowColor = "rgba(200, 150, 255, 0.3)";
        ctx.shadowBlur = 80;

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
        glowGrad.addColorStop(0.5, `hsla(300, 100%, 80%, ${0.4 * glowPulse})`);
        glowGrad.addColorStop(1, `hsla(330, 100%, 60%, 0.05)`);

        ctx.fillStyle = fillGrad;
        ctx.fill();

        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 1.5 + glowPulse;
        ctx.stroke();

        ctx.restore();
      }

      requestAnimationFrame(animate);
    }
    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
}