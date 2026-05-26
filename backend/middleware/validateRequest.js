export const validateRequest = (schema) => (req, res, next) => {
  // safeParse doesn't throw errors, making it safer for Express middleware
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Intercept execution and return a clean 400 Bad Request
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      // Map Zod errors to a clean, readable array for the client
      errors: result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }

  // Success: Overwrite req.body with strictly typed and stripped data.
  // This removes any malicious or extra fields that weren't in the schema!
  req.body = result.data;
  
  // Hand over to the main controller
  next();
};
