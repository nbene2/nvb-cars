"use client";

import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Message } from "@/lib/supabase/types";

interface ConversationViewerProps {
  messages: Message[];
}

export function ConversationViewer({ messages }: ConversationViewerProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No conversation messages found
      </div>
    );
  }

  return (
    <Card className="glass-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Conversation Replay</h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {messages.filter((m) => m.role !== "tool" && m.content).map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="mt-1 text-[10px] opacity-50">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
