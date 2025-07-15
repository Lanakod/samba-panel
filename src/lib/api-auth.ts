import { cookies } from 'next/headers';
import { verifyToken } from '@/lib';
import {AuthError} from "@/interfaces";

export async function getUserFromCookie() {
    const cookieStore = await cookies(); // ✅ await the promise
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    return await verifyToken(token);
}

export async function requireAuth() {
    const user = await getUserFromCookie();
    if (!user) {
        throw new AuthError('Unauthorized');
    }

    return user;
}
