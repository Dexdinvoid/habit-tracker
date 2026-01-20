import { Achievement } from './types';

export const ACHIEVEMENTS_LIST: Achievement[] = [
    // === GETTING STARTED ===
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first habit.',
        icon: '🌱',
        rarity: 'common'
    },
    {
        id: 'habit_creator',
        name: 'Habit Creator',
        description: 'Create your first habit.',
        icon: '📝',
        rarity: 'common'
    },
    {
        id: 'profile_complete',
        name: 'Identity Forged',
        description: 'Complete your profile setup.',
        icon: '🎭',
        rarity: 'common'
    },

    // === STREAK MILESTONES ===
    {
        id: 'streak_3',
        name: 'Getting Started',
        description: 'Reach a 3-day streak.',
        icon: '🔥',
        rarity: 'common'
    },
    {
        id: 'streak_week',
        name: 'On Fire',
        description: 'Reach a 7-day streak.',
        icon: '🔥',
        rarity: 'rare'
    },
    {
        id: 'streak_14',
        name: 'Two Week Warrior',
        description: 'Reach a 14-day streak.',
        icon: '⚔️',
        rarity: 'rare'
    },
    {
        id: 'streak_month',
        name: 'Unstoppable',
        description: 'Reach a 30-day streak.',
        icon: '🚀',
        rarity: 'epic'
    },
    {
        id: 'streak_60',
        name: 'Iron Will',
        description: 'Reach a 60-day streak.',
        icon: '🛡️',
        rarity: 'epic'
    },
    {
        id: 'streak_100',
        name: 'Centurion',
        description: 'Reach a 100-day streak.',
        icon: '💯',
        rarity: 'legendary'
    },
    {
        id: 'streak_365',
        name: 'Year of Discipline',
        description: 'Maintain a 365-day streak.',
        icon: '👑',
        rarity: 'legendary'
    },

    // === POINTS MILESTONES ===
    {
        id: 'points_100',
        name: 'Point Starter',
        description: 'Earn 100 total points.',
        icon: '⭐',
        rarity: 'common'
    },
    {
        id: 'points_500',
        name: 'Rising Star',
        description: 'Earn 500 total points.',
        icon: '🌟',
        rarity: 'common'
    },
    {
        id: 'point_collector',
        name: 'Treasure Hunter',
        description: 'Earn 1,000 total points.',
        icon: '💎',
        rarity: 'rare'
    },
    {
        id: 'points_5000',
        name: 'Point Master',
        description: 'Earn 5,000 total points.',
        icon: '💰',
        rarity: 'epic'
    },
    {
        id: 'points_10000',
        name: 'Legend',
        description: 'Earn 10,000 total points.',
        icon: '🏆',
        rarity: 'legendary'
    },

    // === SOCIAL ACHIEVEMENTS ===
    {
        id: 'first_friend',
        name: 'Friendly',
        description: 'Add your first friend.',
        icon: '🤝',
        rarity: 'common'
    },
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Add 5 friends.',
        icon: '🦋',
        rarity: 'rare'
    },
    {
        id: 'popular',
        name: 'Popular',
        description: 'Add 10 friends.',
        icon: '🌟',
        rarity: 'epic'
    },
    {
        id: 'first_comment',
        name: 'Encourager',
        description: 'Leave your first comment.',
        icon: '💬',
        rarity: 'common'
    },
    {
        id: 'first_like',
        name: 'Supporter',
        description: 'Like your first post.',
        icon: '❤️',
        rarity: 'common'
    },

    // === HABIT MILESTONES ===
    {
        id: 'habit_5',
        name: 'Multi-Tasker',
        description: 'Create 5 different habits.',
        icon: '📚',
        rarity: 'rare'
    },
    {
        id: 'habit_10',
        name: 'Habit Collector',
        description: 'Create 10 different habits.',
        icon: '🗂️',
        rarity: 'epic'
    },
    {
        id: 'completions_50',
        name: 'Committed',
        description: 'Complete 50 total habits.',
        icon: '✅',
        rarity: 'rare'
    },
    {
        id: 'completions_100',
        name: 'Dedicated',
        description: 'Complete 100 total habits.',
        icon: '🎯',
        rarity: 'epic'
    },
    {
        id: 'completions_500',
        name: 'Master of Habits',
        description: 'Complete 500 total habits.',
        icon: '🏅',
        rarity: 'legendary'
    },

    // === SPECIAL ACHIEVEMENTS ===
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete a habit before 6 AM.',
        icon: '🌅',
        rarity: 'rare'
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a habit after 11 PM.',
        icon: '🦉',
        rarity: 'rare'
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete all habits in a single day.',
        icon: '✨',
        rarity: 'epic'
    },
    {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Complete habits on both Saturday and Sunday.',
        icon: '🗓️',
        rarity: 'common'
    },
    {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Resume your streak after a break.',
        icon: '🔄',
        rarity: 'rare'
    },

    // === LEAGUE ACHIEVEMENTS ===
    {
        id: 'league_bronze',
        name: 'Bronze Contender',
        description: 'Reach Bronze league.',
        icon: '🥉',
        rarity: 'common'
    },
    {
        id: 'league_silver',
        name: 'Silver Challenger',
        description: 'Reach Silver league.',
        icon: '🥈',
        rarity: 'rare'
    },
    {
        id: 'league_gold',
        name: 'Gold Champion',
        description: 'Reach Gold league.',
        icon: '🥇',
        rarity: 'rare'
    },
    {
        id: 'league_diamond',
        name: 'Diamond Elite',
        description: 'Reach Diamond league.',
        icon: '💎',
        rarity: 'epic'
    },
    {
        id: 'league_radiant',
        name: 'Radiant',
        description: 'Reach the highest league: Radiant.',
        icon: '☀️',
        rarity: 'legendary'
    },

    // === CHALLENGE ACHIEVEMENTS ===
    {
        id: 'first_challenge',
        name: 'Challenger',
        description: 'Complete your first challenge.',
        icon: '🎮',
        rarity: 'common'
    },
    {
        id: 'challenge_5',
        name: 'Challenge Seeker',
        description: 'Complete 5 challenges.',
        icon: '🎲',
        rarity: 'rare'
    },
    {
        id: 'challenge_master',
        name: 'Challenge Master',
        description: 'Complete 20 challenges.',
        icon: '🎖️',
        rarity: 'legendary'
    }
];

