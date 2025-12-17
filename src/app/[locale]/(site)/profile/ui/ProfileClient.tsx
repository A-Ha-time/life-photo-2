'use client';

import {useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';

import {SCENES} from '@/lib/scenes';

type Profile = {
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
};

type Stats = {
  images: number;
  favorites: number;
};

type LibraryItem = {
  id: string;
  url: string;
  created_at: number;
  scene_id: string;
  favorited: 0 | 1;
};

async function toggleFavorite(imageId: string) {
  const resp = await fetch('/api/favorites', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({imageId})
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.error || '操作失败');
  return data as {favorited: boolean};
}

async function deleteImage(imageId: string) {
  const resp = await fetch(`/api/images/${encodeURIComponent(imageId)}`, {method: 'DELETE'});
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.error || '删除失败');
  return data as {ok: true};
}

async function fetchLibrary(tab: 'all' | 'favorites') {
  const resp = await fetch(`/api/library?tab=${encodeURIComponent(tab)}&limit=24`, {cache: 'no-store'});
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.error || '加载失败');
  return data as {items: LibraryItem[]};
}

export function ProfileClient({
  initialProfile,
  initialStats,
  initialItems
}: {
  initialProfile: Profile;
  initialStats: Stats;
  initialItems: LibraryItem[];
}) {
  const t = useTranslations('Profile');
  const locale = useLocale() as 'en' | 'zh' | 'ko' | 'ja';

  const [tab, setTab] = useState<'all' | 'favorites' | 'history' | 'stats'>('all');
  const [profile] = useState(initialProfile);
  const [stats, setStats] = useState(initialStats);
  const [items, setItems] = useState<LibraryItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const sceneNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SCENES) map.set(s.id, s.name[locale]);
    return map;
  }, [locale]);

  async function onSwitchTab(next: typeof tab) {
    setTab(next);
    if (next === 'all' || next === 'favorites') {
      setLoading(true);
      try {
        const data = await fetchLibrary(next);
        setItems(data.items);
      } finally {
        setLoading(false);
      }
    }
  }

  async function onShare(url: string) {
    try {
      if (navigator.share) {
        await navigator.share({title: 'LUMINA STUDIO', url});
        return;
      }
    } catch {
      // ignore
    }
    try {
      await navigator.clipboard.writeText(url);
      alert(t('share.copied'));
    } catch {
      alert(t('share.copyFailed'));
    }
  }

  return (
    <section className="min-h-screen py-16 px-6 relative overflow-hidden" style={{paddingTop: 80}}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    profile.avatarUrl ??
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
                  }
                  alt={t('avatarAlt')}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-110 transition-transform"
                type="button"
                aria-label={t('editAvatar')}
              >
                <i className="fas fa-camera text-white" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.displayName}</h1>
              <p className="text-slate-400 mb-4">{profile.email ?? t('emailPlaceholder')}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="badge">
                  <i className="fas fa-crown text-yellow-400" /> {t('badgePro')}
                </span>
                <span className="badge">
                  <i className="fas fa-fire" /> {t('badgeStreak')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">{stats.images}</div>
                <div className="text-sm text-slate-400">{t('statImages')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">{stats.favorites}</div>
                <div className="text-sm text-slate-400">{t('statFavorites')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">—</div>
                <div className="text-sm text-slate-400">{t('statLikes')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${
              tab === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'glass text-slate-300 hover:bg-slate-700/50 transition-all'
            }`}
            type="button"
            onClick={() => onSwitchTab('all')}
          >
            <i className="fas fa-images mr-2" />
            {t('tabWorks')}
          </button>

          <button
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${
              tab === 'favorites'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'glass text-slate-300 hover:bg-slate-700/50 transition-all'
            }`}
            type="button"
            onClick={() => onSwitchTab('favorites')}
          >
            <i className="fas fa-heart mr-2" />
            {t('tabFavorites')}
          </button>

          <button
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${
              tab === 'history'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'glass text-slate-300 hover:bg-slate-700/50 transition-all'
            }`}
            type="button"
            onClick={() => onSwitchTab('history')}
          >
            <i className="fas fa-history mr-2" />
            {t('tabHistory')}
          </button>

          <button
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${
              tab === 'stats'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'glass text-slate-300 hover:bg-slate-700/50 transition-all'
            }`}
            type="button"
            onClick={() => onSwitchTab('stats')}
          >
            <i className="fas fa-chart-line mr-2" />
            {t('tabStats')}
          </button>
        </div>

        {tab === 'history' || tab === 'stats' ? (
          <div className="card">
            <div className="text-slate-300">{t('comingSoon')}</div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="card">
                <div className="text-slate-300">{t('loading')}</div>
              </div>
            ) : items.length === 0 ? (
              <div className="card">
                <div className="text-slate-300">{t('empty')}</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div className="card p-0 group cursor-pointer" key={item.id}>
                    <div className="relative overflow-hidden rounded-t-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={t('workAlt')}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex gap-2">
                            <a
                              className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-center"
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              download
                              onClick={(e) => e.stopPropagation()}
                              aria-label={t('actions.download')}
                            >
                              <i className="fas fa-download text-white" />
                            </a>
                            <button
                              className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onShare(item.url);
                              }}
                              aria-label={t('actions.share')}
                            >
                              <i className="fas fa-share-alt text-white" />
                            </button>
                            <button
                              className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm(t('dialogs.confirmDelete'))) return;
                                await deleteImage(item.id);
                                setItems((prev) => prev.filter((x) => x.id !== item.id));
                                setStats((prev) => ({
                                  ...prev,
                                  images: Math.max(0, prev.images - 1),
                                  favorites:
                                    item.favorited === 1 ? Math.max(0, prev.favorites - 1) : prev.favorites
                                }));
                              }}
                              aria-label={t('actions.delete')}
                            >
                              <i className="fas fa-trash text-white" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="badge">
                          <i className="fas fa-tag text-sm" />{' '}
                          {sceneNameById.get(item.scene_id) ?? item.scene_id}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{new Date(item.created_at).toISOString().slice(0, 10)}</span>
                        <button
                          className="text-slate-400 flex items-center gap-1"
                          type="button"
                          onClick={async () => {
                            const res = await toggleFavorite(item.id);
                            setItems((prev) =>
                              prev.map((x) => (x.id === item.id ? {...x, favorited: res.favorited ? 1 : 0} : x))
                            );
                            setStats((prev) => ({
                              ...prev,
                              favorites: res.favorited ? prev.favorites + 1 : Math.max(0, prev.favorites - 1)
                            }));
                            if (tab === 'favorites' && !res.favorited) {
                              setItems((prev) => prev.filter((x) => x.id !== item.id));
                            }
                          }}
                          aria-label={t('actions.favorite')}
                        >
                          <i className={`fas fa-heart ${item.favorited ? 'text-red-400' : 'text-slate-500'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
