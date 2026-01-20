'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { user } = useApp();

    useEffect(() => {
        // 1. If AppContext already has user, redirect immediately
        if (user) {
            router.push('/');
            return;
        }

        // 2. Listen for auth state changes (robust way to handle OAuth redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || session) {
                router.push('/');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [user, router]);

    return (
        <div
            suppressHydrationWarning={true}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--background-default)',
                color: 'var(--text-primary)',
            }}>
            <div
                suppressHydrationWarning={true}
                style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: 'var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            <p style={{ marginTop: '20px', opacity: 0.7 }}>Completing sign in...</p>
            <style jsx global>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
