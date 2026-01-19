'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserStats, Habit, HabitWithStats, FeedPost, Friend, Challenge, ChallengeProgress } from '@/lib/types';
import { mockUser, mockUserStats, mockHabits, mockFeedPosts, mockFriends, mockChallenges } from '@/lib/mockData';

interface AppState {
    user: User | null;
    userStats: UserStats | null;
    habits: HabitWithStats[];
    feedPosts: FeedPost[];
    friends: Friend[];
    challenges: Challenge[];
    challengeProgress: Map<string, ChallengeProgress>;
    isLoading: boolean;
}

interface AppContextType extends AppState {
    // User actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;

    // Habit actions
    addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => void;
    completeHabit: (habitId: string, proofImageUrl: string) => void;
    deleteHabit: (habitId: string) => void;

    // Social actions
    likePost: (postId: string) => void;
    addComment: (postId: string, content: string) => void;
    addFriend: (friendId: string) => void;

    // Points
    addPoints: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, setState] = useState<AppState>({
        user: null,
        userStats: null,
        habits: [],
        feedPosts: [],
        friends: [],
        challenges: [],
        challengeProgress: new Map(),
        isLoading: true,
    });

    // Load initial data (mock data for MVP)
    useEffect(() => {
        const loadData = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if user is "logged in" (stored in localStorage)
            const isLoggedIn = localStorage.getItem('consistency-logged-in');

            if (isLoggedIn === 'true') {
                setState({
                    user: mockUser,
                    userStats: mockUserStats,
                    habits: mockHabits,
                    feedPosts: mockFeedPosts,
                    friends: mockFriends,
                    challenges: mockChallenges,
                    challengeProgress: new Map(),
                    isLoading: false,
                });
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        loadData();
    }, []);

    // User actions
    const login = async (email: string, password: string) => {
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.setItem('consistency-logged-in', 'true');

        setState({
            user: mockUser,
            userStats: mockUserStats,
            habits: mockHabits,
            feedPosts: mockFeedPosts,
            friends: mockFriends,
            challenges: mockChallenges,
            challengeProgress: new Map(),
            isLoading: false,
        });
    };

    const logout = () => {
        localStorage.removeItem('consistency-logged-in');
        setState({
            user: null,
            userStats: null,
            habits: [],
            feedPosts: [],
            friends: [],
            challenges: [],
            challengeProgress: new Map(),
            isLoading: false,
        });
    };

    const updateUser = (updates: Partial<User>) => {
        setState(prev => ({
            ...prev,
            user: prev.user ? { ...prev.user, ...updates } : null,
        }));
    };

    // Habit actions
    const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
        const newHabit: HabitWithStats = {
            ...habitData,
            id: `habit-${Date.now()}`,
            userId: state.user?.id || '',
            createdAt: new Date(),
            currentStreak: 0,
            longestStreak: 0,
            totalCompletions: 0,
            completedToday: false,
            completions: [],
        };

        setState(prev => ({
            ...prev,
            habits: [...prev.habits, newHabit],
        }));
    };

    const completeHabit = (habitId: string, proofImageUrl: string) => {
        setState(prev => {
            const habits = prev.habits.map(habit => {
                if (habit.id === habitId && !habit.completedToday) {
                    const completion = {
                        id: `completion-${Date.now()}`,
                        habitId,
                        userId: prev.user?.id || '',
                        completedAt: new Date(),
                        proofImageUrl,
                        pointsEarned: 10,
                        streakCount: habit.currentStreak + 1,
                    };

                    return {
                        ...habit,
                        completedToday: true,
                        currentStreak: habit.currentStreak + 1,
                        longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
                        totalCompletions: habit.totalCompletions + 1,
                        completions: [...habit.completions, completion],
                    };
                }
                return habit;
            });

            // Update user stats
            const userStats = prev.userStats ? {
                ...prev.userStats,
                totalPoints: prev.userStats.totalPoints + 10,
                habitsCompleted: prev.userStats.habitsCompleted + 1,
            } : null;

            return { ...prev, habits, userStats };
        });
    };

    const deleteHabit = (habitId: string) => {
        setState(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== habitId),
        }));
    };

    // Social actions
    const likePost = (postId: string) => {
        setState(prev => ({
            ...prev,
            feedPosts: prev.feedPosts.map(post =>
                post.id === postId
                    ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
                    : post
            ),
        }));
    };

    const addComment = (postId: string, content: string) => {
        setState(prev => ({
            ...prev,
            feedPosts: prev.feedPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: post.comments + 1 }
                    : post
            ),
        }));
    };

    const addFriend = (friendId: string) => {
        // In production, this would trigger a friend request
        console.log('Friend request sent to:', friendId);
    };

    // Points
    const addPoints = (amount: number) => {
        setState(prev => ({
            ...prev,
            userStats: prev.userStats ? {
                ...prev.userStats,
                totalPoints: prev.userStats.totalPoints + amount,
                weeklyPoints: prev.userStats.weeklyPoints + amount,
            } : null,
        }));
    };

    return (
        <AppContext.Provider value={{
            ...state,
            login,
            logout,
            updateUser,
            addHabit,
            completeHabit,
            deleteHabit,
            likePost,
            addComment,
            addFriend,
            addPoints,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
