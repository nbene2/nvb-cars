"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "@/components/chat/chat-container";
import { LiveDashboard } from "@/components/demo/live-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DemoPage() {
  const [leadId, setLeadId] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col">
      {/* Demo header */}
      <header className="glass-card flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Split-Screen Demo</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Chat on the left, watch the dashboard update in real-time on the right
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Split screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat side */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex w-1/2 flex-col border-r"
        >
          <ChatContainer onLeadUpdate={setLeadId} className="h-full" />
        </motion.div>

        {/* Dashboard side */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-1/2 bg-muted/20"
        >
          <LiveDashboard leadId={leadId} />
        </motion.div>
      </div>
    </div>
  );
}
