import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = (token as { role?: string } | null)?.role;

    // Admin routes require admin role
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/meine-kurse/:path*',
    '/lernfortschritt/:path*',
    '/ki-assistent/:path*',
    '/profil/:path*',
    '/einstellungen/:path*',
    '/abo/:path*',
    '/admin/:path*',
  ],
};
