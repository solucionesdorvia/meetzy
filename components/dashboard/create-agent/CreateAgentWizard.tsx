"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  HelpCircle,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import Color from "color";
import AvatarSvgPreview from "@/components/onboarding/AvatarSvgPreview";
import ConfettiCanvas from "@/components/onboarding/ConfettiCanvas";
import { SelectableTile } from "@/components/onboarding/SelectableTile";
import InstallSnippet from "@/components/dashboard/InstallSnippet";
import { resolveArchetype } from "@/components/onboarding/resolve-archetype";
import type { PrimaryChar } from "@/components/onboarding/resolve-archetype";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AvatarArchetype } from "@/lib/avatar-prompt-builder";
import { STYLE_MODIFIER_LABELS } from "@/lib/avatar-prompt-builder";
import { useProductToast } from "@/components/providers/product-toast";

type CharacterSuggestion = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  archetype: string;
  promptHint: string;
  gradientFrom: string;
  gradientTo: string;
};

const LS_KEY = "meetzy-create-agent-wizard-v1";

const SWATCHES = ["#6366f1", "#ec4899", "#f97316", "#22c55e", "#0ea5e9", "#eab308", "#a855f7", "#14b8a6"];

const AGENT_CARDS = [
  { id: "vendedor" as const, emoji: "🛍️", title: "Vendedor", desc: "Detecta interés y empuja a la acción", accent: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.4)", dot: "#f97316" },
  { id: "guia" as const, emoji: "🗺️", title: "Guía", desc: "Acompaña al visitante mientras navega", accent: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)", dot: "#3b82f6" },
  { id: "soporte" as const, emoji: "🛠️", title: "Soporte", desc: "Resuelve dudas y problemas técnicos", accent: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.4)", dot: "#14b8a6" },
  { id: "recepcionista" as const, emoji: "📅", title: "Recepcionista", desc: "Agenda turnos y deriva consultas", accent: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.4)", dot: "#a855f7" },
];

const FUN_MESSAGES = [
  "Diseñando tu personaje…",
  "Aplicando tu color de marca…",
  "Casi listo…",
  "Ajustando detalles finales…",
];

type MacroStep = 1 | 2 | 3 | 4;
type Personality = "amigable" | "profesional" | "divertida" | "seria";

function needsSecondary(primary: PrimaryChar | null): boolean {
  if (!primary) return false;
  return primary === "human" || primary === "fruta" || primary === "objeto" || primary === "animal";
}

function canProceedSecondary(primary: PrimaryChar | null, subtype: string): boolean {
  if (!primary) return false;
  if (primary === "human") return subtype === "male" || subtype === "female";
  if (primary === "fruta") return ["naranja", "manzana"].includes(subtype);
  if (primary === "objeto") return ["taza", "estrella", "cohete", "diamante"].includes(subtype);
  if (primary === "animal") return ["perro", "gato", "conejo", "zorro", "panda", "oso"].includes(subtype);
  return false;
}

function personalityLabel(p: Personality): string {
  switch (p) {
    case "amigable":
      return "amigable y cercano";
    case "profesional":
      return "profesional y claro";
    case "divertida":
      return "divertida y energética";
    case "seria":
      return "seria y precisa";
    default:
      return "amigable y profesional";
  }
}

type Persisted = {
  macroStep: MacroStep;
  url: string;
  businessName: string;
  agentName: string;
  detectedLanguage: string;
  systemPrompt: string;
  agentType: (typeof AGENT_CARDS)[number]["id"] | null;
  personality: Personality;
  welcomeMessage: string;
  primary: PrimaryChar | null;
  subtype: string;
  brandColor: string;
  brandColor2: string;
  logoUrl: string | null;
  avatarUrl: string | null;
  genFallback: boolean;
  createdSiteId: string | null;
  analyzeSkipped: boolean;
  aiSuggestions: CharacterSuggestion[];
  selectedSuggestion: CharacterSuggestion | null;
  clothingText: string;
  styleModifier: string;
};

export type CreateAgentWizardProps = {
  variant: "modal" | "page";
  userPlan: string;
  isGuest: boolean;
  onRequestClose?: () => void;
};

