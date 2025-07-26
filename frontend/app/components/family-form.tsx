'use client';

import { useState, FormEvent } from 'react';
import { validateTaskTitle } from '../lib/auth';
import { getStoredToken, refreshUserData } from '../lib/auth';
import Button from '../components/ui/button';
import { UserType } from '../types';

type TaskFormProps = {
  onCancel: () => void;
  usersToAssignTo: UserType[];
  onSubmit?: (familyData: { name: string }) => void;
};

export default function FamilyForm({ onCancel, onSubmit }: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function createFamily() {
    const token = getStoredToken();
    if (!token) {
      setError('You are not logged in.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: taskTitle }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed with status ${res.status}`);
      }

      const data = await res.json();
      if (onSubmit) onSubmit(data);

      // Reset form
      setTaskTitle('');
      setError('');
      onCancel();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const titleError = validateTaskTitle(taskTitle);
    if (titleError) {
      setError(titleError);
      return;
    }
    createFamily();
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
          Family Name
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : '+ Create Family'}
        </Button>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
