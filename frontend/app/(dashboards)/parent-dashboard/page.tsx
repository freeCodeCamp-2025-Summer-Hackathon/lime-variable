'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout} from '../../lib/auth';
import {  User } from '../../types';
import Modal from '@/app/components/modal';
import TaskForm from '@/app/components/task-form';

export default function ParentDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openModal,setOpenModal] = useState(false)


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

  function isModalOpen() {
    console.log('clicked')
    setOpenModal(true)
  }

  function closeModal() {
    setOpenModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Parent Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={isModalOpen}
            >
              + Create Task
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
        <Modal show={openModal} onClose={closeModal}>
          <TaskForm onCancel={closeModal}/>
        </Modal>
    </div>
  );
}