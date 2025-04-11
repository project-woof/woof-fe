import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotificationQuery } from "@/composables/queries/notification";
import { convertDateTimeLocal } from "@/util/format";

interface NotificationTabProps {
	userId: string;
}

export default function NotificationDropdown({ userId }: NotificationTabProps) {
	const { getNotificationsByUserId } = useNotificationQuery();
	const { data: notifications = [] } = getNotificationsByUserId(userId);
	const notificationTitles: Record<string, string> = {
		message: "New messages",
		booking_request: "Booking Requested",
		booking_response: "Booking Confirmed",
	};

	async function clearAllNotifications() {
		console.log("Cleared all!");
	}

	async function markAsRead(notification_id: string) {
		console.log(`Cleared ${notification_id}!`);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{notifications.length > 0 && (
						<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
							{notifications.length}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between p-2 border-b">
					<h3 className="font-medium">Notifications</h3>
					{notifications.length > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="text-xs hover:bg-accent"
							onClick={clearAllNotifications}
						>
							Mark all as read
						</Button>
					)}
				</div>
				<div className="max-h-[400px] overflow-y-auto">
					{notifications.length > 0 ? (
						notifications.map((notification) => (
							<div
								key={notification.notification_id}
								className="p-3 border-b last:border-0 cursor-pointer hover:bg-accent"
								onClick={() => markAsRead(notification.notification_id)}
							>
								<div className="flex justify-between items-start">
									<h4 className="text-sm font-medium">
										{notificationTitles[notification.notification_type] || ""}
									</h4>
									<span className="text-xs text-muted-foreground">
										{convertDateTimeLocal(notification.created_at)}
									</span>
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									{`You have ${notification.count} new message${notification.count === 1 ? "" : "s"} from ${notification.sender_id}`}
								</p>
							</div>
						))
					) : (
						<div className="p-4 text-center text-muted-foreground">
							<p>No notifications</p>
						</div>
					)}
				</div>
				{/* Either remove or create new notification page */}
				{notifications.length > 0 && (
					<div className="p-2 border-t">
						<Button
							variant="ghost"
							size="sm"
							className="w-full text-sm hover:bg-accent"
						>
							View all notifications
						</Button>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
