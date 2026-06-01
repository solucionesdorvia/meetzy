import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://meetzy-production.up.railway.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/docs"],
        disallow: ["/dashboard", "/dashboard/", "/api/", "/admin", "/admin/", "/sign-in", "/sign-up", "/auth/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
