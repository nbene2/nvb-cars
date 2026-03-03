import { NextResponse } from "next/server";
import { store } from "@/lib/store/in-memory";

// Generic data API for the admin dashboard to read from the in-memory store
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");
  const filter = searchParams.get("filter");
  const filterValue = searchParams.get("filterValue");

  switch (table) {
    case "leads": {
      if (id) {
        const lead = store.getLead(id);
        return NextResponse.json({ data: lead || null });
      }
      return NextResponse.json({ data: store.leads });
    }
    case "conversations": {
      if (filter === "lead_id" && filterValue) {
        const convs = store.conversations.filter((c) => c.lead_id === filterValue);
        return NextResponse.json({ data: convs });
      }
      return NextResponse.json({ data: store.conversations });
    }
    case "messages": {
      if (filter === "conversation_id" && filterValue) {
        const msgs = store.getMessages(filterValue);
        return NextResponse.json({ data: msgs });
      }
      return NextResponse.json({ data: store.messages });
    }
    case "score_history": {
      if (filter === "lead_id" && filterValue) {
        const history = store.getScoreHistory(filterValue);
        return NextResponse.json({ data: history });
      }
      return NextResponse.json({ data: store.scoreHistory });
    }
    case "scoring_weights": {
      return NextResponse.json({ data: store.scoringWeights });
    }
    case "prompt_versions": {
      return NextResponse.json({ data: store.promptVersions });
    }
    default:
      return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { table, id, data } = body;

  if (table === "scoring_weights" && id) {
    store.updateWeight(id, data);
    return NextResponse.json({ success: true });
  }

  if (table === "prompt_versions" && id) {
    store.updatePromptVersion(id, data);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Not supported" }, { status: 400 });
}
