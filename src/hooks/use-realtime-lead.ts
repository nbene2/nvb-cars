"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { EMPTY_SIGNALS } from "@/lib/scoring/engine";
import type { ScoreSignals } from "@/lib/supabase/types";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  vehicle_interest: Record<string, unknown>;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  trade_in: Record<string, unknown>;
  financing_needed: boolean | null;
  score: number;
  score_tier: "hot" | "warm" | "cold";
  score_signals: Partial<ScoreSignals>;
  status: string;
  outcome: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadScoreHistory {
  id: string;
  lead_id: string;
  score: number;
  tier: "hot" | "warm" | "cold";
  signals: Partial<ScoreSignals>;
  trigger_message_id: string | null;
  created_at: string;
}

interface RealtimeLeadState {
  lead: Lead | null;
  scoreHistory: LeadScoreHistory[];
  signals: Partial<ScoreSignals>;
  isConnected: boolean;
}

export function useRealtimeLead(leadId: string | null) {
  const [state, setState] = useState<RealtimeLeadState>({
    lead: null,
    scoreHistory: [],
    signals: EMPTY_SIGNALS,
    isConnected: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLead = useCallback(async (id: string) => {
    try {
      const [leadRes, historyRes] = await Promise.all([
        fetch(`/api/data?table=leads&id=${id}`).then((r) => r.json()),
        fetch(`/api/data?table=score_history&filter=lead_id&filterValue=${id}`).then((r) => r.json()),
      ]);

      if (leadRes.data) {
        setState({
          lead: leadRes.data,
          signals: (leadRes.data.score_signals as Partial<ScoreSignals>) || EMPTY_SIGNALS,
          scoreHistory: historyRes.data || [],
          isConnected: true,
        });
      }
    } catch {
      // Polling error — ignore
    }
  }, []);

  useEffect(() => {
    if (!leadId) return;

    // Initial fetch
    fetchLead(leadId);

    // Poll every 1.5 seconds for real-time-like updates
    intervalRef.current = setInterval(() => fetchLead(leadId), 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [leadId, fetchLead]);

  return state;
}
