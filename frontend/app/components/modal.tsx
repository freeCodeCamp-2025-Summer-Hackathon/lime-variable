import React, { ReactNode } from 'react';
import { SquareX } from 'lucide-react';

const TaskModal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-gray-100 animate-in zoom-in-95 duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Create New Task
        </h3>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <SquareX size={20} className="cursor-pointer" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default TaskModal;
