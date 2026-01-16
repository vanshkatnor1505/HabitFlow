import { User, Badge as BadgeType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trophy, Flame, Target, Calendar, Award, Settings } from 'lucide-react';
import { useState } from 'react';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function ProfileView({ user, onUpdateUser }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };

  const sortedBadges = [...user.badges].sort((a, b) => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-2xl sm:text-3xl flex-shrink-0">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl truncate">{user.displayName}</CardTitle>
                <CardDescription className="truncate">{user.email}</CardDescription>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Member since {new Date(user.startDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? 'ghost' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.currentStreak}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Longest Streak</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.longestStreak}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              personal best
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.totalTasksCompleted}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              tasks finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.badges.length}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              achievements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badge Collection
          </CardTitle>
          <CardDescription>
            Achievements earned through consistent habit building
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedBadges.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No badges yet. Complete tasks to earn achievements!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedBadges.map(badge => (
                <Card key={badge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">{badge.icon}</div>
                      <h4>{badge.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className={rarityColors[badge.rarity]}>
                          {badge.rarity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {new Date(badge.unlockedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile and privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={editedUser.displayName}
                  onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4>Privacy Settings</h4>

              <div className="space-y-2">
                <Label htmlFor="visibility">Profile Visibility</Label>
                <Select
                  value={editedUser.privacySettings.profileVisibility}
                  onValueChange={(value: 'public' | 'friends' | 'private') =>
                    setEditedUser({
                      ...editedUser,
                      privacySettings: { ...editedUser.privacySettings, profileVisibility: value }
                    })
                  }
                >
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private - Only me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Statistics</Label>
                  <p className="text-xs text-gray-500">
                    Allow others to see your streaks and completion rates
                  </p>
                </div>
                <Switch
                  checked={editedUser.privacySettings.showStats}
                  onCheckedChange={(checked) =>
                    setEditedUser({
                      ...editedUser,
                      privacySettings: { ...editedUser.privacySettings, showStats: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Badges</Label>
                  <p className="text-xs text-gray-500">
                    Display your earned badges on your profile
                  </p>
                </div>
                <Switch
                  checked={editedUser.privacySettings.showBadges}
                  onCheckedChange={(checked) =>
                    setEditedUser({
                      ...editedUser,
                      privacySettings: { ...editedUser.privacySettings, showBadges: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Suggestions</Label>
                  <p className="text-xs text-gray-500">
                    Allow AI to analyze your habits and provide recommendations
                  </p>
                </div>
                <Switch
                  checked={editedUser.privacySettings.allowAI}
                  onCheckedChange={(checked) =>
                    setEditedUser({
                      ...editedUser,
                      privacySettings: { ...editedUser.privacySettings, allowAI: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sharing</Label>
                  <p className="text-xs text-gray-500">
                    Share anonymized data for AI model improvements
                  </p>
                </div>
                <Switch
                  checked={editedUser.privacySettings.allowDataSharing}
                  onCheckedChange={(checked) =>
                    setEditedUser({
                      ...editedUser,
                      privacySettings: { ...editedUser.privacySettings, allowDataSharing: checked }
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4>Appearance</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-xs text-gray-500">
                    Reduce spacing for a more condensed view
                  </p>
                </div>
                <Switch
                  checked={editedUser.compactMode}
                  onCheckedChange={(checked) =>
                    setEditedUser({ ...editedUser, compactMode: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}