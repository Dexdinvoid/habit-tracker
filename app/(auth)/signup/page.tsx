'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../login/page.module.css'; // Reusing login styles

import { Suspense } from 'react';

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get('ref');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        referral_code: referralCode || null, // Capture referral
                    },
                },
            });

            if (error) throw error;

            // Create profile for new user
            if (data.user) {
                const username = fullName?.split(' ')[0]?.toLowerCase() || email.split('@')[0];
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        username: username,
                        display_name: fullName,
                        avatar_url: null,
                        points: 0,
                        current_streak: 0,
                        highest_streak: 0,
                        created_at: new Date().toISOString(),
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    // Don't fail signup if profile creation fails
                }
            }

            // Redirect to home
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignup = async (provider: 'google' | 'apple') => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: referralCode ? { ref: referralCode } : undefined,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error('OAuth failed:', err);
            setError(err.message || `Failed to sign up with ${provider}`);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Join Consistency</h1>
                <p className={styles.subtitle}>Start your gamified habit journey today</p>
            </div>

            {error && (
                <motion.div
                    className={styles.error}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    {error}
                </motion.div>
            )}

            {/* OAuth Buttons */}
            <div className={styles.oauthButtons}>
                <button
                    className={styles.oauthButton}
                    onClick={() => handleOAuthSignup('google')}
                    disabled={isLoading}
                    type="button"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
                <button
                    className={styles.oauthButton}
                    onClick={() => handleOAuthSignup('apple')}
                    disabled={isLoading}
                    type="button"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.52-2.08-.54-3.23 0-1.44.69-2.2.5-3.08-.38C3.17 15.57 3.75 8.75 8.77 8.48c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.56-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.24 3.92zM12.03 8.41c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Continue with Apple
                </button>
            </div>

            <div className={styles.divider}>
                <span>or</span>
            </div>

            <form onSubmit={handleSignup} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                >
                    {isLoading ? <span className={styles.spinner} /> : 'Create Account'}
                </motion.button>
            </form>

            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Sign In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

export default function SignupPage() {
    return (
        <div className={styles.container}>
            {/* Background Ambience */}
            <div className={styles.background}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
            </div>

            <Suspense fallback={<div className={styles.card}><p>Loading...</p></div>}>
                <SignupForm />
            </Suspense>
        </div>
    );
}
