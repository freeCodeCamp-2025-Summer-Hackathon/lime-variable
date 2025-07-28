import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const RegisterSchema = () => {
  return z
    .object({
      name: z.string().optional(),
      email: z.email('Kindly enter a valid email'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
      confirmPassword: z
        .string()
        .min(8, 'Confirm Password must be at least 8 characters long'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });
};

export type RegisterSchemaType = ReturnType<typeof RegisterSchema>;
export type RegisterFormFields = z.infer<RegisterSchemaType>;
export type RegisterFormReturn = UseFormReturn<RegisterFormFields>;
