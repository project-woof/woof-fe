export interface Review {
    review_id: string;
    username: string;
    profile_image_url: string;
    created_at: string;
    rating: number;
    comment: string;
}

export interface CreateReview {
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    comment: string;
}