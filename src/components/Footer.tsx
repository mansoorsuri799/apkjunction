import Link from "next/link";
import Image from "next/image";
import type { CategoryGroup } from "@/lib/categories";
import { FALLBACK_CATEGORY_TREE } from "@/lib/categories";
import { getSiteName } from "@/lib/seo";

const footerLinks = {
  company: [
    { href: "/about-us", label: "About Us" },
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/contact-us", label: "Contact Us" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/dmca", label: "DMCA" },
    { href: "/responsible-gaming", label: "Responsible Gaming" },
  ],
};

interface FooterProps {
  categories?: CategoryGroup[];
}

export default function Footer({
  categories = FALLBACK_CATEGORY_TREE,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/80 bg-background/90 text-body">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/favicon/favicon.svg"
                alt={`${getSiteName()} mark`}
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <span className="text-lg font-bold text-white">{getSiteName()}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Editorial APK guides for Android apps and games in Pakistan —
              install paths, permissions, and risk flags on apkjunction.com.pk.
            </p>
          </div>

          {categories.map((group) => (
            <div key={group.slug}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {group.name}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href={group.href} className="hover:text-accent-bright transition-colors">
                    All {group.name}
                  </Link>
                </li>
                {group.children.slice(0, 7).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-accent-bright transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-bright transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-bright transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {year} {getSiteName()}. All rights reserved.
          </p>
          <p className="text-xs text-muted-dim">
            Sideload at your own risk · 18+ for real-money titles · Not affiliated
            with app developers
          </p>
        </div>
      </div>
    </footer>
  );
}
