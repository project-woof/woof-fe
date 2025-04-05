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
			const newChatRoom: ChatRoomSummary = {
				room_id: data.room_id,
				username: data.username,
				profile_image_url: data.profile_image_url,
				last_message: data.last_message,
				last_updated: data.last_updated,
			};
			queryClient.setQueryData(
				["getChatRoomsByUserId", variables.participant1_id],
				(oldData: ChatRoomSummary[] = []) => [newChatRoom, ...oldData],
			);
			queryClient.invalidateQueries({ queryKey: ["getChatRoomsByUserId"] });
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
