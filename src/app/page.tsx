import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import PostColumn from "@/components/PostColumn";
import SiteInfoTable from "@/components/SiteInfoTable";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { BRAND } from "@/lib/brand";
import { getCategoryBySlug, getPosts, getPostsByCategory } from "@/lib/wordpress";

export const revalidate = 3600;

const features = [
  {
    title: "Install path, not a file dump",
    description:
      "Each guide walks through the APK you are considering: version notes, permission prompts, and the first-launch screens Pakistani users actually see.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9M12 12 3 7.5M12 12l9-4.5" />
      </svg>
    ),
  },
  {
    title: "JazzCash and Easypaisa in context",
    description:
      "We explain how deposits and withdrawals are described in the app, what limits usually appear, and which steps fail when a wallet name or CNIC does not match.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    title: "Risks sit next to the download",
    description:
      "If an app can freeze withdrawals, change bonus rules, or ask for extra permissions, that warning stays in the same article as the install steps.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Rewritten when the app changes",
    description:
      "When a package name, login flow, or payout screen changes, we update the guide instead of leaving a stale “latest APK” label on last year’s steps.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

const stats = [
  { value: "Editorial", label: "Written guides" },
  { value: "Free", label: "To read on-site" },
  { value: "PK", label: "Pakistan first" },
];

export default async function HomePage() {
  let teenPattiPosts: Awaited<ReturnType<typeof getPostsByCategory>> = [];
  let earningGamesPosts: Awaited<ReturnType<typeof getPostsByCategory>> = [];
  let wpConnected = true;

  try {
    const [teenPattiCategory, earningGamesCategory] = await Promise.all([
      getCategoryBySlug("teen-patti-games"),
      getCategoryBySlug("new-earning-games"),
    ]);

    const [teenPatti, earningGames] = await Promise.all([
      teenPattiCategory
        ? getPostsByCategory(teenPattiCategory.id)
        : Promise.resolve([]),
      earningGamesCategory
        ? getPostsByCategory(earningGamesCategory.id)
        : Promise.resolve([]),
    ]);

    teenPattiPosts = teenPatti.slice(0, 1);
    earningGamesPosts = earningGames.slice(0, 1);

    if (teenPattiPosts.length === 0 && earningGamesPosts.length === 0) {
      const latest = await getPosts({ per_page: 1 });
      earningGamesPosts = latest.slice(0, 1);
    }
  } catch (error) {
    console.error("[homepage] WordPress fetch failed:", error);
    try {
      const latest = await getPosts({ per_page: 1 });
      earningGamesPosts = latest.slice(0, 1);
      wpConnected = latest.length > 0;
    } catch (fallbackError) {
      console.error("[homepage] WordPress fallback failed:", fallbackError);
      wpConnected = false;
    }
  }

  return (
    <SiteLayout>
      <FadeIn as="section" className="relative overflow-hidden border-b border-border py-14 sm:py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-3.5 py-1.5 text-xs font-medium text-body">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                APK Junction · {BRAND.domain}
              </div>

              <h1 className="mt-6 text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                A clearer path to{" "}
                <span className="text-accent">Android APKs in Pakistan</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
                APK Junction is the stop before you tap install. Compare the
                guide, the payment notes, and the risk flags on one page — then
                decide if that APK is worth your time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/blog"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm"
                >
                  Open the guide library
                </Link>
                <Link
                  href="/about-us"
                  className="btn-secondary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm"
                >
                  How APK Junction works
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:max-w-lg">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <FadeIn delay={0.12} className="lg:pl-2">
              <SiteInfoTable />
            </FadeIn>
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" className="border-b border-border py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Guide library</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Current APK paths we are covering
              </h2>
              <p className="mt-2 max-w-xl text-body">
                Teen Patti and earning-game guides published for readers on{" "}
                {BRAND.domain}. Each article is a standalone install path, not a
                recycled doorway page.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 text-sm font-semibold text-accent transition hover:text-accent-bright"
            >
              Browse every guide →
            </Link>
          </div>

          {!wpConnected ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
              <p className="font-semibold text-amber-100">Guides are being published</p>
              <p className="mt-2 text-sm text-amber-200/80">
                New APK Junction articles appear here as soon as the CMS is connected.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <PostColumn
                title="Teen Patti Games"
                description="Card-game APKs with install notes and payout caveats"
                categorySlug="teen-patti-games"
                posts={teenPattiPosts}
              />
              <PostColumn
                title="New Earning Games"
                description="Play-to-earn apps reviewed for Pakistani wallets"
                categorySlug="new-earning-games"
                posts={earningGamesPosts}
              />
            </div>
          )}
        </div>
      </FadeIn>

      <FadeIn as="section" className="border-b border-border bg-surface-alt py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Why this junction</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Built to help you decide, not to rush the tap
            </h2>
            <p className="mt-3 text-body">
              APK Junction publishes long-form guides with a single job: give you
              enough context to walk away or continue. We do not host games or
              move money.
            </p>
          </div>

          <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <StaggerItem
                key={feature.title}
                className="panel group rounded-2xl p-6 transition hover:border-accent/60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-accent">
                  {feature.icon}
                </div>
                <h3 className="mt-5 font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {feature.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      <FadeIn as="section" className="border-b border-border py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="section-label">Editorial stance</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                The meeting point between curiosity and install
              </h2>
              <p className="mt-5 leading-relaxed text-body">
                APK Junction is an independent desk in Pakistan. We research
                Android earning apps and card games, write the install path in
                plain English, and keep JazzCash, Easypaisa, and bank-transfer
                notes next to the download — not buried in a footer.
              </p>
              <p className="mt-4 leading-relaxed text-body">
                We are not a casino, wallet, or app store. If a title looks
                unsafe, outdated, or too thin to review honestly, it does not
                get a polished “download now” treatment.
              </p>
              <Link
                href="/who-we-are"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-bright"
              >
                Read the editorial process
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="panel rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">What stays on every guide</h3>
              <ul className="mt-5 space-y-3.5 text-sm text-body">
                {[
                  "What the APK is for, and who it is not for",
                  "Install and first-login steps with local wallet names",
                  "A short list of limits, bans, and payout delays we have seen",
                  "A reminder that earnings are never promised",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-raised text-xs text-accent">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/responsible-gaming"
                className="btn-secondary mt-7 block rounded-xl px-4 py-3.5 text-center text-sm"
              >
                Responsible play notes
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" className="py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="panel rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-14">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Found a broken step or a new APK to review?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-body">
                Send the article URL and what changed. Corrections keep the
                junction useful for the next reader.
              </p>
              <Link
                href="/contact-us"
                className="btn-primary mt-8 inline-flex rounded-xl px-8 py-3.5 text-sm"
              >
                Write to APK Junction
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </SiteLayout>
  );
}
