'use client';

import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import styles from './ProgressLineChart.module.css';

import DailyDetailModal from './DailyDetailModal';
import { AnimatePresence } from 'framer-motion';

// Mock habit templates for data generation
const MOCK_HABIT_TEMPLATES = [
    { id: 'h1', name: 'Morning Workout', icon: '💪' },
    { id: 'h2', name: 'Read 20 Pages', icon: '📚' },
    { id: 'h3', name: 'Meditate', icon: '🧘' },
    { id: 'h4', name: 'Drink Water', icon: '💧' },
    { id: 'h5', name: 'Code Session', icon: '💻' },
];

// Helper to generate mock activity data for the chart
const generateChartData = (period: number | 'year') => {
    const data = [];
    const today = new Date();

    let startDate: Date;
    let daysToGenerate: number;

    if (period === 'year') {
        // Fixed start: Jan 1, 2026
        startDate = new Date('2026-01-01');
        // Calculate days from Jan 1 to today
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        daysToGenerate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
        // Relative start: "days" ago
        daysToGenerate = period;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (period - 1));
    }

    // Base completion rate around 60% with random fluctuations
    let currentRate = 60;

    for (let i = 0; i < daysToGenerate; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Don't generate future data beyond today
        if (date > today) break;

        // Random fluctuation between -15% and +15%
        const fluctuation = Math.floor(Math.random() * 30) - 15;
        currentRate = Math.max(0, Math.min(100, currentRate + fluctuation));

        // Generate daily habits status
        const dailyHabits = MOCK_HABIT_TEMPLATES.map(habit => ({
            ...habit,
            completed: Math.random() > 0.4 // 60% chance of completion
        }));

        const completedCount = dailyHabits.filter(h => h.completed).length;
        const actualRate = Math.round((completedCount / MOCK_HABIT_TEMPLATES.length) * 100);

        // Create a formatted date string (e.g., "Jan 20")
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        data.push({
            date: dateStr,
            completionRate: actualRate, // Use calculated rate from habits
            points: completedCount * 10,
            habits: dailyHabits
        });
    }
    return data;
};

const PERIOD_OPTIONS = [
    { label: '7D', value: 7 },
    { label: '14D', value: 14 },
    { label: '30D', value: 30 },
    { label: '3M', value: 90 },
    { label: '2026', value: 'year' },
    { label: 'All', value: 'year' },
];

import { useApp } from '@/lib/AppContext';

export default function ProgressLineChart() {
    const { habits, user } = useApp();
    const [selectedPeriod, setSelectedPeriod] = React.useState<number | string>(14);
    const [clickedDateData, setClickedDateData] = React.useState<any>(null);

    const data = useMemo(() => {
        const period = selectedPeriod;
        const today = new Date();
        let startDate: Date;
        let daysToGenerate: number;

        if (period === 'year') {
            startDate = new Date(today.getFullYear(), 0, 1);
            const diffTime = Math.abs(today.getTime() - startDate.getTime());
            daysToGenerate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        } else {
            daysToGenerate = typeof period === 'number' ? period : 30;
            startDate = new Date(today);
            startDate.setDate(today.getDate() - (daysToGenerate - 1));
        }

        const chartData = [];

        for (let i = 0; i < daysToGenerate; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            if (date > today) break;

            const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD

            // Calculate stats for this day
            // Find completions for this date across all habits
            let completedCount = 0;
            const activeHabitsCount = habits.length || 1; // Avoid divide by zero

            habits.forEach(habit => {
                const hasCompletion = habit.completions?.some(c =>
                    new Date(c.completedAt).toLocaleDateString('en-CA') === dateStr
                );
                if (hasCompletion) completedCount++;
            });

            const completionRate = Math.round((completedCount / activeHabitsCount) * 100);

            chartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                completionRate,
                points: completedCount * 10,
                // Passing minimal habit info for modal if needed, or just leave empty for now as modal might expect mocks
                habits: habits.map(h => ({
                    id: h.id,
                    name: h.name,
                    icon: h.icon,
                    completed: h.completions?.some(c =>
                        new Date(c.completedAt).toLocaleDateString('en-CA') === dateStr
                    )
                }))
            });
        }
        return chartData;
    }, [habits, selectedPeriod]);

    const handleChartClick = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setClickedDateData(data.activePayload[0].payload);
        }
    };

    return (
        <React.Fragment>
            <div className={styles.chartContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Consistency Trend</h3>
                    <div className={styles.periodSelector}>
                        {PERIOD_OPTIONS.map((option) => (
                            <button
                                key={option.label}
                                className={`${styles.periodButton} ${selectedPeriod === option.value ? styles.active : ''}`}
                                onClick={() => setSelectedPeriod(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                vertical={false}
                                stroke="var(--border-color)"
                                strokeDasharray="3 3"
                                opacity={0.3}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                dy={10}
                                interval={selectedPeriod === 'year' || (typeof selectedPeriod === 'number' && selectedPeriod > 90) ? 30 : (typeof selectedPeriod === 'number' && selectedPeriod > 30) ? 6 : (typeof selectedPeriod === 'number' && selectedPeriod > 14) ? 2 : 0}
                            />
                            <YAxis
                                hide={true}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                isAnimationActive={false}
                                cursor={{ stroke: 'var(--text-secondary)', strokeWidth: 1, strokeDasharray: '5 5' }}
                                contentStyle={{
                                    backgroundColor: 'var(--bg-surface)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                                labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                                formatter={(value: number | undefined) => [value ? `${value}%` : '0%', 'Consistency']}
                            />
                            <Area
                                type="monotone"
                                dataKey="completionRate"
                                stroke="var(--accent-primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRate)"
                                animationDuration={1000}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 0,
                                    fill: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    onClick: (e: any, payload: any) => {
                                        // Recharts handle click signature varies, safest to check payload existence
                                        // The 'e' argument might not be a standard event object here
                                        const clickedPayload = payload || (e && e.payload);
                                        if (clickedPayload && clickedPayload.payload) {
                                            setClickedDateData(clickedPayload.payload);
                                        }
                                    }
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <AnimatePresence>
                {clickedDateData && (
                    <DailyDetailModal
                        data={clickedDateData}
                        onClose={() => setClickedDateData(null)}
                    />
                )}
            </AnimatePresence>
        </React.Fragment>
    );
}
