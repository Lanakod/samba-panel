import { z } from "zod";

export const UpdateShareSchema = z.object({
    originalName: z.string().min(3),
    name: z.string().min(3),
    path: z.string().min(3),
    comment: z.string().optional().or(z.literal('')),
    readOnly: z.boolean()
})