/**
 * What the masthead's status slot carries.
 *
 * The slot was built for one moment: a new stealth codename going live, which is the
 * only time this site has news. The rest of the time it used to print "Union Alpha
 * revealed" next to "no live codename" — a badge for an event that was over, plus a
 * sentence telling the reader that nothing is happening.
 *
 * Two states now, decided 2026-09-24:
 *
 *   - **A codename is live** → the live badge takes the slot (its own field in
 *     lib/stealth-models.ts; not duplicated here).
 *   - **Otherwise** → the two model topics, as links.
 *
 * The topics live here rather than being derived from the file tree because the
 * header is the one piece of chrome on every page, and "which two things is this
 * site building" is an editorial answer, not a directory listing. They are also the
 * two things a reader could not reach from the chrome at all until 2026-09-24: both
 * were footer-only, which is how a whole topic stayed invisible on its own site.
 *
 * `note` is the tooltip, and the reason this is a list of objects rather than of
 * strings: "Jev" means nothing to somebody who has not met the name, and the header
 * is where they meet it first.
 */
export interface SpotlightTopic {
  label: string;
  href: string;
  note: string;
}

export const topics: SpotlightTopic[] = [
  {
    label: "Jev",
    href: "/typesafe-jev",
    note: "We are following Jev — TypeSafe's decision model: state in, typed decision out",
  },
  {
    label: "Laya",
    href: "/laya",
    note: "We are following Laya — the open-weight decision model you can run yourself",
  },
];
