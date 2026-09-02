import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "Privacy Policy",
  `How APK Junction handles visitor data on ${BRAND.domain}: analytics, cookies, email, and your rights.`,
  "/privacy-policy"
);

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description={`What ${BRAND.domain} collects and what it does not.`}
    >
      <p>
        This policy applies to <strong>APK Junction</strong> when you browse{" "}
        {BRAND.domain} (the &quot;Site&quot;). It was written for this brand. It
        is not a generator template reused from another website.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Data that can reach us</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Server logs:</strong> IP address, user-agent, requested URL,
          and time. Hosting needs these to serve the page and to investigate
          abuse.
        </li>
        <li>
          <strong>Analytics (if enabled):</strong> page views, device class, and
          coarse location such as country. We use this to see which guides are
          actually read, not to build advertising profiles for sale.
        </li>
        <li>
          <strong>Cookies:</strong> optional measurement cookies if you accept
          them. You can block cookies in the browser; the guides still load.
        </li>
        <li>
          <strong>Email you send:</strong> if you write to {BRAND.email}, we
          keep the address and message long enough to reply and fix the page.
        </li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">Why we keep it</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Keep the Site online and reasonably fast</li>
        <li>See which guides need an update</li>
        <li>Answer corrections and partnership mail</li>
        <li>Meet a legal request if one arrives</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">Processors we may use</h2>
      <p>
        The public site may run on a host such as Vercel. Article media and the
        CMS live on a separate WordPress origin. Analytics, if turned on, may
        use Google. Each vendor has its own policy. We do not sell mailing lists.
      </p>
      <h2 className="text-xl font-semibold text-foreground">How long and how safe</h2>
      <p>
        Logs rotate on the host&apos;s schedule. Email threads are kept only while
        they are useful. We use HTTPS and ordinary access controls. No website
        can promise a perfect lock.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Your choices</h2>
      <p>
        Ask us to correct or delete personal data we hold from your email by
        writing to {BRAND.email}. We will reply within a reasonable time. The
        Site is for readers aged 18 and over. We do not seek data from children.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Policy changes</h2>
      <p>
        If this page changes, the date at the bottom updates. Continued use of
        the Site after a change means you have seen the new text.
      </p>
    </LegalPage>
  );
}
