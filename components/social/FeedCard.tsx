'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import { FeedPost } from '@/lib/types';
import styles from './FeedCard.module.css';

interface FeedCardProps {
    post: FeedPost;
}

// Helper to format time ago
function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CommentIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export default function FeedCard({ post }: FeedCardProps) {
    const { likePost } = useApp();
    const [showComments, setShowComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        likePost(post.id);
        setTimeout(() => setIsLiking(false), 300);
    };

    return (
        <motion.div
            className={styles.card}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.user}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={post.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
                            alt={post.user.displayName}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.displayName}>{post.user.displayName}</span>
                        <span className={styles.username}>@{post.user.username}</span>
                    </div>
                </div>
                <span className={styles.time}>{timeAgo(post.createdAt)}</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.habitInfo}>
                    <span className={styles.habitIcon}>{post.habitIcon}</span>
                    <span className={styles.habitName}>Completed <strong>{post.habitName}</strong></span>
                    <span className={styles.points}>+{post.pointsEarned} pts</span>
                </div>
            </div>

            {/* Proof Image */}
            <div className={styles.imageWrapper}>
                <img
                    src={post.proofImageUrl}
                    alt={`Proof of ${post.habitName}`}
                    className={styles.proofImage}
                />
                <div className={styles.imageOverlay}>
                    <span className={styles.proofBadge}>
                        ✓ Verified Proof
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <motion.button
                    className={`${styles.actionButton} ${post.isLiked ? styles.liked : ''}`}
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                >
                    <HeartIcon filled={post.isLiked} />
                    <span>{post.likes}</span>
                </motion.button>

                <button
                    className={styles.actionButton}
                    onClick={() => setShowComments(!showComments)}
                >
                    <CommentIcon />
                    <span>{post.comments}</span>
                </button>
            </div>
        </motion.div>
    );
}
