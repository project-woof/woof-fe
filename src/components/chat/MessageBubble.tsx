export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

interface MessageBubbleProps {
  messages: Message[];
}

export function MessageBubble({ messages }: MessageBubbleProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.isMe
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100"
            }`}
          >
            <p>{message.content}</p>
            <p
              className={`text-xs mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}
            >
              {message.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
