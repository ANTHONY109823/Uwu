import { apiFetch } from '@/lib/api';
import type { ApiResponse, Category, Template } from '@/lib/types';
import { TemplateCard } from '@/components/TemplateCard';
import Link from 'next/link';

async function getCatalog() {
  try {
    const [categories, templates] = await Promise.all([
      apiFetch<ApiResponse<Category[]>>('/api/categories'),
      apiFetch<ApiResponse<Template[]>>('/api/templates?limit=50'),
    ]);
    return { categories: categories.data, templates: templates.data };
  } catch {
    return { categories: [], templates: [] };
  }
}

export const metadata = { title: 'Catálogo — UWU 🧸' };

export default async function CatalogoPage() {
  const { categories, templates } = await getCatalog();

  return (
    <div className="pt-28 pb-16 px-5">
      <div className="max-w-[1120px] mx-auto">
        <span className="kicker">Catálogo</span>
        <h1 className="font-[family-name:var(--font-sora)] font-extrabold text-3xl md:text-4xl text-center mb-4">
          Elige tu <span className="text-[var(--rose-500)]">plantilla</span>
        </h1>
        <p className="text-center text-[var(--muted)] mb-10 max-w-lg mx-auto">
          25 plantillas para cada ocasión. Gratis, Premium y Exclusivas.
        </p>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link
              href="/catalogo"
              className="glass px-4 py-2 rounded-full text-sm font-semibold no-underline text-inherit hover:bg-[var(--grad-hero)] hover:text-white transition-all"
            >
              Todas
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/catalogo/${c.slug}`}
                className="glass px-4 py-2 rounded-full text-sm font-semibold no-underline text-inherit hover:bg-[var(--grad-hero)] hover:text-white transition-all"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        )}

        {templates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-[var(--muted)] mb-4">
              El catálogo se carga desde la API. Asegúrate de que el backend esté corriendo.
            </p>
            <code className="text-xs bg-pink-50 px-3 py-1 rounded">npm run dev</code>
          </div>
        )}
      </div>
    </div>
  );
}
