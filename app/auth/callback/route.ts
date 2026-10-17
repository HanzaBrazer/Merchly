import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
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

  // 1. Exchange OAuth code for Supabase session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError || !data?.user) {
    const errorUrl = new URL('/login', origin);
    errorUrl.searchParams.set('error', exchangeError?.message || 'auth_exchange_failed');
    return NextResponse.redirect(errorUrl);
  }

  const user = data.user;
  const userEmail = (user.email || '').toLowerCase().trim();
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];

  // Determine Role automatically per business requirements
  let role: 'owner' | 'admin' | 'staff' = 'owner';
  if (userEmail === 'raihanreza004@gmail.com') {
    role = 'admin';
  } else if (userEmail === 'raihanfahreza04@gmail.com') {
    role = 'owner';
  } else if (user.user_metadata?.role) {
    role = user.user_metadata.role;
  }

  // 2. Fix 2: Cek apakah user sudah punya workspace / membership
  // User lama (sudah punya workspace / akun terdaftar) -> /dashboard
  // User baru (belum punya workspace) -> /onboarding
  let hasWorkspace =
    userEmail === 'raihanfahreza04@gmail.com' ||
    userEmail === 'raihanreza004@gmail.com' ||
    Boolean(user.user_metadata?.workspace_id);

  if (!hasWorkspace) {
    try {
      const { data: membership } = await supabase
        .from('memberships')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (membership?.workspace_id) {
        hasWorkspace = true;
      }
    } catch {
      // Table may not be created yet, fallback to metadata status
    }
  }

  // Destination route
  const targetPath = hasWorkspace ? '/dashboard' : '/onboarding';

  // If user is completing registration and metadata not set, attach default workspace metadata
  if (!user.user_metadata?.workspace_id && hasWorkspace) {
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

  const response = NextResponse.redirect(`${origin}${targetPath}`);
  response.cookies.set('merchly_auth', 'true', { path: '/', maxAge: 604800, sameSite: 'lax' });
  response.cookies.set('merchly_role', role, { path: '/', maxAge: 604800, sameSite: 'lax' });
  response.cookies.set('merchly_has_ws', hasWorkspace ? 'true' : 'false', { path: '/', maxAge: 604800, sameSite: 'lax' });

  return response;
}
