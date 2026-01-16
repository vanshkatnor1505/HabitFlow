// Capacitor Notifications for Streak Reminders
// This file handles local notifications for streak maintenance

import { User } from '../types';

// Type definitions for Capacitor (will work when Capacitor is installed)
interface LocalNotification {
  title: string;
  body: string;
  id: number;
  schedule?: {
    at: Date;
    repeats?: boolean;
    every?: 'day' | 'week' | 'month' | 'year';
  };
  sound?: string;
  attachments?: Array<{ id: string; url: string }>;
  actionTypeId?: string;
  extra?: any;
}

// Check if running in Capacitor environment
const isCapacitor = (): boolean => {
  return !!(window as any).Capacitor;
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!isCapacitor()) {
    console.log('Not running in Capacitor environment');
    return false;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule daily streak reminder notification
export const scheduleDailyStreakReminder = async (user: User, time: { hour: number; minute: number } = { hour: 7, minute: 30 }): Promise<void> => {
  if (!isCapacitor()) {
    console.log('Notifications only work in Capacitor environment');
    return;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;

    // Cancel existing notifications
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    // Calculate next notification time
    const now = new Date();
    const notificationTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      time.hour,
      time.minute,
      0
    );

    // If time has passed today, schedule for tomorrow
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const notification: LocalNotification = {
      title: `🔥 Keep Your ${user.currentStreak}-Day Streak Going!`,
      body: `Don't break your streak, ${user.displayName}! Complete today's tasks to maintain your momentum.`,
      id: 1,
      schedule: {
        at: notificationTime,
        repeats: true,
        every: 'day',
      },
      sound: 'default',
      extra: {
        type: 'streak_reminder',
        userId: user.id,
      },
    };

    await LocalNotifications.schedule({
      notifications: [notification],
    });

    console.log('Daily streak reminder scheduled');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Send immediate streak milestone notification
export const sendStreakMilestoneNotification = async (streak: number): Promise<void> => {
  if (!isCapacitor()) {
    console.log('Notifications only work in Capacitor environment');
    return;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;

    const milestones = [7, 14, 30, 60, 100, 200, 365];
    if (!milestones.includes(streak)) return;

    let message = '';
    let emoji = '🔥';

    if (streak === 7) {
      message = 'One week streak! You\'re building momentum!';
      emoji = '🔥';
    } else if (streak === 14) {
      message = 'Two weeks strong! Keep it up!';
      emoji = '💫';
    } else if (streak === 30) {
      message = 'One month streak! Amazing consistency!';
      emoji = '💪';
    } else if (streak === 60) {
      message = 'Two months! You\'re on fire!';
      emoji = '⚡';
    } else if (streak === 100) {
      message = '100 days! You\'re a habit master!';
      emoji = '👑';
    } else if (streak === 200) {
      message = '200 days! Unstoppable force!';
      emoji = '🌟';
    } else if (streak === 365) {
      message = 'One year streak! LEGENDARY achievement!';
      emoji = '🏆';
    }

    const notification: LocalNotification = {
      title: `${emoji} ${streak}-Day Streak Milestone!`,
      body: message,
      id: Date.now(),
      sound: 'default',
      extra: {
        type: 'streak_milestone',
        streak,
      },
    };

    await LocalNotifications.schedule({
      notifications: [notification],
    });
  } catch (error) {
    console.error('Error sending milestone notification:', error);
  }
};

// Send streak broken warning (when user is about to lose streak)
export const sendStreakWarningNotification = async (user: User): Promise<void> => {
  if (!isCapacitor()) {
    console.log('Notifications only work in Capacitor environment');
    return;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;

    const notification: LocalNotification = {
      title: '⚠️ Streak in Danger!',
      body: `Your ${user.currentStreak}-day streak is about to end! Complete a task before midnight to keep it alive.`,
      id: Date.now(),
      sound: 'default',
      extra: {
        type: 'streak_warning',
        userId: user.id,
      },
    };

    await LocalNotifications.schedule({
      notifications: [notification],
    });
  } catch (error) {
    console.error('Error sending warning notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  if (!isCapacitor()) {
    console.log('Notifications only work in Capacitor environment');
    return;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;
    await LocalNotifications.cancel({ notifications: [] });
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Setup notification listeners
export const setupNotificationListeners = (onNotificationReceived?: (notification: any) => void): void => {
  if (!isCapacitor()) {
    console.log('Notifications only work in Capacitor environment');
    return;
  }

  try {
    const { LocalNotifications } = (window as any).Capacitor.Plugins;

    LocalNotifications.addListener('localNotificationReceived', (notification: any) => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification: any) => {
      console.log('Notification action performed:', notification);
      // Handle notification tap/action here
      // You can navigate to specific screens based on notification.extra.type
    });
  } catch (error) {
    console.error('Error setting up notification listeners:', error);
  }
};

// Helper: Check if user needs streak warning (no tasks completed today)
export const shouldSendStreakWarning = (user: User, todaysTasks: any[]): boolean => {
  if (user.currentStreak === 0) return false;

  const now = new Date();
  const currentHour = now.getHours();

  // Send warning if it's after 8 PM and no tasks completed
  if (currentHour >= 20) {
    const completedToday = todaysTasks.some(t => t.completed);
    return !completedToday;
  }

  return false;
};

// Web fallback: Show browser notification (for testing in web browser)
export const showWebNotification = (title: string, body: string): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icon.png' });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body, icon: '/icon.png' });
      }
    });
  }
};
