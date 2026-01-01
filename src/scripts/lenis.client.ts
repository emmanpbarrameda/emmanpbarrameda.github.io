// file: src\scripts\lenis.client.ts
import Lenis from "lenis";

declare global {
    interface Window {
        __lenis?: Lenis;
        __lenisDebug?: boolean;
    }
}

let lenis: Lenis | null = null;
let rafId: number | null = null;

const OFFSET = -100;
const HASH_DELAY_MS = 100;

/** Toggle debug by visiting: /?lenis=1 (or adding &lenis=1) */
const DEBUG =
    (typeof window !== "undefined" &&
        (new URLSearchParams(window.location.search).get("lenis") === "1" ||
            window.__lenisDebug === true)) ||
    false;

const log = (...args: any[]) => {
    if (!DEBUG) return;
    console.log("[lenis]", ...args);
};

const warn = (...args: any[]) => {
    if (!DEBUG) return;
    console.warn("[lenis]", ...args);
};

const getTargetFromHash = (hash: string): HTMLElement | null => {
    if (!hash || hash === "#") return null;

    const id = decodeURIComponent(hash).slice(1);
    if (!id) return null;

    const el = document.getElementById(id);
    if (DEBUG) log("getTargetFromHash", { hash, id, found: !!el });
    return el;
};

const scrollToHash = (hash: string, reason = "unknown") => {
    if (!lenis) {
        if (DEBUG) warn("scrollToHash skipped (lenis not ready)", { hash, reason });
        return;
    }

    if (!hash || hash === "#") {
        log("scrollToHash -> top", { hash, reason });
        lenis.scrollTo(0);
        return;
    }

    const target = getTargetFromHash(hash);
    if (!target) {
        warn("scrollToHash target not found", { hash, reason });
        return;
    }

    log("scrollToHash -> element", { hash, reason, offset: OFFSET });
    lenis.scrollTo(target, { offset: OFFSET });
};

const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
};

const startRaf = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(raf);
    log("raf started");
};

const stopRaf = () => {
    if (rafId == null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    log("raf stopped");
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
    if (url.hash !== "#" && !getTargetFromHash(url.hash)) {
        log("click ignored (hash target missing)", { href: a.getAttribute("href"), hash: url.hash });
        return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    history.pushState(null, "", url.hash);
    log("anchor click handled", { href: a.getAttribute("href"), hash: url.hash });

    scrollToHash(url.hash, "click");
};

const initLenis = () => {
    if (lenis) {
        log("init skipped (already initialized)");
        return;
    }

    lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
    });

    window.__lenis = lenis;

    log("initialized", {
        duration: 1.2,
        smoothWheel: true,
        offset: OFFSET,
        reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? null,
    });

    // Debug: prove scroll events are firing
    if (DEBUG && typeof (lenis as any).on === "function") {
        (lenis as any).on("scroll", (e: any) => {
            // keep this lightweight
            log("scroll", { y: lenis?.scroll, velocity: e?.velocity });
        });
    }

    startRaf();

    setTimeout(() => scrollToHash(window.location.hash, "initial-hash"), HASH_DELAY_MS);

    // Capture phase so we beat native hash-jump
    document.addEventListener("click", onDocClick, true);
    log("document click capture attached");

    // Back/forward navigation
    window.addEventListener("popstate", () => scrollToHash(window.location.hash, "popstate"));
    log("popstate attached");
};

const destroyLenis = () => {
    if (!lenis) {
        log("destroy skipped (not initialized)");
        return;
    }

    document.removeEventListener("click", onDocClick, true);
    stopRaf();

    lenis.destroy();
    lenis = null;
    delete window.__lenis;

    log("destroyed");
};

initLenis();

document.addEventListener("astro:before-swap", () => {
    log("astro:before-swap");
    destroyLenis();
});

document.addEventListener("astro:after-swap", () => {
    log("astro:after-swap");
    destroyLenis();
    initLenis();
    setTimeout(() => scrollToHash(window.location.hash, "after-swap-hash"), 50);
});
