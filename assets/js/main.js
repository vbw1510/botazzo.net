/* =========================================================
   Botazzo.Net — v2 — scripts
   ========================================================= */
const CONFIG = {
  whatsapp: "5513991366128",
  mensagemPadrao: "Olá, Vitor! Vi o site da Botazzo.Net e gostaria de um orçamento.",

  /* ======== VÍDEOS DOS PROJETOS (prévia do portfólio) ========
     Cole aqui, entre as aspas, o link do vídeo do YouTube de cada projeto.
     Pode ser qualquer link: youtu.be/..., youtube.com/watch?v=..., ou de Shorts.
     Suba o vídeo como "NÃO LISTADO" (vídeo "Privado" não toca fora do YouTube).
     Deixe "" (vazio) enquanto o projeto não tiver vídeo. */
  videosProjetos: {
    "mt2-viber":     "",
    "terralia-farm": "",
    "viber-rpg":     "",
    "botazzo-os":    "",
    "atecedorstore": "",
    "bancada":       "",
  },

  /* -------- Na bancada: FOTOS --------
     Coloque as fotos em assets/img/manutencoes/ e liste aqui.
     A primeira foto aparece maior. */
  fotos: [
    { arquivo: "assets/img/manutencoes/foto-1.jpg", legenda: "Troca de tela de celular" },
    { arquivo: "assets/img/manutencoes/foto-2.jpg", legenda: "Limpeza e pasta térmica em notebook" },
    { arquivo: "assets/img/manutencoes/foto-3.jpg", legenda: "Montagem de PC gamer" },
    { arquivo: "assets/img/manutencoes/foto-4.jpg", legenda: "Diagnóstico de placa de TV" },
    { arquivo: "assets/img/manutencoes/foto-5.jpg", legenda: "Upgrade de SSD" },
    { arquivo: "assets/img/manutencoes/foto-6.jpg", legenda: "Cable management" },
  ],

  /* -------- Na bancada: VÍDEOS DO YOUTUBE --------
     Suba o vídeo como "Não listado" (vídeo "Privado" NÃO toca fora do YouTube).
     Copie só o código do link. Ex.: https://youtu.be/AbC123xYz  ->  id: "AbC123xYz"
     Para Shorts (vídeo em pé), use formato: "vertical". */
  videos: [
    { id: "", titulo: "Troca de tela passo a passo" },
    { id: "", titulo: "Montagem de PC gamer" },
    { id: "", titulo: "Limpeza completa de notebook" },
  ],

  /* true = mostra os espaços vazios com instruções (bom enquanto você monta o site).
     Mude para false antes de publicar: fotos/vídeos que não existirem ficam escondidos. */
  modoPreparo: true,
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- WhatsApp: cada botão pode ter sua própria mensagem ---------- */
function linkWhatsApp(msg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg || CONFIG.mensagemPadrao)}`;
}
$$("[data-wa]").forEach(a => {
  a.href = linkWhatsApp(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Header, barra de progresso, menu ---------- */
const header = $(".header");
const progress = $(".scroll-progress");
function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $(".menu-toggle");
const nav = $(".nav-links");
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
}));

/* ---------- Reveal ao rolar ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target) }
  });
}, { threshold: .14 });
$$(".reveal, .process").forEach(el => revealObs.observe(el));

/* ---------- Contadores ---------- */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, alvo = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    countObs.unobserve(el);
    if (reduceMotion) { el.textContent = pre + alvo + suf; return }
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(alvo * eased) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: .6 });
$$("[data-count]").forEach(el => countObs.observe(el));

/* ---------- Digitação (hero) ---------- */
const typer = $("#typer");
if (typer) {
  const frases = [
    "técnico em informática",
    "manutenção de celulares e notebooks",
    "conserto de computadores e TVs",
    "desenvolvedor full-stack",
    "criador de sites e sistemas",
    "jogos e aplicativos",
    "automação com IA",
  ];
  if (reduceMotion) typer.textContent = frases[0];
  else {
    let f = 0, c = 0, apagando = false;
    const loop = () => {
      const frase = frases[f];
      c += apagando ? -1 : 1;
      typer.textContent = frase.slice(0, c);
      let vel = apagando ? 32 : 65;
      if (!apagando && c === frase.length) { apagando = true; vel = 1700 }
      else if (apagando && c === 0) { apagando = false; f = (f + 1) % frases.length; vel = 350 }
      setTimeout(loop, vel);
    };
    setTimeout(loop, 900);
  }
}

/* ---------- Janela de código que se digita sozinha ---------- */
const codeEl = $("#code");
if (codeEl) {
  // Cada linha: [texto, classe]
  const linhas = [
    [["// botazzo.net — o que eu entrego", "c"]],
    [["const ", "k"], ["vitor", "f"], [" = {", ""]],
    [["  base", ""], [": ", ""], ["\"Mongaguá - SP\"", "s"], [",", ""]],
    [["  front", ""], [": [", ""], ["\"React\"", "s"], [", ", ""], ["\"TypeScript\"", "s"], [", ", ""], ["\"Tailwind\"", "s"], ["],", ""]],
    [["  back", ""], [": [", ""], ["\"Node.js\"", "s"], [", ", ""], ["\"Express\"", "s"], [", ", ""], ["\"Prisma\"", "s"], ["],", ""]],
    [["  dados", ""], [": [", ""], ["\"PostgreSQL\"", "s"], [", ", ""], ["\"MariaDB\"", "s"], ["],", ""]],
    [["  bancada", ""], [": [", ""], ["\"celular\"", "s"], [", ", ""], ["\"notebook\"", "s"], [", ", ""], ["\"PC\"", "s"], [", ", ""], ["\"TV\"", "s"], ["],", ""]],
    [["  projetos", ""], [": ", ""], ["9", "n"], [",", ""]],
    [["};", ""]],
    [["", ""]],
    [["async function ", "k"], ["resolver", "f"], ["(", ""], ["problema", "n"], [") {", ""]],
    [["  const ", "k"], ["plano", ""], [" = ", ""], ["await ", "k"], ["diagnosticar", "f"], ["(problema);", ""]],
    [["  return ", "k"], ["entregar", "f"], ["(plano, { ", ""], ["prazo", ""], [": ", ""], ["\"combinado\"", "s"], [" });", ""]],
    [["}", ""]],
  ];
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const render = (li, ch) => {
    let html = "";
    for (let i = 0; i <= li && i < linhas.length; i++) {
      let restante = i < li ? Infinity : ch;
      for (const [txt, cls] of linhas[i]) {
        if (restante <= 0) break;
        const parte = txt.slice(0, restante);
        restante -= txt.length;
        html += cls ? `<span class="${cls}">${esc(parte)}</span>` : esc(parte);
      }
      if (i < li) html += "\n";
    }
    codeEl.innerHTML = html + '<span class="cur"></span>';
  };
  const total = linhas.map(l => l.reduce((n, [t]) => n + t.length, 0));
  if (reduceMotion) render(linhas.length - 1, Infinity);
  else {
    let started = false;
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting || started) return;
      started = true; o.disconnect();
      let li = 0, ch = 0;
      const step = () => {
        render(li, ch);
        if (ch < total[li]) { ch++; setTimeout(step, 18 + Math.random() * 30) }
        else if (li < linhas.length - 1) { li++; ch = 0; setTimeout(step, 120) }
      };
      step();
    }, { threshold: .4 }).observe(codeEl);
  }
}

/* ---------- Brilho que segue o mouse + inclinação 3D ---------- */
if (!isTouch) {
  $$(".glow").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  });
  if (!reduceMotion) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = "" });
    });
    /* Botões magnéticos */
    $$("[data-magnetic]").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", `${(e.clientX - r.left - r.width / 2) * .25}px`);
        btn.style.setProperty("--my", `${(e.clientY - r.top - r.height / 2) * .35}px`);
      });
      btn.addEventListener("pointerleave", () => { btn.style.setProperty("--mx", "0px"); btn.style.setProperty("--my", "0px") });
    });
  }
}

/* ---------- Fundo: rede de partículas (circuito) ---------- */
const canvas = $("#fx");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  let w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 }, running = true;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr;
    const n = Math.min(90, Math.round((innerWidth * innerHeight) / 16000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr,
      r: (Math.random() * 1.4 + .6) * dpr,
    }));
  };
  resize();
  addEventListener("resize", resize);
  addEventListener("pointermove", e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr }, { passive: true });
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(draw) });
  const LINK = 140;
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const link = LINK * dpr;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 160 * dpr) { p.x += dx / d * .8; p.y += dy / d * .8 }
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(25,167,255,${(1 - d / link) * .35})`;
          ctx.lineWidth = dpr * .8;
          ctx.beginPath();
          // linhas em "L", estilo trilha de placa de circuito
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = "rgba(95,212,255,.85)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ---------- Filtros do portfólio ---------- */
const filtros = $(".filters");
if (filtros) {
  const pill = $(".filter-pill", filtros);
  const botoes = $$(".filter", filtros);
  const cards = $$("[data-cat]");
  const movePill = btn => {
    pill.style.left = btn.offsetLeft + "px";
    pill.style.top = btn.offsetTop + "px";
    pill.style.width = btn.offsetWidth + "px";
    pill.style.height = btn.offsetHeight + "px";
  };
  botoes.forEach(btn => btn.addEventListener("click", () => {
    botoes.forEach(b => b.classList.toggle("active", b === btn));
    movePill(btn);
    const alvo = btn.dataset.filter;
    cards.forEach(card => {
      const show = alvo === "todos" || card.dataset.cat.split(" ").includes(alvo);
      card.hidden = !show;
      if (show) { card.classList.remove("fade-in"); void card.offsetWidth; card.classList.add("fade-in") }
    });
  }));
  const ativo = $(".filter.active", filtros);
  requestAnimationFrame(() => movePill(ativo));
  addEventListener("resize", () => movePill($(".filter.active", filtros)));
}

