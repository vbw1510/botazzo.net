/* =========================================================
   Botazzo.Net — cenas 3D feitas em código (sem modelos baixados)
   - [data-3d="repair"]  celular sendo consertado + técnico
   - [data-3d="avatar"]  bonequinho acenando (card "Sobre")
   Fonte deste arquivo: assets/js/scene3d.src.js
   Arquivo usado pelo site: assets/js/scene3d.js (gerado com esbuild, ver README)
   ========================================================= */
import * as THREE from "../vendor/three/three.module.min.js";
import { RoundedBoxGeometry } from "../vendor/three/RoundedBoxGeometry.js";

// Com "efeitos de animação" desligado no sistema, a cena continua animando, só que mais calma (sem pulos e sem faíscas)
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = { blue: 0x19a7ff, blue2: 0x006eff, navy: 0x0b3b8a, skin: 0xf2c6a0, dark: 0x0b0f16 };

/* ---------- utilidades ---------- */
const clamp01 = v => Math.min(1, Math.max(0, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const span = (t, a, b) => ease(clamp01((t - a) / (b - a)));
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .05, ...o });

function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

/* ---------- texturas das telas ---------- */
function crackedScreen() {
  return canvasTex(512, 1024, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#0c1320"); bg.addColorStop(1, "#05070b");
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255,255,255,.18)"; g.font = "600 92px sans-serif"; g.textAlign = "center";
    g.fillText("09:41", w / 2, 220);
    // trincas
    const cx = 330, cy = 420;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.lineCap = "round";
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2 + rnd() * .3;
      let x = cx, y = cy, len = 0, max = 260 + rnd() * 520;
      g.beginPath(); g.moveTo(x, y);
      while (len < max) {
        const step = 26 + rnd() * 40;
        const a = ang + (rnd() - .5) * .7;
        x += Math.cos(a) * step; y += Math.sin(a) * step; len += step;
        g.lineTo(x, y);
      }
      g.strokeStyle = `rgba(230,240,255,${.55 + rnd() * .35})`; g.lineWidth = 1.5 + rnd() * 2.2; g.stroke();
    }
    for (let r = 40; r < 200; r += 55) {
      g.beginPath();
      for (let k = 0; k <= 22; k++) {
        const a = (k / 22) * Math.PI * 2, rr = r + (rnd() - .5) * 22;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.strokeStyle = "rgba(220,235,255,.45)"; g.lineWidth = 1.4; g.stroke();
    }
    const glare = g.createRadialGradient(cx, cy, 0, cx, cy, 90);
    glare.addColorStop(0, "rgba(255,255,255,.55)"); glare.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = glare; g.fillRect(0, 0, w, h);
  });
}
function newScreen() {
  return canvasTex(512, 1024, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#1a8cff"); bg.addColorStop(.55, "#0b3b8a"); bg.addColorStop(1, "#05070b");
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    // notificação
    g.fillStyle = "rgba(37,211,102,.95)"; roundRect(g, 46, 70, w - 92, 74, 37); g.fill();
    g.fillStyle = "#04150a"; g.font = "700 34px sans-serif"; g.textAlign = "center";
    g.fillText("✓  Reparo concluído", w / 2, 120);
    g.fillStyle = "#fff"; g.font = "700 120px sans-serif"; g.fillText("09:41", w / 2, 300);
    g.font = "600 34px sans-serif"; g.fillStyle = "rgba(255,255,255,.85)"; g.fillText("Botazzo.Net", w / 2, 352);
    // ícones de apps
    const cols = ["#5fd4ff", "#19a7ff", "#25d366", "#ffb84d", "#a66bff", "#ff6b8a", "#7aa2ff", "#ffffff"];
    let n = 0;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      g.fillStyle = cols[n++ % cols.length]; g.globalAlpha = .9;
      roundRect(g, 58 + c * 106, 430 + r * 112, 78, 78, 22); g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = "rgba(255,255,255,.14)"; roundRect(g, 40, 900, w - 80, 96, 34); g.fill();
  });
}
function logoTex() {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = "#fff"; g.font = "700 76px monospace"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("</>", w / 2, h / 2 + 4);
  });
}
function checkTex() {
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = "#25d366"; g.beginPath(); g.arc(w / 2, w / 2, 110, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fff"; g.lineWidth = 26; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(72, 132); g.lineTo(112, 172); g.lineTo(186, 92); g.stroke();
  });
}


