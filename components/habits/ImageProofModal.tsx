'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ImageProofModal.module.css';

interface ImageProofModalProps {
    habitName: string;
    onSubmit: (imageUrl: string, caption: string) => void;
    onClose: () => void;
}

const CameraIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Demo images for quick selection
const DEMO_PROOFS = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
];

export default function ImageProofModal({ habitName, onSubmit, onClose }: ImageProofModalProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        onSubmit(selectedImage, caption);
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
                    <div>
                        <h2 className={styles.title}>Proof of Completion</h2>
                        <p className={styles.subtitle}>Upload proof for "{habitName}"</p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {selectedImage ? (
                        <div className={styles.preview}>
                            <img src={selectedImage} alt="Proof preview" className={styles.previewImage} />
                            <button
                                className={styles.changeButton}
                                onClick={() => setSelectedImage(null)}
                            >
                                Change Image
                            </button>
                            {/* Caption Input */}
                            <div className={styles.captionSection}>
                                <label className={styles.captionLabel}>Add a caption (optional)</label>
                                <textarea
                                    className={styles.captionInput}
                                    placeholder="Share what you accomplished..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    maxLength={280}
                                    rows={3}
                                />
                                <span className={styles.charCount}>{caption.length}/280</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Upload Options */}
                            <div className={styles.uploadOptions}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className={styles.fileInput}
                                />

                                <button
                                    className={styles.uploadButton}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <UploadIcon />
                                    <span>Upload Image</span>
                                </button>

                                <button className={styles.uploadButton}>
                                    <CameraIcon />
                                    <span>Take Photo</span>
                                </button>
                            </div>

                            {/* Demo Images */}
                            <div className={styles.demoSection}>
                                <p className={styles.demoLabel}>Or select a demo image:</p>
                                <div className={styles.demoGrid}>
                                    {DEMO_PROOFS.map((url, index) => (
                                        <button
                                            key={index}
                                            className={styles.demoImage}
                                            onClick={() => setSelectedImage(url)}
                                        >
                                            <img src={url} alt={`Demo ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <motion.button
                        className={styles.submitButton}
                        disabled={!selectedImage || isSubmitting}
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <span className={styles.spinner} />
                        ) : (
                            <>Complete Habit (+10 pts)</>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
