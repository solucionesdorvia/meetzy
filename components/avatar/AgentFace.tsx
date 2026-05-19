"use client";

/**
 * AgentFace — avatar circular profesional para widget de chat.
 * brandColor → pelo, collar, acento visual de la marca del cliente.
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
  // Deterministic ID — sin hidratación mismatch
  const gid = brandColor.replace(/[^a-f0-9]/gi, "").slice(0, 6) || "brand";
  const hairMid   = brandColor;
  const hairLight = adjust(brandColor, 55);
  const hairDark  = adjust(brandColor, -45);
  const shirtDark = adjust(brandColor, -30);

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
          {/* Piel — gradiente radial con luz desde arriba-izquierda */}
          <radialGradient id={`sk-${gid}`} cx="38%" cy="32%" r="62%" gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%"   stopColor="#fde4c4" />
            <stop offset="55%"  stopColor="#f5c09a" />
            <stop offset="100%" stopColor="#e09870" />
          </radialGradient>

          {/* Pelo — gradiente con brillo en el centro-alto */}
          <radialGradient id={`hr-${gid}`} cx="50%" cy="22%" r="58%" gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%"   stopColor={hairLight} />
            <stop offset="60%"  stopColor={hairMid} />
            <stop offset="100%" stopColor={hairDark} />
          </radialGradient>

          {/* Ropa — degradado suave */}
          <linearGradient id={`sh-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={hairMid}  />
            <stop offset="100%" stopColor={hairDark} />
          </linearGradient>

          {/* Sombra bajo cara */}
          <radialGradient id={`sd-${gid}`} cx="50%" cy="50%" r="50%">
            <stop offset="70%"  stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
          </radialGradient>

          {/* Fondo suave con tinte de marca */}
          <radialGradient id={`bg-${gid}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor={adjust(brandColor, 195)} />
            <stop offset="100%" stopColor={adjust(brandColor, 170)} />
          </radialGradient>
        </defs>

        {/* ── Fondo ─────────────────────────────── */}
        <circle cx="50" cy="50" r="50" fill={`url(#bg-${gid})`} />

        {/* ── Ropa / camisa (fondo del cuello) ──── */}
        <path
          d="M0 84 Q18 74 38 76 L50 88 L62 76 Q82 74 100 84 L100 100 L0 100Z"
          fill={`url(#sh-${gid})`}
        />
        {/* Detalle solapa */}
        <path
          d="M38 77 Q44 84 50 88 Q56 84 62 77"
          fill="none" stroke={shirtDark} strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.5"
        />

        {/* ── Cuello ────────────────────────────── */}
        <path d="M43 76 Q50 82 57 76 L57 86 L43 86Z" fill="#e8a070" />

        {/* ── Pelo (capa trasera, da volumen) ───── */}
        <ellipse cx="50" cy="30" rx="30" ry="27" fill={`url(#hr-${gid})`} />

        {/* ── Orejas ────────────────────────────── */}
        <ellipse cx="24" cy="57" rx="5.5" ry="7"   fill="#f0a870" />
        <ellipse cx="25.5" cy="57" rx="3"   ry="4.5" fill="#e09060" />
        <ellipse cx="76" cy="57" rx="5.5" ry="7"   fill="#f0a870" />
        <ellipse cx="74.5" cy="57" rx="3"   ry="4.5" fill="#e09060" />

        {/* ── Cara ──────────────────────────────── */}
        <ellipse cx="50" cy="57" rx="25" ry="28" fill={`url(#sk-${gid})`} />
        {/* Sombra perimetral sutil */}
        <ellipse cx="50" cy="57" rx="25" ry="28" fill={`url(#sd-${gid})`} />

        {/* ── Pelo frontal (franja/hairline) ─────── */}
        {/* Masa principal de pelo en la parte superior */}
        <ellipse cx="50" cy="29" rx="29" ry="21" fill={`url(#hr-${gid})`} />
        {/* Hairline suavizado */}
        <path
          d="M24 42 C26 34 35 28 50 26 C65 28 74 34 76 42 C68 48 58 46 50 46 C42 46 32 48 24 42Z"
          fill={`url(#hr-${gid})`}
        />
        {/* Brillo del pelo */}
        <path
          d="M35 23 Q50 19 63 24"
          fill="none" stroke={hairLight} strokeWidth="3.5"
          strokeLinecap="round" opacity="0.55"
        />
        {/* Mechón lateral izquierdo */}
        <path
          d="M21 38 C20 44 22 52 24 58"
          fill="none" stroke={hairMid} strokeWidth="5"
          strokeLinecap="round" opacity="0.7"
        />
        {/* Mechón lateral derecho */}
        <path
          d="M79 38 C80 44 78 52 76 58"
          fill="none" stroke={hairMid} strokeWidth="5"
          strokeLinecap="round" opacity="0.7"
        />

        {/* ── Zona de frente (piel sobre hairline) ─ */}
        <ellipse cx="50" cy="46" rx="22" ry="7" fill={`url(#sk-${gid})`} />

        {/* ── Cejas ─────────────────────────────── */}
        <path d="M31 51 Q38 47 45 50" stroke="#6a3e18" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M55 50 Q62 47 69 51" stroke="#6a3e18" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* ── Ojos (grupo para animación blink) ─── */}
        {/* Ojo izquierdo */}
        <g style={{ animation: "af-blink 5s ease-in-out 1.8s infinite", transformOrigin: "38px 59px" }}>
          <ellipse cx="38" cy="59" rx="7.5" ry="7"   fill="white" />
          <ellipse cx="38" cy="60" rx="5"   ry="5"   fill="#6b3e18" />
          <circle  cx="38" cy="60" r="3"              fill="#1a0800" />
          <circle  cx="40" cy="57.8"        r="1.8"  fill="white" />
          <circle  cx="36.5" cy="61"        r="0.8"  fill={brandColor} opacity="0.4" />
        </g>
        {/* Máscara del párpado izquierdo */}
        <ellipse cx="38" cy="52" rx="8.5" ry="4" fill={`url(#sk-${gid})`} />

        {/* Ojo derecho */}
        <g style={{ animation: "af-blink 5s ease-in-out 1.8s infinite", transformOrigin: "62px 59px" }}>
          <ellipse cx="62" cy="59" rx="7.5" ry="7"   fill="white" />
          <ellipse cx="62" cy="60" rx="5"   ry="5"   fill="#6b3e18" />
          <circle  cx="62" cy="60" r="3"              fill="#1a0800" />
          <circle  cx="64" cy="57.8"        r="1.8"  fill="white" />
          <circle  cx="60.5" cy="61"        r="0.8"  fill={brandColor} opacity="0.4" />
        </g>
        {/* Máscara del párpado derecho */}
        <ellipse cx="62" cy="52" rx="8.5" ry="4" fill={`url(#sk-${gid})`} />

        {/* ── Nariz ─────────────────────────────── */}
        <path d="M47 70 Q50 74 53 70" stroke="#c88850" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
        <ellipse cx="47.5" cy="70.5" rx="1.2" ry="0.8" fill="#c07040" opacity="0.3" />
        <ellipse cx="52.5" cy="70.5" rx="1.2" ry="0.8" fill="#c07040" opacity="0.3" />

        {/* ── Boca ──────────────────────────────── */}
        {isSpeaking ? (
          <ellipse
            cx="50" cy="78"
            rx="7" ry="3.5"
            fill="#b05030"
            style={{ animation: "af-talk 0.25s ease-in-out infinite alternate", transformOrigin: "50px 78px" }}
          />
        ) : (
          <>
            {/* Sonrisa */}
            <path d="M41 76 Q50 86 59 76" stroke="#b85040" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Labio superior sutil */}
            <path d="M43 75.5 Q47 73.5 50 74.5 Q53 73.5 57 75.5"
              stroke="#c87060" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
          </>
        )}

        {/* ── Rubor mejillas ────────────────────── */}
        <ellipse cx="27" cy="68" rx="7" ry="4.5" fill="#f09090" opacity="0.15" />
        <ellipse cx="73" cy="68" rx="7" ry="4.5" fill="#f09090" opacity="0.15" />

        {/* ── Punto de acento de marca (iris tintado) ya incluido arriba ─ */}
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
