"use client";

import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, type FormEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card border-t p-4">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about our vehicles, pricing, or schedule a visit..."
          className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-0 bg-muted/50 px-4 py-3 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        AutoElite Motors &middot; Beverly Hills, CA
      </p>
    </form>
  );
}
