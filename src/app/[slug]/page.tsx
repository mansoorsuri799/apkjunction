import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import WordPressContent from "@/components/WordPressContent";
import AnimatedPostHero from "@/components/AnimatedPostHero";
import PostRating from "@/components/PostRating";
import JsonLd from "@/components/JsonLd";
import FadeIn from "@/components/motion/FadeIn";
import { buildPostMetadata, getSiteName } from "@/lib/seo";
import { buildPostSchemaGraph } from "@/lib/schema/builders";
import { getPostRating } from "@/lib/rating";
import {
  getAllPostSlugs,
  getFeaturedImage,
  getPostBySlug,
  getPostCategories,
  cleanExcerpt,
  stripHtml,
} from "@/lib/wordpress";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    if (!post) return {};
    return buildPostMetadata(post, `/${slug}`);
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPostBySlug>> = null;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const featured = getFeaturedImage(post);
  const categories = getPostCategories(post);
  const postTitle = stripHtml(post.title.rendered);
  const excerpt = cleanExcerpt(post.excerpt.rendered);
  const rating = getPostRating(post);

  const breadcrumbs = [
    { label: getSiteName(), href: "/" },
    { label: "Guides", href: "/blog" },
    { label: postTitle },
  ];

  const schemaGraph = buildPostSchemaGraph(post, slug, categories, breadcrumbs);

  return (
    <SiteLayout>
      <JsonLd data={schemaGraph} />
      <article className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <FadeIn>
          <Breadcrumbs items={breadcrumbs} />
        </FadeIn>

        <AnimatedPostHero
          title={postTitle}
          excerpt={excerpt || undefined}
          date={post.date}
          modified={post.modified}
          categories={categories}
          featured={featured}
        />

        <FadeIn delay={0.12}>
          <WordPressContent
            html={post.content.rendered}
            skipLeadingH1
            excerpt={excerpt || undefined}
          />
        </FadeIn>

        <FadeIn delay={0.16}>
          <PostRating value={rating.value} count={rating.count} />
        </FadeIn>
      </article>
    </SiteLayout>
  );
}
