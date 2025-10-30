import type { Course, LoginRequest, AuthResponse, ApiResponse, ProfileData, UpdateProfileRequest } from '../types';

/**
 * Base URL for API endpoints.
 * In production, this should be configurable via environment variables.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API client class for handling all HTTP requests to the backend.
 * Manages authentication tokens and provides methods for all API operations.
 */
class ApiClient {
  /** JWT authentication token */
  private token: string | null = null;

  /**
   * Sets the authentication token for subsequent requests.
   * @param token - JWT token string
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clears the authentication token.
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Generic method for making HTTP requests to the API.
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Promise resolving to API response
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  }

  // Authentication methods

  /**
   * Authenticates a user with username and password.
   * @param credentials - Login credentials
   * @returns Promise resolving to authentication response
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Logs out the current user.
   * @returns Promise resolving to logout response
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });

    if (response.success) {
      this.clearToken();
    }

    return response;
  }

  // Course management methods

  /**
   * Fetches all courses from the API.
   * @returns Promise resolving to array of courses
   */
  async fetchCourses(): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>('/courses');
  }

  /**
   * Creates a new course.
   * @param course - Course data without generated fields
   * @returns Promise resolving to created course
   */
  async addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Course>> {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  /**
   * Updates an existing course.
   * @param id - Course ID to update
   * @param updates - Partial course data to update
   * @returns Promise resolving to updated course
   */
  async updateCourse(id: string, updates: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Deletes a course by ID.
   * @param id - Course ID to delete
   * @returns Promise resolving to deletion response
   */
  async deleteCourse(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile management methods

  /**
   * Fetches the current user's profile data.
   * @returns Promise resolving to profile data
   */
  async getProfile(): Promise<ApiResponse<ProfileData>> {
    return this.request<ProfileData>('/profile');
  }

  /**
   * Updates the current user's profile.
   * @param profileData - Updated profile information
   * @returns Promise resolving to updated profile data
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<Omit<ProfileData, 'coursesCreated'>>> {
    return this.request<Omit<ProfileData, 'coursesCreated'>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

/**
 * Singleton instance of the API client.
 */
export const apiClient = new ApiClient();