'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName } from '@/lib/types';

interface ThemeContextType {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'cyberpunk' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Get theme from localStorage on mount
        const savedTheme = localStorage.getItem('consistency-theme') as ThemeName | null;
        if (savedTheme && ['cyberpunk', 'fantasy', 'neon', 'minimal'].includes(savedTheme)) {
            setThemeState(savedTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            // Update document attribute and localStorage
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('consistency-theme', theme);
        }
    }, [theme, mounted]);

    const setTheme = (newTheme: ThemeName) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {!mounted ? (
                <div style={{ visibility: 'hidden' }}>
                    {children}
                </div>
            ) : (
                children
            )}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Theme metadata for UI display
export const THEME_META = {
    cyberpunk: {
        name: 'Cyberpunk',
        description: 'Neon pinks, cyans, dark futures',
        preview: ['#ff2a6d', '#05d9e8', '#d300c5'],
    },
    fantasy: {
        name: 'Fantasy',
        description: 'Mystical purples and golden magic',
        preview: ['#a855f7', '#fbbf24', '#ec4899'],
    },
    neon: {
        name: 'Neon',
        description: 'Pure darkness with vibrant glows',
        preview: ['#39ff14', '#ff073a', '#00f5ff'],
    },
    minimal: {
        name: 'Minimal',
        description: 'Clean, modern, and focused',
        preview: ['#2563eb', '#7c3aed', '#0891b2'],
    },
} as const;
