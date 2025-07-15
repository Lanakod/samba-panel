export const runtime = 'nodejs';

import {NextResponse} from 'next/server';
import {handleApiError, requireAuth} from "@/lib";

export async function POST() {
    try {
        await requireAuth()
        const response = NextResponse.json({status: true, message: "Logged out"});
        response.cookies.set({
            name: 'token',
            value: '',
            path: '/',
            maxAge: 0,
        });
        return response;
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}
