export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: 'PARENT' | 'CHILD';
  createdAt: Date;
  updatedAt: Date;
}
