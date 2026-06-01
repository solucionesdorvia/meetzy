/**
 * Prompts for fal.ai — 3D cartoon / Duolingo-adjacent expressive mascots.
 */

import { sanitizeAvatarPromptInput } from "@/lib/security";

/**
 * Minimal style modifiers — adjust tone/vibe without changing
 * the base format (3D cartoon, same composition, transparent bg).
 */
export const STYLE_MODIFIERS: Record<string, string> = {
  profesional:
    "polished business-professional look, confident composed posture, subtle formal accessories, sharp refined expression",
  amigable:
    "warm friendly smile, open approachable posture, casual relaxed style, inviting expression",
  juvenil:
    "youthful energetic vibe, trendy casual outfit, enthusiastic bright expression, dynamic upbeat pose",
  divertido:
    "playful fun personality, expressive animated pose, cheerful exaggerated smile, lively character energy",
  elegante:
    "sleek minimalist styling, refined clean look, calm composed expression, understated sophisticated details",
  tecnico:
    "tech-savvy smart look, subtle tech accessories, focused analytical expression, modern professional style",
};

export const STYLE_MODIFIER_LABELS: Record<string, string> = {
  profesional: "Profesional",
  amigable: "Amigable",
  juvenil: "Juvenil",
  divertido: "Divertido",
  elegante: "Elegante",
  tecnico: "Técnico",
};

export const AVATAR_STYLE_BASE = `professional 3D cartoon mascot character, Duolingo-style expressive character design,
vibrant smooth 3D render, soft diffused lighting with no hard shadows,
character on solid lime green background (#00FF00), uniform flat lime green backdrop, no gradients, no shadows on floor,
character floating centered in frame, no floor, no ground, no reflection, no environment elements,
big expressive eyes, smooth glossy skin texture, friendly approachable expression,
full character visible from head to waist, high quality 3D illustration,
clean edges, no artifacts, no cut-off limbs, fully intact character`.replace(/\n/g, " ");

/**
 * Agent-type visual modifiers applied to human archetypes.
 * Accessories are placed on the HEAD/FACE area so they remain visible
 * above the brand-color shirt SVG overlay that covers the body.
 */
export const AGENT_TYPE_MODIFIERS: Record<string, string> = {
  vendedor:
    "confident sales professional, well-groomed hair, subtle lapel pin or small tie clip visible at collar, charming engaging smile, business-casual look",
  guia:
    "friendly approachable guide, small wireless earpiece on one ear, curious open expression, casual-smart look, slight forward lean suggesting attentiveness",
  soporte:
    "tech-savvy support specialist, small bluetooth headset or earpiece clearly visible on ear, calm helpful expression, casual tech style",
  recepcionista:
    "polished front-desk professional, neat well-groomed look, warm welcoming smile, small elegant earring or subtle accessory, formal-friendly style",
};

export type AvatarArchetype =
  | "human_male"
  | "human_female"
  | "dog"
  | "cat"
  | "rabbit"
  | "fox"
  | "panda"
  | "bear"
  | "orange"
  | "apple"
  | "cup"
  | "star"
  | "rocket"
  | "diamond"
  | "car"
  | "nut"
  | "bag";

export interface AvatarPromptConfig {
  archetype: AvatarArchetype;
  brandColor: string;
  brandColor2?: string;
  businessName: string;
  agentName: string;
  logoUrl?: string | null;
  /**
   * How to use the logo in the generated avatar:
   * - "cap"         → character wears a branded baseball cap; logo composited on front panel
   * - "shirt"       → character wears a branded polo/t-shirt; logo composited on chest
   * - "badge"       → logo composited at the bottom of the character (legacy)
   * - "inspiration" → logo colours/style guide the generation; no composite overlay
   */
  logoMode?: "cap" | "shirt" | "badge" | "inspiration";
  /** Agent type drives accessory/expression modifier for human archetypes */
  agentType?: string;
  /** Extra variation suffix for regenerations */
  variation?: number;
  /** Direct AI-suggested hint — used verbatim in prompt (overrides generic TYPE_PROMPTS) */
  promptHint?: string;
  /** Short text to weave into clothing (e.g. business name) — best-effort, FLUX may vary */
  clothingText?: string;
}

