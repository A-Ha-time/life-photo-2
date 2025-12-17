import {getTranslations} from 'next-intl/server';

import {CreateClient} from './ui/CreateClient';

export default async function CreatePage() {
  // 预加载翻译，保证缺失 key 能尽早暴露
  await getTranslations('Create');
  return <CreateClient />;
}

