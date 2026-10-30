"use client";

import React, { useEffect, useRef } from "react";

interface PlumeNode {
  // Relative coordinates (0.0 to 1.0 of canvas dimensions)
  baseX: number;
  baseY: number;
  ampX: number;
  ampY: number;
  freqX: number;
  freqY: number;
  phase: number;
  baseRadius: number; // in px
  ampRadius: number;
  freqRadius: number;
  // Color configuration
  colorInner: string;
  colorMid: string;
  colorOuter: string;
  maxAlpha: number;
}

export default function HeroBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Responsive setup with DevicePixelRatio
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Dynamic fluid smoke nodes configured with Increase.com's exact brand palette:
    // Electric Mint (#31F2BF), Medium Mint (#87FAD4), Sky Blue (#34BCFF), Cool Slate Line (#D5DEE5)
    const plumes: PlumeNode[] = [
      // 1. Primary Left Billow (Increase Electric Mint smoke plume curling from left margin)
      {
        baseX: 0.12,
        baseY: 0.38,
        ampX: 0.08,
        ampY: 0.12,
        freqX: 0.0006,
        freqY: 0.0008,
        phase: 0,
        baseRadius: 380,
        ampRadius: 80,
        freqRadius: 0.0007,
        colorInner: "rgba(49, 242, 191, 0.30)",
        colorMid: "rgba(135, 250, 212, 0.18)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.9,
      },
      // 2. Center-Left Swirl (Sky Blue & Mint, drifting behind the main heading)
      {
        baseX: 0.28,
        baseY: 0.45,
        ampX: 0.09,
        ampY: 0.09,
        freqX: 0.0007,
        freqY: 0.0005,
        phase: 2.1,
        baseRadius: 420,
        ampRadius: 90,
        freqRadius: 0.0008,
        colorInner: "rgba(52, 188, 255, 0.22)",
        colorMid: "rgba(189, 255, 230, 0.16)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.85,
      },
      // 3. Lower Rolling Plume (Flows underneath the CTAs and guarantees across width)
      {
        baseX: 0.22,
        baseY: 0.78,
        ampX: 0.12,
        ampY: 0.08,
        freqX: 0.0005,
        freqY: 0.0007,
        phase: 4.3,
        baseRadius: 440,
        ampRadius: 100,
        freqRadius: 0.0006,
        colorInner: "rgba(49, 242, 191, 0.22)",
        colorMid: "rgba(52, 188, 255, 0.14)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.8,
      },
      // 4. Center Top Ethereal Drift (Behind the CPD badge and upper headline)
      {
        baseX: 0.48,
        baseY: 0.22,
        ampX: 0.08,
        ampY: 0.07,
        freqX: 0.0004,
        freqY: 0.0006,
        phase: 1.5,
        baseRadius: 360,
        ampRadius: 70,
        freqRadius: 0.0005,
        colorInner: "rgba(135, 250, 212, 0.22)",
        colorMid: "rgba(213, 222, 229, 0.16)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.75,
      },
      // 5. Center-Right Ambient Bloom (Ensures harmonious transition across center)
      {
        baseX: 0.62,
        baseY: 0.55,
        ampX: 0.1,
        ampY: 0.1,
        freqX: 0.0006,
        freqY: 0.0005,
        phase: 3.4,
        baseRadius: 390,
        ampRadius: 80,
        freqRadius: 0.0007,
        colorInner: "rgba(52, 188, 255, 0.18)",
        colorMid: "rgba(227, 255, 243, 0.14)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.7,
      },
      // 6. Right Side Soft Vapor (Behind the review badge and right margin)
      {
        baseX: 0.84,
        baseY: 0.35,
        ampX: 0.07,
        ampY: 0.11,
        freqX: 0.0005,
        freqY: 0.0006,
        phase: 5.2,
        baseRadius: 380,
        ampRadius: 70,
        freqRadius: 0.0008,
        colorInner: "rgba(49, 242, 191, 0.18)",
        colorMid: "rgba(213, 222, 229, 0.12)",
        colorOuter: "rgba(237, 241, 245, 0.0)",
        maxAlpha: 0.65,
      },
    ];

    const startTime = performance.now();

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Clear previous canvas frame
      ctx.clearRect(0, 0, width, height);

      // Render each plume with continuous mathematical radial falloff:
      // Guaranteed zero seams, zero clipping boxes, and zero tile boundaries
      for (let i = 0; i < plumes.length; i++) {
        const p = plumes[i];

        // Harmonic organic flow equations
        const cx =
          (p.baseX + Math.sin(elapsed * p.freqX + p.phase) * p.ampX) * width;
        const cy =
          (p.baseY + Math.cos(elapsed * p.freqY + p.phase * 1.3) * p.ampY) *
          height;

        // Scale radius relative to screen size (scales down gracefully on mobile)
        const scaleFactor = Math.min(Math.max(width / 1200, 0.65), 1.35);
        const dynamicRadius =
          (p.baseRadius +
            Math.sin(elapsed * p.freqRadius + p.phase * 0.7) * p.ampRadius) *
          scaleFactor;

        // Smooth continuous radial gradient with gentle cubic falloff
        const grad = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(dynamicRadius, 20)
        );

        grad.addColorStop(0, p.colorInner);
        grad.addColorStop(0.42, p.colorMid);
        grad.addColorStop(1, p.colorOuter);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(dynamicRadius, 20), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{
        display: "block",
      }}
    />
  );
}
