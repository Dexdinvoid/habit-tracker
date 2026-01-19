// ==========================================
// CONSISTENCY - MOCK DATA
// For MVP development without backend
// ==========================================

import {
    User,
    UserStats,
    HabitWithStats,
    FeedPost,
    Friend,
    Challenge,
    Achievement
} from './types';

// Mock User
export const mockUser: User = {
    id: 'user-1',
    email: 'player@consistency.gg',
    username: 'ConsistencyKing',
    displayName: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ConsistencyKing',
    bio: '🔥 Building habits, breaking limits. 47-day streak warrior.',
    theme: 'cyberpunk',
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date(),
};

// Mock User Stats
export const mockUserStats: UserStats = {
    totalPoints: 2847,
    currentStreak: 47,
    longestStreak: 47,
    habitsCompleted: 284,
    league: 'diamond',
    leagueRank: 2,
    weeklyPoints: 385,
    achievements: [
        { id: 'ach-1', name: 'First Step', description: 'Complete your first habit', icon: '👣', rarity: 'common', unlockedAt: new Date('2025-10-15') },
        { id: 'ach-2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚔️', rarity: 'common', unlockedAt: new Date('2025-10-22') },
        { id: 'ach-3', name: 'Streak Master', description: 'Reach a 30-day streak', icon: '🔥', rarity: 'rare', unlockedAt: new Date('2025-11-14') },
        { id: 'ach-4', name: 'Diamond Mind', description: 'Reach Diamond league', icon: '💎', rarity: 'epic', unlockedAt: new Date('2025-12-20') },
        { id: 'ach-5', name: 'Social Butterfly', description: 'Add 10 friends', icon: '🦋', rarity: 'common', unlockedAt: new Date('2025-11-01') },
    ],
};

// Mock Habits
export const mockHabits: HabitWithStats[] = [
    {
        id: 'habit-1',
        userId: 'user-1',
        name: 'Morning Workout',
        description: 'Complete a 30-minute workout session',
        icon: '💪',
        color: '#ff2a6d',
        frequency: 'daily',
        createdAt: new Date('2025-10-15'),
        currentStreak: 47,
        longestStreak: 47,
        totalCompletions: 89,
        completedToday: true,
        completions: [],
    },
    {
        id: 'habit-2',
        userId: 'user-1',
        name: 'Read 20 Pages',
        description: 'Read at least 20 pages of a book',
        icon: '📚',
        color: '#05d9e8',
        frequency: 'daily',
        createdAt: new Date('2025-10-20'),
        currentStreak: 23,
        longestStreak: 23,
        totalCompletions: 65,
        completedToday: false,
        completions: [],
    },
    {
        id: 'habit-3',
        userId: 'user-1',
        name: 'Meditate',
        description: '10 minutes of mindfulness meditation',
        icon: '🧘',
        color: '#d300c5',
        frequency: 'daily',
        createdAt: new Date('2025-11-01'),
        currentStreak: 15,
        longestStreak: 28,
        totalCompletions: 52,
        completedToday: false,
        completions: [],
    },
    {
        id: 'habit-4',
        userId: 'user-1',
        name: 'Learn Japanese',
        description: 'Complete one Duolingo lesson',
        icon: '🇯🇵',
        color: '#00ff88',
        frequency: 'daily',
        createdAt: new Date('2025-11-15'),
        currentStreak: 8,
        longestStreak: 15,
        totalCompletions: 38,
        completedToday: true,
        completions: [],
    },
    {
        id: 'habit-5',
        userId: 'user-1',
        name: 'Hydration',
        description: 'Drink 8 glasses of water',
        icon: '💧',
        color: '#05d9e8',
        frequency: 'daily',
        createdAt: new Date('2025-12-01'),
        currentStreak: 12,
        longestStreak: 12,
        totalCompletions: 40,
        completedToday: false,
        completions: [],
    },
];

