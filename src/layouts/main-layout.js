// file: src/layouts/main-layout.js

(function () {
    // -- disable right click
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // -- disable key combos
    document.addEventListener("keydown", (e) => {
        // -- Ctrl+Shift+C or Cmd+Shift+C
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
            e.preventDefault();
            return false;
        }
        // -- Ctrl+Shift+I or Cmd+Shift+I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
            e.preventDefault();
            return false;
        }
        // -- F12
        if (e.key === "F12") {
            e.preventDefault();
            return false;
        }
        // -- Ctrl+U or Cmd+U
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
            e.preventDefault();
            return false;
        }
    });


    // -- disable dragging
    document.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
    });

    // -- Open blog-content links in a new tab
    function openBlogLinksInNewTab() {
        document.querySelectorAll(".blog-content a[href]").forEach((a) => {
            const href = a.getAttribute("href") || "";
            if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
        });
    }

    //  full load
    window.addEventListener("load", () => {
        openBlogLinksInNewTab();

        const loader = document.getElementById("loading-screen");
        if (loader) {
            loader.style.opacity = "0";
            loader.style.pointerEvents = "none";
            setTimeout(() => loader.remove(), 500);
        }
    });

    // Astro client-side navigation
    document.addEventListener("astro:page-load", openBlogLinksInNewTab);
})();
