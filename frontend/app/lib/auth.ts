import { UserType } from '../types';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

interface LoginResponse {
  access_token: string;
}

interface RegisterResponse {
  id: string;
  name: string | null;
  email: string;
  access_token: string;
}

interface UserMeResponse {
  id: string;
  name: string | null;
  email: string;
  role: 'PARENT' | 'CHILD';
  points: number;
  createdAt: string;
  updatedAt: string;
  familyId: string;
}

async function apiCall(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function register(
  email: string,
  password: string
): Promise<UserType> {
  try {
    const response: RegisterResponse = await apiCall('auth/register-user', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, response.access_token);
    }

    const userDetails = await getUserMe(response.access_token);

    const user: UserType = {
      id: userDetails.id,
      name: userDetails.name || '',
      email: userDetails.email,
      role: userDetails.role.toLowerCase() as 'parent' | 'child',
      avatar: userDetails.role === 'PARENT' ? '👨‍💼' : '👧',
      points: userDetails.points,
      familyId: userDetails.familyId,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return user;
  } catch (error) {
    throw new Error(`Registration failed: ${(error as Error).message}`);
  }
}

export async function login(
  email: string,
  password: string
): Promise<UserType> {
  try {
    const response: LoginResponse = await apiCall('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, response.access_token);
    }

    const userDetails = await getUserMe(response.access_token);

    const user: UserType = {
      id: userDetails.id,
      name: userDetails.name || '',
      email: userDetails.email,
      role: userDetails.role.toLowerCase() as 'parent' | 'child',
      points: userDetails.points,
      familyId: userDetails.familyId,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return user;
  } catch (error) {
    throw new Error(`Login failed: ${(error as Error).message}`);
  }
}

async function getUserMe(token: string): Promise<UserMeResponse> {
  return apiCall('users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getCurrentUser(): UserType | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function refreshUserData(): Promise<UserType | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const userDetails = await getUserMe(token);

    const user: UserType = {
      id: userDetails.id,
      name: userDetails.name || '',
      email: userDetails.email,
      role: userDetails.role.toLowerCase() as 'parent' | 'child',
      avatar: userDetails.role === 'PARENT' ? '👨‍💼' : '👧',
      points: userDetails.points,
      familyId: userDetails.familyId,
    };

    // Update stored user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return user;
  } catch (error) {
    logout();
    throw new Error(`Registration failed: ${(error as Error).message}`);
  }
}

export function validateTaskTitle(taskTitle: string): string {
  if (taskTitle.length > 100)
    return 'Task Title must be less than or equal to 100 characters.';
  return '';
}

export function validateTaskDescription(taskDescription: string): string {
  if (taskDescription.length > 500)
    return 'Task Description must be less than or equal to 500 characters.';
  return '';
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return '';
}

export function validatePassword(password: string): string {
  if (password.length < 8)
    return 'Password must be at least 8 characters long.';
  return '';
}
