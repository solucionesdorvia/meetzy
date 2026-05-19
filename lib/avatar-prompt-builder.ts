/**
 * Prompts for fal.ai — 3D cartoon / Duolingo-adjacent expressive mascots.
 */

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
vibrant smooth 3D render, soft studio lighting, character centered in frame,
completely transparent background, PNG with alpha channel, no background elements,
big expressive eyes, smooth glossy skin texture, friendly approachable expression,
full character visible from head to waist, high quality 3D illustration`.replace(/\n/g, " ");

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
  | "diamond";

export interface AvatarPromptConfig {
  archetype: AvatarArchetype;
  brandColor: string;
  brandColor2?: string;
  businessName: string;
  agentName: string;
  logoUrl?: string | null;
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
  human_male: `young friendly male mascot character, wearing a modern hoodie or shirt in the brand colors, neat hair, genuine warm smile`,
  human_female: `young friendly female mascot character, wearing a modern top or hoodie in the brand colors, neat styled hair, warm approachable smile`,
  dog: `cute anthropomorphic friendly dog mascot, expressive face, wearing a small bandana in brand colors`,
  cat: `cute anthropomorphic friendly cat mascot, big eyes, wearing a collar with brand colored accent`,
  rabbit: `cute anthropomorphic bunny mascot, soft ears, playful pose, brand colored vest`,
  fox: `cute anthropomorphic fox mascot, fluffy tail, clever smile, scarf in brand colors`,
  panda: `cute anthropomorphic panda mascot, round friendly face,bamboo optional, brand colored tee`,
  bear: `cute teddy-bear style mascot, warm smile, brand colored shirt`,
  orange: `cute orange fruit mascot with expressive cartoon face and tiny arms and legs`,
  apple: `cute apple fruit mascot with big eyes and smile, cartoon limbs`,
  cup: `cute coffee cup mascot character with face, small steam curl, glossy ceramic`,
  star: `cute golden star mascot with face and arms, sparkly expressive`,
  rocket: `cute rocket ship mascot with face on the window, friendly cartoon`,
  diamond: `cute faceted gem mascot with cartoon eyes and smile`,
};

export function buildAvatarPrompt(config: AvatarPromptConfig): string {
  const isHuman = config.archetype === "human_male" || config.archetype === "human_female";
  const typeLine = config.promptHint ?? (TYPE_PROMPTS[config.archetype] ?? TYPE_PROMPTS.human_male);
  const agentTypeModifier =
    !config.promptHint && isHuman && config.agentType
      ? (AGENT_TYPE_MODIFIERS[config.agentType] ?? "")
      : "";
  const logoInstruction = config.logoUrl
    ? `The character wears clothing with a subtle chest emblem area suitable for a small brand logo.`
    : "";
  const clothingHint = config.clothingText
    ? `Character's clothing or collar includes "${config.clothingText}" naturally integrated as an embroidered patch or name badge.`
    : `Subtle identity energy for "${config.businessName}" — expressive character, no literal text in the image.`;
  const colors = `Primary brand color ${config.brandColor}${config.brandColor2 ? `, accent ${config.brandColor2}` : ""}.`;
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
}): string {
  const styleLine = config.styleModifier ? (STYLE_MODIFIERS[config.styleModifier] ?? "") : "";
  const colors = `Primary brand color ${config.brandColor}${config.brandColor2 ? `, accent ${config.brandColor2}` : ""}.`;
  const clothingHint = config.clothingText
    ? `Character's clothing includes "${config.clothingText}" as an embroidered patch or name badge — integrate naturally.`
    : `Character represents the brand "${config.businessName}" — expressive and on-brand, no literal text.`;
  const varSuffix =
    config.variation && config.variation > 0 ? `Unique variation ${config.variation}, slightly different pose.` : "";

  return [
    AVATAR_STYLE_BASE,
    config.promptHint,
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
    cup: "cup",
    star: "star",
    rocket: "rocket",
    diamond: "diamond",
  };
  return om[subtype] ?? "cup";
}
