"use client";

import { useState } from "react";

export function usePropertyFilters() {
  const [filters, setFilters] = useState({
    location: "",
    type: "all",
    minPrice: 0,
    maxPrice: 10000000,
  });

  const resetFilters = () => {
    setFilters({
      location: "",
      type: "all",
      minPrice: 0,
      maxPrice: 10000000,
    });
  };

  return { filters, setFilters, resetFilters };
}