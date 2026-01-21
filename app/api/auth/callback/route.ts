import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    try {
        // Create Supabase client with service role (server-side only)
        const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.user) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL('/auth/error', request.url));
        }

        // Create profile if it doesn't exist
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();

        if (!existingProfile) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    username: data.user.email?.split('@')[0] || 'user',
                    display_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                    avatar_url: data.user.user_metadata?.avatar_url || null,
                    points: 0,
                    current_streak: 0,
                    highest_streak: 0,
                    created_at: new Date().toISOString(),
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
            }
        }

        // Redirect to home
        return NextResponse.redirect(new URL('/', request.url));
    } catch (err) {
        console.error('Callback error:', err);
        return NextResponse.redirect(new URL('/auth/error', request.url));
    }
}
