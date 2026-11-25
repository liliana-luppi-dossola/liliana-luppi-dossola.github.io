(function () {
  const P = window.PAINTINGS;
  const $ = (s) => document.querySelector(s);
  const EMAIL = "lilianawings@yahoo.com";

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- grid ----------
  const grid = $("#grid");
  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  P.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "card";
    b.dataset.cat = p.category;
    b.dataset.slug = p.slug;
    b.setAttribute("aria-label", `${p.title}, ${p.medium}. Open viewing room.`);
    b.innerHTML = `
      <span class="frame">
        <img src="images/${p.slug}-thumb.jpg" alt="${p.title}" loading="lazy" width="${p.w}" height="${p.h}">
        <span class="listen">${playIcon} View &amp; listen</span>
      </span>
      <span class="label">
        <span class="t">${p.title}</span>
        <span class="m">${p.medium}${p.size ? " · " + p.size : ""}</span>
        <span class="ed">Inquire about limited edition prints</span>
      </span>`;
    b.addEventListener("click", () => openRoom(i));
    grid.appendChild(b);
  });

  // reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".card").forEach((c) => io.observe(c));

  // filters
  document.querySelectorAll(".filter").forEach((f) => f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
    f.classList.add("active"); f.setAttribute("aria-selected", "true");
    const cat = f.dataset.filter;
    document.querySelectorAll(".card").forEach((c) => {
      c.classList.toggle("hide", cat !== "All" && c.dataset.cat !== cat);
    });
  }));

  // ---------- audio ----------
  const audio = $("#audio");
  const toggle = $("#soundToggle");
  let soundOn = true;
  try { soundOn = localStorage.getItem("ld-sound") !== "off"; } catch (e) {}
  let fadeTimer = null;

  function setToggle() {
    toggle.setAttribute("aria-pressed", String(soundOn));
    toggle.querySelector(".sound-label").textContent = soundOn ? "Music on" : "Music off";
    toggle.classList.toggle("playing", soundOn && !audio.paused);
  }
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    const start = audio.volume, steps = Math.max(1, Math.round(ms / 40)); let k = 0;
    fadeTimer = setInterval(() => {
      k++; audio.volume = Math.min(1, Math.max(0, start + (target - start) * (k / steps)));
      if (k >= steps) { clearInterval(fadeTimer); done && done(); }
    }, 40);
  }
  function playTrack(slug) {
    const src = `music/${slug}.mp3`;
    const begin = () => {
      if (!audio.src.endsWith(src)) { audio.src = src; audio.currentTime = 0; }
      audio.volume = 0;
      const pr = audio.play();
      if (pr && pr.catch) pr.catch(() => updatePlayer());
      fadeTo(0.85, 900);
      updatePlayer();
    };
    if (!audio.paused) fadeTo(0, 350, begin); else begin();
  }
  function stopTrack(ms = 600) {
    if (audio.paused) return;
    fadeTo(0, ms, () => { audio.pause(); updatePlayer(); });
  }
  function updatePlayer() {
    $("#player").classList.toggle("playing", !audio.paused);
    $("#playBtn").setAttribute("aria-label", audio.paused ? "Play music" : "Pause music");
    setToggle();
  }
  audio.addEventListener("play", updatePlayer);
  audio.addEventListener("pause", updatePlayer);
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) $("#barFill").style.width = (audio.currentTime / audio.duration * 100) + "%";
  });

  toggle.addEventListener("click", () => {
    soundOn = !soundOn;
    try { localStorage.setItem("ld-sound", soundOn ? "on" : "off"); } catch (e) {}
    if (!soundOn) stopTrack(400);
    else if (current >= 0) playTrack(P[current].slug);
    setToggle();
  });
  $("#playBtn").addEventListener("click", () => {
    if (audio.paused) { soundOn = true; try { localStorage.setItem("ld-sound", "on"); } catch (e) {} playTrack(P[current].slug); }
    else stopTrack(400);
  });

  // ---------- viewing room ----------
  const room = $("#room");
  let current = -1, lastFocus = null;

  function fill(i) {
    const p = P[i];
    const img = $("#roomImg");
    img.classList.add("swap");
    const next = new Image();
    next.onload = () => { img.src = next.src; img.alt = p.title; requestAnimationFrame(() => img.classList.remove("swap")); };
    next.src = `images/${p.slug}.jpg`;
    $("#roomCat").textContent = `${p.category} · Plate ${String(i + 1).padStart(2, "0")} of ${P.length}`;
    $("#roomTitle").textContent = p.title;
    const specs = [["Medium", p.medium]];
    if (p.size) specs.push(["Size", p.size]);
    if (p.location) specs.push(["Place", p.location]);
    $("#roomSpecs").innerHTML = specs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    $("#roomDesc").textContent = p.description;
    const subj = encodeURIComponent(`Limited edition prints: "${p.title}"`);
    const body = encodeURIComponent(`Hello Liliana,\n\nI'm interested in a limited edition print of your painting "${p.title}". Could you tell me more about the sizes and availability?\n\nThank you,\n`);
    $("#roomInquire").href = `mailto:${EMAIL}?subject=${subj}&body=${body}`;
    $("#trackTitle").textContent = `“${p.track}”`;
    $("#trackMood").textContent = p.mood;
    $("#barFill").style.width = "0%";
    history.replaceState(null, "", "#" + p.slug);
  }

  function openRoom(i) {
    lastFocus = document.activeElement;
    current = i;
    fill(i);
    room.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => room.classList.add("open"));
    $("#roomClose").focus();
    if (soundOn) playTrack(P[i].slug); else updatePlayer();
  }
  function closeRoom() {
    room.classList.remove("open");
    stopTrack(500);
    setTimeout(() => { room.hidden = true; document.body.style.overflow = ""; }, 450);
    history.replaceState(null, "", location.pathname + location.search + "#collection");
    current = -1;
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  function step(d) {
    current = (current + d + P.length) % P.length;
    fill(current);
    if (soundOn) playTrack(P[current].slug);
  }

  $("#roomClose").addEventListener("click", closeRoom);
  $("#roomPrev").addEventListener("click", () => step(-1));
  $("#roomNext").addEventListener("click", () => step(1));
  room.addEventListener("click", (e) => { if (e.target.classList.contains("room-wall")) closeRoom(); });
  document.addEventListener("keydown", (e) => {
    if (room.hidden) return;
    if (e.key === "Escape") closeRoom();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // swipe on touch
  let tx = null;
  room.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  room.addEventListener("touchend", (e) => {
    if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  });

  document.querySelectorAll("[data-open]").forEach((el) => el.addEventListener("click", () => {
    openRoom(P.findIndex((p) => p.slug === el.dataset.open));
  }));

  // deep link: site.com/#california-sunset opens that painting (music starts on first tap)
  const hash = location.hash.slice(1);
  const di = P.findIndex((p) => p.slug === hash);
  if (di >= 0) openRoom(di);

  setToggle();
})();
