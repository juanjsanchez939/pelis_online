import { useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavsContext } from './FavsContext';

const STORAGE_KEY = 'favs';

function favsReducer(state, action) {
  switch (action.type) {
    case 'LOAD_FAVS':
      return action.payload;
    case 'TOGGLE_FAV': {
      const exists = state.some((item) => item.id === action.payload.id);
      const newState = exists
        ? state.filter((item) => item.id !== action.payload.id)
        : [...state, action.payload];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }
    case 'CLEAR_FAVS':
      AsyncStorage.removeItem(STORAGE_KEY);
      return [];
    default:
      return state;
  }
}

export function FavsProvider({ children }) {
  const [favs, dispatch] = useReducer(favsReducer, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) dispatch({ type: 'LOAD_FAVS', payload: JSON.parse(saved) });
      } catch {}
    })();
  }, []);

  const toggleFav = (movie) => dispatch({ type: 'TOGGLE_FAV', payload: movie });
  const clearFavs = () => dispatch({ type: 'CLEAR_FAVS' });
  const isFav = (id) => favs.some((item) => item.id === id);

  return (
    <FavsContext.Provider value={{ favs, toggleFav, clearFavs, isFav }}>
      {children}
    </FavsContext.Provider>
  );
}
