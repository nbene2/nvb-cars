import { NextResponse } from "next/server";
import { store } from "@/lib/store/in-memory";

export async function POST() {
  const lead = store.createLead();
  const conv = store.createConversation(lead.id);

  return NextResponse.json({
    leadId: lead.id,
    conversationId: conv.id,
  });
}
