#!/usr/bin/env node
/**
 * The three probes behind the numbers in "What we checked ourselves" on
 * /typesafe-jev. They are here so the page's claim is checkable rather than
 * quotable: anyone with a TypeSafe key can re-run them and get the same shape.
 *
 *   A  schema integrity — can any answer leave the option set the *caller*
 *      defined? The vendor's guarantee is absolute, so the test is adversarial:
 *      injection in the state, a state that implies an option that was never
 *      offered, near-synonym options, one option, ten options, an empty state,
 *      a contradictory criteria map, a question name with punctuation in it.
 *   B  does the confidence mean anything? Thirty deliberately unambiguous items
 *      and ten deliberately arguable ones, both against the same four options.
 *      If the number tracks ambiguity, the two groups separate.
 *   C  does the wording of a score scale move the score? The same twelve items
 *      are scored twice: once with levels described by situation, once with the
 *      levels described only by how strong they are.
 *
 * Usage:
 *   node scripts/jev-probe.mjs --suite a --env-file ~/.config/hunter-alpha-hub/env
 *   node scripts/jev-probe.mjs --suite all --env-file ...
 *   node scripts/jev-probe.mjs --suite a --dry-run
 *
 * The key is never in this repo: pass --env-file or set TYPESAFE_API_KEY.
 * Cost of a full run: 77 calls (13 + 40 + 24), about $0.002 at the catalogue price.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(await readFile(join(here, "jev-probe-cases.json"), "utf8"));
const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";

const args = process.argv.slice(2);
const value = (name) => { const i = args.indexOf(`--${name}`); return i === -1 ? null : args[i + 1] ?? true; };

if (args.includes("--help") || args.includes("-h")) {
  console.log("suites: a (schema integrity), b (confidence vs ambiguity), c (scale wording), all");
  process.exit(0);
}
const suite = value("suite") ?? "all";

let key = process.env.TYPESAFE_API_KEY;
const envFile = value("env-file");
if (envFile) {
  const p = envFile.replace(/^~/, process.env.HOME ?? "~");
  if (!existsSync(p)) throw new Error(`--env-file not found: ${p}`);
  for (const line of (await readFile(p, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  key = process.env.TYPESAFE_API_KEY;
}
const dryRun = args.includes("--dry-run");
if (!dryRun && !key) throw new Error("no TYPESAFE_API_KEY (pass --env-file or set the variable)");

async function ask(body) {
  const started = Date.now();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, ...body }),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json, ms: Date.now() - started };
}

/** A choice question over the shared four-team option set. */
const choice = (state, question, options, name = "dept") => ({
  state,
  questions: { [name]: { type: "choice", instructions: question, criteria: options } },
});

const optionsFor = (allowed) =>
  Object.fromEntries(allowed.map((k) => [k, cases.departments[k] ?? `Option ${k}`]));

async function suiteA() {
  console.log(`== A schema integrity — ${cases.a_schema.length} adversarial calls`);
  let violations = 0;
  for (const c of cases.a_schema) {
    const body = { ...c.body };
    // The stored case bodies are the payloads as run; re-send them verbatim.
    const { status, json, ms } = await ask(body);
    const answers = json?.answers ?? {};
    const labels = Object.entries(answers)
      .filter(([, v]) => v && typeof v === "object" && v.type === "choice")
      .map(([k, v]) => [k, v.choice, v.confidence]);
    const off = labels.filter(([, choice]) => !c.allowed.includes(choice));
    violations += off.length;
    console.log(
      `  ${status} ${String(ms).padStart(4)}ms  ${c.name.padEnd(30)} ` +
        `labels=${JSON.stringify(labels)} off-menu=${off.length ? JSON.stringify(off) : "none"}`,
    );
  }
  console.log(`  → ${violations === 0 ? "no answer left the option set" : `${violations} violations`} in ${cases.a_schema.length} calls`);
}

