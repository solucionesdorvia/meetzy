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
    "Tu agente IA sabe qué vieron, qué los frenó y qué les interesó. Convierte en el momento — y cuando no, tenés todo para el seguimiento. Setup en 10 minutos, sin código.",
  openGraph: {
    title: "Meetzy — El agente que los conoce antes de que hablen",
    description: "Tu agente sabe qué páginas visitaron, qué los frenó y qué les interesó. Convierte en el momento — y cuando no, tenés todo para el seguimiento posterior.",
    url: "https://meetzy.ai",
    siteName: "Meetzy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meetzy — El agente que los conoce antes de que hablen",
    description: "Tu agente sabe qué páginas visitaron, qué los frenó y qué les interesó. Convierte en el momento — y cuando no, tenés todo para el seguimiento posterior.",
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
