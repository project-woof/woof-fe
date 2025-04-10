import { useEffect, useRef, useState, useCallback } from "react";

export function useChatWebSocket(userId: string | null) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const wsRef = useRef<WebSocket | null>(null);
	const heartbeatIntervalRef = useRef<number | null>(null);
	const reconnectTimeoutRef = useRef<number | null>(null);

	// Track last received message time to detect stale connections
	const lastMessageTimeRef = useRef<number>(Date.now());

	// Function to send ping messages
	const sendPing = useCallback(() => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			try {
				wsRef.current.send(JSON.stringify({ action: "ping" }));
				console.log("Ping sent");
			} catch (error) {
				console.error("Failed to send ping:", error);
			}
		}
	}, []);

	// Function to check connection health
	const checkConnection = useCallback(() => {
		const now = Date.now();
		const timeSinceLastMessage = now - lastMessageTimeRef.current;

		// If no message received for 45 seconds (longer than heartbeat interval)
		if (timeSinceLastMessage > 45000 && wsRef.current) {
			console.warn("Connection appears stale, reconnecting...");

			// Close the existing connection
			if (wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.close(1000, "Connection stale, reconnecting");
			}

			// Connection will be re-established by the effect cleanup and re-run
			wsRef.current = null;
			setSocket(null);
			setIsConnected(false);
		}
	}, []);

	useEffect(() => {
		// Clear any existing intervals/timeouts when effect reruns
		if (heartbeatIntervalRef.current) {
			clearInterval(heartbeatIntervalRef.current);
			heartbeatIntervalRef.current = null;
		}

		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (!userId) return;

		const connect = () => {
			const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws?user_id=${userId}`;
			const ws = new WebSocket(wsUrl);
			wsRef.current = ws;

			ws.addEventListener("open", () => {
				console.log("WebSocket connected");
				setSocket(ws);
				setIsConnected(true);
				lastMessageTimeRef.current = Date.now();

				// Start sending pings every 20 seconds
				heartbeatIntervalRef.current = window.setInterval(() => {
					sendPing();
					checkConnection();
				}, 20000);
			});

			ws.addEventListener("message", (event) => {
				try {
					// Update last message time on any message
					lastMessageTimeRef.current = Date.now();

					const data = JSON.parse(event.data);
					console.log("Received message:", data);

					// Handle heartbeat specifically
					if (data.type === "heartbeat") {
						console.log("Heartbeat received from server");
						// No need to respond, just log it
					}
				} catch (error) {
					console.error("Failed to parse the incoming message:", error);
				}
			});

			ws.addEventListener("close", (event) => {
				console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
				wsRef.current = null;
				setSocket(null);
				setIsConnected(false);

				// Clear heartbeat interval
				if (heartbeatIntervalRef.current) {
					clearInterval(heartbeatIntervalRef.current);
					heartbeatIntervalRef.current = null;
				}

				// Attempt to reconnect after a delay, unless this was a clean close
				if (event.code !== 1000) {
					console.log("Scheduling reconnection attempt...");
					reconnectTimeoutRef.current = window.setTimeout(() => {
						console.log("Attempting to reconnect...");
						connect();
					}, 5000); // Try to reconnect after 5 seconds
				}
			});

			ws.addEventListener("error", (event) => {
				console.error("WebSocket error:", event);
				// The close event will handle reconnection
			});
		};

		connect();

		return () => {
			// Clean up on unmount or when dependencies change
			if (wsRef.current) {
				wsRef.current.close(1000, "Closing connection on unmount");
				wsRef.current = null;
			}

			if (heartbeatIntervalRef.current) {
				clearInterval(heartbeatIntervalRef.current);
				heartbeatIntervalRef.current = null;
			}

			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}
		};
	}, [userId, sendPing, checkConnection]);

	// Return connection status along with the socket
	return { socket, isConnected };
}
