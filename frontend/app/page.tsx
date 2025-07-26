'use client';

import { useState } from 'react';
import Login from './components/login';
import SignUp from './components/signUp';

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <main className="min-h-screen flex flex-col gap-12 font-[family-name:var(--font-geist-sans)]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-around p-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Family Chore Tracker
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {showSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {showSignUp
              ? 'Join our family chore tracker!'
              : 'Sign in to manage your chores.'}
          </p>
        </div>
        {showSignUp ? (
          <SignUp onToggleToLogin={() => setShowSignUp(false)} />
        ) : (
          <Login onToggleToSignUp={() => setShowSignUp(true)} />
        )}
      </div>
    </main>
  );
}
