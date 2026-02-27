"use client";

import { motion } from "framer-motion";
import type { LeadScoreHistory } from "@/lib/supabase/types";

interface ScoreSparklineProps {
  history: LeadScoreHistory[];
}

export function ScoreSparkline({ history }: ScoreSparklineProps) {
  if (history.length < 2) {
    return (
      <div className="flex h-16 items-center justify-center text-xs text-muted-foreground">
        Score history will appear as the conversation progresses...
      </div>
    );
  }

  const width = 280;
  const height = 60;
  const padding = 4;

  const scores = history.map((h) => h.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const range = maxScore - minScore || 1;

  const points = scores.map((score, i) => {
    const x = padding + (i / (scores.length - 1)) * (width - padding * 2);
    const y = height - padding - ((score - minScore) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;

  // Area path (fill under the line)
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div>
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Score History
      </h4>
      <svg width={width} height={height} className="w-full">
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#sparkline-gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Latest point */}
        <motion.circle
          cx={parseFloat(points[points.length - 1].split(",")[0])}
          cy={parseFloat(points[points.length - 1].split(",")[1])}
          r="4"
          fill="hsl(var(--primary))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        />
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>Start</span>
        <span>Current: {scores[scores.length - 1]}</span>
      </div>
    </div>
  );
}
