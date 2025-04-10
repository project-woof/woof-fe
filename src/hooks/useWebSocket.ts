import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

export function useChatWebSocket(userId: string | null) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<
		"connecting" | "connected" | "disconnected" | "reconnecting"
	>("disconnected");
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectAttempts = useRef(0);
	const maxReconnectAttempts = 10; // Increased from 5
	const reconnectTimeoutRef = useRef<number | null>(null);
	const messageQueue = useRef<string[]>([]);
	const lastPongRef = useRef<number>(Date.now());
	const pingIntervalRef = useRef<number | null>(null);
	const pongTimeoutRef = useRef<number | null>(null);

	// Function to send a message with queue support
	const sendMessage = useCallback((message: any) => {
		const messageStr = JSON.stringify(message);

		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(messageStr);
			return true;
		} else {
			console.log("WebSocket not ready, queueing message");
			messageQueue.current.push(messageStr);

			// If disconnected, try to reconnect
			if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
				connect();
			}
			return false;
		}
	}, []);

	// Process the message queue
	const processQueue = useCallback(() => {
		if (
			messageQueue.current.length === 0 ||
			!wsRef.current ||
			wsRef.current.readyState !== WebSocket.OPEN
		) {
			return;
		}

		console.log(`Processing ${messageQueue.current.length} queued messages`);

		while (
			messageQueue.current.length > 0 &&
			wsRef.current.readyState === WebSocket.OPEN
		) {
			const message = messageQueue.current.shift();
			if (message) {
				try {
					wsRef.current.send(message);
				} catch (error) {
					console.error("Error sending queued message:", error);
					// Put the message back at the front of the queue
					messageQueue.current.unshift(message);
					break;
				}
			}
		}
	}, []);

	// Check if the connection is healthy
	const checkConnection = useCallback(() => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			return false;
		}

		const timeSinceLastPong = Date.now() - lastPongRef.current;
		return timeSinceLastPong < 60000; // Consider connection stale after 60 seconds without pong
	}, []);

	// Set up ping/pong with timeout
	const setupPingPong = useCallback(() => {
		// Clear any existing intervals/timeouts
		if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
		if (pongTimeoutRef.current) clearTimeout(pongTimeoutRef.current);

		// Set up ping interval (every 30 seconds)
		pingIntervalRef.current = window.setInterval(() => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				console.log("Sending ping");
				wsRef.current.send(JSON.stringify({ action: "ping" }));

				// Set up pong timeout (5 seconds)
				pongTimeoutRef.current = window.setTimeout(() => {
					console.warn("No pong received within timeout");
					if (checkConnection()) {
						console.log("Connection still seems healthy despite missing pong");
					} else {
						console.error("Connection appears stale, reconnecting");
						if (wsRef.current) {
							try {
								wsRef.current.close(4000, "No pong received");
							} catch (e) {
								console.error("Error closing stale connection:", e);
							}
							wsRef.current = null;
							setSocket(null);
							setConnectionStatus("reconnecting");
							connect();
						}
					}
				}, 5000);
			}
		}, 30000) as unknown as number;
	}, [checkConnection]);

	// Connect function with improved error handling
	const connect = useCallback(() => {
		if (!userId) return;

		// Don't try to connect if we're already connecting/connected
		if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
			return;
		}

		setConnectionStatus("connecting");
		console.log(
			`Connecting to WebSocket (attempt ${reconnectAttempts.current + 1})`,
		);

		const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws?user_id=${userId}`;
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.addEventListener("open", () => {
			console.log("WebSocket connected");
			reconnectAttempts.current = 0;
			setSocket(ws);
			setConnectionStatus("connected");
			lastPongRef.current = Date.now(); // Reset pong timer on connect

			// Set up ping/pong
			setupPingPong();

			// Process any queued messages
			processQueue();

			// Notify user if we reconnected after a failure
			if (reconnectAttempts.current > 0) {
				toast.success("Reconnected to chat server");
			}
		});

		ws.addEventListener("message", (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("Received message:", data);

				// Update last pong time when we receive a pong
				if (data.type === "info" && data.message === "pong") {
					console.log("Received pong");
					lastPongRef.current = Date.now();

					// Clear the pong timeout since we got a response
					if (pongTimeoutRef.current) {
						clearTimeout(pongTimeoutRef.current);
						pongTimeoutRef.current = null;
					}
				}
			} catch (error) {
				console.error("Failed to parse the incoming message:", error);
			}
		});

		ws.addEventListener("close", (event) => {
			console.log(`WebSocket closed: ${event.code}, ${event.reason}`);

			// Clean up
			if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
			if (pongTimeoutRef.current) clearTimeout(pongTimeoutRef.current);

			wsRef.current = null;
			setSocket(null);
			setConnectionStatus("disconnected");

			// Attempt to reconnect unless it was a clean closure
			if (
				event.code !== 1000 &&
				reconnectAttempts.current < maxReconnectAttempts
			) {
				setConnectionStatus("reconnecting");

				// Exponential backoff with jitter
				const baseTimeout = Math.min(
					1000 * 2 ** reconnectAttempts.current,
					30000,
				);
				const jitter = Math.random() * 1000; // Add up to 1 second of jitter
				const timeout = baseTimeout + jitter;

				console.log(
					`Attempting to reconnect in ${Math.round(timeout / 1000)}s...`,
				);
				reconnectAttempts.current += 1;

				// Show a toast if this isn't the first attempt
				if (reconnectAttempts.current > 1) {
					toast.error(
						`Connection lost. Reconnecting... (Attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`,
					);
				}

				reconnectTimeoutRef.current = window.setTimeout(connect, timeout);
			} else if (reconnectAttempts.current >= maxReconnectAttempts) {
				toast.error(
					"Failed to connect after multiple attempts. Please refresh the page.",
				);
			}
		});

		ws.addEventListener("error", (event) => {
			console.error("WebSocket error:", event);
			// We don't need to do anything here as the close event will fire after an error
		});
	}, [userId, setupPingPong, processQueue]);

	// Initial connection
	useEffect(() => {
		connect();

		return () => {
			// Clean up on unmount
			if (wsRef.current) {
				wsRef.current.close(1000, "Closing connection on unmount");
				wsRef.current = null;
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (pingIntervalRef.current) {
				clearInterval(pingIntervalRef.current);
			}
			if (pongTimeoutRef.current) {
				clearTimeout(pongTimeoutRef.current);
			}
		};
	}, [userId, connect]);

	// Handle visibility change (browser tab focus/blur)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				// Check connection health when tab becomes visible
				if (!checkConnection()) {
					console.log(
						"Connection appears stale after visibility change, reconnecting",
					);
					if (wsRef.current) {
						try {
							wsRef.current.close(
								4001,
								"Connection stale after visibility change",
							);
						} catch (e) {
							console.error("Error closing stale connection:", e);
						}
					}
					connect();
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [checkConnection, connect]);

	// Return both the socket and the sendMessage function
	return {
		socket,
		sendMessage,
		connectionStatus,
		queueLength: messageQueue.current.length,
	};
}
