const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    voterId: z.string().min(4),
    age: z.number().int().min(18),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const voterLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const adminLoginSchema = voterLoginSchema;

module.exports = {
  registerSchema,
  voterLoginSchema,
  adminLoginSchema,
};
