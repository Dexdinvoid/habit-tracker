'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserStats, Habit, HabitWithStats, FeedPost, Friend, Challenge, ChallengeProgress, Comment, Message, Conversation } from '@/lib/types';
import { calculateLeague } from '@/lib/leagueLogic';
import { checkAchievements } from '@/lib/achievements';
import { supabase } from '@/lib/supabase';

interface AppState {
    user: User | null;
    userStats: UserStats | null;
    habits: HabitWithStats[];
    feedPosts: FeedPost[];
    friends: Friend[];
    challenges: Challenge[];
    challengeProgress: Map<string, ChallengeProgress>;
    messages: Message[];
    conversations: Conversation[];
    isLoading: boolean;
}

interface AppContextType extends AppState {
    // User actions
    login: (email: string, password: string) => Promise<void>;
    loginWithProvider: (provider: 'google' | 'apple' | 'github') => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;

    // Habit actions
    addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => void;
    completeHabit: (habitId: string, proofImageUrl: string, caption?: string) => void;
    deleteHabit: (habitId: string) => void;

    // Social actions
    likePost: (postId: string) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    fetchComments: (postId: string) => Promise<Comment[]>;
    addFriend: (friendId: string) => void;

    // Points
    addPoints: (amount: number) => void;

    // Messaging
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    fetchMessages: (partnerId: string) => Promise<Message[]>;
    markAsRead: (messageIds: string[]) => Promise<void>;

    // Following
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    fetchFollowers: (userId: string) => Promise<string[]>;
    fetchFollowing: (userId: string) => Promise<string[]>;

