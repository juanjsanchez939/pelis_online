/* eslint-disable no-unused-vars */
import config from '../config.js';

export function errorHandlerMiddleware(err, req, res, next) {
  console.error(err);

  const isProduction = config.nodeEnv === 'production';
  const statusCode = err.statusCode || 500;

  const response = {
    error: isProduction ? 'Error interno del servidor' : err.constructor.name,
    message: isProduction ? 'Ha ocurrido un error inesperado' : err.message,
  };

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).send(response);
}