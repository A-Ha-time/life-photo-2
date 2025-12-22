'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';

import {SCENES} from '@/lib/scenes';

type UploadResult = {
  id: string;
  url: string;
};

type UploadedImage = UploadResult & {
  localPreviewUrl: string;
  name: string;
};

type Task = {
  id: string;
  sceneId: string;
  status: string;
  progress: number;
  model: string;
  size: string;
  quality: string;
  createdAt: number;
  updatedAt: number;
};

type TaskImage = {
  id: string;
  url: string;
  created_at: number;
};

async function uploadImage(kind: 'front' | 'side' | 'full' | 'ref', file: File): Promise<UploadResult> {
  const form = new FormData();
  form.set('kind', kind);
  form.set('file', file);

  const tryOnce = async (path: string) => {
    const resp = await fetch(path, {method: 'POST', body: form});
    const data = await resp.json().catch(() => null);
    return {resp, data};
  };

  // 为了兼容存在路由冲突/重写的部署环境，优先使用别名端点 `/api/upload`，
  // 并在其不存在时回退到 `/api/uploads`。
  let {resp, data} = await tryOnce('/api/upload');
  if (resp.status === 404) {
    ({resp, data} = await tryOnce('/api/uploads'));
  }
  if (!resp.ok) throw new Error(data?.error || '上传失败');
  return data as UploadResult;
}

async function createGeneration(payload: {
  sceneId: string;
  frontUploadId: string;
  sideUploadId?: string;
  fullUploadId?: string;
  refUploadIds?: string[];
  customPrompt?: string;
  sizePreset: '1024x1024' | '1024x768' | '768x1024' | '2048x2048';
  qualityPreset: 'standard' | 'hd' | 'uhd';
}) {
  const resp = await fetch('/api/generations', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.error || '创建任务失败');
  return data as {taskId: string; status: string; estimatedTime: number | null};
}

async function fetchTask(taskId: string) {
  const resp = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {cache: 'no-store'});
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(data?.error || '查询任务失败');
  return data as {task: Task; images: TaskImage[]};
}

function formatEta(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) return null;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.round(seconds / 60);
  return `${m}m`;
}

