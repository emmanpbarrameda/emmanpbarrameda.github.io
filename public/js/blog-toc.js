// public/js/blog-toc.js
(() => {
    const toc = document.getElementById("blog-toc");
    const tocMobile = document.getElementById("blog-toc-mobile");
    if (!toc && !tocMobile) return;

    const root = document.querySelector(".blog-content");
    if (!root) return;

    /** ================================
     * ! MARK: Build TOC from headings
     * ================================ */
    let headings = root.querySelectorAll("h1[id], h2[id], h3[id]");
    if (!headings.length) {
        const empty = '<p class="text-xs text-neutral-500">No sections</p>';
        if (toc) toc.innerHTML = empty;
        if (tocMobile) tocMobile.innerHTML = empty;
        return;
    }

    const parts = [];
    const escapeEl = document.createElement("span");

    for (let i = 0; i < headings.length; i++) {
        const h = headings[i];
        const level = h.tagName.charCodeAt(1) - 48;

        let text = h.textContent || "";
        const anchor = h.querySelector(".heading-anchor-link");
        if (anchor) {
            text = text.replace(anchor.textContent || "", "").trim();
        }
        if (!text) continue;

        escapeEl.textContent = text;
        const escaped = escapeEl.innerHTML;

        const indent =
            level === 1
                ? "pl-0 font-medium text-neutral-300"
                : level === 2
                    ? "pl-3 text-neutral-400"
                    : "pl-5 text-neutral-500 text-xs";

        const spacing =
            level === 1 && i > 0 ? " mt-1.5 pt-1 border-t border-neutral-800/30" : "";

        const textSize = level === 1 ? " text-sm font-medium" : " text-xs";

        parts.push(
            `<a class="toc-link block truncate rounded-md px-2 py-1 transition-colors hover:text-sky-300 hover:bg-neutral-900/50 ${indent}${spacing}${textSize}" href="#${h.id}" data-id="${h.id}">${escaped}</a>`
        );
    }

    const tocHTML = parts.join("");
    if (toc) toc.innerHTML = tocHTML;
    if (tocMobile) tocMobile.innerHTML = tocHTML;

    /** ================================
     * ! MARK: Visual flash helper
     * ================================ */
    function flashHeading(el) {
        el.classList.remove("heading-flash");
        void el.offsetWidth;
        el.classList.add("heading-flash");
    }

    /** ================================
     * ! MARK: Active state logic
     * ================================ */
    function getAllLinks() {
        const links = [];
        if (toc) links.push(...toc.querySelectorAll(".toc-link"));
        if (tocMobile) links.push(...tocMobile.querySelectorAll(".toc-link"));
        return links;
    }

    function setActive(id) {
        getAllLinks().forEach((a) => {
            if (a.dataset.id === id) {
                a.classList.remove("text-neutral-400");
                a.classList.add("text-sky-300", "bg-neutral-900/60");
            } else {
                a.classList.remove("text-sky-300", "bg-neutral-900/60");
                a.classList.add("text-neutral-400");
            }
        });
    }

    /** ================================
     * ! MARK: Scroll-based active state
     * ================================ */
    let ticking = false;

    function updateActiveHeading() {
        const scrollTop = window.scrollY;
        const offset = 150;

        let currentHeading = null;

        for (const h of headings) {
            if (h.offsetTop <= scrollTop + offset) {
                currentHeading = h;
            } else {
                break;
            }
        }

        if (!currentHeading && headings.length) {
            currentHeading = headings[0];
        }

        if (currentHeading) {
            setActive(currentHeading.id);
        }
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveHeading();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateActiveHeading();

    /** ================================
     * ! MARK: Mobile TOC behavior
     * ================================ */
    if (tocMobile) {
        const mobileDetails = tocMobile.closest("details");

        tocMobile.addEventListener("click", (e) => {
            const a = e.target.closest("a.toc-link");
            if (!a) return;

            e.preventDefault();

            const targetId = a.dataset.id;
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            if (mobileDetails) mobileDetails.open = false;

            setTimeout(() => {
                const stickyOffset = 120;
                const targetPosition =
                    targetEl.getBoundingClientRect().top +
                    window.pageYOffset -
                    stickyOffset;

                window.scrollTo({ top: targetPosition, behavior: "smooth" });
                setTimeout(() => flashHeading(targetEl), 350);
                history.pushState(null, null, "#" + targetId);
            }, 50);
        });
    }

    /** ================================
     * ! MARK: Desktop TOC click
     * ================================ */
    if (toc) {
        toc.addEventListener("click", (e) => {
            const a = e.target.closest("a.toc-link");
            if (a?.dataset.id) {
                setActive(a.dataset.id);
                setTimeout(updateActiveHeading, 500);
            }
        });
    }

    /** ================================
     * ! MARK: TTS integration
     * ================================ */
    document.addEventListener("tts:heading", (e) => {
        if (e.detail) setActive(e.detail);
    });

    // Re-query headings after TTS restores DOM
    document.addEventListener("tts:cleanup", () => {
        headings = root.querySelectorAll("h1[id], h2[id], h3[id]");
        setTimeout(updateActiveHeading, 100);
    });
})();