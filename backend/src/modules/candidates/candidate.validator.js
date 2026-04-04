const { z } = require("zod");

const createCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    party: z.string().min(2),
    symbolImage: z.string().url().optional(),
    description: z.string().max(1000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCandidateSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      party: z.string().min(2).optional(),
      symbolImage: z.string().url().optional(),
      description: z.string().max(1000).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const idParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createCandidateSchema,
  updateCandidateSchema,
  idParamSchema,
};
