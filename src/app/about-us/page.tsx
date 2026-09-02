import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "About APK Junction",
  "APK Junction is an independent editorial desk on apkjunction.com.pk. We write Android APK install paths for readers in Pakistan.",
  "/about-us"
);

export default function AboutUsPage() {
  return (
    <LegalPage
      title="About APK Junction"
      description="Why this site exists and where the line is drawn."
    >
      <p>
        <strong>APK Junction</strong> publishes on {BRAND.domain}. The name is
        literal: this is a meeting point, not an app store. Readers arrive
        curious about an Android APK. They leave with an install path, wallet
        notes, and enough caveats to decide without being rushed.
      </p>
      <h2 className="text-xl font-semibold text-foreground">What the desk does</h2>
      <p>
        We research Teen Patti titles, earning games, and related Android apps
        that Pakistani users search for. A finished guide usually includes the
        package context, the screens you tap after install, and how JazzCash or
        Easypaisa appear inside that app — if they appear at all.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Write original install and first-login walkthroughs</li>
        <li>Record payout wording as the app shows it, not as a slogan</li>
        <li>Flag permission prompts, KYC asks, and withdrawal delays</li>
        <li>Refresh a page when the APK flow or policy changes</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">What the desk does not do</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>We do not operate tables, slots, or any live game</li>
        <li>We do not hold deposits or pay withdrawals</li>
        <li>We do not promise income, bonuses, or “sure win” results</li>
        <li>We are not the developer unless a page says so in plain language</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">Who it is for</h2>
      <p>
        Adults in Pakistan who want English-language APK guidance before they
        sideload an app. The site is written in English. We do not claim a
        second language we do not ship.
      </p>
      <p>
        Editorial standards live on{" "}
        <a href="/who-we-are" className="text-accent-bright hover:underline">
          Who We Are
        </a>
        . Corrections go to{" "}
        <a href="/contact-us" className="text-accent-bright hover:underline">
          Contact
        </a>
        .
      </p>
    </LegalPage>
  );
}
