"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { LocationAutocomplete } from "./location-autocomplete";

export function PropertyFilters() {
  const t = useTranslations("properties");
  const tt = useTranslations("typeLabels");
  const { filters, setFilters, resetFilters } = usePropertyFilters();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LocationAutocomplete
          value={filters.location}
          onChange={(value) => setFilters({ ...filters, location: value })}
        />

        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("propertyType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tumu">{t("all")}</SelectItem>
            <SelectItem value="villa">{tt("villa")}</SelectItem>
            <SelectItem value="apartment">{tt("apartment")}</SelectItem>
            <SelectItem value="house">{tt("house")}</SelectItem>
            <SelectItem value="land">{tt("land")}</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">{t("priceRange")}</label>
          <Slider
            min={0}
            max={10000000}
            step={100000}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) =>
              setFilters({ ...filters, minPrice: min, maxPrice: max })
            }
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.minPrice.toLocaleString()}₺</span>
            <span>{filters.maxPrice.toLocaleString()}₺</span>
          </div>
        </div>

        <Button
          onClick={resetFilters}
          className="border-2 border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
          {t("clearFilters")}
        </Button>
      </div>
    </div>
  );
}
