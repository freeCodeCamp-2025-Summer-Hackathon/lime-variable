'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleLogin, handleSignUp } from '../lib/auth';
import { mockUsers } from '../lib/mockData';
import Button from '../components/ui/button';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpBtnVariant, setSignUpButtonVariant] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSigningUp == false) {
      try {
        const user: JSON | null = await handleLogin(email, password);
        if (user) {
          // TODO: Uncomment Later
          // if (user.role === 'parent') {
          //   router.push('/parent-dashboard');
          // } else {
          //   router.push('/child-dashboard');
          // }
          router.push('/parent-dashboard');
        } else {
          setError('Invalid email or password');
        }
      } catch (err) {
        setError(`Login failed, here is the error: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const user: JSON | null = await handleSignUp(name, email, password);
        if (user) {
          // TODO: Uncomment Later
          // if (user.role === 'parent') {
          //   router.push('/parent-dashboard');
          // } else {
          //   router.push('/child-dashboard');
          // }
          setSignUpButtonVariant(true);
        } else {
          setError('Invalid Field Values');
        }
      } catch (err) {
        setError(
          `Sign up failed, here is the error: ${(err as Error).message}`
        );
      }
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isSigningUp ? 'Sign up' : 'Sign in'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSigningUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
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
          {isSigningUp ? (
            <>
              <Button
                type="submit"
                disabled={loading}
                {...(signUpBtnVariant ? { variant: 'success' } : {})}
                className="w-full mb-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {signUpBtnVariant
                  ? 'Success!'
                  : loading
                  ? 'Signing Up...'
                  : 'Sign Up'}
              </Button>
              <Button
                onClick={() => {
                  setIsSigningUp(false);
                  setSignUpButtonVariant(false);
                  setLoading(false);
                }}
                {...(signUpBtnVariant
                  ? { variant: 'primary' }
                  : { variant: 'secondary' })}
                className="w-full py-3"
              >
                Sign in
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mb-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                onClick={() => setIsSigningUp(true)}
                className="w-full py-3 text-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Sign up
              </Button>
            </>
          )}
        </form>
        {!isSigningUp && (
          <>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Quick Login (Demo)
              </p>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => quickLogin(user.email)}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer"
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
      </div>
    </div>
  );
}
