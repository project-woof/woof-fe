import type { Booking } from "@/types/booking";
import { fetcher } from "@/util/fetcher";

export function useBookingAPI() {
	const get = async (bookingId: string) => {
		const response = await fetcher(`/booking/getBooking/${bookingId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json<Booking>();
	};

	const getAllByPetowner = async (
		userId: string,
		limit: number,
		offset: number,
	) => {
		const response = await fetcher(
			`/booking/getBookings/petowner?id=${encodeURIComponent(userId)}&limit=${limit}&offset=${offset}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const bookingRes = await response.json<Booking[]>();
		return bookingRes;
	};

	const getAllByPetsitter = async (
		userId: string,
		limit: number,
		offset: number,
	) => {
		const response = await fetcher(
			`/booking/getBookings/petowner?id=${encodeURIComponent(userId)}&limit=${limit}&offset=${offset}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const bookingRes = await response.json<Booking[]>();
		return bookingRes;
	};

	const create = async (booking: Booking) => {
		const response = await fetcher("/booking/createBooking", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(booking),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json<Booking>();
	};

	const remove = async (bookingId: string) => {
		const response = await fetcher(`/booking/deleteBooking/${bookingId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
	};

	return { get, getAllByPetowner, getAllByPetsitter, create, remove };
}
