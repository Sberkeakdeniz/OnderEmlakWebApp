"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { InputWithIcon } from "@/components/ui/input-with-icon";

export function HeroSearch() {
  const t = useTranslations("home");

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputWithIcon
          placeholder={t("searchLocation")}
          className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 ring-accent/50"
          icon={<MapPin className="text-accent" />}
        />
        <Input
          placeholder={t("searchPrice")}
          className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 ring-accent/50"
          type="number"
        />
        <Link href="/properties">
          <Button className="w-full bg-accent hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 text-secondary font-semibold text-lg">
            {t("searchButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
