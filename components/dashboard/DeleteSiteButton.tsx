"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProductToast } from "@/components/providers/product-toast";
import { ConfirmAction } from "@/components/ui/confirm-action";

type DeleteSiteButtonProps = {
  /** `siteId` público del widget (slug en URL del dashboard). */
  siteId: string;
  siteName: string;
  /** `card`: refresca la lista. `page`: vuelve al dashboard. */
  variant?: "card" | "page";
  className?: string;
};

export default function DeleteSiteButton({
  siteId,
  siteName,
  variant = "page",
  className = "",
}: DeleteSiteButtonProps) {
  const router = useRouter();
  const { push } = useProductToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        push(data.error ?? "No se pudo eliminar el sitio", "error");
        return;
      }
      push(`"${siteName}" eliminado`, "success");
      if (variant === "card") {
        router.refresh();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      push("Error de red al eliminar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConfirmAction
      label="Eliminar sitio"
      confirmLabel="¿Confirmar eliminación?"
      onConfirm={handleDelete}
      loading={loading}
      className={`text-sm font-medium ${className}`}
    />
  );
}
