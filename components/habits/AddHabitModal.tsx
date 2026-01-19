'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import { HabitFrequency } from '@/lib/types';
import styles from './AddHabitModal.module.css';

interface AddHabitModalProps {
    onClose: () => void;
}

const HABIT_ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🎯', '✍️', '🎨', '🎵', '💻', '🌱', '😴', '🧠', '🍎', '💊'];
const HABIT_COLORS = ['#ff2a6d', '#05d9e8', '#d300c5', '#00ff88', '#ffd700', '#a855f7', '#ff6b35', '#22d3ee'];

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function AddHabitModal({ onClose }: AddHabitModalProps) {
    const { addHabit } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '💪',
        color: '#ff2a6d',
        frequency: 'daily' as HabitFrequency,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        addHabit(formData);
        onClose();
    };

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Create New Habit</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Name */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Habit Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g., Morning Workout"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description (optional)</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="What does completing this habit look like?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                        />
                    </div>

                    {/* Icon Selection */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Choose an Icon</label>
                        <div className={styles.iconGrid}>
                            {HABIT_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    className={`${styles.iconButton} ${formData.icon === icon ? styles.selected : ''}`}
                                    onClick={() => setFormData({ ...formData, icon })}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Choose a Color</label>
                        <div className={styles.colorGrid}>
                            {HABIT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`${styles.colorButton} ${formData.color === color ? styles.selected : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData({ ...formData, color })}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Frequency</label>
                        <div className={styles.frequencyOptions}>
                            {(['daily', 'weekly'] as HabitFrequency[]).map((freq) => (
                                <button
                                    key={freq}
                                    type="button"
                                    className={`${styles.frequencyButton} ${formData.frequency === freq ? styles.selected : ''}`}
                                    onClick={() => setFormData({ ...formData, frequency: freq })}
                                >
                                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className={styles.preview}>
                        <span className={styles.previewLabel}>Preview</span>
                        <div className={styles.previewCard}>
                            <div
                                className={styles.previewCheckbox}
                                style={{ borderColor: formData.color }}
                            />
                            <span className={styles.previewIcon}>{formData.icon}</span>
                            <span className={styles.previewName}>
                                {formData.name || 'Your Habit'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <motion.button
                            type="submit"
                            className={styles.submitButton}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Create Habit
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
