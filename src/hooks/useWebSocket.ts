import { useEffect, useRef, useState, useCallback } from "react";

export function useChatWebSocket(userId: string | null) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectAttempts = useRef(0);
	const maxReconnectAttempts = 5;
	const reconnectTimeoutRef = useRef<number | null>(null);

	const connect = useCallback(() => {
		if (!userId) return;

		const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws?user_id=${userId}`;
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.addEventListener("open", () => {
			console.log("WebSocket connected");
			reconnectAttempts.current = 0;
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

			// Attempt to reconnect unless it was a clean closure
			if (
				event.code !== 1000 &&
				reconnectAttempts.current < maxReconnectAttempts
			) {
				const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
				console.log(`Attempting to reconnect in ${timeout}ms...`);
				reconnectAttempts.current += 1;
				reconnectTimeoutRef.current = window.setTimeout(connect, timeout);
			}
		});

		ws.addEventListener("error", (event) => {
			console.error("WebSocket error:", event);
		});
	}, [userId]);

	useEffect(() => {
		connect();

		return () => {
			if (wsRef.current) {
				wsRef.current.close(1000, "Closing connection on unmount");
				wsRef.current = null;
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
		};
	}, [userId, connect]);

	// Add ping/pong to keep connection alive
	useEffect(() => {
		if (!socket) return;

		const pingInterval = setInterval(() => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ action: "ping" }));
			}
		}, 30000);

		return () => clearInterval(pingInterval);
	}, [socket]);

	return socket;
}
