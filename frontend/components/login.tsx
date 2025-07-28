'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/auth';
import Button from '../components/ui/button';

interface LoginProps {
  onToggleToSignUp?: () => void;
  userType?: 'parent' | 'child' | null;
}

export default function Login({ onToggleToSignUp, userType }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      if (userType === 'parent' && user.role !== 'PARENT') {
        setError(
          'This account is not a parent account. Please use the child login option.'
        );
        return;
      }

      if (userType === 'child' && user.role !== 'CHILD') {
        setError(
          'This account is not a child account. Please use the parent login option.'
        );
        return;
      }

      if (user.role === 'PARENT') {
        router.push('/parent-dashboard');
      } else {
        router.push('/child-dashboard');
      }
    } catch (err) {
      if (userType === 'child') {
        setError(
          'Invalid credentials. Ask your parent to check your login details.'
        );
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {userType === 'parent' ? '👨‍👩' : '👧👦'}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userType === 'parent' ? 'Parent Sign In' : 'Child Sign In'}
        </h1>
        <p className="text-gray-600">
          {userType === 'parent'
            ? 'Welcome back!'
            : 'Ready to see your Tasks and make points?'}
        </p>
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
            placeholder={
              userType === 'child'
                ? 'Your parent gave you this email'
                : 'Enter your email'
            }
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
            placeholder={
              userType === 'child'
                ? 'Your parent gave you this password'
                : 'Enter your password'
            }
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

      {userType === 'parent' && onToggleToSignUp && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={onToggleToSignUp}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      )}

      {userType === 'child' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Are you a parent?</p>
            <p className="text-xs text-gray-400">
              Go back and select &quot;Parent&quot; to access parent features
              and sign up options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
