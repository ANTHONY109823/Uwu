'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL, apiPost, apiPut } from '@/lib/api';
import type { ApiResponse, DraftResult, Template } from '@/lib/types';

export default function EditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [para, setPara] = useState('');
  const [de, setDe] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cancion, setCancion] = useState('Ed Sheeran — Perfect');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/templates/${slug}`);
        const json: ApiResponse<Template> = await res.json();
        setTemplate(json.data);
        setMensaje(slug === 'hello-kitty' ? 'Eres el sueño que nunca quiero despertar 🌙' : '');

        const draft = await apiPost<ApiResponse<DraftResult>>('/api/dedications/draft', {
          templateSlug: slug,
          currency: 'PEN',
        });
        setOrderId(draft.data.orderId);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (!orderId) return;
    const t = setTimeout(async () => {
      try {
        await apiPut(`/api/dedications/${orderId}`, { para, de, mensaje, cancion });
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [orderId, para, de, mensaje, cancion]);

  async function handleContinue() {
    if (!orderId || !template) return;
    setSaving(true);
    try {
      await apiPut(`/api/dedications/${orderId}`, { para, de, mensaje, cancion });
      router.push(`/checkout/${orderId}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-32 text-center text-[var(--muted)]">Cargando editor…</div>
    );
  }

  if (!template) {
    return (
      <div className="pt-32 text-center">
        <p>Plantilla no encontrada.</p>
      </div>
    );
  }

  const previewUrl = orderId ? `${API_URL}/api/dedications/preview/${orderId}` : '';

  return (
    <div className="pt-24 pb-16 px-5">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">{template.emoji}</span>
          <div>
            <h1 className="font-[family-name:var(--font-sora)] font-bold text-xl">{template.name}</h1>
            <p className="text-xs text-[var(--muted)]">{template.code} · {template.price.formatted}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass rounded-3xl p-6 space-y-4">
            <label className="block text-sm font-semibold">
              Para quién
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm"
                placeholder="Ej: Mariana"
                value={para}
                onChange={(e) => setPara(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Tu nombre (firma)
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm"
                placeholder="Ej: Diego"
                value={de}
                onChange={(e) => setDe(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Tu mensaje
              <textarea
                className="mt-1 w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm min-h-[120px]"
                placeholder="Escribe tu carta…"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Canción
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm"
                value={cancion}
                onChange={(e) => setCancion(e.target.value)}
              />
            </label>
            <button className="btn-primary w-full justify-center" onClick={handleContinue} disabled={saving}>
              {saving ? 'Guardando…' : template.level === 'free' ? '✨ Obtener gratis' : '💳 Continuar al pago'}
            </button>
          </div>

          <div className="glass rounded-3xl p-4 overflow-hidden min-h-[500px]">
            <p className="text-xs text-[var(--muted)] text-center mb-2">Vista previa en tiempo real</p>
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[480px] rounded-2xl border-0 bg-transparent"
                title="Vista previa"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
