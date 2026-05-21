"use client";

/**
 * AgentAvatar — avatar compuesto en capas:
 *   1. Fondo con gradiente signature Meetzy (oscuro + glow violeta)
 *   2. Imagen de cara PNG seleccionada por gender + agentType
 *   3. Ropa SVG con brandColor (tiñe la camisa con el color del cliente)
 *   4. Badge "M" de Meetzy sobre la ropa (branding sutil)
 *   5. Logo del cliente sobre la ropa (opcional, size >= 72)
 *   6. Animación idle (float) + speaking (glow ring + waveform)
 */

import { getAvatarAsset } from "@/lib/avatar-asset-map";

interface AgentAvatarProps {
  size?       : number;
  gender?     : "male" | "female";
  agentType?  : string;
  brandColor? : string;
  brandColor2?: string;
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

// Meetzy brand violet
const MZ_VIOLET = "#7c6cff";

export default function AgentAvatar({
  size        = 56,
  gender      = "male",
  agentType   = "guia",
  brandColor  = "#7c6cff",
  brandColor2,
  logoUrl     = null,
  isSpeaking  = false,
  className   = "",
}: AgentAvatarProps) {
  const gid        = brandColor.replace(/[^a-f0-9]/gi, "").slice(0, 6) || "brand";
  const shirt2     = brandColor2 ?? adjust(brandColor, -45);
  const shirtDark  = adjust(shirt2, -20);
  const showLogo   = !!logoUrl && size >= 40;
  const showBadge  = size >= 36 && !showLogo;
  const showWave   = isSpeaking && size >= 72;
  // Logo badge flotante: circular, esquina inferior-derecha
  const badgePx    = Math.round(size * 0.34);
  const badgeOff   = -Math.round(size * 0.04);
  const faceUrl    = getAvatarAsset(gender, agentType);

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
          {/* Fondo: gradiente signature Meetzy — oscuro con glow violeta central */}
          <radialGradient id={`mz-bg-${gid}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor={hexAlpha(MZ_VIOLET, 0.28)} />
            <stop offset="55%"  stopColor="#0c0a18" />
            <stop offset="100%" stopColor="#040405" />
          </radialGradient>

          {/* Ropa: gradiente brandColor → brandColor2 del cliente */}
          <linearGradient id={`sh-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={brandColor} />
            <stop offset="100%" stopColor={shirt2}     />
          </linearGradient>

          {/* Solapa oscura */}
          <linearGradient id={`sl-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={shirtDark} />
            <stop offset="100%" stopColor={adjust(shirt2, -50)} />
          </linearGradient>

          {/* Clip circular */}
          <clipPath id={`clip-${gid}`}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>

        {/* ── Fondo Meetzy ─────────────────────────────────────────────── */}
        <circle cx="50" cy="50" r="50" fill={`url(#mz-bg-${gid})`} />

        {/* ── Imagen de cara PNG (gender + agentType) ───────────────────── */}
        <image
          href={faceUrl}
          x="0" y="-8"
          width="100" height="108"
          clipPath={`url(#clip-${gid})`}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ── Ropa: zona inferior con color de marca ────────────────────── */}

        {/* Cuerpo principal de la camisa */}
        <path
          d="M-2 93 Q16 78 38 81 L44 88 L50 93 L56 88 L62 81 Q84 78 102 93 L102 102 L-2 102Z"
          fill={`url(#sh-${gid})`}
        />

        {/* Solapa izquierda */}
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

        {/* Línea de cuello */}
        <path
          d="M44 88 Q50 97 56 88"
          fill="none"
          stroke={adjust(brandColor, -60)}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Sombra de cuello */}
        <ellipse cx="50" cy="82" rx="10" ry="3.5" fill="rgba(0,0,0,0.10)" />

        {/* ── Wordmark "MEETZY" estilo parche bordado en la camisa ────── */}
        {showBadge && (
          <g>
            {/* Sombra suave debajo del patch */}
            <ellipse cx="50" cy="100" rx="22" ry="1.4" fill="rgba(0,0,0,0.22)" />
            {/* Patch blanco rounded pill */}
            <rect
              x="26" y="92" width="48" height="8" rx="4"
              fill="#ffffff"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="0.3"
            />
            {/* MEETZY wordmark — mismo two-tone que el navbar */}
            <text
              x="50" y="96.5"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5.5"
              fontWeight="800"
              fontFamily="'Syne', system-ui, -apple-system, sans-serif"
              letterSpacing="-0.16"
            >
              <tspan fill="#0e0d16">MEET</tspan>
              <tspan fill={brandColor}>ZY</tspan>
            </text>
          </g>
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

      {/* ── Logo badge circular flotante — esquina inferior-derecha ─── */}
      {showLogo && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: badgeOff,
            right: badgeOff,
            width: badgePx,
            height: badgePx,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.15)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: Math.round(badgePx * 0.12),
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl!}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      <style>{`
        @keyframes aa-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes aa-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.025); }
        }
        @keyframes aa-bar {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
