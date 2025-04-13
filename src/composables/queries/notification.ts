import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@/types/notification";
import { useNotificationAPI } from "@/composables/api/notification";

export const useNotificationQuery = () => {
	const { getByUserId } = useNotificationAPI();

	function getNotificationsByUserId(userId: string) {
		const { data, isFetched } = useQuery<Notification[]>({
			queryKey: ["getNotificationsByUserId", userId],
			queryFn: () => getByUserId(userId),
		});
		return { data, isFetched };
	}

	return { getNotificationsByUserId };
};
