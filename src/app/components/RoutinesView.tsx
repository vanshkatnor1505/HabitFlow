import { useState } from 'react';
import { Routine, RoutineTask } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Clock, List } from 'lucide-react';

interface RoutinesViewProps {
  routines: Routine[];
  onSaveRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
}

export function RoutinesView({ routines, onSaveRoutine, onDeleteRoutine }: RoutinesViewProps) {
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateRoutine = () => {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      userId: 'user-1',
      name: '',
      description: '',
      frequency: 'daily',
      tasks: [],
      active: true,
      createdAt: new Date().toISOString(),
    };
    setEditingRoutine(newRoutine);
    setIsDialogOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine({ ...routine });
    setIsDialogOpen(true);
  };

  const handleSaveRoutine = () => {
    if (editingRoutine && editingRoutine.name.trim() && editingRoutine.tasks.length > 0) {
      onSaveRoutine(editingRoutine);
      setIsDialogOpen(false);
      setEditingRoutine(null);
    }
  };

  const addTaskToRoutine = () => {
    if (editingRoutine) {
      const newTask: RoutineTask = {
        id: `rt-${Date.now()}`,
        title: '',
        estimatedTime: 15,
      };
      setEditingRoutine({
        ...editingRoutine,
        tasks: [...editingRoutine.tasks, newTask],
      });
    }
  };

  const updateRoutineTask = (index: number, updates: Partial<RoutineTask>) => {
    if (editingRoutine) {
      const newTasks = [...editingRoutine.tasks];
      newTasks[index] = { ...newTasks[index], ...updates };
      setEditingRoutine({ ...editingRoutine, tasks: newTasks });
    }
  };

  const removeRoutineTask = (index: number) => {
    if (editingRoutine) {
      const newTasks = editingRoutine.tasks.filter((_, i) => i !== index);
      setEditingRoutine({ ...editingRoutine, tasks: newTasks });
    }
  };

  const activeRoutines = routines.filter(r => r.active);
  const inactiveRoutines = routines.filter(r => !r.active);

  const getFrequencyLabel = (routine: Routine) => {
    if (routine.frequency === 'daily') return 'Daily';
    if (routine.frequency === 'weekly' && routine.daysOfWeek) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return routine.daysOfWeek.map(d => days[d]).join(', ');
    }
    return 'Custom';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Routines</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create repeatable task templates for consistent habits
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateRoutine}>
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoutine?.name ? 'Edit Routine' : 'Create New Routine'}</DialogTitle>
              <DialogDescription>
                Build a routine with multiple tasks that repeat on a schedule
              </DialogDescription>
            </DialogHeader>

            {editingRoutine && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="routine-name">Routine Name</Label>
                  <Input
                    id="routine-name"
                    placeholder="e.g., Morning Routine"
                    value={editingRoutine.name}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routine-description">Description (optional)</Label>
                  <Textarea
                    id="routine-description"
                    placeholder="What is this routine for?"
                    value={editingRoutine.description || ''}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routine-frequency">Frequency</Label>
                  <Select
                    value={editingRoutine.frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'custom') => 
                      setEditingRoutine({ ...editingRoutine, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tasks</Label>
                    <Button variant="outline" size="sm" onClick={addTaskToRoutine}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {editingRoutine.tasks.map((task, index) => (
                      <Card key={task.id}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Task title"
                              value={task.title}
                              onChange={(e) => updateRoutineTask(index, { title: e.target.value })}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRoutineTask(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>

                          <Input
                            placeholder="Description (optional)"
                            value={task.description || ''}
                            onChange={(e) => updateRoutineTask(index, { description: e.target.value })}
                          />

                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label className="text-xs">Estimated Time (minutes)</Label>
                              <Input
                                type="number"
                                min="1"
                                value={task.estimatedTime || ''}
                                onChange={(e) => updateRoutineTask(index, { estimatedTime: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Category</Label>
                              <Input
                                placeholder="e.g., wellness"
                                value={task.category || ''}
                                onChange={(e) => updateRoutineTask(index, { category: e.target.value })}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {editingRoutine.tasks.length === 0 && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No tasks yet. Add tasks to your routine.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingRoutine.active}
                      onCheckedChange={(checked) => setEditingRoutine({ ...editingRoutine, active: checked })}
                    />
                    <Label>Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveRoutine}
                      disabled={!editingRoutine.name.trim() || editingRoutine.tasks.length === 0}
                    >
                      Save Routine
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Routines */}
      <div className="space-y-4">
        <h3 className="text-lg">Active Routines</h3>
        {activeRoutines.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
              No active routines. Create one to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRoutines.map(routine => (
              <Card key={routine.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {routine.name}
                  </CardTitle>
                  <CardDescription>{routine.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {getFrequencyLabel(routine)}
                    </Badge>
                    <Badge variant="outline">
                      {routine.tasks.length} task{routine.tasks.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {routine.tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="flex-1 truncate">{task.title}</span>
                        {task.estimatedTime && (
                          <span className="text-gray-500 text-xs">{task.estimatedTime}m</span>
                        )}
                      </div>
                    ))}
                    {routine.tasks.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{routine.tasks.length - 3} more...
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditRoutine(routine)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteRoutine(routine.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Routines */}
      {inactiveRoutines.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg text-gray-600 dark:text-gray-400">Inactive Routines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveRoutines.map(routine => (
              <Card key={routine.id} className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {routine.name}
                  </CardTitle>
                  <CardDescription>{routine.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="secondary">Inactive</Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditRoutine(routine)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteRoutine(routine.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
