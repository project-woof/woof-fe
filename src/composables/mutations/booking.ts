import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBookingAPI } from "@/composables/api/booking";
import type { Booking } from "@/types/booking";

export const useMutateChat = () => {
	const queryClient = useQueryClient();
	const { create } = useBookingAPI();

	const createBooking = useMutation({
		mutationFn: (booking: Booking) => create(booking),
		onSuccess: (data, variables) => {
			const newBooking: Booking = {
				booking_id: data.booking_id,
				petowner_id: data.petowner_id,
				petsitter_id: data.petsitter_id,
				start_date: data.booking_id,
				end_date: data.booking_id,
				created_at: data.booking_id,
				last_updated: data.booking_id,
				// profile_image_url: data.booking_id,
				username: data.booking_id,
			};
			queryClient.setQueryData(
				["getAllByPetowner", variables.petowner_id],
				(oldData: Booking[] = []) => [newBooking, ...oldData],
			);
			queryClient.invalidateQueries({ queryKey: ["getAllByPetowner"] });
		},
	});

	return { createBooking };
};
