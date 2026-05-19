"use client";

/**
 * AgentAvatar — avatar compuesto en capas:
 *   1. Fondo con tinte de marca
 *   2. Imagen de cara (flat illustration PNG)
 *   3. Ropa SVG con brandColor (cubre la remera neutral de la imagen)
 *   4. Logo del cliente sobre la ropa (opcional, size >= 72)
 *   5. Animación idle (float) + speaking (glow ring + waveform)
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
function hexAlpha(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

const MALE_FACE_URL   = "/avatars/male.png";
const FEMALE_FACE_URL = "/avatars/female.png";

export default function AgentAvatar({
  size       = 56,
  gender     = "male",
  brandColor = "#7c6cff",
  logoUrl    = null,
  isSpeaking = false,
  className  = "",
}: AgentAvatarProps) {
  const gid       = brandColor.replace(/[^a-f0-9]/gi, "").slice(0, 6) || "brand";
  const shirtDark = adjust(brandColor, -45);
  const bgLight   = adjust(brandColor, 196);
  const bgMid     = adjust(brandColor, 182);
  const showLogo  = !!logoUrl && size >= 72;
  const showWave  = isSpeaking && size >= 64;
  const faceUrl   = gender === "female" ? FEMALE_FACE_URL : MALE_FACE_URL;

  // Glow ring cuando habla
  const glowShadow = isSpeaking
    ? `0 0 0 ${Math.round(size * 0.04)}px ${hexAlpha(brandColor, 0.5)}, 0 0 ${Math.round(size * 0.25)}px ${hexAlpha(brandColor, 0.35)}`
    : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        boxShadow: glowShadow,
        animation: isSpeaking ? "aa-pulse 1.4s ease-in-out infinite" : "aa-float 3.5s ease-in-out infinite",
        transition: "box-shadow 0.4s ease",
      }}
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

          {/* Ropa principal */}
          <linearGradient id={`sh-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={brandColor} />
            <stop offset="100%" stopColor={shirtDark}  />
          </linearGradient>

          {/* Sombra interior ropa (lapel oscuro) */}
          <linearGradient id={`sl-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={shirtDark} />
            <stop offset="100%" stopColor={adjust(brandColor, -70)} />
          </linearGradient>

          {/* Clip circular */}
          <clipPath id={`clip-${gid}`}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>

          {/* Clip logo */}
          <clipPath id={`logo-clip-${gid}`}>
            <rect x="34" y="78" width="32" height="16" rx="3" />
          </clipPath>
        </defs>

        {/* Fondo */}
        <circle cx="50" cy="50" r="50" fill={`url(#bg-${gid})`} />

        {/* Imagen de cara */}
        <image
          href={faceUrl}
          x="0" y="-8"
          width="100" height="108"
          clipPath={`url(#clip-${gid})`}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ── Headset — fino, proporcional, headset de oficina ────────── */}

        {/* Banda sobre la cabeza — trazo fino */}
        <path
          d="M22 55 C20 38, 30 14, 50 11 C70 14, 80 38, 78 55"
          fill="none"
          stroke={adjust(brandColor, -30)}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M22 55 C20 38, 30 14, 50 11 C70 14, 80 38, 78 55"
          fill="none"
          stroke={brandColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Auricular izquierdo — pequeño y proporcional */}
        <ellipse cx="20" cy="57" rx="6.5" ry="7.5" fill={adjust(brandColor, -30)} />
        <ellipse cx="20" cy="57" rx="5"   ry="6"   fill={brandColor} />
        <ellipse cx="20" cy="57" rx="2.5" ry="3"   fill={adjust(brandColor, -50)} />

        {/* Auricular derecho */}
        <ellipse cx="80" cy="57" rx="6.5" ry="7.5" fill={adjust(brandColor, -30)} />
        <ellipse cx="80" cy="57" rx="5"   ry="6"   fill={brandColor} />
        <ellipse cx="80" cy="57" rx="2.5" ry="3"   fill={adjust(brandColor, -50)} />

        {/* Brazo del micrófono — fino */}
        <path
          d="M15 62 Q11 72 24 74"
          fill="none"
          stroke={adjust(brandColor, -30)}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 62 Q11 72 24 74"
          fill="none"
          stroke={brandColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Cápsula del micrófono — pequeña */}
        <rect x="21" y="71.5" width="7" height="4.5" rx="2.2" fill={adjust(brandColor, -30)} />
        <rect x="22" y="72.2" width="5" height="3"   rx="1.5" fill={brandColor} />

        {/* LED activo del mic cuando habla */}
        {isSpeaking && (
          <circle
            cx="24.5" cy="73.7"
            r="1.4"
            fill="white"
            opacity="0.95"
            style={{ animation: "aa-mic 0.8s ease-in-out infinite alternate" }}
          />
        )}

        {/* ── Ropa: cubre la zona inferior de la imagen ────────────────── */}

        {/* Cuerpo principal de la camisa */}
        <path
          d="M-2 93 Q16 78 38 81 L44 88 L50 93 L56 88 L62 81 Q84 78 102 93 L102 102 L-2 102Z"
          fill={`url(#sh-${gid})`}
        />

        {/* Solapa izquierda (más oscura, da profundidad de saco) */}
        <path
          d="M-2 93 Q16 78 38 81 L44 88 L50 93 Q40 88 28 82 Q14 79 -2 93Z"
          fill={`url(#sl-${gid})`}
          opacity="0.55"
        />

        {/* Solapa derecha */}
        <path
          d="M102 93 Q84 78 62 81 L56 88 L50 93 Q60 88 72 82 Q86 79 102 93Z"
          fill={`url(#sl-${gid})`}
          opacity="0.55"
        />

        {/* Línea de cuello / collar */}
        <path
          d="M44 88 Q50 97 56 88"
          fill="none"
          stroke={adjust(brandColor, -60)}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Sombra de cuello sobre la ropa */}
        <ellipse cx="50" cy="82" rx="10" ry="3.5" fill="rgba(0,0,0,0.10)" />

        {/* ── Logo del cliente ──────────────────────────────────────────── */}
        {showLogo && (
          <image
            href={logoUrl!}
            x="34" y="78"
            width="32" height="16"
            clipPath={`url(#logo-clip-${gid})`}
            preserveAspectRatio="xMidYMid meet"
          />
        )}

        {/* ── Waveform bars cuando habla ───────────────────────────────── */}
        {showWave && (
          <g>
            <rect x="36" y="88" width="3.5" height="5"   rx="1.5" fill="white" opacity="0.85"
              style={{ animation: "aa-bar 0.7s ease-in-out 0.00s infinite alternate", transformOrigin: "37.75px 93px" }} />
            <rect x="42" y="86" width="3.5" height="7"   rx="1.5" fill="white" opacity="0.9"
              style={{ animation: "aa-bar 0.7s ease-in-out 0.14s infinite alternate", transformOrigin: "43.75px 93px" }} />
            <rect x="48" y="87" width="3.5" height="6"   rx="1.5" fill="white" opacity="0.9"
              style={{ animation: "aa-bar 0.7s ease-in-out 0.07s infinite alternate", transformOrigin: "49.75px 93px" }} />
            <rect x="54" y="85" width="3.5" height="8"   rx="1.5" fill="white" opacity="0.9"
              style={{ animation: "aa-bar 0.7s ease-in-out 0.21s infinite alternate", transformOrigin: "55.75px 93px" }} />
            <rect x="60" y="88" width="3.5" height="5"   rx="1.5" fill="white" opacity="0.85"
              style={{ animation: "aa-bar 0.7s ease-in-out 0.35s infinite alternate", transformOrigin: "61.75px 93px" }} />
          </g>
        )}
      </svg>

      <style>{`
        /* Idle: float suave */
        @keyframes aa-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }

        /* Speaking: micro-pulso */
        @keyframes aa-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.025); }
        }

        /* Waveform bars */
        @keyframes aa-bar {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }

        /* Mic active dot */
        @keyframes aa-mic {
          from { opacity: 0.4; r: 1.5px; }
          to   { opacity: 1;   r: 2.5px; }
        }
      `}</style>
    </div>
  );
}