const TYPE_PROMPTS: Record<AvatarArchetype, string> = {
  human_male: `young friendly male mascot character, wearing a modern hoodie or shirt in the brand colors, neat hair, genuine warm smile, floating in air no floor`,
  human_female: `young friendly female mascot character, wearing a modern top or hoodie in the brand colors, neat styled hair, warm approachable smile, floating in air no floor`,
  dog: `cute anthropomorphic friendly dog mascot, expressive face, wearing a small bandana in brand colors, floating pose no floor no shadow`,
  cat: `cute anthropomorphic friendly cat mascot, big eyes, wearing a collar with brand colored accent, floating no floor`,
  rabbit: `cute anthropomorphic bunny mascot, soft ears, playful floating pose, brand colored vest, no floor no shadow`,
  fox: `cute anthropomorphic fox mascot, fluffy tail, clever smile, scarf in brand colors, floating no ground`,
  panda: `cute anthropomorphic panda mascot, round friendly face, brand colored tee, floating no floor`,
  bear: `cute teddy-bear style mascot, warm smile, brand colored shirt, floating no floor no shadow`,
  orange: `cute orange fruit mascot with expressive cartoon face and tiny arms and legs, floating no floor`,
  apple: `cute apple fruit mascot with big eyes and smile, cartoon limbs, floating no floor`,
  cup: `cute coffee cup mascot character with face, small steam curl, glossy ceramic, floating no floor no shadow`,
  star: `cute golden star mascot with face and arms, sparkly expressive, floating in space no floor no ground`,
  rocket: `cute rocket ship mascot with friendly face on the window, 3D cartoon style, floating in air no floor no ground no shadow`,
  diamond: `cute faceted gem mascot with cartoon eyes and smile, floating no floor no shadow`,
  car: `cute Duolingo-style cartoon car mascot character, rounded compact body like a friendly hatchback or beetle, huge expressive circular headlight eyes with pupils, wide happy bumper smile, small round wheels with tiny cartoon legs and feet, short antenna or roof detail, glossy shiny paint, 3D render, floating no floor no shadow`,
  nut: `cute animated nut or seed mascot (walnut, almond, or pistachio style), expressive cartoon face, tiny arms, floating no floor no shadow`,
  bag: `cute animated product bag or package mascot, friendly face on the front, brand-colored packaging, floating no floor no shadow`,
};

