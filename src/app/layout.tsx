import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

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
    <html lang="de" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
