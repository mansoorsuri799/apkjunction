import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata(
  "Responsible Gaming",
  "APK Junction notes for real-money Android games: 18+ only, spend limits, and when to stop.",
  "/responsible-gaming"
);

export default function ResponsibleGamingPage() {
  return (
    <LegalPage
      title="Responsible Gaming"
      description="For titles that take real money. The rest of the catalog is still just information."
    >
      <p>
        APK Junction now covers everyday Android apps and games. This page
        applies when a guide is about real-money play — casino, card, or
        earning titles that ask for a deposit. Those apps can cost more than
        time. Treat every deposit as money you may not see again.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Age line</h2>
      <p>
        Real-money titles we cover are for people{" "}
        <strong>18 years or older</strong>. If you are younger, do not install
        those apps. Tools, social, and other non-wagering guides are still
        general information — sideload them only if you understand the risk.
      </p>
      <h2 className="text-xl font-semibold text-foreground">Rules we ask you to set first</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Decide a weekly PKR cap before you open a wallet or deposit screen</li>
        <li>Stop when the cap is hit — do not “win it back”</li>
        <li>Count bonuses as marketing, not salary</li>
        <li>Step away if a session starts to crowd out sleep, work, or family</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">Signals to take seriously</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Borrowing to play or to cover a lost deposit</li>
        <li>Hiding app use from people who share your household</li>
        <li>Irritation or panic when you cannot open the game</li>
        <li>Skipping study, a job, or bills because a session ran long</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground">What we cannot do</h2>
      <p>
        We do not run the games, so we cannot freeze an account or reverse a
        transfer. Use any limit tools the developer offers. If play is hurting
        you or someone close to you, talk to a trusted person or a local
        counselling service. Major Pakistani cities have mental-health helplines
        that can point you to further help.
      </p>
    </LegalPage>
  );
}
