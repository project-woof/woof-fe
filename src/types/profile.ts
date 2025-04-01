export interface User {
  id: string;
  name: string; // username
  email: string;
  emailVerified: boolean;
  image?: string; // profile_image_url
  latitude?: number;
  longitude?: number;
  description?: string;
  is_petsitter?: number; // 0: false, 1: true
  createdAt: string; // created_at
  updatedAt: string; // last_updated
}
