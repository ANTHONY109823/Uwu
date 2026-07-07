'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import type { ApiResponse, DedicationResult } from '@/lib/types';

export default function MisDedicatoriasPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/dedications/by-code/${encodeURIComponent(code.trim())}`);
      if (!res.ok) throw new Error('not found');
      const json: ApiResponse<DedicationResult> = await res.json();
      router.push(`/d/${json.data.slug}`);
    } catch {
      setError('Código no válido. Verifica e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-28 pb-16 px-5">
      <div className="max-w-md mx-auto glass rounded-3xl p-8 text-center">
        <div className="text-4xl mb-4">🔑</div>
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-xl mb-2">Recuperar dedicatoria</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Ingresa tu código de acceso UWU-XXXX-XXXX</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-center font-mono tracking-wider"
            placeholder="UWU-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Buscando…' : 'Ver mi dedicatoria'}
          </button>
        </form>
      </div>
    </div>
  );
}
