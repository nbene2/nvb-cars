"use client";

import { motion } from "framer-motion";
import { ArrowRight, Car, Clock, MessageCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { AuthedOnly, UnauthOnly } from "@/components/clerk-gate";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="glass-card fixed top-0 left-0 right-0 z-50 border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              AE
            </div>
            <span className="font-semibold tracking-tight">AutoElite Motors</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthedOnly>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            </AuthedOnly>
            <UnauthOnly>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="gap-1">
                  <LogIn className="h-3.5 w-3.5" />
                  Staff Login
                </Button>
              </Link>
            </UnauthOnly>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
          >
            <Car className="h-10 w-10 text-primary" />
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Find Your Next
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dream Car
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Chat with our sales team to explore premium vehicles,
            get pricing details, and schedule a test drive — all from right here.
          </p>

          <Link href="/demo">
            <Button size="lg" className="gap-2">
              Start Chatting
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Browse Our Inventory",
                description:
                  "Tell us what you're looking for — make, model, budget, features — and we'll match you with vehicles on our lot.",
              },
              {
                icon: Car,
                title: "Schedule a Test Drive",
                description:
                  "Pick a date and time that works for you. We'll have the car ready and waiting when you arrive.",
              },
              {
                icon: Clock,
                title: "Available 24/7",
                description:
                  "Can't visit during business hours? No problem. Start a conversation anytime and we'll get you set up.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl border p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-xs text-muted-foreground">
        <p>&copy; 2026 AutoElite Motors &middot; 1200 Prestige Boulevard, Beverly Hills, CA 90210</p>
      </footer>
    </div>
  );
}
