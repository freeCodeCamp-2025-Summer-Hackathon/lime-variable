import Image from 'next/image';
import Button from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col gap-12 font-[family-name:var(--font-geist-sans)]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-around p-20">
        <div className="flex h-auto min-h-full flex-col justify-start space-y-4 text-start">
          <div className="mb-4">
            <Button
              variant="ghost"
              //   onClick={() => router.push('/')}
              className="inline-flex items-center text-gray-600 hover:text-blue-700 font-medium mb-4 cursor-pointer"
            >
              <ChevronLeft />
              Back to home
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Family Chore Tracker
          </h1>
          <Image src={'/house.svg'} alt="House" width={500} height={500} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Parent Account
          </h2>
          <p className="text-gray-600">
            Create your account to start managing your family!
          </p>
        </div>

        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">Join our family chore tracker!</p>
            </div>
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?
                <button
                  //   onClick={() => router.push('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium ms-1"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
