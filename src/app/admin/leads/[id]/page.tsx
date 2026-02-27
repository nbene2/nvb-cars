"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ConversationViewer } from "@/components/admin/conversation-viewer";
import { FeedbackForm } from "@/components/admin/feedback-form";
import { ScoreGauge } from "@/components/demo/score-gauge";
import { SignalChecklist } from "@/components/demo/signal-checklist";
import { LeadDataPanel } from "@/components/demo/lead-data-panel";
import { getTierBgColor } from "@/lib/scoring/engine";
import type { Lead, Message, Conversation, ScoreTier, ScoreSignals, LeadOutcome } from "@/lib/supabase/types";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [leadRes, convsRes] = await Promise.all([
      fetch(`/api/data?table=leads&id=${leadId}`).then((r) => r.json()),
      fetch(`/api/data?table=conversations&filter=lead_id&filterValue=${leadId}`).then((r) => r.json()),
    ]);

    setLead(leadRes.data);
    const convs = (convsRes.data || []) as Conversation[];
    setConversations(convs);

    if (convs.length > 0) {
      const msgsRes = await fetch(
        `/api/data?table=messages&filter=conversation_id&filterValue=${convs[0].id}`
      ).then((r) => r.json());
      setMessages(msgsRes.data || []);
    }

    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFeedback = async (feedback: {
    outcome: LeadOutcome;
    was_score_accurate: boolean;
    notes: string;
  }) => {
    if (!lead) return;

    const response = await fetch(`/api/leads/${leadId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outcome: feedback.outcome,
        final_score: lead.score,
        score_signals_snapshot: lead.score_signals,
        was_score_accurate: feedback.was_score_accurate,
        notes: feedback.notes,
      }),
    });

    if (!response.ok) throw new Error("Failed to submit feedback");
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {lead.name || "Anonymous Lead"}
            </h1>
            <Badge
              variant="outline"
              className={getTierBgColor(lead.score_tier as ScoreTier)}
            >
              {lead.score_tier} — {lead.score}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {lead.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {new Date(lead.created_at).toLocaleString()} &middot;{" "}
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card className="glass-card flex items-center gap-6 p-4">
            <ScoreGauge
              score={lead.score}
              tier={lead.score_tier as ScoreTier}
              size={120}
            />
            <div className="flex-1">
              <LeadDataPanel lead={lead} />
            </div>
          </Card>

          <Card className="glass-card p-4">
            <SignalChecklist
              signals={(lead.score_signals as Partial<ScoreSignals>) || {}}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <ConversationViewer messages={messages} />
          <Separator />
          <FeedbackForm lead={lead} onSubmit={handleFeedback} />
        </div>
      </div>
    </div>
  );
}
