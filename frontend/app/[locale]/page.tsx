import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Home, Building2, MapPin } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HeroSearch } from "@/components/home/hero-search";
import { Property, PaginatedResponse } from "@/types/property";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/properties?page=1&limit=3&sort=newest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: PaginatedResponse<Property> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [t, ts, featuredProperties] = await Promise.all([
    getTranslations("home"),
    getTranslations("statusLabels"),
    getFeaturedProperties(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.1&auto=format&fit=crop&w=2850&q=80"
          alt="Luxury real estate"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/70 to-secondary/80" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t("heroTitle")}
            <span className="block text-accent">{t("heroTitleAccent")}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200">{t("heroSubtitle")}</p>

          <HeroSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-muted to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("whyChooseUs")}
            <span className="text-primary ml-2">{t("whyChooseUsAccent")}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-muted">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-secondary">{t("widePortfolio")}</h3>
              <p className="text-muted-foreground">{t("widePortfolioDesc")}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-muted">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-secondary">{t("expertTeam")}</h3>
              <p className="text-muted-foreground">{t("expertTeamDesc")}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-muted">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-secondary">{t("easyAccess")}</h3>
              <p className="text-muted-foreground">{t("easyAccessDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("featuredTitle")}
            <span className="text-primary ml-2">{t("featuredTitleAccent")}</span>
          </h2>

          {featuredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("noListings")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <article key={property._id} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-muted">
                  <div className="relative overflow-hidden h-64">
                    <Image
                      src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                      alt={property.title}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                      {ts(property.status)}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 text-secondary">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{property.location.city}, {property.location.state}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-accent text-2xl font-bold">
                        {property.price.toLocaleString('tr-TR')} ₺
                      </span>
                      <Link href={`/properties/${property._id}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white transition-colors">
                          {t("details")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button variant="outline" size="lg" className="text-primary border-primary hover:bg-primary hover:text-white">
                {t("viewAllListings")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
