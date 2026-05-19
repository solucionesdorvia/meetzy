import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/lib/auth";
import { removeBackground } from "@/lib/fal";
import extractDominantColors from "@/lib/color-extractor";

const BodySchema = z.object({
  imageBase64: z.string().min(20).max(3_500_000),
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]).optional(),
});

export async function POST(req: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid image payload" }, { status: 400 });

    let { imageBase64 } = parsed.data;
    const mime = parsed.data.mimeType ?? "image/png";

    if (!imageBase64.startsWith("data:")) {
      imageBase64 = `data:${mime};base64,${imageBase64}`;
    }

    const approxBytes = (imageBase64.length * 3) / 4;
    if (approxBytes > 2_500_000) {
      return NextResponse.json({ error: "Imagen muy grande (máx ~2MB)" }, { status: 400 });
    }

    const base64Data = imageBase64.startsWith("data:")
      ? imageBase64.split(",")[1]!
      : imageBase64;
    const imageBuffer = Buffer.from(base64Data, "base64");

    try {
      const [colorsResult, bgResult] = await Promise.allSettled([
        extractDominantColors(imageBuffer),
        removeBackground(imageBuffer),
      ]);

      const colors =
        colorsResult.status === "fulfilled"
          ? colorsResult.value
          : { primary: "#6366f1", secondary: "#4338ca" };

      let finalDataUrl: string;
      if (bgResult.status === "fulfilled") {
        const cleanBuffer = bgResult.value;
        finalDataUrl = `data:image/png;base64,${cleanBuffer.toString("base64")}`;
      } else {
        finalDataUrl = imageBase64;
      }

      return NextResponse.json({
        url: finalDataUrl,
        brandColor: colors.primary,
        brandColor2: colors.secondary,
      });
    } catch {
      return NextResponse.json({ url: imageBase64 });
    }
  } catch (e) {
    console.error("upload-logo", e);
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}
