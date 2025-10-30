'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

/**
 * Navigation component providing site-wide navigation and user authentication controls.
 * Features responsive design with mobile menu and authentication state handling.
 *
 * @returns JSX element representing the navigation bar
 */
const Navigation: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Handles user logout with error handling.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Toggles the mobile navigation menu visibility.
   */
  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Loading state display
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Course Manager
              </Link>
            </div>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold text-[#004C3F] font-poppins flex items-center">
              <img src="/logo.png" alt="Aspirex" className="h-8 w-auto" />
              <span className="ml-2">Aspirex</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About us
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Browse all courses
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Webinar
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact us
            </Link>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <button className="border-2 border-[#004C3F] text-[#004C3F] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#004C3F] hover:text-white transition-colors">
                Book a call
              </button>
              {user ? (
                <>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-[#004C3F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-[#F9A826] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e6951a] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#F9A826] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e6951a] transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#004C3F] p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="text-2xl font-bold text-[#004C3F] font-poppins flex items-center">
                  <img src="/logo.png" alt="Aspirex" className="h-8 w-auto" />
                  <span className="ml-2">Aspirex</span>
                </Link>
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-[#004C3F] p-2 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
                <nav className="space-y-6">
                  <div className="space-y-3">
                    <Link
                      href="/"
                      className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About us
                    </Link>
                    <Link
                      href="/"
                      className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse all courses
                    </Link>
                    <Link
                      href="/"
                      className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Webinar
                    </Link>
                    <Link
                      href="/"
                      className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact us
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full border-2 border-[#004C3F] text-[#004C3F] px-6 py-3 rounded-lg text-base font-medium hover:bg-[#004C3F] hover:text-white transition-colors mb-4">
                      Book a call
                    </button>
                    {user ? (
                      <div className="space-y-3">
                        <Link
                          href="/"
                          className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Courses
                        </Link>
                        <Link
                          href="/profile"
                          className="block text-lg text-gray-700 hover:text-[#004C3F] py-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-[#F9A826] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#e6951a] transition-colors text-center"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="w-full bg-[#F9A826] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#e6951a] transition-colors block text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;