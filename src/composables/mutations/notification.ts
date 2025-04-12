import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationAPI } from "@/composables/api/notification";
import type {
	Notification,
	CreateNotificationBody,
} from "@/types/notification";

export const useMutateNotification = () => {
	const queryClient = useQueryClient();
	const { create, clear, clearAll } = useNotificationAPI();

	const createNotificationMutation = useMutation({
		mutationFn: (body: CreateNotificationBody) => create(body),
	});

	const clearNotificationMutation = useMutation({
		mutationFn: ({
			roomId,
			userId: _unused,
		}: {
			roomId: string;
			userId: string;
		}) => clear(roomId),
		onSuccess: (_, variables) => {
			queryClient.setQueryData(
				["getNotificationsByUserId", variables.userId],
				(oldData: Notification[] = []) =>
					oldData.filter(
						(notification) => notification.room_id !== variables.roomId,
					),
			);
			queryClient.invalidateQueries({
				queryKey: ["getNotificationsByUserId", variables.userId],
			});
		},
	});

	const clearAllNotificationMutation = useMutation({
		mutationFn: (userId: string) => clearAll(userId),
		onSuccess: (_, userId) => {
			queryClient.setQueryData(
				["getNotificationsByUserId", userId],
				[] as Notification[],
			);
			queryClient.invalidateQueries({
				queryKey: ["getNotificationsByUserId", userId],
			});
		},
	});

	return {
		createNotificationMutation,
		clearNotificationMutation,
		clearAllNotificationMutation,
	};
};
