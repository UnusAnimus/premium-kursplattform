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

const themeInitScript = `
(() => {
  const storedTheme = window.localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : (prefersDark ? 'dark' : 'light');

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
