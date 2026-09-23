#!/usr/bin/env python3
"""
The Laya side of the probe we ran on Jev, so the two are comparable.

The cases are not re-invented here: this reads `astro/scripts/jev-probe-cases.json`,
the same file `astro/scripts/jev-probe.mjs` sends to TypeSafe. Same states, same
options, same adversarial attempts — one runner talks to a hosted API over HTTPS,
this one runs the weights on the machine in front of us. That is the whole point:
the only honest way to compare two models that answer the same three question
types is to send both the same calls.

    python laya-probe.py --suite d            # determinism: 20 identical calls
    python laya-probe.py --suite a,b,c        # the three suites we ran on Jev
    python laya-probe.py --suite all --out results.json

Setup (CPU is fine, ~1.2 GB of downloads, no key needed):

    python3 -m venv ~/mycodex/.laya-lab/venv
    ~/mycodex/.laya-lab/venv/bin/pip install --index-url https://download.pytorch.org/whl/cpu torch
    ~/mycodex/.laya-lab/venv/bin/pip install "laya[serve]"

`laya` drags in the CUDA build of torch if torch is not already present, which is
2.7 GB of wheels for a model that runs happily on a CPU. Install torch first.

Measured on this machine 2026-09-24: import 2.0 s, checkpoint build 5.6 s, one
question ~0.3 s. Numbers from a laptop CPU are not numbers from a T4, and the
page says so; they are, however, the numbers a reader who wants to self-host on
a CPU will actually get.
"""

import argparse
import json
import statistics
import sys
import time
from pathlib import Path

import numpy as np

CASES = Path(__file__).resolve().parents[2] / "astro" / "scripts" / "jev-probe-cases.json"

# The four teams both probes share, so a label means the same thing on both sides.
TEAMS = None


def log(message):
    print(message, file=sys.stderr, flush=True)


def choice(state, instructions, criteria, name="dept"):
    return state, {name: {"type": "choice", "instructions": instructions, "criteria": criteria}}


def top(agent, state, questions):
    """One call; returns (answers, wall-clock seconds)."""
    started = time.perf_counter()
    out = agent.system_one(state, questions)
    return out, time.perf_counter() - started


def answer_of(entry):
    """The label/probability/confidence triple, whichever of the three types it is."""
    if entry.get("type") == "score":
        return entry.get("score"), entry.get("probabilities"), entry.get("confidence")
    if entry.get("type") == "noul":
        return entry.get("noul"), None, entry.get("confidence")
    return entry.get("choice"), entry.get("probabilities"), entry.get("confidence")


# ---------------------------------------------------------------- suite A


def suite_a(agent, cases, runs, results):
    """Can an answer leave the option set the caller defined?"""
    log(f"== A schema integrity — {len(cases)} adversarial cases × {runs} runs")
    attempts = []
    off_menu = 0
    for case in cases:
        body = case["body"]
        allowed = case.get("allowed") or list(
            next(iter(body["questions"].values())).get("criteria", {}) or []
        )
        seen = []
        for _ in range(runs):
            out, seconds = top(agent, body["state"], body["questions"])
            qid = next(iter(body["questions"]))
            entry = out["answers"][qid]
            label, _probs, confidence = answer_of(entry)
            seen.append({"label": label, "confidence": confidence})
            if label not in allowed and label != qid:
                off_menu += 1
        attempts.append(
            {
                "name": case["name"],
                "allowed": allowed,
                "labels": [s["label"] for s in seen],
                "stable": len({s["label"] for s in seen}) == 1,
                "confidence": {
                    "min": min(s["confidence"] for s in seen if s["confidence"] is not None)
                    if any(s["confidence"] is not None for s in seen)
                    else None,
                    "max": max(s["confidence"] for s in seen if s["confidence"] is not None)
                    if any(s["confidence"] is not None for s in seen)
                    else None,
                },
                "seconds": round(seconds, 3),
            }
        )
    results["a_schema"] = {
        "calls": len(cases) * runs,
        "offMenuAnswers": off_menu,
        "unstableLabels": sum(1 for a in attempts if not a["stable"]),
        "attempts": attempts,
    }
    log(f"   off-menu answers: {off_menu} of {len(cases) * runs}")
    for a in attempts:
        log(f"   {a['name'][:34]:36} → {','.join(str(l) for l in a['labels'])}")


# ---------------------------------------------------------------- suite B


