import {redirect} from 'next/navigation';

import type {AppLocale} from '@/i18n/routing';

export default function LegacyProfileRedirect({
  params
}: {
  params: {locale: AppLocale};
}) {
  redirect(`/${params.locale}/pricing`);
}
