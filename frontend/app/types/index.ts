export interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child';
  points?: number;
  avatar?: string;
}

export interface TaskType {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  points: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed' | 'rejected';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  proofPhoto?: string;
  feedback?: string;
}

export interface RewardType {
  id: string;
  title: string;
  description: string;
  cost: number;
  available: boolean;
}