/* ---------- Prévia visual dos projetos (só imagens; nenhum código é exposto) ---------- */
const modal = $("#preview");
if (modal) {
  const img = $("#previewImg"), empty = $("#previewEmpty"), screen = $("#previewScreen"), title = $("#previewTitle");
  const devBtns = $$("[data-device]", modal);
  let slug = "", device = "desktop", lastFocus = null;
  const load = () => {
    empty.hidden = true; img.hidden = false; screen.scrollTop = 0;
    screen.classList.toggle("mobile", device === "mobile");
    devBtns.forEach(b => b.classList.toggle("active", b.dataset.device === device));
    img.src = `assets/img/projetos/${slug}-${device}.jpg`;
  };
  img.addEventListener("error", () => { img.hidden = true; empty.hidden = false });
  img.addEventListener("contextmenu", e => e.preventDefault());
  const open = btn => {
    lastFocus = btn; slug = btn.dataset.preview; device = "desktop";
    title.textContent = btn.closest(".project").querySelector("h3").textContent;
    img.alt = "Prévia visual: " + title.textContent;
    load();
    modal.hidden = false; document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  };
  const close = () => {
    modal.hidden = true; img.removeAttribute("src"); document.body.style.overflow = "";
    lastFocus?.focus();
  };
  $$("[data-preview]").forEach(b => b.addEventListener("click", () => open(b)));
  $$("[data-close]", modal).forEach(el => el.addEventListener("click", close));
  devBtns.forEach(b => b.addEventListener("click", () => { device = b.dataset.device; load() }));
  addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) close() });
}

