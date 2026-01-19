import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AppProvider } from "@/lib/AppContext";

export const metadata: Metadata = {
  title: "Consistency | Gamified Habit Tracking",
  description: "Transform your habits into a competitive, social game. Prove completion with visual evidence, earn points, and climb competitive leagues.",
  keywords: ["habit tracking", "gamification", "productivity", "social", "streaks", "challenges"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider defaultTheme="cyberpunk">
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