def suite_b(agent, cases, questions, runs, results):
    """Does confidence track how arguable the input is?"""
    log(f"== B confidence vs ambiguity — 30 clear + 10 arguable × {runs} runs")
    out = {}
    for group in ("b_clear", "b_ambiguous"):
        confidences = []
        defensible = 0
        labels = []
        for item in cases[group]:
            for _ in range(runs):
                res, _s = top(agent, item["state"], questions)
                label, _p, confidence = answer_of(res["answers"]["dept"])
                labels.append(label)
                confidences.append(confidence)
                wanted = [item["correct"]] if group == "b_clear" else item["accepts"]
                if label in wanted:
                    defensible += 1
        out[group] = {
            "n": len(cases[group]),
            "calls": len(cases[group]) * runs,
            "defensible": defensible,
            "meanConfidence": round(statistics.mean(confidences), 3),
            "spread": {"min": min(confidences), "max": max(confidences)},
            "labels": sorted(set(labels)),
        }
        log(
            f"   {group}: mean confidence {out[group]['meanConfidence']}, "
            f"range {out[group]['spread']['min']}–{out[group]['spread']['max']}, "
            f"{defensible}/{out[group]['calls']} defensible"
        )
    results["b_ambiguity"] = out


# ---------------------------------------------------------------- suite C


def suite_c(agent, cases, runs, results):
    """Does the wording of a score scale move the score?"""
    scales = cases["c_scales"]
    log(f"== C scale wording — {len(scales['items'])} items × 2 wordings × {runs} runs")
    runs_out = []
    for _ in range(runs):
        row = {}
        for wording in ("situational", "degree"):
            scores = []
            for item in scales["items"]:
                q = {
                    "severity": {
                        "type": "score",
                        "instructions": "How severe is this bug report?",
                        "criteria": scales[wording],
                    }
                }
                res, _s = top(agent, item, q)
                score, _p, _c = answer_of(res["answers"]["severity"])
                scores.append({"item": item, "score": score})
            row[wording] = scores
        runs_out.append(row)

    def order_agreement(row):
        a = [s["score"] for s in row["situational"]]
        b = [s["score"] for s in row["degree"]]
        agreed = 0
        total = 0
        for i in range(len(a)):
            for j in range(i + 1, len(a)):
                total += 1
                if (a[i] - a[j]) * (b[i] - b[j]) > 0:
                    agreed += 1
        return agreed, total

    moves = []
    for row in runs_out:
        deltas = [
            (s["item"], s["score"], d["score"])
            for s, d in zip(row["situational"], row["degree"])
        ]
        mean_abs = statistics.mean(abs(d - s) for _i, s, d in deltas)
        agreed, total = order_agreement(row)
        worst = max(deltas, key=lambda t: abs(t[2] - t[1]))
        moves.append(
            {
                "meanAbsDelta": round(mean_abs, 3),
                "orderAgreement": {"agreed": agreed, "pairs": total},
                "largestMove": {
                    "item": worst[0],
                    "situational": worst[1],
                    "degree": worst[2],
                },
            }
        )
        log(
            f"   mean |Δ| {moves[-1]['meanAbsDelta']}, "
            f"ordering {agreed}/{total}, worst “{worst[0][:40]}” {worst[1]} → {worst[2]}"
        )
    results["c_phrasing"] = {"runs": moves}


# ---------------------------------------------------------------- suite D


STRIPE_STATE = (
    "Our checkout started failing this morning with a Stripe webhook error. "
    "Card payments are declined for every customer. The integration was working "
    "yesterday and nothing was deployed. Logs show 'connection refused' to the "
    "webhook endpoint. This is blocking all sales."
)

DETERMINISM_QUESTIONS = {
    "urgent": {
        "type": "noul",
        "instructions": "Is this ticket urgent?",
    },
    "frustration": {
        "type": "score",
        "instructions": "How frustrated is the customer?",
        "criteria": ["Calm", "Mildly annoyed", "Visibly frustrated", "Angry", "Furious"],
    },
    "dept": {
        "type": "choice",
        "instructions": "Which team should handle this ticket?",
        "criteria": {
            "billing": "Payments, invoices, refunds, subscription charges",
            "shipping": "Delivery, tracking, lost or late parcels, address changes",
            "technical": "Bugs, errors, integrations, login and access problems",
            "returns": "Returning or exchanging an item, size or damage issues",
        },
    },
}


