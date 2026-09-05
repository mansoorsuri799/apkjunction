"use client";

import Link from "next/link";
import type { CategoryGroup } from "@/lib/categories";

interface CategoryMenuProps {
  groups: CategoryGroup[];
}

export default function CategoryMenu({ groups }: CategoryMenuProps) {
  return (
    <div className="hidden items-center gap-1 lg:flex">
      {groups.map((group) => (
        <div key={group.slug} className="group relative">
          <Link
            href={group.href}
            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-body transition-colors hover:text-accent-bright"
          >
            {group.name}
            <svg
              className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-bright"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <div className="invisible absolute left-1/2 top-full z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
            <div className="panel overflow-hidden rounded-2xl p-5">
              <Link
                href={group.href}
                className="section-label inline-block border-b-2 border-accent pb-1"
              >
                {group.name}
              </Link>
              <ul className="mt-4 grid grid-cols-3 gap-x-6 gap-y-1.5">
                {group.children.map((child) => (
                  <li key={child.slug}>
                    <Link
                      href={child.href}
                      className="block rounded-lg px-2 py-1.5 text-sm text-body transition hover:bg-surface-raised hover:text-accent-bright"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
