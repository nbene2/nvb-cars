import { ChatContainer } from "@/components/chat/chat-container";

export const metadata = {
  title: "Chat | AutoElite Motors",
  description: "Chat with our AI sales consultant to find your perfect vehicle.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col">
      <ChatContainer className="h-full" />
    </div>
  );
}
