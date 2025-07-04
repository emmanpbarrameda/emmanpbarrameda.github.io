export function initLightbox(id, previews) {
  if (!window.FsLightbox) {
    console.error("FsLightbox not loaded");
    return;
  }

  window.FsLightboxInstances = window.FsLightboxInstances || {};
  window.FsLightboxInstances[id] = new window.FsLightbox({ sources: previews });

  const trigger = document.querySelector(`[data-lightbox-id="${id}"]`);
  if (trigger) {
    trigger.addEventListener("click", () => {
      setTimeout(() => {
        window.FsLightboxInstances[id].open();
      }, 0);
    });
  }
}
