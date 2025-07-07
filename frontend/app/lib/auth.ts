import { User } from '../types';
import { mockUsers } from './mockData';

const STORAGE_KEY = 'chore_tracker_user';

export function login(email: string, password: string): User | null {
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(STORAGE_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
