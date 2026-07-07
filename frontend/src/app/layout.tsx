import type { Metadata } from 'next';
import { Inter, Sora, Dancing_Script } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-sora' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-dancing' });

export const metadata: Metadata = {
  title: 'UWU 🧸 — El regalo digital que nunca va a olvidar',
  description:
    'Crea una página web romántica con fotos, música y animaciones en menos de 5 minutos. Paga y comparte al instante.',
  openGraph: {
    title: 'UWU 🧸 Detalles Románticos',
    description: 'El regalo digital que nunca va a olvidar.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable} ${dancing.variable}`}>
      <body className="min-h-svh flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
