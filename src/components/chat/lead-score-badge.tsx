"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTierBgColor } from "@/lib/scoring/engine";
import type { ScoreTier } from "@/lib/supabase/types";

interface LeadScoreBadgeProps {
  score: number;
  tier: ScoreTier;
}

export function LeadScoreBadge({ score, tier }: LeadScoreBadgeProps) {
  if (score === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-4 py-1"
      >
        <Badge variant="outline" className={`gap-1 ${getTierBgColor(tier)}`}>
          <TrendingUp className="h-3 w-3" />
          <motion.span
            key={score}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Score: {score}
          </motion.span>
          <span className="uppercase text-[10px]">{tier}</span>
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}
