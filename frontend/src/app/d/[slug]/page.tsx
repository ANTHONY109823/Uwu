import { apiFetch } from '@/lib/api';
import type { ApiResponse, DedicationResult } from '@/lib/types';
import { notFound } from 'next/navigation';

async function getDedication(slug: string): Promise<DedicationResult | null> {
  try {
    const res = await apiFetch<ApiResponse<DedicationResult>>(`/api/dedications/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDedication(slug);
  return {
    title: d ? `${d.template?.emoji} Para ${d.para} — UWU` : 'Dedicatoria — UWU',
  };
}

export default async function DedicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dedication = await getDedication(slug);
  if (!dedication) notFound();

  if (dedication.htmlContent) {
    return (
      <iframe
        srcDoc={dedication.htmlContent}
        className="fixed inset-0 w-full h-full border-0"
        title={`Dedicatoria para ${dedication.para}`}
      />
    );
  }

  const grad = dedication.template?.gradient ?? 'linear-gradient(135deg,#EE7EB1,#E8447A)';

  return (
    <div
      className="min-h-svh flex items-center justify-center p-5"
      style={{ background: grad }}
    >
      <div className="max-w-sm w-full rounded-[32px] bg-black/25 backdrop-blur-xl border border-white/20 p-9 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <p className="text-[10px] uppercase tracking-widest opacity-75 mb-2">Para la persona más especial</p>
        <h1 className="font-[family-name:var(--font-dancing)] text-4xl mb-4">{dedication.para}</h1>
        <p className="text-sm italic leading-relaxed opacity-90 mb-6">{dedication.mensaje}</p>
        {dedication.cancion && (
          <div className="bg-white/10 rounded-xl p-3 text-xs mb-4">🎵 {dedication.cancion}</div>
        )}
        <p className="font-[family-name:var(--font-dancing)] text-2xl">— {dedication.de} 💝</p>
        <p className="mt-6 text-[10px] opacity-55 font-mono">Hecho con UWU 🧸</p>
      </div>
    </div>
  );
}
