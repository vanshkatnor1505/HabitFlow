import { Task } from '../types';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Trash2, Clock, Tag } from 'lucide-react';
import { cn } from './ui/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onToggleFocus: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onToggleFocus, onDelete }: TaskItemProps) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <div className={cn(
      'group flex items-start gap-3 p-4 rounded-lg border transition-all',
      task.isFocus && 'border-amber-400 bg-amber-50 dark:bg-amber-950/20',
      task.completed && 'opacity-60',
      !task.isFocus && !task.completed && 'hover:bg-gray-50 dark:hover:bg-gray-900'
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task)}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className={cn(
            'flex-1',
            task.completed && 'line-through text-gray-500 dark:text-gray-400'
          )}>
            {task.title}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFocus(task)}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0',
              task.isFocus && 'opacity-100'
            )}
          >
            <Star className={cn(
              'h-4 w-4',
              task.isFocus && 'fill-amber-400 text-amber-400'
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {task.category && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {task.category}
            </Badge>
          )}
          
          {task.estimatedTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {task.estimatedTime}m
            </Badge>
          )}
          
          <Badge className={cn('text-xs', priorityColors[task.priority])}>
            {task.priority}
          </Badge>
          
          {task.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
