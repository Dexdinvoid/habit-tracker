// ==========================================
// CONSISTENCY - TYPE DEFINITIONS
// ==========================================

// Theme Types
export type ThemeName = 'cyberpunk' | 'fantasy' | 'neon' | 'minimal';

// User Types
export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    theme: ThemeName;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserStats {
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    habitsCompleted: number;
    league: LeagueTier;
    leagueRank: 1 | 2 | 3;  // 1-3 sub-rank within tier
    weeklyPoints: number;
    achievements: Achievement[];
}

// League System
export type LeagueTier =
    | 'unranked'
    | 'iron'
    | 'bronze'
    | 'silver'
    | 'gold'
    | 'diamond'
    | 'platinum'
    | 'ascendant'
    | 'immortal'
    | 'radiant';

export interface League {
    tier: LeagueTier;
    rank: 1 | 2 | 3;  // Sub-rank within tier
    minPoints: number;
    maxPoints: number;
    icon: string;
    color: string;
}

// Habit Types
export type HabitFrequency = 'daily' | 'weekly' | 'yearly';

export interface Habit {
    id: string;
    userId: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: HabitFrequency;
    targetDays?: number[];  // 0-6 for weekly habits
    createdAt: Date;
    archivedAt?: Date;
}

export interface HabitCompletion {
    id: string;
    habitId: string;
    userId: string;
    completedAt: Date;
    proofImageUrl: string;
    pointsEarned: number;
    streakCount: number;
}

export interface HabitWithStats extends Habit {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    completedToday: boolean;
    completions: HabitCompletion[];
}

// Heatmap Data
export interface HeatmapDay {
    date: string;  // YYYY-MM-DD format
    count: number;
    level: 0 | 1 | 2 | 3 | 4;  // Intensity level for coloring
}

// Social Types
export interface Friend {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    league: LeagueTier;
    leagueRank: 1 | 2 | 3;
    totalPoints: number;
    currentStreak: number;
}

export interface FeedPost {
    id: string;
    userId: string;
    user: {
        username: string;
        displayName: string;
        avatar?: string;
    };
    habitName: string;
    habitIcon: string;
    proofImageUrl: string;
    pointsEarned: number;
    createdAt: Date;
    likes: number;
    comments: number;
    isLiked: boolean;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    user: {
        username: string;
        displayName: string;
        avatar?: string;
    };
    content: string;
    createdAt: Date;
}

// Challenge Types
export type ChallengeType = 'daily' | 'weekly' | 'monthly';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: ChallengeType;
    difficulty: ChallengeDifficulty;
    points: number;
    targetCount: number;
    habitType?: string;  // Optional: specific habit type required
    startsAt: Date;
    endsAt: Date;
    isGlobal: boolean;  // false = friends only
}

export interface ChallengeProgress {
    challengeId: string;
    userId: string;
    currentCount: number;
    targetCount: number;
    isCompleted: boolean;
    completedAt?: Date;
}

export interface ChallengeLeaderboard {
    challengeId: string;
    entries: {
        rank: number;
        user: {
            id: string;
            username: string;
            displayName: string;
            avatar?: string;
        };
        progress: number;
        isCompleted: boolean;
    }[];
}

// Achievement Types
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt?: Date;
}

// Points Configuration
export const POINTS_CONFIG = {
    HABIT_COMPLETION: 10,
    DAILY_STREAK_BONUS: 5,
    CHALLENGE_EASY: 50,
    CHALLENGE_MEDIUM: 100,
    CHALLENGE_HARD: 150,
    CHALLENGE_EXTREME: 200,
    SOCIAL_LIKE: 1,
    SOCIAL_COMMENT: 1,
} as const;

// League Configuration
export const LEAGUES: League[] = [
    { tier: 'unranked', rank: 1, minPoints: 0, maxPoints: 99, icon: '○', color: 'var(--league-unranked)' },
    { tier: 'iron', rank: 1, minPoints: 100, maxPoints: 299, icon: '⚙️', color: 'var(--league-iron)' },
    { tier: 'bronze', rank: 1, minPoints: 300, maxPoints: 599, icon: '🥉', color: 'var(--league-bronze)' },
    { tier: 'silver', rank: 1, minPoints: 600, maxPoints: 999, icon: '🥈', color: 'var(--league-silver)' },
    { tier: 'gold', rank: 1, minPoints: 1000, maxPoints: 1499, icon: '🥇', color: 'var(--league-gold)' },
    { tier: 'diamond', rank: 1, minPoints: 1500, maxPoints: 2249, icon: '💎', color: 'var(--league-diamond)' },
    { tier: 'platinum', rank: 1, minPoints: 2250, maxPoints: 3249, icon: '🔷', color: 'var(--league-platinum)' },
    { tier: 'ascendant', rank: 1, minPoints: 3250, maxPoints: 4499, icon: '⬆️', color: 'var(--league-ascendant)' },
    { tier: 'immortal', rank: 1, minPoints: 4500, maxPoints: 5999, icon: '👑', color: 'var(--league-immortal)' },
    { tier: 'radiant', rank: 1, minPoints: 6000, maxPoints: Infinity, icon: '✨', color: 'var(--league-radiant)' },
];

// Navigation
export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: string;
}

export const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', href: '/', icon: 'home' },
    { id: 'tracker', label: 'Tracker', href: '/tracker', icon: 'check-circle' },
    { id: 'friends', label: 'Friends', href: '/friends', icon: 'users' },
    { id: 'challenges', label: 'Challenges', href: '/challenges', icon: 'trophy' },
];