export function buildAvatarPrompt(config: AvatarPromptConfig): string {
  // Sanitize user-supplied free text before it's used in the image prompt
  const businessName = sanitizeAvatarPromptInput(config.businessName);
  const clothingText = config.clothingText ? sanitizeAvatarPromptInput(config.clothingText, 40) : "";
  const promptHint = config.promptHint ? sanitizeAvatarPromptInput(config.promptHint, 400) : undefined;

  const isHuman = config.archetype === "human_male" || config.archetype === "human_female";
  const isCar = config.archetype === "car";
  const typeLine = promptHint ?? (TYPE_PROMPTS[config.archetype] ?? TYPE_PROMPTS.human_male);
  const agentTypeModifier =
    !promptHint && isHuman && config.agentType
      ? (AGENT_TYPE_MODIFIERS[config.agentType] ?? "")
      : "";
  const logoInstruction = config.logoUrl
    ? (config.logoMode === "inspiration"
        ? (isCar
            ? `The car's style is inspired by the brand identity — no physical logo overlay.`
            : `This character's visual aesthetic is inspired by the brand's identity. No logo overlay — brand spirit woven into the design.`)
        : config.logoMode === "cap"
          ? (isCar
              ? `The car has a small branded roof badge or license-plate frame area.`
              : `Character wears a branded baseball cap or snapback hat in brand color ${config.brandColor}. The cap's front panel is clean and unprinted — a blank emblem zone reserved for the brand logo to be added in post-processing. Cap brim faces forward, clearly visible. Detailed cap stitching.`)
          : config.logoMode === "shirt"
            ? (isCar
                ? `The car has a clean hood panel suitable for a brand decal.`
                : `Character wears a polo shirt or t-shirt in brand color ${config.brandColor}. The CENTER OF THE CHEST is completely plain, clean, empty fabric with NO print, NO text, NO graphics — a blank area reserved for logo placement. Shirt collar and sleeves have a contrasting accent color.`)
            : (isCar
                ? `The car has a small brand badge or decal on its hood.`
                : `The character wears clothing with a subtle chest emblem area suitable for a small brand logo.`))
    : "";
  const clothingHint = clothingText
    ? (isCar
        ? `The car body has a small "${clothingText}" badge or decal.`
        : `Character's clothing or collar includes "${clothingText}" naturally integrated as an embroidered patch or name badge.`)
    : `Subtle identity energy for "${businessName}" — expressive character, no literal text in the image.`;
  // For car archetypes, color goes directly to body paint for accuracy
  const colors = isCar
    ? `Car body painted in ${config.brandColor}${config.brandColor2 ? `, accent details in ${config.brandColor2}` : ""}, glossy shiny finish.`
    : `Primary brand color ${config.brandColor}${config.brandColor2 ? `, accent ${config.brandColor2}` : ""}.`;
  const varSuffix =
    config.variation && config.variation > 0 ? ` Unique variation ${config.variation}, slightly different pose.` : "";

  return [
    AVATAR_STYLE_BASE,
    typeLine,
    agentTypeModifier,
    colors,
    logoInstruction,
    clothingHint,
    varSuffix.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

/** Builds prompt for starter plan — uses existing archetype with optional style modifier. */
export function buildStarterPrompt(config: {
  archetype: "human_male" | "human_female";
  brandColor: string;
  brandColor2?: string;
  businessName: string;
  styleModifier?: string;
  variation?: number;
}): string {
  const typeLine = TYPE_PROMPTS[config.archetype];
  const styleLine = config.styleModifier ? (STYLE_MODIFIERS[config.styleModifier] ?? "") : "";
  const colors = `Primary brand color ${config.brandColor}${config.brandColor2 ? `, accent ${config.brandColor2}` : ""}.`;
  const varSuffix =
    config.variation && config.variation > 0 ? `Unique variation ${config.variation}, slightly different pose.` : "";
  return [AVATAR_STYLE_BASE, typeLine, styleLine, colors, varSuffix].filter(Boolean).join(" ");
}

/** Builds prompt for wizard flow (Pro) — uses promptHint from AI suggestion + optional style modifier. */
export function buildWizardPrompt(config: {
  promptHint: string;
  brandColor: string;
  brandColor2?: string;
  businessName: string;
  agentName: string;
  clothingText?: string;
  styleModifier?: string;
  variation?: number;
  logoMode?: "cap" | "shirt" | "badge" | "inspiration";
}): string {
  // Sanitize all user-supplied free text before it lands in the image prompt —
  // strips NSFW/violent keywords, prompt-injection keywords, and special chars.
  const businessName = sanitizeAvatarPromptInput(config.businessName);
  const clothingText = config.clothingText ? sanitizeAvatarPromptInput(config.clothingText, 40) : "";
  const promptHint = sanitizeAvatarPromptInput(config.promptHint, 400);

  const styleLine = config.styleModifier ? (STYLE_MODIFIERS[config.styleModifier] ?? "") : "";
  const colors = `Primary brand color ${config.brandColor}${config.brandColor2 ? `, accent ${config.brandColor2}` : ""}.`;

  let clothingHint: string;
  if (config.logoMode === "inspiration") {
    clothingHint = `The character embodies "${businessName}" brand identity — visual style and mood inspired by the brand logo aesthetic.`;
  } else if (config.logoMode === "cap") {
    clothingHint = `Character wears a branded baseball cap in brand color ${config.brandColor}. Cap front panel is completely blank and clean — empty emblem area, no print. Pair with a casual t-shirt.${clothingText ? ` Name badge or patch reads "${clothingText}".` : ""}`;
  } else if (config.logoMode === "shirt") {
    clothingHint = `Character wears a polo shirt or branded t-shirt in ${config.brandColor}. CENTER CHEST is clean, unprinted, empty fabric — no text, no logo — reserved for logo post-processing.${clothingText ? ` Small embroidered name tag reads "${clothingText}".` : ""}`;
  } else {
    // badge or undefined
    clothingHint = clothingText
      ? `Character's clothing includes "${clothingText}" as an embroidered patch or name badge — integrate naturally.`
      : `Character represents the brand "${businessName}" — expressive and on-brand, no literal text.`;
  }

  const varSuffix =
    config.variation && config.variation > 0 ? `Unique variation ${config.variation}, slightly different pose.` : "";

  return [
    AVATAR_STYLE_BASE,
    promptHint,
    styleLine,
    colors,
    clothingHint,
    varSuffix,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Maps onboarding UI internal keys → fal archetype */
export function mapSelectionToArchetype(
  category: "human" | "animal" | "fruit" | "object",
  subtype: string,
): AvatarArchetype {
  if (category === "human") {
    return subtype === "female" ? "human_female" : "human_male";
  }
  if (category === "animal") {
    const m: Record<string, AvatarArchetype> = {
      perro: "dog",
      gato: "cat",
      conejo: "rabbit",
      zorro: "fox",
      panda: "panda",
      oso: "bear",
      dog: "dog",
      cat: "cat",
      rabbit: "rabbit",
      fox: "fox",
      bear: "bear",
    };
    return m[subtype] ?? "dog";
  }
  if (category === "fruit") {
    const m: Record<string, AvatarArchetype> = {
      naranja: "orange",
      manzana: "apple",
      naranja_cartoon: "orange",
    };
    return m[subtype] ?? "orange";
  }
  /* object */
  const om: Record<string, AvatarArchetype> = {
    taza: "cup",
    estrella: "star",
    cohete: "rocket",
    diamante: "diamond",
    auto: "car",
    coche: "car",
    cup: "cup",
    star: "star",
    rocket: "rocket",
    diamond: "diamond",
    car: "car",
    nuez: "nut",
    almendra: "nut",
    pistacho: "nut",
    semilla: "nut",
    bolsa: "bag",
    paquete: "bag",
    nut: "nut",
    bag: "bag",
  };
  return om[subtype] ?? "cup";
}
