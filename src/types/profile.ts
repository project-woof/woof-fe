export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  profile_image_url?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_petsitter?: number;
  created_at: string;
  last_updated: string;
}
