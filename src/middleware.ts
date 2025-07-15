import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/auth'];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    const isPublic = PUBLIC_PATHS.includes(pathname);

    if(pathname.startsWith('/api')) {
        return NextResponse.next()
    }

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    const user = token ? await verifyToken(token) : null;

    if (!user && !isPublic) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    if(user && pathname === '/auth') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon|icon0|icon1|manifest|apple-icon|web-app-manifest-192x192|web-app-manifest-512x512|env).*)',
    ],
};
