import Progress from '../models/Progress.js';
import User from '../models/User.js';

// @desc    Get current user's progress
// @route   GET /api/progress
// @access  Private
export const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email avatar');
    
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        studySessions: [],
        goals: []
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress'
    });
  }
};

// @desc    Get progress statistics
// @route   GET /api/progress/stats
// @access  Private
export const getProgressStats = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!progress) {
      return res.json({
        success: true,
        data: {
          todayStudyTime: 0,
          weeklyStudyTime: 0,
          monthlyStudyTime: 0,
          totalStudyTime: 0,
          currentStreak: 0,
          longestStreak: 0,
          completedQuizzes: 0,
          averageScore: 0,
          studyGroups: user.studyGroups?.length || 0,
          achievements: 0,
          recentActivity: [],
          upcomingTasks: []
        }
      });
    }

    // Calculate today's study time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = progress.studySessions.filter(
      session => session.startTime >= today
    );
    const todayStudyTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate weekly study time (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklySessions = progress.studySessions.filter(
      session => session.startTime >= weekAgo
    );
    const weeklyStudyTime = weeklySessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate monthly study time (last 30 days)
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlySessions = progress.studySessions.filter(
      session => session.startTime >= monthAgo
    );
    const monthlyStudyTime = monthlySessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate current streak
    const calculateStreak = () => {
      if (progress.studySessions.length === 0) return 0;
      
      const sortedSessions = progress.studySessions
        .map(s => new Date(s.startTime).setHours(0, 0, 0, 0))
        .filter((v, i, a) => a.indexOf(v) === i) // unique dates
        .sort((a, b) => b - a);
      
      if (sortedSessions.length === 0) return 0;
      
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(Date.now() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
      
      // Must have studied today or yesterday to have an active streak
      if (sortedSessions[0] !== todayStart && sortedSessions[0] !== yesterdayStart) {
        return 0;
      }
      
      let streak = 0;
      let currentDay = todayStart;
      
      for (const sessionDate of sortedSessions) {
        if (sessionDate === currentDay) {
          streak++;
          currentDay -= 24 * 60 * 60 * 1000; // go back one day
        } else if (sessionDate < currentDay) {
          break; // gap in streak
        }
      }
      
      return streak;
    };

    const currentStreak = calculateStreak();

    // Calculate longest streak
    const calculateLongestStreak = () => {
      if (progress.studySessions.length === 0) return 0;
      
      const uniqueDates = progress.studySessions
        .map(s => new Date(s.startTime).setHours(0, 0, 0, 0))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => a - b);
      
      let maxStreak = 1;
      let currentStreak = 1;
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const dayDiff = (uniqueDates[i] - uniqueDates[i - 1]) / (24 * 60 * 60 * 1000);
        if (dayDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      
      return maxStreak;
    };

    const longestStreak = calculateLongestStreak();

    // Get recent activity
    const recentActivity = [];
    
    // Add recent assessments
    const recentAssessments = progress.assessmentResults
      .slice(-5)
      .reverse()
      .map(result => ({
        id: result._id,
        type: 'quiz',
        title: result.quiz?.title || 'Quiz',
        score: Math.round(result.score),
        time: getTimeAgo(result.createdAt || new Date())
      }));
    recentActivity.push(...recentAssessments);

    // Add recent study sessions
    const recentSessions = progress.studySessions
      .slice(-3)
      .reverse()
      .map(session => ({
        id: session._id,
        type: 'study',
        title: `${session.subject} Study Session`,
        duration: session.duration,
        time: getTimeAgo(session.startTime)
      }));
    recentActivity.push(...recentSessions);

    // Get upcoming tasks from goals
    const upcomingTasks = progress.goals
      .filter(goal => goal.status === 'active')
      .slice(0, 4)
      .map(goal => ({
        id: goal._id,
        title: goal.title,
        due: goal.deadline ? formatDeadline(goal.deadline) : 'No deadline',
        priority: goal.priority
      }));

    res.json({
      success: true,
      data: {
        todayStudyTime,
        weeklyStudyTime,
        monthlyStudyTime,
        totalStudyTime: progress.totalStudyTime,
        currentStreak,
        longestStreak,
        completedQuizzes: progress.assessmentResults?.length || 0,
        averageScore: Math.round(progress.overallAverage || 0),
        studyGroups: user.studyGroups?.length || 0,
        achievements: progress.achievements?.length || 0,
        recentActivity: recentActivity.slice(0, 5),
        upcomingTasks
      }
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress statistics'
    });
  }
};

// @desc    Add study session
// @route   POST /api/progress/sessions
// @access  Private
export const addStudySession = async (req, res) => {
  try {
    const { subject, topic, duration, activityType, notes, mood, focusLevel } = req.body;

    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }

    const sessionData = {
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60000),
      duration: parseInt(duration) || 0,
      subject,
      topic,
      activityType: activityType || 'study',
      notes,
      mood,
      focusLevel: parseInt(focusLevel) || 5
    };

    await progress.addStudySession(sessionData);

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'statistics.totalStudyTime': parseInt(duration) || 0 },
      'statistics.lastStudyDate': new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Study session added successfully',
      data: progress
    });
  } catch (error) {
    console.error('Add study session error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add study session'
    });
  }
};

// @desc    Add or update goal
// @route   POST /api/progress/goals
// @access  Private
export const addGoal = async (req, res) => {
  try {
    const { title, description, type, category, target, deadline, subject, priority } = req.body;

    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }

    const goalData = {
      title,
      description,
      type,
      category,
      target,
      deadline: deadline ? new Date(deadline) : undefined,
      subject,
      priority: priority || 'medium',
      status: 'active'
    };

    await progress.addGoal(goalData);

    res.status(201).json({
      success: true,
      message: 'Goal added successfully',
      data: progress.goals[progress.goals.length - 1]
    });
  } catch (error) {
    console.error('Add goal error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add goal'
    });
  }
};

// @desc    Update goal progress
// @route   PUT /api/progress/goals/:goalId
// @access  Private
export const updateGoalProgress = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { progress: progressValue } = req.body;

    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    await progress.updateGoalProgress(goalId, progressValue);

    res.json({
      success: true,
      message: 'Goal progress updated',
      data: progress
    });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update goal progress'
    });
  }
};

// @desc    Get learning insights
// @route   GET /api/progress/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      return res.json({
        success: true,
        data: { insights: [] }
      });
    }

    const insights = progress.generateInsights();

    res.json({
      success: true,
      data: { insights }
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights'
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/progress/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      return res.json({
        success: true,
        data: {
          studyPatterns: {},
          performancePatterns: {},
          skillLevels: []
        }
      });
    }

    res.json({
      success: true,
      data: {
        studyPatterns: progress.analytics?.studyPatterns || {},
        performancePatterns: progress.analytics?.performancePatterns || {},
        skillLevels: progress.skillLevels || [],
        effectiveness: progress.analytics?.effectiveness || {}
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

// Helper functions
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

function formatDeadline(date) {
  const deadline = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const deadlineStr = deadline.toDateString();
  const todayStr = today.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  
  if (deadlineStr === todayStr) return 'Today';
  if (deadlineStr === tomorrowStr) return 'Tomorrow';
  
  const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  if (daysUntil > 0 && daysUntil <= 7) return `In ${daysUntil} days`;
  if (daysUntil > 7) return deadline.toLocaleDateString();
  
  return 'Overdue';
}
