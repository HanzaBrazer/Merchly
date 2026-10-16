import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get('merchly_auth')?.value;
  const roleCookie = request.cookies.get('merchly_role')?.value;
  const hasWsCookie = request.cookies.get('merchly_has_ws')?.value;

  const isAuthenticated = Boolean(authCookie === 'true');
  const userRole = (roleCookie || 'owner').toLowerCase();

  // 1. Protect /dashboard routes (DESIGN.md §14: Belum login dialihkan ke /login)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const tabParam = request.nextUrl.searchParams.get('tab') || '';

    // 2. Role-based Server Route Protection (DESIGN.md §12 & §15)
    // Staff restricted routes (403 Forbidden protection)
    if (userRole === 'staff') {
      if (
        pathname.startsWith('/dashboard/integrations') ||
        (pathname.startsWith('/dashboard/settings') && ['team', 'billing', 'workspace'].includes(tabParam))
      ) {
        const forbiddenUrl = new URL('/dashboard', request.url);
        forbiddenUrl.searchParams.set('error', '403_forbidden_staff_restricted');
        return NextResponse.redirect(forbiddenUrl);
      }
    }

    // Admin restricted routes (No Billing access per §15)
    if (userRole === 'admin') {
      if (pathname.startsWith('/dashboard/settings') && tabParam === 'billing') {
        const forbiddenUrl = new URL('/dashboard/settings', request.url);
        forbiddenUrl.searchParams.set('tab', 'profile');
        forbiddenUrl.searchParams.set('error', '403_forbidden_admin_no_billing');
        return NextResponse.redirect(forbiddenUrl);
      }
    }

    return NextResponse.next();
  }

  // 3. Redirect logged-in users away from auth pages to /dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
