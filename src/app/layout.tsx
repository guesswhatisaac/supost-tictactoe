import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const barlow = localFont({
  src: [
    { path: "../../public/fonts/BarlowCondensed-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/BarlowCondensed-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

const plexMono = localFont({
  src: "../../public/fonts/IBMPlexMono-Bold.ttf",
  weight: "700",
  style: "normal",
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "A local two-player Tic-Tac-Toe game with a comedic subtitle narrator.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
