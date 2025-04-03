import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatArea } from "@/components/chat/ChatArea";

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
	// {
	//   id: 5,
	//   sender: "Sarah Johnson",
	//   content:
	//     "Perfect! I love golden retrievers. Does he need any special care or medications?",
	//   time: "10:15 AM",
	//   isMe: false,
	// },
	// {
	//   id: 6,
	//   sender: "Me",
	//   content:
	//     "No medications, but he does need a walk in the evening. I'll leave his leash and some treats for you.",
	//   time: "10:20 AM",
	//   isMe: true,
	// },
	// {
	//   id: 7,
	//   sender: "Sarah Johnson",
	//   content: "Sounds good! I'll be there at 3pm to pick up Max.",
	//   time: "10:30 AM",
	//   isMe: false,
	// },
];

function Chat() {
	const [selectedConversation, setSelectedConversation] = useState(
		conversations[0],
	);
	const [messages, setMessages] = useState(mockMessages);
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
					<div className="grid grid-cols-1 md:grid-cols-3 h-full">
						{/* Conversation List */}
						<ConversationList
							conversations={conversations}
							selectedConversation={selectedConversation}
							setSelectedConversation={setSelectedConversation}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>

						{/* Chat Area */}
						<ChatArea
							messages={messages}
							setMessages={setMessages}
							selectedConversation={selectedConversation}
							newMessage={newMessage}
							setNewMessage={setNewMessage}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
