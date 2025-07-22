'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout, getCurrentUser } from '../../lib/auth';
import { mockTasks, mockRewards } from '../../lib/mockData';
import { TaskType, UserType, RewardType } from '../../types';

export default function ChildDashboard() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [rewards] = useState<RewardType[]>(mockRewards);
  const [showPhotoUpload, setShowPhotoUpload] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'child') {
      router.push('/');
      return;
    }
    setCurrentUser(user);
    setTasks(mockTasks.filter((t) => t.assignedTo === user.id));
  }, [router]);

  const handleTaskStatusUpdate = (
    taskId: string,
    newStatus: TaskType['status'],
    proofPhoto?: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, proofPhoto } : task
      )
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitTaskWithPhoto = (taskId: string) => {
    if (selectedPhoto) {
      handleTaskStatusUpdate(taskId, 'submitted', selectedPhoto);
      setShowPhotoUpload(null);
      setSelectedPhoto(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const totalPoints = currentUser?.points || 0;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Hey {currentUser.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to earn some points?</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
              ⭐ {totalPoints} Points
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Points</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {totalPoints}
                </p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingTasks}
                </p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
        </div>

        {/* Tasks to Start */}
        {tasks.filter((t) => t.status === 'pending').length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🎯</div>
              <h2 className="text-xl font-semibold text-gray-800">
                Tasks to Start
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Points
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter((t) => t.status === 'pending')
                    .map((task) => (
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {task.dueDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ {task.points}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleTaskStatusUpdate(task.id, 'in_progress')
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            🚀 Start Task
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks in Progress */}
        {tasks.filter((t) => t.status === 'in_progress').length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🔄</div>
              <h2 className="text-xl font-semibold text-blue-800">
                Tasks in Progress
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Points
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter((t) => t.status === 'in_progress')
                    .map((task) => (
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {task.dueDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ {task.points}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setShowPhotoUpload(task.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            📷 Submit with Photo
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Under Review */}
        {tasks.filter((t) => t.status === 'submitted').length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">⏳</div>
              <h2 className="text-xl font-semibold text-yellow-800">
                Tasks Under Review
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Points
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter((t) => t.status === 'submitted')
                    .map((task) => (
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {task.dueDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ {task.points}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium">
                            ⏳ Waiting for approval...
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {tasks.filter((t) => t.status === 'completed').length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">✅</div>
              <h2 className="text-xl font-semibold text-green-800">
                Completed Tasks
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Completed Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Points Earned
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter((t) => t.status === 'completed')
                    .map((task) => (
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {task.completedAt
                            ? new Date(task.completedAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ +{task.points}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                            ✅ Completed!
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejected Tasks */}
        {tasks.filter((t) => t.status === 'rejected').length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🔄</div>
              <h2 className="text-xl font-semibold text-red-800">
                Tasks to Redo
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Feedback
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Points
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter((t) => t.status === 'rejected')
                    .map((task) => (
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-sm text-red-700">
                              {task.feedback}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ {task.points}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              handleTaskStatusUpdate(task.id, 'in_progress')
                            }
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            🔄 Try Again
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Tasks Message */}
        {tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No tasks assigned yet!
            </h2>
            <p className="text-gray-600">Check back later for new chores.</p>
          </div>
        )}
      </div>
    </div>
  );
}
