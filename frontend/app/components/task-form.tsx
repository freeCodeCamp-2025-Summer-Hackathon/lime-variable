'use client';

import { useState ,FormEvent ,useContext} from 'react';
import { mockUsers } from '../lib/mockData';
import { validateTaskDescription, validateTaskTitle } from '../lib/auth';



type TaskFormProps = {
    onCancel: () => void;
};


export default function TaskForm({ onCancel }: TaskFormProps){
    const [taskTitle,setTaskTitle] = useState('')
    const [taskDescription,setTaskDescription] = useState('')
    const [childRole,setChildRole] = useState('')
    const [error,setError] = useState('')
    const [number,setNumber] = useState(10)
    const [openModal,setOpenModal] = useState(false)


    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    // Format date to yyyy-mm-dd
    const formatDate = (date:any) => {
      return date.toISOString().split('T')[0];
    }
  
    const [dueDate, setDueDate] = useState(formatDate(tomorrow));

    function handleSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (validateTaskTitle (taskTitle)){
            setError(validateTaskTitle (taskTitle))
            return
        }

        if (validateTaskDescription (taskDescription)){
            setError(validateTaskDescription (taskDescription))
            return
        }

        setTaskTitle('')
        setTaskDescription('')
        setChildRole('')
        setDueDate(formatDate(tomorrow))
        setNumber(10)
        setError('')
    }

    function closeModal() {
        setOpenModal(false)
    }

    return (
            <form className='flex flex-col' onSubmit={(e) => handleSubmit(e)}>
                <label className="font-medium">Task Title</label>
                <input 
                    type='text' 
                    required 
                    value={taskTitle}
                    placeholder="Enter Task"
                    className={`border  px-3 py-2 rounded-md mb-3 focus:outline-none focus:border-0 focus:ring-2 focus:ring-blue-500`}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                <label className="font-medium">Description</label>
                <textarea 
                    required 
                    cols={30}
                    rows={6}
                    value = {taskDescription}
                    placeholder ='Enter detailed instruction for completing the task'
                    className ="border border-gray-800 p-2.5 rounded-md mb-3 focus:outline-none focus:border-0 focus:ring-2 focus:ring-blue-500"
                    onChange = {(e) => setTaskDescription(e.target.value)}
                >
                </textarea>
                 
                <label className ="font-medium">Assign To</label>
                <select 
                    value ={childRole}
                    name = 'child-roles'
                    required
                    onChange ={(e) => setChildRole(e.target.value)}
                    className='border border-gray-800 p-2.5 rounded-md mb-3  focus:outline-none focus:border-0 focus:ring-2 focus:ring-blue-500'
                >
                    {mockUsers
                    .filter((u) =>u.role === 'child')
                    .map((child) => <option key ={child.id} value ={child.name} className ="flex items-center gap-2.5"> {child.avatar} {child.name}</option>) 
                    }
                    
                </select>
                <label className="font-medium">Points</label>
                <input 
                    type='number'
                    required
                    min={1}
                    max={1000}
                    value={number}
                    onChange={(e) => setNumber( + e.target.value)}
                    className="border p-2.5 border-gray-800 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-0"
                />
                <label className="font-medium">Due Date</label>
                <input 
                    type='date'
                    required
                    className="border p-2.5 border-gray-800 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-0"
                    value={dueDate}
                    min={formatDate(today)}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                {error && <p className="text-center font-bold text-[16px] text-red-600">{error}</p>}

                <div className="flex items-center justify-center gap-2.5 my-2.5">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        type='submit'
                    >
                    + Create Task
                    </button>
                    <button
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={onCancel}
                    >
                    Cancel
                    </button>
                </div>

            </form>
    )
}