export const checkAchievements = (
    currentStats: {
        totalPoints: number;
        currentStreak: number;
        habitsCompleted: number;
        friendsCount: number;
        habitsCreated?: number;
        league?: string;
    },
    unlockedIds: string[]
): string[] => {
    const newlyUnlocked: string[] = [];

    // Helper to check and add
    const check = (id: string, condition: boolean) => {
        if (!unlockedIds.includes(id) && condition) newlyUnlocked.push(id);
    };

    // === Getting Started ===
    check('first_steps', currentStats.habitsCompleted >= 1);
    check('habit_creator', (currentStats.habitsCreated || 0) >= 1);

    // === Streak Milestones ===
    check('streak_3', currentStats.currentStreak >= 3);
    check('streak_week', currentStats.currentStreak >= 7);
    check('streak_14', currentStats.currentStreak >= 14);
    check('streak_month', currentStats.currentStreak >= 30);
    check('streak_60', currentStats.currentStreak >= 60);
    check('streak_100', currentStats.currentStreak >= 100);
    check('streak_365', currentStats.currentStreak >= 365);

    // === Points Milestones ===
    check('points_100', currentStats.totalPoints >= 100);
    check('points_500', currentStats.totalPoints >= 500);
    check('point_collector', currentStats.totalPoints >= 1000);
    check('points_5000', currentStats.totalPoints >= 5000);
    check('points_10000', currentStats.totalPoints >= 10000);

    // === Social ===
    check('first_friend', currentStats.friendsCount >= 1);
    check('social_butterfly', currentStats.friendsCount >= 5);
    check('popular', currentStats.friendsCount >= 10);

    // === Habit Milestones ===
    check('habit_5', (currentStats.habitsCreated || 0) >= 5);
    check('habit_10', (currentStats.habitsCreated || 0) >= 10);
    check('completions_50', currentStats.habitsCompleted >= 50);
    check('completions_100', currentStats.habitsCompleted >= 100);
    check('completions_500', currentStats.habitsCompleted >= 500);

    // === League Achievements ===
    const leagueOrder = ['unranked', 'iron', 'bronze', 'silver', 'gold', 'diamond', 'platinum', 'ascendant', 'immortal', 'radiant'];
    const currentLeagueIndex = leagueOrder.indexOf(currentStats.league || 'unranked');

    check('league_bronze', currentLeagueIndex >= 2);
    check('league_silver', currentLeagueIndex >= 3);
    check('league_gold', currentLeagueIndex >= 4);
    check('league_diamond', currentLeagueIndex >= 5);
    check('league_radiant', currentLeagueIndex >= 9);

    return newlyUnlocked;
};
