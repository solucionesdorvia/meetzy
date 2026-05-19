import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import AvatarCreatorWizard from "@/components/avatar/AvatarCreatorWizard";
import AgentAvatar from "@/components/avatar/AgentAvatar";
import SiteSubnav from "@/components/dashboard/SiteSubnav";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Avatar" };

export default async function AvatarPage({ params }: { params: Promise<{ siteId: string }> }) {
  const dbUser = await getDbUser();
  if (!dbUser) redirect("/sign-in");

  const { siteId } = await params;
  const site = await prisma.site.findFirst({ where: { siteId, userId: dbUser.id } });
  if (!site) notFound();

  const isPro = dbUser.plan === "pro" || dbUser.plan === "elite";

  // Preview personas for the lock screen — use the site's brand color
  const brandColor = site.brandColor || "#6366f1";
  const brandColor2 = site.brandColor2 || "#4338ca";

  const lockPreviews = [
    { gender: "male" as const,   agentType: "soporte",       label: "Soporte",       color: brandColor,  color2: brandColor2 },
    { gender: "female" as const, agentType: "vendedor",      label: "Vendedor",      color: "#f97316",   color2: "#ea580c"   },
    { gender: "male" as const,   agentType: "recepcionista", label: "Recepcionista", color: "#a855f7",   color2: "#9333ea"   },
  ];

  return (
    <div>
      <SiteSubnav siteId={siteId} siteName={site.name} active="avatar" pageTitle="Avatar" />

      {!isPro ? (
        <div className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center px-4 py-10">

          {/* Section label */}
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Personajes disponibles en Pro
          </p>

          {/* Avatar previews using real AgentAvatar SVGs */}
          <div className="mb-10 flex items-end gap-4">
            {lockPreviews.map((a, idx) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-3"
                style={{
                  opacity: idx === 1 ? 1 : 0.7,
                  transform: idx === 1 ? "scale(1.12)" : "scale(0.95)",
                  transition: "transform 300ms ease",
                }}
              >
                <div
                  className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 shadow-[var(--shadow-md)]"
                  style={{
                    boxShadow: idx === 1
                      ? `0 0 32px ${a.color}25, var(--shadow-md)`
                      : undefined,
                  }}
                >
                  <AgentAvatar
                    size={72}
                    gender={a.gender}
                    agentType={a.agentType}
                    brandColor={a.color}
                    brandColor2={a.color2}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Lock card */}
          <div
            className="w-full max-w-[440px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--accent-border)] p-8 text-center"
            style={{
              background: "linear-gradient(160deg, rgba(99,102,241,0.10) 0%, var(--bg-elevated) 60%)",
              boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 12px 40px rgba(0,0,0,0.35)",
            }}
          >
            {/* Icon */}
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[0_0_32px_rgba(99,102,241,0.4)]">
              <Sparkles className="size-6 text-white" aria-hidden />
            </div>

            <h3 className="font-syne text-[22px] font-bold tracking-tight text-[var(--text-primary)]">
              Avatar con IA — Plan Pro
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Generá un personaje único con inteligencia artificial adaptado a tu marca —
              tu color, tu logo y tu estilo. El plan Starter sigue funcionando con hombre o mujer base.
            </p>

            {/* Feature chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { icon: "🎨", text: "Personaje único con IA" },
                { icon: "🌈", text: "Tu color de marca" },
                { icon: "🖼️", text: "Logo incluido" },
                { icon: "🎭", text: "6 estilos de tono" },
                { icon: "✨", text: "3 generaciones HD" },
                { icon: "🚀", text: "Preview rápido gratis" },
              ].map((f) => (
                <span
                  key={f.text}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--accent)]"
                >
                  <span>{f.icon}</span>
                  {f.text}
                </span>
              ))}
            </div>

            <Button asChild className="mt-8 gap-2 px-8 py-2.5 text-[13px] font-semibold shadow-[0_0_24px_rgba(99,102,241,0.3)]">
              <Link href="/pricing">
                <Sparkles className="size-4" />
                Ver planes Pro y Elite
              </Link>
            </Button>

            <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
              Sin contratos · Cancelá cuando quieras
            </p>
          </div>
        </div>
      ) : (
        <AvatarCreatorWizard
          site={{
            siteId: site.siteId,
            name: site.name,
            agentName: site.agentName,
            brandColor: site.brandColor,
            brandColor2: site.brandColor2,
            logoUrl: site.logoUrl,
            avatarImageUrl: site.avatarImageUrl,
            avatarGenerations: site.avatarGenerations,
          }}
        />
      )}
    </div>
  );
}