export function CreateClient() {
  const t = useTranslations('Create');
  const locale = useLocale() as 'en' | 'zh' | 'ko' | 'ja';

  const [front, setFront] = useState<UploadedImage | null>(null);
  const [side, setSide] = useState<UploadedImage | null>(null);
  const [full, setFull] = useState<UploadedImage | null>(null);
  const [refs, setRefs] = useState<UploadedImage[]>([]);

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [sizePreset, setSizePreset] = useState<'1024x1024' | '1024x768' | '768x1024' | '2048x2048'>(
    '1024x1024'
  );
  const [qualityPreset, setQualityPreset] = useState<'standard' | 'hd' | 'uhd'>('hd');

  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [images, setImages] = useState<TaskImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [eta, setEta] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  const canGenerate = Boolean(front?.id && selectedSceneId && !isUploading && !isGenerating);

  const selectedScene = useMemo(() => {
    if (!selectedSceneId) return null;
    return SCENES.find((s) => s.id === selectedSceneId) ?? null;
  }, [selectedSceneId]);

  useEffect(() => {
    return () => {
      for (const u of [front, side, full, ...refs].filter(Boolean) as UploadedImage[]) {
        URL.revokeObjectURL(u.localPreviewUrl);
      }
      if (pollingRef.current) window.clearTimeout(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setUpload(kind: 'front' | 'side' | 'full', file: File) {
    setError(null);
    setIsUploading(true);
    try {
      const localPreviewUrl = URL.createObjectURL(file);
      const result = await uploadImage(kind, file);
      const uploaded: UploadedImage = {
        ...result,
        localPreviewUrl,
        name: file.name
      };
      if (kind === 'front') {
        if (front) URL.revokeObjectURL(front.localPreviewUrl);
        setFront(uploaded);
      } else if (kind === 'side') {
        if (side) URL.revokeObjectURL(side.localPreviewUrl);
        setSide(uploaded);
      } else {
        if (full) URL.revokeObjectURL(full.localPreviewUrl);
        setFull(uploaded);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.unknown'));
    } finally {
      setIsUploading(false);
    }
  }

  async function addRefs(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);
    try {
      const next: UploadedImage[] = [];
      for (const file of Array.from(files).slice(0, 10)) {
        const localPreviewUrl = URL.createObjectURL(file);
        const result = await uploadImage('ref', file);
        next.push({...result, localPreviewUrl, name: file.name});
      }
      setRefs((prev) => [...prev, ...next].slice(0, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.unknown'));
    } finally {
      setIsUploading(false);
    }
  }

  async function onGenerate() {
    if (!front?.id || !selectedSceneId) return;
    setError(null);
    setIsGenerating(true);
    setTask(null);
    setImages([]);
    setActiveIndex(0);
    try {
      const res = await createGeneration({
        sceneId: selectedSceneId,
        frontUploadId: front.id,
        sideUploadId: side?.id ?? undefined,
        fullUploadId: full?.id ?? undefined,
        refUploadIds: refs.map((r) => r.id),
        customPrompt: customPrompt.trim() ? customPrompt.trim() : undefined,
        sizePreset,
        qualityPreset
      });
      setTaskId(res.taskId);
      setEta(res.estimatedTime);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.unknown'));
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (!taskId) return;
    const currentTaskId = taskId;
    let cancelled = false;

    async function tick() {
      if (cancelled) return;
      try {
        const data = await fetchTask(currentTaskId);
        setTask(data.task);
        setImages(data.images);
        if (data.images.length > 0 && activeIndex >= data.images.length) setActiveIndex(0);

        const done = ['completed', 'failed', 'cancelled'].includes(String(data.task.status));
        if (done) {
          setIsGenerating(false);
          return;
        }
      } catch (e) {
        // 查询失败不直接打断，继续尝试
      }
      pollingRef.current = window.setTimeout(tick, 2000);
    }

    tick();
    return () => {
      cancelled = true;
      if (pollingRef.current) window.clearTimeout(pollingRef.current);
    };
  }, [taskId, activeIndex]);

  const previewUrl = images[activeIndex]?.url ?? null;

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
    <main style={{paddingTop: 80}}>
      <div className="container-studio" style={{padding: '3rem 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h1 className="title-elegant" style={{fontSize: '3rem', marginBottom: '0.75rem'}}>
            {t('title1')} <span className="title-gold">{t('title2')}</span>
          </h1>
          <p className="subtitle-elegant">{t('subtitle')}</p>
        </div>

        {error ? (
          <div
            className="studio-card"
            style={{
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--error)'}}>
              <i className="fas fa-triangle-exclamation" />
              <span style={{color: 'var(--text-secondary)', whiteSpace: 'pre-wrap'}}>{error}</span>
            </div>
          </div>
        ) : null}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '2rem'}}>
          {/* Left: uploads */}
          <div className="studio-card">
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-upload" />
              {t('uploads.title')}
            </h2>

            <UploadSlot
              required
              kind="front"
              title={t('uploads.front')}
              icon="fa-user"
              uploaded={front}
              disabled={isUploading || isGenerating}
              hintText={t('uploads.clickOrDrop')}
              removeLabel={t('uploads.remove')}
              onPick={(file) => setUpload('front', file)}
              onRemove={() => {
                if (front) URL.revokeObjectURL(front.localPreviewUrl);
                setFront(null);
              }}
            />

            <UploadSlot
              kind="side"
              title={t('uploads.side')}
              icon="fa-user-circle"
              uploaded={side}
              disabled={isUploading || isGenerating}
              hintText={t('uploads.clickOrDrop')}
              removeLabel={t('uploads.remove')}
              onPick={(file) => setUpload('side', file)}
              onRemove={() => {
                if (side) URL.revokeObjectURL(side.localPreviewUrl);
                setSide(null);
              }}
            />

            <UploadSlot
              kind="full"
              title={t('uploads.full')}
              icon="fa-male"
              uploaded={full}
              disabled={isUploading || isGenerating}
              hintText={t('uploads.clickOrDrop')}
              removeLabel={t('uploads.remove')}
              onPick={(file) => setUpload('full', file)}
              onRemove={() => {
                if (full) URL.revokeObjectURL(full.localPreviewUrl);
                setFull(null);
              }}
            />

            <div
              style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 8,
                marginTop: '1.5rem'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem'}}>
                <i className="fas fa-info-circle" />
                <span>{t('uploads.tip')}</span>
              </div>
            </div>
          </div>

          {/* Middle: scene + refs */}
          <div className="studio-card">
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-palette" />
              {t('scenes.title')}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2rem',
                maxHeight: 500,
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}
            >
              {SCENES.map((scene) => {
                const selected = scene.id === selectedSceneId;
                return (
                  <div
                    key={scene.id}
                    className={`scene-card ${selected ? 'selected' : ''}`}
                    onClick={() => setSelectedSceneId(scene.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedSceneId(scene.id);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={scene.coverImageUrl} alt={scene.name[locale]} />
                    <div style={{padding: '0.75rem', background: 'var(--bg-card)'}}>
                      <div style={{fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem'}}>
                        {scene.name[locale]}
                      </div>
                      <div style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>{scene.category[locale]}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="divider-gold" style={{margin: '1.5rem 0'}} />

            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-image" />
                {t('refs.title')}{' '}
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 400}}>
                  {t('refs.optional')}
                </span>
              </h3>

              <label className="upload-slot" style={{padding: '1.5rem', display: 'block', cursor: isUploading ? 'wait' : 'pointer'}}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{display: 'none'}}
                  disabled={isUploading || isGenerating}
                  onChange={(e) => addRefs(e.target.files)}
                />
                <i className="fas fa-images" style={{fontSize: '1.5rem', color: 'var(--gold-primary)', marginBottom: '0.5rem'}} />
                <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{t('refs.desc')}</p>
                {refs.length > 0 ? (
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.75rem'}}>
                    {t('refs.count', {count: refs.length})}
                  </p>
                ) : null}
              </label>
            </div>
          </div>

          {/* Right: settings + preview */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="studio-card" style={{flex: '0 0 auto'}}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--gold-primary)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-sliders-h" />
                {t('settings.title')}
              </h2>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>
                  {t('settings.customPrompt')}
                </label>
                <textarea
                  className="input-studio"
                  rows={2}
                  placeholder={t('settings.customPromptPlaceholder')}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  style={{resize: 'vertical', fontSize: '0.875rem', padding: '0.75rem 1rem'}}
                  disabled={isGenerating}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem'}}>
                <div>
                  <label style={{display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>
                    {t('settings.size')}
                  </label>
                  <select
                    className="input-studio"
                    style={{fontSize: '0.875rem', padding: '0.75rem 1rem'}}
                    value={sizePreset}
                    onChange={(e) => setSizePreset(e.target.value as any)}
                    disabled={isGenerating}
                  >
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x768">1024x768</option>
                    <option value="768x1024">768x1024</option>
                    <option value="2048x2048">2048x2048</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>
                    {t('settings.quality')}
                  </label>
                  <select
                    className="input-studio"
                    style={{fontSize: '0.875rem', padding: '0.75rem 1rem'}}
                    value={qualityPreset}
                    onChange={(e) => setQualityPreset(e.target.value as any)}
                    disabled={isGenerating}
                  >
                    <option value="standard">{t('settings.qualityStandard')}</option>
                    <option value="hd">{t('settings.qualityHd')}</option>
                    <option value="uhd">{t('settings.qualityUhd')}</option>
                  </select>
                </div>
              </div>

              <button
                className="btn-gold"
                id="generateBtn"
                disabled={!canGenerate}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  opacity: canGenerate ? 1 : 0.5,
                  cursor: canGenerate ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
                type="button"
                onClick={onGenerate}
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <i className="fas fa-spinner fa-spin" style={{marginRight: '0.5rem'}} />
                ) : (
                  <i className="fas fa-wand-magic-sparkles" style={{marginRight: '0.5rem'}} />
                )}
                {isGenerating ? t('generate.generating') : t('generate.start')}
              </button>

              <p style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center'}}>
                {front?.id && selectedSceneId ? (
                  <>
                    {t('generate.ready')}
                    {eta ? ` · ${t('generate.eta', {eta: formatEta(eta) ?? '-'})}` : null}
                  </>
                ) : (
                  t('generate.hint')
                )}
              </p>
            </div>

            <div className="studio-card" style={{flex: 1, minHeight: 300}}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--gold-primary)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-eye" />
                {t('preview.title')}
              </h2>

              <div
                style={{
                  border: '2px solid var(--border-gold)',
                  borderRadius: 12,
                  padding: '1rem',
                  background: 'rgba(42, 42, 42, 0.3)',
                  minHeight: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="preview-image"
                      style={{maxHeight: 260, cursor: 'zoom-in'}}
                      onClick={() => setZoomUrl(previewUrl)}
                    />

                    <div style={{display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center'}}>
                      <a
                        className="btn-outline-gold"
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={`lumina-${selectedScene?.id ?? 'image'}.png`}
                        style={{textDecoration: 'none'}}
                      >
                        <i className="fas fa-download" style={{marginRight: '0.5rem'}} />
                        {t('preview.download')}
                      </a>
                      <button className="btn-outline-gold" type="button" onClick={() => onShare(previewUrl)}>
                        <i className="fas fa-share-alt" style={{marginRight: '0.5rem'}} />
                        {t('preview.share')}
                      </button>
                    </div>

                    {images.length > 1 ? (
                      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {images.map((img, idx) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              border: idx === activeIndex ? '2px solid var(--gold-primary)' : '1px solid var(--border-gold)',
                              width: 72,
                              height: 56,
                              padding: 0,
                              background: 'transparent',
                              cursor: 'pointer'
                            }}
                            aria-label={t('preview.thumb', {index: idx + 1})}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {task ? (
                      <div style={{color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center'}}>
                        {t('preview.meta', {status: String(task.status), size: task.size, quality: task.quality})}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                    <i className="fas fa-image" style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.3}} />
                    <p style={{fontSize: '0.875rem'}}>
                      {isGenerating ? t('preview.waiting') : t('preview.empty')}
                    </p>
                    {task ? (
                      <p style={{fontSize: '0.75rem', marginTop: '0.5rem'}}>
                        {t('preview.statusLine', {status: String(task.status), progress: task.progress ?? 0})}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {zoomUrl ? (
        <div className="lightbox" role="dialog" aria-label="Image preview" onClick={() => setZoomUrl(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" type="button" onClick={() => setZoomUrl(null)} aria-label="Close">
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoomUrl} alt="Preview large" />
          </div>
        </div>
      ) : null}

      <style>{`
        .upload-slot {
          border: 2px dashed var(--border-gold);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(42, 42, 42, 0.3);
          position: relative;
          overflow: hidden;
        }
        .upload-slot:hover {
          border-color: var(--gold-primary);
          background: rgba(42, 42, 42, 0.5);
        }
        .upload-slot.dragover {
          border-color: var(--gold-light);
          background: rgba(212, 175, 55, 0.1);
          transform: scale(1.02);
        }
        .upload-slot.has-image {
          border-style: solid;
          padding: 0;
        }
        .upload-slot img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
        }
        .scene-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          outline: none;
        }
        .scene-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .scene-card.selected {
          border-color: var(--gold-primary);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        }
        .scene-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
        }
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .lightbox-inner {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .lightbox-inner img {
          max-width: 100%;
          max-height: 90vh;
          display: block;
          border-radius: 8px;
        }
        .lightbox-close {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          line-height: 32px;
        }
      `}</style>
    </main>
  );
}

function UploadSlot({
  required,
  kind,
  title,
  icon,
  uploaded,
  disabled,
  hintText,
  removeLabel,
  onPick,
  onRemove
}: {
  required?: boolean;
  kind: 'front' | 'side' | 'full';
  title: string;
  icon: string;
  uploaded: UploadedImage | null;
  disabled: boolean;
  hintText: string;
  removeLabel: string;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const inputId = `${kind}Input`;
  const [dragover, setDragover] = useState(false);

  return (
    <div style={{marginBottom: '1.5rem'}}>
      <label style={{display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem'}}>
        {title} {required ? <span style={{color: 'var(--error)'}}>*</span> : null}
      </label>

      <div
        className={`upload-slot ${uploaded ? 'has-image' : ''} ${dragover ? 'dragover' : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            (document.getElementById(inputId) as HTMLInputElement | null)?.click();
          }
        }}
        onClick={() => (document.getElementById(inputId) as HTMLInputElement | null)?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled) return;
          setDragover(true);
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragover(false);
          if (disabled) return;
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith('image/')) onPick(file);
        }}
        style={{opacity: disabled ? 0.75 : 1}}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
            e.currentTarget.value = '';
          }}
        />

        {uploaded ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={uploaded.localPreviewUrl} alt={uploaded.name} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--error)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={removeLabel}
            >
              <i className="fas fa-times" />
            </button>
          </>
        ) : (
          <>
            <i className={`fas ${icon}`} style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '0.5rem'}} />
            <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{hintText}</p>
          </>
        )}
      </div>
    </div>
  );
}
