# HabitFlow - Daily Task & Habit Tracking Application

A comprehensive, production-ready to-do list and habit tracking application built with React, TypeScript, Tailwind CSS, and Supabase. HabitFlow helps users manage daily tasks, build consistent routines, track progress with analytics, and get AI-powered insights for habit improvement.

NOTE : this app is for my personal use and can contain default users but you can change and still use it. 

WEBSITE LINK : https://habitflowv.netlify.app/

WEBSITE APK : E-mail for apk on vanshkatnor1737@gmail.com

## 🌟 Features

### Core Features
- **Daily Task Management**: Create, complete, and manage tasks for any date
- **Focus Mode**: Mark priority tasks and track them separately
- **Date Navigation**: Navigate between dates with calendar picker
- **Task Categories & Tags**: Organize tasks by category, priority, and custom tags
- **Completion Tracking**: Track completion status and completion dates

### Routines & Habits
- **Routine Builder**: Create repeatable daily/weekly/custom routines
- **Template Tasks**: Define task templates within routines
- **Active/Inactive States**: Enable or disable routines as needed
- **Frequency Options**: Daily, weekly, or custom schedules

### Analytics Dashboard
- **Streak Tracking**: Current and longest streak visualization
- **Completion Rates**: Weekly and daily completion rate charts
- **Category Breakdown**: Pie chart showing task distribution by category
- **Priority Analysis**: Bar chart showing completion by priority level
- **Historical Data**: Line charts showing progress over time
- **Key Stats**: Total tasks completed, average tasks per day, and more

### Badge & Achievement System
- **Streak-Based Badges**: Unlock badges at 7, 30, 100, and 365-day streaks
- **Milestone Badges**: Achievements for task completion milestones
- **Rarity Tiers**: Common, Rare, Epic, and Legendary badges
- **Badge Display**: Showcase earned badges on your profile

### AI Insights
- **Habit Analysis**: AI suggestions based on completion patterns
- **Priority Recommendations**: Optimize task prioritization
- **Routine Optimization**: Suggestions for improving routines
- **Performance Tips**: Actionable insights to boost productivity
- **Privacy Controls**: Full control over AI data usage

### Social Features
- **Friend Connections**: Connect with friends and view their profiles
- **Streak Leaderboard**: Compare streaks with friends
- **Shared Progress**: View friends' public statistics
- **Badge Collections**: See friends' achievements
- **Collaborative Tasks**: Share tasks and track shared progress (demo)

### User Profile & Settings
- **Profile Statistics**: View your streaks, badges, and total completions
- **Privacy Controls**: Granular visibility settings (public, friends, private)
- **Theme Toggle**: Light and dark mode support
- **Compact Mode**: Optional condensed view
- **Data Consent**: Control over AI usage and data sharing

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Recharts**: Analytics and data visualization
- **date-fns**: Date manipulation
- **next-themes**: Theme management
- **sonner**: Toast notifications

### Data Persistence
- **Supabase**: Cloud-based database for data persistence
- **Mock Data**: Pre-populated sample data for demonstration
- **Auto-initialization**: Automatically sets up demo data on first load

### Components
```
/src/app/
├── components/
│   ├── TaskItem.tsx           # Individual task card
│   ├── DailyView.tsx          # Daily task list view
│   ├── AnalyticsDashboard.tsx # Charts and analytics
│   ├── RoutinesView.tsx       # Routine management
│   ├── ProfileView.tsx        # User profile and settings
│   ├── SocialView.tsx         # Friends and leaderboard
│   ├── AIInsights.tsx         # AI suggestions
│   └── ui/                    # Reusable UI components
├── types/
│   └── index.ts               # TypeScript type definitions
├── lib/
│   ├── mockData.ts            # Sample data and generators
│   └── storage.ts             # LocalStorage utilities
└── App.tsx                    # Main application component
```

## 📊 Data Models

### User
```typescript
{
  id: string
  displayName: string
  email: string
  startDate: string
  currentStreak: number
  longestStreak: number
  totalTasksCompleted: number
  badges: Badge[]
  privacySettings: PrivacySettings
  theme: 'light' | 'dark'
  compactMode: boolean
}
```

