"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { defaultTransition, defaultViewport, fadeInUp } from "@/lib/motion";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "header" | "footer";
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </Component>
  );
}
