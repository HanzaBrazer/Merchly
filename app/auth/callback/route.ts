import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const mode = searchParams.get('mode') ?? 'login';
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    const errorUrl = new URL('/login', origin);
    errorUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_auth_code`);
  }

  // Exchange auth code for Supabase session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError || !data?.user) {
    const errorUrl = new URL('/login', origin);
    errorUrl.searchParams.set('error', exchangeError?.message || 'auth_exchange_failed');
    return NextResponse.redirect(errorUrl);
  }

  const user = data.user;
  const userEmail = (user.email || '').toLowerCase().trim();
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  // Determine Role automatically per business logic
  let role: 'owner' | 'admin' | 'staff' = 'owner';
  if (userEmail === 'raihanreza004@gmail.com') {
    role = 'admin';
  } else if (userEmail === 'raihanfahreza04@gmail.com') {
    role = 'owner';
  } else if (user.user_metadata?.role) {
    role = user.user_metadata.role;
  }

  // Check if account already exists / is registered:
  // 1. Raihan Fahreza (Owner) is pre-registered
  // 2. Raihan Reza (Admin) is pre-registered
  // 3. User with existing workspace_id metadata
  const isRegisteredUser =
    userEmail === 'raihanfahreza04@gmail.com' ||
    userEmail === 'raihanreza004@gmail.com' ||
    Boolean(user.user_metadata?.workspace_id);

  // If clicked Google from LOGIN page but hasn't created an account yet
  if (mode === 'login' && !isRegisteredUser) {
    const redirectUrl = new URL('/register', origin);
    redirectUrl.searchParams.set('error', 'not_registered');
    redirectUrl.searchParams.set('email', userEmail);

    const res = NextResponse.redirect(redirectUrl);
    // Ensure auth cookies are not set
    res.cookies.delete('merchly_auth');
    res.cookies.delete('merchly_role');
    res.cookies.delete('merchly_has_ws');
    return res;
  }

  // If registered or in register mode: ensure workspace metadata is set
  if (!user.user_metadata?.workspace_id) {
    try {
      await supabase.auth.updateUser({
        data: {
          workspace_id: `ws-${Date.now()}`,
          role: role,
          name: userName,
        },
      });
    } catch {
      // Non-blocking
    }
  }

  // Successfully authenticated -> Set session cookies and redirect to destination
  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.set('merchly_auth', 'true', { path: '/', maxAge: 604800, sameSite: 'lax' });
  response.cookies.set('merchly_role', role, { path: '/', maxAge: 604800, sameSite: 'lax' });
  response.cookies.set('merchly_has_ws', 'true', { path: '/', maxAge: 604800, sameSite: 'lax' });

  return response;
}
