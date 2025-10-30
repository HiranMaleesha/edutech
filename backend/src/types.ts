/**
 * Represents a course in the system.
 * Contains all necessary information about a course including metadata.
 */
export interface Course {
  /** Unique identifier for the course */
  id: string;
  /** Title of the course */
  title: string;
  /** Detailed description of the course content */
  description: string;
  /** Category or subject area of the course */
  category: string;
  /** Difficulty level of the course */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** Duration of the course in hours */
  duration: number;
  /** Whether the course is published and visible to users */
  published: boolean;
  /** ID of the user who created the course */
  userId: string;
  /** Timestamp when the course was created */
  createdAt: Date;
  /** Timestamp when the course was last updated */
  updatedAt: Date;
}

/**
 * Represents a user in the system.
 * Contains authentication and profile information.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Unique username for login */
  username: string;
  /** Email address of the user */
  email: string;
  /** Password for authentication (should be hashed in production) */
  password: string;
  /** Timestamp of the user's last login (optional) */
  lastLogin?: Date | null;
}

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** Username for authentication */
  username: string;
  /** Password for authentication */
  password: string;
}

/**
 * Response payload for successful authentication.
 */
export interface AuthResponse {
  /** JWT token for subsequent API calls */
  token: string;
  /** User information (excluding password) */
  user: Omit<User, 'password'>;
}

/**
 * Generic API response wrapper.
 * Used for all API endpoints to provide consistent response structure.
 */
export interface ApiResponse<T> {
  /** Indicates if the operation was successful */
  success: boolean;
  /** Response data (present only if success is true) */
  data?: T;
  /** Optional success message */
  message?: string;
  /** Error message (present only if success is false) */
  error?: string;
}