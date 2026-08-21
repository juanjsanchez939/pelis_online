import 'dotenv/config';

const requiredEnvVars = ['JWT_KEY', 'TMDB_API_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Variable de entorno requerida no definida: ${envVar}`);
    console.error('Copia .env.example a .env y completa los valores');
    process.exit(1);
  }
}

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtKey: process.env.JWT_KEY,
  dbConnection: process.env.DB_CONNECTION || process.env.MONGODB_URI || 'mongodb://localhost:27017/pelis_online',
  dbName: process.env.DB_NAME || 'pelis_online',
  tmdbApiKey: process.env.TMDB_API_KEY,
  corsOrigins,
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || 'admin@pelisonline.com',
  },
};

export default config;
