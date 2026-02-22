import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onderemlakmarmaris.com';
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
    alternates: {
      languages: {
        en: `${baseUrl}/en/contact`,
        tr: `${baseUrl}/tr/contact`,
      },
    },
  };
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-secondary via-secondary to-slate-800">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Onder Emlak Marmaris
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards - bridges hero and content */}
      <section className="relative z-10 -mt-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <a href="tel:+902524132273" className="text-center py-7 px-4 group hover:bg-slate-50 transition-colors first:rounded-l-2xl">
                <Phone className="w-6 h-6 mx-auto mb-2 text-primary group-hover:text-accent transition-colors" />
                <div className="text-sm text-muted-foreground group-hover:text-secondary transition-colors">0 (252) 413 22 73</div>
              </a>
              <a href="mailto:onderemlakmarmaris@gmail.com" className="text-center py-7 px-4 group hover:bg-slate-50 transition-colors">
                <Mail className="w-6 h-6 mx-auto mb-2 text-primary group-hover:text-accent transition-colors" />
                <div className="text-sm text-muted-foreground group-hover:text-secondary transition-colors break-all">onderemlakmarmaris@gmail.com</div>
              </a>
              <div className="text-center py-7 px-4">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Marmaris, Muğla</div>
              </div>
              <div className="text-center py-7 px-4">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">{t('workingHoursShort')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Detailed Contact Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            {/* Left - Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-5 text-secondary">{t('reachUs')}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('reachUsText')}
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+902524132273"
                  className="flex items-center gap-4 group p-5 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary">{t('phone')}</h3>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">0 (252) 413 22 73</p>
                  </div>
                </a>

                <a
                  href="mailto:onderemlakmarmaris@gmail.com"
                  className="flex items-center gap-4 group p-5 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary">{t('email')}</h3>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">onderemlakmarmaris@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary">{t('addressLabel')}</h3>
                    <p className="text-muted-foreground">{t('address')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary">{t('workingHoursTitle')}</h3>
                    <p className="text-muted-foreground">{t('workingHours')}</p>
                    <p className="text-sm text-muted-foreground/70">{t('sundayClosed')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 h-full min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5!2d28.2717!3d36.8513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bfcb0b0e3b8a9d%3A0x5a0e3c8e8e8e8e8e!2sTepe%2C%2048.%20Sk.%20No%3A6%2C%2048700%20Marmaris%2FMu%C4%9Fla!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('mapTitle')}
              />
            </div>
          </section>

          {/* Social Media Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12 text-center text-secondary">{t('socialMedia')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a
                href="https://www.facebook.com/onderemlak.marmaris/?locale=tr_TR"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <Facebook className="w-12 h-12 mx-auto mb-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-1 text-secondary">Facebook</h3>
                <p className="text-muted-foreground">@onderemlak.marmaris</p>
              </a>

              <a
                href="https://www.instagram.com/onderemlakmarmaris/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <Instagram className="w-12 h-12 mx-auto mb-4 text-[#E4405F] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-1 text-secondary">Instagram</h3>
                <p className="text-muted-foreground">@onderemlakmarmaris</p>
              </a>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-2xl p-12 text-center relative overflow-hidden bg-gradient-to-r from-secondary via-slate-700 to-secondary">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-white">{t('ctaTitle')}</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                {t('ctaText')}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+902524132273"
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  0 (252) 413 22 73
                </a>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/10"
                >
                  <MapPin className="w-5 h-5" />
                  {t('ctaViewListings')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
