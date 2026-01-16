import { Task } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface AnalyticsDashboardProps {
  tasks: Task[];
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export function AnalyticsDashboard({ tasks, currentStreak, longestStreak, totalCompleted }: AnalyticsDashboardProps) {
  // Calculate weekly progress
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const completed = dayTasks.filter(t => t.completed).length;
    
    weeklyData.push({
      date: format(date, 'EEE'),
      completed,
      total: dayTasks.length,
      rate: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0,
    });
  }

  // Category breakdown
  const categoryMap = new Map<string, number>();
  tasks.forEach(task => {
    if (task.category && task.completed) {
      categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
    }
  });

  const categoryData = Array.from(categoryMap.entries()).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
  }));

  // Priority breakdown
  const priorityMap = new Map<string, { completed: number; total: number }>();
  tasks.forEach(task => {
    const current = priorityMap.get(task.priority) || { completed: 0, total: 0 };
    current.total++;
    if (task.completed) current.completed++;
    priorityMap.set(task.priority, current);
  });

  const priorityData = Array.from(priorityMap.entries()).map(([priority, data]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    completed: data.completed,
    pending: data.total - data.completed,
    rate: Math.round((data.completed / data.total) * 100),
  }));

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  const avgTasksPerDay = tasks.length > 0
    ? Math.round(tasks.length / 7)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{currentStreak} days</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Keep it going! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completionRate}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Completed</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalCompleted}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Longest Streak</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{longestStreak} days</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Personal best
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Task completion over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
              <CardDescription>Distribution of completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Priority Breakdown */}
        {priorityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Completion status across priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="#ef4444" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completion Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Completion Rate</CardTitle>
          <CardDescription>Percentage of tasks completed each day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#f59e0b" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
