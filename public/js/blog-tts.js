// public/js/blog-tts.js
(() => {

    /** ================================
     * ! MARK: Guards & root
     * ================================ */
    const contentRoot = document.querySelector(".blog-content");
    if (!contentRoot || !window.speechSynthesis) return;

    /** ================================
     * ! MARK: State
     * ================================ */
    let utterance = null;
    let state = "idle"; 
    let originalHTML = null;
    let wordSpans = [];
    let currentWord = -1;
    let fallbackTimer = null;
    let startTime = 0;

    /** ================================
     * ! MARK: Timing helpers
     * ================================ */
    const WPM = 150;
    const getWordTime = (w) =>
        (60000 / WPM) * (w.length <= 3 ? 0.7 : w.length <= 6 ? 1 : 1.3);

    /** ================================
     * ! MARK: DOM helpers
     * ================================ */
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    /** ================================
     * ! MARK: UI state toggles
     * ================================ */
    const setUI = (newState) => {
        state = newState;
        const isPlaying = state === "playing";
        const isPaused = state === "paused";

        // Play/Pause label & icon
        $$("[data-tts-label]").forEach((el) =>
            (el.textContent = isPlaying ? "Pause" : "Play")
        );
        $$("[data-tts-icon]").forEach((el) => {
            el.innerHTML = isPlaying
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14l11-7z"></path>';
        });

        // Stop (only when playing)
        $$("[data-tts-stop]").forEach((el) => {
            el.classList.toggle("hidden", !isPlaying);
            el.classList.toggle("flex", isPlaying);
        });

        // Restart (only when paused)
        $$("[data-tts-restart]").forEach((el) => {
            el.classList.toggle("hidden", !isPaused);
            el.classList.toggle("flex", isPaused);
        });
    };

    /** ================================
     * ! MARK: Word wrapping & cleanup
     * ================================ */
    function wrapWords() {
        originalHTML = contentRoot.innerHTML;
        wordSpans = [];

        const walker = document.createTreeWalker(
            contentRoot,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (n) => {
                    const p = n.parentElement;
                    if (
                        !p ||
                        /^(script|style|pre|code|nav|aside|button)$/i.test(
                            p.tagName
                        )
                    )
                        return NodeFilter.FILTER_REJECT;
                    if (
                        p.classList.contains("heading-anchor-link") ||
                        !n.textContent.trim()
                    )
                        return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                },
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach((node) => {
            const frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach((part) => {
                if (/^\s*$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement("span");
                    span.className = "tts-word";
                    span.textContent = part;
                    wordSpans.push(span);
                    frag.appendChild(span);
                }
            });
            node.parentNode.replaceChild(frag, node);
        });
        document.dispatchEvent(new CustomEvent("tts:domchange"));
    }
    function cleanup() {
        clearInterval(fallbackTimer);
        if (originalHTML) {
            contentRoot.innerHTML = originalHTML;
            document.dispatchEvent(new CustomEvent("tts:cleanup"));
        }
        originalHTML = null;
        wordSpans = [];
        currentWord = -1;
    }

    /** ================================
     * ! MARK: Highlighting & TOC sync
     * ================================ */
    function highlight(i) {
        if (wordSpans[currentWord])
            wordSpans[currentWord].classList.remove("tts-active");
        currentWord = i;
        if (wordSpans[i]) {
            wordSpans[i].classList.add("tts-active");

            const rect = wordSpans[i].getBoundingClientRect();
            if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
                wordSpans[i].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            updateTOCForWord(wordSpans[i]);
        }
    }

    function updateTOCForWord(wordEl) {
        // Walk backwards to find nearest heading
        let node = wordEl;
        while (node && node !== contentRoot) {
            let sibling = node.previousElementSibling;
            while (sibling) {
                const heading = sibling.matches("h1, h2, h3")
                    ? sibling
                    : sibling.querySelector("h1, h2, h3");
                if (heading?.id) {
                    document.dispatchEvent(
                        new CustomEvent("tts:heading", { detail: heading.id })
                    );
                    return;
                }
                sibling = sibling.previousElementSibling;
            }
            node = node.parentElement;
        }

        // Fallback: last heading before word
        const headings = contentRoot.querySelectorAll("h1[id], h2[id], h3[id]");
        let lastHeading = null;
        for (const h of headings) {
            if (wordEl.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_PRECEDING) {
                lastHeading = h;
            } else {
                break;
            }
        }
        if (lastHeading) {
            document.dispatchEvent(
                new CustomEvent("tts:heading", { detail: lastHeading.id })
            );
        }
    }

    /** ================================
     * ! MARK: Fallback timing
     * ================================ */
    function startFallback() {
        let cumulative = 0;
        const timings = wordSpans.map((s) => {
            const t = cumulative;
            cumulative += getWordTime(s.textContent);
            return t;
        });

        startTime = Date.now();
        fallbackTimer = setInterval(() => {
            if (state !== "playing") return;
            const elapsed = Date.now() - startTime;
            const idx = timings.findLastIndex((t) => elapsed >= t);
            if (idx !== currentWord && idx >= 0) highlight(idx);
        }, 50);
    }


    /** ================================
     * ! MARK: TTS core
     * ================================ */
    function speak() {
        wrapWords();
        if (!wordSpans.length) return cleanup();

        const positions = [];
        let text = "";

        wordSpans.forEach((s, i) => {
            const word = s.textContent;
            const start = text.length;
            text += word;
            positions.push({ start, end: text.length, i });

            if (/[.!?]$/.test(word)) {
                text += " ..... "; // long pause
            } else if (/[,;:]$/.test(word)) {
                text += " ... ";   // short pause
            } else if (/[—–-]$/.test(word)) {
                text += " ... ";   // dash pause
            } else {
                text += " ";       // normal space
            }
        });

        if (!text.trim()) return cleanup();

        speechSynthesis.cancel();
        utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;

        let boundaryWorks = false;
        utterance.onboundary = (e) => {
            if (e.name === "word") {
                if (!boundaryWorks) {
                    boundaryWorks = true;
                    clearInterval(fallbackTimer);
                }
                const match = positions.find(
                    (p) => e.charIndex >= p.start && e.charIndex < p.end
                );
                if (match) highlight(match.i);
            }
        };

        utterance.onstart = () => {
            setUI("playing");
            highlight(0);
            setTimeout(() => !boundaryWorks && state === "playing" && startFallback(), 500);
        };

        utterance.onend = utterance.onerror = () => {
            setUI("idle");
            cleanup();
        };

        speechSynthesis.speak(utterance);

        // Chrome keep-alive
        if (/Chrome/.test(navigator.userAgent)) {
            const keepAlive = setInterval(() => {
                if (state !== "playing") return clearInterval(keepAlive);
                speechSynthesis.pause();
                speechSynthesis.resume();
            }, 10000);
        }
    }


    /** ================================
     * ! MARK: Controls
     * ================================ */
    function stop() {
        speechSynthesis.cancel();
        setUI("idle");
        cleanup();
    }
    function restart() {
        stop();
        setTimeout(speak, 50);
    }
    function toggle() {
        if (state === "playing") {
            speechSynthesis.pause();
            setUI("paused");
        } else if (state === "paused") {
            speechSynthesis.resume();
            setUI("playing");
        } else {
            speak();
        }
    }


    /** ================================
     * ! MARK: Events
     * ================================ */
    $$("[data-tts-toggle]").forEach((btn) =>
        btn.addEventListener("click", (e) => (e.preventDefault(), toggle()))
    );
    $$("[data-tts-stop]").forEach((btn) =>
        btn.addEventListener("click", (e) => (e.preventDefault(), stop()))
    );
    $$("[data-tts-restart]").forEach((btn) =>
        btn.addEventListener("click", (e) => (e.preventDefault(), restart()))
    );

    /** ================================
     * ! MARK: Keyboard shortcuts
     * ================================ */
    document.addEventListener("keydown", (e) => {
        if (e.target.matches("input, textarea, [contenteditable]")) return;

        switch (e.code) {
            case "Space":
                if (state !== "idle") {
                    e.preventDefault();
                    toggle();
                }
                break;
            case "KeyR":
                if (state !== "idle") {
                    e.preventDefault();
                    restart();
                }
                break;
            case "Escape":
                if (state !== "idle") {
                    e.preventDefault();
                    stop();
                }
                break;
        }
    });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => (speechSynthesis.cancel(), cleanup()));

    // start initialiZation
    setUI("idle");
})();