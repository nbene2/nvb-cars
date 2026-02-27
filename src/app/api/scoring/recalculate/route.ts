import { NextResponse } from "next/server";
import { store } from "@/lib/store/in-memory";
import { computeScore } from "@/lib/scoring/engine";
import type { ScoreSignals } from "@/lib/supabase/types";

export async function POST() {
  const weightMap: Record<string, number> = {};
  for (const w of store.scoringWeights) {
    weightMap[w.signal_name] = w.effective_weight;
  }

  let updated = 0;

  for (const lead of store.leads) {
    const signals = (lead.score_signals || {}) as Partial<ScoreSignals>;
    const { score, tier } = computeScore(signals, weightMap);
    store.updateLead(lead.id, { score, score_tier: tier });
    updated++;
  }

  return NextResponse.json({
    success: true,
    leads_updated: updated,
  });
}
