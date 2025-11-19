import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/SkipToContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kush Rank | Data Scientist Aspirant",
  description: "Data Scientist Aspirant specializing in real-world data projects and end-to-end pipelines",
  keywords: ["Data Science", "Data Scientist", "Machine Learning", "AI", "Portfolio"],
  authors: [{ name: "Kush Rank" }],
  openGraph: {
    title: "Kush Rank | Data Scientist Aspirant",
    description: "Data Scientist Aspirant specializing in real-world data projects and end-to-end pipelines",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-deepBlue text-slate`}
      >
        <SkipToContent />
        <CustomCursor />
        <Navigation />
        <SmoothScroll>
          <main id="main-content">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
