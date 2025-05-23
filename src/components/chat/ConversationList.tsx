import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ChatRoomSummary } from "@/types/chat";
import { usePollingQuery } from "@/composables/queries/polling";
import { buildImageUrl } from "@/util/format";

interface ConversationListProps {
	userId: string;
	chatRooms: ChatRoomSummary[];
	selectedChatRoom: ChatRoomSummary | null;
	setSelectedChatRoom: (conversation: ChatRoomSummary) => void;
}

export function ConversationList({
	userId,
	chatRooms,
	selectedChatRoom,
	setSelectedChatRoom,
}: ConversationListProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Add null check and default value for username
	const filteredChatRooms = chatRooms.filter((chatRoom) => {
		// Ensure username exists and is a string before filtering
		const username = chatRoom.username || "";
		return username.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const { pollMessages } = usePollingQuery();
	pollMessages(userId);

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
				{filteredChatRooms.length > 0 ? (
					filteredChatRooms.map((chatRoom) => (
						<div
							key={chatRoom.room_id}
							className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
								selectedChatRoom?.room_id === chatRoom.room_id
									? "bg-gray-50"
									: ""
							}`}
							onClick={() => setSelectedChatRoom(chatRoom)}
						>
							<div className="flex items-start">
								<div className="relative mr-3">
									<Avatar>
										<AvatarImage
											src={buildImageUrl(chatRoom.profile_image_url)}
											alt={chatRoom.username || "User"}
										/>
										<AvatarFallback>
											{(chatRoom.username || "U").charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-baseline">
										<h3 className="text-sm font-medium truncate">
											{chatRoom.username || "Unknown User"}
										</h3>
										<span className="text-xs text-muted-foreground">
											{chatRoom.last_updated}
										</span>
									</div>
									<p className="text-sm text-muted-foreground truncate">
										{chatRoom.last_message || "No messages yet"}
									</p>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="p-4 text-center text-muted-foreground">
						No conversations found
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
