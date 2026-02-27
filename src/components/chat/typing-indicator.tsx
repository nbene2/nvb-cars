"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 px-4"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="glass-card flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
      </div>
    </motion.div>
  );
}
