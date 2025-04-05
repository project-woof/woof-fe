import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { convertDateLocal } from "@/util/format";
import { MessageBubble } from "./MessageBubble";
import type { ChatRoomSummary } from "@/types/chat";
import { DateBubble } from "./DateBubble";
import type { ChatMessageSummary } from "@/types/chat";
import { useChatQuery } from "@/composables/queries/chat";

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content:
      "Hi there! I'm available to pet sit this weekend if you still need someone.",
    time: "2025-03-29 08:58:40",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content:
      "Yes, that would be great! I need someone to watch my dog Max on Saturday from 2-8pm.",
    time: "2025-03-29 09:58:40",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "I can definitely do that time. What kind of dog is Max?",
    time: "2025-03-29 10:58:40",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content:
      "He's a 3-year-old golden retriever. Very friendly and well-behaved!",
    time: "2025-03-29 11:58:40",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content:
      "Perfect! I love golden retrievers. Does he need any special care or medications?",
    time: "2025-03-29 12:58:40",
    isMe: false,
  },
  {
    id: 6,
    sender: "Me",
    content:
      "No medications, but he does need a walk in the evening. I'll leave his leash and some treats for you.",
    time: "2025-03-29 13:58:40",
    isMe: true,
  },
  {
    id: 7,
    sender: "Sarah Johnson",
    content: "Sounds good! I'll be there at 3pm to pick up Max.",
    time: "2025-04-01 00:58:40",
    isMe: false,
  },
  {
    id: 8,
    sender: "Me",
    content: "Sounds good! I'll be there at 3pm to pick up Max.",
    time: "2025-04-02 00:58:40",
    isMe: false,
  },
  {
    id: 9,
    sender: "Me",
    content: "Sounds good! I'll be there at 3pm to pick up Max.",
    time: "2025-04-03 00:58:40",
    isMe: false,
  },
  {
    id: 10,
    sender: "Sarah Johnson",
    content: "Sounds good! I'll be there at 3pm to pick up Max.",
    time: "2025-04-03 00:58:40",
    isMe: false,
  },
];

interface ChatAreaProps {
  selectedChatRoom: ChatRoomSummary | null;
  userId: string;
}

export function ChatArea({ selectedChatRoom, userId }: ChatAreaProps) {
  if (!selectedChatRoom) {
    return (
      <div className="col-span-2 flex items-center justify-center h-full">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  const { getMessagesByRoomId } = useChatQuery();
  const [messages, setMessages] = useState<ChatMessageSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    const { data: messagesData, isFetched: messagesFetched } =
      getMessagesByRoomId(selectedChatRoom.room_id);
    if (!messagesFetched) {
      setLoading(true);
    }
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [selectedChatRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const scrollableElement =
      scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) || scrollAreaRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isAtBottom = distanceFromBottom < 500;
    setShowScrollToBottom(!isAtBottom);
  };

  useEffect(() => {
    handleScroll();
    const scrollableElement =
      scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) || scrollAreaRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
      };
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessageSummary = {
      message_id: Date.now().toString(),
      sender_id: userId,
      text: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const renderedMessages = messages.reduce<React.ReactNode[]>(
    (acc, message, idx) => {
      const messageDate = convertDateLocal(message.created_at);
      if (idx === 0) {
        acc.push(
          <DateBubble key={`date-${message.message_id}`} date={messageDate} />
        );
      } else {
        const prevDate = convertDateLocal(messages[idx - 1].created_at);
        if (messageDate !== prevDate) {
          acc.push(
            <DateBubble key={`date-${message.message_id}`} date={messageDate} />
          );
        }
      }
      acc.push(
        <MessageBubble
          key={message.message_id}
          message={message}
          userId={userId}
        />
      );
      return acc;
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col h-full relative">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage
            src={selectedChatRoom.profile_image_url}
            alt={selectedChatRoom.username}
          />
          <AvatarFallback>{selectedChatRoom.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedChatRoom.username}</h3>
        </div>
      </div>

      {/* Scrollable Messages */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex px-4 h-[calc(100vh-19rem)]"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4 w-full">
          {renderedMessages}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll To Bottom Button */}
      {showScrollToBottom && (
        <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={scrollToBottom}
            className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 shadow hover:bg-gray-200 transition duration-300"
          >
            Scroll To Bottom
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t">
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
