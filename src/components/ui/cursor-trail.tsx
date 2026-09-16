"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const TRAIL_FADE_MS = 500;
const MAX_LINE_WIDTH = 3;
const GLOW_BLUR = 12;

const DARK_COLOR = "#8ffe09";
const LIGHT_COLOR = "#2563eb";

type Point = { x: number; y: number; t: number };

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const colorRef = useRef(DARK_COLOR);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    colorRef.current = resolvedTheme === "light" ? LIGHT_COLOR : DARK_COLOR;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e: MouseEvent) => {
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };
    window.addEventListener("mousemove", handleMove);

    let rafId: number;
    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.t < TRAIL_FADE_MS,
      );
      const points = pointsRef.current;
      if (points.length < 2) return;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = GLOW_BLUR;
      ctx.shadowColor = colorRef.current;
      ctx.strokeStyle = colorRef.current;

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const age = (now - curr.t) / TRAIL_FADE_MS;
        const opacity = 1 - age;

        ctx.globalAlpha = Math.max(0, opacity);
        ctx.lineWidth = Math.max(0.5, MAX_LINE_WIDTH * opacity);
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
