const { z } = require("zod");

const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
});

const updateVoterSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      age: z.number().int().min(18).optional(),
      password: z.string().min(8).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = {
  idParamSchema,
  updateVoterSchema,
};
