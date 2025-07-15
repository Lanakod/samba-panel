import {jwtVerify, JWTVerifyResult, SignJWT} from 'jose';
import {env} from "@/env";

export type AuthPayload = {
    username: string;
};

export async function signToken(payload: AuthPayload): Promise<string> {
     // secretKey generated from previous step
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'}) // algorithm
        .setIssuedAt()
        .setExpirationTime("7d") // token expiration time, e.g., "1 day"
        .sign(new TextEncoder().encode(env.JWT_SECRET))
}

export async function verifyToken(token: string): Promise<JWTVerifyResult<AuthPayload> | null> {
    try {
        return await jwtVerify<AuthPayload>(token, new TextEncoder().encode(env.JWT_SECRET));
    } catch (e) {
        console.error(e)
        return null;
    }
}
