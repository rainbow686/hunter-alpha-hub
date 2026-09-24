/**
 * /laya/resources — where to read it for yourself.
 *
 * The cheapest column in the topic and the one a reader uses first: the model card, the package,
 * the docs, the demos that run in a browser, and the handful of third-party write-ups that were
 * worth reading twice. Nothing here is ours and nothing here is generated; the note says what the
 * thing is, and where we have an opinion about it the note says that too.
 *
 * Everything below returned 200 on `LAYA_RESOURCES_READ_ON`, and the two hosted demos were opened
 * rather than assumed.
 */
export type LayaResourceKind = "official" | "weights" | "demo" | "reading";

export interface LayaResource {
  name: string;
  url: string;
  kind: LayaResourceKind;
  by: string;
  what: string;
  ourNote?: string;
}

export const LAYA_RESOURCES_READ_ON = "2026-09-24";

export const layaResources: LayaResource[] = [
  {
    name: "laya (repository)",
    url: "https://github.com/NandhaKishorM/laya",
    kind: "official",
    by: "Nandakishor M · Convai Innovations",
    what: "The model, the three checkpoints, the router, the training code and the Jev-compatible server.",
    ourNote: "Start here. The benchmark table is the publisher's own and says which of its columns came from Jev.",
  },
  {
    name: "Documentation",
    url: "https://nandhakishorm.github.io/laya/",
    kind: "official",
    by: "Convai Innovations",
    what: "Install, the three question types, the checkpoints and the server, on GitHub Pages.",
  },
  {
    name: "laya on PyPI",
    url: "https://pypi.org/project/laya/",
    kind: "official",
    by: "Convai Innovations",
    what: "The package we installed to run our own probe: `pip install laya`.",
    ourNote: "The 0.3.x line is current. Installing it pulled about 850 MB of weights on first load in our run.",
  },
  {
    name: "convaiinnovations/laya (weights)",
    url: "https://huggingface.co/convaiinnovations/laya",
    kind: "weights",
    by: "Convai Innovations",
    what: "The English checkpoint: ModernBERT-large, 421M parameters, Apache-2.0, 512-token context.",
    ourNote: "The model card's limits section is unusually direct about overconfidence, and it is right.",
  },
  {
    name: "convaiinnovations/laya-multilingual",
    url: "https://huggingface.co/convaiinnovations/laya-multilingual",
    kind: "weights",
    by: "Convai Innovations",
    what: "The 322M multilingual checkpoint: 100+ languages, 1,024-token context, the fastest of the three.",
  },
  {
    name: "convaiinnovations/laya-typed-decisions",
    url: "https://huggingface.co/convaiinnovations/laya-typed-decisions",
    kind: "weights",
    by: "Convai Innovations",
    what: "The checkpoint the published benchmark is about: four typed-decision workflows, 0.766 accuracy on the publisher's 2,000-question set.",
  },
  {
    name: "Hosted demo",
    url: "https://huggingface.co/spaces/convaiinnovations/laya-demo",
    kind: "demo",
    by: "Convai Innovations on Hugging Face Spaces",
    what: "Type a state and a question, get probabilities back, without installing anything.",
    ourNote: "Opened 2026-09-24 and it answered. The quickest way to see the shape of the output before deciding to download weights.",
  },
  {
    name: "Colab notebook",
    url: "https://colab.research.google.com/drive/15d4Yv__KHeHjshVb-6PRTfqVllxih2S3",
    kind: "demo",
    by: "Convai Innovations",
    what: "The quickstart as a notebook, linked from the repository's own badges.",
  },
  {
    name: "laya-playground (live)",
    url: "https://brainfunctioncollapse.com/laya",
    kind: "demo",
    by: "wdobry",
    what: "The games and the question editor from the playground repository, with no model behind them.",
    ourNote: "It replays recorded runs and says so on the page. Clone the repository if you want the real model.",
  },
  {
    name: "Builds: what people shipped in week one",
    url: "https://github.com/NandhaKishorM/laya/network/dependents",
    kind: "reading",
    by: "GitHub",
    what: "Who forked the model, which is how we found most of the ports in our own builds column.",
  },
  {
    name: "Local Laya vs Hosted Jev",
    url: "https://astgl.com/p/local-laya-vs-hosted-jev-why-my-agents",
    kind: "reading",
    by: "James Cruce · astgl",
    what: "A first-person deployment on a Mac Studio: the gateway design, the fail-closed rules, and the profile that failed acceptance and was switched off.",
    ourNote: "The most useful third-party write-up on this model, and the only one that reports a rule its author disabled after testing.",
  },
  {
    name: "Laya on Mac M4 Core ML",
    url: "https://news.ycombinator.com/item?id=49777106",
    kind: "reading",
    by: "Hacker News",
    what: "The thread where the local-memory question was worked out in public, 174 points.",
  },
  {
    name: "I built non-autoregressive decision models with RL",
    url: "https://news.ycombinator.com/item?id=49765348",
    kind: "reading",
    by: "Hacker News",
    what: "The author's own submission of the year-old work, 1,349 points and 316 comments, most of them about credit rather than about the model.",
    ourNote: "Read the comments as well as the post: the disagreement is the informative part.",
  },
  {
    name: "awesome-jev",
    url: "https://github.com/yibie/awesome-jev",
    kind: "reading",
    by: "yibie",
    what: "A curated list that tracks the open clones alongside Jev itself, and the source of several rows in our own columns.",
    ourNote: "A list of links, not a review. We read it for leads.",
  },
  {
    name: "The OpenRouter directory",
    url: "https://openrouter.ai/models",
    kind: "reading",
    by: "OpenRouter",
    what: "Where the hosted models on this site are listed. Laya is not on it — it runs on your machine.",
    ourNote: "Included because a reader looking for Laya in the catalogue will not find it, and that absence is the point of the model.",
  },
];

export const layaResourceCounts = {
  total: layaResources.length,
  official: layaResources.filter((r) => r.kind === "official").length,
  demos: layaResources.filter((r) => r.kind === "demo").length,
};
