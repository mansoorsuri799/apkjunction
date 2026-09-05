import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "DMCA Policy",
  `How to send a copyright complaint to APK Junction. We review notices and correct or remove pages on ${BRAND.domain} when a claim is valid.`,
  "/dmca"
);

export default function DmcaPage() {
  return (
    <LegalPage
      title="DMCA Policy"
      description="How copyright owners can ask us to fix or take down a page."
    >
      <p>
        <strong>APK Junction</strong> publishes editorial guides on{" "}
        {BRAND.domain}. The words, screenshots we capture, and layout of this
        Site belong to us unless a page says otherwise. The Android apps we
        write about belong to their owners. We do not claim those trademarks or
        binaries.
      </p>
      <p>
        This page explains how to send a copyright complaint. APK Junction is
        based in Pakistan. We still review notices in the style used by the
        U.S. Digital Millennium Copyright Act because hosts and search engines
        expect that format. A complete notice gets a faster, clearer reply.
      </p>

      <h2 className="text-xl font-semibold text-foreground">What we can change</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Remove or edit a guide, image, or paragraph on this Site</li>
        <li>Drop a screenshot we published</li>
        <li>Correct a credit or take down a page while we check a claim</li>
      </ul>
      <p>
        We cannot delete an app from a third-party store, reverse a JazzCash or
        Easypaisa transfer, or shut down a developer&apos;s own download host.
        Those requests belong with the operator, not this newsroom.
      </p>

      <h2 className="text-xl font-semibold text-foreground">What to put in a notice</h2>
      <p>
        Email <strong>{BRAND.email}</strong> with the subject line{" "}
        <strong>DMCA — {BRAND.domain}</strong> and include all of the following:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Your name, organization (if any), email, and a phone number we can
          reach during Pakistan business hours
        </li>
        <li>
          A description of the copyrighted work you say is copied — title,
          registration number if you have one, or a link to the original
        </li>
        <li>
          The exact APK Junction URL or URLs. A homepage link is not enough if
          the issue is one article
        </li>
        <li>
          A statement that you have a good-faith belief the use is not
          authorized by the owner, its agent, or the law
        </li>
        <li>
          A statement that the information is accurate, and that you are the
          owner or are authorized to act — made under penalty of perjury
        </li>
        <li>Your physical or electronic signature</li>
      </ul>
      <p>
        Incomplete mail, legal threats without those facts, or a demand to
        delist an entire category because you dislike the topic, will be
        returned for more detail.
      </p>

      <h2 className="text-xl font-semibold text-foreground">What happens next</h2>
      <p>
        We read the notice, check the page, and reply. If the claim is clear,
        we remove or rewrite the material. If we need more proof, we will ask
        once. Repeat or obviously false notices may be ignored after we record
        them. We may keep a copy of the correspondence to show a host or a
        court if asked.
      </p>

      <h2 className="text-xl font-semibold text-foreground">If you think we removed the wrong thing</h2>
      <p>
        The author of a taken-down page can write to the same address with a
        counter-notice: their name and contact details, the URL that was
        removed, a statement under penalty of perjury that the removal was a
        mistake or misidentification, and consent to handle the dispute in a
        competent Pakistani forum. We will not automatically restore a page
        just because someone asks. We restore it only if we are satisfied the
        complaint was wrong or settled.
      </p>

      <h2 className="text-xl font-semibold text-foreground">Our own copyright</h2>
      <p>
        Copying APK Junction guides onto another site, spinning the install
        steps, or scraping the full article set without permission is also a
        copyright issue. Write to {BRAND.email} if you found a clone. Linking
        to a single page with a short quotation is usually fine. Republishing
        a whole guide is not.
      </p>
    </LegalPage>
  );
}
