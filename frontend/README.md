# Course Management System - Frontend

A modern, responsive React frontend for a course management system built with Next.js 16, TypeScript, and Tailwind CSS. Features comprehensive course management with advanced filtering, sorting, and user authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API (custom wrapper)
- **Notifications**: React Hot Toast
- **Build Tool**: Next.js built-in (Webpack)

## Features

### Core Functionality
- **User Authentication**: Login/logout with JWT token management
- **Course Management**: Full CRUD operations with real-time updates
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **User Profiles**: Profile management with course statistics

### Advanced Features
- **Advanced Filtering**: Multi-criteria course filtering (search, category, level, duration, dates)
- **Dynamic Sorting**: Sort by multiple fields (title, category, level, duration, dates)
- **Real-time Updates**: Instant UI updates after operations
- **Form Validation**: Client-side validation with error feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error states with retry options

### UI/UX Features
- **Responsive Tables**: Desktop table view with mobile card layout
- **Modal Forms**: Clean modal dialogs for course creation/editing
- **Confirmation Dialogs**: Safe deletion with confirmation prompts
- **Toast Notifications**: User feedback for all operations
- **Accessibility**: ARIA labels and keyboard navigation support

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── profile/           # Profile page
│   │   │   └── page.tsx
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── CourseList.tsx     # Main course management component
│   │   ├── CourseForm.tsx     # Course creation/editing form
│   │   ├── Navigation.tsx     # Navigation component
│   │   ├── DeleteConfirmationModal.tsx # Delete confirmation dialog
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utility libraries
│   │   └── api.ts             # API client
│   └── types.ts               # TypeScript type definitions
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint configuration
└── README.md                  # This file
```

## Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Setup

The frontend uses the following default configuration:

- **Backend API URL**: `http://localhost:3001/api` (configured in `src/lib/api.ts`)
- **No additional environment variables required** for development

For production deployment, update the API URL in `src/lib/api.ts`.

## Running the Application

### Development Mode
```bash
npm run dev
```
- Starts Next.js development server
- Runs on `http://localhost:3000`
- Hot reloading enabled
- ESLint integration

### Production Build
```bash
npm run build
npm start
```
- Creates optimized production build
- Starts production server

### Linting
```bash
npm run lint
```
- Runs ESLint for code quality checks

## Application Structure

### Pages
- **Home (`/`)**: Course list with filtering and management
- **Profile (`/profile`)**: User profile management
- **Login**: Authentication page (redirects if not implemented as separate route)

### Key Components

#### CourseList Component
- **Advanced Filtering**: Search, category, level, published status, duration ranges, date ranges
- **Sorting**: Multiple sort fields with ascending/descending options
- **Responsive Views**: Table for desktop, cards for mobile
- **CRUD Operations**: Create, read, update, delete courses
- **Loading States**: Skeleton loaders during data fetching

#### CourseForm Component
- **Modal Interface**: Clean overlay form
- **Validation**: Real-time client-side validation
- **Dynamic Mode**: Create vs edit modes
- **Error Handling**: Form-level and field-level errors

#### AuthContext
- **JWT Management**: Token storage and automatic header inclusion
- **Session Persistence**: Local storage for authentication state
- **Auto-login**: Restores session on page refresh

## API Integration

The frontend communicates with the backend through a typed API client (`src/lib/api.ts`):

### Authentication
- `login(credentials)` - User authentication
- `logout()` - Session termination

### Course Operations
- `fetchCourses()` - Retrieve all courses
- `addCourse(course)` - Create new course
- `updateCourse(id, updates)` - Modify existing course
- `deleteCourse(id)` - Remove course

### Profile Management
- `getProfile()` - Fetch user profile
- `updateProfile(data)` - Update profile information

## Styling and Theming

### Tailwind CSS Configuration
- **Utility-First**: Atomic CSS classes
- **Responsive Design**: Mobile-first breakpoints
- **Custom Colors**: Blue primary theme
- **Dark Mode Ready**: CSS variables for theme switching

### Component Styling
- **Consistent Spacing**: Standardized padding/margins
- **Interactive States**: Hover, focus, and active states
- **Loading Animations**: Smooth transitions and spinners
- **Error States**: Red-themed error messaging

## Advanced Features Implementation

### Filtering System
The course list implements a comprehensive filtering system:

```typescript
// Filter criteria
- Text search (title, description)
- Category selection (multi-select)
- Difficulty level (beginner/intermediate/advanced)
- Published status (boolean filter)
- Duration range (min/max hours)
- Date ranges (created/updated within date ranges)
```

### Sorting System
Multiple sort options with direction control:

```typescript
// Sort fields
- Title (alphabetical)
- Category (alphabetical)
- Level (beginner → intermediate → advanced)
- Duration (numeric)
- Created At (chronological)
- Updated At (chronological)
```

### Responsive Design
- **Mobile (< 640px)**: Card-based layout
- **Tablet (640px+)**: Table view with horizontal scroll
- **Desktop (1024px+)**: Full table with all columns

## User Experience Features

### Loading States
- **Skeleton Loaders**: Placeholder content during loading
- **Button States**: Disabled states during operations
- **Progress Indicators**: Spinners and loading text

### Error Handling
- **Network Errors**: Retry options and user-friendly messages
- **Validation Errors**: Inline field validation
- **Authentication Errors**: Automatic logout on token expiry

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and roles
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG compliant colors

## Development Workflow

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Automatic code formatting (via ESLint)

### Component Development
- **Functional Components**: Modern React patterns
- **Custom Hooks**: Reusable logic extraction
- **TypeScript Interfaces**: Comprehensive type definitions

### State Management
- **Context API**: Authentication state
- **Local Component State**: Form and UI state
- **Local Storage**: Session persistence

## Testing

Currently no test suite is configured. Recommended setup:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Test API interactions
- **E2E Tests**: Playwright or Cypress

## Production Deployment

### Build Optimization
- **Static Generation**: Next.js static optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component ready

### Environment Configuration
- **API URLs**: Environment-specific endpoints
- **Analytics**: Ready for Google Analytics integration
- **Error Tracking**: Sentry integration points

### Performance
- **Lazy Loading**: Component and route lazy loading
- **Caching**: Browser caching strategies
- **CDN Ready**: Static asset optimization

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers

## Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Ensure backend is running on port 3001
   - Check CORS configuration
   - Verify API_BASE_URL in `api.ts`

2. **Authentication Issues**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiry
   - Verify backend JWT_SECRET

3. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports in `layout.tsx`

4. **TypeScript Errors**:
   - Run `npm run lint` for detailed errors
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed

### Development Tips

- **Hot Reload**: Changes reflect immediately in development
- **Console Logs**: Check browser console for API errors
- **Network Tab**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Test components across different screen sizes
4. Ensure accessibility standards are met
5. Add JSDoc comments for complex functions

## License

ISC License
