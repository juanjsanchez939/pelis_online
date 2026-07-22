import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const savedToken = await AsyncStorage.getItem('token');
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken) setToken(savedToken);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const login = async (userData, jwtToken) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    if (jwtToken) {
      setToken(jwtToken);
      await AsyncStorage.setItem('token', jwtToken);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['user', 'token', 'favs']);
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
