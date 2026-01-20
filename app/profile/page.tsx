'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useTheme, THEME_META } from '@/lib/ThemeProvider';
import MainLayout from '@/components/layout/MainLayout';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import TrophyCase from '@/components/gamification/TrophyCase';
import { ThemeName } from '@/lib/types';
import styles from './page.module.css';

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default function ProfilePage() {
    const router = useRouter();
    const { user, userStats, habits, feedPosts, logout, isLoading, fetchFollowers, fetchFollowing } = useApp();
    const { theme, setTheme } = useTheme();

    const [followersCount, setFollowersCount] = React.useState(0);
    const [followingCount, setFollowingCount] = React.useState(0);

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    React.useEffect(() => {
        const loadFollowData = async () => {
            if (user) {
                const followers = await fetchFollowers(user.id);
                const following = await fetchFollowing(user.id);
                setFollowersCount(followers.length);
                setFollowingCount(following.length);
            }
        };
        loadFollowData();
    }, [user, fetchFollowers, fetchFollowing]);

    if (isLoading) {
        return (
            <MainLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <div className={styles.loadingSpinner} />
                </div>
            </MainLayout>
        );
    }

    if (!user || !userStats) return null;

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <MainLayout>
            <div className={styles.container}>
                {/* Profile Card */}
                <motion.div
                    className={styles.profileCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Avatar Section */}
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarRing}>
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                alt={user.displayName}
                                className={styles.avatar}
                            />
                        </div>
                        <LeagueBadge tier={userStats.league} rank={userStats.leagueRank as 1 | 2 | 3} size="lg" />
                    </div>

                    {/* User Info */}
                    <div className={styles.userInfo}>
                        <h1 className={styles.displayName}>{user.displayName}</h1>
                        <p className={styles.username}>@{user.username}</p>
                        {user.bio && <p className={styles.bio}>{user.bio}</p>}
                    </div>

                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{userStats.totalPoints.toLocaleString()}</span>
                            <span className={styles.statLabel}>Total Points</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{userStats.currentStreak}</span>
                            <span className={styles.statLabel}>Day Streak</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{followersCount}</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{followingCount}</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className={styles.sectionTitle}>Achievements</h2>
                    <div className={styles.achievementsGrid}>
                        {userStats.achievements.map((achievement) => (
                            <motion.div
                                key={achievement.id}
                                className={`${styles.achievement} ${styles[achievement.rarity]}`}
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className={styles.achievementIcon}>{achievement.icon}</span>
                                <div className={styles.achievementInfo}>
                                    <span className={styles.achievementName}>{achievement.name}</span>
                                    <span className={styles.achievementDesc}>{achievement.description}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Trophy Case */}
                <TrophyCase stats={userStats} />

                {/* My Posts */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <h2 className={styles.sectionTitle}>My Posts</h2>
                    {feedPosts.filter(post => post.userId === user.id).length === 0 ? (
                        <div className={styles.emptyPosts}>
                            <span>📸</span>
                            <p>No posts yet. Complete habits with proof to see them here!</p>
                        </div>
                    ) : (
                        <div className={styles.postsGrid}>
                            {feedPosts
                                .filter(post => post.userId === user.id)
                                .slice(0, 9)
                                .map((post) => (
                                    <motion.div
                                        key={post.id}
                                        className={styles.postCard}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <img src={post.proofImageUrl} alt={post.habitName} className={styles.postImage} />
                                        <div className={styles.postOverlay}>
                                            <span className={styles.postIcon}>{post.habitIcon}</span>
                                            <span className={styles.postHabit}>{post.habitName}</span>
                                            {post.caption && (
                                                <span className={styles.postCaption}>{post.caption}</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    )}
                </motion.section>

                {/* Theme Selector */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Theme</h2>
                    <div className={styles.themeGrid}>
                        {(Object.keys(THEME_META) as ThemeName[]).map((themeName) => {
                            const meta = THEME_META[themeName];
                            const isActive = theme === themeName;

                            return (
                                <motion.button
                                    key={themeName}
                                    className={`${styles.themeCard} ${isActive ? styles.active : ''}`}
                                    onClick={() => setTheme(themeName)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={styles.themePreview}>
                                        {meta.preview.map((color, i) => (
                                            <div
                                                key={i}
                                                className={styles.themeColor}
                                                style={{ background: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.themeInfo}>
                                        <span className={styles.themeName}>{meta.name}</span>
                                        <span className={styles.themeDesc}>{meta.description}</span>
                                    </div>
                                    {isActive && <span className={styles.activeCheck}>✓</span>}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Logout */}
                <motion.button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LogoutIcon />
                    Sign Out
                </motion.button>
            </div>
        </MainLayout>
    );
}
