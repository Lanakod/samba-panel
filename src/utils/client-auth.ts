// src/lib/client-auth.ts

export async function checkAuth(): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/check', {
            method: 'GET',
            credentials: 'include', // send cookies
        });

        const data = await res.json();
        return !!data.user;
    } catch (err) {
        console.error('Auth check failed:', err);
        return false;
    }
}
