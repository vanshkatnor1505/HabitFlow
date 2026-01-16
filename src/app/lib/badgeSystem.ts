import { User, Task, Badge } from '../types';
import { availableBadges } from './mockData';

interface BadgeCheckResult {
  newBadges: Badge[];
  messages: string[];
}

// Check and award new badges based on user stats
export const checkAndAwardBadges = (
  user: User,
  allTasks: Task[],
  justCompletedTask?: Task
): BadgeCheckResult => {
  const newBadges: Badge[] = [];
  const messages: string[] = [];
  const unlockedBadgeNames = new Set(user.badges.map(b => b.name));

  const completedTasks = allTasks.filter(t => t.completed);
  const totalCompleted = completedTasks.length;
  const currentStreak = user.currentStreak;

  // Count specific task types
  const focusTasksCompleted = completedTasks.filter(t => t.isFocus).length;
  const routineTasksCompleted = completedTasks.filter(t => t.routineId).length;
  
  // Count time-based completions
  const earlyCompletions = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const hour = new Date(t.completedAt).getHours();
    return hour < 9;
  }).length;

  const lateCompletions = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const hour = new Date(t.completedAt).getHours();
    return hour >= 22;
  }).length;

  // Count routines created
  const routinesCreated = user.badges.filter(b => b.name.includes('Routine')).length;

  // Check each available badge
  availableBadges.forEach(badgeTemplate => {
    // Skip if already unlocked
    if (unlockedBadgeNames.has(badgeTemplate.name)) return;

    let shouldUnlock = false;

    // Task completion badges
    if (badgeTemplate.name === 'Getting Started' && totalCompleted >= 1) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'First Steps' && totalCompleted >= 5) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Task Master Beginner' && totalCompleted >= 10) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Half Century' && totalCompleted >= 50) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Centurion' && totalCompleted >= 100) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Task Legend' && totalCompleted >= 250) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Task Titan' && totalCompleted >= 500) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Task Olympian' && totalCompleted >= 1000) {
      shouldUnlock = true;
    }

    // Streak badges
    else if (badgeTemplate.name === 'Week Warrior' && currentStreak >= 7) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Two Week Champion' && currentStreak >= 14) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Consistency Champion' && currentStreak >= 30) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Dedication Master' && currentStreak >= 60) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Habit Master' && currentStreak >= 100) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Unstoppable Force' && currentStreak >= 200) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Legendary Achiever' && currentStreak >= 365) {
      shouldUnlock = true;
    }

    // Focus badges
    else if (badgeTemplate.name === 'Focus Novice' && focusTasksCompleted >= 10) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Focus Expert' && focusTasksCompleted >= 50) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Focus Master' && focusTasksCompleted >= 100) {
      shouldUnlock = true;
    }

    // Time-based badges
    else if (badgeTemplate.name === 'Early Bird' && earlyCompletions >= 25) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Morning Champion' && earlyCompletions >= 50) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Night Owl' && lateCompletions >= 25) {
      shouldUnlock = true;
    } else if (badgeTemplate.name === 'Midnight Warrior' && lateCompletions >= 50) {
      shouldUnlock = true;
    }

    // Routine badges
    else if (badgeTemplate.name === 'Routine Master' && routineTasksCompleted >= 100) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const newBadge: Badge = {
        ...badgeTemplate,
        id: `badge-${Date.now()}-${Math.random()}`,
        unlockedAt: new Date().toISOString(),
      };
      newBadges.push(newBadge);
      messages.push(`🎉 Badge Unlocked: ${badgeTemplate.icon} ${badgeTemplate.name}!`);
    }
  });

  return { newBadges, messages };
};

// Get rarity color for badge display
export const getBadgeRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    case 'rare':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'epic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case 'legendary':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};
