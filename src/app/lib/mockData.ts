import { User, Task, Routine, Badge, Friend, AISuggestion } from '../types';

// Badge definitions with requirements
export const availableBadges: Omit<Badge, 'id' | 'unlockedAt'>[] = [
  // Beginner Badges (Common)
  {
    name: 'Getting Started',
    description: 'Complete your first task',
    icon: '🌱',
    rarity: 'common',
    requirement: '1 task completed',
  },
  {
    name: 'First Steps',
    description: 'Complete 5 tasks',
    icon: '👣',
    rarity: 'common',
    requirement: '5 tasks completed',
  },
  {
    name: 'Task Master Beginner',
    description: 'Complete 10 tasks',
    icon: '📝',
    rarity: 'common',
    requirement: '10 tasks completed',
  },
  {
    name: 'Routine Builder',
    description: 'Create your first routine',
    icon: '📋',
    rarity: 'common',
    requirement: '1 routine created',
  },
  
  // Streak Badges (Common to Legendary)
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'common',
    requirement: '7-day streak',
  },
  {
    name: 'Two Week Champion',
    description: 'Maintain a 14-day streak',
    icon: '💫',
    rarity: 'common',
    requirement: '14-day streak',
  },
  {
    name: 'Consistency Champion',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    rarity: 'rare',
    requirement: '30-day streak',
  },
  {
    name: 'Dedication Master',
    description: 'Maintain a 60-day streak',
    icon: '⚡',
    rarity: 'rare',
    requirement: '60-day streak',
  },
  {
    name: 'Habit Master',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    rarity: 'epic',
    requirement: '100-day streak',
  },
  {
    name: 'Unstoppable Force',
    description: 'Maintain a 200-day streak',
    icon: '🌟',
    rarity: 'epic',
    requirement: '200-day streak',
  },
  {
    name: 'Legendary Achiever',
    description: 'Maintain a 365-day streak',
    icon: '🏆',
    rarity: 'legendary',
    requirement: '365-day streak',
  },
  
  // Completion Badges (Rare)
  {
    name: 'Half Century',
    description: 'Complete 50 total tasks',
    icon: '🎯',
    rarity: 'rare',
    requirement: '50 tasks completed',
  },
  {
    name: 'Centurion',
    description: 'Complete 100 total tasks',
    icon: '💯',
    rarity: 'rare',
    requirement: '100 tasks completed',
  },
  {
    name: 'Task Legend',
    description: 'Complete 250 total tasks',
    icon: '🎖️',
    rarity: 'epic',
    requirement: '250 tasks completed',
  },
  {
    name: 'Task Titan',
    description: 'Complete 500 total tasks',
    icon: '🏅',
    rarity: 'epic',
    requirement: '500 tasks completed',
  },
  {
    name: 'Task Olympian',
    description: 'Complete 1000 total tasks',
    icon: '🥇',
    rarity: 'legendary',
    requirement: '1000 tasks completed',
  },
  
  // Time-based Badges (Rare)
  {
    name: 'Early Bird',
    description: 'Complete 25 tasks before 9 AM',
    icon: '🌅',
    rarity: 'rare',
    requirement: '25 early completions',
  },
  {
    name: 'Morning Champion',
    description: 'Complete 50 tasks before 9 AM',
    icon: '☀️',
    rarity: 'epic',
    requirement: '50 early completions',
  },
  {
    name: 'Night Owl',
    description: 'Complete 25 tasks after 10 PM',
    icon: '🦉',
    rarity: 'rare',
    requirement: '25 late completions',
  },
  {
    name: 'Midnight Warrior',
    description: 'Complete 50 tasks after 10 PM',
    icon: '🌙',
    rarity: 'epic',
    requirement: '50 late completions',
  },
  
  // Focus Badges (Rare)
  {
    name: 'Focus Novice',
    description: 'Complete 10 focus tasks',
    icon: '🎯',
    rarity: 'common',
    requirement: '10 focus tasks completed',
  },
  {
    name: 'Focus Expert',
    description: 'Complete 50 focus tasks',
    icon: '🔍',
    rarity: 'rare',
    requirement: '50 focus tasks completed',
  },
  {
    name: 'Focus Master',
    description: 'Complete 100 focus tasks',
    icon: '🎓',
    rarity: 'epic',
    requirement: '100 focus tasks completed',
  },
  
  // Routine Badges (Common to Epic)
  {
    name: 'Routine Starter',
    description: 'Create 3 routines',
    icon: '📊',
    rarity: 'common',
    requirement: '3 routines created',
  },
  {
    name: 'Routine Expert',
    description: 'Create and maintain 5 active routines',
    icon: '📈',
    rarity: 'rare',
    requirement: '5 active routines',
  },
  {
    name: 'Routine Master',
    description: 'Complete 100 routine tasks',
    icon: '🎪',
    rarity: 'epic',
    requirement: '100 routine tasks completed',
  },
  
  // Perfect Day Badges (Epic)
  {
    name: 'Perfect Day',
    description: 'Complete all tasks in a day',
    icon: '✨',
    rarity: 'rare',
    requirement: '1 perfect day',
  },
  {
    name: 'Perfect Week',
    description: 'Complete all tasks for 7 days straight',
    icon: '🌈',
    rarity: 'epic',
    requirement: '7 perfect days',
  },
  {
    name: 'Perfectionist',
    description: 'Complete all tasks for 30 days straight',
    icon: '💎',
    rarity: 'legendary',
    requirement: '30 perfect days',
  },
  
  // Social Badges (Common to Rare)
  {
    name: 'Social Butterfly',
    description: 'Add your first friend',
    icon: '🦋',
    rarity: 'common',
    requirement: '1 friend',
  },
  {
    name: 'Popular',
    description: 'Connect with 5 friends',
    icon: '👥',
    rarity: 'rare',
    requirement: '5 friends',
  },
  {
    name: 'Community Leader',
    description: 'Connect with 10 friends',
    icon: '🌍',
    rarity: 'epic',
    requirement: '10 friends',
  },
];

// Initial user - no badges, will be created on first login
export const initialUser: User = {
  id: 'user-vansh15',
  displayName: 'Vansh15',
  email: 'vanshkatnor1737@gmail.com',
  startDate: new Date().toISOString().split('T')[0], // Will be set to first login date
  currentStreak: 0,
  longestStreak: 0,
  totalTasksCompleted: 0,
  badges: [],
  privacySettings: {
    profileVisibility: 'friends',
    showStats: true,
    showBadges: true,
    allowAI: true,
    allowDataSharing: false,
  },
  theme: 'light',
  compactMode: false,
};

// No mock routines
export const mockRoutines: Routine[] = [];

// No mock tasks - user starts fresh
export const generateMockTasks = (date: string): Task[] => {
  return [];
};

// No mock friends
export const mockFriends: Friend[] = [];

// No AI suggestions initially
export const mockAISuggestions: AISuggestion[] = [];

// Generate historical data for analytics (empty for new user)
export const generateHistoricalData = (days: number) => {
  return [];
};
