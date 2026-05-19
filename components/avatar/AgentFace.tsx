"use client";

/**
 * AgentFace — avatar circular profesional para widget de chat.
 * brandColor → fondo, ropa y acento. Pelo siempre oscuro (no se tiñe).
 * Funciona bien desde 36px (widget) hasta 280px (demo sección).
 */

interface AgentFaceProps {
  size?       : number;
  brandColor? : string;
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

export default function AgentFace({
  size       = 56,
  brandColor = "#7c6cff",
  isSpeaking = false,
  className  = "",
}: AgentFaceProps) {
  const gid      = brandColor.replace(/[^a-f0-9]/gi, "").slice(0, 6) || "brand";
  const shirtDark = adjust(brandColor, -40);

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
          {/* Fondo: tinte muy suave de marca */}
          <radialGradient id={`bg-${gid}`} cx="50%" cy="38%" r="62%">
            <stop offset="0%"   stopColor={adjust(brandColor, 196)} />
            <stop offset="100%" stopColor={adjust(brandColor, 180)} />
          </radialGradient>

          {/* Piel: gradiente cálido */}
          <radialGradient id={`sk-${gid}`} cx="42%" cy="28%" r="68%" gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%"   stopColor="#fde8cc" />
            <stop offset="52%"  stopColor="#f5c49a" />
            <stop offset="100%" stopColor="#e8a070" />
          </radialGradient>

          {/* Ropa: color de marca */}
          <linearGradient id={`sh-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={brandColor}  />
            <stop offset="100%" stopColor={shirtDark} />
          </linearGradient>

          {/* Pelo: carbón oscuro con brillo sutil */}
          <radialGradient id={`hr-${gid}`} cx="40%" cy="18%" r="60%">
            <stop offset="0%"   stopColor="#4a4358" />
            <stop offset="45%"  stopColor="#2a2435" />
            <stop offset="100%" stopColor="#100e18" />
          </radialGradient>

          {/* Sombra suave bajo el pelo sobre la frente */}
          <linearGradient id={`hf-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {/* ── Fondo ─────────────────────────────── */}
        <circle cx="50" cy="50" r="50" fill={`url(#bg-${gid})`} />

        {/* ── Ropa / hombros ────────────────────── */}
        <path
          d="M0 87 Q17 72 38 74 L44 84 L50 89 L56 84 L62 74 Q83 72 100 87 L100 100 L0 100Z"
          fill={`url(#sh-${gid})`}
        />
        {/* Solapa V */}
        <path d="M44 84 Q50 93 56 84" fill="none" stroke={shirtDark} strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />

        {/* ── Cuello ────────────────────────────── */}
        <path d="M44 73 Q50 79 56 73 L57 85 Q50 89 43 85Z" fill="#e8a470" />

        {/* ── Pelo: masa principal (toda la parte superior de la cabeza) ── */}
        <path
          d="M26 56
             C 22 44, 24 20, 50 14
             C 76 20, 78 44, 74 56
             C 70 50, 62 46, 50 46
             C 38 46, 30 50, 26 56Z"
          fill={`url(#hr-${gid})`}
        />

        {/* Pelo lateral izquierdo — baja hasta el lóbulo */}
        <path d="M26 55 C 23 62, 22 70, 25 76"
          fill="none" stroke="#1a1622" strokeWidth="7" strokeLinecap="round" />
        {/* Pelo lateral derecho */}
        <path d="M74 55 C 77 62, 78 70, 75 76"
          fill="none" stroke="#1a1622" strokeWidth="7" strokeLinecap="round" />

        {/* ── Orejas (entre pelo y cara) ────────── */}
        <ellipse cx="25" cy="60" rx="4.8" ry="6.2" fill="#e8a470" />
        <ellipse cx="26.5" cy="60" rx="2.6" ry="4"   fill="#d09060" />
        <ellipse cx="75" cy="60" rx="4.8" ry="6.2" fill="#e8a470" />
        <ellipse cx="73.5" cy="60" rx="2.6" ry="4"   fill="#d09060" />

        {/* ── Cara ──────────────────────────────── */}
        <ellipse cx="50" cy="58" rx="24" ry="27" fill={`url(#sk-${gid})`} />

        {/* ── Pelo frontal: tapa la parte alta de la cara ─ */}
        <path
          d="M27 55
             C 28 48, 35 42, 50 40
             C 65 42, 72 48, 73 55
             C 68 51, 60 48, 50 48
             C 40 48, 32 51, 27 55Z"
          fill={`url(#hr-${gid})`}
        />

        {/* Sombra suave del pelo sobre la frente */}
        <path
          d="M29 55 C 31 51, 40 48, 50 48 C 60 48, 69 51, 71 55 C 68 53, 60 51, 50 51 C 40 51, 32 53, 29 55Z"
          fill={`url(#hf-${gid})`}
          opacity="0.45"
        />

        {/* Textura pelo: mechones con dirección */}
        <path d="M34 22 Q42 17 50 16" fill="none" stroke="#4a4358" strokeWidth="2"   strokeLinecap="round" opacity="0.5" />
        <path d="M50 16 Q58 17 66 22" fill="none" stroke="#4a4358" strokeWidth="2"   strokeLinecap="round" opacity="0.5" />
        <path d="M29 34 Q33 26 40 21" fill="none" stroke="#3a3248" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
        <path d="M71 34 Q67 26 60 21" fill="none" stroke="#3a3248" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
        {/* Brillo del pelo */}
        <path d="M37 20 Q50 15 63 20" fill="none" stroke="#6a607a" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* Piel de la frente (suaviza transición pelo-cara) */}
        <ellipse cx="50" cy="48" rx="22" ry="7" fill={`url(#sk-${gid})`} />

        {/* ── Cejas ─────────────────────────────── */}
        <path d="M31 54 Q39 50 46 52" stroke="#2c1a0a" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M54 52 Q61 50 69 54" stroke="#2c1a0a" strokeWidth="2.3" strokeLinecap="round" fill="none" />

        {/* ── Ojo izquierdo ─────────────────────── */}
        <g style={{ animation: "af-blink 5s ease-in-out 1.8s infinite", transformOrigin: "38px 62px" }}>
          <ellipse cx="38" cy="62" rx="7"   ry="6.5" fill="white" />
          <ellipse cx="38" cy="63" rx="4.8" ry="4.8" fill="#5c3614" />
          <circle  cx="38" cy="63" r="2.9"            fill="#160800" />
          <circle  cx="39.8" cy="60.8" r="1.6"        fill="white" />
          <circle  cx="36.8" cy="64"   r="0.7"        fill={brandColor} opacity="0.35" />
        </g>
        {/* Máscara párpado izq */}
        <ellipse cx="38" cy="56" rx="8.5" ry="4.5" fill={`url(#sk-${gid})`} />

        {/* ── Ojo derecho ───────────────────────── */}
        <g style={{ animation: "af-blink 5s ease-in-out 1.8s infinite", transformOrigin: "62px 62px" }}>
          <ellipse cx="62" cy="62" rx="7"   ry="6.5" fill="white" />
          <ellipse cx="62" cy="63" rx="4.8" ry="4.8" fill="#5c3614" />
          <circle  cx="62" cy="63" r="2.9"            fill="#160800" />
          <circle  cx="63.8" cy="60.8" r="1.6"        fill="white" />
          <circle  cx="60.8" cy="64"   r="0.7"        fill={brandColor} opacity="0.35" />
        </g>
        {/* Máscara párpado der */}
        <ellipse cx="62" cy="56" rx="8.5" ry="4.5" fill={`url(#sk-${gid})`} />

        {/* ── Nariz ─────────────────────────────── */}
        <path d="M47 72 Q50 76 53 72" stroke="#c88050" strokeWidth="1.7" fill="none" strokeLinecap="round" opacity="0.5" />
        <ellipse cx="47.5" cy="72.5" rx="1.2" ry="0.8" fill="#c07040" opacity="0.22" />
        <ellipse cx="52.5" cy="72.5" rx="1.2" ry="0.8" fill="#c07040" opacity="0.22" />

        {/* ── Boca ──────────────────────────────── */}
        {isSpeaking ? (
          <ellipse
            cx="50" cy="81"
            rx="6.5" ry="3"
            fill="#b04030"
            style={{ animation: "af-talk 0.25s ease-in-out infinite alternate", transformOrigin: "50px 81px" }}
          />
        ) : (
          <>
            <path d="M42 79 Q50 87 58 79" stroke="#c06050" strokeWidth="2.3" strokeLinecap="round" fill="none" />
            <path d="M44 78 Q47 76 50 77 Q53 76 56 78"
              stroke="#d07868" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.5" />
          </>
        )}

        {/* ── Rubor mejillas ────────────────────── */}
        <ellipse cx="28" cy="71" rx="6.5" ry="4.5" fill="#f09090" opacity="0.12" />
        <ellipse cx="72" cy="71" rx="6.5" ry="4.5" fill="#f09090" opacity="0.12" />
      </svg>

      <style>{`
        @keyframes af-blink {
          0%, 86%, 100% { transform: scaleY(1); }
          88%            { transform: scaleY(0.07); }
          90%            { transform: scaleY(1); }
        }
        @keyframes af-talk {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.7); }
        }
      `}</style>
    </div>
  );
}