    // User Search
    searchUsers: (query: string) => Promise<Friend[]>;
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
        messages: [],
        conversations: [],
        isLoading: true,
    });

    // Check active session and listen for auth changes
    useEffect(() => {
        const fetchUserData = async (session: any) => {
            if (session?.user) {
                // ... (User mapping code) ...
                const user: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    username: session.user.email?.split('@')[0] || 'nomad',
                    displayName: session.user.user_metadata?.full_name || 'Nomad User',
                    avatar: session.user.user_metadata?.avatar_url,
                    theme: 'cyberpunk',
                    createdAt: new Date(session.user.created_at),
                    updatedAt: new Date(),
                };

                // Fetch Habits
                const { data: realHabits } = await supabase
                    .from('habits')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: true });

                const processedHabits: HabitWithStats[] = (realHabits || []).map((h: any) => ({
                    id: h.id,
                    userId: h.user_id,
                    name: h.name,
                    description: h.description,
                    icon: h.icon,
                    color: h.color,
                    frequency: h.frequency,
                    createdAt: new Date(h.created_at),
                    // TODO: These need real stats from habit_logs ideally, but starting simple
                    currentStreak: 0,
                    longestStreak: 0,
                    totalCompletions: 0,
                    completedToday: false,
                    completions: [],
                }));

                // Fetch Real Feed Posts
                const { data: realPosts } = await supabase
                    .from('habit_logs')
                    .select(`
                        id,
                        user_id,
                        points_earned,
                        created_at,
                        proof_image_url,
                        user:profiles!user_id(username, display_name, avatar_url),
                        habit:habits!habit_id(name, icon)
                    `)
                    .order('created_at', { ascending: false });

                let finalFeedPosts: FeedPost[] = [];

                if (realPosts && realPosts.length > 0) {
                    finalFeedPosts = realPosts.map((p: any) => ({
                        id: p.id,
                        userId: p.user_id, // Fixed: use post author's ID
                        user: {
                            username: p.user?.username || 'Unknown',
                            displayName: p.user?.display_name || 'Unknown User',
                            avatar: p.user?.avatar_url
                        },
                        habitName: p.habit?.name || 'Unknown Habit',
                        habitIcon: p.habit?.icon || '✔️',
                        proofImageUrl: p.proof_image_url || 'https://via.placeholder.com/400',
                        pointsEarned: p.points_earned,
                        createdAt: new Date(p.created_at),
                        likes: 0,
                        comments: 0,
                        isLiked: false
                    }));
                }

                // If user has no habits, maybe show mocks? Or just show empty. 
                // Let's show mocks ONLY if they have absolutely nothing, to populate the UI for demo?
                // No, user wants to DELETE habits. Mocks that reappear are annoying.
                // Let's stick to real habits. If empty, empty.
                const finalHabits = processedHabits.length > 0 ? processedHabits : [];

                // Calculate User Stats from Real Data
                // In a real production app, this would be an aggregation query or a 'profiles' table column
                // For now, we calculate it from the habit_logs we just fetched (if we fetched them all, which we didn't)
                // Let's assume for MVP we fetch total points from a 'profiles' table or similar, 
                // OR we accept starting at 0 if no separate stats table exists yet.
                // Since schema has 'profiles' but maybe not points column, let's check.
                // Actually, schema.sql showed points/streak usually.
                // Let's safe-guard with 0.

                // TODO: Fetch real stats from DB if available.
                // Attempt to fetch profile stats
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('points, current_streak, highest_streak')
                    .eq('id', session.user.id)
                    .single();

                const totalPoints = profileData?.points || 0;
                const { tier, rank } = calculateLeague(totalPoints);

                const userStats: UserStats = {
                    totalPoints: totalPoints,
                    currentStreak: profileData?.current_streak || 0,
                    longestStreak: profileData?.highest_streak || 0,
                    habitsCompleted: 0, // Need aggregation query for accurate count
                    weeklyPoints: 0,
                    league: tier,
                    leagueRank: rank,
                    achievements: []
                };

                // We handle realPosts logic above, but let's just initialize empty if simpler.
                // Actually, existing code fetched realPosts. Let's keep that logic but remove mock fallback.

                // ... (existing realPosts fetching logic is fine, just delete the `let feedPosts = mockFeedPosts` line)

                setState(prev => ({
                    ...prev,
                    user,
                    userStats,
                    habits: finalHabits,
                    feedPosts: finalFeedPosts, // Will fix this variable name in next step if needed
                    friends: [], // No mock friends
                    challenges: [], // No mock challenges
                    challengeProgress: new Map(),
                    isLoading: false,
                }));
            } else {
                setState(prev => ({ ...prev, user: null, isLoading: false }));
            }
        };

        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await fetchUserData(session);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
                fetchUserData(session);
            } else if (_event === 'SIGNED_OUT') {
                setState(prev => ({
                    ...prev,
                    user: null,
                    userStats: null,
                    habits: [],
                    isLoading: false
                }));
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // User actions
    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const loginWithProvider = async (provider: 'google' | 'apple' | 'github') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    };

    const updateUser = (updates: Partial<User>) => {
        setState(prev => ({
            ...prev,
            user: prev.user ? { ...prev.user, ...updates } : null,
        }));
    };

    // Habit actions (Kept same for now, just operating on local state)
    const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
        if (!state.user) return;

        // 1. Insert into Supabase
        const { data: newHabitData, error } = await supabase
            .from('habits')
            .insert({
                user_id: state.user.id,
                name: habitData.name,
                description: habitData.description,
                icon: habitData.icon,
                color: habitData.color,
                frequency: habitData.frequency
            })
            .select()
            .single();

        if (error) console.error('Error creating habit:', error);

        // 2. Local State
        const newHabit: HabitWithStats = {
            ...habitData,
            id: newHabitData?.id || `habit-${Date.now()}`, // Use Real ID if available
            userId: state.user.id,
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

    const completeHabit = async (habitId: string, proofImageUrl: string, caption?: string) => {
        if (!state.user) return;

        // Check if this is a real backend habit (UUID) or a local mock habit
        // Real Supabase IDs are UUIDs (e.g., 550e8400-e29b...)
        // Mock IDs are 'habit-1', 'habit-12345678', etc.
        const isRealHabit = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(habitId);

        let newLogId = null;

        if (isRealHabit) {
            // 1. Insert into Supabase (Only for real habits)
            const { data: newLog, error } = await supabase
                .from('habit_logs')
                .insert({
                    habit_id: habitId,
                    user_id: state.user.id,
                    proof_image_url: proofImageUrl,
                    caption: caption || null,
                    points_earned: 10
                })
                .select()
                .single();

            if (error) {
                console.error('Error logging habit to DB:', error);
            } else {
                newLogId = newLog.id;
            }
        } else {
            console.log('Skipping DB sync for local/mock habit:', habitId);
        }

        // 2. Update Local State
        setState(prev => {
            const habits = prev.habits.map(habit => {
                if (habit.id === habitId && !habit.completedToday) {
                    const completion = {
                        id: newLogId || `completion-${Date.now()}`,
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

            const userStats = prev.userStats ? {
                ...prev.userStats,
                totalPoints: prev.userStats.totalPoints + 10,
                habitsCompleted: prev.userStats.habitsCompleted + 1,
            } : null;

            // Add new real post to feed if successful
            let feedPosts = prev.feedPosts;
            if (newLogId && isRealHabit) {
                const habitName = prev.habits.find(h => h.id === habitId)?.name || 'Habit Completed';
                const habitIcon = prev.habits.find(h => h.id === habitId)?.icon || '✅';

                const newPost: FeedPost = {
                    id: newLogId, // REAL ID from DB
                    userId: state.user!.id,
                    user: {
                        username: state.user!.username,
                        displayName: state.user!.displayName,
                        avatar: state.user!.avatar,
                    },
                    habitName,
                    habitIcon,
                    proofImageUrl,
                    caption: caption || undefined,
                    pointsEarned: 10,
                    createdAt: new Date(),
                    likes: 0,
                    comments: 0,
                    isLiked: false,
                };
                feedPosts = [newPost, ...prev.feedPosts];
            }

            // Perform Achievement Check
            const completedHabit = habits.find(h => h.id === habitId);
            const currentUnlocked = userStats?.achievements.map(a => a.id) || [];

            const newStats = {
                totalPoints: (userStats?.totalPoints || 0) + 10,
                currentStreak: completedHabit ? completedHabit.currentStreak : 0,
                habitsCompleted: (userStats?.habitsCompleted || 0) + 1,
                friendsCount: prev.friends.length
            };

            const newlyUnlocked = checkAchievements(newStats, currentUnlocked);

            if (newlyUnlocked.length > 0) {
                // Unlock in DB
                newlyUnlocked.forEach(async (id) => {
                    await supabase.from('user_achievements').insert({
                        user_id: prev.user?.id,
                        achievement_id: id
                    });
                });
                // Note: local state update for achievements would require fetching them again or optimistic update.
                // For MVP, we skip complex optimistic update for achievements list.
            }

            return { ...prev, habits, userStats, feedPosts };
        });
    };

    const deleteHabit = async (habitId: string) => {
        console.log('Attempting to delete habit:', habitId);

        // 1. Delete from Supabase if real habit
        const isRealHabit = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(habitId);
        console.log('Is real habit (UUID check):', isRealHabit);

        if (isRealHabit) {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', habitId);

            if (error) {
                console.error('Error deleting habit from DB:', error);
                alert(`Failed to delete: ${error.message}`); // Temporary feedback
                return;
            }
            console.log('Successfully deleted from DB');
        } else {
            console.log('Deleting local/mock habit');
        }

        // 2. Update Local State
        setState(prev => {
            console.log('Updating state. Previous habits:', prev.habits.length);
            const newHabits = prev.habits.filter(h => h.id !== habitId);
            console.log('New habits count:', newHabits.length);
            return {
                ...prev,
                habits: newHabits,
            };
        });
    };

    // Social actions
    const likePost = async (postId: string) => {
        if (!state.user) return;

        const post = state.feedPosts.find(p => p.id === postId);
        if (!post) return;

        const isCurrentlyLiked = post.isLiked;

        // Optimistic update
        setState(prev => ({
            ...prev,
            feedPosts: prev.feedPosts.map(p =>
                p.id === postId
                    ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
                    : p
            ),
        }));

        // Persist to database
        if (isCurrentlyLiked) {
            // Unlike - delete from likes table
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', state.user.id);

            if (error) console.error('Error unliking:', error);
        } else {
            // Like - insert into likes table
            const { error } = await supabase
                .from('likes')
                .insert({
                    post_id: postId,
                    user_id: state.user.id
                });

            if (error) console.error('Error liking:', error);
        }
    };

    const fetchComments = async (postId: string): Promise<Comment[]> => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                user:profiles!user_id(username, display_name, avatar_url)
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            // Fallback to empty for MVP if table empty/error
            return [];
        }

        // Map Supabase response to Comment type
        return data.map((c: any) => ({
            id: c.id,
            postId: c.post_id,
            userId: c.user_id,
            user: {
                username: c.user.username,
                displayName: c.user.display_name,
                avatar: c.user.avatar_url,
            },
            content: c.content,
            createdAt: new Date(c.created_at),
        }));
    };

    const addComment = async (postId: string, content: string) => {
        if (!state.user) return;

        // Optimistic update for UI feel (optional, but skipping for simplicity first)
        // 1. Insert into Supabase
        const { error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                user_id: state.user.id,
                content: content
            });

        if (error) {
            console.error('Error adding comment:', error);
            throw error;
        }

        // 2. Update local feed state to increment comment count
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
        console.log('Friend request sent to:', friendId);
    };

    // Points
    const addPoints = (amount: number) => {
        setState(prev => {
            if (!prev.userStats) return prev;

            const newTotal = prev.userStats.totalPoints + amount;
            const { tier, rank } = calculateLeague(newTotal);

            return {
                ...prev,
                userStats: {
                    ...prev.userStats,
                    totalPoints: newTotal,
                    weeklyPoints: prev.userStats.weeklyPoints + amount,
                    league: tier,
                    leagueRank: rank,
                }
            };
        });
    };

    // Messaging
    const sendMessage = async (receiverId: string, content: string) => {
        if (!state.user) return;

        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: state.user.id,
                receiver_id: receiverId,
                content: content
            });

        if (error) {
            console.error('Error sending message:', error);
            throw error;
        }

        // Refresh messages for that user
        await fetchMessages(receiverId);
        // Refresh conversations to show new last message
        await fetchConversations();
    };

    const fetchMessages = async (partnerId: string): Promise<Message[]> => {
        if (!state.user) return [];

        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:profiles!sender_id(username, display_name, avatar_url),
                receiver:profiles!receiver_id(username, display_name, avatar_url)
            `)
            .or(`and(sender_id.eq.${state.user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${state.user.id})`)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return [];
        }

        const messages: Message[] = data.map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            content: m.content,
            isRead: m.is_read,
            createdAt: new Date(m.created_at),
            sender: {
                username: m.sender?.username,
                displayName: m.sender?.display_name,
                avatar: m.sender?.avatar_url
            },
            receiver: {
                username: m.receiver?.username,
                displayName: m.receiver?.display_name,
                avatar: m.receiver?.avatar_url
            }
        }));

        setState(prev => ({ ...prev, messages }));
        return messages;
    };

    const fetchConversations = async () => {
        if (!state.user) return;

        // Fetch latest messages where user is sender OR receiver
        // Note: This simple query fetches ALL messages. For production efficiency, use a specialized RPC function or distinct query.
        // For MVP, we fetch standard messages and process in JS (limited scaling).

        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:profiles!sender_id(username, display_name, avatar_url),
                receiver:profiles!receiver_id(username, display_name, avatar_url)
            `)
            .or(`sender_id.eq.${state.user.id},receiver_id.eq.${state.user.id}`)
            .order('created_at', { ascending: false });

        if (error || !data) return;

        const conversationsMap = new Map<string, Conversation>();

        data.forEach((m: any) => {
            const partnerId = m.sender_id === state.user!.id ? m.receiver_id : m.sender_id;

            // Only take the first one encountered (which is latest due to sort)
            if (!conversationsMap.has(partnerId)) {
                const partnerProfile = m.sender_id === state.user!.id ? m.receiver : m.sender;

                conversationsMap.set(partnerId, {
                    partner: {
                        id: partnerId,
                        username: partnerProfile?.username || 'Unknown',
                        displayName: partnerProfile?.display_name || 'Unknown',
                        avatar: partnerProfile?.avatar_url,
                        // Defaults
                        email: '', theme: 'cyberpunk', createdAt: new Date(), updatedAt: new Date()
                    },
                    lastMessage: {
                        id: m.id,
                        senderId: m.sender_id,
                        receiverId: m.receiver_id,
                        content: m.content,
                        isRead: m.is_read,
                        createdAt: new Date(m.created_at)
                    },
                    unreadCount: 0 // Logic for counts needs 'is_read' check
                });
            }
        });

        setState(prev => ({
            ...prev,
            conversations: Array.from(conversationsMap.values())
        }));
    };

    useEffect(() => {
        if (state.user) {
            fetchConversations();
        }
    }, [state.user]);

    const markAsRead = async (messageIds: string[]) => {
        if (messageIds.length === 0) return;

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', messageIds);

        if (error) console.error('Error marking read:', error);
    };

    // Follow system
    const followUser = async (userId: string) => {
        if (!state.user || state.user.id === userId) return;

        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: state.user.id,
                following_id: userId
            });

        if (error) console.error('Error following user:', error);
    };

    const unfollowUser = async (userId: string) => {
        if (!state.user) return;

        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', state.user.id)
            .eq('following_id', userId);

        if (error) console.error('Error unfollowing user:', error);
    };

    const fetchFollowers = async (userId: string): Promise<string[]> => {
        const { data, error } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('following_id', userId);

        if (error || !data) return [];
        return data.map((f: any) => f.follower_id);
    };

    const fetchFollowing = async (userId: string): Promise<string[]> => {
        const { data, error } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', userId);

        if (error || !data) return [];
        return data.map((f: any) => f.following_id);
    };

    const searchUsers = async (query: string): Promise<Friend[]> => {
        if (!query.trim()) return [];

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, points, current_streak')
            .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(20);

        if (error || !data) return [];

        return data.map((profile: any) => {
            const points = profile.points || 0;
            const { tier } = calculateLeague(points);

            return {
                id: profile.id,
                username: profile.username,
                displayName: profile.display_name || profile.username,
                avatar: profile.avatar_url,
                totalPoints: points,
                currentStreak: profile.current_streak || 0,
                league: tier,
                leagueRank: 1, // Default rank
            };
        });
    };

    return (
        <AppContext.Provider value={{
            ...state,
            login,
            loginWithProvider,
            logout,
            updateUser,
            addHabit,
            completeHabit,
            deleteHabit,
            likePost,
            addComment,
            fetchComments,
            addFriend,
            addPoints,
            sendMessage,
            fetchMessages,
            markAsRead,
            followUser,
            unfollowUser,
            fetchFollowers,
            fetchFollowing,
            searchUsers,
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
