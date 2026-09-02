"use client";

import Link from "next/link";
import PostCard from "@/components/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import type { WPPost } from "@/types/wordpress";

interface PostColumnProps {
  title: string;
  description: string;
  categorySlug: string;
  posts: WPPost[];
}

export default function PostColumn({
  title,
  description,
  categorySlug,
  posts,
}: PostColumnProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-dim">{description}</p>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="shrink-0 text-xs font-medium text-accent-bright hover:text-white"
        >
          View all →
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="panel rounded-lg px-3 py-5 text-center text-xs text-muted">
          New guides coming soon.
        </p>
      ) : (
        <StaggerContainer className="flex flex-col gap-2">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <PostCard post={post} compact />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
