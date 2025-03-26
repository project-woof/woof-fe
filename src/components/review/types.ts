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
