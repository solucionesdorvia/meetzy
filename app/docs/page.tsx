"use client";

import { useState } from "react";
import Link from "next/link";

const EMBED_SNIPPET = `<!-- Meetzy — pegá antes de </body> -->
<script>
  window.MEETZYCONFIG = { siteId: "TU_SITE_ID" };
</script>
<script src="https://app.meetzy.ai/widget.js" async></script>`;

const DATA_SECTION_SNIPPET = `<section data-section="precios">
  <!-- contenido -->
</section>`;

const CSP_SNIPPET = `script-src https://app.meetzy.ai;
connect-src https://app.meetzy.ai`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="relative rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-overlay)] overflow-hidden">
      <button
        onClick={copy}
        className="absolute right-3 top-3 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        {copied ? "✓ Copiado" : "Copiar"}
      </button>
      <pre className="overflow-x-auto p-4 pr-16 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-secondary)" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

type Tab = "dev" | "nocode";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dev");

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-surface)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "3rem 1rem 5rem",
        }}
      >
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--text-tertiary)",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          ← Volver al inicio
        </Link>

        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            Documentación
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.65 }}>
            Todo lo que necesitás saber para instalar el widget de Meetzy en tu sitio.
          </p>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "2.5rem",
          }}
        >
          {(
            [
              { id: "dev" as Tab, label: "Para programadores" },
              { id: "nocode" as Tab, label: "Sin código" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === id ? "2px solid var(--accent)" : "2px solid transparent",
                padding: "0.625rem 1.125rem",
                cursor: "pointer",
                fontSize: "0.9375rem",
                fontWeight: activeTab === id ? 600 : 400,
                color: activeTab === id ? "var(--accent)" : "var(--text-secondary)",
                fontFamily: "var(--font-dm-sans)",
                marginBottom: "-1px",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Para programadores ── */}
        {activeTab === "dev" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              El widget de Meetzy se instala con dos etiquetas{" "}
              <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                &lt;script&gt;
              </code>{" "}
              que pegás antes del cierre del{" "}
              <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                &lt;body&gt;
              </code>
              . El proceso completo tarda menos de dos minutos.
            </p>

            {/* Step 1 */}
            <section>
              <StepHeading number={1} title="Obtené tu siteId" />
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "0.625rem", marginBottom: 0 }}>
                Ingresá al{" "}
                <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                  dashboard
                </Link>{" "}
                y abrí la pestaña <strong style={{ color: "var(--text-primary)" }}>Instalación</strong>. Ahí vas a encontrar tu{" "}
                <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                  siteId
                </code>{" "}
                único para ese sitio.
              </p>
            </section>

            {/* Step 2 */}
            <section>
              <StepHeading number={2} title="Pegá el snippet" />
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "0.625rem", marginBottom: "1rem" }}>
                Reemplazá{" "}
                <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                  TU_SITE_ID
                </code>{" "}
                por el valor que obtuviste en el paso anterior y pegá el bloque completo justo antes del cierre de{" "}
                <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                  &lt;/body&gt;
                </code>
                .
              </p>
              <CodeBlock code={EMBED_SNIPPET} />
            </section>

            {/* Step 3 */}
            <section>
              <StepHeading number={3} title="Publicá y verificá" />
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "0.625rem", marginBottom: 0 }}>
                Guardá los cambios y publicá tu sitio. Luego recargá la página y buscá la burbuja de Meetzy en la esquina inferior derecha. Si aparece, la instalación fue exitosa.
              </p>
            </section>

            {/* Advanced options */}
            <section
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                }}
              >
                Opciones avanzadas
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* data-section */}
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Atributo{" "}
                    <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--accent)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                      data-section
                    </code>
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
                    Podés agregar el atributo{" "}
                    <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.85em", color: "var(--text-primary)", background: "var(--bg-elevated)", padding: "1px 5px", borderRadius: 4 }}>
                      data-section
                    </code>{" "}
                    a cualquier elemento HTML. El agente detecta en qué sección está el visitante y responde con más contexto, mejorando la relevancia de las respuestas automáticamente.
                  </p>
                  <CodeBlock code={DATA_SECTION_SNIPPET} />
                </div>

                {/* CSP */}
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Content Security Policy
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
                    Si tu sitio usa CSP, agregá las siguientes directivas para que el widget y sus conexiones funcionen correctamente:
                  </p>
                  <CodeBlock code={CSP_SNIPPET} />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── Sin código ── */}
        {activeTab === "nocode" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Sin tocar código, podés instalar Meetzy en minutos en cualquier plataforma. Seguí las instrucciones de tu herramienta a continuación.
            </p>

            <PlatformSection title="WordPress">
              <ol style={olStyle}>
                <li>Ingresá al panel de administración de WordPress.</li>
                <li>
                  Andá a <strong>Apariencia → Editor de temas</strong> (o usá un plugin como{" "}
                  <em>Insert Headers and Footers</em>).
                </li>
                <li>
                  Si usás el editor de temas, buscá el archivo <strong>footer.php</strong> y pegá el snippet antes de la etiqueta{" "}
                  <code style={inlineCode}>&lt;/body&gt;</code>.
                </li>
                <li>
                  Si usás el plugin <em>Insert Headers and Footers</em>, pegá el snippet en la sección <strong>Scripts in Footer</strong>.
                </li>
                <li>Guardá los cambios y recargá tu sitio para verificar que la burbuja aparece.</li>
              </ol>
            </PlatformSection>

            <PlatformSection title="Wix">
              <ol style={olStyle}>
                <li>
                  En el editor de Wix, hacé clic en <strong>Configuración del sitio</strong> en el panel lateral.
                </li>
                <li>
                  Seleccioná <strong>Código personalizado</strong> y luego <strong>+ Agregar código personalizado</strong>.
                </li>
                <li>Pegá el snippet en el campo de código.</li>
                <li>
                  En <strong>Agregar código a</strong>, elegí <strong>Todas las páginas</strong>, y en <strong>Ubicar código en</strong>, elegí <strong>Body — fin</strong>.
                </li>
                <li>Hacé clic en <strong>Aplicar</strong> y publicá tu sitio.</li>
              </ol>
            </PlatformSection>

            <PlatformSection title="Squarespace">
              <ol style={olStyle}>
                <li>
                  En el panel de Squarespace, andá a <strong>Configuración → Avanzado → Inyección de código</strong>.
                </li>
                <li>
                  Pegá el snippet en el campo <strong>Footer</strong>.
                </li>
                <li>Hacé clic en <strong>Guardar</strong> y recargá tu sitio para verificar.</li>
              </ol>
            </PlatformSection>

            <PlatformSection title="Tiendanube">
              <ol style={olStyle}>
                <li>
                  Ingresá al panel de tu tienda y andá a <strong>Personalizar → Editar HTML/CSS</strong>.
                </li>
                <li>
                  Abrí el archivo <strong>layout.html</strong> (o el template base de tu tema).
                </li>
                <li>
                  Pegá el snippet antes del cierre de <code style={inlineCode}>&lt;/body&gt;</code>.
                </li>
                <li>Guardá los cambios y recargá tu tienda.</li>
              </ol>
            </PlatformSection>

            <PlatformSection title="Shopify">
              <ol style={olStyle}>
                <li>
                  En el panel de Shopify, andá a <strong>Tienda en línea → Temas</strong>.
                </li>
                <li>
                  Hacé clic en <strong>Acciones → Editar código</strong> en tu tema activo.
                </li>
                <li>
                  Buscá el archivo <strong>theme.liquid</strong> en la carpeta <em>Layout</em>.
                </li>
                <li>
                  Pegá el snippet antes del cierre de <code style={inlineCode}>&lt;/body&gt;</code>.
                </li>
                <li>Hacé clic en <strong>Guardar</strong> y recargá tu tienda.</li>
              </ol>
            </PlatformSection>

            {/* Fallback note */}
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "1.5rem",
              }}
            >
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "var(--text-primary)" }}>¿Tu plataforma no está?</strong>{" "}
                Cualquier herramienta que permita agregar código HTML personalizado en el footer funciona. Si tenés dudas,{" "}
                <a href="mailto:solucionesdorvia@gmail.com" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                  contactanos
                </a>{" "}
                y te ayudamos.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Helpers ── */

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-border)",
          color: "var(--accent)",
          fontSize: "0.8125rem",
          fontWeight: 700,
          flexShrink: 0,
          fontFamily: "var(--font-syne)",
        }}
      >
        {number}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "1.125rem",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function PlatformSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "1.125rem",
          fontWeight: 700,
          marginBottom: "0.875rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const olStyle: React.CSSProperties = {
  paddingLeft: "1.5rem",
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  color: "var(--text-secondary)",
  lineHeight: 1.7,
};

const inlineCode: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains)",
  fontSize: "0.85em",
  color: "var(--text-primary)",
  background: "var(--bg-elevated)",
  padding: "1px 5px",
  borderRadius: 4,
};
