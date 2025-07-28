import { z } from 'zod';

export const LoginSchema = () => {
  return z.object({
    email: z.email('Kindly enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  });
};

export type LoginSchemaType = ReturnType<typeof LoginSchema>;
export type LoginFormFields = z.infer<LoginSchemaType>;
