"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Lead, LeadOutcome } from "@/lib/supabase/types";

interface FeedbackFormProps {
  lead: Lead;
  onSubmit: (feedback: {
    outcome: LeadOutcome;
    was_score_accurate: boolean;
    notes: string;
  }) => Promise<void>;
}

export function FeedbackForm({ lead, onSubmit }: FeedbackFormProps) {
  const [outcome, setOutcome] = useState<LeadOutcome | "">("");
  const [wasAccurate, setWasAccurate] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!outcome) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        outcome: outcome as LeadOutcome,
        was_score_accurate: wasAccurate,
        notes,
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="glass-card flex items-center justify-center gap-2 p-6 text-green-500">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">Feedback recorded — learning weights updated</span>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Record Outcome</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">
            Lead Outcome
          </label>
          <Select value={outcome} onValueChange={(v) => setOutcome(v as LeadOutcome)}>
            <SelectTrigger>
              <SelectValue placeholder="Select outcome..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
              <SelectItem value="lost">Lost to Competitor</SelectItem>
              <SelectItem value="not_ready">Not Ready to Buy</SelectItem>
              <SelectItem value="unresponsive">Unresponsive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Was the score accurate?</p>
            <p className="text-xs text-muted-foreground">
              Score was {lead.score} ({lead.score_tier}) at time of outcome
            </p>
          </div>
          <Switch checked={wasAccurate} onCheckedChange={setWasAccurate} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">
            Notes (optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional context..."
            rows={3}
            className="text-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!outcome || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Record Feedback
        </Button>
      </div>
    </Card>
  );
}
