"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import type { ScoringWeight } from "@/lib/supabase/types";

interface ScoringWeightEditorProps {
  weights: ScoringWeight[];
  onSave: (updates: { id: string; base_weight: number }[]) => Promise<void>;
}

export function ScoringWeightEditor({ weights, onSave }: ScoringWeightEditorProps) {
  const [editedWeights, setEditedWeights] = useState<Record<string, number>>(
    Object.fromEntries(weights.map((w) => [w.id, w.base_weight]))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = weights
        .filter((w) => editedWeights[w.id] !== w.base_weight)
        .map((w) => ({ id: w.id, base_weight: editedWeights[w.id] }));
      await onSave(updates);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditedWeights(
      Object.fromEntries(weights.map((w) => [w.id, w.base_weight]))
    );
  };

  const hasChanges = weights.some((w) => editedWeights[w.id] !== w.base_weight);

  const categories = [...new Set(weights.map((w) => w.category))];

  return (
    <Card className="glass-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Scoring Weights</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges}
            className="gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-1"
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            Save
          </Button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground capitalize">
            {category}
          </h4>
          <div className="space-y-4">
            {weights
              .filter((w) => w.category === category)
              .map((weight) => {
                const edited = editedWeights[weight.id];
                const isModified = edited !== weight.base_weight;
                const learnedMultiplier = weight.learned_weight;

                return (
                  <div key={weight.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {weight.signal_name.replace(/_/g, " ")}
                        </span>
                        {learnedMultiplier !== 1 && (
                          <Badge variant="outline" className="text-[10px]">
                            Learned: {learnedMultiplier.toFixed(2)}x
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono font-bold ${isModified ? "text-primary" : ""}`}>
                          {edited}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (eff: {(edited * learnedMultiplier).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[edited]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={([val]) =>
                        setEditedWeights((prev) => ({ ...prev, [weight.id]: val }))
                      }
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </Card>
  );
}
