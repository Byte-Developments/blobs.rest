"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  color1: string;
  color2: string;
  opacity: number;
  targetOpacity: number;
  phase: number;
  pulseOffset: number;
  anchorX: number;
  anchorY: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
};

export default function FallingBlobsCanvas({ mouse }: { mouse: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current!;
    const ctx = canvasEl.getContext("2d")!;
    let animationFrameId: number;

    function resizeCanvas() {
      const el = canvasRef.current;
      if (!el) return;
      el.width = window.innerWidth;
      el.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let mouse = { x: canvasEl.width / 2, y: canvasEl.height / 2 };
    canvasEl.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    const gradients = [
      ["#ffe0e0", "#ffb3b3"],
      ["#e0f7ff", "#b3e5fc"],
      ["#f5e8ff", "#dab6ff"],
      ["#fff6e0", "#ffe0a3"]
    ];

    const blobs: Blob[] = [];
    const particles: Particle[] = [];
    const baseBlobs = Math.max(5, Math.floor(window.innerWidth / 150));
    const maxBlobs = baseBlobs + 5;
    const numParticles = 100;

    function createBlob(): Blob {
      const [color1, color2] = gradients[Math.floor(Math.random() * gradients.length)];
      const anchorX = window.innerWidth * (0.1 + Math.random() * 0.8);
      const anchorY = window.innerHeight * (0.1 + Math.random() * 0.8);
      return {
        x: anchorX,
        y: anchorY,
        radius: 30 + Math.random() * 50,
        speed: 0.2 + Math.random() * 0.3,
        drift: (Math.random() - 0.5) * 0.3,
        color1,
        color2,
        opacity: 0,
        targetOpacity: 0.4 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        pulseOffset: Math.random() * 100,
        anchorX,
        anchorY
      };
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * canvasEl.width,
        y: Math.random() * canvasEl.height,
        size: Math.random() * 2,
        alpha: 0.05 + Math.random() * 0.1,
        speedY: 0.1 + Math.random() * 0.3
      };
    }

    for (let i = 0; i < baseBlobs; i++) blobs.push(createBlob());
    for (let i = 0; i < numParticles; i++) particles.push(createParticle());

    let glowPhase = 0;
    let spawnTimer = 0;

    function drawBackgroundGradient() {
      const gradient = ctx.createLinearGradient(0, 0, canvasEl.width, canvasEl.height);
      gradient.addColorStop(0, "#10121b");
      gradient.addColorStop(0.5, "#181c2b");
      gradient.addColorStop(1, "#0f111a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    }

    function drawBlob(blob: Blob, time: number) {
      const pulse = 1 + Math.sin((time / 1000 + blob.pulseOffset) * 2) * 0.05;
      ctx.save();
      ctx.translate(blob.x, blob.y);
      ctx.scale(pulse, pulse);
      const gradient = ctx.createRadialGradient(0, 0, blob.radius * 0.3, 0, 0, blob.radius);
      gradient.addColorStop(0, blob.color1);
      gradient.addColorStop(1, blob.color2);
      ctx.beginPath();
      ctx.arc(0, 0, blob.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = blob.opacity;
      ctx.fill();
      ctx.restore();
    }

    function drawParticles() {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
        p.y += p.speedY;
        if (p.y > canvasEl.height) {
          p.y = 0;
          p.x = Math.random() * canvasEl.width;
        }
      });
    }

    function drawBackgroundGlow() {
      const glowStrength = (Math.sin(glowPhase) + 1) / 2 * 0.2 + 0.05;
      const glow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        canvasEl.width * 0.5
      );
      glow.addColorStop(0, `rgba(255, 255, 255, ${glowStrength})`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    }

    function updateBlob(blob: Blob, index: number) {
      blob.phase += 0.01;
      blob.opacity += (blob.targetOpacity - blob.opacity) * 0.02;

      const attraction = 0.005;
      const dx = mouse.x - blob.anchorX;
      const dy = mouse.y - blob.anchorY;

      blob.x = blob.anchorX + Math.sin(blob.phase) * 5 + dx * attraction;
      blob.y = blob.anchorY + Math.cos(blob.phase) * 5 + dy * attraction;

      if (
        blob.x + blob.radius < 0 ||
        blob.x - blob.radius > canvasEl.width ||
        blob.y - blob.radius > canvasEl.height
      ) {
        blobs.splice(index, 1);
      }
    }

    function animate(time: number) {
      drawBackgroundGradient();
      glowPhase += 0.01;
      spawnTimer++;

      if (spawnTimer > 120 && blobs.length < maxBlobs) {
        blobs.push(createBlob());
        spawnTimer = 0;
      }

      drawBackgroundGlow();
      drawParticles();
      blobs.forEach((blob, i) => {
        drawBlob(blob, time);
        updateBlob(blob, i);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm"
    />
  );
}