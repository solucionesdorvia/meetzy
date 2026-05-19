import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/lib/auth";
import { isFalConfigured, generateFluxAvatarImage } from "@/lib/fal";
import { buildWizardPrompt, buildStarterPrompt } from "@/lib/avatar-prompt-builder";
import { avatarPreviewIpRatelimit } from "@/lib/redis";

const BodySchema = z.object({
  archetype: z.string().min(1),
  // Pro: promptHint from AI suggestion. Starter: omit — uses archetype + styleModifier.
  promptHint: z.string().min(1).max(400).optional(),
  businessName: z.string().min(1).max(120),
  agentName: z.string().min(1).max(80),
  brandColor: z.string().min(1),
  brandColor2: z.string().optional(),
  clothingText: z.string().max(40).optional(),
  styleModifier: z.string().max(40).optional(),
  variation: z.number().int().min(0).max(20).optional(),
  logoMode: z.enum(["badge", "inspiration"]).optional(),
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await avatarPreviewIpRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Máximo 5 previews por hora. Intentá más tarde." }, { status: 429 });
    }

    if (!isFalConfigured()) {
      return NextResponse.json({ error: "Generación de imágenes no disponible." }, { status: 503 });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.issues }, { status: 400 });
    }

    const d = parsed.data;

    // Build prompt: starter uses archetype + styleModifier; pro uses promptHint.
    const prompt = d.promptHint
      ? buildWizardPrompt({
          promptHint: d.promptHint,
          brandColor: d.brandColor,
          brandColor2: d.brandColor2,
          businessName: d.businessName,
          agentName: d.agentName,
          clothingText: d.clothingText,
          styleModifier: d.styleModifier,
          variation: d.variation,
          logoMode: d.logoMode,
        })
      : buildStarterPrompt({
          archetype: d.archetype as "human_male" | "human_female",
          brandColor: d.brandColor,
          brandColor2: d.brandColor2,
          businessName: d.businessName,
          styleModifier: d.styleModifier,
          variation: d.variation,
        });

    const { url, error } = await generateFluxAvatarImage(prompt, d.variation);
    if (!url) {
      return NextResponse.json({ error: error ?? "Error al generar la vista previa." }, { status: 500 });
    }

    return NextResponse.json({ previewUrl: url, prompt: prompt.slice(0, 400) });
  } catch (e) {
    console.error("[wizard-preview]", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
