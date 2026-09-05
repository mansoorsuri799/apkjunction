import { redirect } from "next/navigation";
import { findCatalogCategory } from "@/lib/categories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyCategoryRedirect({ params }: PageProps) {
  const { slug } = await params;
  const catalog = findCatalogCategory(slug);
  if (catalog?.entry.href) {
    redirect(catalog.entry.href);
  }
  redirect("/");
}
