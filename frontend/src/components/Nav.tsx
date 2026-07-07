import Link from 'next/link';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1120px] mx-auto mt-2.5 px-5">
        <div className="glass flex items-center gap-4 rounded-full px-4 py-2.5 shadow-[0_8px_30px_rgba(238,126,177,0.14)]">
          <Link
            href="/"
            className="font-[family-name:var(--font-dancing)] text-2xl font-bold text-[var(--pink-500)] no-underline"
          >
            🧸 UWU
          </Link>
          <div className="hidden md:flex gap-5 ml-auto text-[13.5px] font-semibold text-[#6b5560]">
            <Link href="/" className="hover:text-[var(--rose-500)] no-underline">
              Inicio
            </Link>
            <Link href="/catalogo" className="hover:text-[var(--rose-500)] no-underline">
              Catálogo
            </Link>
          </div>
          <Link href="/catalogo" className="btn-primary ml-auto md:ml-0 text-sm py-2 px-4">
            Crear dedicatoria 💝
          </Link>
        </div>
      </div>
    </nav>
  );
}
