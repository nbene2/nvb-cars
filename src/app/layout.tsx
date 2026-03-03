import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = clerkKey && !clerkKey.includes("PLACEHOLDER");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inner = (
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

  if (!isClerkEnabled) {
    return inner;
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>{inner}</ClerkProvider>
  );
}
