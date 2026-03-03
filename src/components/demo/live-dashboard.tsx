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
import type { ScoreTier, Lead as LeadType, LeadScoreHistory } from "@/lib/supabase/types";
import type { LeadSnapshot, ScoreHistoryEntry } from "@/components/chat/chat-container";
import { EMPTY_SIGNALS } from "@/lib/scoring/engine";

interface LiveDashboardProps {
  leadId: string | null;
  leadData?: LeadSnapshot | null;
  scoreHistory?: ScoreHistoryEntry[];
}

export function LiveDashboard({ leadId, leadData, scoreHistory }: LiveDashboardProps) {
  const hasData = leadData && leadData.score > 0;

  // Build a fake Lead object for LeadDataPanel from the snapshot
  const leadForPanel: LeadType | null = leadData
    ? ({
        id: leadId || "",
        name: leadData.name || null,
        email: leadData.email || null,
        phone: leadData.phone || null,
        vehicle_interest: leadData.vehicle_interest || {},
        budget_min: leadData.budget_min ?? null,
        budget_max: leadData.budget_max ?? null,
        timeline: leadData.timeline || null,
        trade_in: leadData.trade_in || {},
        financing_needed: leadData.financing_needed ?? null,
        score: leadData.score,
        score_tier: leadData.tier,
        score_signals: leadData.signals,
        status: "new",
        outcome: null,
        source: "chat",
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as LeadType)
    : null;

  // Convert score history for the sparkline
  const sparklineHistory: LeadScoreHistory[] = (scoreHistory || []).map(
    (entry, i) =>
      ({
        id: String(i),
        lead_id: leadId || "",
        score: entry.score,
        tier: entry.tier,
        signals: {},
        trigger_message_id: null,
        created_at: entry.timestamp,
      } as unknown as LeadScoreHistory)
  );

  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-y-auto p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Live Lead Dashboard</h2>
        </div>
        <Badge variant="outline" className="gap-1 text-xs">
          {hasData ? (
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

      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground"
          >
            <Activity className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">Start chatting to see live lead data</p>
            <p className="mt-1 text-xs opacity-60">
              The dashboard updates as qualifying information is extracted
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score Gauge */}
          <Card className="glass-card flex flex-col items-center p-4">
            <ScoreGauge
              score={leadData?.score || 0}
              tier={(leadData?.tier as ScoreTier) || "cold"}
            />
            <div className="mt-2 text-center">
              <p className="text-xs text-muted-foreground">Lead Qualification Score</p>
            </div>
          </Card>

          {/* Score Sparkline */}
          <Card className="glass-card p-4">
            <ScoreSparkline history={sparklineHistory} />
          </Card>

          <Separator />

          {/* Signal Checklist */}
          <Card className="glass-card p-4">
            <SignalChecklist signals={leadData?.signals || EMPTY_SIGNALS} />
          </Card>

          <Separator />

          {/* Lead Data */}
          <Card className="glass-card p-4">
            <LeadDataPanel lead={leadForPanel} />
          </Card>
        </div>
      )}
    </div>
  );
}
