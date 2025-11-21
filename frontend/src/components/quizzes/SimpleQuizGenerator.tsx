import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { apiPost } from '../../services/api';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const SimpleQuizGenerator: React.FC = () => {
  const [step, setStep] = useState<'input' | 'generating' | 'quiz' | 'results'>('input');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    if (!topic.trim() || !subject.trim()) {
      toast.error('Please enter both subject and topic');
      return;
    }

    setStep('generating');
    
    try {
      const response = await apiPost('/ai/generate-quiz', {
        subject,
        topic,
        level: 'intermediate',
        questionCount,
        questionTypes: ['multiple_choice'],
        difficulty: 'medium'
      });

      // Mock quiz generation if API fails
      const mockQuiz: QuizQuestion[] = Array.from({ length: questionCount }, (_, i) => ({
        question: `Question ${i + 1} about ${topic} in ${subject}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for question ${i + 1}.`
      }));

      setQuiz(response.data?.data?.questions || mockQuiz);
      setStep('quiz');
      setCurrentQuestion(0);
      setAnswers([]);
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast.error('Using sample quiz. Please check AI configuration.');
      
      // Fallback to sample quiz
      const mockQuiz: QuizQuestion[] = Array.from({ length: questionCount }, (_, i) => ({
        question: `Question ${i + 1} about ${topic} in ${subject}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for question ${i + 1}.`
      }));
      
      setQuiz(mockQuiz);
      setStep('quiz');
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctCount = newAnswers.reduce((count, ans, idx) => {
        return count + (ans === quiz[idx].correctAnswer ? 1 : 0);
      }, 0);
      setScore(correctCount);
      setStep('results');
    }
  };

  const resetQuiz = () => {
    setStep('input');
    setTopic('');
    setSubject('');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setQuiz([]);
  };

  if (step === 'input') {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <SparklesIcon className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">AI Quiz Generator</h2>
            <p className="text-gray-600 mt-2">Create a personalized quiz on any topic</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Science, History"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Algebra, Photosynthesis, World War II"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>

            <button
              onClick={generateQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Generate Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <SparklesIcon className="w-16 h-16 mx-auto text-blue-600 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Quiz...</h2>
          <p className="text-gray-600">AI is creating personalized questions for you</p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz' && quiz.length > 0) {
    const current = quiz[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
            <div className="flex space-x-1">
              {quiz.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx < currentQuestion ? 'bg-green-500' :
                    idx === currentQuestion ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-6">{current.question}</h3>

          <div className="space-y-3">
            {current.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'results') {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {percentage >= 70 ? (
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            ) : (
              <XCircleIcon className="w-16 h-16 text-red-600" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">Here are your results</p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {score}/{quiz.length}
            </div>
            <div className="text-xl text-gray-600">
              {percentage}% Correct
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetQuiz}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Generate New Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default SimpleQuizGenerator;
