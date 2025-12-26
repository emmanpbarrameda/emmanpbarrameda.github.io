// public/js/blog-toc.js
(() => {
    const toc = document.getElementById("blog-toc");
    const tocMobile = document.getElementById("blog-toc-mobile");

    if (!toc && !tocMobile) return;

    const root = document.querySelector(".blog-content");
    if (!root) return;

    const headings = root.querySelectorAll("h1[id], h2[id], h3[id]");

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

        const indent = level === 1 ? "pl-0 font-medium text-neutral-300"
            : level === 2 ? "pl-3 text-neutral-400"
                : "pl-5 text-neutral-500 text-xs";

        const spacing = (level === 1 && i > 0) ? " mt-3 pt-2 border-t border-neutral-800/30" : "";
        const textSize = level === 1 ? " text-sm font-medium" : " text-xs";

        parts.push(
            `<a class="toc-link block truncate rounded-md px-2 py-1.5 transition-colors hover:text-sky-300 hover:bg-neutral-900/50${indent}${spacing}${textSize}" href="#${h.id}" data-id="${h.id}">${escaped}</a>`
        );
    }

    const tocHTML = parts.join("");
    if (toc) toc.innerHTML = tocHTML;
    if (tocMobile) tocMobile.innerHTML = tocHTML;

    // Shared flash function
    function flashHeading(el) {
        el.classList.remove("heading-flash");
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add("heading-flash");
    }

    // Mobile TOC
    if (tocMobile) {
        const mobileDetails = tocMobile.closest("details");

        tocMobile.addEventListener("click", function(e) {
            const a = e.target.closest("a.toc-link");
            if (!a) return;

            e.preventDefault();

            const targetId = a.dataset.id;
            const targetEl = document.getElementById(targetId);

            if (!targetEl) return;

            if (mobileDetails) {
                mobileDetails.open = false;
            }

            setTimeout(function() {
                var stickyOffset = 120;
                var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - stickyOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                // Flash after scroll starts
                setTimeout(function() {
                    flashHeading(targetEl);
                }, 350);

                history.pushState(null, null, "#" + targetId);
            }, 50);
        });
    }

    if (!toc || !window.matchMedia("(min-width:1024px)").matches) return;

    const links = toc.getElementsByClassName("toc-link");
    const linkById = new Map();
    for (const a of links) linkById.set(a.dataset.id, a);

    let activeLink = null;

    function setActive(id) {
        if (activeLink) {
            activeLink.classList.remove("text-sky-300", "bg-neutral-900/60");
            activeLink.classList.add("text-neutral-400");
        }
        activeLink = linkById.get(id);
        if (activeLink) {
            activeLink.classList.remove("text-neutral-400");
            activeLink.classList.add("text-sky-300", "bg-neutral-900/60");
        }
    }

    const io = new IntersectionObserver(
        (entries) => {
            let topmost = null;
            let topmostTop = Infinity;

            for (const e of entries) {
                if (e.isIntersecting && e.boundingClientRect.top < topmostTop) {
                    topmostTop = e.boundingClientRect.top;
                    topmost = e.target;
                }
            }

            if (topmost) setActive(topmost.id);
        },
        { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );

    for (const h of headings) io.observe(h);

    toc.addEventListener("click", (e) => {
        const a = e.target.closest("a.toc-link");
        if (a?.dataset.id) setActive(a.dataset.id);
    });
})();