/* ---------- Ano no rodapé ---------- */
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* =========================================================
   V3 — Carrossel de banners
   ========================================================= */
const car = $("#carousel");
if (car) {
  const slides = $$(".slide", car);
  const dotsBox = $(".car-dots", car);
  const DUR = 5500;
  let idx = 0, timer = null, paused = false;
  car.style.setProperty("--dur", DUR + "ms");

  // Usa a imagem real se ela existir; senão fica o banner desenhado
  slides.forEach((sl, i) => {
    sl.setAttribute("aria-label", `${i + 1} de ${slides.length}`);
    const src = sl.dataset.img;
    if (!src) return;
    const img = new Image();
    img.onload = () => { img.alt = ""; img.draggable = false; sl.prepend(img); sl.classList.add("has-img") };
    img.src = src;
  });

  const dots = slides.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button"; d.className = "car-dot"; d.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
    d.addEventListener("click", () => go(i, true));
    dotsBox.appendChild(d);
    return d;
  });

  function render(offset = 0) {
    slides.forEach(sl => sl.style.transform = `translateX(calc(${-idx * 100}% + ${offset}px))`);
  }
  function go(i, user) {
    idx = (i + slides.length) % slides.length;
    render();
    slides.forEach((sl, k) => { sl.classList.toggle("current", k === idx); sl.setAttribute("aria-hidden", k !== idx) });
    dots.forEach((d, k) => {
      d.classList.remove("active"); d.classList.toggle("done", k < idx);
      if (k === idx) { void d.offsetWidth; d.classList.add("active") }
    });
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(() => go(idx + 1), DUR);
  }
  function setPaused(p) {
    paused = p; car.classList.toggle("paused", p);
    if (p) clearTimeout(timer);
    else { const d = dots[idx]; d.classList.remove("active"); void d.offsetWidth; d.classList.add("active"); schedule() }
  }
  $$(".car-btn", car).forEach(b => b.addEventListener("click", () => go(idx + +b.dataset.dir, true)));
  document.addEventListener("visibilitychange", () => setPaused(document.hidden));
  car.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(idx - 1); if (e.key === "ArrowRight") go(idx + 1) });
  car.tabIndex = 0;

  // Arrastar / deslizar no celular
  let startX = null, dx = 0;
  car.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    startX = e.clientX; dx = 0; car.classList.add("dragging"); clearTimeout(timer);
  });
  addEventListener("pointermove", e => { if (startX === null) return; dx = e.clientX - startX; render(dx) });
  addEventListener("pointerup", () => {
    if (startX === null) return;
    car.classList.remove("dragging"); startX = null;
    if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1), true); else { render(); schedule() }
  });

  go(0);
}

