import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isCloudinaryConfigured, generateAvatarPipelineFromFalUrl } from "@/lib/fal";

const BodySchema = z.object({
  siteId: z.string().min(1),
  falUrl: z.string().url(),
  agentName: z.string().min(1).max(80),
  archetype: z.string().min(1),
  logoUrl: z.union([z.string().url(), z.string().startsWith("data:"), z.literal("")]).optional().nullable(),
  logoMode: z.enum(["cap", "shirt", "badge", "inspiration"]).optional(),
});

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const d = parsed.data;
    const site = await prisma.site.findFirst({ where: { siteId: d.siteId, userId: dbUser.id } });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    // If Cloudinary isn't set up, just persist the raw fal URL as fallback
    if (!isCloudinaryConfigured()) {
      await prisma.site.update({
        where: { id: site.id },
        data: { avatarImageUrl: d.falUrl, avatarStyle: "cartoon" },
      });
      return NextResponse.json({ avatarUrl: d.falUrl });
    }

    // Full pipeline: bg removal + Cloudinary upload
    const { imageUrl } = await generateAvatarPipelineFromFalUrl(
      d.falUrl,
      { logoUrl: d.logoUrl?.trim() || undefined, agentName: d.agentName, logoMode: d.logoMode ?? "badge" },
      { requireCloudinary: true, cloudinaryPublicIdBase: d.agentName },
    );

    await prisma.site.update({
      where: { id: site.id },
      data: {
        avatarImageUrl: imageUrl,
        avatarStyle: "cartoon",
        avatarSubtype: d.archetype,
        avatarGenerations: { increment: 1 },
        avatarLastGenerated: new Date(),
      },
    });

    return NextResponse.json({ avatarUrl: imageUrl });
  } catch (e) {
    console.error("[wizard-finalize]", e);
    console.error("[wizard-finalize] details:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Error al procesar el avatar. Intentá de nuevo." }, { status: 500 });
  }
}
