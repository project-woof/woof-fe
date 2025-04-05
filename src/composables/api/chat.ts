import type {
  ChatRoom,
  ChatMessage,
  ChatRoomSummary,
  ChatMessageSummary,
  CreateChatRoomBody,
  CreateChatMessageBody,
} from "@/types/chat";
import { fetcher } from "@/util/fetcher";

export function useChatAPI() {
  const getChatRooms = async (userId: string) => {
    const response = await fetcher(`/chat/getChatRooms/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json<ChatRoomSummary[]>();
  };

  const getMessages = async (roomId: string) => {
    const response = await fetcher(`/chat/getMessages/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json<ChatMessageSummary[]>();
  };

  const createChatRoom = async (body: CreateChatRoomBody) => {
    const response = await fetcher(`/chat/createChatRoom`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await await response.json<ChatRoom>();
  };

  const createMessage = async (body: CreateChatMessageBody) => {
    const response = await fetcher("/chat/createchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json<ChatMessage>();
  };

  return { getChatRooms, getMessages, createChatRoom, createMessage };
}
