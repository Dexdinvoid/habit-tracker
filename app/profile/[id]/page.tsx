'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import Heatmap from '@/components/habits/Heatmap';
import styles from '../page.module.css';

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const { friends, isLoading, user: currentUser } = useApp();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        if (!isLoading) {
            // Find in friends list or (in real app) fetch from DB
            const friendId = params.id as string;

            // Check if it's me
            if (currentUser && currentUser.id === friendId) {
                router.replace('/profile');
                return;
            }

            const foundFriend = friends.find(f => f.id === friendId);
            if (foundFriend) {
                setUser(foundFriend);
            }
            // In a real app we'd fetch if not in friends
        }
    }, [params.id, friends, isLoading, currentUser, router]);

    if (isLoading) {
        return (
            <MainLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <div className={styles.loadingSpinner} />
                </div>
            </MainLayout>
        );
    }

    if (!user) {
        return (
            <MainLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                    <h2>User not found</h2>
                    <button onClick={() => router.push('/friends')} className={styles.actionButton} style={{ marginTop: 20 }}>Back to Friends</button>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className={styles.container}>
                <motion.div
                    className={styles.profileCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarRing}>
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                alt={user.displayName}
                                className={styles.avatar}
                            />
                        </div>
                        <LeagueBadge tier={user.league} rank={user.leagueRank as 1 | 2 | 3} size="lg" />
                    </div>

                    <div className={styles.userInfo}>
                        <h1 className={styles.displayName}>{user.displayName}</h1>
                        <p className={styles.username}>@{user.username}</p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.messageButton}
                            onClick={() => router.push(`/messages?partnerId=${user.id}`)}
                        >
                            💬 Send Message
                        </button>
                        <button
                            className={styles.followButton}
                            onClick={() => alert('Follow feature coming soon!')}
                        >
                            👤 Follow User
                        </button>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{user.totalPoints.toLocaleString()}</span>
                            <span className={styles.statLabel}>Total Points</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{user.currentStreak}</span>
                            <span className={styles.statLabel}>Day Streak</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue} style={{ textTransform: 'capitalize' }}>{user.league}</span>
                            <span className={styles.statLabel}>League</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>#{user.leagueRank}</span>
                            <span className={styles.statLabel}>Rank</span>
                        </div>
                    </div>
                </motion.div>

                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    <div className={styles.heatmapSection} style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px' }}>
                        <Heatmap />
                    </div>
                </motion.section>
            </div>
        </MainLayout>
    );
}
