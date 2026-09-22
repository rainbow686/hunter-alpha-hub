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
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; published: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; publishedAt: string; status: string;
    ourNote: string; metrics: { likes: number; asOf: string };
    media?: { kind?: string; thumb?: string; thumbW?: number; thumbH?: number };
  }[];
};

export const JEV_X_POSTS_READ_ON: string = RAW.meta.generatedAt.slice(0, 10);

export const jevXPosts: JevXPost[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt,
    ourNote: e.ourNote, likes: e.metrics.likes, kind: e.media?.kind ?? "none",
    thumb: e.media?.thumb ?? "", thumbW: e.media?.thumbW ?? 0, thumbH: e.media?.thumbH ?? 0,
  }))
  .sort((a, b) => b.likes - a.likes);

export const jevXPostCounts = {
  described: jevXPosts.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