/* =========================================================
   V3 — Na bancada: fotos, vídeos e abas
   ========================================================= */
const photosEl = $("#photos");
const videosEl = $("#videos");
const prep = CONFIG.modoPreparo;
const emptyCard = (tipo, txt, cls) => {
  const el = document.createElement("div");
  el.className = cls + " empty";
  el.innerHTML = `<div class="empty-inner"><svg><use href="#i-${tipo}"/></svg><span>${txt}</span></div>`;
  return el;
};

const fotosOk = [];
if (photosEl) {
  CONFIG.fotos.forEach((f, i) => {
    const slot = emptyCard("camera", `Foto ${i + 1}<br><code>${f.arquivo}</code>`, "photo");
    if (!prep) slot.hidden = true;
    photosEl.appendChild(slot);
    const img = new Image();
    img.onload = () => {
      const fig = document.createElement("button");
      fig.type = "button"; fig.className = "photo reveal visible";
      fig.innerHTML = `<figure style="height:100%"><img src="${f.arquivo}" alt="${f.legenda}" loading="lazy"><figcaption>${f.legenda}</figcaption></figure>`;
      fig.addEventListener("click", () => openLb(f));
      slot.replaceWith(fig);
      fotosOk.push(f);
    };
    img.src = f.arquivo;
  });
}

if (videosEl) {
  CONFIG.videos.forEach(v => {
    const vertical = v.formato === "vertical" ? " vertical" : "";
    if (!v.id) {
      if (prep) videosEl.appendChild(emptyCard("video", `${v.titulo}<br><code>id do YouTube aqui</code>`, "video" + vertical));
      return;
    }
    const box = document.createElement("div");
    box.className = "video" + vertical;
    box.innerHTML = `<button type="button" class="yt" style="background-image:url(https://i.ytimg.com/vi/${v.id}/hqdefault.jpg)" aria-label="Assistir: ${v.titulo}"><span class="yt-play"><svg><use href="#i-play"/></svg></span><span class="yt-title">${v.titulo}</span></button>`;
    // Só carrega o player do YouTube quando a pessoa clica (site mais leve)
    box.querySelector("button").addEventListener("click", () => {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1" title="${v.titulo}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    });
    videosEl.appendChild(box);
  });
}

