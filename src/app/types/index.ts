// Core Types
export interface User {
  id: string;
  displayName: string;
  email: string;
  startDate: string;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  badges: Badge[];
  privacySettings: PrivacySettings;
  theme: 'light' | 'dark';
  compactMode: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  completedAt?: string;
  isFocus: boolean;
  routineId?: string;
  estimatedTime?: number; // in minutes
  category?: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
  tasks: RoutineTask[];
  active: boolean;
  createdAt: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number;
  category?: string;
}

export interface Completion {
  id: string;
  taskId: string;
  userId: string;
  completedAt: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  requirement: string;
}

export interface AnalyticsData {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  averageTasksPerDay: number;
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  weeklyProgress: { date: string; completed: number; total: number }[];
  monthlyProgress: { month: string; completed: number; total: number }[];
  timeEstimates: { estimated: number; actual: number }[];
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showStats: boolean;
  showBadges: boolean;
  allowAI: boolean;
  allowDataSharing: boolean;
}

export interface Friend {
  id: string;
  userId: string;
  displayName: string;
  currentStreak: number;
  badges: Badge[];
  sharedTasks: number;
}

export interface Reminder {
  id: string;
  userId: string;
  taskId?: string;
  type: 'daily' | 'focus' | 'summary';
  time: string;
  enabled: boolean;
  message?: string;
}

export interface AISuggestion {
  id: string;
  userId: string;
  type: 'habit' | 'priority' | 'routine' | 'optimization';
  title: string;
  description: string;
  actionable: boolean;
  createdAt: string;
  applied: boolean;
}