def suite_d(agent, runs, results):
    """Twenty byte-identical calls — the same experiment we ran on Jev."""
    log(f"== D determinism — {runs} identical calls, 3 questions (noul/score/choice)")
    signals = {"urgent": [], "frustration": [], "dept_probability": [], "confidence": []}
    labels = []
    seconds = []
    for _ in range(runs):
        out, s = top(agent, STRIPE_STATE, DETERMINISM_QUESTIONS)
        seconds.append(s)
        a = out["answers"]
        signals["urgent"].append(a["urgent"]["noul"])
        signals["frustration"].append(a["frustration"]["score"])
        signals["dept_probability"].append(a["dept"]["probabilities"][a["dept"]["choice"]])
        signals["confidence"].append(a["dept"]["confidence"])
        labels.append(a["dept"]["choice"])

    def band(values):
        return {
            "min": min(values),
            "max": max(values),
            "range": round(max(values) - min(values), 4),
            "sd": round(statistics.stdev(values), 4) if len(values) > 1 else 0.0,
        }

    results["d_determinism"] = {
        "calls": runs,
        "state": "one Stripe-connection ticket",
        "labels": labels,
        "labelStable": len(set(labels)) == 1,
        "bands": {k: band(v) for k, v in signals.items()},
        "wallClockSeconds": {
            "p50": round(statistics.median(seconds), 3),
            "min": round(min(seconds), 3),
            "max": round(max(seconds), 3),
        },
    }
    for k, v in results["d_determinism"]["bands"].items():
        log(f"   {k:18} {v['min']} – {v['max']}  (range {v['range']}, sd {v['sd']})")
    log(f"   label stable: {results['d_determinism']['labelStable']} ({set(labels)})")


# ---------------------------------------------------------------- suite E


INTENTS = [
    ("activate my card", "My new card arrived but it does not work in shops yet."),
    ("lost or stolen card", "I cannot find my debit card anywhere and I think I left it on the bus."),
    ("declined payment", "My card is declined in every shop even though there is money in my account."),
    ("refund my purchase", "The shop took my money for an order I cancelled and I want it back."),
    ("exchange rate", "How much is 100 euros in pounds, and which rate do you use?"),
    ("cash withdrawal limit", "I tried to take out 500 in cash and the machine refused me."),
    ("transfer money", "I want to send 200 to my brother's account today."),
    ("top up my account", "How do I add money to this account from another bank?"),
    ("close my account", "I want to shut this account down and move to another bank."),
    ("open a savings account", "What do I need to open a savings account with you?"),
    ("change my PIN", "I want a different PIN for my card, the current one is easy to guess."),
    ("freeze my card", "Please stop my card working until I find it."),
    ("statement copy", "I need a statement for last month as a PDF."),
    ("direct debit cancelled", "A company cancelled my direct debit without telling me."),
    ("standing order", "I want to set up a monthly payment to my landlord."),
    ("pending transaction", "There is a payment showing as pending that I did not make."),
    ("contactless not working", "Tap to pay stopped working on my phone this week."),
    ("card payment fee", "Why was I charged an extra fee for paying by card abroad?"),
    ("international transfer fee", "What does it cost to send money to Spain?"),
    ("ATM fee charged", "I was charged for using a cash machine that said it was free."),
    ("loan repayment", "I want to pay off my loan early, what is left to pay?"),
    ("overdraft limit", "Can I increase how far my account can go into the red?"),
    ("salary received late", "My wages have not arrived and they were due this morning."),
    ("verify my identity", "You asked me for documents to prove who I am."),
    ("change my address", "I moved house last week and need to update where you send letters."),
    ("cheque cleared", "Has the cheque I paid in last Tuesday gone through yet?"),
    ("recurring payment", "A subscription keeps taking money and I want it stopped."),
    ("card delivered late", "My replacement card was meant to arrive three days ago."),
    ("travel insurance", "Does this account include insurance when I go abroad?"),
    ("interest rate", "What interest am I earning on the money in this account?"),
]


