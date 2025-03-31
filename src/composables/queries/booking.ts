import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@/types/booking";
import { useBookingAPI } from "@/composables/api/booking";

const { get, getAll } = useBookingAPI();

export const useBookingQuery = () => {
  function getBookingById(bookingId: string) {
    const { data, isFetched } = useQuery<Booking>({
      queryKey: ["booking", bookingId],
      queryFn: () => get(bookingId),
    });
    return { data, isFetched };
  }

  function getBookings(userId: string, limit: number, offset: number) {
    const { data, isFetched } = useQuery<Booking[]>({
      queryKey: ["bookings", userId, limit, offset],
      queryFn: () => getAll(userId, limit, offset),
    });
    return { data, isFetched };
  }

  return { getBookingById, getBookings };
};
