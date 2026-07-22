import { useReducer } from "react";
import { FavsContext } from "./FavsContext";

const initialState = JSON.parse(localStorage.getItem("favs")) || [];

function favsReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "TOGGLE_FAV": {
      const exists = state.some(item => item.id === payload.id);
      const newState = exists
        ? state.filter(item => item.id !== payload.id)
        : [...state, payload];
      localStorage.setItem("favs", JSON.stringify(newState));
      return newState;
    }
    case "CLEAR_FAVS": {
      localStorage.removeItem("favs");
      return [];
    }
    default:
      return state;
  }
}

export function FavsProvider({ children }) {
  const [favs, dispatch] = useReducer(favsReducer, initialState);

  const toggleFav = (movie) => dispatch({ type: "TOGGLE_FAV", payload: movie });
  const clearFavs = () => dispatch({ type: "CLEAR_FAVS" });
  const isFav = (id) => favs.some(item => item.id === id);

  return (
    <FavsContext.Provider value={{ favs, toggleFav, clearFavs, isFav }}>
      {children}
    </FavsContext.Provider>
  );
}
