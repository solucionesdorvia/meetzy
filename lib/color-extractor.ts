import sharp from "sharp";

function toHex(r: number, g: number, b: number): string {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

function manhattanDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

export async function extractDominantColors(
  imageBuffer: Buffer,
): Promise<{ primary: string; secondary: string }> {
  const fallback = { primary: "#6366f1", secondary: "#4338ca" };

  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(80, 80, { fit: "cover" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels !== 4) return fallback;

    const freq = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      // Skip transparent pixels
      if (a < 128) continue;

      // Skip near-white pixels
      if (r > 230 && g > 230 && b > 230) continue;

      // Skip near-black pixels
      if (r < 25 && g < 25 && b < 25) continue;

      // Quantize by rounding to nearest 32
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;

      const key = `${qr},${qg},${qb}`;
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }

    if (freq.size === 0) return fallback;

    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

    const [primaryKey] = sorted[0]!;
    const [pr, pg, pb] = primaryKey.split(",").map(Number) as [number, number, number];

    const primary = toHex(
      Math.min(255, pr),
      Math.min(255, pg),
      Math.min(255, pb),
    );

    let secondary: string | null = null;
    for (const [key] of sorted.slice(1)) {
      const [sr, sg, sb] = key.split(",").map(Number) as [number, number, number];
      if (manhattanDistance(pr, pg, pb, sr, sg, sb) > 120) {
        secondary = toHex(Math.min(255, sr), Math.min(255, sg), Math.min(255, sb));
        break;
      }
    }

    if (!secondary) {
      // Darken primary by 0.7
      secondary = toHex(
        Math.round(Math.min(255, pr) * 0.7),
        Math.round(Math.min(255, pg) * 0.7),
        Math.round(Math.min(255, pb) * 0.7),
      );
    }

    return { primary, secondary };
  } catch {
    return fallback;
  }
}

export default extractDominantColors;