async function suiteB() {
  console.log(`== B confidence vs ambiguity — ${cases.b_clear.length + cases.b_ambiguous.length} calls`);
  const run = async (state) => {
    const { json } = await ask(choice(state, "Which team should handle this ticket?", optionsFor(Object.keys(cases.departments))));
    const a = json?.answers?.dept ?? {};
    return { choice: a.choice, confidence: a.confidence };
  };
  const summarize = async (rows, accept) => {
    const scored = [];
    for (const row of rows) {
      const got = await run(row.state);
      const ok = accept(row, got.choice);
      scored.push({ ...got, ok });
    }
    const confs = scored.map((s) => s.confidence).filter((c) => typeof c === "number");
    const mean = confs.reduce((a, b) => a + b, 0) / (confs.length || 1);
    return { n: scored.length, correct: scored.filter((s) => s.ok).length, mean, scored };
  };
  const clear = await summarize(cases.b_clear, (row, choice) => choice === row.correct);
  const ambiguous = await summarize(cases.b_ambiguous, (row, choice) => row.accepts.includes(choice));
  for (const [name, r] of [["unambiguous", clear], ["deliberately arguable", ambiguous]]) {
    console.log(
      `  ${name.padEnd(21)} n=${r.n}  correct=${r.correct}  mean confidence=${r.mean.toFixed(2)}` +
        `  range=${Math.min(...r.scored.map((s) => s.confidence ?? 1)).toFixed(2)}–${Math.max(...r.scored.map((s) => s.confidence ?? 0)).toFixed(2)}`,
    );
  }
  const low = ambiguous.scored.filter((s) => s.confidence < 0.9).length;
  console.log(
    `  → the arguable set produced ${low}/${ambiguous.n} answers under 0.9 against ${clear.scored.filter((s) => s.confidence < 0.9).length}/${clear.n} ` +
      `in the clear set. Note the limit: ${clear.correct + ambiguous.correct} of ${clear.n + ambiguous.n} were correct, so this measures ` +
      `whether confidence tracks ambiguity — not whether 0.7 means 70%.`,
  );
}

async function suiteC() {
  const { situational, degree, items } = cases.c_scales;
  console.log(`== C scale wording — ${items.length * 2} calls`);
  const rows = [];
  for (const state of items) {
    const one = async (levels) => {
      const { json } = await ask({
        state,
        questions: { sev: { type: "score", instructions: "How bad is the impact of this report?", criteria: levels } },
      });
      const a = json?.answers?.sev ?? {};
      return { score: a.score, confidence: a.confidence };
    };
    const sit = await one(situational);
    const deg = await one(degree);
    rows.push({ state, sit, deg, delta: (sit.score ?? 0) - (deg.score ?? 0) });
    console.log(
      `  situ=${String(sit.score).padEnd(5)} deg=${String(deg.score).padEnd(5)} ` +
        `Δ=${(sit.score - deg.score >= 0 ? "+" : "")}${(sit.score - deg.score).toFixed(2)}  ${state.slice(0, 52)}`,
    );
  }
  const deltas = rows.map((r) => Math.abs(r.delta));
  const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  let agree = 0;
  let pairs = 0;
  for (let i = 0; i < rows.length; i += 1) {
    for (let j = i + 1; j < rows.length; j += 1) {
      pairs += 1;
      if ((rows[i].sit.score - rows[j].sit.score) * (rows[i].deg.score - rows[j].deg.score) > 0) agree += 1;
    }
  }
  const worst = [...rows].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  console.log(`  → mean |situational − degree| = ${mean.toFixed(2)} of 2 levels; pairwise ordering agreement ${agree}/${pairs} (${Math.round((agree / pairs) * 100)}%)`);
  console.log(`  → worst single item: Δ${worst.delta.toFixed(2)} — ${worst.state.slice(0, 60)}`);
}

if (dryRun) {
  console.log(`dry run — suite ${suite}: ` + ({
    a: `${cases.a_schema.length} adversarial calls`,
    b: `${cases.b_clear.length + cases.b_ambiguous.length} calls`,
    c: `${cases.c_scales.items.length * 2} calls`,
    all: `${cases.a_schema.length + cases.b_clear.length + cases.b_ambiguous.length + cases.c_scales.items.length * 2} calls total`,
  }[suite] ?? "unknown suite"));
  process.exit(0);
}

if (suite === "a" || suite === "all") await suiteA();
if (suite === "b" || suite === "all") await suiteB();
if (suite === "c" || suite === "all") await suiteC();
