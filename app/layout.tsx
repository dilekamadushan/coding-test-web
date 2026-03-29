import { Inter } from "@next/font/google";
import "./globals.css";

const latinFont = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={latinFont.className}>{children}</body>
    </html>
  );
}
