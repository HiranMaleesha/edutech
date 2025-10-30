import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from './types.js';

/**
 * JWT secret key for token signing and verification.
 * In production, this should be loaded from environment variables.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Extended Express Request interface to include authenticated user information.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens.
 * Verifies the presence and validity of JWT tokens in the Authorization header.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Access token required'
    };
    res.status(401).json(response);
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid or expired token'
      };
      res.status(403).json(response);
      return;
    }

    req.user = user as { id: string; username: string };
    next();
  });
};

/**
 * Middleware to validate course data for creation and update operations.
 * Performs comprehensive validation on course fields.
 *
 * @param req - Express request object containing course data in body
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateCourse = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, category, level, duration, published } = req.body;

  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
    errors.push('Level must be one of: beginner, intermediate, advanced');
  }

  if (typeof duration !== 'number' || duration <= 0) {
    errors.push('Duration must be a positive number');
  }

  if (typeof published !== 'boolean') {
    errors.push('Published must be a boolean');
  }

  if (errors.length > 0) {
    const response: ApiResponse<null> = {
      success: false,
      error: errors.join(', ')
    };
    res.status(400).json(response);
    return;
  }

  next();
};

/**
 * Generates a JWT token for authenticated users.
 *
 * @param user - User object containing id and username
 * @returns JWT token string
 */
export const generateToken = (user: { id: string; username: string }): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};