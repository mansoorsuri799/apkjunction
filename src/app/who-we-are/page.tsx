import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "Who We Are",
  "How the APK Junction desk researches Android apps and games, writes guides, and updates pages for readers in Pakistan.",
  "/who-we-are"
);

export default function WhoWeArePage() {
  return (
    <LegalPage
      title="Who We Are"
      description={`The people who keep ${BRAND.domain} honest.`}
    >
      <p>
        APK Junction is a small editorial team in Pakistan. We spend time inside
        the apps and games we write about: install, open the first-run screens,
        and note what actually happens. If the title has a wallet or an in-app
        pay wall, we open that too. The site is the public notebook from that
        work.
      </p>
      <h2 className="text-xl font-semibold text-foreground">How a guide is made</h2>
      <p>
        We start from a real search a reader would type — an app or game name
        plus APK, or a first-run question. Then we install the build we are
        documenting, capture the first-run path, and write the steps in the
        order a new user meets them. If a permission is mandatory, a login is
        locked, or a payment screen is the only way forward, that fact stays in
        the article.
      </p>
      <h2 className="text-xl font-semibold text-foreground">How we stay independent</h2>
      <p>
        Reviews are not sold to developers. If a page ever carries a paid
        placement or an affiliate download, the relationship will be labelled on
        that page. Silent cloaking — sending readers to a tracker while the
        visible button says something else — is not how APK Junction works.
      </p>
      <h2 className="text-xl font-semibold text-foreground">How we treat updates</h2>
      <p>
        When a login screen, package size, or in-app rule changes, we edit the
        existing guide. We do not leave a “2026” badge on a stale walkthrough.
        Dates on legal pages and sitemaps follow the real edit, not a keyword
        season.
      </p>
      <p>
        If a step on this site is wrong, email{" "}
        <a href={`mailto:${BRAND.email}`} className="text-accent-bright hover:underline">
          {BRAND.email}
        </a>{" "}
        with the URL and a screenshot.
      </p>
    </LegalPage>
  );
}
