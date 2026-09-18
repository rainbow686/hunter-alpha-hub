#!/usr/bin/env node
/**
 * Raster companions for the SVG favicon.
 *
 * The site declares an SVG icon, which every current browser uses. Two things
 * still ask for a bitmap:
 *
 *   - `/favicon.ico`, requested blind by some clients and crawlers. It 404'd
 *     until 2026-09-18, so those clients showed no icon at all rather than the
 *     old one.
 *   - `apple-touch-icon`, which iOS reads when someone adds the site to their home
 *     screen. The page pointed that link at `favicon.svg`, and iOS does not accept
 *     SVG there — another icon that silently did not exist.
 *
 * ICO is written by hand here because sharp reads ICO but does not write it, and
 * the format is a small container of PNGs: a 6-byte header, one 16-byte directory
 * entry per image, then the PNG payloads. No extra dependency, so regeneration
 * cannot fail on a machine that has sharp but not ImageMagick.
 *
 *   npm run icons        # regenerate public/favicon.ico + apple-touch-icon.png
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "../public");
const svg = readFileSync(join(PUBLIC, "favicon.svg"));

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** ICO container around PNG payloads (PNG-in-ICO is supported everywhere that matters). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const sizes = [16, 32, 48];
const images = [];
for (const size of sizes) images.push({ size, data: await png(size) });
writeFileSync(join(PUBLIC, "favicon.ico"), ico(images));

const touch = await png(180);
writeFileSync(join(PUBLIC, "apple-touch-icon.png"), touch);

console.log(
  `favicons: favicon.ico ${sizes.join("/")} (${(images.reduce((n, i) => n + i.data.length, 0) / 1024).toFixed(1)} KB of PNG) · apple-touch-icon.png 180 (${(touch.length / 1024).toFixed(1)} KB)`,
);
