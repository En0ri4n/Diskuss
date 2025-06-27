export interface UserDto {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  roles: string[];
  profilePictureUrl?: string; // Optional field for user profile picture
}
