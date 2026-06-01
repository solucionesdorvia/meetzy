import Link from "next/link";

export const metadata = {
  title: "404 — Esta página se perdió | Meetzy",
};

export default function NotFound() {
  return (
    <main
      className="meetzy-product-ui min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: "var(--bg-base, #0a0a10)" }}
    >
      <div className="max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="font-syne text-2xl font-extrabold tracking-[-0.04em] text-[var(--text-primary)] inline-block mb-8"
        >
          MEET<span className="text-[var(--accent)]">ZY</span>
        </Link>

        {/* 404 number — big and stylish */}
        <p
          className="font-syne text-[120px] font-extrabold leading-none tracking-[-0.06em] mb-2"
          style={{
            background:
              "linear-gradient(135deg, var(--accent, #7c6cff) 0%, #c4b5fd 70%, var(--text-primary, #f0ede8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <h1 className="font-syne text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
          Milo no encontró esta página
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] mb-8">
          Puede que el link esté roto, o que la página se haya movido. Volvé al inicio o explorá otras secciones.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-[var(--accent-hover)] shadow-[0_0_16px_rgba(99,102,241,0.25)]"
          >
            Ir al inicio
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-2.5 text-[14px] font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </main>
  );
}
