import { Handshake, Home, Users, Medal, Phone, Mail, MapPin } from 'lucide-react';
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
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    alternates: {
      languages: {
        en: `${baseUrl}/en/about`,
        tr: `${baseUrl}/tr/about`,
      },
    },
  };
}

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-secondary via-secondary to-slate-800">
        {/* Subtle warm glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
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

      {/* Stats Section - bridges hero and content */}
      <section className="relative z-10 -mt-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {[
                { number: "30+", label: t('yearsExperience') },
                { number: t('hundreds'), label: t('happyCustomers') },
                { number: t('hundreds'), label: t('successfulSales') }
              ].map((stat, index) => (
                <div key={index} className="text-center py-8 px-6">
                  <div className="text-3xl font-bold text-secondary mb-1">{stat.number}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Vision and Mission */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-5 text-secondary">{t('vision')}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('visionText')}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-5 text-secondary">{t('mission')}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('missionText')}
                </p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full h-[460px] rounded-2xl bg-gradient-to-br from-secondary via-slate-700 to-secondary overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-primary/10 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="relative h-full flex flex-col items-center justify-center px-8">
                  <div className="text-8xl font-bold text-white/90 mb-2">30+</div>
                  <div className="text-lg text-slate-300 font-light">{t('marmarisYears')}</div>
                  <div className="mt-8 h-px w-16 bg-accent/60" />
                  <div className="mt-4 text-sm text-slate-400 tracking-wider uppercase">Onder Emlak</div>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12 text-center text-secondary">{t('values')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Handshake, title: t('integrity'), desc: t('integrityDesc') },
                { icon: Users, title: t('customerFocus'), desc: t('customerFocusDesc') },
                { icon: Home, title: t('expertise'), desc: t('expertiseDesc') },
                { icon: Medal, title: t('reliability'), desc: t('reliabilityDesc') }
              ].map((value, index) => (
                <div key={index}
                     className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12 text-center text-secondary">{t('team')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Seracettin Akdeniz",
                  role: t('founderRole'),
                  contact: { phone: "+90 542 214 60 57", email: "onderemlakmarmaris@gmail.com" }
                },
                {
                  name: "Mehmet Muhit Dericioğlu",
                  role: t('consultantRole'),
                  contact: { phone: "+90 542 662 42 50", email: "-" }
                }
              ].map((member, index) => (
                <article key={index} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-slate-600 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-3xl font-bold text-secondary/60">{member.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold mb-1 text-secondary">{member.name}</h3>
                      <p className="text-muted-foreground mb-4">{member.role}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{member.contact.phone}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{member.contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-2xl p-12 text-center relative overflow-hidden bg-gradient-to-r from-secondary via-slate-700 to-secondary">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-white">{t('ctaTitle')}</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                {t('ctaText')}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-semibold
                           hover:bg-accent/90 transition-colors shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  {t('ctaContact')}
                </Link>
                <a
                  href="https://www.google.com/maps/place/Tepe,+48.+Sk.+No:6,+48700+Marmaris%2FMu%C4%9Fla/@36.7839777,28.2743917,19z/data=!3m1!4b1!4m6!3m5!1s0x14bf95c7b92c3df9:0x5ffd4b2dfa811714!8m2!3d36.7839777!4d28.2743917!16s%2Fg%2F11c1z0_8_m?entry=ttu"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold
                           hover:bg-white/20 transition-colors border border-white/10"
                >
                  <MapPin className="w-5 h-5" />
                  {t('ctaVisit')}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
