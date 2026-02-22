"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Bath, BedDouble, Square, Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { propertiesApi } from "@/lib/api";
import { Property } from "@/types/property";
import { LocationAutocomplete } from "@/components/property/location-autocomplete";

export default function PropertiesPage() {
  const t = useTranslations("properties");
  const tt = useTranslations("typeLabels");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minPrice: 0,
    maxPrice: 10000000,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    location: "",
    type: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const hasFilters = appliedFilters.location || appliedFilters.type ||
        appliedFilters.minPrice > 0 || appliedFilters.maxPrice < 10000000;

      let res;
      if (hasFilters) {
        res = await propertiesApi.search({
          city: appliedFilters.location || undefined,
          type: appliedFilters.type && appliedFilters.type !== "tumu" ? appliedFilters.type : undefined,
          minPrice: appliedFilters.minPrice > 0 ? appliedFilters.minPrice : undefined,
          maxPrice: appliedFilters.maxPrice < 10000000 ? appliedFilters.maxPrice : undefined,
          page,
          limit: 12,
          sort,
        });
      } else {
        res = await propertiesApi.getAll({ page, limit: 12, sort });
      }

      setProperties(res.data);
      setTotalPages(res.pages);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, appliedFilters, sort]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: "",
      type: "",
      minPrice: 0,
      maxPrice: 10000000,
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-secondary via-secondary to-slate-800">
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Onder Emlak Marmaris
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight">{t("title")}</h1>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Filters - Elevated */}
        <aside className="bg-white p-6 rounded-2xl shadow-xl -mt-8 relative z-10 mb-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <SelectItem value="office">{tt("office")}</SelectItem>
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
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white transition-colors h-11"
            >
              <Search className="w-4 h-4 mr-2" />
              {t("search")}
            </Button>

            <Button
              onClick={handleReset}
              className="border-2 border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors h-11"
            >
              {t("clearFilters")}
            </Button>
          </div>
        </aside>

        {/* Sort + Result Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            {t("listingsFound", { count: total })}
          </p>
          <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}>
            <SelectTrigger className="w-[200px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("sorting")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newest")}</SelectItem>
              <SelectItem value="oldest">{t("oldest")}</SelectItem>
              <SelectItem value="price_asc">{t("priceAsc")}</SelectItem>
              <SelectItem value="price_desc">{t("priceDesc")}</SelectItem>
              <SelectItem value="most_viewed">{t("mostViewed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-100 shadow-md overflow-hidden">
                <div className="h-52 bg-slate-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded" />
                    <div className="h-5 w-12 bg-slate-200 animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-slate-200 animate-pulse rounded" />
                    <div className="h-4 bg-slate-200 animate-pulse rounded" />
                    <div className="h-4 bg-slate-200 animate-pulse rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 w-24 bg-slate-200 animate-pulse rounded" />
                    <div className="h-9 w-24 bg-slate-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">{t("noResults")}</p>
            <Button onClick={handleReset} variant="outline">
              {t("clearFilters")}
            </Button>
          </div>
        )}

        {/* Property Listings */}
        {!loading && properties.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {properties.map((property) => (
                <article key={property._id}>
                <Card className="overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative h-52">
                      <Image
                        src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                        alt={property.title}
                        fill
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{property.title}</CardTitle>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {tt(property.type)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.location.city}, {property.location.state}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {property.type !== 'land' && (
                        <>
                          <div className="flex items-center">
                            <BedDouble className="w-4 h-4 mr-1" />
                            <span>{property.features.bedrooms || 0} {t("bedrooms")}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{property.features.bathrooms || 0} {t("bathrooms")}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>{property.features.area}m²</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-xl font-bold text-accent">
                      {property.price.toLocaleString()}₺
                    </span>
                    <Link href={`/properties/${property._id}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-white transition-colors">
                        {t("viewListing")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
      </div>
    </div>
  );
}
