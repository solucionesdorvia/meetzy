"use client";

/**
 * Two-step inline confirmation pattern.
 * First click enters "confirming" state, showing a red confirm button.
 * Auto-resets after 4 s if not confirmed.
 *
 * Usage:
 *   <ConfirmAction
 *     label="Eliminar sitio"
 *     confirmLabel="¿Eliminar?"
 *     onConfirm={handleDelete}
 *     loading={loading}
 *     className="..."
 *   />
 */

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  label: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  resetDelay?: number; // ms, default 4000
}

export function ConfirmAction({
  label,
  confirmLabel = "¿Confirmar?",
  onConfirm,
  loading = false,
  className,
  disabled = false,
  resetDelay = 4000,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  // Auto-reset when left hanging
  useEffect(() => {
    if (!confirming) return;
    const id = window.setTimeout(() => setConfirming(false), resetDelay);
    return () => window.clearTimeout(id);
  }, [confirming, resetDelay]);

  function handleClick() {
    if (loading || disabled) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    void onConfirm();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      aria-pressed={confirming}
      className={cn(
        "inline-flex items-center gap-1.5 transition-all duration-150 disabled:pointer-events-none disabled:opacity-40",
        confirming
          ? "rounded-[var(--radius-sm)] bg-[var(--error-subtle)] px-2.5 py-1 text-[var(--error)] ring-1 ring-[var(--error)]/25"
          : "",
        className,
      )}
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      {confirming ? confirmLabel : label}
    </button>
  );
}
