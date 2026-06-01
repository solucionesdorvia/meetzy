import Link from "next/link";

export const metadata = {
  title: "Términos y condiciones | Meetzy",
  description: "Términos de uso del servicio Meetzy y responsabilidades de los clientes.",
};

export default function TermsPage() {
  return (
    <main className="meetzy-product-ui min-h-screen" style={{ background: "var(--bg-base, #0a0a10)" }}>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-syne text-lg font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            MEET<span className="text-[var(--accent)]">ZY</span>
          </Link>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 text-[var(--text-primary)]">
        <h1 className="font-syne text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Términos y condiciones
        </h1>
        <p className="text-[var(--text-tertiary)] text-sm mb-10">
          Última actualización: enero 2026
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">1. Aceptación</h2>
            <p>Al crear una cuenta o instalar el widget en tu sitio, aceptás estos términos. Si no estás de acuerdo, no uses el servicio.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">2. Qué es Meetzy</h2>
            <p>Meetzy es una plataforma SaaS que permite incorporar un agente de inteligencia artificial conversacional en sitios web. El servicio incluye dashboard de gestión, analítica de conversaciones, generación de avatares con IA, y un widget instalable.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">3. Tu responsabilidad como cliente</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Mantener segura tu cuenta y contraseña</li>
              <li>No usar Meetzy para spam, contenido ilegal, fraude o engaño a tus visitantes</li>
              <li>Informar a tus visitantes que están interactuando con un agente IA cuando sea legalmente requerido</li>
              <li>Cumplir con las leyes de privacidad aplicables (GDPR, CCPA, LGPD) en tu jurisdicción</li>
              <li>Si recolectás emails u otra información de visitantes a través del agente, sos responsable de su almacenamiento y procesamiento</li>
            </ul>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">4. Uso aceptable</h2>
            <p>No podés usar Meetzy para:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Vender productos o servicios ilegales</li>
              <li>Suplantar identidades de marcas o personas sin autorización</li>
              <li>Generar avatares con contenido NSFW, violento u ofensivo</li>
              <li>Hacer scraping del servicio o intentar abusar de la API</li>
              <li>Sortear los límites del plan contratado</li>
            </ul>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">5. Disponibilidad del servicio</h2>
            <p>Hacemos lo mejor posible para mantener el servicio disponible 24/7, pero no garantizamos un uptime específico. Pueden ocurrir interrupciones por mantenimiento, dependencias externas (OpenAI, fal.ai, etc.), o causas mayores.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">6. Limitación de responsabilidad</h2>
            <p>Meetzy no se responsabiliza por:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Respuestas incorrectas o inexactas del agente IA (es un modelo probabilístico)</li>
              <li>Decisiones de negocio que tomes basadas en datos del dashboard</li>
              <li>Pérdida de datos por causas fuera de nuestro control</li>
              <li>Uso indebido del servicio por parte tuya o de terceros con acceso a tu cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">7. Cancelación</h2>
            <p>Podés cancelar tu cuenta en cualquier momento desde el dashboard. Al cancelar, los widgets instalados dejarán de funcionar y tus datos se eliminarán en un plazo máximo de 30 días.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">8. Modificaciones</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Te avisaremos por email con al menos 30 días de anticipación si los cambios son sustanciales.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">9. Contacto</h2>
            <p>
              Consultas sobre estos términos:{" "}
              <a href="mailto:hola@meetzy.io" className="text-[var(--accent)] hover:underline">hola@meetzy.io</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
