import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "About APK Junction",
  "APK Junction is an independent editorial desk on apkjunction.com.pk. We write Android app and game APK guides for readers in Pakistan.",
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
        curious about an Android APK. They leave with an install path,
        permission notes, and enough caveats to decide without being rushed.
      </p>
      <h2 className="text-xl font-semibold text-foreground">What the desk does</h2>
      <p>
        We used to focus on earning games and Teen Patti titles. The desk now
        covers a wider Android catalog — everyday apps and games that Pakistani
        users search for: tools, social clients, entertainment, VPNs, racing,
        puzzle, card, and the rest of the library. A finished guide usually
        includes the package context and the screens you tap after install.
        JazzCash or Easypaisa appear only when that app actually uses them.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Write original install and first-run walkthroughs</li>
        <li>Record what the app shows, not a slogan from another site</li>
        <li>Flag permission prompts, account walls, and payment catches</li>
        <li>Refresh a page when the APK flow or policy changes</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">What the desk does not do</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>We do not operate the apps or games we write about</li>
        <li>We do not host binaries as a store or move reader money</li>
        <li>We do not promise income, bonuses, or “sure win” results</li>
        <li>We are not the developer unless a page says so in plain language</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">Who it is for</h2>
      <p>
        Adults in Pakistan who want English-language APK guidance before they
        sideload an app or a game. The site is written in English. We do not
        claim a second language we do not ship.
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
