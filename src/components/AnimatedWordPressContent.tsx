"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { easeOut } from "@/lib/motion";

interface AnimatedWordPressContentProps {
  html: string;
  className?: string;
}

/**
 * Renders WordPress/Kadence HTML with:
 * - Working FAQ accordion toggles
 * - Scroll-in Framer Motion on each top-level content block
 * Applies to every published post automatically.
 */
export default function AnimatedWordPressContent({
  html,
  className = "",
}: AnimatedWordPressContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Accordion behavior (Kadence JS is not loaded headless)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    root.querySelectorAll<HTMLElement>(".wp-block-kadence-accordion").forEach((accordion) => {
      const wrap = accordion.querySelector<HTMLElement>(".kt-accordion-inner-wrap");
      if (!wrap) return;

      const allowMultiple = wrap.getAttribute("data-allow-multiple-open") === "true";
      const startOpen = Number(wrap.getAttribute("data-start-open") ?? "-1");
      const panes = Array.from(
        wrap.querySelectorAll<HTMLElement>(
          ":scope > .wp-block-kadence-pane, :scope > .kt-accordion-pane"
        )
      );

      const setPaneOpen = (pane: HTMLElement, open: boolean) => {
        const panel = pane.querySelector<HTMLElement>(".kt-accordion-panel");
        const header = pane.querySelector<HTMLElement>(".kt-blocks-accordion-header");
        if (!panel) return;

        pane.classList.toggle("kt-accordion-pane-active", open);
        panel.classList.toggle("kt-accordion-panel-hidden", !open);
        panel.classList.toggle("kt-accordion-panel-active", open);
        header?.setAttribute("aria-expanded", open ? "true" : "false");
      };

      panes.forEach((pane, index) => {
        setPaneOpen(pane, startOpen >= 0 && index === startOpen);
      });

      panes.forEach((pane) => {
        const header = pane.querySelector<HTMLButtonElement>(".kt-blocks-accordion-header");
        if (!header) return;

        header.setAttribute(
          "aria-expanded",
          pane.classList.contains("kt-accordion-pane-active") ? "true" : "false"
        );

        const onClick = (event: Event) => {
          event.preventDefault();
          const isOpen = pane.classList.contains("kt-accordion-pane-active");
          if (!allowMultiple) {
            panes.forEach((other) => setPaneOpen(other, false));
          }
          setPaneOpen(pane, !isOpen);
        };

        header.addEventListener("click", onClick);
        cleanups.push(() => header.removeEventListener("click", onClick));
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  // Scroll-reveal Framer Motion on content blocks
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const blocks = Array.from(root.children) as HTMLElement[];
    if (blocks.length === 0) return;

    blocks.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.willChange = "opacity, transform";
    });

    const reveal = (el: HTMLElement, index: number) => {
      animate(
        el,
        { opacity: 1, y: 0 },
        {
          duration: 0.5,
          delay: Math.min(index * 0.03, 0.24),
          ease: easeOut,
        }
      ).then(() => {
        el.style.willChange = "auto";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const index = blocks.indexOf(el);
          reveal(el, index);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    blocks.forEach((el) => observer.observe(el));

    // Safety: never leave content stuck invisible if IO never fires
    const fallback = window.setTimeout(() => {
      blocks.forEach((el, index) => {
        if (el.style.opacity === "0") reveal(el, index);
      });
    }, 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      blocks.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.willChange = "";
      });
    };
  }, [html, prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
