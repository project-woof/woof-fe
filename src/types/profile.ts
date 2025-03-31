export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  profile_image_url?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_petsitter?: number; // 0: false, 1: true
  created_at: string;
  last_updated: string;
}
