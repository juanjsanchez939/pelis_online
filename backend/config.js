import 'dotenv/config';

var config = {
  port: process.env.PORT || 3001,
  jwtKey: process.env.JWT_KEY,
  dbConnection: process.env.DB_CONNECTION || process.env.MONGODB_URI || 'mongodb://localhost:27017/pelis_online',
  dbName: process.env.DB_NAME || 'pelis_online',
};

export default config;
