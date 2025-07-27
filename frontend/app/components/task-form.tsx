'use client';

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Button from '../components/ui/button';
import { validateTaskDescription, validateTaskTitle } from '../lib/auth';
import { TaskType, UserType } from '../types';

type TaskFormProps = {
  onCancel: () => void;
  currentUser: UserType;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
};

export default function TaskForm({
  onCancel,
  currentUser,
  setTasks,
}: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [points, setPoints] = useState(10);
  const [error, setError] = useState('');
  const [familyMembers, setFamilyMembers] = useState<
    Omit<UserType, 'avatar'>[] | null
  >(null);
  console.log(familyMembers, 'familyMembers');
  console.log('tasks user', currentUser);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const familyMembers = await fetch(
        `users/family/${currentUser.familyId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          method: 'GET',
        }
      );
      if (!familyMembers.ok) {
        console.error('Failed to fetch family members');
        return;
      }
      const familyMembersData: Omit<UserType, 'avatar'>[] =
        await familyMembers.json();
      setFamilyMembers(familyMembersData);
    };
    fetchFamilyMembers();
  }, [currentUser]);

  // Format date to yyyy-mm-dd
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [dueDate, setDueDate] = useState(formatDate(tomorrow));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate task title length first
    if (taskTitle.trim().length < 5) {
      setError('Task title must be at least 5 characters long');
      return;
    }

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
    const formValues = {
      title: taskTitle,
      description: taskDescription,

      points,
      dueDate,
      ...(assignedTo ? { assignedTo } : {}),
    };
    // Call the onSubmit callback if provided
    try {
      const task = await fetch('/chores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formValues),
      });
      if (!task.ok) {
        const errText = await task.text();
        throw new Error(errText || `Failed with status ${task.status}`);
      }
      const newTask: TaskType = await task.json();
      setTasks((prevTasks) => [
        ...prevTasks,
        { ...newTask, dueDate: formatDate(new Date(newTask.dueDate)) },
      ]);
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task. Please try again.');
      return;
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
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Create New Task
      </h3>

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
            minLength={5}
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
          >
            <option value="">Select a family member</option>
            {familyMembers?.map((member) => {
              return (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              );
            })}
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
          <Button type="submit">+ Create Task</Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
