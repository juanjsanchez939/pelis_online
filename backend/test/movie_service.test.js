import { describe, it, expect } from 'vitest';
import { sanitizeFilter } from '../services/movie.js';

describe('sanitizeFilter', () => {
  it('should return empty object for null/undefined', () => {
    expect(sanitizeFilter(null)).toEqual({});
    expect(sanitizeFilter(undefined)).toEqual({});
  });

  it('should return empty object for non-object', () => {
    expect(sanitizeFilter('string')).toEqual({});
    expect(sanitizeFilter(123)).toEqual({});
    expect(sanitizeFilter([])).toEqual({});
  });

  it('should allow only whitelisted keys', () => {
    const input = {
      title: 'Test',
      category: 'Action',
      year: 2024,
      type: 'movie',
      rating: 8.5,
      tmdbId: 123,
      maliciousField: 'injection',
      '$where': 'malicious query',
      constructor: { prototype: {} },
    };
    const result = sanitizeFilter(input);
    expect(result).toEqual({
      title: 'Test',
      category: 'Action',
      year: 2024,
      type: 'movie',
      rating: 8.5,
      tmdbId: 123,
    });
    expect(result.maliciousField).toBeUndefined();
    expect(result.$where).toBeUndefined();
  });

  it('should handle partial filters', () => {
    expect(sanitizeFilter({ title: 'Only title' })).toEqual({ title: 'Only title' });
    expect(sanitizeFilter({ year: 2024, invalid: 'field' })).toEqual({ year: 2024 });
  });
});