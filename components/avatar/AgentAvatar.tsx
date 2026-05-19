"use client";

/**
 * AgentAvatar — avatar compuesto en capas:
 *   1. Fondo con tinte de marca
 *   2. Imagen de cara (IA-generada o placeholder DiceBear)
 *   3. Ropa SVG con brandColor
 *   4. Logo del cliente encima de la ropa (opcional)
 *
 * Reemplazar MALE_FACE_URL / FEMALE_FACE_URL con las imágenes definitivas.
 */

interface AgentAvatarProps {
  size?       : number;
  gender?     : "male" | "female";
  brandColor? : string;
  logoUrl?    : string | null;
  isSpeaking? : boolean;
  className?  : string;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function adjust(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `#${[clamp(r + amt), clamp(g + amt), clamp(b + amt)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

// ── Placeholders DiceBear (reemplazar con imágenes finales) ──────────────────
// Cambiar estas URLs por rutas a /public/avatars/male.png y female.png
// cuando estén las imágenes generadas con IA.
const MALE_FACE_URL =
  "https://api.dicebear.com/9.x/micah/svg?seed=milo-pro&baseColor=f5c49a,fddcb5&facialHairProbability=0&mouth=laughing&eyeShadow=variant02&hair=dannyPhantom,full,pixie,shortCurly&hairColor=2c1b0e,362312";
const FEMALE_FACE_URL =
  "https://api.dicebear.com/9.x/micah/svg?seed=mila-pro&baseColor=f5c49a,fddcb5&facialHairProbability=0&mouth=laughing&eyeShadow=variant02&hair=bob,curly,long,pigtails&hairColor=2c1b0e,6b3a2a";

export default function AgentAvatar({
  size       = 56,
  gender     = "male",
  brandColor = "#7c6cff",
  logoUrl    = null,
  isSpeaking = false,
  className  = "",
}: AgentAvatarProps) {
  const gid       = brandColor.replace(/[^a-f0-9]/gi, "").slice(0, 6) || "brand";
  const shirtDark = adjust(brandColor, -40);
  const bgLight   = adjust(brandColor, 196);
  const bgMid     = adjust(brandColor, 180);
  const showLogo  = !!logoUrl && size >= 72;
  const faceUrl   = gender === "female" ? FEMALE_FACE_URL : MALE_FACE_URL;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <defs>
          {/* Fondo */}
          <radialGradient id={`bg-${gid}`} cx="50%" cy="38%" r="65%">
            <stop offset="0%"   stopColor={bgLight} />
            <stop offset="100%" stopColor={bgMid}   />
          </radialGradient>

          {/* Ropa */}
          <linearGradient id={`sh-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={brandColor} />
            <stop offset="100%" stopColor={shirtDark}  />
          </linearGradient>

          {/* Clip circular */}
          <clipPath id={`clip-${gid}`}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>

          {/* Clip logo redondeado */}
          <clipPath id={`logo-${gid}`}>
            <rect x="33" y="77" width="34" height="18" rx="4" />
          </clipPath>
        </defs>

        {/* Fondo */}
        <circle cx="50" cy="50" r="50" fill={`url(#bg-${gid})`} />

        {/* Ropa / hombros — se dibuja ANTES de la cara para que quede por debajo */}
        <path
          d="M0 87 Q17 70 38 73 L44 83 L50 88 L56 83 L62 73 Q83 70 100 87 L100 100 L0 100Z"
          fill={`url(#sh-${gid})`}
        />
        {/* Solapa V */}
        <path
          d="M44 83 Q50 92 56 83"
          fill="none" stroke={shirtDark} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"
        />

        {/* Imagen de cara (cubre el círculo completo, se clipea) */}
        <image
          href={faceUrl}
          x="0" y="-4"
          width="100" height="100"
          clipPath={`url(#clip-${gid})`}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Logo del cliente sobre la ropa */}
        {showLogo && (
          <image
            href={logoUrl!}
            x="33" y="77"
            width="34" height="18"
            clipPath={`url(#logo-${gid})`}
            preserveAspectRatio="xMidYMid meet"
          />
        )}

        {/* Boca animada cuando habla (encima de la imagen) */}
        {isSpeaking && (
          <ellipse
            cx="50" cy="62"
            rx="6" ry="2.8"
            fill="rgba(160,80,60,0.55)"
            style={{ animation: "aa-talk 0.25s ease-in-out infinite alternate", transformOrigin: "50px 62px" }}
          />
        )}
      </svg>

      <style>{`
        @keyframes aa-talk {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.8); }
        }
      `}</style>
    </div>
  );
}
