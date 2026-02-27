import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "AutoElite Motors | AI-Powered Lead Qualification",
  description:
    "Experience the future of automotive sales with AI-powered lead qualification that works 24/7.",
  openGraph: {
    title: "AutoElite Motors | AI-Powered Lead Qualification",
    description:
      "Experience the future of automotive sales with AI-powered lead qualification that works 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="gradient-mesh min-h-screen">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
