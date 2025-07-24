'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '../../lib/auth';
import { mockTasks, mockUsers } from '../../lib/mockData';
import { TaskType, UserType } from '../../types';
import { Clock, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import PhotoUploadModal from '@/app/components/photoUploadModal';

export default function ChildDashboard() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showPhotoUpload, setShowPhotoUpload] = useState<string | null>(null);
  const [taskPhotos, setTaskPhotos] = useState<Record<string, string>>({});
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

  const handlePhotoSelect = (taskId: string, photoUrl: string) => {
    setTaskPhotos((prev) => ({ ...prev, [taskId]: photoUrl }));
    setShowPhotoUpload(null);
  };

  const handleRemovePhoto = (taskId: string) => {
    setTaskPhotos((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  const handleSubmitTask = (taskId: string) => {
    const photoUrl = taskPhotos[taskId];
    handleTaskStatusUpdate(taskId, 'submitted', photoUrl);
  };

  const handleModalClose = () => {
    setShowPhotoUpload(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getParentName = (parentId: string) => {
    return mockUsers.find((u) => u.id === parentId)?.name || 'Unknown';
  };

  const getStatusColor = (status: TaskType['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPoints = currentUser?.points || 0;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === 'in_progress'
  ).length;
  const inReviewTasks = tasks.filter((t) => t.status === 'submitted').length;
  const rejectedTasks = tasks.filter((t) => t.status === 'rejected').length;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inProgressTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600"> Submitted</p>
                <p className="text-2xl font-bold text-purple-600">
                  {inReviewTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Tasks</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <XCircle className="w-6 h-6" />
              </div>
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 Due: {task.dueDate}</span>
                      <span>⭐ Points: {task.points}</span>
                      <span>👤 From: {getParentName(task.assignedBy)}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                {task.feedback && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-700">
                      <strong>Feedback:</strong> {task.feedback}
                    </p>
                  </div>
                )}

                {/* Show selected photo if exists */}
                {taskPhotos[task.id] && (
                  <div className="mt-3 flex items-start space-x-3">
                    <img
                      src={taskPhotos[task.id]}
                      alt="Task proof"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleRemovePhoto(task.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm cursor-pointer"
                    >
                      🗑️ Remove Photo
                    </button>
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  {task.status === 'pending' && (
                    <button
                      onClick={() =>
                        handleTaskStatusUpdate(task.id, 'in_progress')
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      🚀 Start Task
                    </button>
                  )}

                  {task.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => setShowPhotoUpload(task.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          taskPhotos[task.id]
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                        }`}
                      >
                        📷 Add Photo
                      </button>
                      <button
                        onClick={() => handleSubmitTask(task.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        Submit Task ➤
                      </button>
                    </>
                  )}

                  {task.status === 'submitted' && (
                    <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
                      ⏳ Waiting for approval...
                    </div>
                  )}

                  {task.status === 'completed' && (
                    <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg">
                      ✅ Completed! +{task.points} points
                    </div>
                  )}

                  {task.status === 'rejected' && (
                    <button
                      onClick={() =>
                        handleTaskStatusUpdate(task.id, 'in_progress')
                      }
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      🔄 Try Again
                    </button>
                  )}
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🎉</div>
                <p>No tasks assigned yet!</p>
                <p className="text-sm">Check back later for new chores.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <PhotoUploadModal
          onClose={handleModalClose}
          onSubmit={handlePhotoSelect}
          taskId={showPhotoUpload}
        />
      )}
    </div>
  );
}
