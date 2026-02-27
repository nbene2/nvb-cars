"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle } from "lucide-react";
import type { ScoreSignals } from "@/lib/supabase/types";
import { SIGNAL_CATEGORIES, SIGNAL_LABELS, DEFAULT_WEIGHTS } from "@/lib/scoring/engine";

interface SignalChecklistProps {
  signals: Partial<ScoreSignals>;
}

export function SignalChecklist({ signals }: SignalChecklistProps) {
  return (
    <div className="space-y-4">
      {Object.entries(SIGNAL_CATEGORIES).map(([category, signalKeys]) => (
        <div key={category}>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category}
          </h4>
          <div className="space-y-1">
            {signalKeys.map((signal) => {
              const isActive = signals[signal] === true;
              const weight = DEFAULT_WEIGHTS[signal] || 0;
              return (
                <motion.div
                  key={signal}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm"
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(34, 197, 94, 0.08)"
                      : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="circle"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Circle className="h-5 w-5 text-muted-foreground/30" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                      {SIGNAL_LABELS[signal]}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">+{weight}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
