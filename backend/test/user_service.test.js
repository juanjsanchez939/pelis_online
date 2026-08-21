import { describe, it, expect } from 'vitest';
import { sanitizeUserFilter } from '../services/user.js';

describe('sanitizeUserFilter', () => {
  it('should return empty object for null/undefined', () => {
    expect(sanitizeUserFilter(null)).toEqual({});
    expect(sanitizeUserFilter(undefined)).toEqual({});
  });

  it('should return empty object for non-object', () => {
    expect(sanitizeUserFilter('string')).toEqual({});
    expect(sanitizeUserFilter(123)).toEqual({});
    expect(sanitizeUserFilter([])).toEqual({});
  });

  it('should allow only whitelisted keys', () => {
    const input = {
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      roles: ['user'],
      uuid: 'abc-123',
      maliciousField: 'injection',
      '$where': 'malicious query',
      password: 'secret',
      hashedPassword: 'hashed',
    };
    const result = sanitizeUserFilter(input);
    expect(result).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      roles: ['user'],
      uuid: 'abc-123',
    });
    expect(result.maliciousField).toBeUndefined();
    expect(result.$where).toBeUndefined();
    expect(result.password).toBeUndefined();
    expect(result.hashedPassword).toBeUndefined();
  });

  it('should handle partial filters', () => {
    expect(sanitizeUserFilter({ username: 'Only username' })).toEqual({ username: 'Only username' });
    expect(sanitizeUserFilter({ email: 'test@example.com', invalid: 'field' })).toEqual({ email: 'test@example.com' });
  });
});