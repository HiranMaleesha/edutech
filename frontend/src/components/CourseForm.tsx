'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Props interface for the CourseForm component.
 */
interface CourseFormProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Course data for editing (null for creating new course) */
  course: Course | null;
  /** Callback function called after successful save */
  onSuccess: () => void;
}

/**
 * Form data interface matching the course structure.
 */
interface FormData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  published: boolean;
  userId: string;
}

/**
 * Form validation errors interface.
 */
interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
}

/**
 * Modal form component for creating and editing courses.
 * Handles form validation, submission, and user feedback.
 *
 * @param props - Component props
 * @returns JSX element representing the course form modal
 */
const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, course, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: 0,
    published: false,
    userId: user?.id || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form data when modal opens or course changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        published: course.published,
        userId: course.userId,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: 0,
        published: false,
        userId: user?.id || '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [course, isOpen, user]);

  /**
   * Validates form data and sets error messages.
   * @returns True if form is valid, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!['beginner', 'intermediate', 'advanced'].includes(formData.level)) newErrors.level = 'Invalid level';
    if (formData.duration <= 0 || !Number.isInteger(formData.duration)) newErrors.duration = 'Duration must be a positive integer';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with validation and API calls.
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);
    try {
      let response;
      if (course) {
        response = await apiClient.updateCourse(course.id, formData);
      } else {
        response = await apiClient.addCourse(formData);
      }
      if (response.success) {
        toast.success(course ? 'Course updated successfully' : 'Course added successfully');
        onSuccess();
        onClose();
      } else {
        const errorMessage = response.error || 'Failed to save course';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while saving the course';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input field changes and updates form data.
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{course ? 'Edit Course' : 'Add Course'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows={3}
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              min="1"
              required
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
          {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;