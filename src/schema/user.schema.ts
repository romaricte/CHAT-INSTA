import Z from "zod";

export const loginSchema = Z.object({
    email: Z.string().email(),
    password: Z.string(),
});

export const registerSchema = loginSchema.extend({
    name: Z.string(),
});