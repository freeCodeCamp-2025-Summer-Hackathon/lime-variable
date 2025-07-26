'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  getStoredToken,
  logout,
  refreshUserData,
} from '../../lib/auth';
import { UserType, TaskType } from '../../types';
import TaskModal from '@/app/components/newTaskModal';
import TaskForm from '@/app/components/task-form';
import FamilyForm from '@/app/components/family-form';
import TasksWidget from '@/app/components/tasksWidget';
import { mockUsers as users, mockTasks } from '../../lib/mockData';
import Button from '@/app/components/ui/button';

export default function ParentDashboard() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(mockTasks);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openCreateFamilyModal, setOpenCreateFamilyModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<UserType[]>([]);
  const [showCreateFamilyButton, setShowCreateFamilyButton] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    const userToken = getStoredToken();
    if (!user || user.role !== 'parent') {
      router.push('/');
      return;
    }
    setCurrentUser(user);
    setToken(userToken);
    console.log(user, 'user');
    if (!user.familyId) {
      setShowCreateFamilyButton(true);
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return <div>Loading...</div>;

  function closeModal() {
    setOpenTaskModal(false);
    setOpenCreateFamilyModal(false);
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
              <p className="text-gray-600">
                <span>Welcome back</span>{' '}
                <span>{currentUser.name ? `,${currentUser.name}` : ''}!</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!showCreateFamilyButton && (
              <Button className="flex-1" onClick={() => setOpenTaskModal(true)}>
                + Create Task
              </Button>
            )}
            {showCreateFamilyButton && (
              <Button
                className="flex-1"
                onClick={() => setOpenCreateFamilyModal(true)}
              >
                + Create Your Family
              </Button>
            )}
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
      {openTaskModal && (
        <TaskModal onClose={closeModal}>
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
        </TaskModal>
      )}
      {openCreateFamilyModal && (
        <TaskModal onClose={closeModal}>
          <FamilyForm
            onCancel={closeModal}
            usersToAssignTo={users.filter((user) => user.role === 'child')}
            onSubmit={(familyData) => {
              // `familyData` will be the response from /families API
              console.log('New family created:', familyData);
              if (familyData.id) {
                refreshUserData();
              }
              // Example: Update state if needed
              // setFamilies((prevFamilies) => [...prevFamilies, familyData]);

              // Optionally refresh user data (to get updated familyId)
              //
            }}
          />
        </TaskModal>
      )}
      {/* Task Widget */}
      <TasksWidget tasks={tasks} users={users} />
    </div>
  );
}
