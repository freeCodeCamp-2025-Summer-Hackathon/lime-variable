import React, { useState, useEffect } from 'react';
import { UserType, TaskType } from '../types';
import { getStoredToken } from '../lib/auth';
import {
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Calendar,
  Award,
  Loader2,
} from 'lucide-react';

const TasksWidget = ({
  tasks: initialTasks,
  users,
}: {
  tasks: TaskType[];
  users: UserType[];
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(tasks, 'tasks');
  // Fetch chores from the API
  useEffect(() => {
    const fetchChores = async () => {
      try {
        setLoading(true);
        const token = getStoredToken();

        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch('/chores', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chores');
        }

        const chores = await response.json();
        setTasks(chores);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chores');
        console.error('Error fetching chores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChores();
  }, []);

  const filteredTasks =
    activeTab === 'all'
      ? tasks
      : tasks.filter((task) => task.status === activeTab);
  const submittedTasks = tasks.filter((task) => task.status === 'submitted');

  const getUserName = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    return user?.name ?? 'Unknown User';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4" />;
      case 'submitted':
        return <Send className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleApprove = async (taskId: string) => {
    try {
      const token = getStoredToken();
      const response = await fetch(`/chores/${taskId}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: 'completed' } : task
          )
        );
      }
    } catch (err) {
      console.error('Error approving task:', err);
    }
  };

  const handleReject = async (taskId: string) => {
    try {
      const token = getStoredToken();
      const response = await fetch(`/chores/${taskId}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: 'rejected' } : task
          )
        );
      }
    } catch (err) {
      console.error('Error rejecting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading chores...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Chores
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            All Chores
          </h2>

          {/* Submitted info section */}
          {submittedTasks.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-600">
                  Chores Awaiting Your Review
                </h3>
              </div>
              <p className="text-sm text-purple-600">
                {submittedTasks.length} chore
                {submittedTasks.length !== 1 ? 's' : ''} submitted by family
                members need{submittedTasks.length === 1 ? 's' : ''} approval or
                feedback.
              </p>
            </div>
          )}

          {/* Task status Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All Chores', count: tasks.length },
                {
                  key: 'pending',
                  label: 'Pending',
                  count: tasks.filter((t) => t.status === 'pending').length,
                },
                {
                  key: 'in_progress',
                  label: 'In Progress',
                  count: tasks.filter((t) => t.status === 'in_progress').length,
                },
                {
                  key: 'submitted',
                  label: 'Submitted',
                  count: tasks.filter((t) => t.status === 'submitted').length,
                },
                {
                  key: 'completed',
                  label: 'Completed',
                  count: tasks.filter((t) => t.status === 'completed').length,
                },
                {
                  key: 'rejected',
                  label: 'Rejected',
                  count: tasks.filter((t) => t.status === 'rejected').length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tasks Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Chore
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Assigned To
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Points
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-gray-500"
                    >
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-lg font-medium mb-1">
                        No chores found
                      </div>
                      <p className="text-sm">
                        {activeTab === 'all'
                          ? 'Create your first chore to get started!'
                          : `No chores with status "${activeTab.replace(
                              '_',
                              ' '
                            )}"`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
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
                        {getUserName(task.assignedTo)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-700 font-medium">
                            {task.points}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'No due date'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {task.status === 'submitted' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(task.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(task.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No action needed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksWidget;
