const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateAccessCode(): string {
  let s = 'UWU-';
  for (let i = 0; i < 2; i++) {
    if (i) s += '-';
    for (let j = 0; j < 4; j++) {
      s += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }
  return s;
}

export function generateSlug(): string {
  const part = () =>
    Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
      .join('')
      .toLowerCase();
  return `${part()}-${part()}`;
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatPrice(
  pen: number,
  usd: number,
  tier: string,
  currency = 'PEN',
): string {
  if (tier === 'free' || pen === 0) return currency === 'PEN' ? 'Gratis' : 'Free';
  return currency === 'PEN' ? `S/ ${pen.toFixed(2)}` : `$${usd.toFixed(2)}`;
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function apiError(code: string, message: string) {
  return { success: false, error: { code, message } };
}
