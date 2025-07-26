'use client';

import { useState } from 'react';
import Login from './components/login';
import SignUp from './components/signup';

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <main className="min-h-screen flex flex-col gap-12 font-[family-name:var(--font-geist-sans)]">
      {showSignUp ? (
        <SignUp onToggleToLogin={() => setShowSignUp(false)} />
      ) : (
        <Login onToggleToSignUp={() => setShowSignUp(true)} />
      )}
    </main>
  );
}