function keyboardTex() {
  return canvasTex(512, 320, (g, w, h) => {
    g.fillStyle = "#151b26"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#0b0f16";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 13; c++) { roundRect(g, 14 + c * 37.5, 12 + r * 36, 32, 30, 5); g.fill() }
    roundRect(g, 120, 192, 270, 30, 5); g.fill();
    g.fillStyle = "#1b2433"; roundRect(g, 176, 236, 160, 74, 10); g.fill();
  });
}
function slowScreen() {
  return canvasTex(640, 400, (g, w, h) => {
    g.fillStyle = "#0a0f18"; g.fillRect(0, 0, w, h);
    g.lineWidth = 10;
    g.strokeStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(w / 2, 150, 46, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = "#ffb84d"; g.beginPath(); g.arc(w / 2, 150, 46, -Math.PI / 2, .2); g.stroke();
    g.fillStyle = "rgba(255,255,255,.7)"; g.font = "600 30px sans-serif"; g.textAlign = "center"; g.fillText("Carregando...", w / 2, 250);
    g.fillStyle = "rgba(255,255,255,.12)"; roundRect(g, 170, 280, 300, 14, 7); g.fill();
    g.fillStyle = "#ffb84d"; roundRect(g, 170, 280, 36, 14, 7); g.fill();
    g.fillStyle = "#ff5f57"; g.font = "700 30px sans-serif"; g.textAlign = "right"; g.fillText("92°C", w - 26, 46);
  });
}
function fastScreen() {
  return canvasTex(640, 400, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, "#1a8cff"); bg.addColorStop(.6, "#0b3b8a"); bg.addColorStop(1, "#05070b");
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(37,211,102,.95)"; roundRect(g, 150, 40, 340, 58, 29); g.fill();
    g.fillStyle = "#04150a"; g.font = "700 28px sans-serif"; g.textAlign = "center"; g.fillText("✓  Rápido de novo", w / 2, 79);
    g.fillStyle = "#fff"; g.font = "700 64px sans-serif"; g.fillText("Botazzo.Net", w / 2, 200);
    g.font = "600 26px sans-serif"; g.fillStyle = "rgba(255,255,255,.85)"; g.fillText("SSD novo · ventoinha limpa · 38°C", w / 2, 248);
    ["#5fd4ff", "#25d366", "#ffb84d", "#a66bff", "#ff6b8a", "#ffffff"].forEach((c, i) => { g.fillStyle = c; roundRect(g, 140 + i * 62, 318, 46, 46, 12); g.fill() });
  });
}

