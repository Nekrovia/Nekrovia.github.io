const navToggle = document.getElementById("navToggle");
const navbar = document.getElementById("navbar");

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navbar.classList.remove("open"));
  });
}

const copyIpBtn = document.getElementById("copyIpBtn");

if (copyIpBtn) {
  copyIpBtn.addEventListener("click", async () => {
    const ip = copyIpBtn.dataset.ip;
    try {
      await navigator.clipboard.writeText(ip);
    } catch (err) {
      const temp = document.createElement("textarea");
      temp.value = ip;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }

    const originalText = copyIpBtn.textContent;
    copyIpBtn.textContent = "Skopiowano!";
    copyIpBtn.classList.add("copied");

    setTimeout(() => {
      copyIpBtn.textContent = originalText;
      copyIpBtn.classList.remove("copied");
    }, 2000);
  });
}

const galleryItems = document.querySelectorAll(".gallery-item");

if (galleryItems.length) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const items = Array.from(galleryItems);
  let currentIndex = 0;

  const show = (index) => {
    currentIndex = (index + items.length) % items.length;
    lightboxImg.src = items[currentIndex].dataset.full;
    lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  };

  const open = (index) => {
    show(index);
    lightbox.classList.add("open");
  };

  const close = () => {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
  });

  document.getElementById("lightboxClose").addEventListener("click", close);
  document.getElementById("lightboxPrev").addEventListener("click", () => show(currentIndex - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });
}

document.querySelectorAll(".video-wrap[data-video-id]").forEach((wrap) => {
  const playBtn = wrap.querySelector(".video-play");
  if (!playBtn) return;

  playBtn.addEventListener("click", () => {
    const id = wrap.dataset.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = wrap.dataset.videoTitle || "Nekrovia - gameplay";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    wrap.innerHTML = "";
    wrap.appendChild(iframe);
  });
});

const statusBanners = document.querySelectorAll(".live-status-banner");

if (statusBanners.length) {
  const refreshBanners = () => {
    statusBanners.forEach((banner) => {
      banner.src = `${banner.dataset.bannerSrc}?t=${Date.now()}`;
    });
  };
  setInterval(refreshBanners, 60000);
}

const modListItems = document.querySelectorAll(".mod-list-item");

if (modListItems.length) {
  const modPanels = document.querySelectorAll(".mod-panel");

  modListItems.forEach((item) => {
    item.addEventListener("click", () => {
      modListItems.forEach((i) => i.classList.remove("active"));
      modPanels.forEach((p) => p.classList.remove("active"));

      item.classList.add("active");
      const panel = document.getElementById(`mod-${item.dataset.mod}`);
      if (panel) panel.classList.add("active");

      if (window.innerWidth < 900) {
        document.getElementById("modDetail").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
