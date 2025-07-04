import { z } from "zod";

export const DeleteShareSchema = z.object({
    name: z.string().min(3),
})