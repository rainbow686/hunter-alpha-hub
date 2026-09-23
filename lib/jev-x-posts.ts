/**
 * /typesafe-jev/x-posts — what people are saying about Jev on X.
 *
 * This is a **source hub**, not a content type, and it owns its queue now. The story of
 * how it got here is worth keeping, because the mistake in it is the reason the topic
 * was restructured on 2026-09-23 (`docs/roadmap/jev-topic-columns.md` §修订):
 *
 *   1. When the Jev columns were mapped onto the reference site, its `/x-posts` hub was
 *      written down as our `/demos` — a translation error. The reference has no
 *      "demos" category; a recording of something running is *media on a record*, not a
 *      kind of record ("its /x-posts page embeds 135 mp4s").
 *   2. So our first column was called demos, and it was filled from X.
 *   3. When `/x-posts` was built as its own column, demos became the subset that had
 *      media — seven rows out of forty-two, sharing a queue, a note and a card with the
 *      page they were a subset of. A reader could not tell what it was for, because it
 *      was not for anything.
 *   4. On 2026-09-23 the column and the `isDemo` field were deleted. Those seven rows
 *      are posts; where one shows a project, the project belongs in `/builds` and the
 *      clip is its evidence.
 *
 * Poster images stay on X's CDN: nothing here is downloaded or rehosted.
 */
import queue from "./data/jev-x-posts.json";

export interface JevXPost {
  id: string;
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  ourNote: string;
  likes: number;
  /** "video" | "image" | "none" — the media inside the post, which is what the card's
   *  eyebrow reports. It says what the post *is*, and never which column it belongs to. */
  kind: string;
  thumb: string;
  thumbW: number;
  thumbH: number;
  /**
   * A progressive mp4 on X's own CDN, when one fits the size cap (see
   * scripts/ingest-x-video.mjs). Hotlinked, never downloaded or rehosted, the same way the
   * poster image is. Null means the card keeps its poster and links out — either the post has
   * no video, or every variant was larger than a card is worth streaming.
   */
  video: { url: string; width: number; height: number; bytes: number; durationS: number | null } | null;
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; published: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; publishedAt: string; status: string;
    ourNote: string; metrics: { likes: number; asOf: string };
    media?: {
      kind?: string; thumb?: string; thumbW?: number; thumbH?: number;
      video?: { url: string; width: number; height: number; bytes: number; durationS: number | null };
    };
  }[];
};

/*
 * The date the like counts were read — the newest `metrics.asOf` in the queue, not
 * `meta.generatedAt`.
 *
 * They were the same number until `--refresh` existed, which is exactly why this is worth a
 * comment: `generatedAt` is when the *queue* was last written (new posts added), while the
 * counts move on their own schedule. Re-reading every like count without adding a post would
 * have left the page saying "read 2026-09-22" over numbers read on the 23rd — the failure mode
 * this whole column is built to avoid, in the one place a reader would not think to check.
 */
const readDates = RAW.entries
  .filter((e) => e.status === "published" && e.metrics?.asOf)
  .map((e) => e.metrics.asOf)
  .sort();

export const JEV_X_POSTS_READ_ON: string = readDates.at(-1) ?? RAW.meta.generatedAt.slice(0, 10);

/**
 * Published rows whose count is older than the column's date — a refresh that could not reach a
 * post leaves it holding its previous reading *and its previous date*. Usually zero; when it is
 * not, the page says so rather than folding one stale card into a column-level claim.
 */
export const JEV_X_POSTS_STALE: number = readDates.filter((d) => d !== JEV_X_POSTS_READ_ON).length;

export const jevXPosts: JevXPost[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt,
    ourNote: e.ourNote, likes: e.metrics.likes, kind: e.media?.kind ?? "none",
    thumb: e.media?.thumb ?? "", thumbW: e.media?.thumbW ?? 0, thumbH: e.media?.thumbH ?? 0,
    video: e.media?.video ?? null,
  }))
  .sort((a, b) => b.likes - a.likes);

export const jevXPostCounts = {
  described: jevXPosts.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
