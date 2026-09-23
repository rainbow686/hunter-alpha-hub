#!/usr/bin/env node
/**
 * Generate an editorial illustration for a content page, and record how.
 *
 * Why this is in the repo rather than a one-off: every image on this site is a
 * *claim* about something, and this site's whole posture is that claims carry a
 * source and a date. A generated illustration is a claim of a different kind —
 * it is a metaphor, not a measurement — so it needs the same discipline: a
 * prompt file under version control, a model name, and a seed.
 *
 * The page does *not* carry a caption saying the picture was generated (writing
 * style contract §5, 2026-09-22): the honesty comes from placement, a single
 * house style, and captions that say what the picture means. The provenance
 * lives here and in public/img/illustrations.json, for us, not for the reader.
 *
 * The three prompt blocks below are fixed by contract §6 and are composed for
 * every preset. The [NOT] block is load-bearing, not decoration: an image model
 * asked for "a stone with a mark on it" will draw characters — the guide cover
 * came back with a dozen garbled CJK glyphs before this block was added — and
 * lettering both looks broken and is the loudest available signal that the
 * picture was generated. Do not delete it.
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
 *   node scripts/gen-illustration.mjs --preset jev-hero --seed 20260930 --out /tmp/cand.webp
 *   node scripts/gen-illustration.mjs --all --env-file ... --dry-run
 *
 * The provider ignores the requested aspect ratio and always returns a square,
 * so a preset that wants 16:9 asks for frame "16:9" and the crop happens here,
 * locally. That is the only reason a page can declare the file's real
 * dimensions instead of declaring 16:9 over a square — which is what the HTML
 * used to do, and what the contract's "declare width/height" rule forbids.
 *
 * Writes webp (sharp, quality 82) next to the path in the preset, plus an entry
 * in public/img/illustrations.json recording prompt hash, model, seed, real
 * output dimensions and date.
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

// Contract §6. The [STYLE] block is fixed because house style is what makes 38
// covers read as one publication instead of 38 pictures; a preset may override
// it (the style candidates under docs/style-candidates do exactly that), but
// nothing overrides [NOT].
const STYLE_BLOCK =
  "A fine-line engraving illustration, in the manner of a 19th-century technical plate. " +
  "Single subject, generous empty space, warm paper background (#f4efe6), one accent colour only. " +
  "Cross-hatching for shading. No gradients. Aspect ratio 16:9.";

const NOT_BLOCK =
  "no text, no lettering, no numbers, no UI, no dashboards, no screenshots, " +
  "no logos, no recognisable faces, no photorealism, no extra colours.";

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
  const style = preset.style ?? presets.style ?? STYLE_BLOCK;
  const not = preset.not ?? NOT_BLOCK;
  const prompt = `[STYLE] ${style}\n[SUBJECT] ${preset.scene}\n[NOT] ${not}`;
  const model = MODEL_IDS[preset.model] ?? preset.model;
  const isCandidate = Boolean(flag("out"));
  const out = isCandidate ? resolve(flag("out")) : join(ASTRO, preset.out);
  const seed = Number(flag("seed") ?? preset.seed);
  const record = {
    preset: name,
    model,
    size: preset.size,
    seed,
    promptSha256: createHash("sha256").update(prompt).digest("hex").slice(0, 16),
    file: preset.out.replace(/^public\//, ""),
  };
  if (dryRun) {
    console.log(`[dry] ${name}: ${model} ${preset.size} frame=${preset.frame ?? "none"} seed=${seed} → ${out}`);
    console.log(`      ${prompt.replace(/\n/g, " | ").slice(0, 260)}…`);
    continue;
  }
  const started = Date.now();
  const res = await fetch(`${base}/v1/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, image_size: preset.size, seed }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${name} failed (${res.status}): ${JSON.stringify(json).slice(0, 300)}`);
  const url = json?.images?.[0]?.url;
  if (!url) throw new Error(`${name}: no image URL in ${JSON.stringify(json).slice(0, 200)}`);
  // The URL is valid for about an hour, so download it now.
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  await mkdir(dirname(out), { recursive: true });

  // The provider returns a square no matter what image_size says (checked
  // 2026-09-23: 1024x576 came back 1024x1024). A preset asking for 16:9 gets the
  // centre band of the square, optionally biased, then written at outSize — so
  // the file on disk is the shape the page declares.
  let pipeline = sharp(bytes);
  if (preset.frame) {
    const [fw, fh] = String(preset.frame).split(":").map(Number);
    const meta = await sharp(bytes).metadata();
    const bandH = Math.min(meta.height, Math.round((meta.width * fh) / fw));
    const slack = meta.height - bandH;
    const top = preset.frameBias === "top" ? 0 : preset.frameBias === "bottom" ? slack : Math.round(slack / 2);
    pipeline = sharp(await pipeline.extract({ left: 0, top, width: meta.width, height: bandH }).toBuffer());
  }
  if (preset.outSize) {
    const [ow, oh] = String(preset.outSize).split("x").map(Number);
    pipeline = pipeline.resize(ow, oh, { fit: "cover" });
  }
  const webp = await pipeline.webp({ quality: 82 }).toBuffer();
  await writeFile(out, webp);
  const written = await sharp(webp).metadata();
  // A candidate run (--out elsewhere) is not a shipped asset, so it must not
  // claim a manifest entry: the manifest says what the file on the page *is*,
  // and a candidate that gets rejected would otherwise leave the shipped path
  // described by a prompt it was never generated from.
  if (!isCandidate) {
    manifest[record.file] = {
      ...record,
      width: written.width,
      height: written.height,
      generatedAt: new Date().toISOString().slice(0, 10),
    };
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }
  console.log(
    `ok ${name}: ${out}  ${written.width}x${written.height}  ${(webp.length / 1024).toFixed(0)} KB webp ` +
      `(from ${(bytes.length / 1024).toFixed(0)} KB png)  ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}
