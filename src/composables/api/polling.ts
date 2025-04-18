import { fetcher } from "@/util/fetcher";

interface PollSignal {
	updated: boolean;
	type: "messages" | "notifications";
}

export function usePollingAPI() {
	const fetchNotificationsLongPoll = async (userId: string) => {
		const response = await fetcher(`/poll/notifications?user_id=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const signal = (await response.json()) as PollSignal;
		// Return with timestamp for useEffect in polling queries
		return { ...signal, timestamp: Date.now() };
	};

	const fetchMessagesLongPoll = async (userId: string) => {
		const response = await fetcher(`/poll/messages?user_id=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const signal = (await response.json()) as PollSignal;
		return { ...signal, timestamp: Date.now() };
	};

	return {
		fetchNotificationsLongPoll,
		fetchMessagesLongPoll,
	};
}
