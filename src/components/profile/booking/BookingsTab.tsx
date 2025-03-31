import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { Booking } from "@/types/booking";

interface BookingsTabProps {
  bookings: Booking[] | undefined;
  isFetched: boolean;
}

export const BookingsTab = ({ bookings, isFetched }: BookingsTabProps) => {
  function getBookingStatus(start_date: string, end_date: string): string {
    const currentTime = new Date();
    const startTime = new Date(start_date);
    const endTime = new Date(end_date);

    if (currentTime < startTime) {
      return "Upcoming";
    } else if (currentTime >= startTime && currentTime < endTime) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  }

  if (!isFetched) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">Loading...</h3>
        <p className="text-muted-foreground mb-4">Fetching your bookings</p>
      </div>
    );
  }
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">
          Book a petsitter to see your bookings here
        </p>
      </div>
    );
  }

  // For simplicity, use provided status directly.
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.booking_id}
          className="flex items-start p-4 border rounded-lg"
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={booking.profile_image_url}
              alt={booking.username}
            />
            <AvatarFallback>{booking.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{booking.username}</h3>
                {/* <p className="text-sm text-muted-foreground">
                  {booking.service}
                </p> */}
              </div>
              <Badge
                variant={
                  getBookingStatus(booking.start_date, booking.end_date) ===
                  "Upcoming"
                    ? "outline"
                    : "secondary"
                }
              >
                {getBookingStatus(booking.start_date, booking.end_date)}
              </Badge>
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{booking.start_date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
