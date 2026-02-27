"use client";

import { useEffect, useState } from "react";
import { ScoringWeightEditor } from "@/components/admin/scoring-weight-editor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    // Refetch
    const res = await fetch("/api/data?table=scoring_weights");
    const { data } = await res.json();
    setWeights(data || []);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scoring Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Adjust signal weights and manage prompt versions for the scoring model
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScoringWeightEditor weights={weights} onSave={handleSaveWeights} />
          </div>
          <div className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="mb-4 text-sm font-semibold">Prompt Versions</h3>
              {promptVersions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No prompt versions found</p>
              ) : (
                <div className="space-y-3">
                  {promptVersions.map((pv) => (
                    <div
                      key={pv.id}
                      className="rounded-lg border p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Version {pv.version_number}</span>
                        {pv.is_active && (
                          <Badge className="text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {pv.system_prompt.slice(0, 100)}...
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Created {new Date(pv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="glass-card p-4">
              <h3 className="mb-3 text-sm font-semibold">How Learning Works</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>1. Admin records lead outcomes (purchased, lost, etc.)</p>
                <p>2. System computes per-signal lift analysis</p>
                <p>3. Weights adjusted: <code className="bg-muted px-1 rounded">new = base x (1 + lift x 0.1)</code></p>
                <p>4. Updated weights flow into Claude&apos;s system prompt</p>
                <p>5. Better signals → better qualification over time</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
