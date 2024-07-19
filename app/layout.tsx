import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Contribution Faker",
  description: "Generated GitHub contribution charts for your profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}

      <SpeedInsights />
      <script async src="https://gc.datafakery.io/tracker.js" data-ackee-server="https://gc.datafakery.io" data-ackee-domain-id="bfa7dff0-205d-4864-a389-9047cdc9e484"></script>
      </body>
    </html>
  );
}
