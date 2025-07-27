'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  logout,
  refreshUserData,
  getStoredToken,
} from '../../lib/auth';
import { UserType, TaskType } from '../../types';
import TaskModal from '@/app/components/newTaskModal';
import TaskForm from '@/app/components/task-form';
import FamilyForm from '@/app/components/family-form';
import AddMemberForm from '@/app/components/addMember-form';
import TasksWidget from '@/app/components/tasksWidget';
import Button from '@/app/components/ui/button';

export default function ParentDashboard() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openCreateFamilyModal, setOpenCreateFamilyModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<UserType[]>([]);
  const [showCreateFamilyButton, setShowCreateFamilyButton] = useState(false);

  // Create a ref to hold the refresh function from TasksWidget
  const refreshTasksRef = useRef<(() => void) | null>(null);

  console.log(tasks, 'tasks');
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      router.push('/');
      return;
    }
    setCurrentUser(user);
    console.log(user, 'user');
    if (!user.familyId) {
      setShowCreateFamilyButton(true);
    } else {
      // Fetch family members when family exists
      fetchFamilyMembers();
    }
  }, [router]);

  const fetchFamilyMembers = async () => {
    try {
      const user = getCurrentUser();
      const token = getStoredToken();
      if (!token || !user?.familyId) return;

      const response = await fetch(`/users/family/${user.familyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const members = await response.json();
        setFamilyMembers(members);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Function to refresh tasks - will be called after task creation
  const refreshTasks = () => {
    if (refreshTasksRef.current) {
      refreshTasksRef.current();
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  function closeModal() {
    setOpenTaskModal(false);
    setOpenCreateFamilyModal(false);
    setOpenAddMemberModal(false);
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
              <>
                <Button
                  className="min-w-32"
                  onClick={() => setOpenAddMemberModal(true)}
                  variant="purple"
                >
                  + Add Members
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setOpenTaskModal(true)}
                >
                  + Create Task
                </Button>
              </>
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

      {/* Modals */}
      {openTaskModal && (
        <TaskModal onClose={closeModal}>
          <TaskForm
            onCancel={closeModal}
            currentUser={currentUser}
            setTasks={setTasks}
            onTaskCreated={() => {
              closeModal();
              refreshTasks(); // Refresh tasks after creation
            }}
          />
        </TaskModal>
      )}
      {openCreateFamilyModal && (
        <TaskModal onClose={closeModal}>
          <FamilyForm
            onCancel={closeModal}
            onSubmit={(familyData) => {
              console.log('New family created:', familyData);
              if (familyData.id) {
                refreshUserData();
                setShowCreateFamilyButton(false);
              }
            }}
          />
        </TaskModal>
      )}
      {openAddMemberModal && (
        <TaskModal onClose={closeModal}>
          <AddMemberForm
            onCancel={closeModal}
            onSubmit={(memberData) => {
              console.log('New member added:', memberData);
              closeModal();
              // Refresh family members list
              fetchFamilyMembers();
            }}
          />
        </TaskModal>
      )}

      {/* Tasks Widget */}
      {!showCreateFamilyButton && (
        <TasksWidget
          tasks={tasks}
          users={familyMembers}
          onRefreshTasks={(refreshFn) => {
            refreshTasksRef.current = refreshFn;
          }}
        />
      )}
    </div>
  );
}
