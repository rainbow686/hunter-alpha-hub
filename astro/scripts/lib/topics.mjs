/**
 * topics.mjs — one place where each model topic says what to collect and where to put it.
 *
 * Why this file exists (2026-09-24, when Laya got its own section): every ingest script used to
 * hard-code Jev's queries, Jev's thresholds and Jev's output path in its own header. Adding a
 * second topic that way means four scripts each grow an `if (topic === "laya")` branch, and a
 * fifth topic means a fifth branch. The reader asked for the Jev shape to be *fixed* and then
 * applied, so the shape lives here: a topic is a name, a set of source configs, and the files its
 * pages read.
 *
 * The Jev entries are copies of the constants that were already in those scripts — same queries,
 * same thresholds, same output paths — so `node scripts/ingest-github.mjs` with no arguments
 * behaves exactly as it did before this file existed.
 *
 * Usage from a script:
 *
 *   import { resolveTopic } from "./lib/topics.mjs";
 *   const topic = resolveTopic();          // --topic laya, or INTAKE_TOPIC=laya, or jev
 *
 * A topic that has no config for a source is not an error: `requireSource` says so and exits.
 * Half a topic's sources existing is the normal state while it is being built — X seeds, for
 * instance, have to be found by hand.
 */

/** The default topic. Every script's historical behaviour is this one. */
export const DEFAULT_TOPIC = "jev";

