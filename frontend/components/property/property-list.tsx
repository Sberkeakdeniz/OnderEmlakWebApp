"use client";

import { useTranslations } from "next-intl";
import { PropertyCard } from "./property-card";
import { useState, useEffect } from "react";
import { propertiesApi } from "@/lib/api";
import { Property } from "@/types/property";
import { Loader2 } from "lucide-react";

export function PropertyList() {
  const t = useTranslations("propertyList");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertiesApi.getAll({ page: 1, limit: 12 });
        setProperties(res.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("noProperties")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