/* ---------- peças ---------- */
function buildPhone() {
  const phone = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.6, 3.2, .2, 6, .17), std(0x1d2533, { metalness: .75, roughness: .28 }));
  body.castShadow = true; phone.add(body);
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(1.5, 3.1, .02, 4, .12), std(0x05070b, { roughness: .2 }));
  bezel.position.z = .095; phone.add(bezel);

  const sGeo = new THREE.PlaneGeometry(1.4, 2.98);
  const fresh = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({ map: newScreen(), transparent: true, opacity: 0, toneMapped: false }));
  fresh.position.z = .107; phone.add(fresh);
  const broken = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({ map: crackedScreen(), transparent: true, toneMapped: false }));
  broken.position.z = .11; phone.add(broken);

  const notch = new THREE.Mesh(new THREE.CapsuleGeometry(.035, .22, 4, 12), std(0x000000));
  notch.rotation.z = Math.PI / 2; notch.position.set(0, 1.4, .115); phone.add(notch);

  // câmera traseira
  const cam = new THREE.Mesh(new RoundedBoxGeometry(.55, .55, .06, 3, .12), std(0x111722, { metalness: .6 }));
  cam.position.set(-.4, 1.12, -.12); phone.add(cam);
  [[-.52, 1.24], [-.28, 1.24], [-.52, 1]].forEach(([x, y]) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .05, 24), std(0x02040a, { metalness: .9, roughness: .1 }));
    l.rotation.x = Math.PI / 2; l.position.set(x, y, -.16); phone.add(l);
  });
  // parafusos de baixo
  const screws = [-.25, .25].map(x => {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .05, 12), std(0xc8d3e0, { metalness: 1, roughness: .3 }));
    s.position.set(x, -1.6, 0); phone.add(s); return s;
  });
  // linha de diagnóstico
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .05), new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0, toneMapped: false }));
  scan.position.z = .12; phone.add(scan);
  return { phone, fresh, broken, scan, screws };
}


function buildLaptop() {
  const lap = new THREE.Group();
  const metal = std(0x1d2533, { metalness: .75, roughness: .3 });
  const base = new THREE.Mesh(new RoundedBoxGeometry(2.6, .1, 1.75, 4, .05), metal);
  base.position.y = .05; base.castShadow = true; lap.add(base);

  // interior (aparece quando o teclado levanta)
  const inside = new THREE.Group(); inside.position.y = .1; lap.add(inside);
  inside.add(new THREE.Mesh(new THREE.BoxGeometry(2.4, .02, 1.55), std(0x0d3b2a, { roughness: .8 })));
  const fan = new THREE.Group(); fan.position.set(.7, .04, -.25); inside.add(fan);
  const fanRing = new THREE.Mesh(new THREE.TorusGeometry(.32, .04, 8, 32), std(0x2a3446));
  fanRing.rotation.x = Math.PI / 2; fan.add(fanRing);
  const blades = new THREE.Group(); fan.add(blades);
  for (let i = 0; i < 7; i++) {
    const p = new THREE.Group(); p.rotation.y = i * Math.PI * 2 / 7;
    const bl = new THREE.Mesh(new THREE.BoxGeometry(.26, .015, .07), std(0x5fd4ff, { roughness: .4 }));
    bl.position.x = .14; bl.rotation.x = .5; p.add(bl); blades.add(p);
  }
  const ssdOld = new THREE.Mesh(new THREE.BoxGeometry(.6, .03, .22), std(0x7a2b2b, { roughness: .6 }));
  ssdOld.position.set(-.55, .03, .35); inside.add(ssdOld);
  const ssdNew = new THREE.Mesh(new THREE.BoxGeometry(.6, .03, .22), std(COLORS.blue2, { emissive: COLORS.blue2, emissiveIntensity: .6 }));
  ssdNew.position.set(-.55, .03, .35); inside.add(ssdNew);
  const ram = new THREE.Mesh(new THREE.BoxGeometry(.9, .03, .2), std(0x1f6b3a));
  ram.position.set(-.35, .03, -.3); inside.add(ram);

  // teclado (levanta na abertura)
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.62), new THREE.MeshStandardMaterial({ map: keyboardTex(), roughness: .7, transparent: true }));
  deck.rotation.x = -Math.PI / 2; deck.position.y = .102; lap.add(deck);

  // tela
  const hinge = new THREE.Group(); hinge.position.set(0, .1, -.86); lap.add(hinge);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.68, .07, 4, .04), metal);
  lid.position.set(0, .84, -.035); lid.castShadow = true; hinge.add(lid);
  const sGeo = new THREE.PlaneGeometry(2.44, 1.52);
  const slow = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({ map: slowScreen(), transparent: true, toneMapped: false }));
  slow.position.set(0, .86, .002); hinge.add(slow);
  const fast = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({ map: fastScreen(), transparent: true, opacity: 0, toneMapped: false }));
  fast.position.set(0, .86, .004); hinge.add(fast);
  hinge.rotation.x = -.22;

  // fumacinha de calor
  const smoke = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 10), new THREE.MeshBasicMaterial({ color: 0x9aa6b8, transparent: true, opacity: 0, depthWrite: false }));
    m.userData.o = i / 9; lap.add(m); smoke.push(m);
  }
  return { lap, deck, blades, ssdOld, ssdNew, slow, fast, smoke };
}

