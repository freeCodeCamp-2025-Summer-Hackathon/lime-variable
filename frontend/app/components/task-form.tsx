'use client';

import { useState, FormEvent } from 'react';
import { validateTaskDescription, validateTaskTitle } from '../lib/auth';
import { UserType } from '../types';
import Button from '../components/ui/button';

type TaskFormProps = {
  onCancel: () => void;
  usersToAssignTo: UserType[];
  onSubmit?: (taskData: {
    title: string;
    description: string;
    assignedTo: string;
    points: number;
    dueDate: string;
  }) => void;
};

export default function TaskForm({
  onCancel,
  onSubmit,
  usersToAssignTo,
}: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [points, setPoints] = useState(10);
  const [error, setError] = useState('');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format date to yyyy-mm-dd
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [dueDate, setDueDate] = useState(formatDate(tomorrow));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate task title
    const titleError = validateTaskTitle(taskTitle);
    if (titleError) {
      setError(titleError);
      return;
    }

    // Validate task description
    const descriptionError = validateTaskDescription(taskDescription);
    if (descriptionError) {
      setError(descriptionError);
      return;
    }

    // Check if a child is assigned
    if (!assignedTo) {
      setError('Please select a child to assign the task to');
      return;
    }

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit({
        title: taskTitle,
        description: taskDescription,
        assignedTo,
        points,
        dueDate,
      });
    }

    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setAssignedTo('');
    setPoints(10);
    setDueDate(formatDate(tomorrow));
    setError('');

    // Close the modal
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign To
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a child</option>
          {usersToAssignTo.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Points
        </label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button>+ Create Task</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
