"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, BarChart3, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
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
            <Link href="/demo">
              <Button variant="outline" size="sm">
                Live Demo
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
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
            <Bot className="h-10 w-10 text-primary" />
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            AI Lead Qualification
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              That Never Sleeps
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Engage every website visitor with an intelligent chatbot that qualifies leads,
            scores buying intent in real-time, and continuously learns from outcomes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="gap-2">
                Try Live Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="gap-2">
                Open Chat
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              A complete lead qualification pipeline powered by AI, from first message to closed deal.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Conversations",
                description:
                  "Natural, context-aware chat that understands customer intent and extracts qualifying information without feeling like a survey.",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Lead Scoring",
                description:
                  "14 weighted signals across 5 categories compute a live score (0-100) as the conversation unfolds. Watch the dashboard update in real-time.",
              },
              {
                icon: Zap,
                title: "Continuous Learning",
                description:
                  "Record outcomes, and the system adjusts scoring weights based on what signals actually predicted purchases. Gets smarter over time.",
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

      {/* Stats */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card rounded-2xl border p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { value: "24/7", label: "Always Available" },
                { value: "14", label: "Scoring Signals" },
                { value: "<2s", label: "Response Time" },
                { value: "3", label: "Score Tiers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1 text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">See It In Action</h2>
          <p className="mb-8 text-muted-foreground">
            The split-screen demo shows a customer chat on the left with a live-updating
            lead qualification dashboard on the right. Watch scores change in real-time.
          </p>
          <Link href="/demo">
            <Button size="lg" className="gap-2">
              Launch Split-Screen Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-xs text-muted-foreground">
        <p>&copy; 2026 AutoElite Motors &middot; AI Lead Qualification Demo</p>
      </footer>
    </div>
  );
}
