import { z } from "zod";

export const UpdateUserSchema = z.object({
    username: z.string(),
    password: z.string()
})