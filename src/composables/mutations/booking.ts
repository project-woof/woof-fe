import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBookingAPI } from "@/composables/api/booking";
import type { Booking, BookingResponse } from "@/types/booking";

export const useMutateBooking = () => {
	const queryClient = useQueryClient();
	const { create } = useBookingAPI();

	const createBooking = useMutation({
		mutationFn: (booking: Booking) => create(booking),
		onSuccess: (data, variables) => {
			const newBooking: BookingResponse = {
				booking_id: data.booking_id,
				petowner_id: data.petowner_id,
				petsitter_id: data.petsitter_id,
				start_date: data.booking_id,
				end_date: data.booking_id,
				created_at: data.booking_id,
				last_updated: data.booking_id,
                // TODO: add images to R2 to return
				// profile_image_url: data.booking_id,
				username: data.booking_id,
			};
			queryClient.setQueryData(
				["getBookingsByPetowner", variables.petowner_id],
				(oldData: BookingResponse[] = []) => [newBooking, ...oldData],
			);
			queryClient.invalidateQueries({ queryKey: ["getBookingsByPetowner"] });
		},
	});

	return { createBooking };
};
