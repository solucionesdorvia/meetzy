import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import AvatarShowcase from "@/components/landing/AvatarShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import LandingOrchestrator from "@/components/landing/LandingOrchestrator";
import WidgetDemo from "@/components/landing/WidgetDemo";
import Testimonials from "@/components/landing/Testimonials";
import TrustStrip from "@/components/landing/TrustStrip";
import { Stats, MidFunnelCTA } from "@/components/landing/LandingStats";

export const metadata: Metadata = {
  title: "Meetzy — Agentes IA para tu web, con tu marca",
  description:
    "Creá agentes IA personalizados para tu web en minutos. Con tu avatar, tus colores y tu contenido. Sin código — setup en 10 minutos.",
  openGraph: {
    title: "Meetzy — Agentes IA para tu web, con tu marca",
    description: "Creá un agente IA con tu marca y tu contenido. Lo embebés en tu web en minutos y convierte visitantes en clientes 24/7.",
    url: "https://meetzy.ai",
    siteName: "Meetzy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meetzy — Agentes IA para tu web, con tu marca",
    description: "Creá un agente IA con tu marca y tu contenido. Lo embebés en tu web en minutos y convierte visitantes en clientes 24/7.",
  },
};

export default function HomePage() {
  return (
    <main className="relative z-[1] min-h-screen w-full">
      <Navbar />
      <LandingOrchestrator />
      <WidgetDemo />
      <Stats />
      <Problem />
      <Testimonials />
      <TrustStrip />
      <Features />
      <UseCases />
      <AvatarShowcase />
      <HowItWorks />
      <MidFunnelCTA />
      <Pricing />
    </main>
  );
}
