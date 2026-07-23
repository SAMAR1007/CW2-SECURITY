import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT secret must be set as environment variable
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'homecomf-default-secret-change-in-production'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];
  
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verify JWT signature using jose library (Edge-compatible)
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (pathname.startsWith('/user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verify token is valid even for user routes
      await jwtVerify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};
