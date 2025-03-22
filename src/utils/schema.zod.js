import { z } from 'zod';

export const poissonSchema = z.object({
    lambda: z.string()
        .nonempty("Please enter lambda for Poisson distribution")
        .transform(val => {
            // Make sure it's a number
            const num = parseFloat(val);
            return num;
        })
        .refine(val => !isNaN(val), "Lambda must be a valid number")
        .refine(val => val > 0, "Lambda must be positive")
});

export const binomialSchema = z.object({
    n: z.string()
        .nonempty("Please enter number of trials (n)")
        .transform(val => {
            // Make sure it's a number
            const num = parseFloat(val);
            return num;
        })
        .refine(val => !isNaN(val), "Number of trials must be a valid number")
        .refine(val => val > 0, "Number of trials must be positive")
        .refine(val => Number.isInteger(val), "Number of trials must be an integer"),
    
    p: z.string()
        .nonempty("Probability is required")
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), "Probability must be a number")
        .refine(val => val >= 0 && val <= 1, "Probability must be between 0 and 1")
});