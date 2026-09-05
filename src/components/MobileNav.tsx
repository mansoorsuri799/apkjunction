"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CategoryGroup } from "@/lib/categories";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

interface MobileNavProps {
  categories?: CategoryGroup[];
}

export default function MobileNav({ categories = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong bg-surface text-body transition hover:border-accent hover:text-accent-bright"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-14 z-40 bg-background/80 sm:top-16"
              onClick={() => setOpen(false)}
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.nav
              className="site-header-bg fixed bottom-0 left-0 right-0 top-14 z-50 overflow-y-auto px-5 py-4 shadow-xl sm:top-16"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="space-y-1 pb-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-body transition hover:bg-surface hover:text-accent-bright"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {categories.map((group) => {
                  const isOpen = expanded === group.slug;
                  return (
                    <li key={group.slug}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setExpanded((current) =>
                            current === group.slug ? null : group.slug
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-body transition hover:bg-surface hover:text-accent-bright"
                      >
                        {group.name}
                        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <ul className="mb-2 ml-3 grid grid-cols-2 gap-1 border-l border-border pl-3">
                          <li className="col-span-2">
                            <Link
                              href={group.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-2 py-2 text-sm font-semibold text-accent"
                            >
                              All {group.name}
                            </Link>
                          </li>
                          {group.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-2 py-2 text-sm text-body hover:text-accent-bright"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
