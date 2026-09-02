import Link from "next/link";
import Image from "next/image";
import type { WPPost } from "@/types/wordpress";
import {
  cleanExcerpt,
  getFeaturedImage,
  getPostCategories,
  stripHtml,
} from "@/lib/wordpress-utils";

interface PostCardProps {
  post: WPPost;
  compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
  const featured = getFeaturedImage(post);
  const categories = getPostCategories(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = cleanExcerpt(post.excerpt.rendered);

  if (compact) {
    return (
      <article className="panel group rounded-lg transition hover:border-accent hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)]">
        <Link href={`/${post.slug}`} className="flex items-center gap-3 p-2.5">
          {featured ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-raised">
              <Image
                src={featured.url}
                alt={featured.alt}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-md bg-surface-raised" />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent-bright">
              {title}
            </h2>
            <time dateTime={post.date} className="mt-1 block text-xs text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="panel group overflow-hidden rounded-xl transition hover:border-accent hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)]">
      <Link href={`/${post.slug}`} className="block">
        {featured ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-surface-raised">
            <Image
              src={featured.url}
              alt={featured.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-surface-raised" />
        )}

        <div className="p-5">
          {categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent-bright"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-accent-bright">
            {title}
          </h2>

          {excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">
              {excerpt}
            </p>
          )}

          <time
            dateTime={post.date}
            className="mt-3 block text-xs text-muted"
          >
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </Link>
    </article>
  );
}
