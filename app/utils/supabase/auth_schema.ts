import * as z from "zod/v4";

export function getSignUpSchema() {
    return z.object({
        email: z.email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        firstName: z.string(),
        lastName: z.string(),
    })
        .refine((data) => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        })
}