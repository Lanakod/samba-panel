import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    SMB_CONF_PATH: z.string(),
    SMBPASSWD_PATH: z.string(),
    CONTAINER_NAME: z.string(),
  },
  client: {
    NEXT_PUBLIC_PANEL_URL: z.string().url()
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    SMB_CONF_PATH: process.env.SMB_CONF_PATH,
    SMBPASSWD_PATH: process.env.SMBPASSWD_PATH,
    CONTAINER_NAME: process.env.CONTAINER_NAME,
    NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
  },
});