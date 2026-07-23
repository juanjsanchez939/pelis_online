import express from 'express';
import config from './config.js';
import mongoose from 'mongoose';
import configureDependencies from './configure_dependencies.js';
import configureMiddlewares from './middlewares/configure_middlewares.js';

if (!config.jwtKey) {
  console.warn('⚠️  No se ha definido un JWT_KEY. La autenticación no funcionará.');
}

console.log('🔍 Conectando a MongoDB...');

mongoose.connect(config.dbConnection, {
  dbName: config.dbName,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ Conectado a MongoDB exitosamente');
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`📊 Base de datos: ${config.dbName}`);
  })
  .catch(error => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

const app = express();
const router = express.Router();
app.use('/api', router);
app.use(router);

configureMiddlewares(router);

configureDependencies();

app.listen(
  config.port,
  '0.0.0.0',
  () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${config.port}`);
  }
);
