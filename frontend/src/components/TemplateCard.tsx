import Link from 'next/link';
import type { Template } from '@/lib/types';

const LEVEL_BADGE: Record<string, { label: string; className: string }> = {
  free: { label: 'Gratis', className: 'bg-green-100 text-green-700 border-green-200' },
  premium: { label: 'Premium', className: 'bg-pink-100 text-rose-600 border-pink-200' },
  exclusive: { label: 'Exclusiva', className: 'bg-purple-100 text-purple-700 border-purple-200' },
};

export function TemplateCard({ template }: { template: Template }) {
  const badge = LEVEL_BADGE[template.level] ?? LEVEL_BADGE.premium;

  return (
    <Link
      href={`/editor/${template.slug}`}
      className="group block rounded-3xl overflow-hidden bg-white/70 border border-pink-200/40 shadow-[0_8px_30px_rgba(238,126,177,0.12)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(238,126,177,0.2)] transition-all no-underline text-inherit"
    >
      <div
        className="h-40 flex flex-col items-center justify-center text-white relative"
        style={{ background: template.previewGradient ?? 'var(--grad-hero)' }}
      >
        <span className="text-5xl mb-2">{template.emoji}</span>
        <span className="text-xs opacity-90 px-3 text-center">{template.pill}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono bg-pink-50 text-[var(--muted)] px-2 py-0.5 rounded-full">
            {template.code}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.className}`}>
            {badge.label}
          </span>
        </div>
        <h3 className="font-[family-name:var(--font-sora)] font-bold text-base mb-1">{template.name}</h3>
        <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-[family-name:var(--font-sora)] font-bold text-[var(--rose-500)]">
            {template.price.formatted}
          </span>
          <span className="text-xs text-[var(--muted)]">{template.categoryName ?? template.category}</span>
        </div>
      </div>
    </Link>
  );
}
