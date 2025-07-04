import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string()
})