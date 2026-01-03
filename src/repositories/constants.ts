/**
 * Standard user fields to include in Customer/Employee queries
 * This ensures consistent user profile data across all repositories
 */
export const USER_FIELDS_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  middleName: true,
  email: true,
  phone: true,
  username: true,
  role: true,
  status: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  isTwoFactorEnabled: true,
  dateOfBirth: true,
  gender: true,
  avatar: true,
  bio: true,
  lastLoginAt: true,
  lastLoginIp: true,
  createdAt: true,
  updatedAt: true,
} as const;