export default function CreateAgentWizard({ variant, userPlan, isGuest, onRequestClose }: CreateAgentWizardProps) {
  const { push } = useProductToast();
  const [macroStep, setMacroStep] = useState<MacroStep>(1);

  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("es");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [sitePreview, setSitePreview] = useState("");
  const [analyzeBusy, setAnalyzeBusy] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [analyzeSkipped, setAnalyzeSkipped] = useState(false);

  const [agentType, setAgentType] = useState<(typeof AGENT_CARDS)[number]["id"] | null>(null);
  const [personality, setPersonality] = useState<Personality>("amigable");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const [primary, setPrimary] = useState<PrimaryChar | null>(null);
  const [subtype, setSubtype] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [brandColor2, setBrandColor2] = useState("#8b5cf6");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [avatarMicro, setAvatarMicro] = useState<"pick" | "generating" | "done">("pick");

  const [genBusy, setGenBusy] = useState(false);
  const [genMessage, setGenMessage] = useState(FUN_MESSAGES[0] ?? "");
  const genTimer = useRef<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [genFallback, setGenFallback] = useState(false);
  const [localRegen, setLocalRegen] = useState(0);

  const [aiSuggestions, setAiSuggestions] = useState<CharacterSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CharacterSuggestion | null>(null);
  const [suggestBusy, setSuggestBusy] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [clothingText, setClothingText] = useState("");
  const [styleModifier, setStyleModifier] = useState("amigable");
  const [createdSiteId, setCreatedSiteId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [finalizingAvatar, setFinalizingAvatar] = useState(false);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [rightTransition, setRightTransition] = useState<"in" | "out">("in");

  const isPro = userPlan === "pro" || userPlan === "elite";

  const archetype = useMemo(() => {
    if (selectedSuggestion) return selectedSuggestion.archetype as AvatarArchetype;
    return resolveArchetype(primary, subtype);
  }, [selectedSuggestion, primary, subtype]);
  const agentTypeLabel = useMemo(() => AGENT_CARDS.find((x) => x.id === agentType)?.title ?? "Agente", [agentType]);

  const suggestions = useMemo(() => {
    const base = businessName.trim() || "Marca";
    return [`Lunita`, `${base.split(/\s+/)[0]?.slice(0, 8) || "Max"}`, `Coco`, `Sofia`];
  }, [businessName]);

  const persist = useCallback(() => {
    const payload: Persisted = {
      macroStep,
      url,
      businessName,
      agentName,
      detectedLanguage,
      systemPrompt,
      agentType,
      personality,
      welcomeMessage,
      primary,
      subtype,
      brandColor,
      brandColor2,
      logoUrl,
      avatarUrl,
      genFallback,
      createdSiteId,
      analyzeSkipped,
      aiSuggestions,
      selectedSuggestion,
      clothingText,
      styleModifier,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [
    macroStep,
    url,
    businessName,
    agentName,
    detectedLanguage,
    systemPrompt,
    agentType,
    personality,
    welcomeMessage,
    primary,
    subtype,
    brandColor,
    brandColor2,
    logoUrl,
    avatarUrl,
    genFallback,
    createdSiteId,
    analyzeSkipped,
    aiSuggestions,
    selectedSuggestion,
    clothingText,
    styleModifier,
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Partial<Persisted>;
      if (p.macroStep === 1 || p.macroStep === 2 || p.macroStep === 3 || p.macroStep === 4) setMacroStep(p.macroStep);
      if (typeof p.url === "string") setUrl(p.url);
      if (typeof p.businessName === "string") setBusinessName(p.businessName);
      if (typeof p.agentName === "string") setAgentName(p.agentName);
      if (typeof p.detectedLanguage === "string") setDetectedLanguage(p.detectedLanguage);
      if (typeof p.systemPrompt === "string") setSystemPrompt(p.systemPrompt);
      if (p.agentType) setAgentType(p.agentType);
      if (p.personality) setPersonality(p.personality);
      if (typeof p.welcomeMessage === "string") setWelcomeMessage(p.welcomeMessage);
      if (p.primary) setPrimary(p.primary);
      if (typeof p.subtype === "string") setSubtype(p.subtype);
      if (typeof p.brandColor === "string") setBrandColor(p.brandColor);
      if (typeof p.brandColor2 === "string") setBrandColor2(p.brandColor2);
      if (typeof p.logoUrl === "string" || p.logoUrl === null) setLogoUrl(p.logoUrl);
      if (typeof p.avatarUrl === "string") setAvatarUrl(p.avatarUrl);
      if (typeof p.genFallback === "boolean") setGenFallback(p.genFallback);
      if (typeof p.createdSiteId === "string") setCreatedSiteId(p.createdSiteId);
      if (typeof p.analyzeSkipped === "boolean") setAnalyzeSkipped(p.analyzeSkipped);
      if (Array.isArray(p.aiSuggestions)) setAiSuggestions(p.aiSuggestions);
      if (p.selectedSuggestion) setSelectedSuggestion(p.selectedSuggestion);
      if (typeof p.clothingText === "string") setClothingText(p.clothingText);
      if (typeof p.styleModifier === "string") setStyleModifier(p.styleModifier);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    persist();
  }, [persist]);

  useEffect(() => {
    return () => {
      if (genTimer.current) window.clearInterval(genTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isPro && macroStep === 3 && aiSuggestions.length === 0 && !suggestBusy && !suggestError) {
      void fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [macroStep, isPro]);

  function advanceCharPrimary(p: PrimaryChar) {
    setPrimary(p);
    setSubtype("");
    if (p === "human" || p === "fruta" || p === "objeto" || p === "animal") {
      /* wait for secondary */
    } else {
      setSubtype(p === "perro" ? "perro" : "gato");
    }
  }

  const previewStage = useMemo(() => {
    if (avatarUrl && !genFallback) return "image" as const;
    if (selectedSuggestion) return "ai-suggestion" as const;
    if (primary && archetype) return "svg" as const;
    return "placeholder" as const;
  }, [avatarUrl, genFallback, selectedSuggestion, primary, archetype]);

  async function runAnalyze() {
    let normalized = url.trim();
    if (!normalized) return;
    if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
    try {
      new URL(normalized);
    } catch {
      push("URL inválida", "error");
      return;
    }
    setAnalyzeBusy(true);
    setAnalyzeError(null);
    try {
      const r = await fetch("/api/onboarding/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      const j = (await r.json()) as {
        systemPrompt?: string;
        detectedLanguage?: string;
        siteName?: string;
        preview?: string;
        error?: string;
      };
      if (!r.ok) {
        setAnalyzeError(j.error ?? "No pudimos leer el sitio.");
        return;
      }
      if (j.systemPrompt) setSystemPrompt(j.systemPrompt);
      if (j.detectedLanguage) setDetectedLanguage(j.detectedLanguage);
      if (j.siteName && !businessName.trim()) setBusinessName(j.siteName);
      if (j.preview) setSitePreview(j.preview);
      setAnalyzeSkipped(false);
      push("Sitio analizado ✓", "success");
    } catch {
      setAnalyzeError("Error de red al analizar.");
    } finally {
      setAnalyzeBusy(false);
    }
  }

  async function fetchSuggestions() {
    setSuggestBusy(true);
    setSuggestError(null);
    try {
      const r = await fetch("/api/avatar/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName || "mi negocio" }),
      });
      const j = (await r.json()) as { suggestions?: CharacterSuggestion[]; error?: string };
      if (j.suggestions?.length) setAiSuggestions(j.suggestions);
      else setSuggestError(j.error ?? "No pudimos generar sugerencias.");
    } catch {
      setSuggestError("Error de red al sugerir personajes.");
    } finally {
      setSuggestBusy(false);
    }
  }

  async function runStarterPreview(variation: number, options?: { soft?: boolean }) {
    if (!archetype) { push("Elegí un personaje.", "warning"); return; }
    setGenBusy(true);
    if (!options?.soft) { setGenFallback(false); setAvatarUrl(null); }
    try {
      const r = await fetch("/api/avatar/wizard-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetype,
          businessName: businessName || "tu marca",
          agentName: agentName || "Asistente",
          brandColor,
          brandColor2,
          styleModifier: styleModifier || undefined,
          variation,
        }),
      });
      const j = (await r.json()) as { previewUrl?: string; error?: string };
      if (j.previewUrl) { setAvatarUrl(j.previewUrl); setGenFallback(false); }
      else { setGenFallback(true); setAvatarUrl(null); push(j.error ?? "Usamos el preview local ✓", "info"); }
    } catch {
      setGenFallback(true);
      push("Generación en pausa — usando preview local.", "warning");
    } finally {
      setGenBusy(false);
    }
  }

  async function runWizardPreview(variation: number, options?: { soft?: boolean }) {
    if (!selectedSuggestion) {
      push("Elegí un personaje antes de generar.", "warning");
      return;
    }
    setGenBusy(true);
    if (!options?.soft) {
      setGenFallback(false);
      setAvatarUrl(null);
    }
    try {
      const r = await fetch("/api/avatar/wizard-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetype: selectedSuggestion.archetype,
          promptHint: selectedSuggestion.promptHint,
          businessName: businessName || "tu marca",
          agentName: agentName || "Asistente",
          brandColor,
          brandColor2,
          clothingText: clothingText || undefined,
          styleModifier: styleModifier || undefined,
          variation,
        }),
      });
      const j = (await r.json()) as { previewUrl?: string; error?: string };
      if (j.previewUrl) {
        setAvatarUrl(j.previewUrl);
        setGenFallback(false);
      } else {
        setGenFallback(true);
        setAvatarUrl(null);
        push(j.error ?? "Usamos el preview vectorial ✓", "info");
      }
    } catch {
      setGenFallback(true);
      push("Generación en pausa — usando preview local.", "warning");
    } finally {
      setGenBusy(false);
    }
  }

  function startGenerationPhase() {
    if (!isPro && !archetype) { push("Elegí un personaje.", "warning"); return; }
    if (isPro && !selectedSuggestion) { push("Elegí un personaje antes de generar.", "warning"); return; }
    if (isGuest) {
      persist();
      window.location.href = `/sign-up?redirect_url=${encodeURIComponent("/dashboard/new")}`;
      return;
    }
    setAvatarMicro("generating");
    let i = 0;
    genTimer.current = window.setInterval(() => {
      i = (i + 1) % FUN_MESSAGES.length;
      setGenMessage(FUN_MESSAGES[i] ?? "");
    }, 2800);
    void (async () => {
      try {
        if (isPro) await runWizardPreview(localRegen);
        else await runStarterPreview(localRegen);
      } finally {
        if (genTimer.current) { window.clearInterval(genTimer.current); genTimer.current = null; }
        setAvatarMicro("done");
      }
    })();
  }

  async function finalizeSite() {
    if (!archetype || !agentType) return;
    setCreatingAgent(true);
    let normalized = url.trim();
    if (!normalized.startsWith("http")) normalized = `https://${normalized}`;

    // Pass the raw preview URL temporarily — we'll upgrade it with the full pipeline below
    const rawPreviewUrl = avatarUrl && !genFallback ? avatarUrl : null;

    const r = await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: businessName.trim(),
        url: normalized,
        agentName: agentName.trim(),
        brandColor,
        brandColor2,
        logoUrl,
        avatarImageUrl: null, // data URI handled separately by wizard-finalize
        archetype: archetype as AvatarArchetype,
        agentType,
        systemPrompt: systemPrompt.trim() || "Sos un asistente amable de la marca.",
        detectedLanguage,
        embedMode: "widget",
        welcomeMessage: welcomeMessage.trim() || `¡Hola! Soy ${agentName.trim() || "tu asistente"}. ¿En qué te puedo ayudar?`,
        agentPersonality: personalityLabel(personality),
      }),
    });
    const j = (await r.json()) as { siteId?: string; error?: string };
    if (!r.ok) {
      push(j.error ?? "Error al crear el sitio", "error");
      setCreatingAgent(false);
      return;
    }

    const siteId = j.siteId ?? null;
    setCreatedSiteId(siteId);

    // Run full pipeline: bg removal + Cloudinary (same logic as wizard-save)
    if (rawPreviewUrl && siteId && selectedSuggestion) {
      setFinalizingAvatar(true);
      try {
        const fr = await fetch("/api/avatar/wizard-finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siteId,
            falUrl: rawPreviewUrl,
            agentName: agentName.trim() || "Asistente",
            archetype: selectedSuggestion.archetype,
            logoUrl: logoUrl || undefined,
          }),
        });
        const fj = (await fr.json()) as { avatarUrl?: string; error?: string };
        if (fj.avatarUrl) setAvatarUrl(fj.avatarUrl);
      } catch {
        /* non-blocking — preview URL still works as fallback */
      } finally {
        setFinalizingAvatar(false);
      }
    }

    setCreatingAgent(false);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 2200);
    setMacroStep(4);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
  }

  const dirty = macroStep > 1 || url.trim().length > 0 || businessName.trim().length > 0 || agentName.trim().length > 0;

  function requestClose() {
    if (!onRequestClose) return;
    if (dirty && macroStep < 4) {
      if (!window.confirm("¿Cerrar? Perdés el progreso no guardado en esta sesión (se guarda en este dispositivo).")) return;
    }
    onRequestClose();
  }

  function goNext() {
    setRightTransition("out");
    window.setTimeout(() => {
      setMacroStep((s) => (s < 4 ? ((s + 1) as MacroStep) : s));
      setRightTransition("in");
    }, 250);
  }

  function goBack() {
    setRightTransition("out");
    window.setTimeout(() => {
      setMacroStep((s) => (s > 1 ? ((s - 1) as MacroStep) : s));
      setRightTransition("in");
    }, 250);
  }

  function resetWizard() {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    setMacroStep(1);
    setUrl(""); setBusinessName(""); setAgentName(""); setDetectedLanguage("es");
    setSystemPrompt(""); setSitePreview(""); setAnalyzeBusy(false); setAnalyzeError(null); setAnalyzeSkipped(false);
    setAgentType(null); setPersonality("amigable"); setWelcomeMessage("");
    setPrimary(null); setSubtype(""); setBrandColor("#6366f1"); setBrandColor2("#8b5cf6");
    setLogoUrl(null); setAvatarMicro("pick"); setAvatarUrl(null); setGenFallback(false);
    setLocalRegen(0); setCreatedSiteId(null); setCelebrate(false); setCreatingAgent(false);
    setAiSuggestions([]); setSelectedSuggestion(null); setSuggestBusy(false); setSuggestError(null); setClothingText(""); setStyleModifier("amigable");
    setRightTransition("in");
  }

  const canProceedForward = useMemo(() => {
    if (macroStep === 1) {
      if (!url.trim() || !businessName.trim() || !agentName.trim()) return false;
      if (analyzeError && !analyzeSkipped) return false;
      if (!systemPrompt.trim() && !analyzeSkipped) return false;
      return true;
    }
    if (macroStep === 2) return Boolean(agentType);
    if (macroStep === 3) {
      if (!isPro) {
        // Starter: only needs archetype selected — no generation required
        return Boolean(archetype);
      }
      // Pro/Elite: need AI suggestion + generation done
      if (!selectedSuggestion) return false;
      if (avatarMicro !== "done") return false;
      return true;
    }
    return false;
  }, [
    macroStep,
    url,
    businessName,
    agentName,
    analyzeError,
    analyzeSkipped,
    systemPrompt,
    agentType,
    welcomeMessage,
    isPro,
    archetype,
    selectedSuggestion,
    avatarMicro,
  ]);

  const canPickGenerate = useMemo(() => {
    // Only applies to Pro — Starter goes directly to finalizeSite
    if (!isPro) return false;
    if (!selectedSuggestion) return false;
    return avatarMicro === "pick";
  }, [isPro, selectedSuggestion, avatarMicro]);

  function onPrimaryAction() {
    if (macroStep === 1) { goNext(); return; }
    if (macroStep === 2) { goNext(); return; }
    if (macroStep === 3) {
      if (!isPro) {
        // Starter: go directly to finalizeSite without fal-ai
        void finalizeSite();
        return;
      }
      // Pro/Elite: fal-ai generation flow
      if (avatarMicro === "pick") { startGenerationPhase(); return; }
      if (avatarMicro === "done") { void finalizeSite(); }
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.meetzy.ai";
  const stepMeta = [
    { n: 1, title: "Tu negocio", desc: "URL y nombre" },
    { n: 2, title: "Tu agente", desc: "Tipo y personalidad" },
    { n: 3, title: "Tu avatar", desc: "Identidad visual" },
    { n: 4, title: "Instalación", desc: "Código listo" },
  ] as const;

  const stepStatus = (n: number) => {
    if (n < macroStep) return "done" as const;
    if (n === macroStep) return "active" as const;
    return "pending" as const;
  };

  const rightPanelClass =
    rightTransition === "in"
      ? "opacity-100 translate-x-0 transition-all duration-[250ms] ease-out"
      : "opacity-0 translate-x-3 transition-all duration-[200ms] ease-in";

  const isModal = variant === "modal";
  const stepAsideClass = isModal
    ? "border-[var(--border-subtle)] bg-[var(--bg-base)]"
    : "border-[var(--border-subtle)] bg-[var(--bg-base)]";
  const stepHeaderPad = isModal ? "px-5 py-7" : "p-7";
  const stepNavPad = isModal ? "gap-2 px-5 pb-5" : "gap-3 px-6 pb-6";
  const stepHelpClass = isModal
    ? "mt-auto border-t border-[var(--border-subtle)] px-5 py-5"
    : "mt-auto border-t border-[var(--border-subtle)] p-6";
  const footerBorder = isModal ? "border-[var(--border-subtle)]" : "border-[var(--border-subtle)]";
  const footerBg = isModal ? "bg-[var(--bg-surface)]" : "bg-[var(--bg-surface)]";

  const shell = (
    <>
      <ConfettiCanvas active={celebrate} />
      <div
        className={
          isModal
            ? "relative flex h-full max-h-[min(620px,90vh)] min-h-0 w-full flex-col overflow-hidden bg-transparent"
            : "relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[var(--bg-base)]"
        }
      >
        {variant === "page" ? (
          <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              ← Volver
            </Link>
            <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
              Plan {userPlan}
            </span>
          </header>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col md:grid md:h-full md:min-h-0 md:grid-cols-[240px_minmax(0,1fr)]">
          <aside
            className={`hidden h-full min-h-0 shrink-0 flex-col border-b md:flex md:border-b-0 md:border-r ${stepAsideClass}`}
          >
            <div className={stepHeaderPad}>
              <h2 className="font-syne text-base font-bold tracking-[-0.02em] text-[var(--text-primary)]">Nuevo agente</h2>
              <p className="mt-1 text-xs font-light leading-relaxed text-[var(--text-tertiary)]">Configurá tu agente en minutos</p>
            </div>
            <nav className={`flex flex-1 flex-col ${stepNavPad}`} aria-label="Pasos">
              {stepMeta.map((s, idx) => {
                const st = stepStatus(s.n);
                return (
                  <div key={s.n} className="relative flex gap-3">
                    {idx < stepMeta.length - 1 ? (
                      <div
                        className="absolute left-[13px] top-8 h-[calc(100%+6px)] w-0.5 rounded-full bg-[var(--border-subtle)]"
                        aria-hidden
                      >
                        <div
                          className="absolute top-0 left-0 w-full rounded-full bg-[var(--accent)] transition-all duration-300"
                          style={{ height: st === "done" ? "100%" : "0%" }}
                        />
                      </div>
                    ) : null}
                    <div
                      className={`relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        st === "active"
                          ? "bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]"
                          : st === "done"
                            ? "border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.15)] text-[var(--success)]"
                            : "border border-[var(--border-default)] text-[var(--text-tertiary)]"
                      }`}
                    >
                      {st === "done" ? <Check className="size-3.5" strokeWidth={3} /> : s.n}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          st === "active" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className={stepHelpClass}>
              <button type="button" className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] transition-colors duration-150 hover:text-[var(--accent)]">
                <HelpCircle className="size-3.5" />
                ¿Necesitás ayuda?
              </button>
            </div>
          </aside>

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--bg-surface)]">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--bg-surface)] md:flex-row">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--bg-surface)] px-6 py-6 md:px-8 md:py-7">
                <div className={rightPanelClass}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                    Paso {macroStep} de 4
                  </p>
                  {macroStep === 1 ? (
                    <StepBusiness
                      url={url}
                      setUrl={setUrl}
                      businessName={businessName}
                      setBusinessName={setBusinessName}
                      agentName={agentName}
                      setAgentName={setAgentName}
                      detectedLanguage={detectedLanguage}
                      setDetectedLanguage={setDetectedLanguage}
                      analyzeBusy={analyzeBusy}
                      analyzeError={analyzeError}
                      setAnalyzeError={setAnalyzeError}
                      analyzeSkipped={analyzeSkipped}
                      setAnalyzeSkipped={setAnalyzeSkipped}
                      sitePreview={sitePreview}
                      systemPrompt={systemPrompt}
                      setSystemPrompt={setSystemPrompt}
                      suggestions={suggestions}
                      onAnalyze={() => void runAnalyze()}
                    />
                  ) : null}
                  {macroStep === 2 ? (
                    <StepAgent
                      agentType={agentType}
                      setAgentType={setAgentType}
                      personality={personality}
                      setPersonality={setPersonality}
                      welcomeMessage={welcomeMessage}
                      setWelcomeMessage={setWelcomeMessage}
                      agentName={agentName}
                    />
                  ) : null}
                  {macroStep === 3 ? (
                    <StepAvatarPick
                      isPro={isPro}
                      businessName={businessName}
                      agentName={agentName}
                      primary={primary}
                      setPrimary={(p) => { setPrimary(p); setSubtype(p === "human" ? "" : p); setAvatarMicro("pick"); setAvatarUrl(null); }}
                      subtype={subtype}
                      setSubtype={(v) => { setSubtype(v); setAvatarMicro("pick"); setAvatarUrl(null); }}
                      styleModifier={styleModifier}
                      setStyleModifier={(v) => { setStyleModifier(v); setAvatarMicro("pick"); setAvatarUrl(null); }}
                      aiSuggestions={aiSuggestions}
                      suggestBusy={suggestBusy}
                      suggestError={suggestError}
                      selectedSuggestion={selectedSuggestion}
                      setSelectedSuggestion={(s) => {
                        setSelectedSuggestion(s);
                        setAvatarMicro("pick");
                        setAvatarUrl(null);
                        setGenFallback(false);
                      }}
                      onRefetchSuggestions={() => void fetchSuggestions()}
                      brandColor={brandColor}
                      setBrandColor={setBrandColor}
                      brandColor2={brandColor2}
                      setBrandColor2={setBrandColor2}
                      logoUrl={logoUrl}
                      setLogoUrl={setLogoUrl}
                      clothingText={clothingText}
                      setClothingText={setClothingText}
                      avatarMicro={avatarMicro}
                      genBusy={genBusy}
                      genMessage={genMessage}
                    />
                  ) : null}
                  {macroStep === 4 && createdSiteId ? (
                    <StepInstall
                      agentName={agentName}
                      avatarUrl={avatarUrl}
                      genFallback={genFallback}
                      brandColor={brandColor}
                      url={url}
                      createdSiteId={createdSiteId}
                      appUrl={appUrl}
                    />
                  ) : null}
                </div>
              </div>

              {macroStep === 3 ? (
                <div className="hidden w-[220px] flex-none border-l border-[var(--border-subtle)] bg-[var(--bg-base)] p-5 md:block">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Preview</p>
                  <div className="mt-4 space-y-3">
                    {/* Avatar preview area */}
                    <div className="overflow-hidden rounded-xl border border-[var(--border-default)]">
                      {previewStage === "image" && avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={avatarUrl} alt="" className="aspect-square w-full object-cover" />
                      ) : previewStage === "ai-suggestion" && selectedSuggestion ? (
                        <div
                          className="flex aspect-square w-full flex-col items-center justify-center gap-2"
                          style={{ background: `linear-gradient(135deg, ${selectedSuggestion.gradientFrom}, ${selectedSuggestion.gradientTo})` }}
                        >
                          <span className="text-5xl leading-none">{selectedSuggestion.emoji}</span>
                          <span className="text-[11px] font-semibold text-white/90">{selectedSuggestion.title}</span>
                        </div>
                      ) : (
                        <AvatarSvgPreview
                          stage={previewStage === "ai-suggestion" ? "placeholder" : previewStage}
                          archetype={archetype}
                          brandColor={brandColor}
                          businessName={businessName}
                          agentName={agentName || "Tu agente"}
                          agentTypeLabel={agentTypeLabel}
                          logoUrl={logoUrl}
                          imageUrl={avatarUrl}
                        />
                      )}
                    </div>

                    {/* Launcher bubble mockup — Pro: shows AI image; Starter: shows SVG initials */}
                    <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
                      <div className="absolute inset-x-3 top-2.5 space-y-1 opacity-20">
                        <div className="h-1.5 w-3/4 rounded-full bg-[var(--text-tertiary)]" />
                        <div className="h-1.5 w-1/2 rounded-full bg-[var(--text-tertiary)]" />
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ background: brandColor }}>
                          <span className="size-1 rounded-full bg-emerald-400" />En vivo
                        </div>
                        <div
                          className="flex size-10 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white shadow-md"
                          style={{
                            background: (avatarUrl && !genFallback) ? "transparent" : (selectedSuggestion ? `linear-gradient(135deg, ${selectedSuggestion.gradientFrom}, ${selectedSuggestion.gradientTo})` : brandColor),
                            boxShadow: `0 0 0 2px ${brandColor}60`,
                          }}
                        >
                          {(avatarUrl && !genFallback) ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={avatarUrl} alt="" className="size-full object-cover" />
                          ) : selectedSuggestion ? (
                            <span className="text-base leading-none">{selectedSuggestion.emoji}</span>
                          ) : (
                            (agentName || "A").slice(0, 2).toUpperCase()
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pro: regenerar + me encanta */}
                    {isPro && avatarMicro === "done" ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-full gap-1"
                          disabled={localRegen >= 3 || genBusy}
                          onClick={() => {
                            const next = localRegen + 1;
                            setLocalRegen(next);
                            setAvatarMicro("generating");
                            void runWizardPreview(next, { soft: true }).then(() => setAvatarMicro("done"));
                          }}
                        >
                          <RefreshCw className="size-3.5" />
                          Regenerar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="w-full gap-1 bg-[var(--success)] hover:bg-[var(--success)]/90"
                          disabled={finalizingAvatar}
                          onClick={() => void finalizeSite()}
                        >
                          {finalizingAvatar ? (
                            <><Loader2 className="size-3.5 animate-spin" /> Procesando…</>
                          ) : "Me encanta ✓"}
                        </Button>
                      </div>
                    ) : null}

                    {isPro && avatarMicro === "generating" ? (
                      <div className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5">
                        <Loader2 className="size-4 shrink-0 animate-spin text-[var(--accent)]" />
                        <p className="text-[11px] text-[var(--text-secondary)]">{genMessage}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <footer
              className={`flex shrink-0 items-center justify-between gap-3 border-t ${footerBorder} ${footerBg} px-4 py-3 md:px-8 md:py-4`}
            >
              <div>
                {macroStep === 4 ? (
                  <Button type="button" variant="ghost" className="dash-focus-ring gap-1.5 text-[var(--text-secondary)]" onClick={resetWizard}>
                    <RefreshCw className="size-3.5" />
                    Crear otro agente
                  </Button>
                ) : macroStep > 1 ? (
                  <Button type="button" variant="ghost" className="dash-focus-ring text-[var(--text-secondary)]" onClick={goBack}>
                    <ChevronLeft className="mr-1 size-4" />
                    Atrás
                  </Button>
                ) : (
                  <span />
                )}
              </div>
              {macroStep < 4 ? (
                <div className="flex flex-col items-end gap-1">
                  {macroStep === 1 && url.trim() && businessName.trim() && agentName.trim() && !systemPrompt.trim() && !analyzeSkipped && !analyzeError ? (
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      Analizá el sitio o{" "}
                      <button
                        type="button"
                        className="underline text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                        onClick={() => {
                          setAnalyzeSkipped(true);
                          setSystemPrompt("Sos un asistente amable que representa el negocio del sitio web del cliente. Respondé con claridad y en el idioma del visitante.");
                        }}
                      >
                        saltear
                      </button>
                    </p>
                  ) : null}
                <Button
                  type="button"
                  disabled={
                    (macroStep === 1 && !canProceedForward) ||
                    (macroStep === 2 && !canProceedForward) ||
                    (macroStep === 3 && !isPro && (!canProceedForward || creatingAgent)) ||
                    (macroStep === 3 && isPro && avatarMicro === "generating") ||
                    (macroStep === 3 && isPro && avatarMicro === "pick" && !canPickGenerate) ||
                    (macroStep === 3 && isPro && avatarMicro === "done") ||
                    (macroStep === 3 && isPro && finalizingAvatar)
                  }
                  className="dash-focus-ring gap-2 rounded-[10px] bg-[var(--accent)] px-5 hover:bg-[var(--accent-hover)]"
                  onClick={() => onPrimaryAction()}
                >
                  {macroStep === 3 && !isPro && creatingAgent ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creando tu agente…
                    </>
                  ) : macroStep === 3 && !isPro ? (
                    <>
                      Crear mi agente
                      <ArrowRight className="size-4" />
                    </>
                  ) : macroStep === 3 && isPro && avatarMicro === "pick" ? (
                    <>
                      <Sparkles className="size-4" />
                      Generar mi avatar
                    </>
                  ) : macroStep === 3 && isPro && avatarMicro === "generating" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generando…
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                </div>
              ) : null}
            </footer>
          </div>
        </div>
      </div>
    </>
  );

  if (variant === "page") {
    return <>{shell}</>;
  }

  return (
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(6, 6, 8, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
      >
        <div
          className="dash-modal-panel pointer-events-auto absolute left-1/2 top-1/2 z-[1] flex h-[min(640px,92vh)] w-[min(880px,97vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-[2] rounded-lg p-2 text-[var(--text-tertiary)] transition-colors duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] md:right-4 md:top-4"
            onClick={requestClose}
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{shell}</div>
        </div>
      </div>
    </div>
  );
}

function StepBusiness({
  url,
  setUrl,
  businessName,
  setBusinessName,
  agentName,
  setAgentName,
  detectedLanguage,
  setDetectedLanguage,
  analyzeBusy,
  analyzeError,
  setAnalyzeError,
  analyzeSkipped,
  setAnalyzeSkipped,
  sitePreview,
  systemPrompt,
  setSystemPrompt,
  suggestions,
  onAnalyze,
}: {
  url: string;
  setUrl: (v: string) => void;
  businessName: string;
  setBusinessName: (v: string) => void;
  agentName: string;
  setAgentName: (v: string) => void;
  detectedLanguage: string;
  setDetectedLanguage: (v: string) => void;
  analyzeBusy: boolean;
  analyzeError: string | null;
  setAnalyzeError: (v: string | null) => void;
  analyzeSkipped: boolean;
  setAnalyzeSkipped: (v: boolean) => void;
  sitePreview: string;
  systemPrompt: string;
  setSystemPrompt: (v: string) => void;
  suggestions: string[];
  onAnalyze: () => void;
}) {
  const analyzedOk = systemPrompt.trim().length > 0 && !analyzeError;
  return (
    <div className="mt-5 space-y-5">
      <div>
        <h3 className="font-syne text-[21px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">¿Dónde vive tu negocio?</h3>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Analizá tu web para que el agente conozca tu oferta desde el día uno.</p>
      </div>

      {/* URL row */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Sitio web</label>
        <div
          className={`mt-1.5 flex gap-1.5 rounded-[10px] border bg-[var(--bg-elevated)] p-1 transition-[border-color,box-shadow] duration-200 ${
            analyzeBusy ? "border-[var(--accent)] shadow-[0_0_0_1px_rgba(99,102,241,0.25)]" : "border-[var(--border-default)] focus-within:border-[var(--border-focus)]"
          }`}
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <LinkIcon className="size-3.5 shrink-0 text-[var(--text-tertiary)]" />
            <Input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setAnalyzeError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && !analyzeBusy && url.trim() && onAnalyze()}
              placeholder="https://tusitio.com"
              className="h-10 border-0 bg-transparent text-[var(--text-primary)] focus-visible:ring-0"
            />
          </div>
          <Button
            type="button"
            className="h-10 shrink-0 rounded-lg bg-[var(--accent)] px-4 text-sm hover:bg-[var(--accent-hover)]"
            disabled={analyzeBusy || !url.trim()}
            onClick={onAnalyze}
          >
            {analyzeBusy ? <Loader2 className="size-4 animate-spin" /> : "Analizar →"}
          </Button>
        </div>
      </div>

      {/* Feedback: analyzed ok */}
      {analyzedOk ? (
        <div className="flex items-start gap-3 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.06)] px-4 py-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.2)] text-[var(--success)]">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--success)]">Sitio analizado correctamente</p>
            {sitePreview ? (
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">{sitePreview.slice(0, 180)}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Feedback: error */}
      {analyzeError ? (
        <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.06)] px-4 py-3">
          <p className="text-[13px] text-[var(--error)]">{analyzeError}</p>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-[var(--accent)] underline transition-colors hover:text-[var(--accent-hover)]"
            onClick={() => {
              setAnalyzeSkipped(true);
              setAnalyzeError(null);
              if (!systemPrompt.trim()) {
                setSystemPrompt(
                  "Sos un asistente amable que representa el negocio del sitio web del cliente. Respondé con claridad y en el idioma del visitante.",
                );
              }
            }}
          >
            Continuar igualmente
          </button>
        </div>
      ) : null}

      {/* 2-col: Negocio + Agente */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Nombre del negocio</label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-1.5 h-10 border-[var(--border-default)] bg-[var(--bg-elevated)]"
            placeholder="Ej. Café del Sol"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Nombre del agente</label>
          <Input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="mt-1.5 h-10 border-[var(--border-default)] bg-[var(--bg-elevated)]"
            placeholder="Luna, Max, Coco…"
          />
        </div>
      </div>

      {/* Name suggestions */}
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[var(--text-tertiary)]">Sugerencias:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
              onClick={() => setAgentName(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {/* Language */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Idioma del agente</label>
        <select
          value={detectedLanguage}
          onChange={(e) => setDetectedLanguage(e.target.value)}
          className="dash-focus-ring mt-1.5 h-10 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] transition-colors duration-150"
        >
          <option value="es">🇦🇷 Español</option>
          <option value="en">🇺🇸 English</option>
          <option value="pt">🇧🇷 Português</option>
        </select>
      </div>
    </div>
  );
}

function StepAgent({
  agentType,
  setAgentType,
  personality,
  setPersonality,
  welcomeMessage,
  setWelcomeMessage,
  agentName,
}: {
  agentType: (typeof AGENT_CARDS)[number]["id"] | null;
  setAgentType: (v: (typeof AGENT_CARDS)[number]["id"] | null) => void;
  personality: Personality;
  setPersonality: (v: Personality) => void;
  welcomeMessage: string;
  setWelcomeMessage: (v: string) => void;
  agentName: string;
}) {
  const pills: { id: Personality; label: string; icon: string }[] = [
    { id: "amigable", label: "Amigable", icon: "😊" },
    { id: "profesional", label: "Profesional", icon: "💼" },
    { id: "divertida", label: "Divertida", icon: "🎉" },
    { id: "seria", label: "Seria", icon: "🎯" },
  ];
  return (
    <div className="mt-5 space-y-6">
      <div>
        <h3 className="font-syne text-[21px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">¿Cómo se comporta?</h3>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Elegí el rol que mejor encaja con lo que querés lograr.</p>
      </div>

      {/* Agent type cards */}
      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Rol del agente</p>
        <div className="grid grid-cols-2 gap-3">
          {AGENT_CARDS.map((c) => {
            const selected = agentType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setAgentType(c.id)}
                className={`relative flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 dash-focus-ring ${
                  selected
                    ? "shadow-[0_0_0_1px_currentColor]"
                    : "border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]"
                }`}
                style={selected ? { borderColor: c.border, backgroundColor: c.accent, color: c.dot } : {}}
              >
                {selected ? (
                  <span
                    className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: c.dot }}
                  >
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                ) : null}
                <span className="text-[24px] leading-none">{c.emoji}</span>
                <div className="min-w-0">
                  <p className={`font-syne text-[13px] font-bold ${selected ? "" : "text-[var(--text-primary)]"}`}>{c.title}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-[var(--text-tertiary)]">{c.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personality - segment control */}
      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Tono de conversación</p>
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-1">
          {pills.map((p) => {
            const on = personality === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersonality(p.id)}
                className={`flex flex-col items-center gap-1 rounded-lg py-2.5 text-center text-[11px] font-medium transition-all duration-150 dash-focus-ring ${
                  on
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span className="text-base leading-none">{p.icon}</span>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome message */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Mensaje de bienvenida</p>
          <span className="text-[10px] text-[var(--text-tertiary)]">{welcomeMessage.length}/120</span>
        </div>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value.slice(0, 120))}
          placeholder={`¡Hola! Soy ${agentName || "tu asistente"}. ¿En qué te puedo ayudar?`}
          rows={3}
          className="dash-focus-ring w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors duration-150 placeholder:text-[var(--text-tertiary)]"
        />
      </div>
    </div>
  );
}

const STARTER_CHARS = [
  { primary: "human" as PrimaryChar, subtype: "male", emoji: "🧑", label: "Hombre", desc: "Personaje masculino base" },
  { primary: "human" as PrimaryChar, subtype: "female", emoji: "👩", label: "Mujer", desc: "Personaje femenino base" },
] as const;

const STYLE_MODIFIER_ICONS: Record<string, string> = {
  profesional: "💼",
  amigable: "😊",
  juvenil: "⚡",
  divertido: "🎉",
  elegante: "✨",
  tecnico: "🔧",
};

function StyleChips({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Estilo del personaje</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(STYLE_MODIFIER_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150 dash-focus-ring ${
              value === key
                ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_14px_var(--accent-glow)] scale-105"
                : "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)] hover:scale-[1.03]"
            }`}
          >
            <span className="text-[13px] leading-none">{STYLE_MODIFIER_ICONS[key] ?? "●"}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAvatarPick({
  isPro,
  businessName,
  agentName,
  primary,
  setPrimary,
  subtype,
  setSubtype,
  styleModifier,
  setStyleModifier,
  aiSuggestions,
  suggestBusy,
  suggestError,
  selectedSuggestion,
  setSelectedSuggestion,
  onRefetchSuggestions,
  brandColor,
  setBrandColor,
  brandColor2,
  setBrandColor2,
  logoUrl,
  setLogoUrl,
  clothingText,
  setClothingText,
  avatarMicro,
  genBusy,
  genMessage,
}: {
  isPro: boolean;
  businessName: string;
  agentName: string;
  primary: PrimaryChar | null;
  setPrimary: (p: PrimaryChar) => void;
  subtype: string;
  setSubtype: (v: string) => void;
  styleModifier: string;
  setStyleModifier: (v: string) => void;
  aiSuggestions: CharacterSuggestion[];
  suggestBusy: boolean;
  suggestError: string | null;
  selectedSuggestion: CharacterSuggestion | null;
  setSelectedSuggestion: (s: CharacterSuggestion | null) => void;
  onRefetchSuggestions: () => void;
  brandColor: string;
  setBrandColor: (v: string) => void;
  brandColor2: string;
  setBrandColor2: (v: string) => void;
  logoUrl: string | null;
  setLogoUrl: (v: string | null) => void;
  clothingText: string;
  setClothingText: (v: string) => void;
  avatarMicro: "pick" | "generating" | "done";
  genBusy: boolean;
  genMessage: string;
}) {
  /* ── Starter: color picker + 4 base characters ── */
  if (!isPro) {
    const selectedChar = STARTER_CHARS.find((c) => c.primary === primary && c.subtype === subtype) ?? null;
    return (
      <div className="mt-5 space-y-5 pb-6 md:pb-0">
        <div>
          <h3 className="font-syne text-[21px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">¿Cómo se ve tu agente?</h3>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Elegí el personaje base y el color de tu marca.</p>
        </div>

        {/* Character tiles */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Personaje</p>
          <div className="grid grid-cols-2 gap-3">
            {STARTER_CHARS.map((c) => {
              const sel = selectedChar?.subtype === c.subtype && selectedChar?.primary === c.primary;
              return (
                <button
                  key={c.subtype}
                  type="button"
                  onClick={() => { setPrimary(c.primary); setSubtype(c.subtype); }}
                  className={`relative flex flex-col items-center gap-2.5 rounded-[var(--radius-xl)] border py-5 text-center transition-all duration-150 dash-focus-ring ${
                    sel
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)] shadow-[0_0_0_2px_var(--accent),0_0_20px_rgba(99,102,241,0.2)]"
                      : "border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] hover:scale-[1.02]"
                  }`}
                  style={{ background: sel ? undefined : `linear-gradient(160deg, var(--bg-elevated), var(--bg-surface))` }}
                >
                  {sel && (
                    <span className="absolute right-2.5 top-2.5 flex size-4.5 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-4xl leading-none">{c.emoji}</span>
                  <div>
                    <span className={`block text-[13px] font-bold ${sel ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>{c.label}</span>
                    <span className="block text-[10px] text-[var(--text-tertiary)]">{c.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Color de marca</p>
          <div className="flex flex-wrap gap-3">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => {
                  setBrandColor(c);
                  try { setBrandColor2(Color(c).rotate(24).lighten(0.08).hex()); } catch { setBrandColor2(c); }
                }}
                className={`size-10 rounded-xl border-2 transition-transform duration-150 ${brandColor === c ? "scale-110 border-white" : "border-transparent hover:scale-105"} dash-focus-ring`}
                style={{ backgroundColor: c, boxShadow: brandColor === c ? `0 0 0 2px ${c}66` : undefined }}
              />
            ))}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--border-default)] px-3 py-2 text-xs text-[var(--text-tertiary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]">
              Personalizar
              <input
                type="color"
                value={brandColor}
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                onChange={(e) => {
                  const v = e.target.value;
                  setBrandColor(v);
                  try { setBrandColor2(Color(v).rotate(24).lighten(0.08).hex()); } catch { /* keep */ }
                }}
              />
            </label>
          </div>
        </div>

        {/* Upgrade nudge */}
        <div className="flex items-start gap-3 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-4 py-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
          <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
            Con <span className="font-semibold text-[var(--accent)]">Plan Pro</span> podés generar un personaje totalmente personalizado con IA.{" "}
            <a href="/pricing" className="underline text-[var(--accent)] hover:text-[var(--accent-hover)]">Ver planes →</a>
          </p>
        </div>
      </div>
    );
  }

  /* ── Pro/Elite: AI suggestion flow ── */
  return (
    <div className="mt-5 space-y-5 pb-6 md:pb-0">
      <div>
        <h3 className="font-syne text-[21px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">¿Cómo se ve tu agente?</h3>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Elegí un personaje diseñado para tu negocio.</p>
      </div>

      {/* Phase 1: Suggestion selection */}
      {!selectedSuggestion ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Personajes sugeridos para{" "}
              <span className="text-[var(--text-secondary)]">{businessName || "tu negocio"}</span>
            </p>
            {aiSuggestions.length > 0 && !suggestBusy ? (
              <button
                type="button"
                onClick={onRefetchSuggestions}
                className="flex items-center gap-1 text-[11px] text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <RefreshCw className="size-3" />
                Nuevas
              </button>
            ) : null}
          </div>

          {suggestBusy ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-h-[120px] animate-pulse flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3"
                />
              ))}
            </div>
          ) : suggestError ? (
            <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.06)] px-4 py-4 text-center">
              <p className="text-sm text-[var(--error)]">{suggestError}</p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-[var(--accent)] underline"
                onClick={onRefetchSuggestions}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <style>{`
                @keyframes wiz-tile-in {
                  from { opacity: 0; transform: translateY(14px) scale(0.88); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes check-pop {
                  from { opacity: 0; transform: scale(0.4); }
                  to   { opacity: 1; transform: scale(1); }
                }
              `}</style>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {aiSuggestions.map((s, i) => {
                  // selectedSuggestion is null in this block (Phase 1), so sel is always false
                  const sel = false;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSuggestion(s)}
                      className={`group relative flex min-h-[120px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[var(--radius-xl)] border p-4 text-center transition-all duration-200 dash-focus-ring ${
                        sel
                          ? "border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-surface)] shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                          : "border-transparent hover:border-[var(--border-default)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] hover:scale-[1.04] active:scale-[0.97]"
                      }`}
                      style={{
                        background: `linear-gradient(145deg, ${s.gradientFrom}, ${s.gradientTo})`,
                        animation: `wiz-tile-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s both`,
                      }}
                    >
                      {sel && (
                        <span
                          className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                          style={{ animation: "check-pop 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                        >
                          <Check className="size-3 text-[var(--accent)]" strokeWidth={3} />
                        </span>
                      )}
                      {/* Hover shimmer */}
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
                        style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)" }}
                      />
                      <span className="text-4xl leading-none drop-shadow transition-transform duration-200 group-hover:scale-110">{s.emoji}</span>
                      <span className="font-syne text-[12px] font-bold text-white drop-shadow-sm">{s.title}</span>
                      <span className="line-clamp-2 text-[10px] leading-tight text-white/75">{s.description}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* Phase 2+: Selected character + brand controls */}
      {selectedSuggestion ? (
        <>
          {/* Selected character header */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: `linear-gradient(135deg, ${selectedSuggestion.gradientFrom}, ${selectedSuggestion.gradientTo})` }}
            >
              {selectedSuggestion.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-syne text-sm font-bold text-[var(--text-primary)]">{selectedSuggestion.title}</p>
              <p className="line-clamp-1 text-[11px] text-[var(--text-tertiary)]">{selectedSuggestion.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSuggestion(null)}
              className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>

          {/* Brand color */}
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Color de marca</p>
            <div className="flex flex-wrap gap-3">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => {
                    setBrandColor(c);
                    try { setBrandColor2(Color(c).rotate(24).lighten(0.08).hex()); } catch { setBrandColor2(c); }
                  }}
                  className={`size-10 rounded-xl border-2 transition-transform duration-150 ${
                    brandColor === c ? "scale-110 border-white" : "border-transparent hover:scale-105"
                  } dash-focus-ring`}
                  style={{ backgroundColor: c, boxShadow: brandColor === c ? `0 0 0 2px ${c}66` : undefined }}
                />
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--border-default)] px-3 py-2 text-xs text-[var(--text-tertiary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]">
                Personalizar
                <input
                  type="color"
                  value={brandColor}
                  className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                  onChange={(e) => {
                    const v = e.target.value;
                    setBrandColor(v);
                    try { setBrandColor2(Color(v).rotate(24).lighten(0.08).hex()); } catch { /* keep */ }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Style modifier chips */}
          <StyleChips value={styleModifier} onChange={setStyleModifier} />

          {/* Clothing text */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Texto en la ropa <span className="normal-case font-normal">(opcional)</span></p>
            <input
              type="text"
              value={clothingText}
              onChange={(e) => setClothingText(e.target.value.slice(0, 40))}
              placeholder={`Ej. ${businessName ? businessName.split(" ")[0] : "TuMarca"} Team`}
              maxLength={40}
              className="dash-focus-ring w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          {/* Logo */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Logo <span className="normal-case font-normal">(opcional)</span></p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-4 text-center transition-all duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)]">
              <span className="text-sm text-[var(--text-secondary)]">Subir logo · o arrastrá acá</span>
              <span className="text-[11px] text-[var(--text-tertiary)]">PNG o SVG · fondo transparente</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const data = reader.result as string;
                    const r = await fetch("/api/onboarding/upload-logo", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ imageBase64: data }),
                    });
                    const j = (await r.json()) as { url?: string };
                    if (j.url) setLogoUrl(j.url);
                  };
                  reader.readAsDataURL(f);
                }}
              />
            </label>
            {logoUrl ? (
              <div className="mt-2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="" className="size-10 rounded-lg object-contain" />
                <Button type="button" variant="ghost" size="sm" onClick={() => setLogoUrl(null)}>Quitar</Button>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      {/* Mobile generating state */}
      {avatarMicro === "generating" ? (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 md:hidden">
          <Loader2 className="size-5 shrink-0 animate-spin text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Generando avatar…</p>
            <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{genMessage}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepInstall({
  agentName,
  avatarUrl,
  genFallback,
  brandColor,
  url,
  createdSiteId,
  appUrl,
}: {
  agentName: string;
  avatarUrl: string | null;
  genFallback: boolean;
  brandColor: string;
  url: string;
  createdSiteId: string;
  appUrl: string;
}) {
  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="font-syne text-[22px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">Tu agente está listo</h3>
        <div className="mt-6 flex items-center gap-4">
          <div
            className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white"
            style={{ background: brandColor }}
          >
            {avatarUrl && !genFallback ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              agentName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-syne text-lg font-bold text-[var(--text-primary)]">{agentName}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{url.replace(/^https?:\/\//, "")}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--success)]">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--success)]" />
              Activo
            </span>
          </div>
        </div>
      </div>
      <InstallSnippet siteId={createdSiteId} appUrl={appUrl} verify installCheckUrl={`/api/onboarding/verify/${createdSiteId}`} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="rounded-[10px] bg-[var(--accent)] hover:bg-[var(--accent-hover)]">
          <Link href={`/dashboard/${createdSiteId}`}>Ver mi dashboard</Link>
        </Button>
        <Button variant="secondary" asChild className="rounded-[10px]">
          <a href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noreferrer">
            Ir a mi web
          </a>
        </Button>
      </div>
    </div>
  );
}