### Task
```typescript
{
  id: string
  userId: string
  title: string
  description?: string
  date: string
  completed: boolean
  completedAt?: string
  isFocus: boolean
  routineId?: string
  estimatedTime?: number
  category?: string
  tags?: string[]
  priority: 'low' | 'medium' | 'high'
}
```

### Routine
```typescript
{
  id: string
  userId: string
  name: string
  description?: string
  frequency: 'daily' | 'weekly' | 'custom'
  daysOfWeek?: number[]
  tasks: RoutineTask[]
  active: boolean
  createdAt: string
}
```

### Badge
```typescript
{
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: string
  requirement: string
}
```

## 🎯 User Stories

1. **As a user, I can create a daily task** so I can track my daily to-dos
2. **As a user, I can mark tasks as complete** so I can track my progress
3. **As a user, I can set focus tasks** so I can prioritize important work
4. **As a user, I can create routines** so I can automate recurring tasks
5. **As a user, I can view my analytics** so I can understand my habits
6. **As a user, I can earn badges** so I can celebrate milestones
7. **As a user, I can connect with friends** so I can share progress
8. **As a user, I can get AI suggestions** so I can improve my habits
9. **As a user, I can control my privacy** so I can manage who sees my data
10. **As a user, I can navigate between dates** so I can plan ahead or review history

## 🔒 Privacy & Data

### Privacy Settings
- **Profile Visibility**: Public, Friends Only, or Private
- **Show Statistics**: Control who can see your streaks and completion rates
- **Show Badges**: Control badge visibility on your profile
- **AI Suggestions**: Enable/disable AI analysis
- **Data Sharing**: Opt-in/out of anonymized data for AI improvements

### Data Storage
- All data is stored in a Supabase cloud database
- Data persists across sessions and devices
- Users can clear data by deleting their account

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (for backend features)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can get these values from your Supabase project settings at https://app.supabase.com

### Database Setup

1. Create a new project on Supabase
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration file located at `/supabase/migrations/20241222_initial_schema.sql`
4. The migration will create all necessary tables, indexes, and Row Level Security policies

### Build
```bash
# Build for production
npm run build
```

## 📦 Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!

### Other Hosting Options

The application is a static site after building and can be hosted on:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- GitHub Pages
- Any static hosting service

## 🔒 Security Considerations

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Supabase Row Level Security (RLS) is enabled on all tables
- All API calls are authenticated with Supabase Auth
- Password requirements: minimum 6 characters
- Email verification recommended for production

## 🎨 Customization

### Theme
- Toggle between light and dark modes using the theme button in the header
- Themes are defined in `/src/styles/theme.css`

### Mock Data
- Edit `/src/app/lib/mockData.ts` to customize sample data
- Includes pre-populated users, tasks, routines, badges, and AI suggestions

### Badge System
- Badge definitions in `mockData.ts > availableBadges`
- Add new badges by defining name, description, icon, rarity, and requirement

## 📱 Responsive Design

- **Desktop**: Full navigation with tabs, multi-column layouts
- **Tablet**: Responsive grid layouts, optimized spacing
- **Mobile**: Hamburger menu, single-column views, touch-optimized

## 🔮 Future Enhancements (Backend Integration)

When connected to a backend (e.g., Supabase):
- Real-time collaboration on shared tasks
- Push notifications and email reminders
- Cloud data sync across devices
- Advanced AI training on aggregated data
- Friend search and discovery
- Task sharing and permissions
- Export data to CSV/JSON
- RESTful API for third-party integrations

## 🤝 Contributing

This is a demonstration application. For production use:
1. Implement backend authentication
2. Add database persistence
3. Implement real-time updates
4. Add comprehensive error handling
5. Implement data export/import
6. Add e2e testing
7. Implement notification system

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with Figma Make
- UI components from Radix UI
- Icons from Lucide React
- Charts from Recharts
- Date utilities from date-fns

---

**Note**: This is a frontend-only demonstration. For production use with real user data, implement proper backend services, authentication, and data security measures.
