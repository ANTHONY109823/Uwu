import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { ApiResponse, Template } from '@/lib/types';
import { TemplateCard } from '@/components/TemplateCard';

async function getFeatured(): Promise<Template[]> {
  try {
    const res = await apiFetch<ApiResponse<Template[]>>('/api/templates?featured=true&limit=10');
    return res.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <section className="min-h-svh flex items-center pt-28 pb-16 px-5">
        <div className="max-w-[1120px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-[var(--rose-500)] mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Más de 25 plantillas románticas
            </div>
            <h1 className="font-[family-name:var(--font-sora)] font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-5">
              El regalo digital que{' '}
              <span className="font-[family-name:var(--font-dancing)] text-[var(--pink-500)] text-[1.1em]">
                nunca
              </span>{' '}
              va a olvidar
            </h1>
            <p className="text-[var(--muted)] text-lg leading-relaxed mb-8 max-w-lg">
              Crea una página web romántica con fotos, música y animaciones en menos de 5 minutos.
              Paga y comparte al instante por WhatsApp, QR o Instagram.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary">
                Ver catálogo 💝
              </Link>
              <Link href="/mis-dedicatorias" className="btn-ghost">
                Tengo un código 🔑
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-64 rounded-[38px] bg-[#1b1320] p-2.5 shadow-[0_30px_80px_rgba(122,50,90,0.4)]">
              <div
                className="rounded-[30px] h-[420px] flex flex-col items-center justify-center text-white text-center p-6"
                style={{ background: 'linear-gradient(135deg,#e542a1,#3890dd,#c654ce)' }}
              >
                <span className="text-6xl mb-4">🎀</span>
                <p className="font-[family-name:var(--font-dancing)] text-3xl mb-2">Mariana</p>
                <p className="text-sm opacity-90 italic">Eres el sueño que nunca quiero despertar 🌙</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-16 px-5">
          <div className="max-w-[1120px] mx-auto">
            <span className="kicker">Destacadas</span>
            <h2 className="font-[family-name:var(--font-sora)] font-extrabold text-3xl text-center mb-10">
              Plantillas más <span className="text-[var(--rose-500)]">populares</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((t) => (
                <TemplateCard key={t.slug} template={t} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/catalogo" className="btn-ghost">
                Ver las 25 plantillas →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-5">
        <div className="max-w-[1120px] mx-auto glass rounded-3xl p-10 text-center">
          <h2 className="font-[family-name:var(--font-sora)] font-extrabold text-2xl mb-8">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', emoji: '🎨', title: 'Elige plantilla', desc: '25+ diseños únicos' },
              { step: '2', emoji: '✏️', title: 'Personaliza', desc: 'Nombre, mensaje, canción' },
              { step: '3', emoji: '💳', title: 'Paga', desc: 'Desde S/ 0 (gratis)' },
              { step: '4', emoji: '📤', title: 'Comparte', desc: 'Enlace + código + HTML' },
            ].map((s) => (
              <div key={s.step}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-[var(--muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
