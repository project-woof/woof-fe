import { useQuery } from "@tanstack/react-query";
import type { BookingResponse } from "@/types/booking";
import { useBookingAPI } from "@/composables/api/booking";

const { get, getAllByPetowner, getAllByPetsitter } = useBookingAPI();

export const useBookingQuery = () => {
  function getBookingById(bookingId: string) {
    const { data, isFetched } = useQuery<BookingResponse>({
      queryKey: ["booking", bookingId],
      queryFn: () => get(bookingId),
    });
    return { data, isFetched };
  }

  function getBookingsByPetowner(
    userId: string,
    limit: number,
    offset: number
  ) {
    const { data, isFetched } = useQuery<BookingResponse[]>({
      queryKey: ["bookings", userId, limit, offset],
      queryFn: () => getAllByPetowner(userId, limit, offset),
    });
    return { data, isFetched };
  }

  function getBookingsByPetsitter(
    userId: string,
    limit: number,
    offset: number
  ) {
    const { data, isFetched } = useQuery<BookingResponse[]>({
      queryKey: ["bookings", userId, limit, offset],
      queryFn: () => getAllByPetsitter(userId, limit, offset),
    });
    return { data, isFetched };
  }

  return { getBookingById, getBookingsByPetowner, getBookingsByPetsitter };
};
