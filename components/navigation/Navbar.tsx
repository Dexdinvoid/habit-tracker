'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import { useTheme } from '@/lib/ThemeProvider';
import styles from './Navbar.module.css';

// Icon components
const HomeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const TrackerIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const FriendsIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ChallengesIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const FlameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.65 0-7-2.76-7-7.5 0-3.82 2.5-6.95 5.02-9.74.65-.72 1.91-.5 2.23.39.2.57.08 1.2-.29 1.65-.92 1.12-1.96 2.37-1.96 3.7 0 2.21 2.24 2.5 3 2.5s3-.29 3-2.5c0-1.33-1.04-2.58-1.96-3.7-.37-.45-.49-1.08-.29-1.65.32-.89 1.58-1.11 2.23-.39C18.5 8.55 21 11.68 21 15.5c0 4.74-3.35 7.5-7 7.5h-2z" />
    </svg>
);

const MessagesIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const navItems = [
    { id: 'home', label: 'Home', href: '/', icon: HomeIcon },
    { id: 'tracker', label: 'Tracker', href: '/tracker', icon: TrackerIcon },
    { id: 'friends', label: 'Friends', href: '/friends', icon: FriendsIcon },
    { id: 'messages', label: 'Messages', href: '/messages', icon: MessagesIcon },
    { id: 'challenges', label: 'Challenges', href: '/challenges', icon: ChallengesIcon },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, userStats } = useApp();
    const { theme, setTheme } = useTheme();

    if (!user) return null;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <motion.div
                            className={styles.logoIcon}
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                        >
                            <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    {/* Theme-aware gradient using CSS variables */}
                                    <linearGradient id="logoGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="var(--accent-secondary)" />
                                        <stop offset="50%" stopColor="var(--accent-primary)" />
                                        <stop offset="100%" stopColor="var(--accent-tertiary, var(--accent-primary))" />
                                    </linearGradient>
                                    <linearGradient id="logoInnerGradient" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.6" />
                                    </linearGradient>
                                    <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {/* Outer Flame - Intertwined Design */}
                                <path
                                    d="M50 5C50 5 25 35 25 55C25 72 36 85 50 85C64 85 75 72 75 55C75 35 50 5 50 5ZM35 58C35 45 45 28 50 20C55 28 65 45 65 58C65 70 58 78 50 78C42 78 35 70 35 58Z"
                                    fill="url(#logoGradient)"
                                    filter="url(#logoGlow)"
                                />
                                {/* Left Wing/Tendril */}
                                <path
                                    d="M30 65C15 60 10 45 15 35C20 50 30 55 40 52C35 58 32 62 30 65Z"
                                    fill="url(#logoGradient)"
                                    opacity="0.85"
                                />
                                {/* Right Wing/Tendril */}
                                <path
                                    d="M70 65C85 60 90 45 85 35C80 50 70 55 60 52C65 58 68 62 70 65Z"
                                    fill="url(#logoGradient)"
                                    opacity="0.85"
                                />
                                {/* Inner Core Flame */}
                                <path
                                    d="M50 30C50 30 40 48 40 58C40 66 44 72 50 72C56 72 60 66 60 58C60 48 50 30 50 30Z"
                                    fill="url(#logoInnerGradient)"
                                />
                                {/* Bright Center Spark */}
                                <ellipse cx="50" cy="55" rx="4" ry="6" fill="var(--text-primary)" opacity="0.7" />
                            </svg>
                        </motion.div>
                        <span className={styles.logoText}>Consistency</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className={styles.navLinks}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    <Icon />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            className={styles.activeIndicator}
                                            layoutId="navbar-indicator"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className={styles.rightSection}>
                        {/* Streak Display */}
                        <div className={styles.streak}>
                            <FlameIcon />
                            <span>{userStats?.currentStreak || 0}</span>
                        </div>

                        {/* Points Display */}
                        <div className={styles.points}>
                            <span className={styles.pointsValue}>{userStats?.totalPoints || 0}</span>
                            <span className={styles.pointsLabel}>pts</span>
                        </div>

                        {/* Profile */}
                        <Link href="/profile" className={styles.profile}>
                            <div className={styles.avatarRing}>
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt={user.displayName}
                                    className={styles.avatar}
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.mobileNav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                        >
                            <Icon />
                            <span>{item.label}</span>
                            {isActive && (
                                <motion.div
                                    className={styles.mobileActiveIndicator}
                                    layoutId="mobile-navbar-indicator"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
