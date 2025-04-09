import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { convertDateLocal } from "@/util/format";
import { MessageBubble } from "./MessageBubble";
import type { ChatRoomSummary } from "@/types/chat";
import { DateBubble } from "./DateBubble";
import type { CreateChatMessageBody } from "@/types/chat";
import { useChatQuery } from "@/composables/queries/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useMutateChat } from "@/composables/mutations/chat";
import { useChatWebSocket } from "@/hooks/useWebSocket";

interface ChatAreaProps {
	selectedChatRoom: ChatRoomSummary | null;
	userId: string;
}

export function ChatArea({ selectedChatRoom, userId }: ChatAreaProps) {
	if (!selectedChatRoom) {
		return (
			<div className="col-span-2 flex items-center justify-center h-full">
				<p className="text-gray-500">Select a conversation to start chatting</p>
			</div>
		);
	}

	const { getMessagesByRoomId } = useChatQuery();
	const { createMessageMutation } = useMutateChat();
	const [newMessage, setNewMessage] = useState("");
	const [liveMessages, setLiveMessages] = useState<any[]>([]); // state for WebSocket messages
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);

	// Fetch history messages from the API
	const { data: messages = [] } = getMessagesByRoomId(selectedChatRoom.room_id);

	// Set up WebSocket connection (using your hook)
	const ws = useChatWebSocket(userId);

	// Listen for new messages coming from WebSocket and append them.
	useEffect(() => {
		if (!ws) return;
		const handleIncomingMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data);
				useQueryClient().invalidateQueries({
					queryKey: ["getChatRoomsByUserId"],
				});
				if (data.type === "message") {
					if (selectedChatRoom.room_id !== data.room_id) return; // Ignore messages not for the current room
					const newMessage = {
						message_id: data.message_id,
						sender_id: data.sender_id,
						room_id: data.room_id,
						text: data.message,
						created_at: data.created_at,
					};
					setLiveMessages((prevMessages) => [...prevMessages, newMessage]);
				}

				// You might also handle "subscribed", "info", and "error" messages here.
			} catch (err) {
				console.error("Error parsing incoming WS message:", err);
			}
		};

		ws.addEventListener("message", handleIncomingMessage);
		return () => {
			ws.removeEventListener("message", handleIncomingMessage);
		};
	}, [ws]);

	const allMessages = [...messages, ...liveMessages];

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [allMessages]);

	const handleScroll = () => {
		if (!scrollAreaRef.current) return;
		const scrollableElement =
			scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]",
			) || scrollAreaRef.current;
		const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		const isAtBottom = distanceFromBottom < 100;
		setShowScrollToBottom(!isAtBottom);
	};

	useEffect(() => {
		handleScroll();
		const scrollableElement =
			scrollAreaRef.current?.querySelector(
				"[data-radix-scroll-area-viewport]",
			) || scrollAreaRef.current;
		if (scrollableElement) {
			scrollableElement.addEventListener("scroll", handleScroll);
			window.addEventListener("resize", handleScroll);
			return () => {
				scrollableElement.removeEventListener("scroll", handleScroll);
				window.removeEventListener("resize", handleScroll);
			};
		}
	}, []);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !selectedChatRoom) return;

		const messageBody: CreateChatMessageBody = {
			room_id: selectedChatRoom.room_id,
			sender_id: userId,
			text: newMessage,
		};

		try {
			setNewMessage("");
			const createdMessage =
				await createMessageMutation.mutateAsync(messageBody);
			if (!ws || ws.readyState !== WebSocket.OPEN) return;
			const outgoingMessage = {
				action: "send_message",
				message_id: createdMessage.message_id,
				sender_id: createdMessage.sender_id,
				room_id: selectedChatRoom.room_id,
				message: createdMessage.text,
				created_at: createdMessage.created_at,
			};
			ws.send(JSON.stringify(outgoingMessage));
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const renderedMessages = allMessages
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		)
		.reduce<React.ReactNode[]>((acc, message, idx) => {
			const messageDate = convertDateLocal(message.created_at);
			if (idx === 0) {
				acc.push(
					<DateBubble key={`date-${message.message_id}`} date={messageDate} />,
				);
			} else {
				const prevDate = convertDateLocal(allMessages[idx - 1].created_at);
				if (messageDate !== prevDate) {
					acc.push(
						<DateBubble
							key={`date-${message.message_id}`}
							date={messageDate}
						/>,
					);
				}
			}
			acc.push(
				<MessageBubble
					key={message.message_id}
					message={message}
					userId={userId}
				/>,
			);
			return acc;
		}, []);

	return (
		<div className="col-span-2 flex flex-col h-full relative">
			{/* Chat Header */}
			<div className="p-4 border-b flex items-center">
				<Avatar className="h-10 w-10 mr-3">
					<AvatarImage
						src={selectedChatRoom.profile_image_url}
						alt={selectedChatRoom.username}
					/>
					<AvatarFallback>{selectedChatRoom.username.charAt(0)}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className="font-medium">{selectedChatRoom.username}</h3>
				</div>
			</div>

			{/* Scrollable Messages */}
			<ScrollArea
				ref={scrollAreaRef}
				className="flex px-4 h-[calc(100vh-19rem)]"
				onScrollCapture={handleScroll}
			>
				<div className="space-y-4 w-full">
					{renderedMessages}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			{/* Scroll To Bottom Button */}
			{showScrollToBottom && (
				<div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 z-10">
					<Button
						onClick={scrollToBottom}
						className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 shadow hover:bg-gray-200 transition duration-300"
					>
						Scroll To Bottom
					</Button>
				</div>
			)}

			{/* Message Input */}
			<div className="p-4 border-t">
				<form
					onSubmit={handleSendMessage}
					className="flex items-center space-x-2"
				>
					<Input
						placeholder="Type a message..."
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className="flex-1"
					/>
					<Button type="submit" size="icon">
						<Send className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}
