import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/GeistVF.woff", weight: "100 900" },
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Arkanum Akademie – Premium Wissensplattform",
  description: "Entdecke transformative Kurse in Metaphysik, Bewusstseinsentwicklung und esoterischem Wissen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
