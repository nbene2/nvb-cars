import { NextResponse } from "next/server";
import { store } from "@/lib/store/in-memory";
import { computeLiftAnalysis, computeLearnedWeights } from "@/lib/scoring/learner";
import type { ScoreSignals } from "@/lib/supabase/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: leadId } = await params;
  const body = await req.json();

  // 1. Record feedback
  store.addFeedback({
    lead_id: leadId,
    outcome: body.outcome,
    final_score: body.final_score,
    score_signals_snapshot: body.score_signals_snapshot,
    was_score_accurate: body.was_score_accurate,
    notes: body.notes,
    created_by: null,
  });

  // 2. Update lead outcome
  store.updateLead(leadId, {
    outcome: body.outcome,
    status: body.outcome === "purchased" ? "closed_won" : "closed_lost",
  });

  // 3. Trigger learning
  if (store.feedback.length >= 3) {
    const lifts = computeLiftAnalysis(
      store.feedback.map((f) => ({
        outcome: f.outcome,
        score_signals_snapshot: f.score_signals_snapshot as Partial<ScoreSignals>,
      }))
    );

    if (lifts.length > 0) {
      const updatedWeights = computeLearnedWeights(
        store.scoringWeights.map((w) => ({
          signal_name: w.signal_name,
          learned_weight: w.learned_weight,
        })),
        lifts
      );

      for (const uw of updatedWeights) {
        const existing = store.scoringWeights.find((w) => w.signal_name === uw.signal_name);
        if (existing) {
          store.updateWeight(existing.id, { learned_weight: uw.learned_weight });
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
