import React, { useState } from 'react';
import { UserType, TaskType } from '../types';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Award,
} from 'lucide-react';

const TasksWidget = ({
  tasks,
  users,
}: {
  tasks: TaskType[];
  users: UserType[];
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks =
    activeTab === 'all'
      ? tasks
      : tasks.filter((task) => task.status === activeTab);
  const submittedTasks = tasks.filter((task) => task.status === 'submitted');

  const getChildName = (childId: string) => {
    const child = users.find((user) => user.id === childId);
    return child?.name ?? 'Unknown Child';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <User className="w-4 h-4" />;
      case 'submitted':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            All Tasks
          </h2>

          {/* Submitted info section */}
          {submittedTasks.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-600">
                  Tasks Awaiting Your Review
                </h3>
              </div>
              <p className="text-sm text-purple-600">
                {submittedTasks.length} task
                {submittedTasks.length !== 1 ? 's' : ''} submitted by your
                children need{submittedTasks.length === 1 ? 's' : ''} approval
                or feedback.
              </p>
            </div>
          )}
          {/* Task status Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All Tasks', count: tasks.length },
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
                    Task
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
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 px-4 text-center text-gray-500"
                    >
                      <div className="text-4xl mb-2">📋</div>
                      <div className="text-lg font-medium mb-1">
                        No tasks found
                      </div>
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
                        {getChildName(task.assignedTo)}
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
                        {task.dueDate}
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
                              onClick={() => {}}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => {}}
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
