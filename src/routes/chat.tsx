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
	const { userProfile, isLoading: authLoading } = useAuth();

	if (authLoading) {
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

	if (!userProfile) {
		// Redirect to login if not authenticated
		return (
			<main className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-10rem)]">
					<div className="flex flex-col items-center justify-center h-full gap-4">
						<p>Please log in to access your messages</p>
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded"
							onClick={() => (window.location.href = "/login")}
						>
							Log In
						</button>
					</div>
				</div>
			</main>
		);
	}

	const { getChatRoomsByUserId } = useChatQuery();
	const { data: chatRoomData, isFetched: chatRoomsFetched } =
		getChatRoomsByUserId(userProfile.id);

	if (!chatRoomsFetched || !chatRoomData) {
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
					<ConversationList
						userId={userProfile.id}
						chatRooms={chatRoomData}
						selectedChatRoom={selectedChatRoom}
						setSelectedChatRoom={setSelectedChatRoom}
					/>
					<ChatArea
						selectedChatRoom={selectedChatRoom}
						userId={userProfile.id}
					/>
				</div>
			</div>
		</main>
	);
}
