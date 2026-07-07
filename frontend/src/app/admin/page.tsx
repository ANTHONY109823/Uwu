'use client';

import { useState } from 'react';
import { API_URL, apiPost } from '@/lib/api';
import type { ApiResponse } from '@/lib/types';

export default function AdminPage() {
  const [email, setEmail] = useState('admin@uwu.app');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await apiPost<ApiResponse<{ accessToken: string }>>('/api/admin/login', { email, password });
      localStorage.setItem('uwu_admin_token', res.data.accessToken);
      setLoggedIn(true);
      await loadDashboard();
    } catch {
      setError('Credenciales incorrectas');
    }
  }

  async function loadDashboard() {
    const res = await fetch(`${API_URL}/api/admin/dashboard`);
    const json = await res.json();
    setDashboard(json.data);
  }

  if (!loggedIn) {
    return (
      <div className="pt-28 pb-16 px-5">
        <div className="max-w-sm mx-auto glass rounded-3xl p-8">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-xl text-center mb-6">
            Admin UWU
          </h1>
          <form onSubmit={login} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-pink-200/50 bg-white/80 text-sm"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-5">
      <div className="max-w-[1120px] mx-auto">
        <h1 className="font-[family-name:var(--font-sora)] font-extrabold text-2xl mb-8">Dashboard</h1>
        {dashboard && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Ventas hoy', value: (dashboard.salesToday as { count: number })?.count ?? 0 },
              { label: 'Ventas semana', value: (dashboard.salesWeek as { count: number })?.count ?? 0 },
              { label: 'Visitas hoy', value: dashboard.visitsToday ?? 0 },
              { label: 'Dedicatorias', value: dashboard.totalDedications ?? 0 },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <p className="text-2xl font-[family-name:var(--font-sora)] font-bold text-[var(--rose-500)]">{String(s.value)}</p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-[var(--muted)]">Panel completo en desarrollo. Ver blueprint Tomo VII.</p>
      </div>
    </div>
  );
}
