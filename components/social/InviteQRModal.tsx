'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import styles from './InviteQRModal.module.css';

interface InviteQRModalProps {
    inviteUrl: string;
    onClose: () => void;
}

export default function InviteQRModal({ inviteUrl, onClose }: InviteQRModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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
                    <h2 className={styles.title}>Scan to Join</h2>
                    <p className={styles.subtitle}>Share this QR code with your friends</p>
                </div>

                <div className={styles.qrWrapper}>
                    <div className={styles.qrBackground}>
                        <QRCode
                            value={inviteUrl}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <p className={styles.linkText} onClick={() => {
                        navigator.clipboard.writeText(inviteUrl);
                        // Add toast trigger if passed down, or just rely on text
                    }}>
                        {inviteUrl}
                    </p>
                    <span className={styles.hint}>Tap link to copy</span>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