function buildScrewdriver() {
  const g = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(.1, .42, 6, 16), std(COLORS.blue2, { roughness: .4 }));
  handle.position.y = .5; handle.castShadow = true; g.add(handle);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .16, 16), std(0x0b0f16));
  grip.position.y = .38; g.add(grip);
  [0, 1, 2].forEach(k => {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(.03, .38, .03), std(0x5fd4ff));
    const a = k * Math.PI * 2 / 3; ridge.position.set(Math.cos(a) * .1, .56, Math.sin(a) * .1); g.add(ridge);
  });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .6, 12), std(0xd6dee8, { metalness: 1, roughness: .2 }));
  shaft.position.y = 0; g.add(shaft);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.022, .08, 12), std(0xd6dee8, { metalness: 1, roughness: .2 }));
  tip.position.y = -.34; tip.rotation.x = Math.PI; g.add(tip);
  return g;
}

export function buildAvatar() {
  const a = new THREE.Group();
  const shirt = std(0x1a73ff, { roughness: .7 }), pants = std(0x1b2233, { roughness: .8 }), skin = std(COLORS.skin, { roughness: .65 });
  const black = std(0x0a0d12, { roughness: .3 });

  [-.17, .17].forEach(x => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .32, 6, 14), pants);
    leg.position.set(x, .32, 0); leg.castShadow = true; a.add(leg);
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(.16, 18, 12), std(0xffffff, { roughness: .5 }));
    shoe.scale.set(1, .55, 1.4); shoe.position.set(x, .07, .05); a.add(shoe);
  });

  const torso = new THREE.Group(); torso.position.y = .62; a.add(torso);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.36, .42, 8, 20), shirt);
  body.position.y = .34; body.castShadow = true; torso.add(body);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.34, .17), new THREE.MeshBasicMaterial({ map: logoTex(), transparent: true }));
  logo.position.set(0, .4, .36); torso.add(logo);

  // braços com pivô no ombro
  const arms = [-1, 1].map(side => {
    const pivot = new THREE.Group(); pivot.position.set(side * .43, .62, 0); torso.add(pivot);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.1, .34, 6, 14), shirt);
    arm.position.y = -.24; arm.castShadow = true; pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(.11, 16, 12), skin);
    hand.position.y = -.5; pivot.add(hand);
    pivot.rotation.z = side * .18;
    return pivot;
  });

  const head = new THREE.Group(); head.position.y = 1.32; torso.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 24), skin);
  skull.castShadow = true; head.add(skull);
  const eyes = [-.17, .17].map(x => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(.065, 16, 12), black);
    e.position.set(x, .04, .45); e.scale.z = .5; head.add(e);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    shine.position.set(x + .025, .07, .485); head.add(shine);
    return e;
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(.12, .022, 8, 24, Math.PI), black);
  smile.rotation.z = Math.PI; smile.position.set(0, -.14, .46); head.add(smile);
  [-.3, .3].forEach(x => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 10), new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: .45 }));
    cheek.position.set(x, -.08, .4); cheek.scale.z = .3; head.add(cheek);
  });
  // boné
  const capMat = std(COLORS.navy, { roughness: .6 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.53, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
  cap.position.y = .06; cap.castShadow = true; head.add(cap);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .04, 32, 1, false, -Math.PI / 2, Math.PI), capMat);
  brim.position.set(0, .1, .3); brim.scale.z = 1.25; head.add(brim);
  const btn = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), std(COLORS.blue));
  btn.position.y = .58; head.add(btn);
  // fone (headset) de técnico
  const band = new THREE.Mesh(new THREE.TorusGeometry(.55, .03, 8, 32, Math.PI), std(0x0b0f16));
  band.position.y = .04; band.rotation.y = Math.PI / 2; head.add(band);
  [-1, 1].forEach(s => {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .07, 20), std(0x0b0f16));
    ear.rotation.z = Math.PI / 2; ear.position.set(s * .53, .02, 0); head.add(ear);
  });

  return { avatar: a, torso, head, arms, eyes };
}

