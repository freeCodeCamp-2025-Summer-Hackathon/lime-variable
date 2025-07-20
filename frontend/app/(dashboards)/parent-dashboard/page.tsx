'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '../../lib/auth';
import { UserType, TaskType } from '../../types';
import Modal from '@/app/components/modal';
import TaskForm from '@/app/components/task-form';
import TasksWidget from '@/app/components/tasksWidget';
import { mockUsers as users, mockTasks } from '../../lib/mockData';
import Button from '@/app/components/ui/button';

export default function ParentDashboard() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(mockTasks);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'parent') {
      router.push('/');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return <div>Loading...</div>;

  function closeModal() {
    setOpenModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Parent Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="flex-1" onClick={() => setOpenModal(true)}>
              + Create Task
            </Button>
            <Button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              variant="ghost"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {openModal && (
        <Modal onClose={closeModal}>
          <TaskForm
            onCancel={closeModal}
            usersToAssignTo={users.filter((user) => user.role === 'child')}
            onSubmit={(taskData) => {
              const newTask: TaskType = {
                id: Date.now().toString(),
                title: taskData.title,
                description: taskData.description,
                assignedTo: taskData.assignedTo,
                assignedBy: currentUser.id,
                points: taskData.points,
                dueDate: taskData.dueDate,
                status: 'pending',
                createdAt: new Date().toISOString(),
              };

              setTasks((prevTasks) => [...prevTasks, newTask]);
            }}
          />
        </Modal>
      )}
      {/* Task Widget */}
      <TasksWidget tasks={tasks} users={users} />
    </div>
  );
}
