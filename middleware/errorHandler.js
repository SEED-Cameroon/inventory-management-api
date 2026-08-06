export function errorHandler(err, req, res, next) {
  console.error(err);

  let statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: err.message,
  });
}