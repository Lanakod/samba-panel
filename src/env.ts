import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {
        SMB_CONF_PATH: z.string(),
        SMBPASSWD_PATH: z.string(),
        CONTAINER_NAME: z.string(),
        ADMIN_USERNAME: z.string(),
        ADMIN_PASSWORD: z.string(),
        JWT_SECRET: z.string(),
        IS_HTTPS: z.coerce.boolean()
    },
    client: {
        NEXT_PUBLIC_PANEL_URL: z.string().url()
    },
    runtimeEnv: {
        SMB_CONF_PATH: process.env.SMB_CONF_PATH,
        SMBPASSWD_PATH: process.env.SMBPASSWD_PATH,
        CONTAINER_NAME: process.env.CONTAINER_NAME,
        NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
        ADMIN_USERNAME: process.env.ADMIN_USERNAME,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET,
        IS_HTTPS: process.env.IS_HTTPS,
    },
});