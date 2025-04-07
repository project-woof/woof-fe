import type { Review } from "./review";

export interface PetsitterData {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  price: string;
  hourlyRate: number;
  bio: string;
  services: string[];
  availability: string;
  images: string[];
  reviewsList: Review[];
}
export interface User {
	id: string;
	username: string;
	email: string;
	emailVerified: boolean;
	profile_image_url?: string;
	latitude: number;
	longitude: number;
	description: string;
	is_petsitter: number;
	created_at: string;
	last_updated: string;
}

export interface Petsitter {
	total_reviews: number;
	sum_of_rating: number;
	price: number;
	petsitter_description: string;
	service_tags: string[];
}

export interface PetsitterProfile extends User, Petsitter {
	first_image?: string;
	distance: number;
	avg_rating?: number;
	composite_score?: number;
}