import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import SiteInfoTable from "@/components/SiteInfoTable";
import CategoryDirectory from "@/components/CategoryDirectory";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { BRAND } from "@/lib/brand";
import { getCategoryTree } from "@/lib/categories";
import { getCategoryRowPosts } from "@/lib/wordpress";

export const revalidate = 3600;

const features = [
  {
    title: "First launch, not a dump link",
    description:
      "Version, permissions, and the screens after install — written for a Pakistani Android phone, not pasted as a bare APK button.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9M12 12 3 7.5M12 12l9-4.5" />
      </svg>
    ),
  },
  {
    title: "Local phones, local friction",
    description:
      "Storage warnings, Play Protect prompts, and data-heavy first runs — not a recap copied from another country’s store page.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5h3a1.5 1.5 0 0 1 1.5 1.5v18a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 21V3a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    title: "Downsides stay in the article",
    description:
      "Extra permissions, forced logins, trackers, or ads sit next to the install steps so you see them before you download.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Updated when the build changes",
    description:
      "New package name, login, or settings — we rewrite the guide. No leftover “latest APK” stamp on last year’s screenshots.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

const stats = [
  { value: "Apps", label: "And games" },
  { value: "Free", label: "To read on-site" },
  { value: "PK", label: "Pakistan first" },
];

export default async function HomePage() {
  const categoryTree = await getCategoryTree();
  const categorySlugs = categoryTree.flatMap((group) =>
    group.children.map((child) => child.slug)
  );
  let postsBySlug: Awaited<ReturnType<typeof getCategoryRowPosts>> = {};

  try {
    postsBySlug = await getCategoryRowPosts(categorySlugs);
  } catch (error) {
    console.error("[homepage] WordPress fetch failed:", error);
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
                Android apps and games,{" "}
                <span className="text-accent">explained before you install</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
                APK Junction covers everyday Android apps and games for readers
                in Pakistan — tools, social, entertainment, racing, puzzle,
                card, and more. Read the path and the catch, then decide.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/games"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm"
                >
                  Browse games
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
          <div className="mb-8">
            <p className="section-label">Browse categories</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Apps and Games
            </h2>
            <p className="mt-2 max-w-xl text-body">
              One row per subcategory. Four show at once; more stay in that
              same row and scroll sideways.
            </p>
          </div>
          <CategoryDirectory groups={categoryTree} postsBySlug={postsBySlug} />
        </div>
      </FadeIn>

      <FadeIn as="section" className="border-b border-border bg-surface-alt py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Why we publish this way</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Know the APK before it lands on your phone
            </h2>
            <p className="mt-3 text-body">
              APK Junction writes install paths for Android apps and games. We
              do not host the file or run the software.
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
                Android apps and games readers actually search for — utilities,
                social clients, entertainment, racing, puzzle, card, and the
                rest — and write the install path in plain English. Permission
                and first-run catches stay in the same article.
              </p>
              <p className="mt-4 leading-relaxed text-body">
                We are not an app store, a casino, or the developer. If a title
                looks unsafe, outdated, or too thin to review honestly, it does
                not get a polished “download now” treatment.
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
                  "Install and first-run steps on a Pakistani Android phone",
                  "Permissions, account, or payment catches when they appear",
                  "A note when we have not tested a claim the app makes",
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
                Real-money play notes
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
