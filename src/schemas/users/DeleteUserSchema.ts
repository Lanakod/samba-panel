import { z } from "zod";

export const DeleteUserSchema = z.object({
    username: z.string()
})