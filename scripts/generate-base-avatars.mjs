/**
 * Generates the 8 Meetzy base avatars (2 genders × 4 agent types)
 * and saves them to public/avatars/.
 *
 * Run once:  node scripts/generate-base-avatars.mjs
 * Requires:  FAL_KEY in .env.local
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, "..");

// Load .env.local manually
const envPath = join(root, ".env.local");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("❌  FAL_KEY not found in .env.local");
  process.exit(1);
}

const STYLE_BASE = [
  "3D cartoon character, Duolingo style, expressive and friendly,",
  "high quality render, soft neutral lighting,",
  "transparent background, isolated on transparent, no background, no backdrop,",
  "cut-out character subject only, alpha channel, PNG format,",
  "centered composition, big expressive eyes, smooth glossy textures,",
  "waist-up portrait, slightly angled pose, friendly confident expression,",
  "clean empty chest area (no prints, no text on fabric — reserved for logo overlay),",
  "brand color shirt/top in deep violet #7c6cff.",
].join(" ");

const GENDER_BASE = {
  male:   "young friendly male mascot character,",
  female: "young friendly female mascot character, with feminine features and hairstyle,",
};

const AGENT_TYPE_MODIFIERS = {
  vendedor:
    "confident sales professional, well-groomed hair, subtle tie clip or lapel pin visible at collar, charming engaging smile, business-casual look,",
  guia:
    "approachable curious guide, small wireless earpiece on one ear, open attentive expression, casual-smart look,",
  soporte:
    "tech-savvy support specialist, small bluetooth headset clearly visible on ear, calm helpful expression, casual tech style,",
  recepcionista:
    "polished front-desk professional, neat well-groomed appearance, warm welcoming smile, subtle elegant accessory at ear, formal-friendly style,",
};

const TARGETS = [
  { gender: "male",   agentType: "vendedor"      },
  { gender: "male",   agentType: "guia"          },
  { gender: "male",   agentType: "soporte"       },
  { gender: "male",   agentType: "recepcionista" },
  { gender: "female", agentType: "vendedor"      },
  { gender: "female", agentType: "guia"          },
  { gender: "female", agentType: "soporte"       },
  { gender: "female", agentType: "recepcionista" },
];

async function runFlux(prompt) {
  const res = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "square_hd",
      num_inference_steps: 8,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "png",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal queue submit failed: ${res.status} ${text}`);
  }

  const { request_id, response_url } = await res.json();
  console.log(`   queued → ${request_id}`);

  // Poll until done
  const pollUrl = response_url ?? `https://queue.fal.run/fal-ai/flux/schnell/requests/${request_id}`;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const poll = await fetch(pollUrl, {
      headers: { Authorization: `Key ${FAL_KEY}` },
    });
    if (!poll.ok) continue;
    const body = await poll.json();
    if (body.status === "COMPLETED" || body.images) {
      const imgUrl = body.images?.[0]?.url ?? body.output?.images?.[0]?.url;
      if (imgUrl) return imgUrl;
    }
    if (body.status === "FAILED") throw new Error("fal generation failed");
    process.stdout.write(".");
  }
  throw new Error("Timeout waiting for fal result");
}

async function downloadPng(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log(`🎨  Generating ${TARGETS.length} Meetzy base avatars…\n`);

  for (const { gender, agentType } of TARGETS) {
    const filename = `${gender}_${agentType}.png`;
    const outPath  = join(root, "public", "avatars", filename);

    if (existsSync(outPath)) {
      console.log(`⏭️   ${filename} already exists — skip (delete to regenerate)`);
      continue;
    }

    const prompt = [
      STYLE_BASE,
      GENDER_BASE[gender],
      AGENT_TYPE_MODIFIERS[agentType],
      "single character, no text, no watermarks, no background.",
    ].join(" ");

    console.log(`\n▶  ${filename}`);
    console.log(`   prompt: ${prompt.slice(0, 120)}…`);

    try {
      const imgUrl = await runFlux(prompt);
      console.log(`\n   ✓ image ready: ${imgUrl.slice(0, 60)}…`);
      const buf = await downloadPng(imgUrl);
      writeFileSync(outPath, buf);
      console.log(`   💾 saved → public/avatars/${filename}`);
    } catch (err) {
      console.error(`\n   ❌ ${filename}: ${err.message}`);
    }
  }

  console.log("\n✅  Done. Run `npm run dev` and check the avatars in the dashboard.");
}

main();
