import { AISuggestion } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lightbulb, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface AIInsightsProps {
  suggestions: AISuggestion[];
  onApplySuggestion: (suggestionId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

export function AIInsights({ suggestions, onApplySuggestion, onDismissSuggestion }: AIInsightsProps) {
  const activeSuggestions = suggestions.filter(s => !s.applied);
  const appliedSuggestions = suggestions.filter(s => s.applied);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <Zap className="h-4 w-4" />;
      case 'priority':
        return <AlertCircle className="h-4 w-4" />;
      case 'routine':
        return <TrendingUp className="h-4 w-4" />;
      case 'optimization':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'habit':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'priority':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'routine':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'optimization':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl">AI Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized suggestions to improve your habits
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                Privacy & Data Usage
              </p>
              <p className="text-blue-800 dark:text-blue-400">
                AI suggestions are generated from your task completion patterns and habits. 
                Your data is anonymized and only used with your consent. 
                You can disable AI suggestions anytime in your profile settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg">New Suggestions</h3>
        {activeSuggestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h4 className="text-lg mb-2">All caught up!</h4>
              <p className="text-gray-600 dark:text-gray-400">
                No new suggestions at the moment. Keep building your habits!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeSuggestions.map(suggestion => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(suggestion.type)}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(suggestion.type)}
                            {suggestion.type}
                          </span>
                        </Badge>
                        {suggestion.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {suggestion.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Generated {new Date(suggestion.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismissSuggestion(suggestion.id)}
                      >
                        Dismiss
                      </Button>
                      {suggestion.actionable && (
                        <Button
                          size="sm"
                          onClick={() => onApplySuggestion(suggestion.id)}
                        >
                          Apply Suggestion
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Applied Suggestions */}
      {appliedSuggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg text-gray-600 dark:text-gray-400">Applied Suggestions</h3>
          <div className="space-y-3">
            {appliedSuggestions.map(suggestion => (
              <Card key={suggestion.id} className="opacity-75">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{suggestion.title}</p>
                        <Badge variant="outline" className="text-xs">
                          Applied
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips Card */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tips for Better Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Complete tasks consistently to help AI identify patterns</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Use categories and tags to get more specific recommendations</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Mark your focus tasks to help prioritize suggestions</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Track estimated time to get productivity optimization tips</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
