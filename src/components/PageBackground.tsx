import AnimatedOrbs from "@/components/motion/AnimatedOrbs";
import CursorGlow from "@/components/motion/CursorGlow";

interface PageBackgroundProps {
  children: React.ReactNode;
}

export default function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="site-page-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <AnimatedOrbs />
        <CursorGlow />
      </div>
      {children}
    </div>
  );
}
