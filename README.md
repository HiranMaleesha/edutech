# Course Management System

A full-stack course management application featuring a modern React frontend and a robust Node.js backend. Users can create, manage, and organize courses with advanced filtering, sorting, and authentication capabilities.

## 🏗️ Architecture Overview

This application follows a **client-server architecture** with clear separation of concerns:

### Backend (API Server)
- **Framework**: Node.js + Express.js
- **Language**: TypeScript
- **Authentication**: JWT-based
- **Data Storage**: In-memory (production-ready for database integration)
- **Port**: 3001

### Frontend (Web Application)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Port**: 3000

### Communication
- **Protocol**: RESTful API with JSON
- **Authentication**: Bearer token in headers
- **CORS**: Configured for cross-origin requests

## ✨ Key Features

### Core Functionality
- 🔐 **User Authentication**: Secure login/logout with JWT tokens
- 📚 **Course Management**: Full CRUD operations for courses
- 👤 **User Profiles**: Profile management with course statistics
- 📱 **Responsive Design**: Mobile-first approach with adaptive layouts

### Advanced Features (Bonus Implementation)
- 🔍 **Advanced Filtering**: Multi-criteria course filtering
  - Text search (title and description)
  - Category filtering (multi-select)
  - Difficulty level filtering
  - Duration range filtering
  - Date range filtering (created/updated)
  - Published status filtering
- 🔄 **Dynamic Sorting**: Sort by multiple fields with direction control
- ⚡ **Real-time Updates**: Instant UI updates after operations
- 🎨 **Responsive UI**: Desktop tables + mobile card layouts
- ✅ **Form Validation**: Comprehensive client-side validation
- 🔄 **Loading States**: Skeleton loaders and progress indicators
- 🚨 **Error Handling**: User-friendly error messages with retry options
- 🔔 **Toast Notifications**: Real-time feedback for all operations

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd imperial-assesment
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Backend environment** (create `backend/.env`):
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Frontend environment** (no additional setup required for development)

### Running the Application

1. **Start the backend** (in terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Backend will be available at `http://localhost:3001`

2. **Start the frontend** (in terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

### Default Users

For testing purposes, use these credentials:

- **User**: username: `user`, password: `user123`

## 📁 Project Structure

```
imperial-assesment/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes.ts          # API route definitions
│   │   ├── middleware.ts      # Auth & validation middleware
│   │   ├── storage.ts         # In-memory data storage
│   │   └── types.ts           # TypeScript interfaces
│   ├── package.json
│   └── README.md              # Backend documentation
├── frontend/                   # Frontend web application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # Reusable React components
│   │   ├── contexts/          # React contexts
│   │   ├── lib/               # Utility libraries
│   │   └── types.ts           # TypeScript types
│   ├── package.json
│   └── README.md              # Frontend documentation
└── README.md                  # This file (main project README)
```

## 🔧 Development

### Available Scripts

#### Backend
```bash
cd backend
npm run dev      
npm run build   
npm start        
```

#### Frontend
```bash
cd frontend
npm run dev      
npm run build    
npm start        
npm run lint     
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (authenticated)
- `PUT /api/courses/:id` - Update course (authenticated)
- `DELETE /api/courses/:id` - Delete course (authenticated)

#### Profile
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update profile (authenticated)

#### Health
- `GET /health` - Server health check

## 🎯 Bonus Features Implemented

### 2. Dynamic Sorting
- **Multiple Fields**: Sort by title, category, level, duration, created date, updated date
- **Direction Control**: Ascending and descending sort options
- **Real-time Updates**: Instant sorting without page refresh

### 3. Enhanced User Experience
- **Responsive Design**: Seamless experience across all devices
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error states with recovery options
- **Toast Notifications**: Immediate feedback for all user actions
- **Form Validation**: Real-time validation with helpful error messages

### 4. Technical Excellence
- **TypeScript**: Full type safety across the application
- **Modern React**: Hooks, Context API, and functional components
- **Performance**: Optimized rendering and state management
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack Details

### Backend Technologies
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **JWT**: JSON Web Token authentication
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management

### Frontend Technologies
- **Next.js 16**: React framework with App Router
- **React 19**: UI library with concurrent features
- **TypeScript**: Type-safe component development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Notification system

### Development Tools
- **ESLint**: Code linting and quality
- **TypeScript Compiler**: Type checking
- **Next.js Dev Server**: Hot reloading
- **ts-node-dev**: Backend development with hot reload

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Controlled cross-origin access
- **Password Security**: Ready for hashing implementation
- **Token Expiration**: Automatic session management

## 📱 Responsive Design

The application provides an optimal experience across all devices:

- **Mobile (< 640px)**: Card-based layouts with touch-friendly interactions
- **Tablet (640px+)**: Hybrid layouts with improved space utilization
- **Desktop (1024px+)**: Full table views with advanced filtering controls

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Run `npm run build` to compile TypeScript
3. Use `npm start` with a process manager (PM2)
4. Set up reverse proxy (nginx) for port management

### Frontend Deployment
1. Run `npm run build` for optimized production build
2. Deploy to static hosting (Vercel, Netlify) or server
3. Configure API base URL for production environment

### Database Integration
For production use, replace in-memory storage with:
- PostgreSQL with Prisma ORM
- MongoDB with Mongoose
- MySQL with TypeORM

## 🧪 Testing

Currently configured with placeholder test scripts. Recommended testing setup:

### Backend Testing
- **Unit Tests**: Jest for middleware and utilities
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT and security testing

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Playwright or Cypress for full workflows

## 🤝 Contributing

1. Follow the established code style and patterns
2. Add comprehensive TypeScript types
3. Test across multiple devices and browsers
4. Ensure accessibility standards are met
5. Add documentation for new features

## 📄 Documentation

- **[Backend README](./backend/README.md)**: Detailed backend API documentation
- **[Frontend README](./frontend/README.md)**: Frontend architecture and development guide

## 📝 License

ISC License - See individual package.json files for details

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000 and 3001 are available
2. **CORS Errors**: Backend must be running before starting frontend
3. **Authentication Issues**: Clear browser localStorage and retry
4. **Build Errors**: Ensure all dependencies are installed correctly

### Getting Help

- Check the detailed READMEs in backend/ and frontend/ directories
- Review browser console for error messages
- Verify API connectivity using browser network tab
- Test API endpoints directly using tools like Postman

---

**Happy coding! 🎉**