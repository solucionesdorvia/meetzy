/**
 * Maps gender + agentType → base image path for avatar rendering.
 * Falls back to generic male/female if type-specific image not found.
 */

export type AvatarGender = "male" | "female";
export type AvatarAgentType = "vendedor" | "guia" | "soporte" | "recepcionista";

const BASE = "/avatars";

const ASSET_MAP: Record<AvatarGender, Record<AvatarAgentType, string>> = {
  male: {
    vendedor:      `${BASE}/male_vendedor.png`,
    guia:          `${BASE}/male_guia.png`,
    soporte:       `${BASE}/male_soporte.png`,
    recepcionista: `${BASE}/male_recepcionista.png`,
  },
  female: {
    vendedor:      `${BASE}/female_vendedor.png`,
    guia:          `${BASE}/female_guia.png`,
    soporte:       `${BASE}/female_soporte.png`,
    recepcionista: `${BASE}/female_recepcionista.png`,
  },
};

const FALLBACK: Record<AvatarGender, string> = {
  male:   `${BASE}/male.png`,
  female: `${BASE}/female.png`,
};

export function getAvatarAsset(
  gender: AvatarGender | string = "male",
  agentType: AvatarAgentType | string = "guia",
): string {
  const g = (gender === "female" ? "female" : "male") as AvatarGender;
  const t = agentType as AvatarAgentType;
  return ASSET_MAP[g]?.[t] ?? FALLBACK[g]!;
}

export { ASSET_MAP, FALLBACK };
