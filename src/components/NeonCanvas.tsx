"use client";

import { useEffect, useRef } from "react";

export default function NeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    const colors = ["#6c5ce7", "#00d2ff", "#a29bfe", "#0984e3", "#8e44ad"];
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    class Pipe {
      x = 0;
      y = 0;
      length = 0;
      angle = Math.PI / 4;
      speed = 1;
      color = colors[0];
      dx = 0;
      dy = 0;

      constructor() {
        this.reset();
      }

      reset() {
        const offset = 200;
        const t = Math.random();
        this.x = random(-offset, width * 0.4);
        this.y = height + offset - t * (height + offset * 2);
        this.length = random(100, 250);
        this.speed = random(0.5, 2);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x > width + 200 || this.y < -200) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y + Math.sin(this.angle) * this.length);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12; // reduced from 20
        ctx.stroke();
      }
    }

    const pipes: Pipe[] = Array.from({ length: 50 }, () => new Pipe());

    function animate() {
      // Using translucent fill for trailing effect instead of full redraw
      ctx.fillStyle = "#0a0a2a";

      ctx.fillRect(0, 0, width, height);

      pipes.forEach((pipe) => {
        pipe.update();
        pipe.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
