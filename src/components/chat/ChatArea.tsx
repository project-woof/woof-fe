import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { type Message, MessageBubble } from "@/components/chat/MessageBubble";
import { type Conversation } from "@/components/chat/ConversationList";

interface ChatAreaProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  selectedConversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
}
export function ChatArea({
  messages,
  setMessages,
  selectedConversation,
  newMessage,
  setNewMessage,
}: ChatAreaProps) {
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "Me",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="col-span-2 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage
            src={selectedConversation.avatar}
            alt={selectedConversation.name}
          />
          <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedConversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {selectedConversation.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <MessageBubble messages={messages} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
