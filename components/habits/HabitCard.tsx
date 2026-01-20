'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HabitWithStats } from '@/lib/types';
import styles from './HabitCard.module.css';

interface HabitCardProps {
    habit: HabitWithStats;
    onCheck: () => void;
    onDelete?: () => void;
}

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const FlameIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.65 0-7-2.76-7-7.5 0-3.82 2.5-6.95 5.02-9.74.65-.72 1.91-.5 2.23.39.2.57.08 1.2-.29 1.65-.92 1.12-1.96 2.37-1.96 3.7 0 2.21 2.24 2.5 3 2.5s3-.29 3-2.5c0-1.33-1.04-2.58-1.96-3.7-.37-.45-.49-1.08-.29-1.65.32-.89 1.58-1.11 2.23-.39C18.5 8.55 21 11.68 21 15.5c0 4.74-3.35 7.5-7 7.5h-2z" />
    </svg>
);

export default function HabitCard({ habit, onCheck, onDelete }: HabitCardProps) {
    const isCompleted = habit.completedToday;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <motion.div
            className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {/* Delete Button */}
            {onDelete && (
                <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    title="Delete habit"
                >
                    <TrashIcon />
                </button>
            )}

            {/* Checkbox */}
            <motion.button
                className={`${styles.checkbox} ${isCompleted ? styles.checked : ''}`}
                onClick={onCheck}
                disabled={isCompleted}
                style={{ '--habit-color': habit.color } as React.CSSProperties}
                whileTap={{ scale: 0.9 }}
            >
                {isCompleted && <CheckIcon />}
            </motion.button>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.icon}>{habit.icon}</span>
                    <h3 className={styles.name}>{habit.name}</h3>
                </div>
                {habit.description && (
                    <p className={styles.description}>{habit.description}</p>
                )}
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.streak}>
                    <FlameIcon />
                    <span>{habit.currentStreak}</span>
                </div>
                <div className={styles.frequency}>
                    {habit.frequency}
                </div>
            </div>

            {/* Points Badge (shown when not completed) */}
            {!isCompleted && (
                <div className={styles.pointsBadge}>
                    +10 pts
                </div>
            )}

            {/* Completed Badge */}
            {isCompleted && (
                <motion.div
                    className={styles.completedBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                >
                    ✓ Done
                </motion.div>
            )}
        </motion.div>
    );
}
