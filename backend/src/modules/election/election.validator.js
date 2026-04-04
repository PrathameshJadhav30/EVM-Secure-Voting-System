const { z } = require("zod");

const createElectionSchema = z.object({
  body: z.object({
    electionName: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const electionIdBodySchema = z.object({
  body: z.object({
    electionId: z.string().uuid(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  createElectionSchema,
  electionIdBodySchema,
};
