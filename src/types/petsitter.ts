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