import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { buildSiteMetadata, getSiteDescription, getSiteTitle } from "@/lib/seo";
import { buildSiteGraph } from "@/lib/schema/builders";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildSiteMetadata(
  getSiteTitle(),
  getSiteDescription()
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK" className={`${geistSans.variable} h-full antialiased`}>
      <body
        className={`${geistSans.className} min-h-full overflow-x-hidden flex flex-col bg-background-top text-body`}
      >
        <JsonLd data={buildSiteGraph()} />
        {children}
      </body>
    </html>
  );
}
