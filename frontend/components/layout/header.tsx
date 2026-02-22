"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Phone, Lock } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  const t = useTranslations("navigation");

  return (
    <header className="fixed w-full bg-slate-200/95 backdrop-blur-sm border-b border-slate-300 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
          Önder Emlak
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            {t("home")}
          </Link>
          <Link href="/properties" className="text-secondary hover:text-primary transition-colors">
            {t("properties")}
          </Link>
          <Link href="/about" className="text-secondary hover:text-primary transition-colors">
            {t("about")}
          </Link>
          <Link href="/contact" className="text-secondary hover:text-primary transition-colors">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link href="/login">
            <Button
              variant="outline"
              className="border-primary/20 bg-slate-200 hover:bg-primary hover:text-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg text-primary font-semibold"
            >
              <Lock className="w-4 h-4 mr-2" />
              <span>{t("adminLogin")}</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            className="bg-gradient-to-r from-slate-200 via-slate-200/95 to-slate-300 hover:from-primary/20 hover:via-primary/15 hover:to-accent/20 border-primary/20 hover:border-primary/30 text-primary transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <Phone className="w-4 h-4 mr-2 animate-pulse" />
            <span>{t("phone")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
