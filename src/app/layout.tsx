import type { Metadata } from "next";
import { Noto_Sans_KR, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "케이제이엔시스 (KJNSYS) - 최신 IT 기기 및 솔루션",
  description: "케이제이엔시스는 평판 스캐너, 고속 스캐너 등 최신 IT 기기 및 솔루션을 취급하는 전문 기업입니다.",
  keywords: "케이제이엔시스, KJNSYS, 스캐너, 고속 스캐너, 북 스캐너, IT 기기, 가상화 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${inter.variable}`}>
      <body>
        <div className="layout-wrapper">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
