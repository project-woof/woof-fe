export interface Bookings {
  booking_id: string;
  petowner_id: string;
  petsitter_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  last_updated: string;
  profile_image_url: string;
  username: string;
}

export interface BookingApiResponse {
  bookings: Bookings[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}