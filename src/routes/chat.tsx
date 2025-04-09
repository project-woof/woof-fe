import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatArea } from "@/components/chat/ChatArea";
import { useAuth } from "@/context/authContext";
import { useChatQuery } from "@/composables/queries/chat";
import type { ChatRoomSummary } from "@/types/chat";

export const Route = createFileRoute("/chat")({
	component: Chat,
});

function Chat() {
	const [selectedChatRoom, setSelectedChatRoom] =
		useState<ChatRoomSummary | null>(null);
	const { userProfile } = useAuth();

	if (!userProfile) {
		return (
			<main className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
					<div className="flex items-center justify-center h-full">
						<p>Loading user profile...</p>
					</div>
				</div>
			</main>
		);
	}

	const { getChatRoomsByUserId } = useChatQuery();
	const { data: chatRoomData, isFetched: chatRoomsFetched } =
		getChatRoomsByUserId(userProfile.id);

	if (chatRoomData === undefined) {
		return (
			<main className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
					<div className="flex items-center justify-center h-full">
						<p>Chat Room Fetch Error</p>
					</div>
				</div>
			</main>
		);
	}

	if (!chatRoomsFetched) {
		return (
			<main className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
					<div className="flex items-center justify-center h-full">
						<p>Loading chat rooms...</p>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
				<div className="grid grid-cols-1 md:grid-cols-3 h-full">
					{/* Conversation List */}
					<ConversationList
						chatRooms={chatRoomData}
						selectedChatRoom={selectedChatRoom}
						setSelectedChatRoom={setSelectedChatRoom}
					/>

					{/* Chat Area */}
					<ChatArea
						selectedChatRoom={selectedChatRoom}
						userId={userProfile!.id}
					/>
				</div>
			</div>
		</main>
	);
}
