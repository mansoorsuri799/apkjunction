"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { defaultTransition, fadeInUp, staggerContainer } from "@/lib/motion";
import type { WPCategory } from "@/types/wordpress";

interface FeaturedImage {
  url: string;
  alt: string;
}

interface AnimatedPostHeroProps {
  title: string;
  excerpt?: string;
  date: string;
  modified: string;
  categories: WPCategory[];
  featured: FeaturedImage | null;
}

const staggerPassThrough = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export default function AnimatedPostHero({
  title,
  excerpt,
  date,
  modified,
  categories,
  featured,
}: AnimatedPostHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const meta = (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm">
      <time dateTime={date}>
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      {modified !== date && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated{" "}
            {new Date(modified).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </>
      )}
      {categories.map((cat) => (
        <span
          key={cat.id}
          className="rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-bright"
        >
          {cat.name}
        </span>
      ))}
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <header className="panel mb-6 rounded-2xl p-4 sm:mb-8 sm:p-6">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
              {title}
            </h1>
            {excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
                {excerpt}
              </p>
            )}
            {meta}
          </div>
          {featured && (
            <figure className="mx-auto shrink-0 sm:mx-0">
              <Image
                src={featured.url}
                alt={featured.alt}
                width={160}
                height={160}
                className="h-28 w-28 rounded-xl object-cover sm:h-36 sm:w-36 sm:rounded-2xl"
                priority
              />
            </figure>
          )}
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className="panel mb-6 rounded-2xl p-4 sm:mb-8 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div
        className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5"
        variants={staggerPassThrough}
      >
        <motion.div className="min-w-0 flex-1" variants={staggerPassThrough}>
          <motion.h1
            className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl"
            variants={fadeInUp}
            transition={defaultTransition}
          >
            {title}
          </motion.h1>

          {excerpt && (
            <motion.p
              className="mt-3 text-sm leading-relaxed text-body sm:text-base"
              variants={fadeInUp}
              transition={defaultTransition}
            >
              {excerpt}
            </motion.p>
          )}

          <motion.div variants={fadeInUp} transition={defaultTransition}>
            {meta}
          </motion.div>
        </motion.div>

        {featured && (
          <motion.figure
            className="mx-auto shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:rounded-2xl"
            variants={fadeInUp}
            transition={defaultTransition}
          >
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={featured.url}
                alt={featured.alt}
                width={160}
                height={160}
                className="h-28 w-28 object-cover sm:h-36 sm:w-36"
                priority
              />
            </motion.div>
          </motion.figure>
        )}
      </motion.div>
    </motion.header>
  );
}
