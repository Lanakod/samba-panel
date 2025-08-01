export const runtime = 'nodejs';

import {NextResponse} from 'next/server';
import {handleApiError, signToken} from '@/lib';
import {env} from "@/env";
import {AuthSchema} from "@/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {username, password} = AuthSchema.parse(body)
        if (
            username === env.ADMIN_USERNAME &&
            password === env.ADMIN_PASSWORD
        ) {
            const token = await signToken({username});

            const res = NextResponse.json({status: true, message: "Successfull authentication"});

            //FIX: Add secure to cookie when using https
            //const isHttps = process.env.NODE_ENV === 'production' && env.IS_HTTPS === true

            res.cookies.set('token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                //secure: isHttps,
                sameSite: 'strict',
            });

            return res;
        }

        return NextResponse.json({status: false, message: 'Invalid credentials'}, {status: 401});
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}
