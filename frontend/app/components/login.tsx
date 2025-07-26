'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/auth';
import Button from '../components/ui/button';

interface LoginProps {
  onToggleToSignUp?: () => void;
}

export default function Login({ onToggleToSignUp }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //const [showQuickLogin, setShowQuickLogin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'parent') {
        router.push('/parent-dashboard');
      } else {
        router.push('/child-dashboard');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h1>
        <p className="text-gray-600">Welcome back!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={onToggleToSignUp}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
      {/* 
        {showQuickLogin && (
          <>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Quick Login (Demo)</p>
                <button
                  onClick={() => setShowQuickLogin(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Hide
                </button>
              </div>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickSubmit(user.email)}
                    disabled={loading}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Password: password123
              </p>
            </div>
          </>
        )}

        {!showQuickLogin && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowQuickLogin(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Show demo quick login
            </button>
          </div>
        )} */}
    </div>
  );
}