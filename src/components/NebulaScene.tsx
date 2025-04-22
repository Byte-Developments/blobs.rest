"use client";

import { useEffect, useRef } from "react";
import AmbientMusic from "@/components/AmbientMusic";
import DateDisplay from "@/components/DateDisplay";

export default function NebulaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      baseO: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * 2 * Math.PI,
    }));

    const glows = Array.from({ length: 5 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 200 + 100,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: `hsla(${Math.random() * 360}, 70%, 60%, 0.15)`
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const g of glows) {
        g.x += g.dx;
        g.y += g.dy;
        if (g.x < 0 || g.x > w) g.dx *= -1;
        if (g.y < 0 || g.y > h) g.dy *= -1;

        const gradient = ctx.createRadialGradient(
          g.x,
          g.y,
          0,
          g.x,
          g.y,
          g.r
        );
        gradient.addColorStop(0, g.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of stars) {
        const alpha = s.baseO + 0.2 * Math.sin(time / 1000 + s.pulse);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0b0f25] to-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <DateDisplay />
      </div>
      <AmbientMusic />
    </div>
  );
}
