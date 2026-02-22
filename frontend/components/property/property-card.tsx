"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bath, BedDouble, Square, ExternalLink } from "lucide-react";
import { Property } from "@/types/property";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { safeExternalUrl } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const t = useTranslations("properties");
  const ts = useTranslations("propertyDetail");

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative h-48">
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
        <CardTitle className="mb-2">{property.title}</CardTitle>
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
        <span className="text-xl font-bold text-primary">
          {property.price.toLocaleString()}₺
        </span>
        <div className="flex items-center gap-2">
          {safeExternalUrl(property.sahibindenUrl) && (
            <a href={safeExternalUrl(property.sahibindenUrl)!} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" title={ts("viewOnSahibinden")}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          )}
          <Link href={`/properties/${property._id}`}>
            <Button>{t("viewListing")}</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
