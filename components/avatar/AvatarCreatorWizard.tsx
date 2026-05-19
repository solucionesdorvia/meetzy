"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, RefreshCw, Check, Upload, X, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { useProductToast } from "@/components/providers/product-toast";
import { Button } from "@/components/ui/button";
import type { CharacterSuggestion } from "@/app/api/avatar/suggest/route";

interface WizardProps {
  site: {
    siteId: string;
    name: string;
    agentName: string;
    brandColor: string;
    brandColor2: string;
    logoUrl: string | null;
    avatarImageUrl: string | null;
    avatarGenerations: number;
  };
}

/* ── Suggestion tile ─────────────────────────────────────────────── */

function SuggestionTile({
  s,
  selected,
  onClick,
  index,
}: {
  s: CharacterSuggestion;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-[var(--radius-xl)] border p-4 text-center transition-all duration-200 ${
        selected
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-surface)] shadow-[0_0_24px_rgba(99,102,241,0.35)]"
          : "border-transparent hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:scale-[1.04] active:scale-[0.97]"
      }`}
      style={{
        background: `linear-gradient(145deg, ${s.gradientFrom}, ${s.gradientTo})`,
        animation: `wiz-tile-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.06}s both`,
      }}
    >
      {selected && (
        <span
          className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          style={{ animation: "check-pop 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <Check className="size-3 text-[var(--accent)]" strokeWidth={3} />
        </span>
      )}

      {/* Glow overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)` }}
      />

      <div
        className="flex size-16 items-center justify-center rounded-2xl text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-200 group-hover:scale-110"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        {s.emoji}
      </div>
      <div className="min-w-0 w-full">
        <p className="truncate text-[12px] font-bold leading-tight text-white drop-shadow-sm">
          {s.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/75">
          {s.description}
        </p>
      </div>
    </button>
  );
}

/* ── Color swatch ────────────────────────────────────────────────── */

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 transition-all duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)]">
      <div
        className="relative size-9 shrink-0 rounded-full border-2 border-[var(--border-default)] shadow-[0_2px_10px_rgba(0,0,0,0.35)] overflow-hidden"
        style={{ background: value, boxShadow: `0 0 0 3px ${value}30, 0 2px 10px rgba(0,0,0,0.35)` }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-[var(--text-secondary)]">{label}</p>
        <p className="font-mono text-[10px] text-[var(--text-tertiary)]">{value.toUpperCase()}</p>
      </div>
    </label>
  );
}

/* ── Step indicator ──────────────────────────────────────────────── */

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {([1, 2] as const).map((n) => (
        <div
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            n === step
              ? "w-8 bg-[var(--accent)] shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              : n < step
              ? "w-4 bg-[var(--accent)]/50"
              : "w-4 bg-[var(--border-default)]"
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] font-medium text-[var(--text-tertiary)]">
        {step === 1 ? "Elegí tu personaje" : "Personalizá y generá"}
      </span>
    </div>
  );
}

/* ── Generation counter banner ───────────────────────────────────── */

function GenBanner({ genLeft }: { genLeft: number }) {
  if (genLeft > 1) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-[rgba(99,102,241,0.25)] bg-[rgba(99,102,241,0.06)] px-4 py-2.5">
        <Zap className="size-3.5 text-[var(--accent)]" />
        <p className="text-[11px] font-medium text-[var(--accent)]">
          {genLeft} de 3 generaciones disponibles
        </p>
        <span className="ml-auto text-[10px] text-[var(--text-tertiary)]">Los previews no cuentan</span>
      </div>
    );
  }
  if (genLeft === 1) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-[rgba(234,179,8,0.3)] bg-[rgba(234,179,8,0.06)] px-4 py-2.5">
        <Zap className="size-3.5 text-yellow-500" />
        <p className="text-[11px] font-medium text-yellow-500">
          Última generación disponible — usala bien
        </p>
      </div>
    );
  }
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.06)] px-4 py-2.5">
      <X className="size-3.5 text-[#f87171]" />
      <p className="text-[11px] font-medium text-[#f87171]">
        Sin generaciones disponibles para este agente
      </p>
    </div>
  );
}

/* ── Main wizard ─────────────────────────────────────────────────── */

