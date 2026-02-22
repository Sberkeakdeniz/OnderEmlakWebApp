import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import PropertyDetailClient from "@/components/property/property-detail-client";
import { Property } from "@/types/property";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onderemlakmarmaris.com";

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const property = await getProperty(id);
  if (!property) {
    return { title: "Not Found" };
  }

  const description = property.description?.slice(0, 160) || "";

  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      images: property.images?.[0]?.url ? [{ url: property.images[0].url }] : [],
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    alternates: {
      languages: {
        en: `${baseUrl}/en/properties/${id}`,
        tr: `${baseUrl}/tr/properties/${id}`,
      },
    },
  };
}

export default async function PropertyDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const property = await getProperty(id);
  const t = await getTranslations({ locale, namespace: "propertyDetail" });

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-muted-foreground">{t("notFound")}</p>
        <Link href="/properties">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToListings")}
          </Button>
        </Link>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
