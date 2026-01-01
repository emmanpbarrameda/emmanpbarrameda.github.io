import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.3.17/+esm";

let lenis = null;
let rafId = null;

const OFFSET = -100;
const HASH_DELAY_MS = 100;

const getTargetFromHash = (hash) => {
    if (!hash || hash === "#") return null;
    const id = decodeURIComponent(hash).slice(1);
    if (!id) return null;
    return document.getElementById(id);
};

const scrollToHash = (hash) => {
    if (!lenis) return;

    if (!hash || hash === "#") {
        lenis.scrollTo(0);
        return;
    }

    const target = getTargetFromHash(hash);
    if (!target) return;

    lenis.scrollTo(target, { offset: OFFSET });
};

const raf = (time) => {
    lenis && lenis.raf(time);
    rafId = requestAnimationFrame(raf);
};

const startRaf = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(raf);
};

const stopRaf = () => {
    if (rafId == null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
};

const isSamePageHashLink = (a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) return true;

    const url = new URL(a.href, window.location.href);
    return url.origin === window.location.origin && url.pathname === window.location.pathname && !!url.hash;
};

const onDocClick = (e) => {
    const a = e.target?.closest?.("a");
    if (!a) return;

    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const url = new URL(a.href, window.location.href);
    if (!isSamePageHashLink(a) || !url.hash) return;

    if (url.hash !== "#" && !getTargetFromHash(url.hash)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    history.pushState(null, "", url.hash);
    scrollToHash(url.hash);
};

const init = () => {
    if (lenis) return;

    lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;

    startRaf();
    setTimeout(() => scrollToHash(window.location.hash), HASH_DELAY_MS);

    document.addEventListener("click", onDocClick, true);
    window.addEventListener("popstate", () => scrollToHash(window.location.hash));
};

const destroy = () => {
    if (!lenis) return;

    document.removeEventListener("click", onDocClick, true);
    stopRaf();

    lenis.destroy();
    lenis = null;
    delete window.__lenis;
};

init();

document.addEventListener("astro:before-swap", destroy);
document.addEventListener("astro:after-swap", () => {
    destroy();
    init();
    setTimeout(() => scrollToHash(window.location.hash), 50);
});
