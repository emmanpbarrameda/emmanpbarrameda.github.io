const staticEmmanData = "site-cache-v1";
const assets = [
  //   "/",
  "index.html",
  "assets/css/styles.css",
  "assets/css/swiper-bundle.min.css",
  "assets/css/animate.min.css",
  "assets/js/main.js",
  "assets/js/swiper-bundle.min.js",
  "assets/js/svg-inject.min.js",
  "assets/js/smtp.js",
  "assets/pdf/emmanpbarrameda_resume.pdf",
  "assets/img/about-me.png",
  "assets/img/about-me2.png",
  "assets/img/about_slider2.jpg",
  "assets/img/about_slider3.jpg",
  "assets/img/about_slider4.jpg",
  "assets/img/blob.svg",
  "assets/img/code-svg.svg",
  "assets/img/emmanpbarrameda-logo-1x1-white_transparent_svg.svg",
  "assets/img/emmanpbarrameda-logo-1x1-white_transparent.png",
  "assets/img/emmanpbarrameda-logo-white_transparent.png",
  "assets/img/profile.png",
  "assets/img/profile2.png",
  "assets/img/profile3.png",
  "assets/img/profile4.png",
  "assets/img/skills/android.svg",
  "assets/img/skills/c.svg",
  "assets/img/skills/c++.svg",
  "assets/img/skills/css.svg",
  "assets/img/skills/git.svg",
  "assets/img/skills/github.svg",
  "assets/img/skills/html.svg",
  "assets/img/skills/java.svg",
  "assets/img/skills/javascript.svg",
  "assets/img/skills/php.svg",
  "assets/img/skills/laravel.svg",
  "assets/img/skills/bootstrap.svg",
  "assets/img/skills/mysql.svg",
  "assets/img/skills/photoshop.svg",
  "assets/img/skills/vb.net.svg",
  "assets/img/skills/figma.svg",
  "assets/img/skills/unity.svg",
  "assets/img/skills/tailwind.svg",
  "assets/img/certs/cert-best-in-ict.jpeg",
  "assets/img/certs/cert-best-thesis.jpeg",
  "assets/img/certs/cert-with-honor-shs.jpeg",
  "assets/img/certs/cert-tech-together.jpg",
  "assets/img/certs_courses/c.jpg",
  "assets/img/certs_courses/cpp.jpg",
  "assets/img/certs_courses/html.jpg",
  "assets/img/certs_courses/java.jpg",
];


self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticEmmanData).then((cache) => {
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
