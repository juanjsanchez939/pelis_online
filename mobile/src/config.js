import Constants from 'expo-constants';

function getDevServerHost() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return null;
}

const devHost = getDevServerHost();

export const API_BASE_URL = devHost
  ? `http://${devHost}:3001`
  : 'https://pelis-online-api.onrender.com';


export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
