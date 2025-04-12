import type {
	Notification,
	CreateNotificationBody,
} from "@/types/notification";
import { fetcher } from "@/util/fetcher";

export function useNotificationAPI() {
	const getByUserId = async (userId: string) => {
		const response = await fetcher(`/notification/getNofications/${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json<Notification[]>();
	};

	const create = async (body: CreateNotificationBody) => {
		const response = await fetcher(`/notification/createNotification`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json<Notification>();
	};

	const clear = async (roomId: string) => {
		const response = await fetcher(
			`/notification/clearNotifications/${roomId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response;
	};

	const clearAll = async (userId: string) => {
		const response = await fetcher(
			`/notification/clearAllNotifications/${userId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response;
	};

	return { getByUserId, create, clear, clearAll };
}
