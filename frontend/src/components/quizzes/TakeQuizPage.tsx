import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import QuizService, { AttemptResult, QuizDetail } from '../../services/quizService';

export const TakeQuizPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const q = await QuizService.get(id);
        setQuiz(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [seconds]);

  const progress = useMemo(() => {
    if (!quiz) return 0;
    return Math.round((Object.keys(answers).length / quiz.totalQuestions) * 100);
  }, [answers, quiz]);

  const submit = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await QuizService.submitAttempt(id, answers, seconds);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button className="mt-4" onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Quiz not found</p>
          <Button className="mt-4" onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  if (result) {
    const getPerformanceLevel = (percentage: number) => {
      if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-600', bg: 'bg-green-50', emoji: '🌟' };
      if (percentage >= 75) return { text: 'Great Job!', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '✅' };
      if (percentage >= 60) return { text: 'Good Effort!', color: 'text-yellow-600', bg: 'bg-yellow-50', emoji: '📝' };
      return { text: 'Keep Practicing!', color: 'text-orange-600', bg: 'bg-orange-50', emoji: '📚' };
    };

    const performance = getPerformanceLevel(result.percentage);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/quizzes')}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title} - Results</h1>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`${performance.bg} rounded-xl p-8 text-center border-2 ${performance.color.replace('text', 'border')}`}
        >
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h2 className={`text-3xl font-bold mb-2 ${performance.color}`}>
            {Math.round(result.percentage)}%
          </h2>
          <p className={`text-xl ${performance.color}`}>{performance.text}</p>
          <div className="mt-6 flex justify-center gap-8 text-gray-700">
            <div>
              <div className="text-2xl font-bold">{result.correctAnswers}</div>
              <div className="text-sm">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{result.totalQuestions - result.correctAnswers}</div>
              <div className="text-sm">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formattedTime}</div>
              <div className="text-sm">Time</div>
            </div>
          </div>
        </motion.div>

        {/* Feedback Section */}
        {result.feedback && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3">📊 Performance Feedback</h3>
            <p className="text-gray-700 mb-4">{result.feedback.message}</p>
            {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
                <ul className="space-y-2">
                  {result.feedback.suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">📝 Review Answers</h3>
          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const userAnswer = answers[q._id];
              const isCorrect = q.options?.some(opt => opt.text === userAnswer && opt.isCorrect);

              return (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-lg p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <XCircleIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {i + 1}. {q.question}
                      </p>
                      {q.options && (
                        <div className="space-y-2 mb-3">
                          {q.options.map((opt, oi) => {
                            const isUserAnswer = opt.text === userAnswer;
                            const isCorrectOption = (opt as any).isCorrect;

                            return (
                              <div
                                key={oi}
                                className={`px-3 py-2 rounded text-sm ${
                                  isCorrectOption
                                    ? 'bg-green-100 text-green-800 font-medium'
                                    : isUserAnswer
                                    ? 'bg-red-100 text-red-800'
                                    : 'text-gray-600'
                                }`}
                              >
                                {isCorrectOption && '✓ '}
                                {isUserAnswer && !isCorrectOption && '✗ '}
                                {opt.text}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="bg-white border border-gray-200 rounded p-3 mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">💡 Explanation:</p>
                          <p className="text-sm text-gray-600">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pb-8">
          <Button variant="outline" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
          <Button onClick={() => window.location.reload()}>
            Retake Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.subject} • {quiz.level}</p>
          </div>
          {started && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <ClockIcon className="h-5 w-5" />
                <span className="font-mono text-lg">{formattedTime}</span>
              </div>
            </div>
          )}
        </div>

        {started && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Object.keys(answers).length} / {quiz.totalQuestions} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {!started ? (
        /* Start Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-200"
        >
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{quiz.totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600 capitalize">{quiz.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{quiz.totalPoints || quiz.totalQuestions}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
          {quiz.description && (
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">{quiz.description}</p>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/quizzes')}>
              Cancel
            </Button>
            <Button
              onClick={() => setStarted(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Quiz
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Quiz Questions */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {quiz.questions.map((q, idx) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-900">{q.question}</p>
                  {q.points && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {q.points} {q.points === 1 ? 'point' : 'points'}
                    </span>
                  )}
                </div>
              </div>

              {q.options ? (
                <div className="space-y-3 ml-11">
                  {q.options.map((opt, oi) => {
                    const idOpt = `${q._id}-${oi}`;
                    const isSelected = answers[q._id] === opt.text;
                    return (
                      <label
                        key={idOpt}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q._id}
                          className="h-5 w-5 text-blue-600"
                          onChange={() => setAnswers((prev) => ({ ...prev, [q._id]: opt.text }))}
                          checked={isSelected}
                        />
                        <span className={`flex-1 ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                          {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="ml-11">
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Type your answer here..."
                    rows={3}
                    value={answers[q._id] || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q._id]: e.target.value }))}
                  />
                </div>
              )}
            </motion.div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-gray-600">
              {Object.keys(answers).length === quiz.totalQuestions ? (
                <span className="text-green-600 font-medium">✓ All questions answered!</span>
              ) : (
                <span>
                  {quiz.totalQuestions - Object.keys(answers).length} question(s) remaining
                </span>
              )}
            </div>
            <Button
              onClick={submit}
              disabled={submitting || Object.keys(answers).length === 0}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TakeQuizPage;

