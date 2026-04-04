const { z } = require("zod");

const castVoteSchema = z.object({
  body: z.object({
    candidateId: z.string().uuid(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  castVoteSchema,
};
