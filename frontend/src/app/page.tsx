'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import type { Course } from '../types';
import { useRouter } from 'next/navigation';

/**
 * Home page component that serves as the main entry point.
 * Displays course list for authenticated users or login prompt for guests.
 *
 * @returns JSX element representing the home page
 */
export default function Home() {
  const { user, isLoading } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [dynamicCourses, setDynamicCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const router = useRouter();

  // Fetch courses for homepage display
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await apiClient.fetchCourses();
        if (response.success && response.data) {
          setDynamicCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch courses for homepage:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#004C3F]'></div>
        <span className='mt-4 text-gray-600 text-lg'>Loading courses...</span>
        <p className='mt-2 text-gray-500'>
          Please wait while we prepare your content
        </p>
      </div>
    );
  }

  // Login prompt for unauthenticated users
  if (!user) {
    return (
      <div className='pt-16'>
        {/* Hero Section */}
        <section className='bg-[#FFF9F3] py-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Left side - Text content */}
              <div className='space-y-8'>
                <div>
                  <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 font-poppins leading-tight'>
                    Transform Your Career with
                    <span className='text-[#004C3F]'>
                      {' '}
                      Ofqual-Regulated
                    </span>{' '}
                    Qualifications!
                  </h1>
                </div>

                <p className='text-lg text-gray-600 max-w-lg'>
                  Join 100,000+ learners and earn accredited diplomas trusted by
                  top employers like Deloitte and NHS. Study online, at your
                  pace.
                </p>

                {/* Search bar */}
                <div className='max-w-md'>
                  <div className='relative'>
                    <input
                      type='text'
                      placeholder='Search for a course or a subject'
                      className='w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004C3F] focus:border-transparent text-gray-900 placeholder-gray-600'
                    />
                    <button className='absolute right-2 top-2 bg-[#004C3F] text-white p-2 rounded-md hover:bg-[#003a33] transition-colors'>
                      <svg
                        className='w-5 h-5'
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
                    </button>
                  </div>
                </div>

                {/* Category tags */}
                <div className='flex flex-wrap gap-3'>
                  {[
                    'Business & Management',
                    'Health & Social Care',
                    'Information Technology',
                    'Teaching & Education',
                    'Accounting & Finance',
                  ].map((category) => (
                    <span
                      key={category}
                      className='px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-800 border border-gray-200 hover:border-[#004C3F] hover:text-[#004C3F] transition-colors cursor-pointer'
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right side - Image placeholder */}
              <div className='flex justify-center lg:justify-end'>
                <div className='w-full max-w-md h-96 bg-gradient-to-br from-[#004C3F] to-[#006b5a] rounded-2xl flex items-center justify-center'>
                  <div className='text-white text-center'>
                    <svg
                      className='w-24 h-24 mx-auto mb-4 opacity-80'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                    </svg>
                    <p className='text-lg font-medium'>Professional Learning</p>
                    <p className='text-sm opacity-80'>Educational Context</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Employers Section */}
        <section className='bg-[#004C3F] py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-3xl font-bold text-white mb-12 font-poppins'>
              We're ready to lead you into the future.
            </h2>

            <div className='grid grid-cols-2 md:grid-cols-5 gap-8 items-center'>
              {['Deloitte', 'NHS', 'Octopus', 'TalkTalk', 'Virgin Media'].map(
                (company) => (
                  <div
                    key={company}
                    className='text-white text-lg font-semibold opacity-80'
                  >
                    {company}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Explore Courses Section */}
        <section className='bg-white py-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold font-poppins'>
                Explore <span className='text-[#004C3F]'>Popular</span> Career
                Paths
              </h2>
            </div>

            {/* Category filter tabs */}
            <div className='flex justify-center mb-12'>
              <div className='flex flex-wrap justify-center gap-4'>
                {[
                  { name: 'Business & Management', active: true },
                  { name: 'Health & Social Care', active: false },
                  { name: 'Information Technology', active: false },
                  { name: 'Teaching & Education', active: false },
                  { name: 'Accounting & Finance', active: false },
                ].map((category) => (
                  <button
                    key={category.name}
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${
                      category.active
                        ? 'bg-[#F9A826] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {coursesLoading
                ? // Loading skeleton
                  [...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-xl shadow overflow-hidden animate-pulse'
                    >
                      <div className='h-48 bg-gray-200'></div>
                      <div className='p-6'>
                        <div className='h-6 bg-gray-200 rounded mb-4'></div>
                        <div className='grid grid-cols-3 gap-4 mb-6'>
                          <div className='h-12 bg-gray-200 rounded'></div>
                          <div className='h-12 bg-gray-200 rounded'></div>
                          <div className='h-12 bg-gray-200 rounded'></div>
                        </div>
                        <div className='h-12 bg-gray-200 rounded'></div>
                      </div>
                    </div>
                  ))
                : dynamicCourses.map((course, index) => {
                    // Calculate modules, weeks, and credits based on duration
                    const modules = Math.max(
                      3,
                      Math.floor(course.duration / 10) + 2
                    );
                    const weeks = Math.max(6, Math.floor(course.duration / 5));
                    const credits = course.duration;

                    return (
                      <div
                        key={course.id}
                        className='bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden'
                      >
                        <div className='relative'>
                          <div className='w-full h-48 bg-gradient-to-br from-[#004C3F] to-[#006b5a] flex items-center justify-center'>
                            <div className='text-white text-center'>
                              <div className='text-4xl mb-2'>
                                {course.category === 'Business & Management' &&
                                  '📊'}
                                {course.category === 'Health & Social Care' &&
                                  '🏥'}
                                {course.category === 'Information Technology' &&
                                  '💻'}
                                {course.category === 'Teaching & Education' &&
                                  '🎓'}
                                {course.category === 'Accounting & Finance' &&
                                  '📈'}
                              </div>
                            </div>
                          </div>
                          <div className='absolute top-4 right-4 bg-[#F9A826] text-white px-3 py-1 rounded-full text-sm font-medium'>
                            Level{' '}
                            {course.level === 'beginner'
                              ? '1'
                              : course.level === 'intermediate'
                              ? '3'
                              : '4'}
                          </div>
                        </div>
                        <div className='p-6'>
                          <h3 className='text-lg font-semibold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]'>
                            {course.title}
                          </h3>

                          <div className='grid grid-cols-3 gap-4 text-sm text-gray-700 mb-6'>
                            <div className='flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg'>
                              <span className='font-medium text-[#004C3F]'>
                                {modules}
                              </span>
                              <span className='text-xs font-medium'>
                                Modules
                              </span>
                            </div>
                            <div className='flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg'>
                              <span className='font-medium text-[#004C3F]'>
                                {weeks}
                              </span>
                              <span className='text-xs'>Weeks</span>
                            </div>
                            <div className='flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg'>
                              <span className='font-medium text-[#004C3F]'>
                                {credits}
                              </span>
                              <span className='text-xs'>Credits</span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setSelectedCourse({
                                ...course,
                                modules,
                                weeks,
                                credits,
                                level: `Level ${
                                  course.level === 'beginner'
                                    ? '1'
                                    : course.level === 'intermediate'
                                    ? '3'
                                    : '4'
                                }`,
                              })
                            }
                            className='w-full bg-[#004C3F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#003a33] transition-colors'
                          >
                            Learn more
                          </button>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Discover all courses button */}
            <div className='text-center mt-12'>
              <button className='bg-[#004C3F] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#003a33] transition-colors text-lg'>
                Discover all courses
              </button>
            </div>
          </div>
        </section>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='relative'>
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className='w-full h-64 object-cover rounded-t-xl'
                />
                <div className='absolute top-4 right-4 bg-[#F9A826] text-white px-3 py-1 rounded-full text-sm font-medium'>
                  {selectedCourse.level}
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className='absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-colors'
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              <div className='p-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4 font-poppins'>
                  {selectedCourse.title}
                </h2>

                <div className='grid grid-cols-3 gap-6 mb-8'>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='text-2xl font-bold text-[#004C3F] mb-1'>
                      {selectedCourse.modules}
                    </div>
                    <div className='text-sm text-gray-600'>Modules</div>
                  </div>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='text-2xl font-bold text-[#004C3F] mb-1'>
                      {selectedCourse.weeks}
                    </div>
                    <div className='text-sm text-gray-600'>Weeks</div>
                  </div>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='text-2xl font-bold text-[#004C3F] mb-1'>
                      {selectedCourse.credits}
                    </div>
                    <div className='text-sm text-gray-600'>Credits</div>
                  </div>
                </div>

                <div className='space-y-6 mb-8'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Course Overview
                    </h3>
                    <p className='text-gray-600'>
                      This comprehensive course provides you with the knowledge
                      and skills needed to excel in your chosen field. Learn
                      from industry experts and gain practical experience
                      through hands-on projects.
                    </p>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      What You'll Learn
                    </h3>
                    <ul className='list-disc list-inside text-gray-600 space-y-1'>
                      <li>Fundamental concepts and principles</li>
                      <li>Practical application and real-world scenarios</li>
                      <li>Industry best practices and standards</li>
                      <li>Professional development and career advancement</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Requirements
                    </h3>
                    <ul className='list-disc list-inside text-gray-600 space-y-1'>
                      <li>Basic computer skills</li>
                      <li>Access to a computer with internet connection</li>
                      <li>Commitment to complete coursework</li>
                    </ul>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4'>
                  <button className='flex-1 bg-[#004C3F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#003a33] transition-colors'>
                    Enroll Now
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className='flex-1 border-2 border-[#004C3F] text-[#004C3F] py-3 px-6 rounded-lg font-medium hover:bg-[#004C3F] hover:text-white transition-colors'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login prompt */}
        <div className='bg-[#FFF9F3] py-16'>
          <div className='max-w-md mx-auto text-center'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900'>
              Ready to start learning?
            </h2>
            <p className='text-gray-600 mb-6'>
              Please log in to access your courses and continue your learning
              journey.
            </p>
            <a
              href='/login'
              className='inline-block bg-[#F9A826] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#e6951a] transition-colors'
            >
              Login to Get Started
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  return null;
}
