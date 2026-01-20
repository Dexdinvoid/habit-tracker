'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LeagueTier } from '@/lib/types';
import styles from './LeagueBadge.module.css';

interface LeagueBadgeProps {
    tier: LeagueTier;
    rank?: 1 | 2 | 3;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const LEAGUE_CONFIG: Record<LeagueTier, { icon: string; color: string; glow: string }> = {
    unranked: { icon: '○', color: '#555566', glow: 'rgba(85, 85, 102, 0.3)' },
    iron: { icon: '⚙️', color: '#6b6b7b', glow: 'rgba(107, 107, 123, 0.3)' },
    bronze: { icon: '🥉', color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.4)' },
    silver: { icon: '🥈', color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.4)' },
    gold: { icon: '🥇', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)' },
    diamond: { icon: '💎', color: '#b9f2ff', glow: 'rgba(185, 242, 255, 0.5)' },
    platinum: { icon: '💠', color: '#40e0d0', glow: 'rgba(64, 224, 208, 0.4)' },
    ascendant: { icon: '⬆️', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.4)' },
    immortal: { icon: '👑', color: '#ff2a6d', glow: 'rgba(255, 42, 109, 0.5)' },
    radiant: { icon: '✨', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)' },
};

const ROMAN_NUMERALS: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
};

export default function LeagueBadge({
    tier,
    rank = 1,
    size = 'md',
    showLabel = false
}: LeagueBadgeProps) {
    const config = LEAGUE_CONFIG[tier];
    const isRadiant = tier === 'radiant';

    return (
        <motion.div
            className={`${styles.badge} ${styles[size]} ${isRadiant ? styles.radiant : ''}`}
            style={{
                '--league-color': config.color,
                '--league-glow': config.glow,
            } as React.CSSProperties}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
        >
            <span className={styles.icon}>{config.icon}</span>
            {tier !== 'unranked' && tier !== 'radiant' && (
                <span className={styles.rank}>{ROMAN_NUMERALS[rank]}</span>
            )}
            {showLabel && (
                <span className={styles.label}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </span>
            )}
        </motion.div>
    );
}
