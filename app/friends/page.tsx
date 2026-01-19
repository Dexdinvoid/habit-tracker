'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import styles from './page.module.css';

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const QRIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="3" height="3" />
        <rect x="18" y="14" width="3" height="3" />
        <rect x="14" y="18" width="3" height="3" />
        <rect x="18" y="18" width="3" height="3" />
    </svg>
);

export default function FriendsPage() {
    const router = useRouter();
    const { user, friends } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard'>('friends');

    React.useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    const filteredFriends = friends.filter(friend =>
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort friends by points for leaderboard
    const leaderboard = [...friends].sort((a, b) => b.totalPoints - a.totalPoints);

    return (
        <MainLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Friends</h1>
                        <p className={styles.subtitle}>Compete and grow together</p>
                    </div>
                    <div className={styles.headerActions}>
                        <motion.button
                            className={styles.inviteButton}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LinkIcon />
                            <span>Invite Link</span>
                        </motion.button>
                        <motion.button
                            className={styles.qrButton}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <QRIcon />
                        </motion.button>
                    </div>
                </div>

                {/* Search */}
                <div className={styles.searchWrapper}>
                    <SearchIcon />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'friends' ? styles.active : ''}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends ({friends.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'leaderboard' ? styles.active : ''}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'friends' ? (
                    <motion.div
                        className={styles.friendsList}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {filteredFriends.map((friend, index) => (
                            <motion.div
                                key={friend.id}
                                className={styles.friendCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -2 }}
                            >
                                <img
                                    src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                                    alt={friend.displayName}
                                    className={styles.friendAvatar}
                                />
                                <div className={styles.friendInfo}>
                                    <span className={styles.friendName}>{friend.displayName}</span>
                                    <span className={styles.friendUsername}>@{friend.username}</span>
                                </div>
                                <div className={styles.friendStats}>
                                    <LeagueBadge tier={friend.league} rank={friend.leagueRank as 1 | 2 | 3} size="sm" />
                                    <div className={styles.statPill}>
                                        <span>🔥 {friend.currentStreak}</span>
                                    </div>
                                </div>
                                <span className={styles.friendPoints}>{friend.totalPoints.toLocaleString()} pts</span>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.leaderboard}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {leaderboard.map((friend, index) => (
                            <motion.div
                                key={friend.id}
                                className={`${styles.leaderboardRow} ${index < 3 ? styles.topThree : ''}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className={`${styles.rank} ${styles[`rank${index + 1}`]}`}>
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && `#${index + 1}`}
                                </span>
                                <img
                                    src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                                    alt={friend.displayName}
                                    className={styles.leaderboardAvatar}
                                />
                                <div className={styles.leaderboardInfo}>
                                    <span className={styles.leaderboardName}>{friend.displayName}</span>
                                    <span className={styles.leaderboardStreak}>🔥 {friend.currentStreak} day streak</span>
                                </div>
                                <div className={styles.leaderboardPoints}>
                                    <span className={styles.pointsValue}>{friend.totalPoints.toLocaleString()}</span>
                                    <span className={styles.pointsLabel}>points</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
}