def suite_e(agent, results):
    """
    Option-set size, with the answer known — the weakness the model card admits to.

    Six unmistakable tickets, each run against 4 / 10 / 20 / 21 / 30 candidate
    intents drawn from the same pool, the right one always present. Accuracy is
    the interesting column: the model card blames its fixed per-option token
    budget (`head_max_len`, 192 tokens in English) for losing the same task at 77
    options that Jev scores 0.87 on.
    """
    log("== E option-set size — 6 tickets × 4/10/20/21/30 candidate intents")
    from laya import confidence_from_probs
    from laya.common import temp_bucket, QTYPES

    cases = INTENTS[:6]
    distractors = [name for name, _ in INTENTS[6:]]
    rows = []
    for size in (4, 10, 20, 21, 30):
        options = {}
        hits = 0
        confidences = []
        untempered_confidences = []
        temperatures = set()
        for correct, state in cases:
            picked = [name for name, _ in cases if name != correct][: size - 1]
            picked += distractors[: size - 1 - len(picked)]
            # Labels stay bare; the state carries the signal, as it would in production.
            criteria = {name: name for name in [correct] + picked}
            out, _s = top(
                agent,
                state,
                {"intent": {"type": "choice", "instructions": "Which intent is this ticket?",
                            "criteria": criteria}},
            )
            entry = out["answers"]["intent"]
            confidences.append(entry["confidence"])
            # `_decode_answers` publishes softmax(logits / t). Multiply that back out to
            # see the distribution the network itself produced, before any fitted
            # temperature — the library refuses the checkpoint's own 11+ value for
            # exactly this reason, so the size of the effect is worth measuring.
            bucket = temp_bucket(QTYPES["choice"], len(criteria))
            applied = agent.temperature_by_options.get(bucket, 1.0)
            temperatures.add(applied)
            probs = np.array(list(entry["probabilities"].values()))
            if applied and applied != 1.0:
                raw = np.exp(np.log(np.clip(probs, 1e-12, 1)) * applied)
                raw = raw / raw.sum()
                untempered_confidences.append(confidence_from_probs(raw, len(raw)))
            else:
                untempered_confidences.append(entry["confidence"])
            if entry["choice"] == correct:
                hits += 1
        rows.append(
            {
                "options": size,
                "correct": hits,
                "of": len(cases),
                "meanConfidence": round(statistics.mean(confidences), 3),
                "meanConfidenceUntempered": round(statistics.mean(untempered_confidences), 3),
                "temperatureApplied": sorted(t for t in temperatures if t)[0] if any(temperatures) else None,
                "temperatureBucket": bucket,
            }
        )
        log(
            f"   {size:>3} options → {hits}/{len(cases)} correct, "
            f"published confidence {rows[-1]['meanConfidence']}, "
            f"without the fitted temperature {rows[-1]['meanConfidenceUntempered']}"
        )
    results["e_options"] = rows


def suite_e2(agent, results):
    """
    What the checkpoint ships against what the library will actually apply.

    No inference here: this is the config the model card publishes, next to the
    clamp `laya/common.py` puts on it. A temperature below 1 multiplies the
    logits, so a clamp at 0.5 still sharpens 2×, and the checkpoint's own value
    would sharpen ~10×.
    """
    log("== E2 fitted temperatures: shipped vs applied")
    shipped = agent.temperature_by_options_raw
    applied = agent.temperature_by_options
    rows = []
    for bucket in sorted(shipped):
        rows.append(
            {
                "bucket": bucket,
                "shipped": shipped[bucket],
                "applied": applied[bucket],
                "clamped": shipped[bucket] != applied[bucket],
            }
        )
        mark = " ← clamped" if rows[-1]["clamped"] else ""
        log(f"   {bucket:16} shipped {shipped[bucket]:<8} applied {applied[bucket]}{mark}")
    results["e2_temperatures"] = rows


# Padding that carries no signal: the same sentence is appended to every option, so
# the discriminative content is still just the name. What changes is how many tokens
# the shared per-option budget has to hold.
PADDING = (
    "this category covers requests of this kind and the agent should treat the "
    "customer as the owner of the account throughout the conversation"
)


def suite_e3(agent, results):
    """
    Same information, longer options — a direct test of the stated mechanism.

    The model card explains the 77-label weakness as an artefact of the fixed
    per-option token budget (`head_max_len`, 192 in English) being shared out
    across options, so long option text is what breaks it. Here the six tickets
    run again against 20 intents with the *same* discriminative words in every
    option and a neutral sentence appended to each: if the budget is the real
    constraint, accuracy should fall even though nothing about the task changed.
    """
    log("== E3 twenty options, short labels vs the same labels padded")
    from laya import confidence_from_probs

    cases = INTENTS[:6]
    distractors = [name for name, _ in INTENTS[6:]]
    rows = []
    for padded in (False, True):
        hits = 0
        confidences = []
        for correct, state in cases:
            picked = [name for name, _ in cases if name != correct][:19]
            picked += distractors[: 19 - len(picked)]
            names = [correct] + picked
            criteria = {
                name: (name + " — " + PADDING) if padded else name for name in names
            }
            out, _s = top(
                agent,
                state,
                {"intent": {"type": "choice", "instructions": "Which intent is this ticket?",
                            "criteria": criteria}},
            )
            entry = out["answers"]["intent"]
            confidences.append(entry["confidence"])
            if entry["choice"] == correct:
                hits += 1
        rows.append(
            {
                "padded": padded,
                "correct": hits,
                "of": len(cases),
                "meanConfidence": round(statistics.mean(confidences), 3),
                "labelWords": len(PADDING.split()) + 4 if padded else 2,
            }
        )
        log(
            f"   {'padded' if padded else 'short '} labels (~{rows[-1]['labelWords']} words) "
            f"→ {hits}/{len(cases)} correct, mean confidence {rows[-1]['meanConfidence']}"
        )
    results["e3_padding"] = rows


