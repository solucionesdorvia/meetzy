import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isFalConfigured, isCloudinaryConfigured, generateFluxAvatarImage, generateAvatarPipelineFromFalUrl } from "@/lib/fal";
import { buildWizardPrompt } from "@/lib/avatar-prompt-builder";
import { avatarGenerateUserRatelimit } from "@/lib/redis";

const BodySchema = z.object({
  siteId: z.string().min(1),
  archetype: z.string().min(1),
  promptHint: z.string().min(1).max(400),
  businessName: z.string().min(1).max(120),
  agentName: z.string().min(1).max(80),
  brandColor: z.string().min(1),
  brandColor2: z.string().optional(),
  logoUrl: z.union([z.string().url(), z.string().startsWith("data:"), z.literal("")]).optional().nullable(),
  logoMode: z.enum(["cap", "shirt", "badge", "inspiration"]).optional(),
  clothingText: z.string().max(40).optional(),
});

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await avatarGenerateUserRatelimit.limit(dbUser.email);
    if (!success) {
      return NextResponse.json({ error: "Límite diario de generaciones alcanzado (10)." }, { status: 429 });
    }

    if (!isFalConfigured()) {
      return NextResponse.json({ error: "FAL_KEY no configurada." }, { status: 503 });
    }
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ error: "Cloudinary no configurado." }, { status: 503 });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.issues }, { status: 400 });
    }

    const d = parsed.data;
    const site = await prisma.site.findFirst({ where: { siteId: d.siteId, userId: dbUser.id } });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    if (site.avatarGenerations >= 3) {
      return NextResponse.json({ error: "Máximo de regeneraciones alcanzado para este agente (3)." }, { status: 429 });
    }

    const prompt = buildWizardPrompt({
      promptHint: d.promptHint,
      brandColor: d.brandColor,
      brandColor2: d.brandColor2,
      businessName: d.businessName,
      agentName: d.agentName,
      clothingText: d.clothingText,
      logoMode: d.logoMode,
    });

    const { url: falUrl, error: falErr } = await generateFluxAvatarImage(prompt);
    if (!falUrl) {
      return NextResponse.json({ error: falErr ?? "Generation failed" }, { status: 500 });
    }

    const { imageUrl } = await generateAvatarPipelineFromFalUrl(
      falUrl,
      { logoUrl: d.logoUrl?.trim() || undefined, agentName: d.agentName, logoMode: d.logoMode ?? "badge" },
      { requireCloudinary: true, cloudinaryPublicIdBase: d.agentName },
    );

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        avatarImageUrl: imageUrl,
        avatarStyle: "cartoon",
        avatarPrompt: prompt,
        avatarType: d.archetype.startsWith("human") ? "human" : "character",
        avatarSubtype: d.archetype,
        avatarGenerations: { increment: 1 },
        avatarLastGenerated: new Date(),
        brandColor: d.brandColor,
        brandColor2: d.brandColor2 ?? site.brandColor2,
        logoUrl: d.logoUrl?.trim() || site.logoUrl,
      },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: imageUrl,
      generationsUsed: updated.avatarGenerations,
      generationsRemaining: Math.max(0, 3 - updated.avatarGenerations),
    });
  } catch (e) {
    console.error("[wizard-save]", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
