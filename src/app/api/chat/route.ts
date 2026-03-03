import { anthropic } from "@ai-sdk/anthropic";
import { streamText, stepCountIs, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { store } from "@/lib/store/in-memory";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { createTools } from "@/lib/ai/tools";
import { computeScore } from "@/lib/scoring/engine";

// Vercel Pro allows up to 300s. Hobby tier caps at 10s — lower this if on free plan.
export const maxDuration = 30;

function getTextFromUIMessage(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");
}

export async function POST(req: Request) {
  try {
    const { messages, leadId, conversationId } = await req.json();

    // Ensure lead exists in this serverless instance's store.
    // On Vercel, different function invocations may have fresh memory,
    // so always re-create if the lead isn't found.
    let activeLeadId = leadId;
    let activeConversationId = conversationId;

    if (!activeLeadId || !store.getLead(activeLeadId)) {
      const lead = store.createLead(activeLeadId ? { id: activeLeadId } : {});
      activeLeadId = lead.id;
    }

    if (!activeConversationId || !store.getConversation(activeConversationId)) {
      const conv = store.createConversation(activeLeadId);
      activeConversationId = conv.id;
    }

    // Fetch weights for prompt
    const weightsMap: Record<string, number> = {};
    for (const w of store.scoringWeights) {
      weightsMap[w.signal_name] = w.effective_weight;
    }

    const activePrompt = store.promptVersions.find((p) => p.is_active);

    const systemPrompt = buildSystemPrompt({
      systemPrompt: activePrompt?.system_prompt,
      scoringInstructions: activePrompt?.scoring_instructions,
      weights: Object.keys(weightsMap).length > 0 ? weightsMap : undefined,
    });

    const tools = createTools(activeLeadId, activeConversationId);

    // Store user message
    const uiMessages = messages as UIMessage[];
    const lastUserMessage = uiMessages[uiMessages.length - 1];
    if (activeConversationId && lastUserMessage?.role === "user") {
      const userText = getTextFromUIMessage(lastUserMessage);
      if (userText) {
        store.addMessage({
          conversation_id: activeConversationId,
          role: "user",
          content: userText,
          rich_content: {},
          tool_calls: [],
          extracted_signals: {},
        });
      }

      const conv = store.getConversation(activeConversationId);
      if (conv) {
        const userMsgCount = uiMessages.filter((m) => m.role === "user").length;
        store.updateConversation(activeConversationId, { message_count: userMsgCount });
      }

      // Check for multi_turn signal
      const userMsgCount = uiMessages.filter((m) => m.role === "user").length;
      if (userMsgCount >= 3) {
        const lead = store.getLead(activeLeadId);
        if (lead) {
          const signals = (lead.score_signals || {}) as Record<string, boolean>;
          if (!signals.multi_turn_conversation) {
            signals.multi_turn_conversation = true;
            const { score, tier } = computeScore(signals);
            store.updateLead(activeLeadId, { score, score_tier: tier, score_signals: signals });
          }
        }
      }
    }

    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250514"),
      system: systemPrompt,
      messages,
      tools,
      stopWhen: stepCountIs(5),
      onFinish: async ({ text }) => {
        if (activeConversationId && text) {
          store.addMessage({
            conversation_id: activeConversationId,
            role: "assistant",
            content: text,
            rich_content: {},
            tool_calls: [],
            extracted_signals: {},
          });
        }
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-Lead-Id": activeLeadId || "",
        "X-Conversation-Id": activeConversationId || "",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[chat route error]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
