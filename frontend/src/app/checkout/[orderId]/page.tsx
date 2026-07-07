'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, apiPost } from '@/lib/api';
import type { ApiResponse } from '@/lib/types';

interface StatusData {
  orderId: string;
  status: string;
  isFree: boolean;
  dedication?: { slug: string; accessCode: string; viewUrl: string };
}

interface PaymentData {
  dedication?: { slug: string; accessCode: string; viewUrl: string };
  approved?: boolean;
}

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ slug: string; accessCode: string; viewUrl: string } | null>(null);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    async function process() {
      try {
        const statusRes = await fetch(`${API_URL}/api/payments/status/${orderId}`);
        const statusJson: ApiResponse<StatusData> = await statusRes.json();
        const status = statusJson.data;

        if (status.dedication) {
          setResult(status.dedication);
          setLoading(false);
          return;
        }

        setIsFree(status.isFree);

        if (status.isFree) {
          const freeRes = await apiPost<ApiResponse<{ dedication: { slug: string; accessCode: string; viewUrl: string } }>>(
            '/api/payments/free',
            { orderId },
          );
          setResult(freeRes.data.dedication);
        } else {
          const payRes = await apiPost<ApiResponse<PaymentData>>('/api/payments/create', { orderId });
          if (payRes.data.dedication) {
            setResult(payRes.data.dedication);
          } else {
            setError('No se pudo completar el pago.');
          }
        }
      } catch (e) {
        setError('Error al procesar. Verifica que el backend y la base de datos estén activos.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    process();
  }, [orderId]);

  function copyCode() {
    if (result) navigator.clipboard.writeText(result.accessCode);
  }

  function shareWhatsApp() {
    if (!result) return;
    const url = `${window.location.origin}/d/${result.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`Te hice algo especial 💝 ${url}`)}`, '_blank');
  }

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <div className="text-4xl mb-4 animate-bounce">🧸</div>
        <p className="text-[var(--muted)]">Generando tu dedicatoria…</p>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="pt-32 text-center px-5">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/catalogo" className="btn-ghost">Volver al catálogo</Link>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="pt-28 pb-16 px-5">
      <div className="max-w-md mx-auto glass rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-[family-name:var(--font-sora)] font-extrabold text-2xl mb-2">
          ¡Listo! Tu dedicatoria está viva
        </h1>
        {isFree && <p className="text-sm text-green-600 mb-4">Plantilla gratis — sin pago</p>}

        <div className="bg-pink-50 rounded-2xl p-4 my-6 font-mono text-lg tracking-wider text-[var(--rose-500)]">
          {result.accessCode}
        </div>
        <p className="text-xs text-[var(--muted)] mb-6">Guarda este código para editar o recuperar tu dedicatoria.</p>

        <div className="flex flex-col gap-3">
          <Link href={`/d/${result.slug}`} className="btn-primary justify-center">
            👁 Ver en línea
          </Link>
          <button className="btn-ghost justify-center" onClick={copyCode}>
            📋 Copiar código
          </button>
          <button className="btn-ghost justify-center" onClick={shareWhatsApp}>
            📱 Compartir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
