#!/usr/bin/env python3
"""fetch-shots.py — a screenshot of the source page for rows that publish no image.

A thread has no preview: Hacker News draws no card, so the honest image for the row is
a picture of the item page as it looked on a stated date. Real, checkable, dated — the
same claim the row itself makes. The forbidden alternative is a generated illustration,
which on a directory page is a picture of nothing in particular (contract §5).

Viewport 1200x630 (the social-card ratio, so it crops cleanly in a card frame), JPEG q78
so a card costs ~60KB. Skips rows that already have a shot; only writes media fields, so
a re-run cannot lose a written note.
"""
import json, os, datetime
from playwright.sync_api import sync_playwright
from PIL import Image, ImageStat
import time

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QUEUE = os.path.join(ROOT, "lib/data/jev-threads.json")
OUTDIR = os.path.join(ROOT, "astro/public/img/shots")
os.makedirs(OUTDIR, exist_ok=True)
as_of = datetime.date.today().isoformat()

queue = json.load(open(QUEUE))


def blank_ratio(path):
    """How much of the frame is one flat colour.

    Hacker News rate-limits a headless browser: the page loads, the screenshot is
    taken, and the result is 5 KB of white. On 2026-09-22 three new threads got those
    blank cards, and a blank card is worse than no card — it claims to show something.
    So the shot is checked before it is written, and a blank one is retried after a
    pause rather than published.
    """
    img = Image.open(path).convert("L")
    hist = img.histogram()
    return max(hist) / sum(hist)


made = kept = skipped = 0
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for entry in queue["entries"]:
        if entry.get("status") != "published":
            continue
        name = "hn-" + entry["id"].replace("hn:", "") + ".jpg"
        path = os.path.join(OUTDIR, name)
        if os.path.exists(path):
            kept += 1
        else:
            for attempt in (1, 2):
                page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
                try:
                    page.goto(entry["url"], wait_until="load", timeout=30000)
                    page.wait_for_timeout(1400 if attempt == 1 else 4000)
                    page.screenshot(path=path, clip={"x": 0, "y": 36, "width": 1200, "height": 630},
                                    type="jpeg", quality=78)
                except Exception as err:
                    print(f"  {entry['id']}: {str(err).splitlines()[0]} — row keeps no image")
                finally:
                    page.close()
                if not os.path.exists(path):
                    break
                if blank_ratio(path) < 0.55:
                    made += 1
                    break
                os.remove(path)
                if attempt == 1:
                    time.sleep(12)
                else:
                    skipped += 1
                    print(f"  {entry['id']}: came back blank twice — row keeps no image")
                    break
            time.sleep(2.5)
        if os.path.exists(path):
            entry["media"] = {**entry.get("media", {}), "kind": "screenshot",
                              "card": f"/img/shots/{name}", "cardW": 1200, "cardH": 630, "cardAsOf": as_of}
    browser.close()

json.dump(queue, open(QUEUE, "w"), indent=2, ensure_ascii=False)
print(f"shots: {made} taken, {kept} already present, {skipped} blank and dropped → astro/public/img/shots/")
