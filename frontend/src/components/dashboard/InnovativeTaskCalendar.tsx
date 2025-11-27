import React, { useState } from 'react';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description?: string;
  due: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'quiz' | 'study' | 'assignment' | 'project' | 'exam';
  completed: boolean;
  reminder?: Date;
}

interface InnovativeTaskCalendarProps {
  tasks?: Task[];
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  onToggleTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const InnovativeTaskCalendar: React.FC<InnovativeTaskCalendarProps> = ({
  tasks = [],
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate] = useState<Date | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'study' as const,
    dueDate: '',
    dueTime: '12:00'
  });

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.due);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) return;
    
    const dueDateTime = new Date(`${newTask.dueDate}T${newTask.dueTime}`);
    
    onAddTask?.({
      title: newTask.title,
      description: newTask.description,
      due: dueDateTime,
      priority: newTask.priority,
      category: newTask.category,
      completed: false
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'study',
      dueDate: '',
      dueTime: '12:00'
    });
    setShowAddTask(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      quiz: 'bg-blue-100 text-blue-800 border-blue-300',
      study: 'bg-green-100 text-green-800 border-green-300',
      assignment: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      project: 'bg-purple-100 text-purple-800 border-purple-300',
      exam: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[category as keyof typeof colors] || colors.study;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority as keyof typeof colors];
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcomingTasks = tasks
    .filter(t => !t.completed && new Date(t.due) >= new Date())
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.due) < new Date());
  const completedToday = tasks.filter(t => t.completed && isToday(new Date(t.due))).length;

  return (
    <div className="space-y-6">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold mt-1">{tasks.length}</p>
            </div>
            <CalendarIcon className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed Today</p>
              <p className="text-3xl font-bold mt-1">{completedToday}</p>
            </div>
            <CheckCircleIcon className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Upcoming</p>
              <p className="text-3xl font-bold mt-1">{upcomingTasks.length}</p>
            </div>
            <ClockIcon className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <p className="text-3xl font-bold mt-1">{overdueTasks.length}</p>
            </div>
            <BellIcon className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Calendar and Tasks Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex space-x-1">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {view === 'month' ? (
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dayTasks = day ? getTasksForDate(day) : [];
                  const today = day && isToday(day);
                  const past = day && isPast(day);

                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      className={`min-h-[80px] p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        !day ? 'bg-gray-50 border-transparent' :
                        today ? 'bg-blue-50 border-blue-500' :
                        'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-semibold mb-1 ${
                            today ? 'text-blue-600' :
                            past ? 'text-gray-400' :
                            'text-gray-700'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 2).map(task => (
                              <div
                                key={task.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${getCategoryColor(task.category)}`}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 2 && (
                              <div className="text-xs text-gray-500 font-medium">
                                +{dayTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* List View */
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tasks yet</p>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 ${
                      task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    } hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask?.(task.id)}
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(task.category)}`}>
                              {task.category}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(task.due).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(task.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteTask?.(task.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Upcoming Tasks */}
        <div className="space-y-6">
          {/* Add Task Button */}
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Task</span>
          </button>

          {/* Add Task Form */}
          {showAddTask && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Create New Task</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description (optional)..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="study">Study</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                  </select>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.title || !newTask.dueDate}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Tasks List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Tasks
            </h3>
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No upcoming tasks</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        <span className="font-medium text-sm text-gray-900">{task.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 ml-4">
                      <span>{new Date(task.due).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <BellIcon className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-bold text-red-900">Overdue Tasks</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}. Complete them soon!
              </p>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-sm text-red-800 font-medium">
                    • {task.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InnovativeTaskCalendar;
