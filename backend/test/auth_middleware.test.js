import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { authorizationMiddleware } from '../middlewares/authorization_middleware.js';
import config from '../config.js';

describe('authorizationMiddleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = vi.fn();
  });

  it('should call next() when no auth header', () => {
    authorizationMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next() with valid token', () => {
    const token = jwt.sign(
      { userId: '123', username: 'test', roles: ['user'] },
      config.jwtKey,
      { expiresIn: '1h' }
    );
    mockReq.headers.authorization = `Bearer ${token}`;

    authorizationMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockReq.session).toBeDefined();
    expect(mockReq.session.username).toBe('test');
    expect(mockReq.session.roles).toContain('user');
  });

  it('should throw UnauthorizedException for expired token', () => {
    const token = jwt.sign(
      { userId: '123', username: 'test' },
      config.jwtKey,
      { expiresIn: '-1s' }
    );
    mockReq.headers.authorization = `Bearer ${token}`;

    expect(() => authorizationMiddleware(mockReq, mockRes, mockNext)).toThrow();
    
    try {
      authorizationMiddleware(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toBe('Token expirado. Inicie sesión nuevamente.');
      expect(error.statusCode).toBe(401);
    }
  });

  it('should throw UnauthorizedException for invalid token', () => {
    mockReq.headers.authorization = 'Bearer invalid.token.here';

    expect(() => authorizationMiddleware(mockReq, mockRes, mockNext)).toThrow();
    
    try {
      authorizationMiddleware(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toBe('Token inválido.');
      expect(error.statusCode).toBe(401);
    }
  });

  it('should throw UnauthorizedException for wrong scheme', () => {
    mockReq.headers.authorization = 'Basic dXNlcjpwYXNz';

    expect(() => authorizationMiddleware(mockReq, mockRes, mockNext)).toThrow();
    
    try {
      authorizationMiddleware(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toBe('Esquema de autorización inválido. Use Bearer token.');
      expect(error.statusCode).toBe(401);
    }
  });
});