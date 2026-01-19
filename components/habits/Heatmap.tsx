'use client';

import React, { useMemo } from 'react';
import { generateHeatmapData } from '@/lib/mockData';
import styles from './Heatmap.module.css';

interface HeatmapProps {
    days?: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function Heatmap({ days = 365 }: HeatmapProps) {
    const data = useMemo(() => generateHeatmapData(days), [days]);

    // Group data by weeks
    const weeks = useMemo(() => {
        const result: typeof data[] = [];
        let currentWeek: typeof data = [];

        // Get the day of week of the first date (0 = Sunday)
        const firstDate = new Date(data[0].date);
        const startDayOfWeek = firstDate.getDay();

        // Add empty cells for alignment
        for (let i = 0; i < startDayOfWeek; i++) {
            currentWeek.push({ date: '', count: 0, level: 0 });
        }

        data.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                result.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            result.push(currentWeek);
        }

        return result;
    }, [data]);

    // Get month labels with their positions
    const monthLabels = useMemo(() => {
        const labels: { month: string; index: number }[] = [];
        let lastMonth = -1;

        weeks.forEach((week, weekIndex) => {
            const firstValidDay = week.find(d => d.date);
            if (firstValidDay && firstValidDay.date) {
                const month = new Date(firstValidDay.date).getMonth();
                if (month !== lastMonth) {
                    labels.push({ month: MONTHS[month], index: weekIndex });
                    lastMonth = month;
                }
            }
        });

        return labels;
    }, [weeks]);

    const totalCompletions = data.reduce((sum, day) => sum + day.count, 0);
    const activeDays = data.filter(day => day.count > 0).length;

    return (
        <div className={styles.container}>
            {/* Stats Summary */}
            <div className={styles.statsSummary}>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{totalCompletions}</span>
                    <span className={styles.statLabel}>Total completions</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{activeDays}</span>
                    <span className={styles.statLabel}>Active days</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{Math.round((activeDays / days) * 100)}%</span>
                    <span className={styles.statLabel}>Consistency</span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className={styles.heatmapWrapper}>
                {/* Month Labels */}
                <div className={styles.monthLabels}>
                    {monthLabels.map(({ month, index }) => (
                        <span
                            key={`${month}-${index}`}
                            className={styles.monthLabel}
                            style={{ gridColumn: index + 2 }}
                        >
                            {month}
                        </span>
                    ))}
                </div>

                <div className={styles.gridContainer}>
                    {/* Day Labels */}
                    <div className={styles.dayLabels}>
                        {DAYS.map((day, i) => (
                            <span key={i} className={styles.dayLabel}>{day}</span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className={styles.grid}>
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className={styles.week}>
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={`${styles.cell} ${styles[`level${day.level}`]}`}
                                        data-date={day.date}
                                        data-count={day.count}
                                        title={day.date ? `${day.date}: ${day.count} completions` : ''}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <span className={styles.legendLabel}>Less</span>
                <div className={`${styles.cell} ${styles.level0}`} />
                <div className={`${styles.cell} ${styles.level1}`} />
                <div className={`${styles.cell} ${styles.level2}`} />
                <div className={`${styles.cell} ${styles.level3}`} />
                <div className={`${styles.cell} ${styles.level4}`} />
                <span className={styles.legendLabel}>More</span>
            </div>
        </div>
    );
}
