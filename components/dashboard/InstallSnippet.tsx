"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Clipboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductToast } from "@/components/providers/product-toast";

const TABS = ["HTML", "Framer", "Webflow", "WordPress", "Shopify", "Wix"] as const;
type Tab = (typeof TABS)[number];

const INSTRUCTIONS: Record<Tab, string> = {
  HTML: "Pegá este código antes del </body> en tu HTML:",
  Framer: "Site Settings → General → Custom Code → End of <body> tag:",
  Webflow: "Webflow → Project Settings → Custom Code → Footer Code:",
  WordPress: "Plugin tipo «Insert Headers and Footers» → pegá en el footer:",
  Shopify: "Online Store → Themes → Edit code → theme.liquid, antes de </body>:",
  Wix: "Settings → Custom Code → Head o Body, al final del Body:",
};

const STEPS: Partial<Record<Tab, string[]>> = {
  Framer: [
    "Abrí tu proyecto en Framer.",
    "Hacé clic en el ícono de engranaje (abajo a la izquierda) para abrir Site Settings.",
    "Andá a la pestaña General → sección Custom Code.",
    'Pegá el snippet en el campo "End of <body> tag".',
    "Publicá el sitio — el widget solo aparece en la versión publicada, no en el canvas de Framer.",
  ],
  Webflow: [
    "Abrí tu proyecto en Webflow.",
    "Andá a Project Settings → Custom Code → Footer Code.",
    "Pegá el snippet y guardá.",
    "Publicá el sitio para que el widget aparezca.",
  ],
  WordPress: [
    'Instalá el plugin "Insert Headers and Footers" (o similar).',
    "Pegá el snippet en la sección Footer.",
    "Guardá los cambios.",
  ],
  Shopify: [
    "Andá a Online Store → Themes → Edit code.",
    "Abrí el archivo theme.liquid.",
    "Pegá el snippet antes del cierre </body>.",
    "Guardá y publicá.",
  ],
  Wix: [
    "Andá a Settings → Custom Code.",
    'Hacé clic en "+ Add Custom Code".',
    'Pegá el snippet, elegí "Body - end" y aplicá a todas las páginas.',
    "Publicá el sitio.",
  ],
};

interface InstallSnippetProps {
  siteId: string;
  appUrl: string;
  /** Poll install-status API (widget visible on customer site). */
  verify?: boolean;
  /** Override polling URL (default: `/api/sites/{siteId}/install-status`). */
  installCheckUrl?: string;
}

export default function InstallSnippet({ siteId, appUrl, verify = false, installCheckUrl }: InstallSnippetProps) {
  const { push } = useProductToast();
  const [tab, setTab] = useState<Tab>("HTML");
  const [copied, setCopied] = useState(false);
  const [detected, setDetected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const script = `<!-- Meetzy — pegá antes de </body> -->
<script>
  window.MEETZYCONFIG = { siteId: "${siteId}" };
</script>
<script src="${appUrl}/widget.js" async></script>`;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      push("Código copiado al portapapeles ✓", "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      push("No se pudo copiar. Intentá de nuevo.", "error");
    }
  }, [script, push]);

  useEffect(() => {
    if (!verify) return;
    let cancelled = false;
    const tick = async () => {
      setChecking(true);
      try {
        const r = await fetch(installCheckUrl ?? `/api/sites/${siteId}/install-status`);
        if (r.ok) {
          const j = (await r.json()) as { detected?: boolean };
          if (!cancelled) setDetected(Boolean(j.detected));
        }
      } catch {
        if (!cancelled) setDetected(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    void tick();
    const id = window.setInterval(tick, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [verify, siteId, installCheckUrl]);

  return (
    <div className="space-y-6">
      {verify ? (
        <div
          className={`flex items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-sm ${
            detected === true
              ? "border-[rgba(34,197,94,0.35)] bg-[var(--success-subtle)] text-[var(--success)]"
              : "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
          }`}
        >
          {checking ? <Loader2 className="size-4 animate-spin shrink-0" /> : detected === true ? <Check className="size-4 shrink-0" /> : null}
          <span>
            {detected === true
              ? "Widget detectado en tu web. Tu agente puede estar activo."
              : "Esperando instalación… pegá el script y publicá. Verificamos cada 5s."}
          </span>
        </div>
      ) : null}

      <div role="tablist" aria-label="Plataforma" className="flex flex-wrap gap-1 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-[var(--radius-md)] px-3 py-2 text-xs font-semibold transition-all duration-150 ${
              tab === t
                ? "bg-[var(--accent-subtle)] text-[var(--accent)] ring-1 ring-[var(--accent-border)]"
                : "text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-sm text-[var(--text-secondary)]">{INSTRUCTIONS[tab]}</p>

      <div className="relative rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-overlay)]">
        <pre className="max-h-[280px] overflow-auto p-4 font-[family-name:var(--font-jetbrains,ui-monospace)] text-[12px] leading-relaxed text-[var(--text-primary)] [scrollbar-color:rgba(99,102,241,0.35)_transparent]">
          <code>{script}</code>
        </pre>
        <Button type="button" variant="secondary" size="sm" className="absolute right-3 top-3 gap-1.5" onClick={() => void copy()}>
          <Clipboard className="size-3.5" />
          {copied ? "Copiado ✓" : "Copiar"}
        </Button>
      </div>

      {tab !== "HTML" ? (
        <div className="space-y-3">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
            {(STEPS[tab] ?? [
              "Abrí la configuración de tu plataforma.",
              "Buscá la sección de código personalizado (footer / before body).",
              "Pegá el snippet y guardá / publicá.",
            ]).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {tab === "Framer" && (
            <p className="rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-3.5 py-2.5 text-[12px] text-[var(--accent)]">
              💡 Framer es SPA — el widget detecta cambios de página automáticamente. No necesitás configuración extra en sitios multi-página.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
