import { Platform } from 'react-native';
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
  : Platform.select({
      android: 'http://10.0.2.2:3001',
      ios: 'http://localhost:3001',
      default: 'http://localhost:3001',
    });

export const IMAGE_BASE_URL = devHost
  ? `http://${devHost}:5173`
  : Platform.select({
      android: 'http://10.0.2.2:5173',
      ios: 'http://localhost:5173',
      default: 'http://localhost:5173',
    });
