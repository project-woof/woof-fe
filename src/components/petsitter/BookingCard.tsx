import type { PetsitterProfile } from "@/types/profile";
import { CalendarIcon, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/authContext";
import type { Booking } from "@/types/booking";
import type { CreateNotificationBody } from "@/types/notification";
import { addHoursToDateTime, convertDateTimeToISO } from "@/util/format";
import { useMutateBooking } from "@/composables/mutations/booking";
import { useMutateNotification } from "@/composables/mutations/notification";
import { useMutateChat } from "@/composables/mutations/chat";

interface BookingCardProps {
	petsitterData: PetsitterProfile;
}

export function BookingCard({ petsitterData }: BookingCardProps) {
	const router = useRouter();
	const { userProfile } = useAuth();
	const { createChatRoomMutation } = useMutateChat();
	const { createNotificationMutation } = useMutateNotification();
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
	const [hours, setHours] = useState<number>(2);
	const [totalPrice, setTotalPrice] = useState<number>(petsitterData.price * 2);
	// const { getBookingsByPetowner } = useBookingQuery();
	const { createBooking } = useMutateBooking();

	// if (userProfile){
	// 	const { data: messages = [] } = getBookingsByPetowner(userProfile?.id,5,0)
	// }

	// Mock time slots TODO: fetch from db
	const timeSlots = [
		"8:00 AM",
		"9:00 AM",
		"10:00 AM",
		"11:00 AM",
		"12:00 PM",
		"1:00 PM",
		"2:00 PM",
		"3:00 PM",
		"4:00 PM",
		"5:00 PM",
	];

	const handleSendBooking = async () => {
		if (!userProfile) {
			router.navigate({ to: "/login" });
			return;
		}

		// TODO: alert user misising fields
		if (!date || !selectedTimeSlot) {
			console.error("Missing fields");
			return;
		}

		let bookingDate = convertDateTimeToISO(date, selectedTimeSlot);
		const bookingBody: Booking = {
			petsitter_id: petsitterData.id,
			petowner_id: userProfile.id,
			start_date: convertDateTimeToISO(date, selectedTimeSlot),
			end_date: addHoursToDateTime(bookingDate, hours),
		};

		try {
			await createBooking.mutateAsync(bookingBody);
			const response = await createChatRoom();
			const createNotificationBody: CreateNotificationBody = {
				user_id: petsitterData.id,
				sender_id: userProfile.id,
				room_id: response!.room_id,
				notification_type: "booking_request",
			};
			await createNotificationMutation.mutateAsync(createNotificationBody);
		} catch (error) {
			toast(`Failed to send message: ${error}`);
		}
	};

	const handleRoomOnMessageClick = async () => {
		await createChatRoom();
		router.navigate({
			to: "/chat",
		});
	};

	const updateTotalPrice = (newHours: number) => {
		setHours(newHours);
		setTotalPrice(petsitterData.price * newHours);
	};

	const createChatRoom = async () => {
		if (!userProfile) {
			router.navigate({ to: "/login" });
			return;
		}

		const chatRoomData = {
			participant1_id: userProfile.id,
			participant2_id: petsitterData.id,
		};

		try {
			const response = await createChatRoomMutation.mutateAsync(chatRoomData);
			return response;
		} catch (error) {
			console.error("Error creating chat room:", error);
		}
	};

	return (
		<div className="lg:col-span-1">
			<Card className="sticky top-24">
				<CardContent className="pt-6">
					<div className="mb-4">
						<h3 className="text-xl font-semibold mb-1">
							${petsitterData.price}{" "}
							<span className="text-muted-foreground text-base font-normal">
								/hour
							</span>
						</h3>
					</div>

					<div className="mb-4">
						<h4 className="font-medium mb-2 flex items-center">
							<CalendarIcon className="h-4 w-4 mr-2" />
							Select Date
						</h4>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							className="border rounded-md p-3"
						/>
					</div>

					<div className="mb-6">
						<h4 className="font-medium mb-2 flex items-center">
							<Clock className="h-4 w-4 mr-2" />
							Select Time
						</h4>
						<div className="grid grid-cols-2 gap-2">
							{timeSlots.map((time) => (
								<Button
									key={time}
									variant={selectedTimeSlot === time ? "default" : "outline"}
									className="text-sm"
									onClick={() => setSelectedTimeSlot(time)}
								>
									{time}
								</Button>
							))}
						</div>
					</div>

					<div className="mb-6">
						<h4 className="font-medium mb-2 flex items-center text-navy">
							<Clock className="h-4 w-4 mr-2" />
							Duration
						</h4>
						<div className="flex items-center space-x-3">
							<Label htmlFor="hours" className="text-navy">
								Hours:
							</Label>
							<div className="flex items-center">
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-r-none border-beige text-navy"
									onClick={() => hours > 1 && updateTotalPrice(hours - 1)}
								>
									<span>-</span>
								</Button>
								<Input
									id="hours"
									type="number"
									min="1"
									value={hours}
									onChange={(e) =>
										updateTotalPrice(Number.parseInt(e.target.value) || 1)
									}
									className="h-8 w-16 rounded-none text-center border-x-0 border-beige"
								/>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-l-none border-beige text-navy"
									onClick={() => updateTotalPrice(hours + 1)}
								>
									<span>+</span>
								</Button>
							</div>
						</div>
						<div className="mt-4 p-3 bg-beige/30 rounded-md">
							<div className="flex justify-between items-center text-navy">
								<span>Hourly Rate:</span>
								<span>${petsitterData.price}/hour</span>
							</div>
							<div className="flex justify-between items-center mt-1 text-navy">
								<span>Duration:</span>
								<span>
									{hours} hour{hours !== 1 ? "s" : ""}
								</span>
							</div>
							<div className="border-t border-beige my-2"></div>
							<div className="flex justify-between items-center font-semibold text-navy">
								<span>Total:</span>
								<span>${totalPrice}</span>
							</div>
						</div>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								className="w-full mt-4 mb-3 bg-navy hover:bg-navy-light text-cream"
								disabled={selectedTimeSlot === null}
							>
								Book Now
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Confirm booking?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to book {petsitterData.username} for{" "}
									{hours} hour{hours !== 1 ? "s" : ""} on{" "}
									{date?.toLocaleDateString()} at {selectedTimeSlot}?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button type="submit" onClick={() => handleSendBooking()}>
										Book
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<Button
						variant="outline"
						className="w-full flex items-center justify-center"
						onClick={() => handleRoomOnMessageClick()}
					>
						<MessageSquare className="h-4 w-4 mr-2" />
						Message
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
