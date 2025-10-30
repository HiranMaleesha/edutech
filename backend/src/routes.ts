import express from 'express';
import type { Request, Response } from 'express';
import { courses, users, addCourse, updateCourse, deleteCourse, getCourseById, findUserByUsername } from './storage.js';
import { authenticateToken, validateCourse, generateToken } from './middleware.js';
import type { ApiResponse, LoginRequest, AuthResponse, Course, User } from './types.js';

/**
 * Express router for handling API routes.
 * Contains authentication, course management, and profile routes.
 */
const router = express.Router();

/**
 * Authentication routes
 */

/**
 * User login endpoint.
 * @route POST /auth/login
 * @param req.body - LoginRequest containing username and password
 * @returns AuthResponse with JWT token and user info
 */
router.post('/auth/login', (req: Request, res: Response): void => {
  const { username, password }: LoginRequest = req.body;

  if (!username || !password) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Username and password are required'
    };
    res.status(400).json(response);
    return;
  }

  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid credentials'
    };
    res.status(401).json(response);
    return;
  }

  // Update last login timestamp
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex]!.lastLogin = new Date();
  }

  const token = generateToken({ id: user.id, username: user.username });
  const response: ApiResponse<AuthResponse> = {
    success: true,
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email, lastLogin: users[userIndex]?.lastLogin ?? null }
    }
  };
  res.json(response);
});

/**
 * User logout endpoint.
 * @route POST /auth/logout
 * @returns Success message (client handles token removal)
 */
router.post('/auth/logout', authenticateToken, (req: Request, res: Response): void => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: 'Logged out successfully' }
  };
  res.json(response);
});

/**
 * Course management routes
 */

/**
 * Get all courses.
 * @route GET /courses
 * @returns Array of all courses
 */
router.get('/courses', (req: Request, res: Response): void => {
  const response: ApiResponse<Course[]> = {
    success: true,
    data: courses
  };
  res.json(response);
});

/**
 * Get a specific course by ID.
 * @route GET /courses/:id
 * @param req.params.id - Course ID
 * @returns Course data or error if not found
 */
router.get('/courses/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  if (!id) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course ID is required'
    };
    res.status(400).json(response);
    return;
  }
  const course = getCourseById(id);

  if (!course) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course not found'
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Course> = {
    success: true,
    data: course
  };
  res.json(response);
});

/**
 * Create a new course.
 * @route POST /courses
 * @param req.body - Course data (validated by middleware)
 * @returns Created course data
 */
router.post('/courses', authenticateToken, validateCourse, (req: Request, res: Response): void => {
  const courseData = req.body;
  const newCourse = addCourse(courseData);

  const response: ApiResponse<Course> = {
    success: true,
    data: newCourse,
    message: 'Course created successfully'
  };
  res.status(201).json(response);
});

/**
 * Update an existing course.
 * @route PUT /courses/:id
 * @param req.params.id - Course ID to update
 * @param req.body - Updated course data (validated by middleware)
 * @returns Updated course data
 */
router.put('/courses/:id', authenticateToken, validateCourse, (req: Request, res: Response): void => {
  const { id } = req.params;
  if (!id) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course ID is required'
    };
    res.status(400).json(response);
    return;
  }
  const updates = req.body;

  const updatedCourse = updateCourse(id, updates);
  if (!updatedCourse) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course not found'
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Course> = {
    success: true,
    data: updatedCourse,
    message: 'Course updated successfully'
  };
  res.json(response);
});

/**
 * Delete a course by ID.
 * @route DELETE /courses/:id
 * @param req.params.id - Course ID to delete
 * @returns Success message or error if not found
 */
router.delete('/courses/:id', authenticateToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  if (!id) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course ID is required'
    };
    res.status(400).json(response);
    return;
  }

  const deleted = deleteCourse(id);
  if (!deleted) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Course not found'
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: 'Course deleted successfully' }
  };
  res.json(response);
});

/**
 * Profile management routes
 */

/**
 * Get user profile information.
 * @route GET /profile
 * @returns User profile data including course statistics
 */
router.get('/profile', authenticateToken, (req: Request, res: Response): void => {
  const user = (req as any).user as User;
  const userCourses = courses.filter(course => course.userId === user.id);
  const profileData = {
    ...user,
    coursesCreated: userCourses.length,
    lastLogin: user.lastLogin
  };

  const response: ApiResponse<typeof profileData> = {
    success: true,
    data: profileData
  };
  res.json(response);
});

/**
 * Update user profile information.
 * @route PUT /profile
 * @param req.body - Updated profile data (username, email)
 * @returns Updated user profile data
 */
router.put('/profile', authenticateToken, (req: Request, res: Response): void => {
  const user = (req as any).user as User;
  const { username, email } = req.body;

  if (!username || !email) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Username and email are required'
    };
    res.status(400).json(response);
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid email format'
    };
    res.status(400).json(response);
    return;
  }

  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'User not found'
    };
    res.status(404).json(response);
    return;
  }

  // Check if username is already taken by another user
  const existingUser = users.find(u => u.username === username && u.id !== user.id);
  if (existingUser) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Username already taken'
    };
    res.status(409).json(response);
    return;
  }

  users[userIndex] = { ...users[userIndex]!, username, email };
  const updatedUser = users[userIndex]!;

  const response: ApiResponse<Omit<User, 'password'>> = {
    success: true,
    data: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email, lastLogin: updatedUser.lastLogin ?? null },
    message: 'Profile updated successfully'
  };
  res.json(response);
});

export default router;