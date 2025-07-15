// src/lib/startup-warning.ts
import { env } from "@/env";

if (env.IS_HTTPS === false && process.env.NODE_ENV === 'production') {
    console.warn(
        '⚠️ You are running in production over HTTP. Secure cookies will NOT work. Set IS_HTTPS=true if using HTTPS.'
    );
}
