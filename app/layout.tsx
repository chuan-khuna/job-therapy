import type { Metadata } from "next";
import { Bai_Jamjuree, IBM_Plex_Mono, Noto_Sans_Thai_Looped } from "next/font/google";
import Nav from "@/components/layout/Nav";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-serif",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Job Therapy",
  description: "ค้นพบประเภทคนทำงานของคุณ — based on Tessa West's Job Therapy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      data-theme="warm-paper"
      className={`${baiJamjuree.variable} ${notoSansThaiLooped.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
