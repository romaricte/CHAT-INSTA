import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "Real-time messaging application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          inter.className,
          "relative h-full font-sans antialiased bg-background"
        )}
      >
        <main className="relative flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