export default function AvatarCreatorWizard({ site }: WizardProps) {
  const router = useRouter();
  const { push } = useProductToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  /* ── Step 1 state ── */
  const [step, setStep] = useState<1 | 2>(1);
  const [businessName, setBusinessName] = useState(site.name);
  const [businessDesc, setBusinessDesc] = useState("");
  const [suggestions, setSuggestions] = useState<CharacterSuggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [selected, setSelected] = useState<CharacterSuggestion | null>(null);

  /* ── Step 2 state ── */
  const [brandColor, setBrandColor] = useState(site.brandColor || "#6366f1");
  const [brandColor2, setBrandColor2] = useState(site.brandColor2 || "#4338ca");
  const [logoUrl, setLogoUrl] = useState(site.logoUrl ?? "");
  const [logoUploading, setLogoUploading] = useState(false);
  const [clothingText, setClothingText] = useState(site.name.slice(0, 30));

  const [previewUrl, setPreviewUrl] = useState<string | null>(site.avatarImageUrl ?? null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);

  const genLeft = Math.max(0, 3 - site.avatarGenerations);

  /* ── Step 1 handlers ── */

  async function handleSuggest() {
    if (!businessName.trim()) {
      push("Ingresá el nombre de tu negocio", "error");
      return;
    }
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/avatar/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName.trim(), businessDescription: businessDesc.trim() || undefined }),
      });
      const j = (await res.json()) as { suggestions?: CharacterSuggestion[]; error?: string };
      if (j.suggestions?.length) {
        setSuggestions(j.suggestions);
        if (!selected && j.suggestions[0]) setSelected(j.suggestions[0]);
      } else {
        push(j.error ?? "No se pudieron generar sugerencias", "error");
      }
    } catch {
      push("Error de red al sugerir personajes", "error");
    } finally {
      setSuggesting(false);
    }
  }

  function handleNext() {
    if (!selected) {
      push("Elegí un personaje para continuar", "error");
      return;
    }
    setStep(2);
    // Auto-generate preview as soon as user enters step 2
    void handlePreview();
  }

  /* ── Step 2 handlers ── */

  async function handleLogoUpload(file: File) {
    if (file.size > 2_500_000) {
      push("Imagen muy grande (máx 2MB)", "error");
      return;
    }
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const mime = file.type as "image/png" | "image/jpeg" | "image/webp";
      try {
        const res = await fetch("/api/onboarding/upload-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType: mime }),
        });
        const j = (await res.json()) as { url?: string; error?: string };
        if (j.url) {
          setLogoUrl(j.url);
          push("Logo cargado ✓", "success");
        } else {
          push(j.error ?? "Error al subir el logo", "error");
        }
      } catch {
        push("Error de red al subir logo", "error");
      }
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function handlePreview() {
    if (!selected) return;
    setPreviewing(true);
    try {
      const res = await fetch("/api/avatar/wizard-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetype: selected.archetype,
          promptHint: selected.promptHint,
          businessName: businessName.trim(),
          agentName: site.agentName,
          brandColor,
          brandColor2,
          clothingText: clothingText.trim() || undefined,
          variation: previewCount,
        }),
      });
      const j = (await res.json()) as { previewUrl?: string; error?: string };
      if (!res.ok || !j.previewUrl) {
        push(j.error ?? "Preview no disponible", "error");
        return;
      }
      setPreviewUrl(j.previewUrl);
      setPreviewCount((c) => c + 1);
      push("Preview lista ✓", "success");
    } catch {
      push("Error de red al generar preview", "error");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSave() {
    if (!selected) return;
    if (genLeft <= 0) {
      push("Ya usaste las 3 generaciones disponibles para este agente.", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/avatar/wizard-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: site.siteId,
          archetype: selected.archetype,
          promptHint: selected.promptHint,
          businessName: businessName.trim(),
          agentName: site.agentName,
          brandColor,
          brandColor2,
          logoUrl: logoUrl.trim() || null,
          clothingText: clothingText.trim() || undefined,
        }),
      });
      const j = (await res.json()) as { avatarUrl?: string; error?: string; generationsRemaining?: number };
      if (!res.ok || !j.avatarUrl) {
        push(j.error ?? "No se pudo guardar el avatar", "error");
        return;
      }
      setPreviewUrl(j.avatarUrl);
      push(`¡Avatar guardado! (${j.generationsRemaining ?? 0} generaciones restantes)`, "success");
      router.refresh();
    } catch {
      push("Error de red al guardar", "error");
    } finally {
      setSaving(false);
    }
  }

  /* ── Render ── */

  return (
    <>
      <style>{`
        @keyframes wiz-tile-in {
          from { opacity: 0; transform: translateY(14px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wiz-step-in {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes check-pop {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes avatar-appear {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes generating-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.06); }
        }
      `}</style>

      <div className="max-w-5xl">
        <StepDots step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]" style={{ animation: "wiz-step-in 0.3s cubic-bezier(0.22,1,0.36,1)" }}>

            {/* Left: form + suggestions */}
            <div className="space-y-5">

              {/* Business context */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
                <h3 className="mb-4 font-syne text-[14px] font-bold text-[var(--text-primary)]">
                  ¿A qué se dedica tu negocio?
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-tertiary)]">
                      Nombre del negocio
                    </label>
                    <input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="VeteDorvia, Café El Rincón, TechSoluciones…"
                      className="dash-input w-full text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-tertiary)]">
                      ¿A qué se dedica? <span className="opacity-60">(opcional pero recomendado)</span>
                    </label>
                    <textarea
                      value={businessDesc}
                      onChange={(e) => setBusinessDesc(e.target.value)}
                      placeholder="Veterinaria, e-commerce de moda, estudio contable, SaaS de RRHH…"
                      rows={2}
                      className="dash-input w-full resize-none text-[13px]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => void handleSuggest()}
                    disabled={suggesting || !businessName.trim()}
                    className="w-full gap-2"
                  >
                    {suggesting ? (
                      <><Loader2 className="size-4 animate-spin" />Analizando negocio…</>
                    ) : (
                      <><Sparkles className="size-4" />{suggestions.length ? "Volver a sugerir" : "Sugerir personajes"}</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Suggestions grid */}
              {suggestions.length > 0 && (
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
                  <h3 className="mb-4 font-syne text-[13px] font-bold text-[var(--text-primary)]">
                    Personajes sugeridos para tu negocio
                  </h3>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                    {suggestions.map((s, i) => (
                      <SuggestionTile
                        key={s.id}
                        s={s}
                        selected={selected?.id === s.id}
                        onClick={() => setSelected(s)}
                        index={i}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!selected}
                      className="gap-1.5"
                    >
                      Continuar
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {suggestions.length === 0 && !suggesting && (
                <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-8 text-center">
                  <div className="mx-auto">
                    <p className="text-[13px] text-[var(--text-tertiary)]">
                      Ingresá el nombre y rubro de tu negocio para que la IA sugiera los mejores personajes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: explainer + selected preview */}
            <div className="space-y-4">
              <div
                className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-5"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(99,102,241,0.10) 0%, var(--bg-elevated) 60%)",
                }}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <Sparkles className="size-5 text-[var(--accent)]" />
                </div>
                <h3 className="font-syne text-[14px] font-bold text-[var(--text-primary)]">
                  Avatar con IA
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                  La IA analiza tu negocio y sugiere 6 personajes ideales. Cada uno tiene colores, estilo y expresión adaptados a tu rubro.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    { emoji: "🎨", text: "Personaje único para tu marca" },
                    { emoji: "🌈", text: "Colores de tu paleta incluidos" },
                    { emoji: "🏷️", text: "Tu nombre en la ropa del personaje" },
                    { emoji: "🖼️", text: "Logo integrado en el avatar" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[var(--radius-md)] border border-[rgba(99,102,241,0.25)] bg-[rgba(99,102,241,0.08)] px-3 py-2">
                  <p className="text-[11px] font-semibold text-[var(--accent)]">
                    {genLeft} de 3 generaciones disponibles
                  </p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">
                    Los previews rápidos no cuentan.
                  </p>
                </div>
              </div>

              {selected && (
                <div
                  className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
                  style={{ animation: "wiz-step-in 0.25s cubic-bezier(0.22,1,0.36,1)" }}
                >
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                    Seleccionado
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                      style={{ background: `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})` }}
                    >
                      {selected.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{selected.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--text-tertiary)]">{selected.description}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="mt-3 w-full gap-1.5"
                  >
                    Continuar con este personaje
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && selected && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]" style={{ animation: "wiz-step-in 0.3s cubic-bezier(0.22,1,0.36,1)" }}>

            {/* Left: customization */}
            <div className="space-y-4">

              {/* Gen counter banner */}
              <GenBanner genLeft={genLeft} />

              {/* Back + selected character header */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  Cambiar personaje
                </button>
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-7 items-center justify-center rounded-lg text-base shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                    style={{ background: `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})` }}
                  >
                    {selected.emoji}
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">{selected.title}</span>
                </div>
              </div>

              {/* Brand identity */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 space-y-4">
                <h3 className="font-syne text-[13px] font-bold text-[var(--text-primary)]">
                  Identidad de marca
                </h3>

                <div className="flex flex-wrap gap-3">
                  <ColorPicker label="Color principal" value={brandColor} onChange={setBrandColor} />
                  <ColorPicker label="Color secundario" value={brandColor2} onChange={setBrandColor2} />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-tertiary)]">
                    Texto en la ropa{" "}
                    <span className="opacity-60">(opcional — nombre en el uniforme)</span>
                  </label>
                  <input
                    value={clothingText}
                    onChange={(e) => setClothingText(e.target.value.slice(0, 30))}
                    placeholder="VeteDorvia, Dr. López, Tu Negocio…"
                    className="dash-input w-full text-[12px]"
                    maxLength={30}
                  />
                  <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">
                    La IA intentará incluirlo en la ropa del personaje.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-tertiary)]">
                    Logo de la marca{" "}
                    <span className="opacity-60">(opcional — se superpone en el avatar)</span>
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-xl border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-3 transition-all duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)] cursor-pointer"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="size-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] object-contain p-0.5"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-elevated)]">
                        <Upload className="size-4 text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleLogoUpload(f);
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-[var(--text-secondary)]">
                        {logoUploading ? "Subiendo…" : logoUrl ? "Cambiar logo" : "Subir logo"}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">PNG o SVG · fondo transparente</p>
                    </div>
                    {logoUploading && <Loader2 className="size-4 animate-spin text-[var(--accent)]" />}
                    {logoUrl && !logoUploading && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLogoUrl(""); }}
                        className="flex size-6 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-tertiary)] transition-colors hover:border-[rgba(248,113,113,0.5)] hover:text-[#f87171]"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-syne text-[13px] font-bold text-[var(--text-primary)]">
                    Generá tu avatar
                  </h3>
                  {genLeft > 0 && (
                    <span className="rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                      {genLeft}/3 generaciones
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">
                  Primero generá un <strong className="text-[var(--text-secondary)]">preview rápido</strong> (gratis, no se guarda). Cuando te guste el resultado, guardalo como avatar definitivo.
                </p>

                <button
                  type="button"
                  onClick={() => void handlePreview()}
                  disabled={previewing || saving}
                  className="group flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-overlay)] py-3 text-[12px] font-medium text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] disabled:opacity-50"
                >
                  {previewing ? (
                    <><Loader2 className="size-3.5 animate-spin" />Generando preview… 5–15s</>
                  ) : (
                    <><RefreshCw className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />{previewUrl ? "Regenerar preview (gratis)" : "Preview rápido (gratis)"}</>
                  )}
                </button>

                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || previewing || genLeft <= 0}
                  className="w-full gap-2 py-3 text-[13px] font-semibold shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all duration-150 hover:shadow-[0_0_32px_rgba(99,102,241,0.45)] disabled:shadow-none"
                  style={{ background: genLeft > 0 ? "linear-gradient(135deg, #7c3aed, #6366f1)" : undefined }}
                >
                  {saving ? (
                    <><Loader2 className="size-4 animate-spin" />Guardando avatar… 15–30s</>
                  ) : (
                    <><Sparkles className="size-4" />Guardar avatar HD ({genLeft}/3)</>
                  )}
                </Button>

                {genLeft === 0 && (
                  <p className="text-center text-[11px] text-[#f87171]">
                    Ya usaste las 3 generaciones de este agente. El preview sigue disponible.
                  </p>
                )}
              </div>
            </div>

            {/* Right: preview panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div
                className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)]"
                style={{
                  background: "linear-gradient(160deg, rgba(99,102,241,0.05) 0%, var(--bg-elevated) 60%)",
                  boxShadow: `0 0 0 1px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)`,
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 border-b border-[var(--border-subtle)]"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${brandColor} 12%, transparent), transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-6 items-center justify-center rounded-lg text-sm shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                      style={{ background: `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})` }}
                    >
                      {selected.emoji}
                    </div>
                    <p className="font-syne text-[12px] font-semibold text-[var(--text-primary)]">
                      {site.agentName}
                    </p>
                  </div>
                </div>

                {/* Preview image area */}
                <div
                  className="flex aspect-square items-center justify-center relative overflow-hidden"
                  style={{
                    background: `radial-gradient(ellipse at 50% 30%, color-mix(in srgb, ${brandColor} 8%, var(--bg-surface)), var(--bg-surface))`,
                  }}
                >
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Avatar preview"
                      className="size-full object-contain"
                      key={previewUrl}
                      style={{ animation: "avatar-appear 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div
                        className="flex size-20 items-center justify-center rounded-2xl text-4xl shadow-[0_0_40px_rgba(0,0,0,0.3)]"
                        style={{
                          background: `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})`,
                          animation: "generating-pulse 2.5s ease-in-out infinite",
                        }}
                      >
                        {selected.emoji}
                      </div>
                      <p className="text-[12px] font-semibold text-[var(--text-primary)]">{selected.title}</p>
                      <p className="text-[11px] leading-snug text-[var(--text-tertiary)]">
                        Generando tu avatar…
                      </p>
                    </div>
                  )}

                  {(previewing || saving) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-md"
                      style={{ background: "rgba(6,6,8,0.75)" }}
                    >
                      {/* Animated glow rings */}
                      <div className="relative flex items-center justify-center">
                        <div
                          className="absolute size-20 rounded-full opacity-20"
                          style={{
                            background: brandColor,
                            animation: "generating-pulse 1.5s ease-in-out infinite",
                          }}
                        />
                        <div
                          className="absolute size-14 rounded-full opacity-30"
                          style={{
                            background: brandColor,
                            animation: "generating-pulse 1.5s ease-in-out 0.3s infinite",
                          }}
                        />
                        <Loader2
                          className="size-8 animate-spin"
                          style={{ color: brandColor }}
                        />
                      </div>
                      <p className="text-[12px] font-semibold text-white">
                        {saving ? "Procesando en HD…" : "Generando preview…"}
                      </p>
                      <p className="text-[10px] text-white/50">
                        {saving ? "15–30 segundos" : "5–15 segundos"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Color preview strip */}
                <div className="flex h-1.5">
                  <div className="flex-1 transition-all duration-300" style={{ background: brandColor }} />
                  <div className="flex-1 transition-all duration-300" style={{ background: brandColor2 }} />
                </div>

                {/* Info footer */}
                <div className="px-4 py-3">
                  {logoUrl && (
                    <div className="mb-2 flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="" className="size-4 object-contain" />
                      <span className="text-[10px] text-[var(--text-tertiary)]">Logo incluido</span>
                    </div>
                  )}
                  <p className="text-[10px] leading-snug text-[var(--text-tertiary)]">
                    El preview es rápido y gratis. "Guardar" genera la versión final HD y la guarda en tu perfil.
                  </p>
                </div>
              </div>

              {/* Widget launcher preview */}
              <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <div className="border-b border-[var(--border-subtle)] px-3 py-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                    Así se ve en tu web
                  </p>
                </div>
                {/* Simulated webpage with launcher bubble */}
                <div className="relative h-28 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                  {/* Fake page content lines */}
                  <div className="absolute inset-x-4 top-3 space-y-1.5 opacity-15">
                    <div className="h-2 w-3/4 rounded-full bg-[var(--text-tertiary)]" />
                    <div className="h-2 w-1/2 rounded-full bg-[var(--text-tertiary)]" />
                    <div className="h-2 w-2/3 rounded-full bg-[var(--text-tertiary)]" />
                  </div>
                  {/* Launcher bubble — bottom-right */}
                  <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
                    {/* "En vivo" badge */}
                    <div
                      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white shadow-md"
                      style={{ background: brandColor }}
                    >
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En vivo
                    </div>
                    {/* Circular bubble with avatar */}
                    <div
                      className="flex size-[52px] items-center justify-center rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        background: previewUrl ? "transparent" : `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})`,
                        boxShadow: `0 0 0 3px ${brandColor}50, 0 6px 24px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt=""
                          className="size-full object-cover"
                          key={previewUrl}
                          style={{ animation: "avatar-appear 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
                        />
                      ) : (
                        <span className="text-2xl" style={{ animation: "generating-pulse 2.5s ease-in-out infinite" }}>{selected.emoji}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chat window preview below */}
                <div className="border-t border-[var(--border-subtle)]">
                  <div
                    className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2 transition-all duration-300"
                    style={{ background: `color-mix(in srgb, ${brandColor} 8%, transparent)` }}
                  >
                    <div
                      className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs"
                      style={{ background: `${brandColor}25` }}
                    >
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="" className="size-full object-cover rounded-full" />
                      ) : (
                        selected.emoji
                      )}
                    </div>
                    <div>
                      <p className="font-syne text-[10px] font-bold text-[var(--text-primary)]">{site.agentName}</p>
                      <div className="flex items-center gap-1">
                        <span className="size-1 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-[var(--text-tertiary)]">En línea</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 p-2.5">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1">
                      <p className="text-[9px] text-[var(--text-primary)]">¡Hola! ¿En qué te puedo ayudar?</p>
                    </div>
                    <div
                      className="ml-auto max-w-[70%] rounded-2xl rounded-tr-sm px-2 py-1 transition-all duration-300"
                      style={{ background: brandColor }}
                    >
                      <p className="text-[9px] text-white">¿Cuáles son sus servicios?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