function setupStage(el, camPos, fov = 34) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, .1, 100);
  camera.position.copy(camPos);

  scene.add(new THREE.HemisphereLight(0xbfe6ff, 0x0a0f18, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4; key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.PointLight(COLORS.blue, 40, 14); rim.position.set(-3, 3, -3); scene.add(rim);
  const rim2 = new THREE.PointLight(COLORS.blue2, 25, 12); rim2.position.set(3, 1, -2); scene.add(rim2);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: .35 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.1, 2.16, 96), new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: .35, toneMapped: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = .005; scene.add(ring);

  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(el); resize();

  // mouse: leve parallax
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  el.addEventListener("pointermove", e => {
    if (calm) return;
    const r = el.getBoundingClientRect();
    look.tx = (e.clientX - r.left) / r.width - .5; look.ty = (e.clientY - r.top) / r.height - .5;
  });
  el.addEventListener("pointerleave", () => { look.tx = 0; look.ty = 0 });

  return { renderer, scene, camera, ring, look };
}

function runLoop(el, stage, update) {
  let visible = false, raf = 0, t0 = performance.now();
  const frame = now => {
    raf = 0;
    const t = (now - t0) / 1000;
    stage.look.x += (stage.look.tx - stage.look.x) * .06; stage.look.y += (stage.look.ty - stage.look.y) * .06;
    update(t);
    stage.renderer.render(stage.scene, stage.camera);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(frame) };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() }).observe(el);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) start() });
}

/* =========================================================
   CENA 1 — conserto: alterna celular e notebook (12 s cada)
   ========================================================= */
