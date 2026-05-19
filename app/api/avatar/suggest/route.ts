import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbUser } from "@/lib/auth";
import { getOpenAI, isOpenAIConfigured } from "@/lib/openai";

const Schema = z.object({
  businessName: z.string().min(1).max(120),
  businessDescription: z.string().max(500).optional(),
});

export type CharacterSuggestion = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  archetype: string;
  promptHint: string;
  gradientFrom: string;
  gradientTo: string;
};

const FALLBACK_SUGGESTIONS: CharacterSuggestion[] = [
  { id: "human_male",   emoji: "🧑", title: "Profesional masculino", description: "Clásico, confiable. Ideal para cualquier rubro.", archetype: "human_male",   promptHint: "professional, confident smile, business casual",              gradientFrom: "#6366f1", gradientTo: "#4338ca" },
  { id: "human_female", emoji: "👩", title: "Profesional femenina",  description: "Accesible y moderna. Excelente para servicios.",   archetype: "human_female", promptHint: "professional, warm smile, business casual",                 gradientFrom: "#ec4899", gradientTo: "#be185d" },
  { id: "dog",          emoji: "🐶", title: "Perro amigable",         description: "Transmite calidez y cercanía.",                    archetype: "dog",          promptHint: "cute anthropomorphic friendly dog, expressive eyes",         gradientFrom: "#f59e0b", gradientTo: "#b45309" },
  { id: "cat",          emoji: "🐱", title: "Gato elegante",          description: "Sofisticado y memorable.",                         archetype: "cat",          promptHint: "sleek anthropomorphic cat, elegant pose",                   gradientFrom: "#8b5cf6", gradientTo: "#6d28d9" },
  { id: "rocket",       emoji: "🚀", title: "Cohete",                 description: "Dinámico y futurista. Ideal para tech/startups.",  archetype: "rocket",       promptHint: "cute rocket mascot with friendly face on the window",        gradientFrom: "#0ea5e9", gradientTo: "#0369a1" },
  { id: "star",         emoji: "⭐", title: "Estrella",               description: "Brillante y positivo. Universal.",                 archetype: "star",         promptHint: "cute golden star mascot with arms and expressive face",      gradientFrom: "#f97316", gradientTo: "#c2410c" },
];

export async function POST(req: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { businessName, businessDescription } = parsed.data;

    if (!isOpenAIConfigured()) {
      return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
    }

    const openai = getOpenAI();
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Sos un experto en identidad de marca y diseño de mascots para empresas latinoamericanas.
Tu tarea: dado el nombre y descripción de un negocio, sugerís 6 personajes ideales para su avatar de IA conversacional.
Respondé siempre en JSON con esta estructura exacta:
{
  "suggestions": [
    {
      "id": string (snake_case único),
      "emoji": string (un emoji representativo),
      "title": string (nombre del personaje en español, max 30 chars),
      "description": string (por qué encaja con este negocio, max 80 chars, en rioplatense),
      "archetype": string (uno de: human_male, human_female, dog, cat, rabbit, fox, panda, bear, orange, apple, cup, star, rocket, diamond),
      "promptHint": string (frase descriptiva en inglés para el prompt de imagen, max 100 chars),
      "gradientFrom": string (color hex que represente al personaje),
      "gradientTo": string (color hex más oscuro/complementario)
    }
  ]
}
Reglas:
- Siempre incluí al menos una opción humana (masculina o femenina) y una animal/objeto
- El personaje más sugerido debe ir primero
- Pensá en el rubro y usá personajes que tengan sentido cultural para Argentina
- Para salud/vet: perro/gato/persona con guardapolvo
- Para tech/startup: robot/cohete/estrella
- Para comida/café: taza/fruta/persona chef
- Para legal/finanzas: persona profesional
- Para educación: persona, libro, estrella
- Los prompts en inglés deben ser descriptivos del personaje específico`,
        },
        {
          role: "user",
          content: `Negocio: "${businessName}"${businessDescription ? `\nDescripción: ${businessDescription}` : ""}
Sugerí 6 personajes únicos e ideales para el avatar de IA de este negocio.`,
        },
      ],
      max_tokens: 1200,
    });

    const text = res.choices[0]?.message?.content ?? "{}";
    const parsed2 = JSON.parse(text) as { suggestions?: CharacterSuggestion[] };
    const raw = parsed2.suggestions ?? FALLBACK_SUGGESTIONS;

    // Sanitize: map any invalid archetype to the closest valid one
    const VALID_ARCHETYPES = new Set([
      "human_male", "human_female", "dog", "cat", "rabbit", "fox",
      "panda", "bear", "orange", "apple", "cup", "star", "rocket", "diamond",
    ]);
    const ARCHETYPE_MAP: Record<string, string> = {
      robot: "rocket", human: "human_male", woman: "human_female",
      man: "human_male", girl: "human_female", boy: "human_male",
      wolf: "fox", lion: "bear", tiger: "cat", bird: "star",
      fish: "dog", owl: "cat", penguin: "panda", koala: "panda",
      fox_animal: "fox", bunny: "rabbit",
    };
    const suggestions = raw.map((s) => ({
      ...s,
      archetype: VALID_ARCHETYPES.has(s.archetype)
        ? s.archetype
        : (ARCHETYPE_MAP[s.archetype] ?? "rocket"),
    }));

    return NextResponse.json({ suggestions: suggestions.slice(0, 6) });
  } catch (e) {
    console.error("[avatar/suggest]", e);
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
}
