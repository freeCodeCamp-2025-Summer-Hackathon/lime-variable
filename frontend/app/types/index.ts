export interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'CHILD';
  points?: number;
  avatar?: string;
  familyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskType {
  id: string;
  title: string;
  description: string;
  assignedTo: string | UserType;
  assignedBy: string | UserType;
  createdBy: string | UserType;
  points: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  proofPhoto?: string;
  proofPhotoUrl?: string | null;
  feedback?: string;
  familyId: string;
  submittedAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  assignedToUser?: UserType;
  createdByUser?: UserType;
  assignedByUser?: UserType;
}

export interface RewardType {
  id: string;
  title: string;
  description: string;
  cost: number;
  available: boolean;
}

export type FamilyType = {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  members: UserType[];
};
