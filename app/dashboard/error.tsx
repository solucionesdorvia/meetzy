"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--error)]/20 bg-[var(--error-subtle)] p-8">
        <p className="mb-5 text-3xl" aria-hidden>⚠️</p>
        <h2 className="mb-2 font-syne text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
          No pudimos cargar el dashboard
        </h2>

        {isDev && error.message ? (
          <pre className="mb-5 overflow-auto rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-overlay)] p-3 text-left font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
            {error.message}
          </pre>
        ) : (
          <p className="mb-6 text-[13px] leading-relaxed text-[var(--text-secondary)]">
            Casi siempre es la base de datos en Railway: verificá que{" "}
            <code className="rounded bg-[var(--bg-overlay)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--accent)]">
              DATABASE_URL
            </code>{" "}
            esté configurada y que las migraciones estén al día.
          </p>
        )}

        {error.digest && (
          <p className="mb-5 font-mono text-[10px] text-[var(--text-tertiary)]">
            digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-[var(--radius-md)] bg-[var(--accent)] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-overlay)] py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