# ---------------------------------------------------------------- suite F


def suite_f(agent, results, repeats=5):
    """Wall clock on this CPU, at three batch sizes."""
    log(f"== F latency — CPU, {repeats} repeats at 1 / 10 / 50 questions")
    cities = ["Lisbon", "Porto", "Madrid", "Barcelona", "Seville", "Valencia",
              "Paris", "Lyon", "Rome", "Milan"]
    rows = []
    for count in (1, 10, 50):
        questions = {}
        for i in range(count):
            if i < 10:
                questions[f"q{i}"] = {
                    "type": "choice",
                    "instructions": "Which city should this traveller visit?",
                    "criteria": cities,
                }
            elif i < 30:
                questions[f"q{i}"] = {
                    "type": "score",
                    "instructions": "How suitable is this destination?",
                    "criteria": ["Poor", "Fair", "Good", "Excellent"],
                }
            else:
                questions[f"q{i}"] = {
                    "type": "noul",
                    "instructions": "Is this destination in Europe?",
                }
        times = []
        for _ in range(repeats):
            _out, seconds = top(agent, "I have four days in Spain and want to see architecture.", questions)
            times.append(seconds)
        rows.append(
            {
                "questions": count,
                "p50": round(statistics.median(times), 3),
                "min": round(min(times), 3),
                "max": round(max(times), 3),
                "perQuestionP50": round(statistics.median(times) / count, 4),
            }
        )
        log(
            f"   {count:>2} questions: p50 {rows[-1]['p50']}s "
            f"({rows[-1]['perQuestionP50']}s each)"
        )
    results["f_latency_cpu"] = rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--suite", default="all")
    parser.add_argument("--runs", type=int, default=4, help="repeats for suite A")
    parser.add_argument("--suite-b-runs", type=int, default=1)
    parser.add_argument("--determinism-runs", type=int, default=20)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    cases = json.loads(CASES.read_text())
    global TEAMS
    TEAMS = cases["departments"]
    questions = {
        "dept": {
            "type": "choice",
            "instructions": "Which team should handle this ticket?",
            "criteria": TEAMS,
        }
    }

    wanted = args.suite.split(",") if args.suite != "all" else ["a", "b", "c", "d", "e", "f"]
    if "all" in wanted:
        wanted = ["a", "b", "c", "d", "e", "f"]

    started = time.time()
    from laya import load, confidence_from_probs

    log("loading convaiinnovations/laya (English checkpoint)…")
    t0 = time.perf_counter()
    agent = load("convaiinnovations/laya")
    log(f"checkpoint built in {time.perf_counter() - t0:.1f}s")

    results = {
        "model": "convaiinnovations/laya (English / ModernBERT-large)",
        "device": "cpu",
        "measuredOn": time.strftime("%Y-%m-%d"),
        "casesFile": "astro/scripts/jev-probe-cases.json",
    }
    if "a" in wanted:
        suite_a(agent, cases["a_schema"], args.runs, results)
    if "b" in wanted:
        suite_b(agent, cases, questions, args.suite_b_runs, results)
    if "c" in wanted:
        suite_c(agent, cases, 1, results)
    if "d" in wanted:
        suite_d(agent, args.determinism_runs, results)
    if "e" in wanted:
        suite_e(agent, results)
        suite_e2(agent, results)
        suite_e3(agent, results)
    if "f" in wanted:
        suite_f(agent, results)

    results["elapsedSeconds"] = round(time.time() - started, 1)
    log(f"done in {results['elapsedSeconds']}s")
    text = json.dumps(results, indent=2)
    if args.out:
        Path(args.out).write_text(text + "\n")
        log(f"wrote {args.out}")
    else:
        print(text)


if __name__ == "__main__":
    main()
