'use client';

import React, { useMemo } from 'react';
import styles from './Heatmap.module.css';

interface HeatmapProps {
    days?: number;
    data?: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function Heatmap({ year = 2026, data: providedData }: { year?: number; data?: any[] }) {
    // Generate full year calendar data
    const calendarData = useMemo(() => {
        const days = [];
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const daysInYear = isLeapYear ? 366 : 365;

        // Use local time for Jan 1st 00:00:00
        const startDate = new Date(year, 0, 1);

        // Create a map for quick accumulated data lookup if provided
        const sourceData = providedData || [];
        const dataMap = new Map(sourceData.map(d => [d.date, d]));

        for (let i = 0; i < daysInYear; i++) {
            const currentDate = new Date(year, 0, 1); // Start fresh each time to avoid drift
            currentDate.setDate(1 + i); // Add days

            // Get local YYYY-MM-DD string
            const dateString = currentDate.toLocaleDateString('en-CA');

            const existing = dataMap.get(dateString);

            days.push({
                date: dateString,
                count: existing?.count || 0,
                level: existing?.level || 0,
            });
        }
        return days;
    }, [year, providedData]);

    // Group data by weeks for column-based layout (vertical weeks)
    const weeks = useMemo(() => {
        const result = [];
        let currentWeek: typeof calendarData = [];

        // Determine padding for the first week (Jan 1 day of week)
        const startDate = new Date(year, 0, 1);
        const startDayOfWeek = startDate.getDay(); // 0 = Sun, 1 = Mon, etc. Local time

        for (let i = 0; i < startDayOfWeek; i++) {
            currentWeek.push({ date: '', count: 0, level: 0 });
        }

        calendarData.forEach((day) => {
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
    }, [calendarData, year]);

    // Calculate month label positions based on weeks
    const monthLabels = useMemo(() => {
        const labels: { month: string; index: number }[] = [];

        weeks.forEach((week, weekIndex) => {
            // Find first valid day in this week
            const firstDayOfWeek = week.find(d => d.date !== '');
            if (!firstDayOfWeek) return;

            // Parse YYYY-MM-DD string back to component to get Month
            // "2026-01-20" -> split
            const [y, m, d] = firstDayOfWeek.date.split('-').map(Number);
            // Month is 0-indexed in JS Date, but 1-indexed in string (01). So m-1.
            const month = m - 1;

            // Simplest heuristic: check if the month changed from previous week
            const prevWeek = weekIndex > 0 ? weeks[weekIndex - 1] : null;
            const prevDayStr = prevWeek ? prevWeek.find(d => d.date !== '')?.date : null;

            if (!prevDayStr) {
                labels.push({ month: MONTHS[month], index: weekIndex });
            } else {
                const [py, pm, pd] = prevDayStr.split('-').map(Number);
                if (pm - 1 !== month) {
                    labels.push({ month: MONTHS[month], index: weekIndex });
                }
            }
        });

        return labels;
    }, [weeks]);

    const totalCompletions = calendarData.reduce((sum, day) => sum + day.count, 0);
    const activeDays = calendarData.filter(day => day.count > 0).length;

    const [hoveredDay, setHoveredDay] = React.useState<{ date: string; count: number; level: number } | null>(null);

    const handleMouseEnter = (day: any) => {
        setHoveredDay(day);
    };

    const handleMouseLeave = () => {
        setHoveredDay(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                {/* Stats Summary - Compact version */}
                <div className={styles.statsSummary}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{totalCompletions}</span>
                        <span className={styles.statLabel}>Total</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{Math.round((activeDays / calendarData.length) * 100)}%</span>
                        <span className={styles.statLabel}>Consistency</span>
                    </div>
                </div>

                {/* Day Detail Card - Fixed Position Area */}
                <div className={styles.dayDetailCard}>
                    {hoveredDay ? (
                        <div className={styles.activeDetailContent}>
                            <div className={styles.detailDate}>
                                {(() => {
                                    const [y, m, d] = hoveredDay.date.split('-').map(Number);
                                    const date = new Date(y, m - 1, d);
                                    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                                })()}
                            </div>
                            <div className={styles.detailStats}>
                                <span className={styles.detailCount}>
                                    {hoveredDay.count > 0 ? '🔥' : '⚫'} <strong>{hoveredDay.count}</strong> completions
                                </span>
                                {hoveredDay.count > 0 && (
                                    <span className={styles.detailMessage}>
                                        {hoveredDay.count >= 5 ? 'Incredible focus! 🚀' :
                                            hoveredDay.count >= 3 ? 'Great momentum! 💪' : 'Good start! 🌱'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyDetailContent}>
                            <span className={styles.hintIcon}>👆</span>
                            <span>Hover over the grid to see daily details</span>
                        </div>
                    )}
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
                            style={{
                                left: `${index * 14}px`,
                                gridColumn: index + 2
                            }}
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
                                        className={`${styles.cell} ${styles[`level${day.level || 0}`]} ${!day.date ? styles.empty : ''}`}
                                        onMouseEnter={() => handleMouseEnter(day)}
                                        onMouseLeave={handleMouseLeave}
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
