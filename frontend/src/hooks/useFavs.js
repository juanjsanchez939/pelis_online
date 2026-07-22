import { useContext } from "react";
import { FavsContext } from "../context/FavsContext";

export const useFavs = () => {
  const context = useContext(FavsContext);
  if (!context) {
    throw new Error("useFavs must be used within a FavsProvider");
  }
  return context;
};
