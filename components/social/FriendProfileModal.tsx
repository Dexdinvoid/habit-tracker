'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Friend } from '@/lib/types';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import Heatmap from '@/components/habits/Heatmap';
import styles from './FriendProfileModal.module.css';

interface FriendProfileModalProps {
    friend: Friend;
    onClose: () => void;
}

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function FriendProfileModal({ friend, onClose }: FriendProfileModalProps) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleProfileClick = () => {
        onClose();
        router.push(`/profile/${friend.id}`);
    };

    if (!friend || !mounted) return null;

    return createPortal(
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </button>

                <div className={styles.scroller}>
                    <div className={styles.header}>
                        <div
                            className={styles.avatarRing}
                            onClick={handleProfileClick}
                            style={{ cursor: 'pointer' }}
                            title="View full profile"
                        >
                            <img
                                src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                                alt={friend.displayName}
                                className={styles.avatar}
                            />
                            <div className={styles.leagueBadgeWrapper}>
                                <LeagueBadge tier={friend.league} rank={friend.leagueRank as 1 | 2 | 3} size="md" />
                            </div>
                        </div>
                        <h2 className={styles.displayName}>{friend.displayName}</h2>
                        <p className={styles.username}>@{friend.username}</p>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Player Stats</div>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <span className={`${styles.statValue} ${styles.highlight}`}>
                                    {friend.totalPoints.toLocaleString()}
                                </span>
                                <span className={styles.statLabel}>Total Points</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>
                                    {friend.currentStreak} 🔥
                                </span>
                                <span className={styles.statLabel}>Day Streak</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                                    {friend.league}
                                </span>
                                <span className={styles.statLabel}>Current League</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>
                                    #{friend.leagueRank}
                                </span>
                                <span className={styles.statLabel}>League Rank</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Activity Heatmap</div>
                        <div className={styles.heatmapSection}>
                            <Heatmap />
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <button className={styles.actionButton} onClick={() => alert('Challenge feature coming soon!')}>
                        <span>⚔️</span> Challenge Friend
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
