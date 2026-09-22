/**
 * /typesafe-jev/x-posts — what people are saying about Jev on X.
 *
 * Split out of the demos column on 2026-09-22, because the two are different jobs and
 * the demos page's own lede had started lying: of 38 published posts, 16 carry no image
 * at all and most of the rest are explainers. A post is evidence of what the field is
 * saying — vendor announcements, benchmarks, sceptical day-one notes, predictions — while
 * a demo shows a thing running, which is the only kind we can verify ourselves.
 *
 * Same queue as the demos column (`lib/data/jev-demos.json`), filtered by `column`.
 * Poster images stay on X's CDN: nothing here is downloaded or rehosted.
 */
import { jevDemos, type JevDemo } from "./jev-demos";

export type { JevDemo };
export const jevXPosts: JevDemo[] = jevDemos.filter((e) => e.column === "x-post");
