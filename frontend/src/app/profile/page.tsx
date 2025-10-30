'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import type { ProfileData, UpdateProfileRequest } from '../../types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * Profile page component for viewing and editing user profile information.
 * Includes profile display, editing functionality, and user statistics.
 *
 * @returns JSX element representing the profile page
 */
const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    username: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Redirect to login if not authenticated, otherwise fetch profile
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user, router]);

  /**
   * Fetches user profile data from the API.
   */
  const fetchProfile = async (): Promise<void> => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
        toast.success('Profile loaded successfully');
      } else {
        const errorMessage = response.error || 'Failed to load profile';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('An error occurred while loading your profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates form data before submission.
   * @returns True if form is valid, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: { username?: string; email?: string } = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission for profile updates.
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError(null);
    try {
      const response = await apiClient.updateProfile(formData);
      if (response.success && response.data) {
        setProfile(prev => prev ? { ...prev, ...response.data } : null);
        setEditing(false);
        toast.success('Profile updated successfully');
      } else {
        const errorMessage = response.error || 'Failed to update profile';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred while updating the profile';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles input field changes.
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004C3F] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold">User Profile</h1>
          </div>

          <div className="p-4 sm:p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Username</label>
                        <p className="text-gray-900">{profile.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">User ID</label>
                        <p className="text-gray-900">{profile.id}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Courses Created</label>
                        <p className="text-gray-900">{profile.coursesCreated}</p>
                      </div>
                      {profile.lastLogin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Last Login</label>
                          <p className="text-gray-900">{new Date(profile.lastLogin).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;