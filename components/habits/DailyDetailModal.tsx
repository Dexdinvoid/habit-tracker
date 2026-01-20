'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DailyDetailModal.module.css';

interface DailyDetailModalProps {
    data: {
        date: string;
        completionRate: number;
        points: number;
        habits: {
            id: string;
            name: string;
            icon: string;
            completed: boolean;
        }[];
    };
    onClose: () => void;
}

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function DailyDetailModal({ data, onClose }: DailyDetailModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const completedHabits = data.habits.filter(h => h.completed);
    const missedHabits = data.habits.filter(h => !h.completed);

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
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <h2 className={styles.title}>{data.date}</h2>
                        <span className={styles.subtitle}>Daily Summary</span>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Score Card */}
                    <div className={styles.scoreCard}>
                        <div className={styles.scoreItem}>
                            <span className={styles.scoreValue} style={{ color: 'var(--accent-primary)' }}>
                                {data.completionRate}%
                            </span>
                            <span className={styles.scoreLabel}>Consistency</span>
                        </div>
                        <div className={styles.scoreItem}>
                            <span className={styles.scoreValue}>
                                {data.points}
                            </span>
                            <span className={styles.scoreLabel}>Points Earned</span>
                        </div>
                    </div>

                    {/* Habits List */}
                    <div className={styles.habitsList}>
                        {completedHabits.length > 0 && (
                            <div>
                                <h3 className={styles.sectionTitle} style={{ color: 'var(--success)' }}>Completed</h3>
                                {completedHabits.map(habit => (
                                    <div key={habit.id} className={`${styles.habitItem} ${styles.completed}`}>
                                        <span className={styles.habitIcon}>{habit.icon}</span>
                                        <div className={styles.habitInfo}>
                                            <span className={styles.habitName}>{habit.name}</span>
                                            <span className={styles.habitStatus}>Done (+10 pts)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {missedHabits.length > 0 && (
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <h3 className={styles.sectionTitle} style={{ color: 'var(--text-secondary)' }}>Missed</h3>
                                {missedHabits.map(habit => (
                                    <div key={habit.id} className={`${styles.habitItem} ${styles.missed}`}>
                                        <span className={styles.habitIcon}>{habit.icon}</span>
                                        <div className={styles.habitInfo}>
                                            <span className={styles.habitName}>{habit.name}</span>
                                            <span className={styles.habitStatus}>Missed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
