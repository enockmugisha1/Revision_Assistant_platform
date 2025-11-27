import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InnovativeTaskCalendar from '../components/dashboard/InnovativeTaskCalendar';

const TaskCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('studentTasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed.map((t: any) => ({...t, due: new Date(t.due)})));
      } catch (e) {
        console.error('Failed to load tasks:', e);
      }
    }
  };

  const saveTasks = (newTasks: any[]) => {
    setTasks(newTasks);
    localStorage.setItem('studentTasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (task: any) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false
    };
    saveTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    saveTasks(tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
  };

  const handleDeleteTask = (taskId: string) => {
    saveTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📅 My Task Calendar
              </h1>
              <p className="text-gray-600 text-lg">
                Plan your study schedule and never miss a deadline, {user?.firstName}!
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Active Tasks</div>
              <div className="text-3xl font-bold text-purple-600">
                {tasks.filter(t => !t.completed).length}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <InnovativeTaskCalendar
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default TaskCalendarPage;
