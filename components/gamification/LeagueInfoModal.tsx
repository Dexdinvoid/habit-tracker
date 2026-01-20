'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LeagueInfoModal.module.css';
import { LeagueTier } from '@/lib/types';

interface LeagueInfoModalProps {
    onClose: () => void;
    currentLeague: LeagueTier;
}

const LEAGUE_STRUCTURE = [
    { name: 'Unranked', range: '0 pts', icon: '○', color: '#555566' },
    { name: 'Iron', range: '1 - 499 pts', icon: '⚙️', color: '#6b6b7b' },
    { name: 'Bronze', range: '500 - 999 pts', icon: '🥉', color: '#cd7f32' },
    { name: 'Silver', range: '1,000 - 1,999 pts', icon: '🥈', color: '#c0c0c0' },
    { name: 'Gold', range: '2,000 - 3,999 pts', icon: '🥇', color: '#ffd700' },
    { name: 'Platinum', range: '4,000 - 6,999 pts', icon: '💠', color: '#40e0d0' },
    { name: 'Diamond', range: '7,000 - 9,999 pts', icon: '💎', color: '#b9f2ff' },
    { name: 'Ascendant', range: '10,000+ pts', icon: '⬆️', color: '#00ff88' },
    { name: 'Immortal', range: 'Top 500', icon: '👑', color: '#ff2a6d' },
    { name: 'Radiant', range: 'Top 10', icon: '✨', color: '#ffd700' },
];

const POINT_SYSTEM = [
    { action: 'Daily Login', points: '+10', icon: '📅' },
    { action: 'Complete Habit', points: '+20', icon: '✅' },
    { action: 'Perfect Day (All Habits)', points: '+50', icon: '🔥' },
    { action: '7-Day Streak', points: '+100', icon: '⚡' },
];

export default function LeagueInfoModal({ onClose, currentLeague }: LeagueInfoModalProps) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className={styles.header}>
                    <h2>League System</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h3>🏆 League Tiers</h3>
                        <div className={styles.leagueList}>
                            {LEAGUE_STRUCTURE.map((league) => (
                                <div
                                    key={league.name}
                                    className={`${styles.leagueRow} ${league.name.toLowerCase() === currentLeague ? styles.active : ''}`}
                                    style={{ '--league-color': league.color } as React.CSSProperties}
                                >
                                    <span className={styles.icon}>{league.icon}</span>
                                    <span className={styles.name}>{league.name}</span>
                                    <span className={styles.range}>{league.range}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3>⚡ Point System</h3>
                        <div className={styles.pointGrid}>
                            {POINT_SYSTEM.map((item) => (
                                <div key={item.action} className={styles.pointCard}>
                                    <span className={styles.pointIcon}>{item.icon}</span>
                                    <div className={styles.pointInfo}>
                                        <span className={styles.action}>{item.action}</span>
                                        <span className={styles.points}>{item.points} pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
