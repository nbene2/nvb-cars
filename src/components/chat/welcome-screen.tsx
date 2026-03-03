"use client";

import { motion } from "framer-motion";
import { Car, MessageCircle, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onQuickStart: (message: string) => void;
}

const quickPrompts = [
  {
    icon: Car,
    label: "Browse Vehicles",
    message: "I'm looking for a new luxury SUV. What do you have available?",
  },
  {
    icon: DollarSign,
    label: "Budget Help",
    message: "I have a budget around $50,000. What are my best options?",
  },
  {
    icon: Calendar,
    label: "Schedule Visit",
    message: "I'd like to schedule a test drive this weekend.",
  },
  {
    icon: MessageCircle,
    label: "General Question",
    message: "Do you have any electric vehicles in stock?",
  },
];

export function WelcomeScreen({ onQuickStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Car className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          Welcome to AutoElite Motors
        </h2>
        <p className="mb-8 max-w-md text-sm text-muted-foreground">
          I&apos;m Alex, your sales consultant. I can help you explore our premium
          vehicle collection, get pricing details, or schedule a visit.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid w-full max-w-md grid-cols-2 gap-3"
      >
        {quickPrompts.map((prompt, i) => (
          <motion.div
            key={prompt.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Button
              variant="outline"
              className="glass-card h-auto w-full flex-col items-start gap-2 p-4 text-left hover:bg-accent/50"
              onClick={() => onQuickStart(prompt.message)}
            >
              <prompt.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">{prompt.label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
