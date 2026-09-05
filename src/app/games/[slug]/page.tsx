import type { Metadata } from "next";
import CategoryArchive, {
  generateCategoryArchiveMetadata,
} from "@/components/CategoryArchive";
import {
  categoryPathSegment,
  getCategoryTree,
  getChildPathSlugs,
} from "@/lib/categories";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const catalog = getChildPathSlugs("games");
  try {
    const tree = await getCategoryTree();
    const live = tree
      .find((group) => group.slug === "games")
      ?.children.map((child) => categoryPathSegment(child.slug, "games")) ?? [];
    return [...new Set([...catalog, ...live])].map((slug) => ({ slug }));
  } catch {
    return catalog.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateCategoryArchiveMetadata({ parentSlug: "games", childPath: slug });
}

export default async function GamesCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryArchive parentSlug="games" childPath={slug} />;
}
