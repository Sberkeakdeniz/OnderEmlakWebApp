"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Car,
  Sofa,
  Eye,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { Property } from "@/types/property";
import { safeExternalUrl } from "@/lib/utils";

export default function PropertyDetailClient({ property }: { property: Property }) {
  const t = useTranslations("propertyDetail");
  const tt = useTranslations("typeLabels");
  const ts = useTranslations("statusLabels");
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const images = property.images?.length > 0
    ? property.images.map(img => img.url)
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link href="/properties" className="hover:text-primary">{t("listings")}</Link>
        <span>/</span>
        <span>{property.title}</span>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={images[activeImage]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute top-4 right-4 bg-accent text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              {ts(property.status)}
            </div>
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-video rounded-lg overflow-hidden bg-muted ${
                    activeImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 16vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Card */}
        <aside>
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">{property.price.toLocaleString('tr-TR')} ₺</h2>
            <p className="text-muted-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {property.location.address}, {property.location.city}, {property.location.state}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Eye className="w-4 h-4" />
              <span>{t("views", { count: property.views })}</span>
            </div>

            {!showContact ? (
              <Button
                className="w-full mb-4"
                onClick={() => setShowContact(true)}
              >
                {t("contactButton")}
              </Button>
            ) : (
              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-3 text-primary">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+902524132273" className="text-lg font-semibold">
                    0 (252) 413 22 73
                  </a>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:onderemlakmarmaris@gmail.com" className="text-sm">
                    onderemlakmarmaris@gmail.com
                  </a>
                </div>
              </div>
            )}

            {safeExternalUrl(property.sahibindenUrl) && (
              <a
                href={safeExternalUrl(property.sahibindenUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full border-[#0bb] text-[#0bb] hover:bg-[#0bb] hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("viewOnSahibinden")}
                </Button>
              </a>
            )}

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="font-semibold">{t("realEstateAgent")}</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {property.owner?.firstName?.[0] || 'Ö'}{property.owner?.lastName?.[0] || 'E'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'Önder Emlak'}
                  </p>
                  <p className="text-sm text-muted-foreground">{t("agentTitle")}</p>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {tt(property.type)}
              </span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {ts(property.status)}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">{t("features")}</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("area")}</p>
                  <p className="font-medium">{property.features.area} m²</p>
                </div>
              </div>

              {property.type !== 'land' && property.features.bedrooms != null && (
                <div className="flex items-center gap-3">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("bedroom")}</p>
                    <p className="font-medium">{property.features.bedrooms}</p>
                  </div>
                </div>
              )}

              {property.type !== 'land' && property.features.bathrooms != null && (
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("bathroom")}</p>
                    <p className="font-medium">{property.features.bathrooms}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Car className={`w-5 h-5 ${property.features.parking ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{t("parking")}</p>
                  <p className="font-medium">{property.features.parking ? t("parkingYes") : t("parkingNo")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Sofa className={`w-5 h-5 ${property.features.furnished ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{t("furnished")}</p>
                  <p className="font-medium">{property.features.furnished ? t("furnishedYes") : t("furnishedNo")}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">{t("amenities")}</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </article>

        {/* Location */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{t("location")}</h2>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{property.location.address}</p>
                <p className="text-sm">{property.location.city}, {property.location.state}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
