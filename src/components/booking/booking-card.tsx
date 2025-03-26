import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Booking } from "@/components/booking/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  getBookingStatus: (startDate: string, endDate: string) => string;
  formatBookingDate: (date: string) => string;
}

export function BookingCard({
  booking,
  getBookingStatus,
  formatBookingDate,
}: BookingCardProps) {
  return (
    <div className="flex items-start p-4 border rounded-lg">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={booking.profile_image_url} alt={booking.username} />
        <AvatarFallback>{booking.petsitter_id.charAt(0)}</AvatarFallback>
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
          <span>{formatBookingDate(booking.start_date)}</span>
        </div>
      </div>
    </div>
  );
}
