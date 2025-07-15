// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/api-auth';

export async function GET() {
    const user = await getUserFromCookie();

    return NextResponse.json({ user: user?.payload ?? null });
}
