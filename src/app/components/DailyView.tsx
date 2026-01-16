import { useState } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DailyViewProps {
  tasks: Task[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onToggleComplete: (task: Task) => void;
  onToggleFocus: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (title: string) => void;
}

export function DailyView({
  tasks,
  selectedDate,
  onDateChange,
  onToggleComplete,
  onToggleFocus,
  onDeleteTask,
  onAddTask,
}: DailyViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const completedTasks = tasks.filter(t => t.completed);
  const incompleteTasks = tasks.filter(t => !t.completed);
  const focusTasks = tasks.filter(t => t.isFocus);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDateChange(subDays(selectedDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 text-sm md:text-base">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{format(selectedDate, 'MMMM d, yyyy')}</span>
                    <span className="sm:hidden">{format(selectedDate, 'MMM d, yyyy')}</span>
                    {isToday && <span className="text-xs text-amber-600 dark:text-amber-400">(Today)</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        onDateChange(date);
                        setShowCalendar(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDateChange(addDays(selectedDate, 1))}
                disabled={isToday}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {!isToday && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDateChange(new Date())}
                  className="hidden sm:inline-flex"
                >
                  Today
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="text-left md:text-right">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {completedTasks.length} of {tasks.length} completed
                </p>
                <p className="font-medium text-base md:text-lg">
                  {completionRate}%
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Focus Tasks */}
      {focusTasks.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">⭐</span>
              Focus Tasks
            </CardTitle>
            <CardDescription>
              Your priority tasks for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleFocus={onToggleFocus}
                onDelete={onDeleteTask}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Task */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            {incompleteTasks.length > 0 
              ? `${incompleteTasks.length} task${incompleteTasks.length !== 1 ? 's' : ''} remaining`
              : 'All tasks completed! 🎉'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks for this day. Add one to get started!
            </p>
          ) : (
            <>
              {incompleteTasks.map(task => (
                !task.isFocus && (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onToggleFocus={onToggleFocus}
                    onDelete={onDeleteTask}
                  />
                )
              ))}
              
              {completedTasks.length > 0 && (
                <>
                  <div className="pt-4 pb-2">
                    <h4 className="text-sm text-gray-600 dark:text-gray-400">
                      Completed ({completedTasks.length})
                    </h4>
                  </div>
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onToggleFocus={onToggleFocus}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}