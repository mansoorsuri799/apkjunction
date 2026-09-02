import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "Disclaimer",
  "APK Junction disclaimer: informational guides only, no earnings promise, and third-party APK risk on apkjunction.com.pk.",
  "/disclaimer"
);

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Read this before you follow an install path."
    >
      <p>
        Everything on <strong>{BRAND.domain}</strong> is general information.
        Using APK Junction means you accept the limits below.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Not advice</h2>
      <p>
        Guides are not financial, legal, or tax advice. Wallet names, bonus
        numbers, and KYC rules inside an app can change overnight. Confirm the
        current terms in the app or with the developer before you deposit.
      </p>
      <h2 className="text-xl font-semibold text-foreground">No income claim</h2>
      <p>
        APK Junction does not say you will earn PKR from any title we cover.
        Screenshots of a withdrawal, or a reader story, are not a forecast.
        Results depend on the operator, your activity, and rules we do not
        control.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Third-party software</h2>
      <p>
        Apps and APK files belong to their owners. Sideloading can expose you to
        malware, data loss, or a banned account. We document a path we observed.
        You install at your own risk. We are not endorsed by a developer unless
        a page says so.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Accuracy</h2>
      <p>
        We try to keep steps current. We still make no warranty that a guide is
        complete or fit for your device. If a step fails, stop and check the
        developer&apos;s own channel.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Outbound links</h2>
      <p>
        A guide may point to an official site, a store listing, or a download
        host. Those destinations have their own policies. APK Junction is not
        responsible for what they collect or serve.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Liability</h2>
      <p>
        To the fullest extent Pakistani law allows, APK Junction and its writers
        are not liable for loss tied to using this Site or any app mentioned
        here — including lost funds, device damage, or account closure.
      </p>
      <p>
        Play limits are on{" "}
        <a href="/responsible-gaming" className="text-accent-bright hover:underline">
          Responsible Gaming
        </a>
        .
      </p>
    </LegalPage>
  );
}
