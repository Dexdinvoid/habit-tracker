'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import MessagingInterface from '@/components/messaging/MessagingInterface';

function MessagesContent() {
    const searchParams = useSearchParams();
    const partnerId = searchParams.get('partnerId');

    return (
        <MessagingInterface initialPartnerId={partnerId || undefined} />
    );
}

export default function MessagesPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div>Loading messaging...</div>}>
                <MessagesContent />
            </Suspense>
        </MainLayout>
    );
}