// Abas Fotos / Vídeos
const tabs = $(".tabs");
if (tabs) {
  const pill = $(".tab-pill", tabs);
  const btns = $$(".tab", tabs);
  const move = b => { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px" };
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b) });
    move(b);
    $$(".tab-panel").forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
  }));
  requestAnimationFrame(() => move($(".tab.active", tabs)));
  addEventListener("resize", () => move($(".tab.active", tabs)));
  // Se não houver nenhum vídeo configurado e não estiver em modo preparo, esconde a aba
  if (!prep && !CONFIG.videos.some(v => v.id)) btns[1].hidden = true;
}

// Visualizador de fotos
const lb = $("#lightbox");
let lbIdx = 0;
function openLb(f) {
  lbIdx = fotosOk.indexOf(f);
  showLb(); lb.hidden = false; document.body.style.overflow = "hidden";
}
function showLb() {
  const f = fotosOk[lbIdx];
  $("#lbImg").src = f.arquivo; $("#lbImg").alt = f.legenda; $("#lbCap").textContent = f.legenda;
}
if (lb) {
  const close = () => { lb.hidden = true; document.body.style.overflow = "" };
  $$("[data-lb-close]", lb).forEach(b => b.addEventListener("click", close));
  $$("[data-lb]", lb).forEach(b => b.addEventListener("click", () => { lbIdx = (lbIdx + +b.dataset.lb + fotosOk.length) % fotosOk.length; showLb() }));
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") { lbIdx = (lbIdx + 1) % fotosOk.length; showLb() }
    if (e.key === "ArrowLeft") { lbIdx = (lbIdx - 1 + fotosOk.length) % fotosOk.length; showLb() }
  });
}


/* =========================================================
   V3.1 — 3D (carregado só quando a pessoa chega perto)
   ========================================================= */
const alvos3d = $$("[data-3d]");
if (alvos3d.length) {
  let carregado = false;
  const obs3d = new IntersectionObserver(es => {
    if (carregado || !es.some(e => e.isIntersecting)) return;
    carregado = true; obs3d.disconnect();
    const sc = document.createElement("script");
    sc.src = "assets/js/scene3d.js"; sc.async = true;
    sc.onerror = () => alvos3d.forEach(el => el.classList.add("no3d"));
    document.body.appendChild(sc);
  }, { rootMargin: "500px 0px" });
  alvos3d.forEach(el => obs3d.observe(el));
}
// etapas do conserto acompanham a animação 3D
const r3d = $('[data-3d="repair"]');
const passos = $$(".repair-steps li");
if (r3d && passos.length) {
  // textos de cada etapa, por aparelho
  const TEXTOS = {
    celular: [["Diagnóstico", "Tela trincada encontrada"], ["Abertura", "Com a ferramenta certa, sem forçar"], ["Troca da tela", "Tela nova no lugar"], ["Teste final", "Tudo funcionando antes da entrega"]],
    notebook: [["Diagnóstico", "Lento e esquentando"], ["Abertura", "Acesso às peças internas"], ["Limpeza + SSD", "Ventoinha limpa e SSD novo"], ["Teste final", "Rápido de novo e sem esquentar"]],
  };
  const chips = $$(".repair-device [data-dev]");
  let aparelho = "";
  const marca = (dev, i) => {
    if (dev !== aparelho) {
      aparelho = dev;
      chips.forEach(c => c.classList.toggle("on", c.dataset.dev === dev));
      passos.forEach((li, k) => {
        $("strong", li).textContent = TEXTOS[dev][k][0];
        $("small", li).textContent = TEXTOS[dev][k][1];
      });
    }
    passos.forEach((li, k) => li.classList.toggle("on", k === i));
  };
  marca("celular", 0);
  r3d.addEventListener("repairstep", e => marca(e.detail.device, e.detail.step));
}

