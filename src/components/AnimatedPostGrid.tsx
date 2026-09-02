"use client";

import PostCard from "@/components/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import type { WPPost } from "@/types/wordpress";

interface AnimatedPostGridProps {
  posts: WPPost[];
  className?: string;
}

export default function AnimatedPostGrid({ posts, className }: AnimatedPostGridProps) {
  return (
    <StaggerContainer className={className}>
      {posts.map((post) => (
        <StaggerItem key={post.id}>
          <PostCard post={post} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
