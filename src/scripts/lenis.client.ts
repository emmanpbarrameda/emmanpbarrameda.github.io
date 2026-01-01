// file: src\scripts\lenis.client.ts
import Lenis from "lenis";

declare global {
    interface Window {
        __lenis?: Lenis;
    }
}

let lenis: Lenis | null = null;
let rafId: number | null = null;

const OFFSET = -100;
const HASH_DELAY_MS = 100;

const getTargetFromHash = (hash: string): HTMLElement | null => {
    if (!hash || hash === "#") return null;

    // Supports ids like "#14-run-laravel-sail" (invalid CSS selector, valid HTML id)
    const id = decodeURIComponent(hash).slice(1);
    if (!id) return null;

    return document.getElementById(id);
};

const scrollToHash = (hash: string) => {
    if (!lenis) return;

    if (!hash || hash === "#") {
        lenis.scrollTo(0);
        return;
    }

    const target = getTargetFromHash(hash);
    if (!target) return;

    lenis.scrollTo(target, { offset: OFFSET });
};

const raf = (time: number) => {
    lenis?.raf(time);
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

const isSamePageHashLink = (a: HTMLAnchorElement) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("#")) return true;

    const url = new URL(a.href, window.location.href);
    return url.origin === window.location.origin && url.pathname === window.location.pathname && !!url.hash;
};

const onDocClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
    if (!a) return;

    // left click only, no modifiers
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const url = new URL(a.href, window.location.href);
    if (!isSamePageHashLink(a) || !url.hash) return;

    // "#" = top
    if (url.hash !== "#" && !getTargetFromHash(url.hash)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    history.pushState(null, "", url.hash);
    scrollToHash(url.hash);
};

const initLenis = () => {
    if (lenis) return;

    lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
    });

    window.__lenis = lenis;

    startRaf();

    // Handle initial hash
    setTimeout(() => scrollToHash(window.location.hash), HASH_DELAY_MS);

    // Capture phase so we beat native hash-jump
    document.addEventListener("click", onDocClick, true);

    // Back/forward navigation
    window.addEventListener("popstate", () => scrollToHash(window.location.hash));
};

const destroyLenis = () => {
    if (!lenis) return;

    document.removeEventListener("click", onDocClick, true);
    stopRaf();

    lenis.destroy();
    lenis = null;
    delete window.__lenis;
};

initLenis();

document.addEventListener("astro:before-swap", destroyLenis);
document.addEventListener("astro:after-swap", () => {
    destroyLenis();
    initLenis();
    setTimeout(() => scrollToHash(window.location.hash), 50);
});
