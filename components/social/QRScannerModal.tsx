'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Scanner } from '@yudiel/react-qr-scanner';
import styles from './QRScannerModal.module.css';

interface QRScannerModalProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export default function QRScannerModal({ onScan, onClose }: QRScannerModalProps) {
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue;
            if (rawValue) {
                onScan(rawValue);
            }
        }
    };

    const handleError = (error: any) => {
        console.error("QR Scan Error:", error);
        setError("Could not access camera. Please ensure permissions are granted.");
    };

    if (!mounted) return null;

    return createPortal(
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Scan QR Code</h2>
                    <p className={styles.subtitle}>Point your camera at a friend's invite code</p>
                </div>

                <div className={styles.scannerWrapper}>
                    {error ? (
                        <div className={styles.errorDisplay}>
                            <span className={styles.errorIcon}>🚫</span>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className={styles.scannerContainer}>
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                                components={{
                                    onOff: false,
                                    torch: true,
                                    zoom: false,
                                    finder: true,
                                }}
                                styles={{
                                    container: { borderRadius: '16px', overflow: 'hidden' },
                                    video: { objectFit: 'cover' }
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <p className={styles.hint}>Make sure the code is well-lit</p>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
