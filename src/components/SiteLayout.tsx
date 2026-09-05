import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import FadeIn from "@/components/motion/FadeIn";
import { getCategoryTree } from "@/lib/categories";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const categories = await getCategoryTree();

  return (
    <PageBackground>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <FadeIn>
        <Footer categories={categories} />
      </FadeIn>
    </PageBackground>
  );
}
