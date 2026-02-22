"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-primary/20 mb-4">{t("title")}</h1>
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t("message")}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              {t("home")}
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              {t("viewListings")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
