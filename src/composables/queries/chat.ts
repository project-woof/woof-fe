import { useQuery } from "@tanstack/react-query";
import type { ChatRoomSummary, ChatMessageSummary } from "@/types/chat";
import { useChatAPI } from "@/composables/api/chat";

export const useChatQuery = () => {
	const { getChatRooms, getMessages } = useChatAPI();

	function getChatRoomsByUserId(userId: string) {
		const { data, isFetched } = useQuery<ChatRoomSummary[]>({
			queryKey: ["getChatRoomsByUserId", userId],
			queryFn: () => getChatRooms(userId),
			// TODO: Switch to long polling
			refetchInterval: 5000, // Refetch every 5 seconds
		});
		return { data, isFetched };
	}

	function getMessagesByRoomId(roomId: string) {
		const { data, isFetched } = useQuery<ChatMessageSummary[]>({
			queryKey: ["getMessagesByRoomId", roomId],
			queryFn: () => getMessages(roomId),
			// TODO: Switch to long polling
			refetchInterval: 5000, // Refetch every 5 seconds
		});
		return { data, isFetched };
	}

	return { getChatRoomsByUserId, getMessagesByRoomId };
};
