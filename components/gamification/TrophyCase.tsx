'use client';

import React from 'react';
import { ACHIEVEMENTS_LIST } from '@/lib/achievements';
import { UserStats } from '@/lib/types';
import styles from './TrophyCase.module.css';

interface TrophyCaseProps {
    stats: UserStats | null;
}

export default function TrophyCase({ stats }: TrophyCaseProps) {
    if (!stats) return null;

    const unlockedIds = stats.achievements.map(a => a.id);

    return (
        <div className={styles.trophyCase}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>🏆</span> Trophy Case
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {unlockedIds.length} / {ACHIEVEMENTS_LIST.length} Unlocked
                </div>
            </div>

            <div className={styles.grid}>
                {ACHIEVEMENTS_LIST.map(achievement => {
                    const isUnlocked = unlockedIds.includes(achievement.id);

                    return (
                        <div
                            key={achievement.id}
                            className={`${styles.trophy} ${isUnlocked ? styles.unlocked : styles.locked}`}
                        >
                            <span className={styles.icon}>{achievement.icon}</span>

                            <div className={styles.tooltip}>
                                <span className={styles.tooltipTitle}>{achievement.name}</span>
                                <span className={styles.tooltipDesc}>{achievement.description}</span>
                                <span className={`${styles.rarity} ${styles[achievement.rarity]}`}>
                                    {achievement.rarity}
                                </span>
                                {isUnlocked && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#888' }}>
                                        Unlocked
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
