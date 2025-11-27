import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  ClockIcon, 
  SparklesIcon,
  CheckCircleIcon,
  PlayIcon,
  ChartBarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import QuizService, { QuizListItem, CreateQuizDto } from '../../services/quizService';
import toast from 'react-hot-toast';

export const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [form, setForm] = useState<CreateQuizDto>({ title: '', subject: '', level: 'beginner' });
  const [error, setError] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [searchTerm, levelFilter, quizzes]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await QuizService.list();
      setQuizzes(data);
      setFilteredQuizzes(data);
      if (data.length === 0) {
        toast('No quizzes yet! Generate one using AI chat.', { icon: '💡' });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to load quizzes';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        q => q.title.toLowerCase().includes(term) || q.subject.toLowerCase().includes(term)
      );
    }

    if (levelFilter) {
      filtered = filtered.filter(q => q.level === levelFilter);
    }

    setFilteredQuizzes(filtered);
  };

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      toast.loading('Creating quiz...');
      const newQuiz = await QuizService.create(form);
      setQuizzes((prev) => [newQuiz as any, ...prev]);
      setShowForm(false);
      setForm({ title: '', subject: '', level: 'beginner' });
      toast.dismiss();
      toast.success('Quiz created successfully!');
    } catch (e) {
      toast.dismiss();
      const errorMsg = e instanceof Error ? e.message : 'Failed to create quiz';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleQuizClick = async (quizId: string) => {
    try {
      setLoadingQuiz(quizId);
      setSelectedQuiz(quizId);
      
      // Show loading toast
      toast.loading('Loading quiz...', { id: 'quiz-load' });
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to quiz page
      toast.dismiss('quiz-load');
      toast.success('Quiz loaded!');
      navigate(`/quizzes/${quizId}/take`);
    } catch (error) {
      toast.dismiss('quiz-load');
      toast.error('Failed to load quiz');
      console.error('Quiz load error:', error);
    } finally {
      setLoadingQuiz(null);
    }
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      return;
    }

    try {
      toast.loading('Deleting quiz...', { id: 'quiz-delete' });
      await QuizService.delete(quizId);
      
      // Remove from state
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      setFilteredQuizzes(prev => prev.filter(q => q._id !== quizId));
      
      toast.dismiss('quiz-delete');
      toast.success('Quiz deleted successfully!');
    } catch (error) {
      toast.dismiss('quiz-delete');
      toast.error('Failed to delete quiz');
      console.error('Delete quiz error:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '🔥';
      case 'advanced':
        return '🚀';
      default:
        return '📚';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">Test your knowledge and track progress</p>
        </div>
        <div className="flex gap-3">
          <Button 
            leftIcon={<SparklesIcon className="h-4 w-4" />}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            AI Quiz
          </Button>
          <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowForm((v) => !v)}>
            New Quiz
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Create New Quiz</h3>
          <form onSubmit={createQuiz} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
                name="title" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
                name="subject" 
                value={form.subject} 
                onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
                name="level" 
                value={form.level} 
                onChange={(e) => setForm({ ...form, level: e.target.value as any })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">Create</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
            {error && <div className="md:col-span-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">{error}</div>}
          </form>
        </motion.div>
      )}

      {/* Quiz Cards */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full"
          >
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <AcademicCapIcon className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your quizzes...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadQuizzes} variant="outline" className="border-red-300 text-red-700">
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : filteredQuizzes.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-xl p-12 text-center">
              <div className="text-7xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm || levelFilter ? 'No quizzes match your search' : 'No quizzes yet!'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || levelFilter 
                  ? 'Try adjusting your search filters or create a new quiz.'
                  : 'Create your first quiz or generate one using our AI assistant!'}
              </p>
              <div className="flex gap-3 justify-center">
                {(searchTerm || levelFilter) && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchTerm(''); setLevelFilter(''); }}
                  >
                    Clear Filters
                  </Button>
                )}
                <Button 
                  leftIcon={<SparklesIcon className="h-4 w-4" />}
                  onClick={() => navigate('/quizzes/ai')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Generate with AI
                </Button>
                <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowForm(true)}>
                  Create Quiz
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group bg-white rounded-xl shadow-md border-2 overflow-hidden cursor-pointer transition-all ${
                  selectedQuiz === quiz._id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleQuizClick(quiz._id)}
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white relative">
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteQuiz(quiz._id, quiz.title, e)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete quiz"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-8">
                      <h3 className="text-lg font-bold mb-1 line-clamp-2">{quiz.title}</h3>
                      <p className="text-blue-100 text-sm">{quiz.subject}</p>
                    </div>
                    <div className="text-3xl">{getLevelIcon(quiz.level)}</div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AcademicCapIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {quiz.totalQuestions || 0} Questions
                      </span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${getLevelColor(quiz.level)}`}>
                      {quiz.level}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-gray-100">
                    {loadingQuiz === quiz._id ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Loading quiz...</span>
                      </div>
                    ) : (
                      <button
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuizClick(quiz._id);
                        }}
                      >
                        <PlayIcon className="h-5 w-5" />
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {selectedQuiz === quiz._id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizzesPage;

