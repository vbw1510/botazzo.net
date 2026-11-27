/* App do casamento: service worker SEGURO
   - Sempre busca a versão nova na internet (network-first): nunca prende numa versão velha.
   - Só usa a cópia guardada se o celular estiver sem internet.
   - Nunca mexe nos envios/fotos (Supabase), que passam direto. */
const VERSAO = "casamento-v1.2-2026-11-27";
const BASE = ["./", "./index.html", "./assets/supabase.js", "./assets/qrcode-gen.js", "./assets/icon-192.png",
  "./assets/fonts/great-vibes-latin-400-normal.woff2", "./assets/fonts/nunito-sans-latin-400-normal.woff2"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(VERSAO).then(c => c.addAll(BASE)).catch(() => {})); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // Supabase e o resto: direto, sem mexer
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok && res.type === "basic") { const cp = res.clone(); caches.open(VERSAO).then(c => c.put(req, cp)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(r => r || caches.match("./index.html")))
  );
});
