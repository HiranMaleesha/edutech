import type { Course, User } from './types.js';

/**
 * In-memory storage for courses.
 * In production, this should be replaced with a proper database.
 */
export const courses: Course[] = [
  {
    id: '1',
    title: 'Pearson BTEC Level 4 Diploma in Business Administration',
    description: 'Comprehensive business administration course covering management principles, finance, marketing, and operational strategies.',
    category: 'Business & Management',
    level: 'intermediate',
    duration: 40,
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: '1'
  },
  {
    id: '2',
    title: 'Level 3 Diploma in Health and Social Care',
    description: 'Essential training for healthcare professionals covering patient care, medical ethics, and social care practices.',
    category: 'Health & Social Care',
    level: 'intermediate',
    duration: 60,
    published: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    userId: '1'
  },
  {
    id: '3',
    title: 'BTEC Level 3 IT Diploma',
    description: 'Complete information technology course covering programming, networking, cybersecurity, and system administration.',
    category: 'Information Technology',
    level: 'intermediate',
    duration: 80,
    published: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    userId: '1'
  },
  {
    id: '4',
    title: 'CACHE Level 3 Award in Childcare',
    description: 'Specialized training for childcare professionals focusing on child development, safety, and educational practices.',
    category: 'Teaching & Education',
    level: 'intermediate',
    duration: 30,
    published: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    userId: '1'
  },
  {
    id: '5',
    title: 'AAT Level 3 Diploma in Accounting',
    description: 'Professional accounting qualification covering financial reporting, taxation, and business finance principles.',
    category: 'Accounting & Finance',
    level: 'intermediate',
    duration: 50,
    published: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    userId: '1'
  },
  {
    id: '6',
    title: 'Level 4 Teaching Assistant Diploma',
    description: 'Advanced training for teaching assistants covering classroom management, special needs education, and student support.',
    category: 'Teaching & Education',
    level: 'intermediate',
    duration: 70,
    published: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    userId: '1'
  }
];

/**
 * In-memory storage for users.
 * In production, this should be replaced with a proper database with hashed passwords.
 */
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123', // In production, hash passwords
    lastLogin: null
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    lastLogin: null
  }
];

/**
 * Adds a new course to the storage.
 *
 * @param course - Course data without id, createdAt, and updatedAt
 * @returns The newly created course with generated fields
 */
export const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course => {
  const newCourse: Course = {
    ...course,
    id: Date.now().toString(), // Simple ID generation
    createdAt: new Date(),
    updatedAt: new Date()
  };
  courses.push(newCourse);
  return newCourse;
};

/**
 * Finds a user by their ID.
 *
 * @param id - User ID to search for
 * @returns User object if found, undefined otherwise
 */
export const findUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

/**
 * Updates an existing course with partial data.
 *
 * @param id - Course ID to update
 * @param updates - Partial course data to apply
 * @returns Updated course if found, null otherwise
 */
export const updateCourse = (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>): Course | null => {
  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex === -1) return null;

  const existingCourse = courses[courseIndex];
  courses[courseIndex] = {
    ...existingCourse,
    ...updates,
    updatedAt: new Date()
  } as Course;
  return courses[courseIndex];
};

/**
 * Deletes a course by ID.
 *
 * @param id - Course ID to delete
 * @returns True if course was deleted, false if not found
 */
export const deleteCourse = (id: string): boolean => {
  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex === -1) return false;

  courses.splice(courseIndex, 1);
  return true;
};

/**
 * Retrieves a course by ID.
 *
 * @param id - Course ID to retrieve
 * @returns Course object if found, undefined otherwise
 */
export const getCourseById = (id: string): Course | undefined => {
  return courses.find(c => c.id === id);
};

/**
 * Finds a user by their username.
 *
 * @param username - Username to search for
 * @returns User object if found, undefined otherwise
 */
export const findUserByUsername = (username: string): User | undefined => {
  return users.find(u => u.username === username);
};