export const TOPICS = {
  jev: {
    slug: "jev",
    label: "Jev",
    github: {
      out: "lib/data/jev-builds.json",
      queries: ["jev in:name,description created:>2026-06-01", "jev typesafe in:readme"],
      minStars: 25,
      relevance: /(\bjev\b(?!ons)|\bkev\b|typesafe)/i,
    },
    hn: {
      out: "lib/data/jev-threads.json",
      queries: [
        { q: "jev", why: "the model itself" },
        { q: "system one typesafe", why: "the launch, by its other name" },
        { q: "jev decision model", why: "what it is" },
        { q: "kev jev", why: "the derivative family (Kev)" },
        { q: "jev leftpad", why: "the joke build that trended" },
        { q: "madewithjev", why: "the directory built on the flood" },
      ],
      minPoints: 20,
      minComments: 10,
      minDate: "2026-06-01",
      relevance: /(\bjev\b(?!ons)|\bkev\b|typesafe|system one)/i,
    },
    youtube: {
      out: "lib/data/jev-videos.json",
      queries: ["jev decision model typesafe", "system one jev tutorial"],
      minDate: "2026-06-01",
      relevance: /(\bjev\b(?!ons)|\bkev\b|typesafe)/i,
      minViews: 200,
      maxResults: 12,
    },
    devto: {
      out: "lib/data/jev-threads.json",
      tags: ["jev", "typesafe"],
      relevance: /(\bjev\b|\btypesafe\b|system one)/i,
      /* Earlier than this is not about this model, whatever tag it carries. */
      minDate: "2026-06-01",
      perPage: 30,
    },
    x: {
      seeds: "lib/data/jev-x-sources.json",
      out: "lib/data/jev-x-posts.json",
    },
    tagsFile: "lib/data/jev-tags.json",
  },

  /**
   * Laya — the open-weights System One model that shipped as a drop-in Jev replacement on
   * 2026-09-18. Its corpus is not Jev's corpus: nobody is trading with it yet, but a dozen people
   * have ported the runtime to MLX, Core ML, ONNX, Node, Elixir and a Lambda function, which is
   * what the tag vocabulary in `lib/data/laya-tags.json` files.
   *
   * The date floor is the model's own creation week. A bare "laya" is also a game engine
   * (LayaAir), a Dutch company (Layar) and a great many blog posts about neither, so relevance
   * here needs two signals and one exclusion, not one regex.
   */
  laya: {
    slug: "laya",
    label: "Laya",
    github: {
      out: "lib/data/laya-builds.json",
      queries: [
        "laya created:>2026-09-01 in:name,description",
        "laya jev in:name,description,readme created:>2026-09-01",
        "laya decision in:name,description,readme created:>2026-09-01",
        "laya in:name created:>2026-09-10",
      ],
      /*
       * Ten stars, where the Jev column draws the line at twenty-five. Laya is five days old at the
       * time of writing and its most useful rows are not its most starred ones: the ONNX export that
       * makes the model run in a browser tab has eleven stars and no equivalent on the Jev side. A
       * star floor is a way to keep a queue from filling with nothing, not a way to rank readers'
       * interests, so the number is lower here and the note under each row says what the thing is.
       */
      minStars: 10,
      relevance: /(?=.*(\blaya\b|\blaya-))(?=.*(jev|system[\s-]?one|typed[\s-]?decision|decision (engine|model)|non-?autoregressive|convai))/i,
      exclude: /(layabox|layair|layar\b|layan|layered)/i,
    },
    hn: {
      out: "lib/data/laya-threads.json",
      queries: [
        { q: "laya jev", why: "the comparison people keep making" },
        { q: "laya decision model", why: "what it is" },
        { q: "non-autoregressive decision", why: "the author's own thread" },
        { q: "laya coreml", why: "the local-runtime work" },
        { q: "open weight decision model", why: "the category it opened" },
      ],
      minPoints: 3,
      minComments: 2,
      minDate: "2026-09-01",
      relevance: /(\blaya\b|\bconvai|non-?autoregressive decision)/i,
      exclude: /(layabox|layair|layar\b)/i,
    },
    youtube: {
      out: "lib/data/laya-videos.json",
      queries: ["laya jev decision model", "laya open source system one", "laya mlx local"],
      minDate: "2026-09-01",
      relevance: /(\blaya\b|convai|jev)/i,
      exclude: /(layabox|layair|layar\b|layan)/i,
      minViews: 100,
      maxResults: 14,
    },
    devto: {
      out: "lib/data/laya-threads.json",
      /*
       * Only `tag=laya`. The first run also read `tag=jev` and dropped sixty rows into Laya's
       * threads file — every one of them a Jev post, which is a different topic's corpus sitting in
       * this topic's column. If a Jev-tagged post is really about Laya it will come back here the
       * day its author tags it, or it belongs on the Jev side, where it already is.
       */
      tags: ["laya"],
      relevance: /(\blaya\b|\bconvai)/i,
      perPage: 30,
    },
    x: {
      seeds: "lib/data/laya-x-sources.json",
      out: "lib/data/laya-x-posts.json",
    },
    tagsFile: "lib/data/laya-tags.json",
  },
};

/** Same signature everywhere: the row shape the queue machine expects. */
export const matches = (config, text) => {
  if (config?.relevance && !config.relevance.test(text)) return false;
  if (config?.exclude && config.exclude.test(text)) return false;
  return true;
};

/**
 * Which topic this run is about.
 *
 * `--topic X` beats `INTAKE_TOPIC=X` beats the default. An unknown topic exits rather than
 * silently collecting Jev's corpus into a file named after something else.
 */
export function resolveTopic(argv = process.argv, env = process.env) {
  const flag = argv.indexOf("--topic");
  const slug = (flag >= 0 ? argv[flag + 1] : env.INTAKE_TOPIC) || DEFAULT_TOPIC;
  const topic = TOPICS[slug];
  if (!topic) {
    const known = Object.keys(TOPICS).join(", ");
    console.error(`unknown topic "${slug}" — known topics: ${known}`);
    process.exit(2);
  }
  return topic;
}

/** For a script that needs a source the topic has not declared yet. */
export function requireSource(topic, source) {
  const config = topic[source];
  if (!config) {
    console.error(`topic "${topic.slug}" has no ${source} config yet — add it in scripts/lib/topics.mjs`);
    process.exit(2);
  }
  return config;
}
