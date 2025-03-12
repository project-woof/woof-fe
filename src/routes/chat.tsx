import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll be there at 3pm to pick up Max",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for taking care of Bella!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you do next Tuesday?",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfect, see you then!",
    time: "Monday",
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content:
      "Hi there! I'm available to pet sit this weekend if you still need someone.",
    time: "10:00 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content:
      "Yes, that would be great! I need someone to watch my dog Max on Saturday from 2-8pm.",
    time: "10:05 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "I can definitely do that time. What kind of dog is Max?",
    time: "10:10 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content:
      "He's a 3-year-old golden retriever. Very friendly and well-behaved!",
    time: "10:12 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content:
      "Perfect! I love golden retrievers. Does he need any special care or medications?",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: 6,
    sender: "Me",
    content:
      "No medications, but he does need a walk in the evening. I'll leave his leash and some treats for you.",
    time: "10:20 AM",
    isMe: true,
  },
  {
    id: 7,
    sender: "Sarah Johnson",
    content: "Sounds good! I'll be there at 3pm to pick up Max.",
    time: "10:30 AM",
    isMe: false,
  },
];

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((convo) =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-14rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation.id === conversation.id
                        ? "bg-gray-50"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start">
                      <div className="relative mr-3">
                        <Avatar>
                          <AvatarImage
                            src={conversation.avatar}
                            alt={conversation.name}
                          />
                          <AvatarFallback>
                            {conversation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-medium truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                  />
                  <AvatarFallback>
                    {selectedConversation.name.charAt(0)}
                  </AvatarFallback>
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
                          className={`text-xs mt-1 ${
                            message.isMe
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}
