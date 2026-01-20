'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface InviterProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    points: number;
}

function InviteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    const [inviter, setInviter] = useState<InviterProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInviter = async () => {
            if (!ref) {
                setError('Invalid invite link');
                setIsLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('id, username, display_name, avatar_url, points')
                .eq('id', ref)
                .single();

            if (fetchError || !data) {
                setError('Inviter not found');
                setIsLoading(false);
                return;
            }

            setInviter(data);
            setIsLoading(false);
        };

        fetchInviter();
    }, [ref]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingSpinner} />
            </div>
        );
    }

    if (error || !inviter) {
        return (
            <div className={styles.container}>
                <div className={styles.background}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                </div>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.errorIcon}>❌</div>
                    <h1 className={styles.title}>Invalid Invite</h1>
                    <p className={styles.subtitle}>{error || 'This invite link is no longer valid'}</p>
                    <Link href="/signup" className={styles.primaryButton}>
                        Sign Up Anyway
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Animated Background */}
            <div className={styles.background}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.orb3} />
            </div>

            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* App Logo */}
                <motion.div
                    className={styles.logo}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                >
                    ✦
                </motion.div>

                {/* Inviter Section */}
                <div className={styles.inviterSection}>
                    <img
                        src={inviter.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviter.username}`}
                        alt={inviter.display_name}
                        className={styles.inviterAvatar}
                    />
                    <div className={styles.inviterInfo}>
                        <p className={styles.invitedBy}>You've been invited by</p>
                        <h2 className={styles.inviterName}>{inviter.display_name || inviter.username}</h2>
                        <span className={styles.inviterStats}>⭐ {inviter.points.toLocaleString()} points</span>
                    </div>
                </div>

                {/* App Info */}
                <div className={styles.appInfo}>
                    <h1 className={styles.appTitle}>Join Consistency</h1>
                    <p className={styles.appDescription}>
                        Build habits, track progress, compete with friends, and level up your life!
                    </p>
                </div>

                {/* Features */}
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🎯</span>
                        <span>Daily habit tracking</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🏆</span>
                        <span>Competitive leagues</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>📸</span>
                        <span>Photo proof system</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>👥</span>
                        <span>Social accountability</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className={styles.ctaButtons}>
                    <Link
                        href={`/signup?ref=${ref}`}
                        className={styles.primaryButton}
                    >
                        Join Now - It's Free!
                    </Link>
                    <Link
                        href={`/login?ref=${ref}`}
                        className={styles.secondaryButton}
                    >
                        Already have an account? Sign In
                    </Link>
                </div>

                {/* Trust Badge */}
                <div className={styles.trustBadge}>
                    <span>🔒</span>
                    <span>Join 1000+ habit builders</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function InvitePage() {
    return (
        <Suspense fallback={<div className={styles.container}><div className={styles.loadingSpinner} /></div>}>
            <InviteContent />
        </Suspense>
    );
}
