"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type Booking } from "@/components/booking/types";
import { BookingCard } from "./booking-card";

interface BookingsListProps {
  bookings: Booking[];
  hasMoreBookings: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  getBookingStatus: (startDate: string, endDate: string) => string;
  formatBookingDate: (date: string) => string;
}

export function BookingsList({
  bookings,
  hasMoreBookings,
  isLoading,
  onLoadMore,
  getBookingStatus,
  formatBookingDate,
}: BookingsListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.booking_id}
          booking={booking}
          getBookingStatus={getBookingStatus}
          formatBookingDate={formatBookingDate}
        />
      ))}

      {hasMoreBookings && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Bookings"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
