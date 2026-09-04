import Link from "next/link";
import Image from "next/image";
import { getSiteDomain, getSiteName } from "@/lib/seo";

const footerLinks = {
  guides: [
    { href: "/blog", label: "All Guides" },
    { href: "/category/teen-patti-games", label: "Teen Patti Games" },
    { href: "/category/new-earning-games", label: "New Earning Games" },
  ],
  company: [
    { href: "/about-us", label: "About Us" },
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/contact-us", label: "Contact Us" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/responsible-gaming", label: "Responsible Gaming" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/80 bg-background/90 text-body">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/favicon/favicon.svg"
                alt={`${getSiteName()} mark`}
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <span className="text-lg font-bold text-white">{getSiteDomain()}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Editorial APK guides for Pakistani Android users — install paths,
              wallet notes, and risk flags on apkjunction.com.pk.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Guides
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-bright transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
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
            18+ only · Play responsibly · Not affiliated with game developers
          </p>
        </div>
      </div>
    </footer>
  );
}
