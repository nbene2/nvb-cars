import type { ScoreSignals } from "@/lib/supabase/types";

interface FeedbackRecord {
  outcome: string;
  score_signals_snapshot: Partial<ScoreSignals>;
}

interface LiftResult {
  signal: string;
  lift: number;
  positiveRate: number;
  totalOccurrences: number;
}

const POSITIVE_OUTCOMES = ["purchased"];
const LEARNING_RATE = 0.1;
const MIN_SAMPLES = 3; // Minimum feedback records before adjusting

/**
 * Compute per-signal lift analysis.
 * Lift = (conversion rate when signal is present) / (overall conversion rate) - 1
 * Positive lift means the signal is a good predictor of positive outcomes.
 */
export function computeLiftAnalysis(feedbacks: FeedbackRecord[]): LiftResult[] {
  if (feedbacks.length < MIN_SAMPLES) return [];

  const totalPositive = feedbacks.filter((f) =>
    POSITIVE_OUTCOMES.includes(f.outcome)
  ).length;
  const overallRate = totalPositive / feedbacks.length;

  if (overallRate === 0 || overallRate === 1) return [];

  const signalNames = Object.keys(feedbacks[0]?.score_signals_snapshot || {}) as (keyof ScoreSignals)[];

  return signalNames.map((signal) => {
    const withSignal = feedbacks.filter(
      (f) => f.score_signals_snapshot[signal] === true
    );
    const withSignalPositive = withSignal.filter((f) =>
      POSITIVE_OUTCOMES.includes(f.outcome)
    );

    const signalRate = withSignal.length > 0
      ? withSignalPositive.length / withSignal.length
      : 0;

    const lift = overallRate > 0 ? signalRate / overallRate - 1 : 0;

    return {
      signal,
      lift,
      positiveRate: signalRate,
      totalOccurrences: withSignal.length,
    };
  });
}

/**
 * Compute new learned weights based on lift analysis.
 * new_weight = base_weight * (1 + lift * learning_rate)
 * Clamped between 0.5 and 2.0 to prevent extreme swings.
 */
export function computeLearnedWeights(
  currentWeights: Array<{ signal_name: string; learned_weight: number }>,
  lifts: LiftResult[]
): Array<{ signal_name: string; learned_weight: number }> {
  const liftMap = new Map(lifts.map((l) => [l.signal, l.lift]));

  return currentWeights.map((w) => {
    const lift = liftMap.get(w.signal_name);
    if (lift === undefined || Math.abs(lift) < 0.01) {
      return w; // No meaningful lift data
    }

    // Conservative adjustment
    let newWeight = w.learned_weight * (1 + lift * LEARNING_RATE);

    // Clamp to prevent extreme values
    newWeight = Math.max(0.5, Math.min(2.0, newWeight));

    return {
      signal_name: w.signal_name,
      learned_weight: Math.round(newWeight * 100) / 100,
    };
  });
}
