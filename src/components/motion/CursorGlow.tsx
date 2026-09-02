"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const GLOW_SIZE = 420;

export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const visible = useRef(false);
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lerp = (from: number, to: number, amount: number) =>
      from + (to - from) * amount;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.14);
      current.current.y = lerp(current.current.y, target.current.y, 0.14);

      const el = glowRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = visible.current ? "1" : "0";
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      visible.current = true;
    };

    const onLeave = () => {
      visible.current = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (rafId.current !== undefined) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-[transform,opacity]"
      style={{
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        background:
          "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 40%, transparent 70%)",
      }}
    />
  );
}
