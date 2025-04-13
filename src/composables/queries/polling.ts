import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePollingAPI } from "@/composables/api/polling";

export const usePollingQuery = () => {
	const { fetchNotificationsLongPoll, fetchMessagesLongPoll } = usePollingAPI();
	const queryClient = useQueryClient();

	function pollNotifications(userId: string) {
		const pollingQuery = useQuery({
			queryKey: ["pollNotifications", userId],
			queryFn: () => fetchNotificationsLongPoll(userId),
			refetchInterval: false,
			refetchOnWindowFocus: false,
			retry: false,
		});

		useEffect(() => {
			if (pollingQuery.status !== "pending") {
				if (pollingQuery.data?.updated) {
					queryClient.invalidateQueries({
						queryKey: ["getNotificationsByUserId"],
					});
				}
				pollingQuery.refetch();
			}
		}, [pollingQuery.status, pollingQuery.data, queryClient]);

		return pollingQuery;
	}

	function pollMessages(userId: string) {
		const pollingQuery = useQuery({
			queryKey: ["pollMessages", userId],
			queryFn: () => fetchMessagesLongPoll(userId),
			refetchInterval: false,
			refetchOnWindowFocus: false,
			retry: false,
		});

		useEffect(() => {
			if (pollingQuery.status !== "pending") {
				if (pollingQuery.data?.updated) {
					queryClient.invalidateQueries({
						queryKey: ["getMessagesByRoomId"],
					});
					queryClient.invalidateQueries({
						queryKey: ["getChatRoomsByUserId"],
					});
				}
				pollingQuery.refetch();
			}
		}, [pollingQuery.status, pollingQuery.data, queryClient]);

		return pollingQuery;
	}

	return { pollNotifications, pollMessages };
};
