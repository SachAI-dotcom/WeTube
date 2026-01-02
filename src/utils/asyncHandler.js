// Lightweight async handler: wraps an async request handler and forwards
// errors to Express `next()` so the global error middleware can handle them.
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
