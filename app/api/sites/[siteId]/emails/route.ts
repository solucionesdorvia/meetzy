import { NextRequest, NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(s: string): string {
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    const { siteId: publicSiteId } = await params;
    const site = await prisma.site.findFirst({
      where: { siteId: publicSiteId, userId: dbUser.id },
    });
    if (!site) return NextResponse.json({ error: "Sitio no encontrado." }, { status: 404 });

    const format = req.nextUrl.searchParams.get("format");
    const isExport = format === "csv";
    const rows = await prisma.conversation.findMany({
      where: { siteId: site.id, visitorEmail: { not: null } },
      orderBy: { updatedAt: "desc" },
      take: isExport ? 5000 : 500,
      select: {
        visitorEmail: true,
        visitorName: true,
        visitorCompany: true,
        intentScore: true,
        intentLabel: true,
        updatedAt: true,
      },
    });

    if (isExport) {
      const header = "email,name,company,intentScore,intentLabel,capturedAt";
      const lines = rows
        .filter((r) => r.visitorEmail)
        .map((r) =>
          [
            csvEscape(r.visitorEmail ?? ""),
            csvEscape(r.visitorName ?? ""),
            csvEscape(r.visitorCompany ?? ""),
            String(r.intentScore),
            csvEscape(r.intentLabel),
            r.updatedAt.toISOString(),
          ].join(","),
        );
      const body = [header, ...lines].join("\n");
      return new NextResponse(body, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="meetzy-emails-${publicSiteId}.csv"`,
        },
      });
    }

    return NextResponse.json({
      items: rows.filter((r) => r.visitorEmail).map((r) => ({
        email: r.visitorEmail,
        name: r.visitorName,
        company: r.visitorCompany,
        intentScore: r.intentScore,
        intentLabel: r.intentLabel,
        capturedAt: r.updatedAt,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno. Intentá de nuevo." }, { status: 500 });
  }
}
