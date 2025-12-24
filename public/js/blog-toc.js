// public/js/blog-toc.js
(() => {
    const toc = document.getElementById("blog-toc");
    const tocMobile = document.getElementById("blog-toc-mobile");
    const root = document.querySelector(".blog-content");

    if (!root || (!toc && !tocMobile)) return;

    const headings = Array.from(root.querySelectorAll("h1, h2, h3"))
        .filter((h) => !!h.textContent?.trim())
        .filter((h) => !!h.id);

    if (!headings.length) {
        const empty = `<p class="text-xs text-neutral-500">No sections</p>`;
        if (toc) toc.innerHTML = empty;
        if (tocMobile) tocMobile.innerHTML = empty;
        return;
    }

    // Build TOC HTML
    const tocHTML = headings
        .map((h, index) => {
            const level = Number(h.tagName.substring(1));

            const indent = level === 1 ? "pl-0 font-medium text-neutral-300"
                : level === 2 ? "pl-3 text-neutral-400"
                : "pl-5 text-neutral-500 text-xs";

            const spacing = (level === 1 && index > 0) ? "mt-3 pt-2 border-t border-neutral-800/30" : "";

            const textSize = level === 1 ? "text-sm font-medium" : "text-xs";

            const cls = [
                "toc-link",
                "block",
                "truncate",
                "rounded-md",
                "px-2",
                "py-1.5",
                "transition-colors",
                "hover:text-sky-300",
                "hover:bg-neutral-900/50",
                indent,
                spacing,
                textSize,
            ].filter(Boolean).join(" ");

            return `<a class="${cls}" href="#${h.id}" data-id="${h.id}">${escapeHtml(
                getHeadingLabel(h)
            )}</a>`;
        })
        .join("");

    // Populate both TOCs
    if (toc) toc.innerHTML = tocHTML;
    if (tocMobile) tocMobile.innerHTML = tocHTML;

    // Scroll highlighting only on desktop
    const isDesktop = matchMedia("(min-width:1024px)").matches;
    if (!toc || !isDesktop) return;

    const links = Array.from(toc.querySelectorAll("a.toc-link"));
    const linkById = new Map(links.map((a) => [a.dataset.id, a]));

    function setActive(id) {
        links.forEach((a) => {
            a.classList.remove("text-sky-300", "bg-neutral-900/60");
            a.classList.add("text-neutral-400");
        });

        const a = linkById.get(id);
        if (a) {
            a.classList.remove("text-neutral-400");
            a.classList.add("text-sky-300", "bg-neutral-900/60");
        }
    }

    const io = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visible.length) setActive(visible[0].target.id);
        },
        {
            rootMargin: "-120px 0px -70% 0px",
            threshold: [0, 1],
        }
    );

    headings.forEach((h) => io.observe(h));

    toc.addEventListener("click", (e) => {
        const a = e.target.closest?.("a.toc-link");
        if (!a) return;
        const id = a.dataset.id;
        if (id) setActive(id);
    });

    function escapeHtml(s) {
        return s
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getHeadingLabel(h) {
        const clone = h.cloneNode(true);
        clone.querySelectorAll?.(".heading-anchor-link").forEach((el) => el.remove());
        return (clone.textContent || "").trim();
    }
})();