import Link from "next/link";

export const metadata = {
  title: "Política de privacidad | Meetzy",
  description: "Cómo Meetzy recopila, usa y protege tu información y la de los visitantes de tu sitio.",
};

export default function PrivacyPage() {
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
          Política de privacidad
        </h1>
        <p className="text-[var(--text-tertiary)] text-sm mb-10">
          Última actualización: enero 2026
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">1. Información que recopilamos</h2>
            <p>Cuando usás Meetzy como cliente (creando agentes), recopilamos: tu email, nombre de cuenta, URL del sitio web, configuración del agente, color de marca, logo opcional, y conversaciones generadas por tus visitantes.</p>
            <p className="mt-3">Cuando un visitante interactúa con un agente Meetzy instalado en un sitio, recopilamos: identificador anónimo (visitorId en localStorage), ruta de páginas visitadas, secciones miradas, intent inferido (clasificación de intención de compra), email solo si el visitante lo proporciona voluntariamente.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">2. Cómo usamos la información</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Para proveer el servicio del chatbot y mostrar respuestas contextuales</li>
              <li>Para generar analíticas en el dashboard del cliente (cantidad de conversaciones, intents, leads)</li>
              <li>Para mejorar la calidad de las respuestas del agente</li>
              <li>Nunca vendemos datos personales a terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">3. Procesadores externos</h2>
            <p>Meetzy usa servicios de terceros para operar:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>OpenAI</strong> — procesamiento de mensajes de chat (no se entrena ningún modelo con tus datos)</li>
              <li><strong>fal.ai</strong> — generación de avatares con IA (solo el prompt y el logo si lo subís)</li>
              <li><strong>Cloudinary</strong> — almacenamiento de imágenes de avatar</li>
              <li><strong>Clerk</strong> — autenticación</li>
              <li><strong>Railway</strong> — hosting de la aplicación</li>
            </ul>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">4. Cookies y tracking</h2>
            <p>El widget Meetzy usa <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-xs">localStorage</code> para identificar visitantes recurrentes (no cookies). Se almacena un ID anónimo aleatorio sin información personal. Los visitantes pueden borrarlo desde su navegador en cualquier momento.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">5. Tus derechos</h2>
            <p>Como cliente o visitante, podés:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Solicitar acceso a los datos que tenemos sobre vos</li>
              <li>Pedir la corrección o eliminación de tus datos</li>
              <li>Exportar tus conversaciones</li>
              <li>Cancelar tu cuenta y eliminar todos tus datos</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contactanos en{" "}
              <a href="mailto:hola@meetzy.io" className="text-[var(--accent)] hover:underline">hola@meetzy.io</a>.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">6. Cambios a esta política</h2>
            <p>Si actualizamos esta política, vamos a notificar a los clientes activos por email con al menos 30 días de anticipación.</p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-[var(--text-primary)] mb-3">7. Contacto</h2>
            <p>
              Para cualquier consulta sobre privacidad escribinos a{" "}
              <a href="mailto:hola@meetzy.io" className="text-[var(--accent)] hover:underline">hola@meetzy.io</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