/* =========================================================
   V3.1 — Projetos: mini carrossel de imagens + janela de prévia
   Imagens: assets/img/projetos/<projeto>/1.jpg, 2.jpeg, 3.png ... (até 12, qualquer formato)
   Use o organizar-fotos.bat para numerar as fotos automaticamente.
   ========================================================= */
const galerias = new Map(); // slug -> [urls]
$$("[data-gallery]").forEach((box, cardIdx) => {
  const slug = box.dataset.gallery, max = +box.dataset.max || 12;
  const cover = box.closest(".cover");
  const lista = new Array(max).fill(null);
  galerias.set(slug, []);
  let timer = null, atual = 0, dotsEl = null;
  const montar = () => {
    const urls = lista.filter(Boolean);
    galerias.set(slug, urls);
    if (!urls.length) return;
    cover.classList.add("has-gallery");
    box.innerHTML = urls.map((u, i) => `<img src="${u}" alt="" loading="lazy" draggable="false"${i === atual ? ' class="on"' : ""}>`).join("");
    if (!dotsEl) { dotsEl = document.createElement("div"); dotsEl.className = "cover-dots"; cover.appendChild(dotsEl) }
    dotsEl.innerHTML = urls.length > 1 ? urls.map((_, i) => `<i${i === atual ? ' class="on"' : ""}></i>`).join("") : "";
    if (urls.length > 1 && !timer) {
      setTimeout(() => {
        timer = setInterval(() => {
          const imgs = box.querySelectorAll("img"), dots = dotsEl.querySelectorAll("i");
          if (imgs.length < 2) return;
          imgs[atual]?.classList.remove("on"); dots[atual]?.classList.remove("on");
          atual = (atual + 1) % imgs.length;
          imgs[atual].classList.add("on"); dots[atual]?.classList.add("on");
        }, 3200);
      }, cardIdx * 700);
    }
  };
  // Procura 1, 2, 3... em qualquer formato; para no primeiro número que não existir
  const EXTS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG"];
  const tenta = (i, e = 0) => {
    if (i > max || e >= EXTS.length) return;
    const url = `assets/img/projetos/${slug}/${i}.${EXTS[e]}`;
    const img = new Image();
    img.onload = () => { lista[i - 1] = url; montar(); tenta(i + 1) };
    img.onerror = () => tenta(i, e + 1);
    img.src = url;
  };
  tenta(1);
});

/* Pega o código do vídeo de qualquer formato de link do YouTube */
function idYouTube(link) {
  if (!link) return "";
  const m = String(link).trim().match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : (/^[\w-]{11}$/.test(link.trim()) ? link.trim() : "");
}
const videoDoProjeto = slug => idYouTube((CONFIG.videosProjetos || {})[slug]);

// selo "Vídeo" nos cards que têm vídeo
$$("[data-project]").forEach(card => {
  if (!videoDoProjeto(card.dataset.project)) return;
  const tag = document.createElement("span");
  tag.className = "cover-video";
  tag.innerHTML = '<svg><use href="#i-play"/></svg>Vídeo';
  $(".cover", card)?.appendChild(tag);
});

