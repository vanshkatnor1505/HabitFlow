import { useState, useEffect } from 'react';
import { Task, Routine, User, AISuggestion } from './types';
import { DailyView } from './components/DailyView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RoutinesView } from './components/RoutinesView';
import { ProfileView } from './components/ProfileView';
import { SocialView } from './components/SocialView';
import { AIInsights } from './components/AIInsights';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import { Toaster, toast } from 'sonner';
import { 
  Calendar, 
  BarChart3, 
  ListChecks, 
  User as UserIcon, 
  Users, 
  Lightbulb,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import {
  getUser,
  saveUser,
  getTasks,
  saveTask,
  saveTasks,
  deleteTask,
  getRoutines,
  saveRoutine,
  deleteRoutine,
  calculateStreak,
  initializeStorage,
  generateTasksFromRoutines,
} from './lib/storage';
import { mockFriends, mockAISuggestions } from './lib/mockData';
import { checkAndAwardBadges } from './lib/badgeSystem';
import { 
  scheduleDailyStreakReminder, 
  sendStreakMilestoneNotification,
  setupNotificationListeners,
  showWebNotification 
} from './lib/notifications';
import { useTheme } from 'next-themes';
import { cn } from './components/ui/utils';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>(mockAISuggestions);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize storage and load data
  useEffect(() => {
    initializeStorage();
    loadUserData();
    loadRoutines();
    loadAllTasks();
    setupNotificationListeners();
  }, []);

  // Load tasks for selected date
  useEffect(() => {
    if (user) {
      loadTasksForDate(selectedDate);
    }
  }, [selectedDate, user, routines]); // Added routines as dependency

  const loadUserData = () => {
    const userData = getUser();
    setUser(userData);
  };

  const loadTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let dateTasks = getTasks(dateStr);
    
    // Generate tasks from active routines if needed
    const routineTasks = generateTasksFromRoutines(date, routines);
    
    // Merge routine tasks with manual tasks, avoiding duplicates
    const manualTasks = dateTasks.filter(t => !t.routineId);
    const existingRoutineTaskIds = new Set(dateTasks.filter(t => t.routineId).map(t => t.id));
    const newRoutineTasks = routineTasks.filter(t => !existingRoutineTaskIds.has(t.id));
    
    const allTasks = [...manualTasks, ...dateTasks.filter(t => t.routineId), ...newRoutineTasks];
    
    // Save the merged tasks
    if (newRoutineTasks.length > 0) {
      saveTasks(allTasks);
    }
    
    setTasks(allTasks);
  };

  const loadRoutines = () => {
    const routinesData = getRoutines();
    setRoutines(routinesData);
  };

  const loadAllTasks = () => {
    const allTasksData = getTasks();
    setAllTasks(allTasksData);
  };

  const handleToggleComplete = (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
    };
    
    saveTask(updatedTask);
    loadTasksForDate(selectedDate);
    loadAllTasks();
    
    // Update user stats
    if (updatedTask.completed && user) {
      const allTasksUpdated = getTasks();
      const streak = calculateStreak(allTasksUpdated);
      const totalCompleted = allTasksUpdated.filter(t => t.completed).length;
      
      const updatedUser = {
        ...user,
        currentStreak: streak.current,
        longestStreak: Math.max(user.longestStreak, streak.longest),
        totalTasksCompleted: totalCompleted,
      };
      
      // Check and award badges
      const badgeResult = checkAndAwardBadges(updatedUser, allTasksUpdated, updatedTask);
      
      // Add new badges to user
      if (badgeResult.newBadges.length > 0) {
        updatedUser.badges = [...updatedUser.badges, ...badgeResult.newBadges];
        
        // Show badge notifications
        badgeResult.messages.forEach((message, index) => {
          setTimeout(() => {
            toast.success(message, {
              duration: 5000,
            });
            // Web notification fallback
            showWebNotification('New Badge Unlocked!', message);
          }, index * 500);
        });
      }
      
      setUser(updatedUser);
      saveUser(updatedUser);
      
      toast.success('Task completed! 🎉', {
        description: `You're on a ${streak.current}-day streak!`,
      });

      // Schedule daily streak reminder (Capacitor only)
      scheduleDailyStreakReminder(updatedUser);

      // Send streak milestone notification (Capacitor only)
      sendStreakMilestoneNotification(streak.current);
    }
  };

  const handleToggleFocus = (task: Task) => {
    const updatedTask = {
      ...task,
      isFocus: !task.isFocus,
    };
    
    saveTask(updatedTask);
    loadTasksForDate(selectedDate);
    
    toast.success(
      updatedTask.isFocus ? 'Added to focus tasks ⭐' : 'Removed from focus tasks',
    );
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    loadTasksForDate(selectedDate);
    loadAllTasks();
    toast.success('Task deleted');
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId: user?.id || 'user-1',
      title,
      date: format(selectedDate, 'yyyy-MM-dd'),
      completed: false,
      isFocus: false,
      priority: 'medium',
      estimatedTime: 30,
    };
    
    saveTask(newTask);
    loadTasksForDate(selectedDate);
    loadAllTasks();
    toast.success('Task added!');
  };

  const handleSaveRoutine = (routine: Routine) => {
    saveRoutine(routine);
    loadRoutines();
    // Reload tasks to include new routine tasks
    loadTasksForDate(selectedDate);
    toast.success('Routine saved successfully!');
  };

  const handleDeleteRoutine = (routineId: string) => {
    deleteRoutine(routineId);
    loadRoutines();
    // Reload tasks to remove deleted routine tasks
    loadTasksForDate(selectedDate);
    toast.success('Routine deleted successfully!');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
    toast.success('Profile updated!');
  };

  const handleApplySuggestion = (suggestionId: string) => {
    setAiSuggestions(prev =>
      prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
    );
    toast.success('Suggestion applied! ✨');
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    toast.info('Suggestion dismissed');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { value: 'today', label: 'Today', icon: Calendar },
    { value: 'analytics', label: 'Analytics', icon: BarChart3 },
    { value: 'routines', label: 'Routines', icon: ListChecks },
    { value: 'ai', label: 'AI Insights', icon: Lightbulb },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <h1 className="text-xl">HabitFlow</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Build better habits, one day at a time
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:inline-flex">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Navigation */}
          <div
            className={cn(
              'md:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 border-b shadow-lg z-40 transition-transform',
              mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            )}
          >
            <div className="p-4 space-y-2">
              {tabs.map(tab => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setActiveTab(tab.value);
                    setMobileMenuOpen(false);
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile Tab Indicator */}
          <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              {tabs.find(t => t.value === activeTab)?.icon && (
                <>
                  {(() => {
                    const Icon = tabs.find(t => t.value === activeTab)!.icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </>
              )}
              <span>{tabs.find(t => t.value === activeTab)?.label}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              Switch View
            </Button>
          </div>

          <TabsContent value="today">
            <DailyView
              tasks={tasks}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onToggleComplete={handleToggleComplete}
              onToggleFocus={handleToggleFocus}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard
              tasks={allTasks}
              currentStreak={user.currentStreak}
              longestStreak={user.longestStreak}
              totalCompleted={user.totalTasksCompleted}
            />
          </TabsContent>

          <TabsContent value="routines">
            <RoutinesView
              routines={routines}
              onSaveRoutine={handleSaveRoutine}
              onDeleteRoutine={handleDeleteRoutine}
            />
          </TabsContent>

          <TabsContent value="ai">
            <AIInsights
              suggestions={aiSuggestions}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={handleDismissSuggestion}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialView
              friends={mockFriends}
              currentUserStreak={user.currentStreak}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileView user={user} onUpdateUser={handleUpdateUser} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © HabitFlow. Building better habits together.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Privacy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Terms
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AppContent />
    </ThemeProvider>
  );
}