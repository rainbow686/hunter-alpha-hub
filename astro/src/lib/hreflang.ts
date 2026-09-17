/**
 * hreflang pairs for the two bilingual clusters.
 *
 * Why a shared helper: four pages (English + Chinese twins of /access and /faq)
 * must declare the *same* set — a page that lists itself but not its twin is how
 * hreflang silently stops working. The live site already declares the en/zh pair on
 * the Chinese and FAQ pages but not on `/access`; the rebuild declares them on all
 * four and adds `x-default`, which is what Google asks for when the language set
 * has an obvious default.
 */
import { SITE } from "./schema";

export type Alternate = { lang: string; href: string };

const pair = (en: string, zh: string): Alternate[] => [
  { lang: "en-US", href: `${SITE}${en}` },
  { lang: "zh-CN", href: `${SITE}${zh}` },
  { lang: "x-default", href: `${SITE}${en}` },
];

/** /access ↔ /zh/access */
export const accessAlternates = (): Alternate[] => pair("/access", "/zh/access");

/** /faq ↔ /zh/faq */
export const faqAlternates = (): Alternate[] => pair("/faq", "/zh/faq");
