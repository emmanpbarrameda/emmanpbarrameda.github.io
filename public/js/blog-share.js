// public/js/blog-share.js
(function () {

    /** ================================
     * ! MARK: Setup & cached meta values
     * ================================ */
    var btns = document.querySelectorAll("[data-share-post]");
    if (!btns.length) return;

    var titleEl = document.querySelector("meta[property='og:title']");
    var descEl =
        document.querySelector("meta[property='og:description']") ||
        document.querySelector("meta[name='description']");
    var canonicalEl = document.querySelector("link[rel='canonical']");

    var title = (titleEl && titleEl.getAttribute("content")) || document.title || "Share";
    var text = (descEl && descEl.getAttribute("content")) || "";
    var url = (canonicalEl && canonicalEl.getAttribute("href")) || window.location.href;

    // Native share intent (must be https)
    var canNativeShare =
        !!(window.navigator &&
            typeof window.navigator.share === "function" &&
            window.isSecureContext);

    /** ================================
     * ! MARK: Clipboard helpers
     * ================================ */

    // Fallback for older browsers (execCommand)
    function fallbackCopy(str) {
        var ta = null;
        var ok = false;

        try {
            ta = document.createElement("textarea");
            ta.value = str;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.top = "0";
            ta.style.left = "0";
            ta.style.width = "2em";
            ta.style.height = "2em";
            ta.style.padding = "0";
            ta.style.border = "none";
            ta.style.outline = "none";
            ta.style.boxShadow = "none";
            ta.style.background = "transparent";
            ta.style.opacity = "0";
            ta.style.zIndex = "-1";

            document.body.appendChild(ta);
            ta.focus();
            ta.select();

            try {
                ta.setSelectionRange(0, str.length);
            } catch (e) { }

            var doc = /** @type {any} */ (document);
            var execCmd = doc.execCommand;
            if (typeof execCmd === "function") {
                ok = execCmd.call(doc, "copy");
            }

        } catch (err) {
            ok = false;
        } finally {
            if (ta && ta.parentNode) ta.parentNode.removeChild(ta);
        }

        return ok;
    }

    // fallback if needed
    function copy(str, callback) {
        if (
            window.navigator &&
            window.navigator.clipboard &&
            typeof window.navigator.clipboard.writeText === "function" &&
            window.isSecureContext
        ) {
            window.navigator.clipboard
                .writeText(str)
                .then(function () { callback(true); })
                .catch(function () { callback(fallbackCopy(str)); });
        } else {
            callback(fallbackCopy(str));
        }
    }

    /** ================================
     * ! MARK: Toast feedback
     * ================================ */
    function toast(msg, isError) {
        var existing = document.getElementById("share-toast");
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        var t = document.createElement("div");
        t.id = "share-toast";
        t.appendChild(document.createTextNode(msg));

        t.style.position = "fixed";
        t.style.bottom = "24px";
        t.style.left = "50%";
        t.style.transform = "translateX(-50%)";
        t.style.zIndex = "9999";
        t.style.padding = "8px 16px";
        t.style.borderRadius = "8px";
        t.style.fontSize = "12px";
        t.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

        if (isError) {
            t.style.backgroundColor = "rgba(127, 29, 29, 0.95)";
            t.style.color = "#fecaca";
            t.style.border = "1px solid rgba(153, 27, 27, 0.6)";
        } else {
            t.style.backgroundColor = "rgba(23, 23, 23, 0.95)";
            t.style.color = "#e5e5e5";
            t.style.border = "1px solid rgba(38, 38, 38, 0.6)";
        }

        document.body.appendChild(t);

        setTimeout(function () {
            if (t && t.parentNode) t.parentNode.removeChild(t);
        }, 2000);
    }

    function copyAndToast() {
        copy(url, function (ok) {
            toast(ok ? "Link copied!" : "Couldn't copy link", !ok);
        });
    }

    /** ================================
     * ! MARK: Click handler
     * ================================ */
    function handleShare(e) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        // FIRST: native share
        if (canNativeShare) {
            navigator
                .share({ title: title, text: text, url: url })
                .then(function () {
                })
                .catch(function (err) {
                    // SECOND: Fallback
                    if (!err || err.name !== "AbortError") copyAndToast();
                });
            return;
        }

        // SECOND: Fallback
        copyAndToast();
    }

    /** ================================
     * ! MARK: Bind events
     * ================================ */
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", handleShare, false);
    }
})();