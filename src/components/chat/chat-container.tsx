"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatHeader } from "./chat-header";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeScreen } from "./welcome-screen";
import { VehicleCard } from "./vehicle-card";
import { AppointmentPicker } from "./appointment-picker";
import { LeadScoreBadge } from "./lead-score-badge";
import type { ScoreTier } from "@/lib/supabase/types";
import type { UIMessage } from "ai";

interface ChatContainerProps {
  onLeadUpdate?: (leadId: string) => void;
  className?: string;
}

export function ChatContainer({ onLeadUpdate, className }: ChatContainerProps) {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [tier, setTier] = useState<ScoreTier>("cold");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { leadId, conversationId },
      }),
    [leadId, conversationId]
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onFinish: ({ message: msg }) => {
      if (msg.parts) {
        for (const part of msg.parts) {
          if (part.type.startsWith("tool-") && "output" in part) {
            const result = (part as unknown as { output: Record<string, unknown> }).output;
            if (result?.score !== undefined) {
              setScore(result.score as number);
            }
            if (result?.tier) {
              setTier(result.tier as ScoreTier);
            }
          }
        }
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Track lead/conversation IDs from tool results
  useEffect(() => {
    // Try to get IDs from the first response
    // Since headers aren't directly accessible in v6, we'll create leads via the API
    // and get the ID from the first tool call result
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type.startsWith("tool-") && "output" in part) {
          const result = part.output as Record<string, unknown>;
          if (result?.score !== undefined) {
            setScore(result.score as number);
          }
          if (result?.tier) {
            setTier(result.tier as ScoreTier);
          }
        }
      }
    }
  }, [messages]);

  // Fetch lead ID after first message
  useEffect(() => {
    if (messages.length > 0 && !leadId) {
      // The API creates the lead and returns the ID in headers
      // We need to fetch it separately
      fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.leadId) {
            setLeadId(data.leadId);
            onLeadUpdate?.(data.leadId);
          }
          if (data.conversationId) {
            setConversationId(data.conversationId);
          }
        })
        .catch(() => {});
    }
  }, [messages.length, leadId, conversationId, onLeadUpdate]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, isLoading, sendMessage]
  );

  const handleQuickStart = useCallback(
    (message: string) => {
      sendMessage({ text: message });
    },
    [sendMessage]
  );

  // Extract text content from a message
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  // Render tool results inline
  const renderToolResults = (message: UIMessage) => {
    const toolParts = message.parts.filter(
      (p) => p.type.startsWith("tool-") && "output" in p
    );

    if (toolParts.length === 0) return null;

    return toolParts.map((part, i) => {
      const result = (part as { output: Record<string, unknown> }).output;
      const partType = part.type;

      if (partType === "tool-recommendVehicle" && result?.vehicles) {
        const vehicles = result.vehicles as Array<{
          id: string;
          make: string;
          model: string;
          year: number;
          category: string;
          condition: string;
          price: number;
          color?: string;
          mileage?: number;
          features?: string[];
        }>;
        if (vehicles.length === 0) return null;
        return (
          <div key={i} className="flex flex-col gap-2 px-4 pl-14">
            {vehicles.map((vehicle, vi) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={vi} />
            ))}
          </div>
        );
      }

      if (partType === "tool-scheduleAppointment" && result?.available_slots) {
        return (
          <AppointmentPicker
            key={i}
            slots={result.available_slots as Array<{ date: string; times: string[] }>}
            appointmentType={(result.appointment_type as string) || "general_visit"}
            address={(result.dealership_address as string) || ""}
            phone={(result.dealership_phone as string) || ""}
          />
        );
      }

      return null;
    });
  };

  return (
    <div className={`flex h-full flex-col ${className || ""}`}>
      <ChatHeader />
      <LeadScoreBadge score={score} tier={tier} />

      <div
        ref={scrollRef}
        className="custom-scrollbar flex-1 overflow-y-auto py-4"
      >
        {messages.length === 0 ? (
          <WelcomeScreen onQuickStart={handleQuickStart} />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, i) => {
              const text = getMessageText(message);
              return (
                <div key={message.id} className="flex flex-col gap-2">
                  {text && (
                    <ChatBubble
                      role={message.role as "user" | "assistant"}
                      content={text}
                      isLatest={i === messages.length - 1}
                    />
                  )}
                  {message.role === "assistant" && renderToolResults(message)}
                </div>
              );
            })}
            <AnimatePresence>
              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1]?.role === "user" && (
                  <TypingIndicator />
                )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
