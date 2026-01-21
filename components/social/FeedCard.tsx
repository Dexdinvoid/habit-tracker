'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [comments, setComments] = useState<any[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [newComment, setNewComment] = useState('');
    const { user, likePost, addComment, fetchComments } = useApp();

    const handleAvatarClick = () => {
        router.push(`/profile/${post.userId}`);
    };

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        likePost(post.id);
        setTimeout(() => setIsLiking(false), 300);
    };

    const toggleComments = async () => {
        if (!showComments) {
            setIsLoadingComments(true);
            try {
                const fetchedComments = await fetchComments(post.id);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Failed to load comments', error);
            } finally {
                setIsLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            await addComment(post.id, newComment);
            setNewComment('');
            // Refresh comments to show new one
            const fetchedComments = await fetchComments(post.id);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Failed to post comment', error);
        }
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
                    <div className={styles.avatarWrapper} onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                        <img
                            src={post.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
                            alt={post.user.displayName}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userInfo} onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
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
                    onClick={toggleComments}
                >
                    <CommentIcon />
                    <span>{post.comments}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <motion.div
                    className={styles.commentsSection}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <div className={styles.commentsList}>
                        {isLoadingComments ? (
                            <div className={styles.loadingComments}>Loading...</div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className={styles.commentItem}>
                                    <span className={styles.commentUser}>{comment.user.username}</span>
                                    <span className={styles.commentText}>{comment.content}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noComments}>No comments yet. Be the first!</div>
                        )}
                    </div>

                    {user && (
                        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                            <input
                                type="text"
                                className={styles.commentInput}
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                className={styles.postButton}
                                disabled={!newComment.trim()}
                            >
                                Post
                            </button>
                        </form>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
