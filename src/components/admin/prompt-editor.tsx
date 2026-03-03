"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PromptVersion } from "@/lib/supabase/types";

interface PromptEditorProps {
  promptVersion: PromptVersion;
  onSave: (id: string, data: { system_prompt: string; scoring_instructions: string }) => Promise<void>;
}

export function PromptEditor({ promptVersion, onSave }: PromptEditorProps) {
  const [systemPrompt, setSystemPrompt] = useState(promptVersion.system_prompt);
  const [scoringInstructions, setScoringInstructions] = useState(promptVersion.scoring_instructions);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    systemPrompt !== promptVersion.system_prompt ||
    scoringInstructions !== promptVersion.scoring_instructions;

  const handleSave = async () => {
    setSaving(true);
    await onSave(promptVersion.id, {
      system_prompt: systemPrompt,
      scoring_instructions: scoringInstructions,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSystemPrompt(promptVersion.system_prompt);
    setScoringInstructions(promptVersion.scoring_instructions);
  };

  return (
    <Card className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Chatbot Prompt</h3>
          <p className="text-xs text-muted-foreground">
            Edit the system prompt that controls how the chatbot talks to customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          {promptVersion.is_active && (
            <Badge className="text-[10px]">Active</Badge>
          )}
          {saved && (
            <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500">
              Saved
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          System Prompt
        </label>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[200px] text-xs font-mono resize-y"
          placeholder="Instructions for how the chatbot should behave..."
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Scoring Instructions
        </label>
        <Textarea
          value={scoringInstructions}
          onChange={(e) => setScoringInstructions(e.target.value)}
          className="min-h-[160px] text-xs font-mono resize-y"
          placeholder="Instructions for when to use tools and how to score leads..."
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className="gap-1 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="gap-1 text-xs"
        >
          <Save className="h-3 w-3" />
          {saving ? "Saving..." : "Save & Apply"}
        </Button>
      </div>
    </Card>
  );
}
