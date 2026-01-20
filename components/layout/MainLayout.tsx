'use client';

import React, { ReactNode } from 'react';
import { useApp } from '@/lib/AppContext';
import Navbar from '@/components/navigation/Navbar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { user, isLoading } = useApp();

    if (isLoading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingLogo}>
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="loadLogoGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="var(--accent-secondary)" />
                                    <stop offset="50%" stopColor="var(--accent-primary)" />
                                    <stop offset="100%" stopColor="var(--accent-tertiary, var(--accent-primary))" />
                                </linearGradient>
                                <linearGradient id="loadLogoInner" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.6" />
                                </linearGradient>
                                <filter id="loadGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Main Flame */}
                            <path
                                d="M50 5C50 5 25 35 25 55C25 72 36 85 50 85C64 85 75 72 75 55C75 35 50 5 50 5ZM35 58C35 45 45 28 50 20C55 28 65 45 65 58C65 70 58 78 50 78C42 78 35 70 35 58Z"
                                fill="url(#loadLogoGradient)"
                                filter="url(#loadGlow)"
                            />
                            {/* Left Wing */}
                            <path d="M30 65C15 60 10 45 15 35C20 50 30 55 40 52C35 58 32 62 30 65Z" fill="url(#loadLogoGradient)" opacity="0.85" />
                            {/* Right Wing */}
                            <path d="M70 65C85 60 90 45 85 35C80 50 70 55 60 52C65 58 68 62 70 65Z" fill="url(#loadLogoGradient)" opacity="0.85" />
                            {/* Inner Core */}
                            <path d="M50 30C50 30 40 48 40 58C40 66 44 72 50 72C56 72 60 66 60 58C60 48 50 30 50 30Z" fill="url(#loadLogoInner)" />
                            {/* Center Spark */}
                            <ellipse cx="50" cy="55" rx="4" ry="6" fill="var(--text-primary)" opacity="0.7" />
                        </svg>
                    </div>
                    <div className={styles.loadingText}>Loading...</div>
                    <div className={styles.loadingBar}>
                        <div className={styles.loadingProgress}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            {user && <Navbar />}
            <main className={`${styles.main} ${user ? styles.hasNavbar : ''}`}>
                {children}
            </main>
        </div>
    );
}
