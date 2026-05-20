import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import SiteSettingsForm from "@/components/dashboard/SiteSettingsForm";
import SiteSubnav from "@/components/dashboard/SiteSubnav";

export const metadata = { title: "Configuración" };

export default async function SiteSettingsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const dbUser = await getDbUser();
  if (!dbUser) redirect("/sign-in");

  const { siteId } = await params;
  const site = await prisma.site.findFirst({ where: { siteId, userId: dbUser.id } });
  if (!site) notFound();

  return (
    <div className="w-full">
      <SiteSubnav
        siteId={siteId}
        siteName={site.name}
        active="settings"
        pageTitle="Configuración"
        description="Identidad, instrucciones, colores de marca e integraciones."
      />

      <SiteSettingsForm site={site} />
    </div>
  );
}
