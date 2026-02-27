"use client";

import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreGauge } from "./score-gauge";
import { SignalChecklist } from "./signal-checklist";
import { LeadDataPanel } from "./lead-data-panel";
import { ScoreSparkline } from "./score-sparkline";
import { useRealtimeLead } from "@/hooks/use-realtime-lead";
import type { ScoreTier, Lead as LeadType } from "@/lib/supabase/types";

interface LiveDashboardProps {
  leadId: string | null;
}

export function LiveDashboard({ leadId }: LiveDashboardProps) {
  const { lead, scoreHistory, signals, isConnected } = useRealtimeLead(leadId);

  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-y-auto p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Live Lead Dashboard</h2>
        </div>
        <Badge variant="outline" className="gap-1 text-xs">
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-muted-foreground" />
              <span>Waiting</span>
            </>
          )}
        </Badge>
      </div>

      {!leadId ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground"
          >
            <Activity className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">Start chatting to see live lead data</p>
            <p className="mt-1 text-xs opacity-60">
              The dashboard updates in real-time as the AI extracts qualifying information
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score Gauge */}
          <Card className="glass-card flex flex-col items-center p-4">
            <ScoreGauge
              score={lead?.score || 0}
              tier={(lead?.score_tier as ScoreTier) || "cold"}
            />
            <div className="mt-2 text-center">
              <p className="text-xs text-muted-foreground">Lead Qualification Score</p>
            </div>
          </Card>

          {/* Score Sparkline */}
          <Card className="glass-card p-4">
            <ScoreSparkline history={scoreHistory} />
          </Card>

          <Separator />

          {/* Signal Checklist */}
          <Card className="glass-card p-4">
            <SignalChecklist signals={signals} />
          </Card>

          <Separator />

          {/* Lead Data */}
          <Card className="glass-card p-4">
            <LeadDataPanel lead={lead as unknown as LeadType} />
          </Card>
        </div>
      )}
    </div>
  );
}
