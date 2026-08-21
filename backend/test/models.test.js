import { describe, it, expect } from 'vitest';
import User from '../models/user.js';
import Movie from '../models/movie.js';

describe('User Model', () => {
  it('should have required fields with validation', () => {
    const user = new User({
      uuid: 'test-uuid',
      username: 'testuser',
      hashedPassword: 'hashedpass',
      email: 'test@example.com',
    });
    expect(user.uuid).toBe('test-uuid');
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  it('should default roles to ["user"]', () => {
    const user = new User({
      uuid: 'test-uuid-2',
      username: 'testuser2',
      hashedPassword: 'hashedpass',
      email: 'test2@example.com',
    });
    expect(user.roles).toEqual(['user']);
  });

  it('should validate email format', () => {
    const user = new User({
      uuid: 'test-uuid-3',
      username: 'testuser3',
      hashedPassword: 'hashedpass',
      email: 'invalid-email',
    });
    const error = user.validateSync();
    expect(error.errors.email).toBeDefined();
  });

  it('should validate username minlength', () => {
    const user = new User({
      uuid: 'test-uuid-4',
      username: 'ab',
      hashedPassword: 'hashedpass',
      email: 'test4@example.com',
    });
    const error = user.validateSync();
    expect(error.errors.username).toBeDefined();
  });
});

describe('Movie Model', () => {
  it('should have required fields with validation', () => {
    const movie = new Movie({
      title: 'Test Movie',
      year: 2024,
    });
    expect(movie.title).toBe('Test Movie');
    expect(movie.year).toBe(2024);
    expect(movie.type).toBe('movie');
    expect(movie.rating).toBe(0);
  });

  it('should validate year range', () => {
    const movie = new Movie({
      title: 'Test',
      year: 1800,
    });
    const error = movie.validateSync();
    expect(error.errors.year).toBeDefined();
  });

  it('should validate rating range', () => {
    const movie = new Movie({
      title: 'Test',
      year: 2024,
      rating: 15,
    });
    const error = movie.validateSync();
    expect(error.errors.rating).toBeDefined();
  });

  it('should validate type enum', () => {
    const movie = new Movie({
      title: 'Test',
      year: 2024,
      type: 'invalid',
    });
    const error = movie.validateSync();
    expect(error.errors.type).toBeDefined();
  });

  it('should accept comments with proper structure', () => {
    const movie = new Movie({
      title: 'Test',
      year: 2024,
      comments: [{ user: 'John', text: 'Great!', rating: 8, date: '2024-01-01' }],
    });
    expect(movie.comments).toHaveLength(1);
    expect(movie.comments[0].user).toBe('John');
  });
});