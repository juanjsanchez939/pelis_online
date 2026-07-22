import { useState } from "react";
import { FiltersContext } from "./FiltersContext";

export function FiltersProvider({ children }) {

  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 1970,
    searchQuery: ""
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}