function repairScene(el) {
  const stage = setupStage(el, new THREE.Vector3(0, 2.1, 8.2));
  const { scene, camera, ring, look } = stage;
  camera.lookAt(0, 1.55, 0);
  const amp = calm ? .35 : 1; // intensidade dos movimentos

  const P = buildPhone();
  const phoneHolder = new THREE.Group(); phoneHolder.position.set(.95, 1.85, 0); phoneHolder.add(P.phone); scene.add(phoneHolder);

  const N = buildLaptop();
  const lapHolder = new THREE.Group(); lapHolder.position.set(1.05, .55, .2); lapHolder.add(N.lap); scene.add(lapHolder);

  const sd = buildScrewdriver(); scene.add(sd);
  const T = buildAvatar(); T.avatar.position.set(-1.6, 0, .2); T.avatar.rotation.y = .45; scene.add(T.avatar);

  const check = new THREE.Sprite(new THREE.SpriteMaterial({ map: checkTex(), transparent: true, toneMapped: false }));
  check.scale.setScalar(0); scene.add(check);

  const SN = 60, pos = new Float32Array(SN * 3), vel = [];
  for (let i = 0; i < SN; i++) vel.push(new THREE.Vector3((Math.random() - .5) * 2.4, Math.random() * 2.2 + .6, (Math.random() - .5) * 1.4));
  const sparkGeo = new THREE.BufferGeometry(); sparkGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0x5fd4ff, size: .07, transparent: true, opacity: 0, toneMapped: false }));
  scene.add(sparks);

  const LOOP = 12, steps = [0, 2.5, 5, 7.5];
  let last = "";
  const sdHome = new THREE.Vector3(3.8, 4.4, 1.8);
  const sdWorkPhone = new THREE.Vector3(2.05, .95, .75), sdWorkLap = new THREE.Vector3(2.35, 1.05, 1.25);

  runLoop(el, stage, time => {
    const cycle = Math.floor(time / LOOP) % 2;   // 0 = celular, 1 = notebook
    const t = time % LOOP;
    const step = steps.filter(x => t >= x).length - 1;
    const key = cycle + ":" + step;
    if (key !== last) { last = key; el.dispatchEvent(new CustomEvent("repairstep", { detail: { device: cycle ? "notebook" : "celular", step } })) }

    // entrada / saída do aparelho
    const pop = span(t, 0, .7) * (1 - span(t, 11.3, 12));
    phoneHolder.visible = cycle === 0; lapHolder.visible = cycle === 1;
    (cycle ? lapHolder : phoneHolder).scale.setScalar(Math.max(.001, pop));
    const spin = calm ? 0 : span(t, 8.2, 10.2) * Math.PI * 2;

    // chave de fenda
    const inSd = span(t, 2.4, 3.2) * (1 - span(t, 5, 5.7));
    const work = (t > 3.2 && t < 5) ? 1 : 0;
    sd.position.lerpVectors(sdHome, cycle ? sdWorkLap : sdWorkPhone, inSd);
    sd.position.x += Math.sin(time * 16) * .025 * work * amp;
    sd.position.y += Math.sin(time * 8) * .03 * work * amp;
    sd.rotation.set(0, work ? time * 10 * amp : 0, -.7);
    sd.visible = inSd > .01;

    const ok = span(t, 7.5, 8.1) * (1 - span(t, 11.2, 11.9));

    if (cycle === 0) {
      // ---------- CELULAR ----------
      phoneHolder.position.y = 1.85 + Math.sin(time * 1.4) * .06 * amp;
      P.phone.rotation.y = -.35 + spin + look.x * .5;
      P.phone.rotation.x = -.05 + look.y * .25;
      P.scan.material.opacity = t < 2.5 ? .9 : 0;
      P.scan.position.y = 1.45 - ((t % 1.25) / 1.25) * 2.9;
      const out = span(t, 5.2, 6.4);
      P.broken.position.set(out * .4, out * 1.1, .11 + out * .9);
      P.broken.rotation.set(-out * .6, 0, out * .5);
      P.broken.material.opacity = 1 - span(t, 5.6, 6.6);
      P.fresh.material.opacity = span(t, 6.2, 7.4);
      P.screws.forEach(s => s.position.z = (t > 3.2 && t < 7.2) ? -.08 : 0);
      check.position.set(.95, 3.85, .3);
    } else {
      // ---------- NOTEBOOK ----------
      lapHolder.position.y = .55 + Math.sin(time * 1.4) * .05 * amp;
      N.lap.rotation.y = -.45 + spin + look.x * .5;
      N.lap.rotation.x = look.y * .15;
      // 1) diagnóstico: fumacinha de calor
      N.smoke.forEach(m => {
        const k = (time * .45 + m.userData.o) % 1;
        m.position.set(-.6 + m.userData.o * 1.2, .3 + k * 1.4, -.7);
        m.scale.setScalar(.6 + k * 1.2);
        m.material.opacity = (t < 2.6 ? .35 : 0) * Math.sin(k * Math.PI);
      });
      // 2) abertura: teclado levanta
      const open = span(t, 2.8, 3.8) * (1 - span(t, 6.6, 7.4));
      N.deck.position.set(0, .102 + open * 1.3, open * -.2);
      N.deck.rotation.x = -Math.PI / 2 + open * .9;
      N.deck.material.opacity = 1 - open * .55;
      // 3) limpeza da ventoinha + SSD novo
      N.blades.rotation.y += (t > 5 && t < 6.8 ? .5 : t > 7.5 ? .25 : .03) * amp + .01;
      N.ssdOld.position.x = -.55 - span(t, 5, 5.8) * 2.2;
      N.ssdOld.visible = t < 5.9;
      N.ssdNew.position.x = -.55 + (1 - span(t, 5.8, 6.6)) * 2.2;
      N.ssdNew.visible = t > 5.8;
      // 4) tela rápida
      N.slow.material.opacity = 1 - span(t, 7.2, 7.8);
      N.fast.material.opacity = span(t, 7.2, 7.8);
      check.position.set(1.05, 3.05, .4);
    }

    check.scale.setScalar(ok * .9 + Math.sin(time * 4) * .03 * ok);
    const st = clamp01((t - 7.5) / 1.6);
    sparks.material.opacity = (!calm && t > 7.5 && t < 9.1) ? 1 - st : 0;
    for (let i = 0; i < SN; i++) {
      pos[i * 3] = check.position.x + vel[i].x * st;
      pos[i * 3 + 1] = check.position.y - 1.4 + vel[i].y * st - 2.4 * st * st;
      pos[i * 3 + 2] = vel[i].z * st;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    ring.material.opacity = .25 + .2 * Math.sin(time * 2) + ok * .4;

    // técnico
    const party = span(t, 7.6, 8.1) * (1 - span(t, 10.4, 11));
    T.torso.position.y = .62 + Math.sin(time * 2.2) * .02 + (calm ? 0 : Math.abs(Math.sin(time * 7)) * .18 * party);
    T.head.rotation.y = .5 + look.x * .4 - party * .4;
    T.head.rotation.x = Math.sin(time * 1.3) * .05 + (step === 0 ? .12 : 0) + (cycle && step < 3 ? .12 : 0);
    T.eyes.forEach(e => e.scale.y = (time % 3.4) < .12 ? .1 : 1);
    const point = step <= 2 ? 1 : 0;
    T.arms[1].rotation.z = .18 + (point ? 1.25 - cycle * .35 + Math.sin(time * 3) * .08 * amp : 0) * (1 - party) + party * 2.7;
    T.arms[0].rotation.z = -.18 - party * 2.7 + Math.sin(time * 2.2) * .03;
    T.arms[1].rotation.x = point ? -.35 : 0;
  });
}

