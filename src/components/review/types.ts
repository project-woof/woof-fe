export interface Review {
  review_id: string
  reviewer_id: string
  reviewee_id: string
  username?: string
  profile_image_url?: string
  created_at: string
  last_updated: string;
  rating: number
  comment: string
}

export interface User {
  user_id: string;
  username: string;
  email: string;

  profile_image_url?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_petsitter?: number; // 0: false, 1: true
  created_at: string;
  last_updated: string;
  location?: string; // We'll derive this from latitude/longitude or use a placeholder
}

// Updated API response interface to match the structure
export interface ReviewsApiResponse {
  reviews: Review[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

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