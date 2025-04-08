import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatAPI } from "@/composables/api/chat";
import type {
	ChatRoomSummary,
	ChatMessageSummary,
	CreateChatRoomBody,
	CreateChatMessageBody,
} from "@/types/chat";

export const useMutateChat = () => {
	const queryClient = useQueryClient();
	const { createChatRoom, createMessage } = useChatAPI();

	const createChatRoomMutation = useMutation({
		mutationFn: (body: CreateChatRoomBody) => createChatRoom(body),
		onSuccess: (data, variables) => {
			const { participant1_id, participant2_id } = variables;
			const existingRoomsPart1 =
				queryClient.getQueryData<ChatRoomSummary[]>([
					"getChatRoomsByUserId",
					participant1_id,
				]) || [];
			const existingRoomsPart2 =
				queryClient.getQueryData<ChatRoomSummary[]>([
					"getChatRoomsByUserId",
					participant2_id,
				]) || [];
			const roomExistsForParticipant1 = existingRoomsPart1.some(
				(room) => room.room_id === data.room_id,
			);
			const roomExistsForParticipant2 = existingRoomsPart2.some(
				(room) => room.room_id === data.room_id,
			);
			if (roomExistsForParticipant1 && roomExistsForParticipant2) {
				return;
			}
			const newChatRoom: ChatRoomSummary = {
				room_id: data.room_id,
				username: data.username,
				profile_image_url: data.profile_image_url,
				last_message: data.last_message,
				last_updated: data.last_updated,
			};
			if (!roomExistsForParticipant1) {
				queryClient.setQueryData<ChatRoomSummary[]>(
					["getChatRoomsByUserId", participant1_id],
					(oldData: ChatRoomSummary[] = []) => [newChatRoom, ...oldData],
				);
			}
			if (!roomExistsForParticipant2) {
				queryClient.setQueryData<ChatRoomSummary[]>(
					["getChatRoomsByUserId", participant2_id],
					(oldData: ChatRoomSummary[] = []) => [newChatRoom, ...oldData],
				);
			}
			queryClient.invalidateQueries({
				queryKey: ["getChatRoomsByUserId"],
			});
		},
	});

	const createMessageMutation = useMutation({
		mutationFn: (body: CreateChatMessageBody) => createMessage(body),
		onSuccess: (data, variables) => {
			const newMessage: ChatMessageSummary = {
				message_id: data.message_id,
				sender_id: data.sender_id,
				text: data.text,
				created_at: data.created_at,
			};
			queryClient.setQueryData(
				["getMessagesByRoomId", variables.room_id],
				(oldData: ChatMessageSummary[] = []) => [...oldData, newMessage],
			);

			// Also invalidate the chat rooms to update last message
			queryClient.invalidateQueries({ queryKey: ["getChatRoomsByUserId"] });
		},
	});

	return { createChatRoomMutation, createMessageMutation };
};
