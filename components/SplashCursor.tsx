"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  start: number;
  duration: number;
};

const SplashCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles = useRef<Bubble[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current = bubbles.current.filter((b) => {
        const progress = (timestamp - b.start) / b.duration;
        if (progress >= 1) return false;

        const eased = easeOut(progress);
        const radius = 4 + 5 * eased;
        const alpha = 1 - eased;

        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130,130,130,${alpha.toFixed(2)})`;
        ctx.fill();

        return true;
      });

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    const handleClick = (e: MouseEvent) => {
      bubbles.current.push({
        x: e.clientX,
        y: e.clientY,
        start: performance.now(),
        duration: 500, //миллисекунд
      });
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default SplashCursor;
