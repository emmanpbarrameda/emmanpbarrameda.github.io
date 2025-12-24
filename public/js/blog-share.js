// public/js/blog-share.js
(() => {
    const btns = document.querySelectorAll("[data-share-post]");
    if (!btns.length) return;

    async function copy(text) {
        if (navigator.clipboard?.writeText) {
            try { await navigator.clipboard.writeText(text); return true; } catch { }
        }
        const ta = Object.assign(document.createElement("textarea"), {
            value: text, readOnly: true, style: "position:fixed;opacity:0;left:-9999px;top:-9999px"
        });
        document.body.append(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
    }

    function toast(msg) {
        const t = document.createElement("div");
        t.textContent = msg;
        t.className =
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-lg border border-neutral-800/60 bg-neutral-900/95 px-3 py-2 text-xs text-neutral-200 shadow";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1000);
    }

    async function handleShare() {
        const title =
            document.querySelector("meta[property='og:title']")?.getAttribute("content") ||
            document.title ||
            "Share";

        const text =
            document.querySelector("meta[property='og:description']")?.getAttribute("content") ||
            document.querySelector("meta[name='description']")?.getAttribute("content") ||
            "";

        const url =
            document.querySelector("link[rel='canonical']")?.getAttribute("href") ||
            location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch (err) {
                if (err?.name === "AbortError") return;
            }
        }

        const ok = await copy(url);
        toast(ok ? "Link copied!" : "Copy failed");
    }

    btns.forEach(btn => btn.addEventListener("click", handleShare));
})();