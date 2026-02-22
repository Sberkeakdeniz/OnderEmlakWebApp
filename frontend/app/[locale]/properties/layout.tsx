import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onderemlakmarmaris.com';
  return {
    title: t('propertiesTitle'),
    description: t('propertiesDescription'),
    alternates: {
      languages: {
        en: `${baseUrl}/en/properties`,
        tr: `${baseUrl}/tr/properties`,
      },
    },
  };
}

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
