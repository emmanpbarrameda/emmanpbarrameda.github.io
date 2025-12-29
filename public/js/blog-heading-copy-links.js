// public/js/blog-heading-copy-links.js
(() => {
    const isMobile = () => matchMedia("(pointer:coarse),(max-width:768px)").matches;

    async function copy(text) {
        if (navigator.clipboard?.writeText) {
            try { await navigator.clipboard.writeText(text); return true; } catch { }
        }
        const ta = Object.assign(document.createElement("textarea"), {
            value: text, readOnly: true, style: "position:fixed;opacity:0"
        });
        document.body.append(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        
        const doc = /** @type {any} */ (document);
        const execCommand = typeof doc.execCommand === "function" ? doc.execCommand.bind(doc) : null;
        const ok = execCommand ? execCommand("copy") : false;

        ta.remove();
        return ok;
    }

    function toast(msg, rect) {
        const t = document.createElement("div");
        t.textContent = msg;
        t.className = "fixed z-[9999] rounded border border-neutral-800/60 bg-neutral-900/95 px-2 py-1 text-xs text-neutral-200 shadow";
        Object.assign(t.style, rect
            ? { left: `${Math.min(rect.right + 8, innerWidth - 100)}px`, top: `${rect.top}px`, transform: "translateY(-50%)" }
            : { left: "50%", bottom: "1rem", transform: "translateX(-50%)" }
        );
        document.body.append(t);
        setTimeout(() => t.remove(), 900);
    }

    document.addEventListener("pointerup", async (e) => {
        const a = e.target.closest?.("a.heading-anchor-link");
        if (!a?.getAttribute("href")?.startsWith("#")) return;
        e.preventDefault();
        history.pushState(null, "", a.getAttribute("href"));
        const ok = await copy(location.href);
        toast(ok ? "Link copied!" : "Copy failed", isMobile() ? null : a.getBoundingClientRect());
    }, true);
})();