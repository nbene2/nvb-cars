"use client";

import { motion } from "framer-motion";
import type { ScoreTier } from "@/lib/supabase/types";

interface ScoreGaugeProps {
  score: number;
  tier: ScoreTier;
  size?: number;
}

export function ScoreGauge({ score, tier, size = 160 }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const tierColors: Record<ScoreTier, string> = {
    hot: "#ef4444",
    warm: "#f97316",
    cold: "#3b82f6",
  };

  const tierGlows: Record<ScoreTier, string> = {
    hot: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))",
    warm: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))",
    cold: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={{ filter: score > 0 ? tierGlows[tier] : undefined }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tierColors[tier]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          key={score}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
          style={{ color: tierColors[tier] }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {tier}
        </span>
      </div>
    </div>
  );
}
