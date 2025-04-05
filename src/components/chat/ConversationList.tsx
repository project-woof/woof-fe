import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ChatRoomSummary } from "@/types/chat";

interface ConversationListProps {
  chatRooms: ChatRoomSummary[];
  selectedChatRoom: ChatRoomSummary | null;
  setSelectedChatRoom: (conversation: ChatRoomSummary) => void;
}

export function ConversationList({
  chatRooms,
  selectedChatRoom,
  setSelectedChatRoom,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredChatRooms = chatRooms.filter((chatRooms) =>
    chatRooms.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {filteredChatRooms.map((chatRoom) => (
          <div
            key={chatRoom.room_id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              selectedChatRoom?.room_id === chatRoom.room_id ? "bg-gray-50" : ""
            }`}
            onClick={() => setSelectedChatRoom(chatRoom)}
          >
            <div className="flex items-start">
              <div className="relative mr-3">
                <Avatar>
                  <AvatarImage
                    src={chatRoom.profile_image_url}
                    alt={chatRoom.username}
                  />
                  <AvatarFallback>{chatRoom.username.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* {conversation.online && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )} */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium truncate">
                    {chatRoom.username}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chatRoom.last_updated}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {chatRoom.last_message}
                </p>
              </div>
              {/* {conversation.unread > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {conversation.unread}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
