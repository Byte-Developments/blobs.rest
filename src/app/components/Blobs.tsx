'use client'

import { useEffect, useRef } from "react";

export default function DiagonalStripesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stripeWidth = canvas.width * 2;
    const stripeHeight = 20;
    const stripeSpacing = 60;
    const waveInterval = 5000;
    let lastWaveTime = 0;
    let stripes: Stripe[] = [];

    type Stripe = {
      yOffset: number;
      color1: string;
      color2: string;
      opacity: number;
      fadeIn: boolean;
    };

    const colorPairs = [
      ["rgba(255, 200, 200, 0.0)", "rgba(255, 150, 150, 0.6)"],
      ["rgba(200, 255, 250, 0.0)", "rgba(150, 220, 240, 0.6)"],
      ["rgba(230, 220, 255, 0.0)", "rgba(180, 170, 250, 0.6)"]
    ];

    function createStripe(yOffset: number, color1: string, color2: string): Stripe {
      return {
        yOffset,
        color1,
        color2,
        opacity: 0,
        fadeIn: true
      };
    }

    function spawnWave() {
      const [color1, color2] = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      const stripeCount = Math.floor((canvas?.height ?? window.innerHeight) / stripeSpacing);
      stripes = Array.from({ length: stripeCount }, (_, i) =>
        createStripe(i * stripeSpacing - (canvas?.height ?? window.innerHeight), color1, color2)
      );
    }

    function drawStripe(stripe: Stripe) {
      const gradient = ctx.createLinearGradient(0, stripe.yOffset, stripeWidth, stripe.yOffset + stripeHeight);
      gradient.addColorStop(0, stripe.color1);
      gradient.addColorStop(1, stripe.color2);

      ctx.save();
      ctx.translate(-canvas.width * 0.25, 0);
      ctx.rotate(-Math.PI / 6);
      ctx.globalAlpha = stripe.opacity;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, stripe.yOffset, stripeWidth, stripeHeight);

      // Noise overlay
      const imageData = ctx.getImageData(0, stripe.yOffset, stripeWidth, stripeHeight);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        imageData.data[i] += noise;     // R
        imageData.data[i + 1] += noise; // G
        imageData.data[i + 2] += noise; // B
      }
      ctx.putImageData(imageData, 0, stripe.yOffset);

      ctx.restore();
      ctx.globalAlpha = 1.0;
    }

    function animate(time: number) {
      ctx.fillStyle = "#11121c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (stripes.length === 0 || stripes[stripes.length - 1].yOffset > canvas.height * 2) {
        if (time - lastWaveTime > waveInterval) {
          spawnWave();
          lastWaveTime = time;
        }
      }

      stripes.forEach(stripe => {
        drawStripe(stripe);
        stripe.yOffset += 0.8;

        if (stripe.fadeIn && stripe.opacity < 0.8) {
          stripe.opacity += 0.01;
        } else if (!stripe.fadeIn && stripe.opacity > 0) {
          stripe.opacity -= 0.01;
        }

        if (stripe.yOffset > canvas.height * 1.2) {
          stripe.fadeIn = false;
        }
      });

      stripes = stripes.filter(stripe => stripe.opacity > 0);
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1] backdrop-blur-sm"
    />
  );
}
