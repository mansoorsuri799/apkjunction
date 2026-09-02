"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedOrbs() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"
      animate={{ opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
