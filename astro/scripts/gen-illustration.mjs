#!/usr/bin/env node
/**
 * Generate an editorial illustration for a content page, and record how.
 *
 * Why this is in the repo rather than a one-off: every image on this site is a
 * *claim* about something, and this site's whole posture is that claims carry a
 * source and a date. A generated illustration is a claim of a different kind —
 * it is a metaphor, not a measurement — so it needs the same discipline: a
 * prompt file under version control, a model name, a seed, and a caption on the
 * page that says out loud that it was generated.
 *
 * The image side is an OpenAI-compatible /v1/images/generations call, the same
 * arrangement copero uses (its `scripts/lib/siliconflow.mjs`): SiliconFlow as the
 * provider, FLUX.1-schnell as the default model, FLUX.2-pro when a page needs a
 * signature image. Copero's verdict on that split, copied here deliberately:
 * schnell is the best cost/quality trade for bulk, pro is for large one-offs.
 *
 * The key is never in this repo. Pass one of:
 *   --env-file ~/mycodex/copero/.env     (reads SILICONFLOW_API_KEY from it)
 *   SILICONFLOW_API_KEY=... in the environment
 *
 * Usage:
 *   node scripts/gen-illustration.mjs --list
 *   node scripts/gen-illustration.mjs --preset jev-hero --env-file ~/mycodex/copero/.env
 *   node scripts/gen-illustration.mjs --all --env-file ... --dry-run
 *
 * Writes webp (sharp, quality 82) next to the path in the preset, plus an entry
 * in public/img/illustrations.json recording prompt hash, model, seed and date —
 * so the page can state where the picture came from without a second copy of it.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ASTRO = resolve(here, "..");
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const MODEL_IDS = {
  // FLUX.1-schnell is no longer served (2026-09-22): the id is absent from
  // /v1/models and a request for it has the connection dropped rather than
  // answered. FLUX.2-flex is the current bulk model; pro stays for signature art.
  flex: "black-forest-labs/FLUX.2-flex",
  schnell: "black-forest-labs/FLUX.1-schnell",
  "flux2-pro": "black-forest-labs/FLUX.2-pro",
  "z-image-turbo": "Tongyi-MAI/Z-Image-Turbo",
  "qwen-image": "Qwen/Qwen-Image",
};

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1] ?? true;
};

const presets = JSON.parse(await readFile(join(here, "illustrations.json"), "utf8"));

if (args.includes("--list")) {
  for (const [name, p] of Object.entries(presets.presets)) {
    console.log(`${name.padEnd(18)} ${p.model.padEnd(10)} ${p.size.padEnd(10)} → ${p.out}`);
    console.log(`${"".padEnd(18)} ${p.scene.slice(0, 96)}…`);
  }
  process.exit(0);
}

const wanted = args.includes("--all")
  ? Object.keys(presets.presets)
  : [flag("preset")].filter(Boolean);
if (!wanted.length) {
  console.error("nothing to do: pass --preset <name> or --all (see --list)");
  process.exit(1);
}

const envFile = flag("env-file");
if (envFile) {
  const p = envFile.replace(/^~/, process.env.HOME ?? "~");
  if (!existsSync(p)) throw new Error(`--env-file not found: ${p}`);
  for (const line of (await readFile(p, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const key = process.env.SILICONFLOW_API_KEY;
const base = process.env.SILICONFLOW_BASE || "https://api.siliconflow.com";
const dryRun = args.includes("--dry-run");
if (!dryRun && !key) {
  throw new Error("no SILICONFLOW_API_KEY (pass --env-file or set the variable)");
}

const manifestPath = join(ASTRO, "public/img/illustrations.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(await readFile(manifestPath, "utf8"))
  : {};

for (const name of wanted) {
  const preset = presets.presets[name];
  if (!preset) throw new Error(`no preset named ${name}`);
  // A preset may carry its own style (used for style candidates, where the scene is
  // held constant and only the manner changes). Otherwise the house style applies.
  const style = preset.style ?? presets.style;
  const prompt = `${preset.scene} ${style}`;
  const model = MODEL_IDS[preset.model] ?? preset.model;
  const out = join(ASTRO, preset.out);
  const record = {
    preset: name,
    model,
    size: preset.size,
    seed: preset.seed,
    promptSha256: createHash("sha256").update(prompt).digest("hex").slice(0, 16),
    file: preset.out.replace(/^public\//, ""),
  };
  if (dryRun) {
    console.log(`[dry] ${name}: ${model} ${preset.size} seed=${preset.seed} → ${preset.out}`);
    continue;
  }
  const started = Date.now();
  const res = await fetch(`${base}/v1/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, image_size: preset.size, seed: preset.seed }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${name} failed (${res.status}): ${JSON.stringify(json).slice(0, 300)}`);
  const url = json?.images?.[0]?.url;
  if (!url) throw new Error(`${name}: no image URL in ${JSON.stringify(json).slice(0, 200)}`);
  // The URL is valid for about an hour, so download it now.
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  await mkdir(dirname(out), { recursive: true });
  const webp = await sharp(bytes).webp({ quality: 82 }).toBuffer();
  await writeFile(out, webp);
  manifest[record.file] = { ...record, generatedAt: new Date().toISOString().slice(0, 10) };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `ok ${name}: ${preset.out}  ${(webp.length / 1024).toFixed(0)} KB webp ` +
      `(from ${(bytes.length / 1024).toFixed(0)} KB png)  ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}
