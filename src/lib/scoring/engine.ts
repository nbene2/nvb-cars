import type { ScoreSignals, ScoreTier } from "@/lib/supabase/types";

export interface ScoringWeightMap {
  [signal: string]: number;
}

// Default weights used when DB weights aren't available
export const DEFAULT_WEIGHTS: ScoringWeightMap = {
  has_vehicle_preference: 8,
  specified_condition: 5,
  has_budget: 10,
  timeline_immediate: 15,
  timeline_this_month: 10,
  timeline_this_quarter: 5,
  provided_name: 6,
  provided_email: 8,
  provided_phone: 10,
  has_trade_in: 7,
  discussed_financing: 6,
  multi_turn_conversation: 4,
  asked_specific_questions: 5,
  requested_appointment: 12,
};

export const MAX_POSSIBLE_SCORE = Object.values(DEFAULT_WEIGHTS).reduce(
  (sum, w) => sum + w,
  0
);

export function computeScore(
  signals: Partial<ScoreSignals>,
  weights: ScoringWeightMap = DEFAULT_WEIGHTS
): { score: number; tier: ScoreTier; normalizedScore: number } {
  let rawScore = 0;
  let maxPossible = 0;

  for (const [signal, weight] of Object.entries(weights)) {
    maxPossible += weight;
    if (signals[signal as keyof ScoreSignals]) {
      rawScore += weight;
    }
  }

  // Normalize to 0-100
  const normalizedScore = maxPossible > 0
    ? Math.round((rawScore / maxPossible) * 100)
    : 0;

  const tier = getTier(normalizedScore);

  return { score: normalizedScore, tier, normalizedScore };
}

export function getTier(score: number): ScoreTier {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function getTierColor(tier: ScoreTier): string {
  switch (tier) {
    case "hot": return "text-red-500";
    case "warm": return "text-orange-500";
    case "cold": return "text-blue-500";
  }
}

export function getTierBgColor(tier: ScoreTier): string {
  switch (tier) {
    case "hot": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "warm": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "cold": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
}

export function mergeSignals(
  existing: Partial<ScoreSignals>,
  updates: Partial<ScoreSignals>
): Partial<ScoreSignals> {
  // Signals can only be turned on, never off
  const merged = { ...existing };
  for (const [key, value] of Object.entries(updates)) {
    if (value === true) {
      merged[key as keyof ScoreSignals] = true;
    }
  }
  return merged;
}

export const EMPTY_SIGNALS: ScoreSignals = {
  has_vehicle_preference: false,
  specified_condition: false,
  has_budget: false,
  timeline_immediate: false,
  timeline_this_month: false,
  timeline_this_quarter: false,
  provided_name: false,
  provided_email: false,
  provided_phone: false,
  has_trade_in: false,
  discussed_financing: false,
  multi_turn_conversation: false,
  asked_specific_questions: false,
  requested_appointment: false,
};

export const SIGNAL_LABELS: Record<keyof ScoreSignals, string> = {
  has_vehicle_preference: "Vehicle Preference",
  specified_condition: "Condition Preference",
  has_budget: "Budget Range",
  timeline_immediate: "Buying Immediately",
  timeline_this_month: "Buying This Month",
  timeline_this_quarter: "Buying This Quarter",
  provided_name: "Name",
  provided_email: "Email",
  provided_phone: "Phone",
  has_trade_in: "Trade-In",
  discussed_financing: "Financing",
  multi_turn_conversation: "Engaged Conversation",
  asked_specific_questions: "Specific Questions",
  requested_appointment: "Appointment Request",
};

export const SIGNAL_CATEGORIES: Record<string, (keyof ScoreSignals)[]> = {
  "Purchase Intent": ["has_vehicle_preference", "specified_condition", "has_budget"],
  "Timeline": ["timeline_immediate", "timeline_this_month", "timeline_this_quarter"],
  "Contact Info": ["provided_name", "provided_email", "provided_phone"],
  "Financial": ["has_trade_in", "discussed_financing"],
  "Engagement": ["multi_turn_conversation", "asked_specific_questions", "requested_appointment"],
};
