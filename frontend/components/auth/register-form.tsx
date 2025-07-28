'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
  RegisterFormFields as Inputs,
  RegisterSchema,
} from '@/schemas/auth/register';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Button from '@/components/ui/button';
import { api, cn } from '@/lib/utils';
import { RegisterResponse } from '@/types/auth';
import { Asterisk, Eye, EyeClosed, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const register = async (payload: Omit<Inputs, 'confirmPassword'>) => {
  const url = `${api}auth/register-user`;
  const response = await axios.post<RegisterResponse>(url, payload);
  return response.data;
};

export default function RegisterForm() {
  const schema = RegisterSchema();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: register,
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  function handleOnSuccess(data: RegisterResponse) {
    if (data.data) {
      localStorage.setItem('token', data.data.access_token);
    }
    router.push('/parent-dashboard');
  }

  function handleOnError(error: AxiosError<RegisterResponse>) {
    console.log('error', error);
  }

  const submitForm: SubmitHandler<Inputs> = async (formData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = formData;
    await mutateAsync(rest);
  };

  function errorClasses(field: keyof Inputs) {
    return form.formState.errors[field]
      ? 'border-red-300 bg-red-50'
      : 'border-gray-300';
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="space-y-6 min-w-sm max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Name
              </FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  autoComplete="off"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Email Address <Asterisk size={12} className="-ms-1.5" />
              </FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errorClasses('email')
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Password
              </FormLabel>
              <FormControl>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  autoComplete="off"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errorClasses('password')
                  )}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                size={'icon'}
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute top-13 end-1 shadow-none pt-1 transform -translate-y-1/2 bg-transparent hover:bg-transparent !text-gray-700 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent'
                )}
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Confirm Password
              </FormLabel>
              <FormControl>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  autoComplete="off"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errorClasses('confirmPassword')
                  )}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size={'icon'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={cn(
                  'absolute top-13 end-1 shadow-none pt-1 transform -translate-y-1/2 bg-transparent hover:bg-transparent !text-gray-700 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent'
                )}
                aria-label="Toggle Confirm Password Visibility"
              >
                {showConfirmPassword ? <EyeClosed /> : <Eye />}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {errors.general && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {errors.general}
                  </div>
                )} */}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isPending && <Loader className="animate-spin" />}
          {isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
