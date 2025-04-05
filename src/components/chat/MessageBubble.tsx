import { convertTimeLocal } from "@/util/format";
import type { ChatMessageSummary } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessageSummary;
  userId: string;
}

export function MessageBubble({ message, userId }: MessageBubbleProps) {
  return (
    <div
      key={message.message_id}
      className={`flex ${message.sender_id == userId ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.sender_id == userId
            ? "bg-primary text-primary-foreground"
            : "bg-gray-100"
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`text-xs mt-1 ${message.sender_id == userId ? "text-primary-foreground/70" : "text-muted-foreground"}`}
        >
          {convertTimeLocal(message.created_at)}
        </p>
      </div>
    </div>
  );
}
