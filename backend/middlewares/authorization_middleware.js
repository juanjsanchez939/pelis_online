import jwt from 'jsonwebtoken';
import config from '../config.js';
import { ForbiddenException } from '../exceptions/forbidden_exception.js';
import { UnauthorizedException } from '../exceptions/unauthorized_exception.js';

export function authorizationMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    next();
    return;
  }

  const scheme = auth
    .substring(0, 7)
    .toUpperCase();
  if (scheme !== 'BEARER ') {
    throw new UnauthorizedException('Esquema de autorización inválido. Use Bearer token.');
  }

  const token = auth
    .substring(7)
    .trim();

  try {
    const data = jwt.verify(token, config.jwtKey);
    req.session = data;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expirado. Inicie sesión nuevamente.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Token inválido.');
    }
    throw new UnauthorizedException('Error de autenticación.');
  }
}
export function checkForRole(role) {
  return (req, res, next) => {
    if (req.session?.roles?.includes(role)) {
      next();
      return;
    }

    throw new ForbiddenException();
  };
}