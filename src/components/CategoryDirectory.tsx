import Link from "next/link";
import type { CategoryGroup, CategoryLink } from "@/lib/categories";
import type { WPPost } from "@/types/wordpress";
import PostCard from "@/components/PostCard";

interface CategoryDirectoryProps {
  groups: CategoryGroup[];
  postsBySlug?: Record<string, WPPost[]>;
}

function CategoryRow({
  title,
  href,
  posts,
}: {
  title: string;
  href: string;
  posts: WPPost[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <Link
          href={href}
          className="text-base font-semibold text-white transition hover:text-accent-bright"
        >
          {title}
        </Link>
        <Link
          href={href}
          className="shrink-0 text-xs font-medium text-accent-bright hover:text-white"
        >
          View all →
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
          New guides coming soon.
        </p>
      ) : (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-[min(16.5rem,70%)] shrink-0 snap-start sm:w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-2.25rem)/4)]"
            >
              <PostCard post={post} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryDirectory({
  groups,
  postsBySlug = {},
}: CategoryDirectoryProps) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.slug}>
          <Link
            href={group.href}
            className="section-label inline-block border-b-2 border-accent pb-1"
          >
            {group.name}
          </Link>

          <div className="mt-6 space-y-8">
            {group.children.map((child: CategoryLink) => (
              <CategoryRow
                key={child.slug}
                title={child.name}
                href={child.href}
                posts={postsBySlug[child.slug] ?? []}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
