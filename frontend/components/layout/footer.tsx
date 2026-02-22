"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Facebook, Instagram, Clock, ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("navigation");

  return (
    <footer className="bg-[#2B3440] text-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Company Info */}
          <div>
            <h3 className="text-[#F97316] text-xl font-semibold mb-6">{t("companyName")}</h3>
            <p className="text-gray-400 text-sm mb-8">
              {t("companyDescription")}
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/onderemlak.marmaris/?locale=tr_TR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center hover:bg-[#F97316] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/onderemlakmarmaris/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center hover:bg-[#F97316] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label={t("quickLinks")}>
            <h3 className="text-[#F97316] text-xl font-semibold mb-6">{t("quickLinks")}</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#F97316] transition-colors flex items-center text-sm group"
                >
                  <div className="w-5 flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 hover:text-[#F97316] transition-colors flex items-center text-sm group"
                >
                  <div className="w-5 flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  {nav("properties")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-[#F97316] transition-colors flex items-center text-sm group"
                >
                  <div className="w-5 flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#F97316] transition-colors flex items-center text-sm group"
                >
                  <div className="w-5 flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#F97316] text-xl font-semibold mb-6">{t("contactTitle")}</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+902524132273"
                  className="flex items-center text-gray-400 hover:text-[#F97316] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center mr-3 group-hover:bg-[#F97316]/10">
                    <Phone className="w-4 h-4 text-[#F97316]" />
                  </div>
                  0 (252) 413 22 73
                </a>
              </li>
              <li>
                <a
                  href="mailto:onderemlakmarmaris@gmail.com"
                  className="flex items-center text-gray-400 hover:text-[#F97316] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center mr-3 group-hover:bg-[#F97316]/10">
                    <Mail className="w-4 h-4 text-[#F97316]" />
                  </div>
                  onderemlakmarmaris@gmail.com
                </a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                </div>
                <span>{t("address")}</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#3B434F] flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-[#F97316]" />
                </div>
                <span>{t("workingHours")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#3B434F] mt-16 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
