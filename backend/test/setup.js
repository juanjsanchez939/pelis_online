import { vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_KEY = 'test_jwt_key_for_testing_only_12345678901234567890123456789012';
process.env.TMDB_API_KEY = 'test_tmdb_key';
process.env.DB_CONNECTION = 'mongodb://localhost:27017/pelis_online_test';
process.env.DB_NAME = 'pelis_online_test';

vi.setConfig({ testTimeout: 10000 });