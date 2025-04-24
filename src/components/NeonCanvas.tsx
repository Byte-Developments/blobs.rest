"use client";

import { useEffect, useRef } from "react";

export default function NeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6c5ce7", "#00d2ff", "#a29bfe", "#0984e3", "#8e44ad"];
    const pipes: Pipe[] = [];

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    class Pipe {
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      color: string;

      constructor() {
        const offset = 200;
        const t = Math.random();
        this.x = random(-offset, canvas.width * 0.4);
        this.y = canvas.height + offset - t * (canvas.height + offset * 2);
        this.length = random(100, 250);
        this.angle = Math.PI / 4;
        this.speed = random(0.5, 2);
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > canvas.width + 200 || this.y < -200) Object.assign(this, new Pipe());
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 25;
        ctx.stroke();
      }
    }

    for (let i = 0; i < 100; i++) pipes.push(new Pipe());

    function animate() {
      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      pipes.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
