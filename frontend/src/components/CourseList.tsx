'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { apiClient } from '../lib/api';
import CourseForm from './CourseForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import toast from 'react-hot-toast';

/**
 * Props interface for the CourseList component.
 */
interface CourseListProps {
  /** Optional callback for course editing */
  onEdit?: (course: Course) => void;
  /** Optional callback for course deletion */
  onDelete?: (id: string) => void;
}

/**
 * CourseList component for displaying, filtering, sorting, and managing courses.
 * Provides comprehensive course management functionality with responsive design.
 *
 * @param props - Component props
 * @returns JSX element representing the course list
 */
const CourseList: React.FC<CourseListProps> = ({ onEdit, onDelete }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<boolean | null>(null);

  // Sorting states
  const [sortField, setSortField] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Compute unique categories and levels for filter options
  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );
  const levels = ['beginner', 'intermediate', 'advanced'];

  // Filter courses based on search query and applied filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);
    const matchesLevel = selectedLevel === '' || course.level === selectedLevel;
    const matchesPublished =
      publishedFilter === null || course.published === publishedFilter;
    return matchesSearch && matchesCategory && matchesLevel && matchesPublished;
  });

  // Sort filtered courses based on selected field and direction
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let aValue: any, bValue: any;
    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'level':
        aValue = a.level;
        bValue = b.level;
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        return 0;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  /**
   * Clears all applied filters and resets sorting to default.
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLevel('');
    setPublishedFilter(null);
    setSortField('title');
    setSortDirection('asc');
  };

  /**
   * Fetches courses from the API and updates the component state.
   */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.fetchCourses();
      if (response.success && response.data) {
        setCourses(response.data);
        toast.success('Courses loaded successfully');
      } else {
        const errorMessage = response.error || 'Failed to fetch courses';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the course form for adding a new course.
   */
  const handleAdd = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  /**
   * Opens the course form for editing an existing course.
   * @param course - The course to edit
   */
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  /**
   * Handles successful form submission by refreshing the course list.
   */
  const handleFormSuccess = () => {
    fetchCourses();
  };

  /**
   * Initiates the delete confirmation process for a course.
   * @param id - ID of the course to delete
   */
  const handleDeleteClick = (id: string) => {
    setDeletingCourseId(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirms and executes course deletion.
   */
  const handleDeleteConfirm = async () => {
    if (!deletingCourseId) return;
    setDeleteLoading(true);
    try {
      const response = await apiClient.deleteCourse(deletingCourseId);
      if (response.success) {
        setCourses(courses.filter((course) => course.id !== deletingCourseId));
        setIsDeleteModalOpen(false);
        setDeletingCourseId(null);
        toast.success('Course deleted successfully');
      } else {
        const errorMessage = response.error || 'Failed to delete course';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while deleting the course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Cancels the delete operation and closes the modal.
   */
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingCourseId(null);
  };

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <span className='ml-3 text-gray-600'>Loading courses...</span>
        </div>
        {/* Skeleton loader for table */}
        <div className='hidden md:block overflow-x-auto mt-6'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Level
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Duration
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Published
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Created At
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Updated At
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-8'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Skeleton loader for mobile cards */}
        <div className='md:hidden space-y-4 mt-6'>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className='bg-white border border-gray-300 rounded-lg p-4 shadow'
            >
              <div className='h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse mb-3 w-full'></div>
              <div className='grid grid-cols-2 gap-2 mb-4'>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className='h-4 bg-gray-200 rounded animate-pulse'
                  ></div>
                ))}
              </div>
              <div className='flex gap-2'>
                <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
                <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        <p>{error}</p>
        <button
          onClick={fetchCourses}
          className='mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Courses
        </h2>
        <button
          onClick={handleAdd}
          className='bg-[#004C3F] hover:bg-[#003a33] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#004C3F] focus:ring-offset-2 w-full sm:w-auto'
        >
          Add Course
        </button>
      </div>

      {/* Sorting and Filter Controls */}
      <div className='bg-white border border-gray-300 rounded-lg p-4 mb-6 shadow'>
        {/* Sorting Controls */}
        <div className='mb-4'>
          <h3 className='text-xl font-bold text-gray-900 mb-3'>Sort By</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='sortField'
                className='block text-sm font-semibold text-gray-800 mb-1'
              >
                Field
              </label>
              <select
                id='sortField'
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004C3F] text-gray-800 bg-white'
              >
                <option value='title'>Title</option>
                <option value='category'>Category</option>
                <option value='level'>Level</option>
                <option value='duration'>Duration</option>
                <option value='createdAt'>Created At</option>
                <option value='updatedAt'>Updated At</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='sortDirection'
                className='block text-sm font-semibold text-gray-800 mb-1'
              >
                Direction
              </label>
              <select
                id='sortDirection'
                value={sortDirection}
                onChange={(e) =>
                  setSortDirection(e.target.value as 'asc' | 'desc')
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004C3F] text-gray-800'
              >
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search and Basic Filters */}
        <div className='mb-8'>
          <div className='relative max-w-xl mx-auto mb-8'>
            <input
              type='text'
              id='search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search for a course or a subject'
              className='w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004C3F] focus:border-transparent text-gray-900 placeholder-gray-600 text-lg bg-white'
            />
            <div className='absolute inset-y-0 left-4 flex items-center'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>

          <div className='flex flex-wrap justify-center gap-4 mb-6'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    );
                  } else {
                    setSelectedCategories([...selectedCategories, category]);
                  }
                }}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-[#004C3F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className='flex flex-wrap justify-center gap-4'>
            <select
              id='level'
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className='px-6 py-3 border border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#004C3F] focus:border-transparent bg-white'
            >
              <option value='' className='text-gray-800'>
                All Levels
              </option>
              {levels.map((level) => (
                <option
                  key={level}
                  value={level}
                  className='capitalize text-gray-800'
                >
                  {level}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setPublishedFilter(publishedFilter === true ? null : true)
              }
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                publishedFilter === true
                  ? 'bg-[#004C3F] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published Only
            </button>

            <button
              onClick={clearFilters}
              className='px-6 py-3 rounded-full font-medium text-[#004C3F] border-2 border-[#004C3F] hover:bg-[#004C3F] hover:text-white transition-colors'
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Description
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Level
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Duration
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Published
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Created At
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Updated At
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {sortedCourses.map((course) => (
              <tr key={course.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {course.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {course.title}
                </td>
                <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>
                  {course.description}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {course.category}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize'>
                  {course.level}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {course.duration} hours
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {course.published ? 'Yes' : 'No'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {new Date(course.updatedAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button
                    onClick={() => handleEdit(course)}
                    className='text-indigo-600 hover:text-indigo-900 mr-4'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course.id)}
                    className='text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden space-y-4'>
        {sortedCourses.map((course) => (
          <div
            key={course.id}
            className='bg-white border border-gray-300 rounded-lg p-4 shadow'
          >
            <h3 className='text-lg font-semibold mb-2'>{course.title}</h3>
            <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
              {course.description}
            </p>
            <div className='grid grid-cols-2 gap-2 text-sm mb-4'>
              <div>
                <strong>ID:</strong> {course.id}
              </div>
              <div>
                <strong>Category:</strong> {course.category}
              </div>
              <div>
                <strong>Level:</strong> {course.level}
              </div>
              <div>
                <strong>Duration:</strong> {course.duration} hours
              </div>
              <div>
                <strong>Published:</strong> {course.published ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Created:</strong>{' '}
                {new Date(course.createdAt).toLocaleDateString()}
              </div>
              <div className='col-span-2'>
                <strong>Updated:</strong>{' '}
                {new Date(course.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <button
                onClick={() => handleEdit(course)}
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(course.id)}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <CourseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={editingCourse}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Course'
        message='Are you sure you want to delete this course? This action cannot be undone.'
        loading={deleteLoading}
      />
    </div>
  );
};

export default CourseList;