// Mock Feed Posts
export const mockFeedPosts: FeedPost[] = [
    {
        id: 'post-1',
        userId: 'user-2',
        user: {
            username: 'FitnessFury',
            displayName: 'Sarah Kim',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessFury',
        },
        habitName: 'Morning Run',
        habitIcon: '🏃',
        proofImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        pointsEarned: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likes: 24,
        comments: 5,
        isLiked: false,
    },
    {
        id: 'post-2',
        userId: 'user-3',
        user: {
            username: 'CodeNinja',
            displayName: 'Mike Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja',
        },
        habitName: 'Code 1 Hour',
        habitIcon: '💻',
        proofImageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        pointsEarned: 10,
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        likes: 18,
        comments: 3,
        isLiked: true,
    },
    {
        id: 'post-3',
        userId: 'user-4',
        user: {
            username: 'ZenMaster',
            displayName: 'Emma Wilson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZenMaster',
        },
        habitName: 'Morning Meditation',
        habitIcon: '🧘',
        proofImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
        pointsEarned: 10,
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        likes: 42,
        comments: 8,
        isLiked: false,
    },
    {
        id: 'post-4',
        userId: 'user-5',
        user: {
            username: 'BookWorm',
            displayName: 'David Park',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BookWorm',
        },
        habitName: 'Read 30 Minutes',
        habitIcon: '📖',
        proofImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
        pointsEarned: 10,
        createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        likes: 15,
        comments: 2,
        isLiked: false,
    },
    {
        id: 'post-5',
        userId: 'user-6',
        user: {
            username: 'GymRat',
            displayName: 'Jake Torres',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GymRat',
        },
        habitName: 'Weight Training',
        habitIcon: '🏋️',
        proofImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
        pointsEarned: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        likes: 67,
        comments: 12,
        isLiked: true,
    },
];

// Mock Friends
export const mockFriends: Friend[] = [
    {
        id: 'user-2',
        username: 'FitnessFury',
        displayName: 'Sarah Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessFury',
        league: 'platinum',
        leagueRank: 1,
        totalPoints: 3245,
        currentStreak: 62,
    },
    {
        id: 'user-3',
        username: 'CodeNinja',
        displayName: 'Mike Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja',
        league: 'diamond',
        leagueRank: 3,
        totalPoints: 1876,
        currentStreak: 34,
    },
    {
        id: 'user-4',
        username: 'ZenMaster',
        displayName: 'Emma Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZenMaster',
        league: 'gold',
        leagueRank: 2,
        totalPoints: 1234,
        currentStreak: 28,
    },
    {
        id: 'user-5',
        username: 'BookWorm',
        displayName: 'David Park',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BookWorm',
        league: 'silver',
        leagueRank: 1,
        totalPoints: 756,
        currentStreak: 19,
    },
    {
        id: 'user-6',
        username: 'GymRat',
        displayName: 'Jake Torres',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GymRat',
        league: 'immortal',
        leagueRank: 2,
        totalPoints: 5420,
        currentStreak: 89,
    },
    {
        id: 'user-7',
        username: 'EarlyBird',
        displayName: 'Lisa Chang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EarlyBird',
        league: 'ascendant',
        leagueRank: 1,
        totalPoints: 3890,
        currentStreak: 55,
    },
];

// Mock Challenges
export const mockChallenges: Challenge[] = [
    {
        id: 'challenge-1',
        title: 'New Year, New You',
        description: 'Complete 5 different habits for 7 consecutive days',
        type: 'weekly',
        difficulty: 'hard',
        points: 150,
        targetCount: 35,
        startsAt: new Date('2026-01-13'),
        endsAt: new Date('2026-01-20'),
        isGlobal: true,
    },
    {
        id: 'challenge-2',
        title: 'Morning Warrior',
        description: 'Complete any habit before 8 AM, 5 times this week',
        type: 'weekly',
        difficulty: 'medium',
        points: 100,
        targetCount: 5,
        startsAt: new Date('2026-01-13'),
        endsAt: new Date('2026-01-20'),
        isGlobal: true,
    },
    {
        id: 'challenge-3',
        title: 'Daily Grind',
        description: 'Complete all your daily habits today',
        type: 'daily',
        difficulty: 'easy',
        points: 50,
        targetCount: 5,
        startsAt: new Date('2026-01-19'),
        endsAt: new Date('2026-01-20'),
        isGlobal: true,
    },
    {
        id: 'challenge-4',
        title: 'January Champion',
        description: 'Earn 1000 points this month',
        type: 'monthly',
        difficulty: 'extreme',
        points: 200,
        targetCount: 1000,
        startsAt: new Date('2026-01-01'),
        endsAt: new Date('2026-02-01'),
        isGlobal: true,
    },
    {
        id: 'challenge-5',
        title: 'Social Star',
        description: 'Like and comment on 10 friend posts this week',
        type: 'weekly',
        difficulty: 'easy',
        points: 50,
        targetCount: 10,
        startsAt: new Date('2026-01-13'),
        endsAt: new Date('2026-01-20'),
        isGlobal: false,
    },
];

// Helper to generate heatmap data
export function generateHeatmapData(days: number = 365): { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate random completion count with some patterns
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let count = 0;
        const rand = Math.random();

        if (rand > 0.15) { // 85% chance of some activity
            if (isWeekend) {
                count = Math.floor(Math.random() * 3) + 1;
            } else {
                count = Math.floor(Math.random() * 5) + 1;
            }
        }

        // Map count to level
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 5) level = 4;
        else if (count >= 4) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        data.push({
            date: date.toISOString().split('T')[0],
            count,
            level,
        });
    }

    return data;
}
