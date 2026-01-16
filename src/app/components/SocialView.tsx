import { Friend } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Users, UserPlus, Flame, Award, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface SocialViewProps {
  friends: Friend[];
  currentUserStreak: number;
}

export function SocialView({ friends, currentUserStreak }: SocialViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddFriend = () => {
    if (!friendEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // TODO: Implement actual friend request logic with backend
    toast.success('Friend request sent!', {
      description: `An invitation has been sent to ${friendEmail}`,
    });
    
    setFriendEmail('');
    setIsAddDialogOpen(false);
  };

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFriends = [...filteredFriends].sort((a, b) => b.currentStreak - a.currentStreak);

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            Friends & Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect with friends and share your progress
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Friend</DialogTitle>
              <DialogDescription>
                Enter the email address of the friend you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleAddFriend}
              >
                Send Friend Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leaderboard Card */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            Streak Leaderboard
          </CardTitle>
          <CardDescription>
            See how your streak compares with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Current User */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg">🏆</span>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white">
                  You
                </div>
                <div>
                  <p className="font-medium">You (Current User)</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your current streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="h-4 w-4" />
                  <span className="text-lg">{currentUserStreak}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">days</p>
              </div>
            </div>

            {/* Friends */}
            {sortedFriends.slice(0, 5).map((friend, index) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors">
                <span className="text-gray-400 w-6 text-center">
                  {index + 2}
                </span>
                <Avatar>
                  <AvatarFallback>
                    {friend.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{friend.displayName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {friend.sharedTasks} shared task{friend.sharedTasks !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="h-4 w-4" />
                    <span className="text-lg">{friend.currentStreak}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">days</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Friends */}
      <div className="flex gap-2">
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Progress
        </Button>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFriends.map(friend => (
          <Card key={friend.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                    {friend.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{friend.displayName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-600" />
                    {friend.currentStreak} day streak
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shared Tasks</span>
                <span>{friend.sharedTasks}</span>
              </div>

              {friend.badges.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Badges ({friend.badges.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {friend.badges.slice(0, 4).map(badge => (
                      <div
                        key={badge.id}
                        className="text-xl"
                        title={`${badge.name} - ${badge.description}`}
                      >
                        {badge.icon}
                      </div>
                    ))}
                    {friend.badges.length > 4 && (
                      <div className="text-xs text-gray-500 flex items-center">
                        +{friend.badges.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full" size="sm">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFriends.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">No friends found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try a different search term'
                : 'Add friends to share progress and stay motivated!'
              }
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
