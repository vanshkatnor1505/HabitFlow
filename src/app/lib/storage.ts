import { User, Task, Routine, Reminder, AISuggestion } from '../types';
import { initialUser, mockRoutines, generateMockTasks } from './mockData';
import { format } from 'date-fns';

const STORAGE_KEYS = {
  USER: 'habitflow_user',
  TASKS: 'habitflow_tasks',
  ROUTINES: 'habitflow_routines',
  REMINDERS: 'habitflow_reminders',
  AI_SUGGESTIONS: 'habitflow_ai_suggestions',
};

// User
export const getUser = (): User => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : mockUser;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Tasks
export const getTasks = (date?: string): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  const allTasks: Task[] = stored ? JSON.parse(stored) : [];
  
  // If no tasks in storage, generate some mock data
  if (allTasks.length === 0 && date) {
    const mockTasks = generateMockTasks(date);
    saveTasks(mockTasks);
    return mockTasks;
  }
  
  if (date) {
    return allTasks.filter(task => task.date === date);
  }
  
  return allTasks;
};

export const saveTasks = (tasks: Task[]): void => {
  const allTasks = getTasks();
  
  // Remove old tasks for the same dates
  const datesToUpdate = new Set(tasks.map(t => t.date));
  const filteredTasks = allTasks.filter(t => !datesToUpdate.has(t.date));
  
  // Add new tasks
  const updatedTasks = [...filteredTasks, ...tasks];
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
};

export const saveTask = (task: Task): void => {
  const allTasks = getTasks();
  const index = allTasks.findIndex(t => t.id === task.id);
  
  if (index >= 0) {
    allTasks[index] = task;
  } else {
    allTasks.push(task);
  }
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
};

export const deleteTask = (taskId: string): void => {
  const allTasks = getTasks();
  const filtered = allTasks.filter(t => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
};

// Get all tasks across all dates
export const getAllTasks = (): Task[] => {
  const allTasksData = localStorage.getItem('habitflow_all_tasks');
  return allTasksData ? JSON.parse(allTasksData) : [];
};

// Generate tasks from active routines for a specific date
export const generateTasksFromRoutines = (date: Date, routines: Routine[]): Task[] => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const generatedTasks: Task[] = [];

  routines
    .filter(routine => routine.active)
    .forEach(routine => {
      let shouldGenerate = false;

      // Check if routine should run on this day
      if (routine.frequency === 'daily') {
        shouldGenerate = true;
      } else if (routine.frequency === 'weekly' && routine.daysOfWeek) {
        shouldGenerate = routine.daysOfWeek.includes(dayOfWeek);
      } else if (routine.frequency === 'weekdays') {
        shouldGenerate = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      } else if (routine.frequency === 'weekends') {
        shouldGenerate = dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday
      }

      if (shouldGenerate) {
        // Generate tasks for each routine task
        routine.tasks.forEach((routineTask, index) => {
          const task: Task = {
            id: `routine-${routine.id}-task-${routineTask.id}-${dateStr}`,
            userId: routine.userId,
            routineId: routine.id,
            title: routineTask.title,
            description: routineTask.description,
            date: dateStr,
            completed: false,
            isFocus: false,
            priority: 'medium',
            category: routineTask.category || 'Routine',
            tags: [`routine:${routine.name}`],
            estimatedTime: routineTask.estimatedTime,
            createdAt: new Date().toISOString(),
          };
          generatedTasks.push(task);
        });
      }
    });

  return generatedTasks;
};

export { format };

// Routines
export const getRoutines = (): Routine[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  return stored ? JSON.parse(stored) : mockRoutines;
};

export const saveRoutine = (routine: Routine): void => {
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === routine.id);
  
  if (index >= 0) {
    routines[index] = routine;
  } else {
    routines.push(routine);
  }
  
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
};

export const deleteRoutine = (routineId: string): void => {
  const routines = getRoutines();
  const filtered = routines.filter(r => r.id !== routineId);
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(filtered));
};

// Calculate streak from tasks
export const calculateStreak = (tasks: Task[]): { current: number; longest: number } => {
  const completedDates = new Set(
    tasks
      .filter(t => t.completed)
      .map(t => t.date)
  );
  
  const sortedDates = Array.from(completedDates).sort().reverse();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date(today);
  
  // Calculate current streak
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  // Calculate longest streak
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || isConsecutive(sortedDates[i], sortedDates[i - 1])) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
};

const isConsecutive = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff === 86400000; // 1 day in milliseconds
};

// Initialize storage with initial user if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    // Set the start date to today for new user
    const newUser = {
      ...initialUser,
      startDate: new Date().toISOString().split('T')[0],
    };
    saveUser(newUser);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ROUTINES)) {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(mockRoutines));
  }
  
  // Don't generate any tasks initially - user starts fresh
};