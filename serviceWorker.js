const staticAnimeshData = "site-cache-v1";
const assets = [
  //   "/",
  "/index.html",
  "/assets/css/styles.css",
  "/assets/css/swiper-bundle.min.css",
  "/assets/js/main.js",
  "/assets/js/swiper-bundle.min.js",
  "/assets/pdf/Animesh_Rawat_resume.pdf",
  "/assets/img/blob.svg",
  "/assets/img/about-me.png",
  "/assets/img/profile.jpg",
  "/assets/img/code-svg.svg",
  "/assets/img/skills/android.svg",
  "/assets/img/skills/c.svg",
  "/assets/img/skills/c++.svg",
  "/assets/img/skills/css.svg",
  "/assets/img/skills/html.svg",
  "/assets/img/skills/java.svg",
  "/assets/img/skills/javascript.svg",
  "/assets/img/skills/mysql.svg",
  "/assets/img/skills/vb.net.svg",
];


self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticAnimeshData).then((cache) => {
      return cache.addAll(assets).catch((error) => {
        console.error("Failed to cache assets:", error);
        const failedAssets = assets.filter((asset) =>
          error.message.includes(asset)
        );
        console.log("Failed to cache these assets:", failedAssets);
      });
    })
  );
});


self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
