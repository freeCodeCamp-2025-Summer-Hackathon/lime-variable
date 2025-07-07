import { User, Task, Reward } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Tasneem Ali',
    email: 'tasneem@example.com',
    role: 'parent',
    avatar: '👩‍💼'
  },
  {
    id: '2',
    name: 'Omar El-Sayed',
    email: 'omar@example.com',
    role: 'parent',
    avatar: '👨‍💼'
  },
  {
    id: '3',
    name: 'Leila El-Sayed',
    email: 'leila@example.com',
    role: 'child',
    points: 150,
    avatar: '👧'
  },
  {
    id: '4',
    name: 'Yassin El-Sayed',
    email: 'yassin@example.com',
    role: 'child',
    points: 95,
    avatar: '👦'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Your Room',
    description: 'Make bed, organize clothes, vacuum floor',
    assignedTo: '3',
    assignedBy: '1',
    points: 20,
    status: 'pending',
    dueDate: '2025-07-10',
    createdAt: '2025-07-07'
  },
  {
    id: '2',
    title: 'Take Out Trash',
    description: 'Empty all trash bins and take to curb',
    assignedTo: '4',
    assignedBy: '2',
    points: 15,
    status: 'submitted',
    dueDate: '2025-07-08',
    createdAt: '2025-07-06',
    proofPhoto: '/api/placeholder/400/300'
  },
  {
    id: '3',
    title: 'Load Dishwasher',
    description: 'Load dirty dishes and start wash cycle',
    assignedTo: '3',
    assignedBy: '1',
    points: 10,
    status: 'in_progress',
    dueDate: '2025-07-08',
    createdAt: '2025-07-07'
  },
  {
    id: '4',
    title: 'Water Plants',
    description: 'Water all indoor and outdoor plants',
    assignedTo: '4',
    assignedBy: '2',
    points: 12,
    status: 'completed',
    dueDate: '2025-07-07',
    createdAt: '2025-07-05',
    completedAt: '2025-07-07'
  }
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: '1 Hour Extra Screen Time',
    description: 'Enjoy an extra hour of TV or gaming',
    cost: 50,
    available: true
  },
  {
    id: '2',
    title: 'Choose Family Movie Night',
    description: 'Pick the movie for next family movie night',
    cost: 100,
    available: true
  },
  {
    id: '3',
    title: '$10 Allowance Bonus',
    description: 'Extra $10 added to your allowance',
    cost: 200,
    available: true
  }
];
