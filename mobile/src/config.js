import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  if (Constants.expoConfig?.extra?.apiBaseUrl) {
    return Constants.expoConfig.extra.apiBaseUrl;
  }
  
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3001',
      ios: 'http://localhost:3001',
      default: 'http://localhost:3001',
    });
  }
  
  return 'https://tu-backend-produccion.com';
};

export const API_BASE_URL = getApiBaseUrl();
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
