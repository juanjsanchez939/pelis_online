/**
 * Cree un archivo local llamado config.local.js donde coloque los valores 
 * que no se almacenan en el repositorio.
 */

let configLocal = {};

try {
  const importedConfig = await import('./config.local.js');
  configLocal = importedConfig.default;
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    throw error;
  }
}

var config = {
  ...configLocal,
  port: process.env.PORT ?? configLocal.port ?? 3001,
  jwtKey: process.env.JWT_KEY ?? configLocal.jwtKey,
  dbConnection: process.env.DB_CONNECTION ?? configLocal.dbConnection ?? configLocal.dbconnection,
};

export default config;