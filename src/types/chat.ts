export interface ChatRoom {
  room_id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string;
  created_at: string;
  last_updated: string;
}

export interface ChatMessage {
  message_id: string;
  room_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  last_updated: string;
}

export interface ChatRoomSummary {
  room_id: string;
  username: string;
  profile_image_url: string;
  last_message: string;
  last_updated: string;
}

export interface ChatMessageSummary {
  message_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export interface CreateChatRoomBody {
  participant1_id: string;
  participant2_id: string;
}

export interface CreateChatMessageBody {
  room_id: string;
  sender_id: string;
  text: string;
}
