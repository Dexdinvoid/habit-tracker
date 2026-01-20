'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import { Challenge, ChallengeType } from '@/lib/types';
import styles from './page.module.css';

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: '#00ff88',
    medium: '#ffd700',
    hard: '#ff6b35',
    extreme: '#ff2a6d',
};

const DIFFICULTY_POINTS: Record<string, string> = {
    easy: '+50',
    medium: '+100',
    hard: '+150',
    extreme: '+200',
};

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

function getTimeRemaining(endDate: Date): string {
    const now = new Date();
    const diff = new Date(endDate).getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
}

export default function ChallengesPage() {
    const router = useRouter();
    const { user, challenges, isLoading } = useApp();
    const [activeTab, setActiveTab] = useState<ChallengeType | 'all'>('all');

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

    const filteredChallenges = activeTab === 'all'
        ? challenges
        : challenges.filter(c => c.type === activeTab);

    // Group by type for display
    const dailyChallenges = challenges.filter(c => c.type === 'daily');
    const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
    const monthlyChallenges = challenges.filter(c => c.type === 'monthly');

    return (
        <MainLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Challenges</h1>
                    <p className={styles.subtitle}>Push your limits and earn bonus points</p>
                </div>

                {/* Stats Overview */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🎯</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{challenges.length}</span>
                            <span className={styles.statLabel}>Active</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>✅</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>3</span>
                            <span className={styles.statLabel}>Completed</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>⚡</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>450</span>
                            <span className={styles.statLabel}>Pts Earned</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {(['all', 'daily', 'weekly', 'monthly'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Challenges List */}
                <div className={styles.challengesList}>
                    {filteredChallenges.map((challenge, index) => (
                        <motion.div
                            key={challenge.id}
                            className={styles.challengeCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -2 }}
                        >
                            <div className={styles.challengeHeader}>
                                <div
                                    className={styles.difficultyBadge}
                                    style={{ background: DIFFICULTY_COLORS[challenge.difficulty] }}
                                >
                                    {challenge.difficulty}
                                </div>
                                <div className={styles.typeBadge}>
                                    {challenge.type}
                                </div>
                                <div className={styles.timeRemaining}>
                                    <ClockIcon />
                                    {getTimeRemaining(challenge.endsAt)}
                                </div>
                            </div>

                            <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                            <p className={styles.challengeDescription}>{challenge.description}</p>

                            <div className={styles.challengeFooter}>
                                <div className={styles.progressSection}>
                                    <div className={styles.progressBar}>
                                        <motion.div
                                            className={styles.progressFill}
                                            initial={{ width: 0 }}
                                            animate={{ width: '35%' }}
                                            transition={{ duration: 0.8 }}
                                            style={{ background: DIFFICULTY_COLORS[challenge.difficulty] }}
                                        />
                                    </div>
                                    <span className={styles.progressText}>7/{challenge.targetCount}</span>
                                </div>
                                <div className={styles.rewardBadge}>
                                    {DIFFICULTY_POINTS[challenge.difficulty]} pts
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Challenge Banner */}
                <motion.div
                    className={styles.aiBanner}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className={styles.aiBannerContent}>
                        <span className={styles.aiIcon}>🤖</span>
                        <div>
                            <h3 className={styles.aiTitle}>AI-Powered Challenges</h3>
                            <p className={styles.aiDescription}>
                                New personalized challenges will be generated based on your habits and performance
                            </p>
                        </div>
                    </div>
                    <span className={styles.comingSoon}>Coming Soon</span>
                </motion.div>
            </div>
        </MainLayout>
    );
}
