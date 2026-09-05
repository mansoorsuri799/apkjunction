import type { Metadata } from "next";
import CategoryArchive, {
  generateCategoryArchiveMetadata,
} from "@/components/CategoryArchive";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryArchiveMetadata({ parentSlug: "apps" });
}

export default function AppsPage() {
  return <CategoryArchive parentSlug="apps" />;
}
