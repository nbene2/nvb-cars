"use client";

import { useEffect, useState } from "react";
import { ScoringWeightEditor } from "@/components/admin/scoring-weight-editor";
import { PromptEditor } from "@/components/admin/prompt-editor";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScoringWeight, PromptVersion } from "@/lib/supabase/types";

export default function ScoringPage() {
  const [weights, setWeights] = useState<ScoringWeight[]>([]);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/data?table=scoring_weights").then((r) => r.json()),
      fetch("/api/data?table=prompt_versions").then((r) => r.json()),
    ]).then(([weightsRes, promptsRes]) => {
      setWeights(weightsRes.data || []);
      setPromptVersions(promptsRes.data || []);
      setLoading(false);
    });
  }, []);

  const handleSaveWeights = async (updates: { id: string; base_weight: number }[]) => {
    for (const update of updates) {
      await fetch("/api/data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "scoring_weights",
          id: update.id,
          data: { base_weight: update.base_weight },
        }),
      });
    }
    const res = await fetch("/api/data?table=scoring_weights");
    const { data } = await res.json();
    setWeights(data || []);
  };

  const handleSavePrompt = async (
    id: string,
    data: { system_prompt: string; scoring_instructions: string }
  ) => {
    await fetch("/api/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "prompt_versions", id, data }),
    });
    // Refetch so the UI reflects the saved state
    const res = await fetch("/api/data?table=prompt_versions");
    const result = await res.json();
    setPromptVersions(result.data || []);
  };

  const activePrompt = promptVersions.find((p) => p.is_active);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scoring & Prompt Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Tune how the chatbot talks to customers and how leads are scored
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {activePrompt && (
              <PromptEditor
                promptVersion={activePrompt}
                onSave={handleSavePrompt}
              />
            )}
            <ScoringWeightEditor weights={weights} onSave={handleSaveWeights} />
          </div>
          <div>
            <Card className="glass-card p-4">
              <h3 className="mb-3 text-sm font-semibold">How It Works</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>1. Edit the system prompt to change how the chatbot behaves</p>
                <p>2. Adjust signal weights to change what matters most for scoring</p>
                <p>3. Changes apply to all new conversations immediately</p>
                <p>4. Record lead outcomes to trigger automatic weight learning</p>
                <p>5. System adjusts: <code className="bg-muted px-1 rounded">weight = base x (1 + lift x 0.1)</code></p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
