'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import HabitCard from '@/components/habits/HabitCard';
import Heatmap from '@/components/habits/Heatmap';
import ProgressLineChart from '@/components/habits/ProgressLineChart';
import AddHabitModal from '@/components/habits/AddHabitModal';
import ImageProofModal from '@/components/habits/ImageProofModal';
import styles from './page.module.css';

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function TrackerPage() {
    const router = useRouter();
    const { user, habits, completeHabit, deleteHabit, isLoading } = useApp();
    const [habitToDelete, setHabitToDelete] = useState<{ id: string; name: string } | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [proofModal, setProofModal] = useState<{ habitId: string; habitName: string } | null>(null);

    // Generate heatmap data from habit completions
    const heatmapData = useMemo(() => {
        const dateMap = new Map<string, number>();

        habits.forEach(habit => {
            habit.completions?.forEach(completion => {
                const dateStr = new Date(completion.completedAt).toLocaleDateString('en-CA');
                dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
            });
        });

        return Array.from(dateMap.entries()).map(([date, count]) => ({
            date,
            count,
            level: Math.min(4, count) as 0 | 1 | 2 | 3 | 4
        }));
    }, [habits]);

    // Redirect if not logged in
    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <MainLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <div className={styles.loadingSpinner} />
                </div>
            </MainLayout>
        );
    }

    if (!user) return null;

    const completedCount = habits.filter(h => h.completedToday).length;
    const progressPercent = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

    const handleHabitCheck = (habitId: string, habitName: string) => {
        // Open proof modal when habit is checked
        setProofModal({ habitId, habitName });
    };

    const handleProofSubmit = (imageUrl: string, caption: string) => {
        if (proofModal) {
            completeHabit(proofModal.habitId, imageUrl, caption);
            setProofModal(null);
        }
    };

    const confirmDelete = () => {
        if (habitToDelete) {
            deleteHabit(habitToDelete.id);
            setHabitToDelete(null);
        }
    };

    return (
        <MainLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Habit Tracker</h1>
                        <p className={styles.subtitle}>Build consistency, one day at a time</p>
                    </div>
                    <motion.button
                        className={styles.addButton}
                        onClick={() => setShowAddModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <PlusIcon />
                        <span>Add Habit</span>
                    </motion.button>
                </div>

                {/* Progress Overview */}
                <motion.div
                    className={styles.progressCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.progressHeader}>
                        <div className={styles.progressInfo}>
                            <h2 className={styles.progressTitle}>Today's Progress</h2>
                            <p className={styles.progressText}>
                                {completedCount === habits.length && habits.length > 0
                                    ? "🎉 Perfect day! You've completed all habits!"
                                    : `${completedCount} of ${habits.length} habits completed`
                                }
                            </p>
                        </div>
                        <div className={styles.progressCircle}>
                            <svg viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="var(--bg-muted)"
                                    strokeWidth="8"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercent / 100) }}
                                    transform="rotate(-90 50 50)"
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--accent-primary)" />
                                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Line Chart Section */}
                <motion.div
                    className={styles.chartSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ marginBottom: 'var(--space-xl)' }}
                >
                    <ProgressLineChart />
                </motion.div>

                {/* Heatmap Section */}
                <motion.div
                    className={styles.heatmapSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Activity Overview</h2>
                    <Heatmap data={heatmapData} />
                </motion.div>

                {/* Habits List */}
                <motion.div
                    className={styles.habitsSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Your Habits</h2>

                    {habits.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📝</span>
                            <h3>No habits yet</h3>
                            <p>Start building your consistency by adding your first habit!</p>
                            <button
                                className={styles.emptyButton}
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Your First Habit
                            </button>
                        </div>
                    ) : (
                        <div className={styles.habitsList}>
                            {habits.map((habit, index) => (
                                <motion.div
                                    key={habit.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <HabitCard
                                        habit={habit}
                                        onCheck={() => handleHabitCheck(habit.id, habit.name)}
                                        onDelete={() => setHabitToDelete({ id: habit.id, name: habit.name })}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Modals */}
                <AnimatePresence>
                    {showAddModal && (
                        <AddHabitModal onClose={() => setShowAddModal(false)} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {proofModal && (
                        <ImageProofModal
                            habitName={proofModal.habitName}
                            onSubmit={handleProofSubmit}
                            onClose={() => setProofModal(null)}
                        />
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {habitToDelete && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                className={styles.deleteModal}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <h3>Delete Habit?</h3>
                                <p>Are you sure you want to delete <strong>{habitToDelete.name}</strong>? This action cannot be undone.</p>
                                <div className={styles.modalActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => setHabitToDelete(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={styles.deleteConfirmButton}
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </MainLayout >
    );
}
