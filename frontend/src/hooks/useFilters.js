import { useContext } from "react";
import { FiltersContext } from '../context/FiltersContext';

export function useFilters() {
  const { filters, setFilters } = useContext(FiltersContext);

  const filterProducts = (products) => {
    return products.filter(product => {
      const yearValid =
        !product.year || product.year >= filters.minPrice;

      const categoryValid =
        filters.category === "all" ||
        product.category.includes(filters.category);

      const searchValid =
        filters.searchQuery.trim() === "" ||
        product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return yearValid && categoryValid && searchValid;
    });
  };

  return { filters, filterProducts, setFilters };
}
