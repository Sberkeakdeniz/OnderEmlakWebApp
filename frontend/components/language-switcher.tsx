"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "tr" : "en";
  const label = nextLocale.toUpperCase();

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSwitch}
      className="border-primary/20 bg-slate-200 hover:bg-primary hover:text-slate-200 transition-all duration-300 text-primary font-semibold"
    >
      <Globe className="w-4 h-4 mr-1" />
      {label}
    </Button>
  );
}
