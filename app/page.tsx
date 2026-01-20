'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import FeedCard from '@/components/social/FeedCard';
import LeagueBadge from '@/components/gamification/LeagueBadge';
import Link from 'next/link';
import LeagueInfoModal from '@/components/gamification/LeagueInfoModal';
import { AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { user, userStats, feedPosts, habits, isLoading } = useApp();
  const [showLeagueModal, setShowLeagueModal] = React.useState(false);

  // Redirect to login if not logged in
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

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.heroContent}>
            <h1 className={styles.greeting}>
              Welcome back, <span className={styles.name}>{user.displayName.split(' ')[0]}</span>
            </h1>
            <p className={styles.subtext}>
              {completedToday === totalHabits && totalHabits > 0
                ? "🎉 You crushed it today! All habits complete!"
                : `You've completed ${completedToday} of ${totalHabits} habits today`
              }
            </p>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <motion.div
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className={styles.statIcon}>🔥</div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats?.currentStreak || 0}</span>
                <span className={styles.statLabel}>Day Streak</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats?.totalPoints || 0}</span>
                <span className={styles.statLabel}>Total Points</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setShowLeagueModal(true)}
              style={{ cursor: 'pointer' }}
            >
              <LeagueBadge
                tier={userStats?.league || 'unranked'}
                rank={userStats?.leagueRank || 1}
                size="sm"
              />
              <div className={styles.statInfo}>
                <span className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                  {userStats?.league || 'Unranked'}
                </span>
                <span className={styles.statLabel}>Current League</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{userStats?.habitsCompleted || 0}</span>
                <span className={styles.statLabel}>Habits Done</span>
              </div>
            </motion.div>
          </div>

          {/* Today's Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Today's Progress</span>
              <span>{completedToday}/{totalHabits}</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.section>

        {/* Social Feed */}
        <section className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h2 className={styles.feedTitle}>Friend Activity</h2>
            <span className={styles.feedSubtitle}>See what your friends are achieving</span>
          </div>

          <div className={styles.feed}>
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FeedCard post={post} />
              </motion.div>
            ))}
          </div>
        </section>

        <AnimatePresence>
          {showLeagueModal && (
            <LeagueInfoModal
              currentLeague={userStats?.league || 'unranked'}
              onClose={() => setShowLeagueModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
