import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import FadeIn from "@/components/motion/FadeIn";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <PageBackground>
      <Header />
      <main className="flex-1">{children}</main>
      <FadeIn>
        <Footer />
      </FadeIn>
    </PageBackground>
  );
}
