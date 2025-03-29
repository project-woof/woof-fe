import { CardContent } from "@/components/ui/card";
import { type Booking } from "@/components/booking/types";
import { BookingEmptyState } from "./empty-state";
import { BookingErrorState } from "./error-state";
import { BookingLoadingState } from "./loading-state";
import { BookingsList } from "./bookings-list";

interface BookingsContentProps {
  bookings: Booking[];
  bookingsLoading: boolean;
  bookingsError: string | null;
  hasMoreBookings: boolean;
  fetchBookings: () => void;
  loadMoreBookings: () => void;
  getBookingStatus: (startDate: string, endDate: string) => string;
  formatBookingDate: (date: string) => string;
  onFindPetsitter: () => void;
}

export function BookingsContent({
  bookings,
  bookingsLoading,
  bookingsError,
  hasMoreBookings,
  fetchBookings,
  loadMoreBookings,
  getBookingStatus,
  formatBookingDate,
  onFindPetsitter,
}: BookingsContentProps) {
  return (
    <CardContent>
      {bookingsLoading && bookings.length === 0 ? (
        <BookingLoadingState />
      ) : bookingsError ? (
        <BookingErrorState error={bookingsError} onRetry={fetchBookings} />
      ) : bookings.length > 0 ? (
        <BookingsList
          bookings={bookings}
          hasMoreBookings={hasMoreBookings}
          isLoading={bookingsLoading}
          onLoadMore={loadMoreBookings}
          getBookingStatus={getBookingStatus}
          formatBookingDate={formatBookingDate}
        />
      ) : (
        <BookingEmptyState onFindPetsitter={onFindPetsitter} />
      )}
    </CardContent>
  );
}
