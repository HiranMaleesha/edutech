import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';

/**
 * Main application entry point.
 * Sets up Express server with middleware, routes, and error handling.
 */

// Load environment variables
dotenv.config();

/**
 * Express application instance
 */
const app = express();

/**
 * Server port configuration
 */
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

/**
 * Health check endpoint for monitoring server status.
 * @route GET /health
 * @returns {Object} Server status information
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * Global error handling middleware.
 * Catches and handles any unhandled errors in the application.
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

/**
 * 404 handler for undefined routes.
 * Returns a standardized error response for unmatched routes.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});