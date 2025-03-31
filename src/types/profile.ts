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
