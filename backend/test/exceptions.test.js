import { describe, it, expect } from 'vitest';
import { InvalidArgumentException } from '../exceptions/invalid_argument_exception.js';
import { UnauthorizedException } from '../exceptions/unauthorized_exception.js';
import { InvalidCredentialsException } from '../exceptions/invalid_credentials_exception.js';

describe('Exceptions', () => {
  it('InvalidArgumentException should have statusCode 400', () => {
    const err = new InvalidArgumentException('Test message');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Test message');
  });

  it('InvalidArgumentException default message', () => {
    const err = new InvalidArgumentException();
    expect(err.message).toBe('Argumentos inválidos.');
  });

  it('UnauthorizedException should have statusCode 401', () => {
    const err = new UnauthorizedException('Test message');
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Test message');
  });

  it('InvalidCredentialsException should have statusCode 401', () => {
    const err = new InvalidCredentialsException();
    expect(err.statusCode).toBe(401);
  });
});