const pm = $("#pmodal");
if (pm) {
  const pmImg = $("#pmImg"), pmEmpty = $("#pmEmpty"), thumbs = $("#pmThumbs"), stage = $(".pm-stage", pm);
  const pmVideo = document.createElement("div");
  pmVideo.className = "pm-video"; pmVideo.hidden = true;
  stage.insertBefore(pmVideo, pmImg);
  let itens = [], i = 0, ultimoFoco = null;   // item = { tipo: "video", id } ou { tipo: "foto", url }

  const capaVideo = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const pararVideo = () => { pmVideo.innerHTML = "" };
  const mostra = n => {
    if (!itens.length) return;
    i = (n + itens.length) % itens.length;
    const it = itens[i];
    pararVideo();
    if (it.tipo === "video") {
      pmImg.hidden = true; pmVideo.hidden = false;
      stage.style.setProperty("--pm-bg", `url("${capaVideo(it.id)}")`);
      pmVideo.innerHTML = `<button type="button" class="pm-play" style="background-image:url(${capaVideo(it.id)})" aria-label="Assistir ao vídeo"><span class="yt-play"><svg><use href="#i-play"/></svg></span></button>`;
      $(".pm-play", pmVideo).addEventListener("click", () => {
        pmVideo.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${it.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Vídeo do projeto" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      });
    } else {
      pmVideo.hidden = true; pmImg.hidden = false;
      pmImg.src = it.url;
      stage.style.setProperty("--pm-bg", `url("${new URL(it.url, location.href).href}")`);
    }
    thumbs.querySelectorAll("button").forEach((b, k) => b.classList.toggle("on", k === i));
  };
  const abrir = card => {
    ultimoFoco = document.activeElement;
    const slug = card.dataset.project;
    const vid = videoDoProjeto(slug);
    itens = (vid ? [{ tipo: "video", id: vid }] : []).concat((galerias.get(slug) || []).map(url => ({ tipo: "foto", url })));
    const cover = $(".cover", card), st = $(".status", card);
    $(".pm-box", pm).style.cssText = cover.getAttribute("style") || "";
    $("#pmTitle").textContent = $("h3", card).textContent;
    $("#pmStack").textContent = $(".project-body small", card).textContent;
    $("#pmStatus").className = st.className; $("#pmStatus").textContent = st.textContent;
    $("#pmDesc").innerHTML = $(".project-more", card).innerHTML;
    $("#pmTags").innerHTML = $(".tags", card).innerHTML;
    $("#pmActions").innerHTML = "";
    $$(".project-actions a", card).forEach(a => {
      const c = a.cloneNode(true); c.classList.remove("btn-sm"); $("#pmActions").appendChild(c);
    });
    $("#pmEmptyTitle").textContent = $(".cover-title", card).firstChild.textContent.trim();
    pmEmpty.hidden = itens.length > 0;
    if (!itens.length) { pmImg.hidden = true; pmVideo.hidden = true }
    $$(".pm-prev, .pm-next", pm).forEach(b => b.hidden = itens.length < 2);
    thumbs.innerHTML = itens.length > 1 ? itens.map((it, k) => it.tipo === "video"
      ? `<button type="button" class="thumb-video" aria-label="Vídeo"><img src="${capaVideo(it.id)}" alt=""><svg><use href="#i-play"/></svg></button>`
      : `<button type="button" aria-label="Imagem ${k + 1}"><img src="${it.url}" alt=""></button>`).join("") : "";
    thumbs.querySelectorAll("button").forEach((b, k) => b.addEventListener("click", () => mostra(k)));
    mostra(0);
    pm.hidden = false; document.body.style.overflow = "hidden";
    $(".pm-x", pm).focus();
  };
  const fechar = () => { pm.hidden = true; pararVideo(); pmImg.removeAttribute("src"); document.body.style.overflow = ""; ultimoFoco?.focus() };
  $$("[data-open]").forEach(el => {
    el.addEventListener("click", () => abrir(el.closest("[data-project]")));
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(el.closest("[data-project]")) } });
  });
  $$("[data-pm-close]", pm).forEach(b => b.addEventListener("click", fechar));
  $$("[data-pm]", pm).forEach(b => b.addEventListener("click", () => mostra(i + +b.dataset.pm)));
  pmImg.addEventListener("contextmenu", e => e.preventDefault());
  addEventListener("keydown", e => {
    if (pm.hidden) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowRight") mostra(i + 1);
    if (e.key === "ArrowLeft") mostra(i - 1);
  });
  // deslizar no celular
  let sx = null;
  pmImg.addEventListener("pointerdown", e => sx = e.clientX);
  pmImg.addEventListener("pointerup", e => { if (sx !== null && Math.abs(e.clientX - sx) > 40) mostra(i + (e.clientX < sx ? 1 : -1)); sx = null });
}
