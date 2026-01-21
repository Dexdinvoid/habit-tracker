import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        console.error('Auth callback: no code provided');
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

        const userId = data.user.id;
        const email = data.user.email;
        const fullName = data.user.user_metadata?.full_name;
        const avatarUrl = data.user.user_metadata?.avatar_url;

        console.log(`Creating profile for user: ${userId}, email: ${email}`);

        // Create profile if it doesn't exist
        const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is expected
            console.error('Check profile error:', checkError);
        }

        if (!existingProfile) {
            const username = fullName?.split(' ')[0]?.toLowerCase() || email?.split('@')[0] || 'user';
            const displayName = fullName || email?.split('@')[0] || 'User';

            console.log(`Inserting profile: ${userId}, username: ${username}, displayName: ${displayName}`);

            const { error: profileError, data: profileData } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    username: username,
                    display_name: displayName,
                    avatar_url: avatarUrl || null,
                    points: 0,
                    current_streak: 0,
                    highest_streak: 0,
                    created_at: new Date().toISOString(),
                })
                .select();

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't fail the auth, user can still login
            } else {
                console.log('Profile created successfully:', profileData);
            }
        } else {
            console.log('Profile already exists for user:', userId);
        }

        // Redirect to home
        return NextResponse.redirect(new URL('/', request.url));
    } catch (err) {
        console.error('Callback error:', err);
        return NextResponse.redirect(new URL('/auth/error', request.url));
    }
}
