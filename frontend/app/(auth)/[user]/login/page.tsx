import LoginForm from '@/components/auth/login-form';
import { UserType } from '@/types/auth';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    user: UserType;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const userType = params.user;

  if (userType !== 'child' && userType !== 'parent') {
    notFound();
  }

  return {
    title: userType === 'child' ? 'Child Login' : 'Parent Login',
    description: `Welcome, ${
      userType === 'child' ? 'young learner' : 'parent/guardian'
    }!`,
  };
}

export default function LoginPage({ params }: PageProps) {
  const user = params.user;

  if (user !== 'child' && user !== 'parent') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col gap-12 font-[family-name:var(--font-geist-sans)]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-around p-20">
        <div className="h-auto min-h-full space-y-4">
          <button
            //   onClick={handleBackToSelection}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 cursor-pointer"
          >
            <ChevronLeft />
            Back to selection
          </button>

          <div className="flex flex-col justify-center space-y-2 p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Family Chore Tracker
            </h1>
            <Image
              src={'/undraw_clean-up_af4s.svg'}
              alt="House clean up image"
              width={500}
              height={500}
              className="mx-auto"
            />

            {user === 'parent' ? (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Parent Sign In
                </h2>
                <p className="text-gray-600">
                  Welcome back! Manage your family&apos;s chores and progress.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Child Sign In
                </h2>
                <p className="text-gray-600 mb-2">
                  Ready to check your chores?
                </p>
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
        </div>
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {user === 'parent' ? '👨‍👩' : '👧👦'}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user === 'parent' ? 'Parent Sign In' : 'Child Sign In'}
              </h1>
              <p className="text-gray-600">
                {user === 'parent'
                  ? 'Welcome back!'
                  : 'Ready to see your Tasks and make points?'}
              </p>
            </div>

            <LoginForm />
            <div className="mt-6 text-center">
              {user === 'parent' && (
                <p className="text-gray-600">
                  Don&apos;t have an account?
                  <Link
                    href={'/register'}
                    className="text-blue-600 hover:text-blue-700 font-medium ms-1"
                  >
                    Sign up
                  </Link>
                </p>
              )}

              {user === 'child' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Are you a parent?
                    </p>
                    <p className="text-xs text-gray-400">
                      Go back and select &quot;Parent&quot; to access parent
                      features and sign up options.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
