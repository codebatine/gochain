import ErrorResponse from '../models/ErrorResponseModel.mjs';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `The resource with id: ${err.value} could not be found.`;
    error = new ErrorResponse(`Information saknas: ${message}`, 400);
  }

  if (err.code === 11000) {
    const message = `The resource already excist: '${
      Object.keys(err.keyValue)[0]
    }'`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(`Information is missing: ${message}`, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Server Error',
  });
};
