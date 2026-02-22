"use client";

import { usePropertyFilters } from "./use-property-filters";
import { PROPERTIES } from "@/data/properties";

export function useProperties() {
  const { filters } = usePropertyFilters();

  const filteredProperties = PROPERTIES.filter(property => {
    return (
      property.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      (filters.type === "all" || property.type === filters.type) &&
      property.price >= filters.minPrice &&
      property.price <= filters.maxPrice
    );
  });

  return { filteredProperties };
}