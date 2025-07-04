import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    SMB_CONF_PATH: z.string(),
    USERS_PASS_PATH: z.string(),
    SMBPASSWD_PATH: z.string(),
    CONTAINER_NAME: z.string()
  },
  client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    SMB_CONF_PATH: process.env.SMB_CONF_PATH,
    USERS_PASS_PATH: process.env.USERS_PASS_PATH,
    SMBPASSWD_PATH: process.env.SMBPASSWD_PATH,
    CONTAINER_NAME: process.env.CONTAINER_NAME
  },
});