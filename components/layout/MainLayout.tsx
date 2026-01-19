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
                    <div className={styles.loadingLogo}>✦</div>
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
