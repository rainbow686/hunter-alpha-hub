/**
 * The ⌘K dialog on the other side of the Search button.
 *
 * Three decisions worth keeping:
 *
 * 1. The index is a static file we generate at build time (scripts/build-search-index.mjs)
 *    and it is fetched from our own origin. No third-party search service, no key, no
 *    request that leaves the reader's browser — the site's CSP stays `self`, and the
 *    index is a build artefact the same way an image is.
 * 2. Nothing loads until the reader opens the dialog. `pagefind.js` plus its wasm is
 *    about 90 KB; a reader who never searches should not pay for it, so the import is
 *    a runtime `import()` of a URL Vite must not try to resolve.
 * 3. The excerpt Pagefind returns is built from our own pages and contains only
 *    `<mark>`; anything else is stripped before it reaches `innerHTML`, so a page whose
 *    content ever contains markup cannot inject it into the chrome.
 */

const dialog = document.getElementById("site-search");
const input = document.getElementById("search-input");
const list = document.getElementById("search-results");
const status = document.getElementById("search-status");

if (dialog && input && list && status) {
  let pagefind = null;
  let indexPromise = null;
  let pending = 0;
  let active = -1;
  let lastQuery = "";

  const setStatus = (text) => {
    status.textContent = text;
  };

  /**
   * The index is ~90 KB of JS and wasm and it arrives over a cold connection, so
   * the fetch starts the moment the dialog opens rather than on the first keystroke:
   * the reader spends that second typing, not waiting. It still costs a reader who
   * never opens the dialog nothing.
   */
  function loadIndex() {
    if (pagefind) return Promise.resolve(pagefind);
    if (!indexPromise) {
      indexPromise = (async () => {
        // Vite must not rewrite this: the file does not exist until after the build.
        const url = new URL("/pagefind/pagefind.js", location.origin).href;
        const mod = await import(/* @vite-ignore */ url);
        await mod.options({ excerptLength: 22 });
        await mod.init();
        pagefind = mod;
        return pagefind;
      })();
    }
    return indexPromise;
  }

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    input.focus();
    input.select();
    if (!input.value) setStatus("Type a word, a model name or a heading.");
    // Warm the index in the background; the status line only changes if the reader
    // types before it arrives, which is what `run` reports.
    loadIndex().catch(() => {});
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  for (const trigger of document.querySelectorAll("[data-search-open]")) {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });
  }

  for (const closer of dialog.querySelectorAll("[data-search-close]")) {
    closer.addEventListener("click", () => close());
  }

  dialog.addEventListener("click", (event) => {
    // The dialog element fills the viewport; a click on the backdrop is a click on
    // the dialog itself rather than on the card inside it.
    if (event.target === dialog) close();
  });

  document.addEventListener("keydown", (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "");
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      dialog.open ? close() : open();
    } else if (event.key === "/" && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });

  input.addEventListener("keydown", (event) => {
    const items = [...list.querySelectorAll("a")];
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!items.length) return;
      active = event.key === "ArrowDown"
        ? (active + 1) % items.length
        : (active - 1 + items.length) % items.length;
      for (const [index, item] of items.entries()) {
        item.classList.toggle("is-active", index === active);
      }
      items[active].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && active >= 0 && items[active]) {
      event.preventDefault();
      items[active].click();
    }
  });

  /**
   * `/typesafe-jev/builds/codex-context-diet` -> `/typesafe-jev/builds`
   *
   * A top-level page returns "" rather than "/": the path of the page the reader is
   * already reading tells them nothing, and a bare slash reads as a broken value.
   */
  const sectionOf = (url) => {
    const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/[?#].*$/, "");
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    return parts.length ? `/${parts.join("/")}` : "";
  };

  const safeExcerpt = (html) => html.replace(/<(?!\/?mark\b)[^>]*>/gi, "");

  // The <title> of every page here ends with the same site suffix; printing it in
  // each of ten results is ten lines of chrome and no information.
  const titleOf = (text) => text.replace(/\s*\|\s*OpenRouter Model Hub\s*$/, "");

  input.addEventListener("input", () => {
    const query = input.value.trim();
    clearTimeout(input.dataset.timer);
    if (query === lastQuery) return;
    lastQuery = query;
    if (query.length < 2) {
      list.innerHTML = "";
      active = -1;
      setStatus(query ? "Keep typing — one letter matches everything." : "Type a word, a model name or a heading.");
      return;
    }
    input.dataset.timer = setTimeout(() => run(query), 120);
  });

  async function run(query) {
    const token = ++pending;
    try {
      if (!pagefind) setStatus("Loading the index…");
      const pf = await loadIndex();
      const search = await pf.search(query);
      const results = await Promise.all(search.results.slice(0, 10).map((r) => r.data()));
      if (token !== pending) return;
      active = -1;
      if (!results.length) {
        list.innerHTML = "";
        setStatus(`No page here matches “${query}”. Try a model name, or the directory.`);
        return;
      }
      list.innerHTML = results
        .map((result) => {
          const where = sectionOf(result.url);
          return `<li><a href="${result.url}">
            <span class="r-title">${titleOf(result.meta?.title ?? result.url)}</span>
            ${where ? `<span class="r-where">${where}</span>` : ""}
            <span class="r-excerpt">${safeExcerpt(result.excerpt ?? "")}</span>
          </a></li>`;
        })
        .join("");
      const total = search.results.length;
      setStatus(
        total > results.length
          ? `${total} results for “${query}” — the top ${results.length} are here.`
          : `${total} result${total === 1 ? "" : "s"} for “${query}”.`,
      );
    } catch (error) {
      if (token !== pending) return;
      setStatus("The search index did not load. Reload the page and try again.");
      console.error(error);
    }
  }
}
