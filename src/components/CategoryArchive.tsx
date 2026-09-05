import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import AnimatedPostGrid from "@/components/AnimatedPostGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import FadeIn from "@/components/motion/FadeIn";
import {
  FALLBACK_CATEGORY_TREE,
  findCatalogChild,
  getCategoryTree,
} from "@/lib/categories";
import { buildSiteMetadata, getSiteName, getSiteUrl } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
} from "@/lib/schema/builders";
import { SCHEMA_CONTEXT } from "@/lib/schema/constants";
import {
  getCategoryBySlug,
  getPostsByCategory,
  mergePinnedCategoryPosts,
} from "@/lib/wordpress";

interface CategoryArchiveProps {
  parentSlug: "apps" | "games";
  childPath?: string;
}

export async function generateCategoryArchiveMetadata({
  parentSlug,
  childPath,
}: CategoryArchiveProps): Promise<Metadata> {
  const catalogChild = childPath
    ? findCatalogChild(parentSlug, childPath)
    : null;
  const wpSlug = catalogChild?.slug || childPath || parentSlug;
  const path = childPath ? `/${parentSlug}/${childPath}` : `/${parentSlug}`;

  try {
    const category = await getCategoryBySlug(wpSlug);
    const name =
      category?.name ||
      catalogChild?.name ||
      (childPath ? undefined : parentSlug === "apps" ? "Apps" : "Games");
    if (!name) return {};
    return buildSiteMetadata(
      name,
      category?.description || `APK guides in ${name} on APK Junction.`,
      path
    );
  } catch {
    const name =
      catalogChild?.name || (parentSlug === "apps" ? "Apps" : "Games");
    return buildSiteMetadata(
      name,
      `APK guides in ${name} on APK Junction.`,
      path
    );
  }
}

export default async function CategoryArchive({
  parentSlug,
  childPath,
}: CategoryArchiveProps) {
  const tree = await getCategoryTree();
  const group =
    tree.find((item) => item.slug === parentSlug) ||
    FALLBACK_CATEGORY_TREE.find((item) => item.slug === parentSlug);
  if (!group) notFound();

  const liveChild = childPath
    ? group.children.find(
        (item) =>
          item.slug === childPath ||
          item.href === `/${parentSlug}/${childPath}`
      )
    : undefined;
  const catalogChild = childPath
    ? findCatalogChild(parentSlug, childPath)
    : null;

  if (childPath && !liveChild && !catalogChild) notFound();

  const wpSlug = liveChild?.slug || catalogChild?.slug || childPath || parentSlug;
  const category = await getCategoryBySlug(wpSlug).catch(() => null);
  const name =
    category?.name ||
    liveChild?.name ||
    catalogChild?.name ||
    group.name;
  const description = category?.description || "";
  const fetched = category
    ? await getPostsByCategory(category.id).catch(() => [])
    : [];
  const posts = await mergePinnedCategoryPosts(wpSlug, fetched);
  const children = childPath ? [] : group.children;
  const path = childPath ? `/${parentSlug}/${childPath}` : `/${parentSlug}`;
  const pageUrl = `${getSiteUrl().replace(/\/$/, "")}${path}`;

  const breadcrumbs = [
    { label: getSiteName(), href: "/" },
    ...(childPath ? [{ label: group.name, href: group.href }] : []),
    { label: name },
  ];

  const schemaGraph = {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildBreadcrumbSchema(breadcrumbs, pageUrl),
      buildCollectionPageSchema(
        pageUrl,
        name,
        description || `APK guides in ${name} on APK Junction.`,
        posts.map((post) => `${getSiteUrl().replace(/\/$/, "")}/${post.slug}`)
      ),
    ],
  };

  return (
    <SiteLayout>
      <JsonLd data={schemaGraph} />
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight text-white">{name}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-body">{description}</p>
          ) : (
            <p className="mt-2 max-w-2xl text-body">
              {children.length > 0
                ? `Browse ${name} on APK Junction — Android APKs grouped for readers in Pakistan.`
                : `App and game guides filed under ${name}.`}
            </p>
          )}
        </FadeIn>

        {children.length > 0 && (
          <FadeIn className="mt-8">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={child.href}
                    className="panel block rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:border-accent hover:text-accent-bright"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        {posts.length === 0 ? (
          children.length === 0 && (
            <p className="mt-10 text-muted">No posts in this category yet.</p>
          )
        ) : (
          <AnimatedPostGrid
            posts={posts}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          />
        )}
      </div>
    </SiteLayout>
  );
}
