"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import MobileNav from "@/components/MobileNav";
import { getSiteDomain, getSiteName } from "@/lib/seo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Guides" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export default function Header() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.header
      className="site-header-bg sticky top-0 z-50"
      initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/favicon/favicon.svg"
            alt={`${getSiteName()} mark`}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg sm:h-9 sm:w-9"
            unoptimized
          />
          <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">
            {getSiteDomain()}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-body lg:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent-bright"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </motion.header>
  );
}
