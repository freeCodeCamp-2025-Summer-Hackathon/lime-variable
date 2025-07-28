'use client';

import { useState } from 'react';
import Login from './components/login';
import SignUp from './components/signUp';

type UserType = 'parent' | 'child' | null;

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  const handleUserTypeSelection = (userType: UserType) => {
    setSelectedUserType(userType);
    setShowSignUp(userType === 'parent' ? false : false); // Both start with login
  };

  const handleBackToSelection = () => {
    setSelectedUserType(null);
    setShowSignUp(false);
  };

  // User type selection screen
  if (!selectedUserType) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Family Chore Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Organize your family&apos;s chores and build good habits together
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              Are you a parent or a child?
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => handleUserTypeSelection('parent')}
                className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-w-[280px]"
              >
                <div className="text-6xl mb-4">👨👩</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">
                  Parent
                </h3>
                <p className="text-gray-600">
                  Manage your family&apos;s chores, create accounts for your
                  children, and track progress
                </p>
                <div className="mt-4 inline-flex items-center text-blue-600 font-bold group-hover:text-blue-700">
                  Continue as Parent
                  <svg
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => handleUserTypeSelection('child')}
                className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-w-[280px]"
              >
                <div className="text-6xl mb-4">👧👦</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Child</h3>
                <p className="text-gray-600">
                  View your assigned chores, mark them as complete, and earn
                  rewards
                </p>
                <div className="mt-4 inline-flex items-center text-blue-600 font-bold group-hover:text-blue-700">
                  Continue as Child
                  <svg
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Login/SignUp screen
  return (
    <main className="min-h-screen flex flex-col gap-12 font-[family-name:var(--font-geist-sans)]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-around p-20">
        <div className="text-center mb-8">
          <div className="mb-4">
            <button
              onClick={handleBackToSelection}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to selection
            </button>
          </div>

          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Family Chore Tracker
          </h1>

          {selectedUserType === 'parent' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {showSignUp ? 'Create Parent Account' : 'Parent Sign In'}
              </h2>
              <p className="text-gray-600">
                {showSignUp
                  ? 'Create your account to start managing your family!'
                  : "Welcome back! Manage your family's chores and progress."}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Child Sign In
              </h2>
              <p className="text-gray-600 mb-2">Ready to check your chores?</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Don&apos;t have login credentials?</strong>
                  <br />
                  Ask your parent to create an account for you from their
                  dashboard.
                </p>
              </div>
            </>
          )}
        </div>

        {selectedUserType === 'parent' && showSignUp ? (
          <SignUp onToggleToLogin={() => setShowSignUp(false)} />
        ) : (
          <Login
            onToggleToSignUp={
              selectedUserType === 'parent'
                ? () => setShowSignUp(true)
                : undefined
            }
            userType={selectedUserType}
          />
        )}
      </div>
    </main>
  );
}
