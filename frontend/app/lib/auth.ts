import { UserType } from '../types';

const STORAGE_KEY = 'chore_tracker_user';

export async function handleLogin(
  email: string,
  password: string
): Promise<JSON | null> {
  
  const loginUrl: string = 'http://localhost:5432/auth/login';
  const request: Response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  if (!request.ok) {
    return null;
  }

  const response: Promise<JSON> = await request.json();

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  }
  return response;
}

export async function handleSignUp(
  name: string,
  email: string,
  password: string
): Promise<JSON | null> {
  const signUpUrl: string = 'http://localhost:5432/auth/register-user';

  const request: Response = await fetch(signUpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  if (!request.ok) {
    return null;
  }

  const response: Promise<JSON> = await request.json();

  return response;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getCurrentUser(): UserType | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem(STORAGE_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function validateTaskTitle(taskTitle: string) {
  if (taskTitle.length > 100)
    return 'Task Title must be less than or equal to 100 characters.';
  return '';
}

export function validateTaskDescription(taskDescription: string) {
  if (taskDescription.length > 500)
    return 'Task Description must be less than or equal to 500 characters.';
  return '';
}
