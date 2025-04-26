"use client";

import { useEffect, useRef } from "react";

export default function NeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

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
        this.x = random(-offset, canvas.width * 0.4 / dpr);
        this.y = canvas.height / dpr + offset - t * (canvas.height / dpr + offset * 2);
        this.length = random(100, 250);
        this.angle = Math.PI / 4;
        this.speed = random(0.5, 2);
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > canvas.width / dpr + 200 || this.y < -200) Object.assign(this, new Pipe());
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
      }
    }

    for (let i = 0; i < 60; i++) pipes.push(new Pipe());

    let lastTime = 0;
    function animate(time = 0) {
      const delta = time - lastTime;
      lastTime = time;
      if (delta < 1000 / 30) {
        requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      pipes.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