/* =========================================================
   CENA 2 — bonequinho acenando
   ========================================================= */
function avatarScene(el) {
  const stage = setupStage(el, new THREE.Vector3(0, 1.6, 6), 30);
  stage.camera.lookAt(0, 1.18, 0);
  stage.ring.scale.setScalar(.55);
  const T = buildAvatar(); stage.scene.add(T.avatar);
  runLoop(el, stage, time => {
    const t = time * (calm ? .6 : 1);
    T.avatar.rotation.y = stage.look.x * .8 + Math.sin(t * .6) * .15;
    T.head.rotation.x = stage.look.y * .4;
    T.torso.position.y = .62 + Math.sin(t * 2.2) * .02;
    const wave = (t % 5) < 2.4 ? 1 : 0;
    T.arms[1].rotation.z = .18 + wave * (2.5 + Math.sin(t * 9) * .35);
    T.eyes.forEach(e => e.scale.y = (t % 3.1) < .12 ? .1 : 1);
    el.classList.add("ready");
  });
}

/* ---------- inicialização ---------- */
function supportsWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")) } catch { return false }
}
const scenes = { repair: repairScene, avatar: avatarScene };
document.querySelectorAll("[data-3d]").forEach(el => {
  if (!supportsWebGL()) { el.classList.add("no3d"); return }
  try { scenes[el.dataset["3d"]]?.(el); el.classList.add("ready") }
  catch (err) { console.warn("3D indisponível:", err); el.classList.add("no3d") }
});
