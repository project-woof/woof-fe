import { useEffect, useRef, useState } from "react";

export function useChatWebSocket(userId: string | null) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!userId) return;
		const wsUrl = `ws://localhost:8787/ws?user_id=${userId}`;
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.addEventListener("open", () => {
			console.log("WebSocket connected");
			setSocket(ws);
		});

		ws.addEventListener("message", (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("Received message:", data);
			} catch (error) {
				console.error("Failed to parse the incoming message:", error);
			}
		});

		ws.addEventListener("close", (event) => {
			console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
			wsRef.current = null;
			setSocket(null);
		});

		ws.addEventListener("error", (event) => {
			console.error("WebSocket error:", event);
		});

		return () => {
			if (wsRef.current) {
				wsRef.current.close(1000, "Closing connection on unmount");
				wsRef.current = null;
			}
		};
	}, [userId]);

	return socket;
}
