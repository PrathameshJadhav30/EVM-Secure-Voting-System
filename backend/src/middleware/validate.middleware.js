const AppError = require("../utils/AppError");

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    return next(new AppError(message || "Validation failed", 400));
  }

  req.validated = result.data;
  return next();
};

module.exports = validate;
