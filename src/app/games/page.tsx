import type { Metadata } from "next";
import CategoryArchive, {
  generateCategoryArchiveMetadata,
} from "@/components/CategoryArchive";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryArchiveMetadata({ parentSlug: "games" });
}

export default function GamesPage() {
  return <CategoryArchive parentSlug="games" />;
}
