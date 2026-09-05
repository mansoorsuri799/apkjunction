import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata, getSiteName } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "Contact APK Junction",
  "Email APK Junction with a broken step, an outdated screenshot, or a title you want reviewed on apkjunction.com.pk.",
  "/contact-us"
);

const contactEmail = BRAND.email;

export default function ContactUsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs
          items={[
            { label: getSiteName(), href: "/" },
            { label: "Contact Us" },
          ]}
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Contact APK Junction
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-body">
              Use email for a correction, a missing screenshot, or a title you
              think deserves a guide. We read the inbox. We do not recover
              third-party app or game accounts.
            </p>

            <div className="mt-10 space-y-6">
              <div className="panel rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Editorial desk
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-2 block text-lg font-medium text-accent-bright hover:text-white"
                >
                  {contactEmail}
                </a>
              </div>

              <div className="panel rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                  When to expect a reply
                </p>
                <p className="mt-2 text-body">
                  Most notes get an answer within two to three working days.
                </p>
              </div>

              <div className="panel rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                  What helps us fix a page
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                  <li>The full APK Junction URL</li>
                  <li>The step that failed, in your own words</li>
                  <li>A screenshot of the current app screen</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="panel rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-white">Open your mail app</h2>
            <p className="mt-2 text-sm text-body">
              This starts a message with an APK Junction subject line already
              filled in.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=APK%20Junction%20-%20Guide%20note`}
              className="btn-primary mt-6 flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm"
            >
              Email the desk
            </a>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Withdrawal problems, OTPs, and banned accounts belong with the
              app&apos;s own support. We can only edit what this website says.
            </p>
            <div className="mt-8 border-t border-border-strong pt-6">
              <p className="text-sm text-muted">Useful before you write:</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/disclaimer" className="text-accent-bright hover:underline">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/responsible-gaming" className="text-accent-bright hover:underline">
                    Responsible Gaming
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-accent-bright hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="text-accent-bright hover:underline">
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
