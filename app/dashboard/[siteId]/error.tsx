"use client";

import Link from "next/link";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="w-full max-w-sm rounded-[var(--radius-xl)] border border-[var(--error)]/20 bg-[var(--error-subtle)] p-8"
      >
        <p className="mb-5 text-3xl" aria-hidden>⚠️</p>
        <h2 className="mb-2 font-syne text-[18px] font-bold tracking-tight text-[var(--text-primary)]">
          Error al cargar esta página
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {error.message?.length < 200 && process.env.NODE_ENV === "development"
            ? error.message
            : "Algo salió mal. Podés reintentar o volver al dashboard."}
        </p>
        {error.digest && (
          <p className="mb-5 font-mono text-[10px] text-[var(--text-tertiary)]">
            ref: {error.digest}
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
            href="/dashboard"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-overlay)] py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
