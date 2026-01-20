'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { Conversation, Message } from '@/lib/types';
import styles from './Messaging.module.css';

interface MessagingProps {
    initialPartnerId?: string;
}

export default function MessagingInterface({ initialPartnerId }: MessagingProps) {
    const { user, conversations, messages, fetchMessages, sendMessage, markAsRead } = useApp();
    const [activePartnerId, setActivePartnerId] = useState<string | null>(initialPartnerId || null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // If initialPartnerId is provided (e.g. from profile page), set it active
    useEffect(() => {
        if (initialPartnerId) {
            setActivePartnerId(initialPartnerId);
        }
    }, [initialPartnerId]);

    // Fetch messages when active partner changes
    useEffect(() => {
        if (activePartnerId) {
            fetchMessages(activePartnerId);
            // Mark unread as read logic would go here
        }
    }, [activePartnerId]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activePartnerId) return;

        try {
            await sendMessage(activePartnerId, newMessage);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    const activeConversation = conversations.find(c => c.partner.id === activePartnerId);
    // Fallback if conversation doesn't exist yet but we have a partnerID (new chat)
    // We would need to fetch partner details if not in conversation list, but for now let's rely on list.

    return (
        <div className={styles.container}>
            {/* Conversation List */}
            <div className={styles.conversationList}>
                <div className={styles.listHeader}>Messages</div>
                <div className={styles.listContent}>
                    {conversations.length === 0 ? (
                        <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>No conversations yet</div>
                    ) : (
                        conversations.map(c => (
                            <div
                                key={c.partner.id}
                                className={`${styles.conversationItem} ${activePartnerId === c.partner.id ? styles.active : ''}`}
                                onClick={() => setActivePartnerId(c.partner.id)}
                            >
                                <div className={styles.avatar}>
                                    {c.partner.avatar ? (
                                        <img src={c.partner.avatar} alt={c.partner.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                    ) : (
                                        c.partner.username[0].toUpperCase()
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.name}>{c.partner.displayName}</div>
                                    <div className={styles.lastMessage}>
                                        {c.lastMessage.senderId === user?.id ? 'You: ' : ''}{c.lastMessage.content}
                                    </div>
                                </div>
                                {c.unreadCount > 0 && <div className={styles.unreadBadge}>{c.unreadCount}</div>}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={styles.chatWindow}>
                {activePartnerId ? (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.avatar} style={{ width: 32, height: 32, fontSize: '1rem' }}>
                                {activeConversation?.partner.username[0].toUpperCase() || '?'}
                            </div>
                            <span>{activeConversation?.partner.displayName || 'Chat'}</span>
                        </div>

                        <div className={styles.messageArea}>
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`${styles.messageBubble} ${m.senderId === user?.id ? styles.sent : styles.received}`}
                                >
                                    {m.content}
                                    <span className={styles.timestamp}>
                                        {m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className={styles.inputArea} onSubmit={handleSend}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className={styles.sendButton}>
                                ➤
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>Select a conversation</h3>
                        <p>Choose a friend from the list to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
