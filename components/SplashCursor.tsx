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
  const cursorRef = useRef<HTMLDivElement>(null);
  const bubbles = useRef<Bubble[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const cursor = cursorRef.current!;
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

    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", handlePointerMove);

    const handleClick = (e: MouseEvent) => {
      bubbles.current.push({
        x: e.clientX,
        y: e.clientY,
        start: performance.now(),
        duration: 500,
      });
    };
    window.addEventListener("click", handleClick);

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current = bubbles.current.filter((b) => {
        const progress = (timestamp - b.start) / b.duration;
        if (progress >= 1) return false;
        const eased = easeOut(progress);
        const radius = 5 + 5 * eased;
        const alpha = 1 - eased;

        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${alpha.toFixed(2)})`;
        ctx.fill();

        return true;
      });

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-40"
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-50 w-5 h-5 rounded-full 
        border border-purple-500 bg-purple-500/20 
        shadow-[0_0_8px_#a855f7] pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default SplashCursor;
