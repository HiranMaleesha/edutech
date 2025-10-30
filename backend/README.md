# Course Management System - Backend

A robust REST API backend for a course management system built with Node.js, Express, and TypeScript. Provides authentication, course CRUD operations, and user profile management.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Data Storage**: In-memory storage (production-ready for database integration)
- **CORS**: Enabled for cross-origin requests
- **Validation**: Comprehensive input validation middleware

## Features

### Core Functionality
- **User Authentication**: JWT-based login/logout with secure token management
- **Course Management**: Full CRUD operations for courses
- **User Profiles**: Profile data with course statistics
- **Health Monitoring**: Health check endpoint for system monitoring

### Security Features
- JWT token authentication for protected routes
- Input validation middleware
- CORS configuration
- Secure password handling (ready for hashing)

### API Features
- RESTful API design
- Consistent error handling and response format
- TypeScript interfaces for type safety
- Comprehensive JSDoc documentation

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── routes.ts         # API route definitions
│   ├── middleware.ts     # Authentication and validation middleware
│   ├── storage.ts        # In-memory data storage
│   └── types.ts          # TypeScript interfaces and types
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Installation

1. **Clone the repository** (if not already done)
2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
```

> **Security Note**: Never commit the `.env` file to version control. Use strong, unique secrets in production.

## Running the Application

### Development Mode
```bash
npm run dev
```
- Uses `ts-node-dev` for hot reloading
- Server runs on `http://localhost:3001`
- Health check available at `http://localhost:3001/health`

### Production Mode
```bash
npm run build
npm start
```
- Compiles TypeScript to JavaScript
- Runs the compiled code with Node.js

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (authenticated)
- `PUT /api/courses/:id` - Update course (authenticated)
- `DELETE /api/courses/:id` - Delete course (authenticated)

### Profile
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update user profile (authenticated)

### Health Check
- `GET /health` - Server health status

## API Response Format

All API responses follow a consistent structure:

```json
{
  "success": true|false,
  "data": <response_data>,
  "message": "Optional success message",
  "error": "Error message if success is false"
}
```

## Authentication

The API uses JWT tokens for authentication:

1. **Login** with username/password to receive a token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Token expires** after 24 hours
4. **Protected routes** require valid tokens

### Default Users

For testing purposes, the following users are available:

- **Admin**: username: `admin`, password: `password123`
- **User**: username: `user`, password: `user123`

## Data Models

### Course
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  published: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed in production
  lastLogin?: Date;
}
```

## Development

### Available Scripts
- `npm run build` - Compile TypeScript
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm test` - Run tests (placeholder)

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for code quality (inherited from frontend)
- **JSDoc**: Comprehensive documentation comments

### Testing
Currently uses a placeholder test script. Recommended testing setup:
- Unit tests with Jest
- Integration tests for API endpoints
- Authentication flow testing

## Production Considerations

### Database Integration
The current implementation uses in-memory storage. For production:

1. Replace `storage.ts` with a database ORM (Prisma, TypeORM, Mongoose)
2. Implement proper password hashing (bcrypt)
3. Add database migrations
4. Configure connection pooling

### Security Enhancements
- Implement rate limiting
- Add request logging
- Set up proper CORS origins
- Use HTTPS in production
- Implement refresh tokens
- Add input sanitization

### Performance
- Implement caching (Redis)
- Add request compression
- Set up load balancing
- Database query optimization

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill the process
   kill -9 <PID>
   ```

2. **CORS errors**: Ensure frontend is running on expected port (3000)

3. **JWT errors**: Check JWT_SECRET environment variable

4. **Build errors**: Ensure all dependencies are installed and TypeScript is configured correctly

### Logs
The server outputs logs to console including:
- Server startup confirmation
- API endpoint access
- Error messages with stack traces

## Contributing

1. Follow TypeScript best practices
2. Add JSDoc comments for new functions
3. Test API endpoints with tools like Postman or curl
4. Ensure all routes are properly authenticated where required

## License

ISC License