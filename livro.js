/* ==========================================================================
   MOTOR DO LIVRO INTERATIVO · As Quatro Vontades · versão Capítulo V
   O motor do Capítulo IV (escolha só depois de "Próxima", diálogo em rodadas,
   pontuação da jornada) com a Luz do Capítulo I, mais o que é do deserto:
   o odre de vinho de cacto (st.cantil / st.turvo), as relações com a Pira
   (st.hessa, st.shaa, st.pira) e o temperamento de Aheryn (st.tom).
   Todo áudio é opcional: se o arquivo não existir, o livro segue (e, onde a
   cena precisa de som, toca uma reserva sintetizada).
   O roteiro vem de window.LIVRO (capitulo5.js); os jogos, de window.JOGOS5.
   ========================================================================== */
(() => {
'use strict';
const L = window.LIVRO, CFG = window.CHAPTER_CONFIG || {}, CODEX = CFG.codex || {}, ZONES = Object.assign({}, CFG.zones || {}, L.zonas || {});
const SUPA = { url: 'https://qoxvlgscpljsrybywivf.supabase.co', key: 'sb_publishable_XvoczGgXZGAezAmabNUBrQ_r25L-7ga' };
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const H264 = !!document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"');
const vsrc = (u) => (H264 || !/\.mp4$/.test(u) ? u : u.replace(/\.mp4$/, '.webm'));
const SAVE_KEY = 'livro_' + L.id;
let LANG = 'en'; try { LANG = localStorage.getItem('livro_lang') || 'en'; } catch (e) {}
const EN = window.LIVRO_EN || {};
const tr = (t) => (LANG === 'en' && t != null ? (EN[t] != null ? EN[t] : t) : t);
const UI = window.LIVRO_UI;
const U = (k) => UI[LANG][k];

// ---------------------------------------------------------------- estado
const novoEstado = () => ({ i: 0, luz: L.luzInicial || 10, cantil: L.cantil || 6, turvo: 0, bebidos: 0, hessa: 0, shaa: 0, pira: 0, tom: {}, perfil: {}, f: {}, escolhas: {}, dialogo: {}, feitos: {}, jogos: {}, sessao: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()) });
let st = novoEstado();
const salvar = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(st)); } catch (e) {} };
const carregar = () => { try { const j = JSON.parse(localStorage.getItem(SAVE_KEY)); return j && j.sessao ? j : null; } catch (e) { return null; } };
// o que capítulos anteriores deixaram neste navegador (mesmo endereço do GitHub Pages)
let ANTES = {}; try { ANTES = JSON.parse(localStorage.getItem('aqv_estado') || '{}') || {}; } catch (e) {}
window.AQV_ANTES = ANTES;
const P = L.paginas;
const visivel = (p) => !p.se || p.se(st);
const narrOf = (p) => (typeof p.narracao === 'function' ? p.narracao(st) : p.narracao);
const idxVis = (from, dir) => { let i = from + dir; while (i >= 0 && i < P.length && !visivel(P[i])) i += dir; return i; };

// ---------------------------------------------------------------- áudio (Web Audio)
const AC = window.AudioContext || window.webkitAudioContext;
const A = {
  ctx: null, bufs: {}, zone: null, narr: null, on: true,
  init() {
    if (this.ctx) return; this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
    this.bed = this.ctx.createGain(); this.bed.connect(this.master);
    this.fx = this.ctx.createGain(); this.fx.gain.value = .85; this.fx.connect(this.master);
    const n = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = n;
  },
  resume() { this.ctx && this.ctx.state === 'suspended' && this.ctx.resume(); },
  async buf(url) {
    if (!this.ctx) return null;
    if (this.bufs[url]) return this.bufs[url];
    const p = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((ab) => new Promise((res, rej) => this.ctx.decodeAudioData(ab, res, rej))).catch(() => null);
    this.bufs[url] = p; return p;
  },
  async loop(url, vol, fade = 1.5) {
    const b = await this.buf(url); if (!b) return null;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.loop = true;
    const g = this.ctx.createGain(); g.gain.value = 0; s.connect(g); g.connect(this.bed); s.start();
    g.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + fade);
    return { s, g };
  },
  stop(h, fade = 1.5) { if (!h || !this.ctx) return; const t = this.ctx.currentTime; h.g.gain.cancelScheduledValues(t); h.g.gain.setValueAtTime(h.g.gain.value, t); h.g.gain.linearRampToValueAtTime(0, t + fade); setTimeout(() => { try { h.s.stop(); } catch (e) {} (h.extra || []).forEach((x) => { try { x.stop(); } catch (e) {} }); }, fade * 1000 + 100); },
  // cama sonora de reserva enquanto o arquivo da zona não existe: vento (deserto) ou zumbido (eclipse)
  sintetico(tipo, vol) {
    const c = this.ctx, g = c.createGain(); g.gain.value = 0; g.connect(this.bed);
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = tipo === 'zumbido' ? 160 : 420; f.Q.value = tipo === 'zumbido' ? 4 : .7;
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .07; lg.gain.value = tipo === 'zumbido' ? 40 : 260; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    s.connect(f); f.connect(g); s.start();
    const extra = [lfo];
    if (tipo === 'zumbido') { const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = 55; og.gain.value = .35; o.connect(og); og.connect(g); o.start(); extra.push(o); }
    g.gain.linearRampToValueAtTime(vol * (tipo === 'zumbido' ? .5 : .32), c.currentTime + 2.5);
    return { s, g, extra };
  },
  async setZone(z) {
    if (!this.ctx || z === this.zone) return; this.zone = z;
    const old = this.zoneH; this.zoneH = null; this.stop(old, 2);
    clearInterval(this.oneT);
    const cfg = ZONES[z]; if (!cfg) return;
    if (cfg.oneShot) { const l = [].concat(cfg.oneShot); this.oneT = setInterval(() => { if (this.zone === z && Math.random() < .5) this.once(l[Math.floor(Math.random() * l.length)], .35); }, 9000); }
    let h = cfg.src ? await this.loop(cfg.src, cfg.volume * .8, 2.2) : null;
    if (!h && cfg.reserva) h = this.sintetico(cfg.reserva, cfg.volume);
    if (this.zone === z) this.zoneH = h; else this.stop(h, .3);
  },
  async once(url, vol = .7) { const b = await this.buf(url); if (!b) return 0; const s = this.ctx.createBufferSource(); s.buffer = b; const g = this.ctx.createGain(); g.gain.value = vol; s.connect(g); g.connect(this.fx); s.start(); return b.duration; },
  // fila: se já há uma voz falando, espera ela acabar em vez de cortá-la (pensamentos e dublagens de parágrafo)
  async narrate(url, onEnd, fila) {
    if (fila && this.narr) { (this.fila = this.fila || []).push([url, onEnd]); return true; }
    this.stopNarr(true); const b = await this.buf(url); if (!b) return false;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.master); s.start();
    this.duck(true); this.narr = s; s.onended = () => { if (this.narr === s) { this.narr = null; this.duck(false); onEnd && onEnd(); const q = this.fila && this.fila.shift(); if (q) this.narrate(q[0], q[1]); } };
    return true;
  },
  stopNarr(manterFila) { if (!manterFila) this.fila = []; if (this.narr) { const s = this.narr; this.narr = null; try { s.stop(); } catch (e) {} this.duck(false); } },
  sobe() { this.tone(330, 1.4, 'sine', .035, 0, 1.6); this.tone(495, 1.6, 'sine', .02, .15, 1.5); },
  trai() { this.tone(110, 2.2, 'sawtooth', .04, 0, 2); this.hiss(2, 1500, .5, .1, 0); this.sfx('luz', .7); },
  acende() { this.tone(392, .9, 'sine', .04, 0, 1.5); this.tone(588, 1.1, 'sine', .025, .1, 1.4); },
  // abafa(true): a cama sonora quase some (o parto fica só com os corações); abafa(false) devolve
  abafa(on) { if (!this.ctx) return; const t = this.ctx.currentTime; this.bed.gain.cancelScheduledValues(t); this.bed.gain.setTargetAtTime(on ? .06 : 1, t, on ? .8 : 1.2); this.abafado = on; },
  duck(on) { if (!this.ctx || this.abafado) return; const t = this.ctx.currentTime; this.bed.gain.cancelScheduledValues(t); this.bed.gain.setTargetAtTime(on ? .25 : 1, t, .25); },
  setOn(on) { this.on = on; if (this.master) this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, .1); },
  tone(f, d, type = 'sine', v = .08, when = 0, bend = 0) {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (bend) o.frequency.exponentialRampToValueAtTime(f * bend, t + d);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.fx); o.start(t); o.stop(t + d + .05);
  },
  hiss(d, f, q, v, when = 0, type = 'bandpass') {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const fl = this.ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = this.ctx.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + d * .3); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(this.fx); s.start(t); s.stop(t + d + .05);
  },
  // sfx: toca assets/audio/sfx/<nome>.mp3; se ainda não existir, a reserva sintetizada
  async sfx(nome, vol = .6, reserva) { if (!this.ctx) return; const d = await this.once('assets/audio/sfx/' + nome + '.mp3', vol); if (!d && reserva) reserva(); },
  virar() { this.sfx('pagina', .35, () => this.hiss(.35, 2400, .7, .05)); },
  escolha() { this.tone(392, .5, 'sine', .05); this.tone(587, .6, 'sine', .035, .06); },
  aviso() { this.tone(440, .9, 'triangle', .03); this.tone(660, 1.1, 'sine', .02, .1); },
  luzSobe() { this.sfx('luz', .45, () => { this.tone(523, .8, 'sine', .04); this.tone(784, 1, 'sine', .03, .08); }); },
  luzDesce() { this.tone(330, .7, 'sine', .05, 0, .6); },
  gole() { this.sfx('gole-cacto', .8, () => this.sfx('gole', .8)); },
  // os dois corações do parto (se os arquivos não vierem, sintetizados)
  batida(forca = .5, grave = false) { if (!this.ctx) return; const v = .1 + forca * .3, f = grave ? 46 : 70; this.tone(f, .22, 'sine', v, 0, .6); this.hiss(.16, grave ? 80 : 120, .7, v * .5, 0, 'lowpass'); this.tone(f * .9, .2, 'sine', v * .7, .16, .6); },
  // o som do nome: estalo seco + baque molhado
  kronk() { this.sfx('kronk', .95, () => { this.hiss(.09, 2600, 2.2, .55); this.hiss(.07, 1400, 1.5, .4, .03); this.tone(62, .55, 'sine', .55, .2, .55); this.hiss(.4, 220, .8, .35, .2, 'lowpass'); }); },
};

// ---------------------------------------------------------------- fundos
const bgWrap = $('#bg');
let bgKey = '';
const resolveFundo = (p) => (st.fundoPag && st.fundoPag[p.id]) || (typeof p.fundo === 'function' ? p.fundo(st) : p.fundo);
function setFundo(f) {
  if (!f) return; const key = JSON.stringify(f); if (key === bgKey) return; bgKey = key;
  const layer = document.createElement('div');
  layer.className = 'bgl kb-' + (f.kb || 'in') + (f.tint ? ' tint-' + f.tint : '') + (f.retrato ? ' retrato' : '');
  layer.style.setProperty('--dim', f.dim != null ? f.dim : .5);
  layer.style.setProperty('--foco', f.foco || '50% 40%');
  const src = f.img;
  if (f.retrato) { const b = document.createElement('div'); b.className = 'blur'; b.style.backgroundImage = `url("${src}")`; layer.appendChild(b); }
  if (f.video || f.clip) {
    const v = document.createElement('video'); v.src = vsrc(f.video || f.clip); v.muted = true; v.loop = !f.umaVez; v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true;
    v.style.objectPosition = f.foco || '50% 40%'; v.className = 'img';
    if (f.img) v.poster = f.img; layer.appendChild(v); v.play().catch(() => {});
  } else { const im = document.createElement('div'); im.className = 'img'; im.style.backgroundImage = `url("${src}")`; layer.appendChild(im); }
  bgWrap.appendChild(layer);
  document.body.classList.toggle('lado-dir', f.lado === 'dir');
  Clima.set(f.clima || null);
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
  const olds = [...bgWrap.children].filter((c) => c !== layer);
  setTimeout(() => olds.forEach((o) => o.remove()), 1600);
}

// ---------------------------------------------------------------- clima: areia no vento, brasas, estrelas, cinza do eclipse
const Clima = (() => {
  const cv = $('#fx'), cx = cv.getContext('2d'); let modo = null, alvo = 0, dens = 0, parts = [], t0 = performance.now();
  const PERFIS = {
    areia: { n: 110, cor: '232,196,140', vy: [-3, 8], vx: [30, 90], r: [.4, 1.5], a: [.12, .45], wob: 14 },
    poeira: { n: 60, cor: '236,214,170', vy: [-4, 6], vx: [-5, 8], r: [.5, 1.8], a: [.1, .4], wob: 10 },
    brasas: { n: 40, cor: '255,180,100', vy: [-22, -6], vx: [-6, 6], r: [.6, 1.8], a: [.25, .8], wob: 10, pisca: true },
    estrelas: { n: 70, cor: '230,236,255', vy: [0, 0], vx: [0, 0], r: [.4, 1.2], a: [.15, .7], wob: 0, pisca: true },
    cinza: { n: 70, cor: '170,186,206', vy: [4, 14], vx: [-6, 8], r: [.4, 1.4], a: [.08, .35], wob: 8 },
  };
  const rs = () => { const d = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); };
  addEventListener('resize', rs); rs();
  const rnd = (a) => a[0] + Math.random() * (a[1] - a[0]);
  const novo = (pf) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: rnd(pf.vx), vy: rnd(pf.vy), r: rnd(pf.r), a: rnd(pf.a), ph: Math.random() * 6.28 });
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.max(0, Math.min((now - last) / 1000, .05)); last = now;
    dens = Math.max(0, dens + (alvo - dens) * Math.min(1, dt * 1.5));
    cx.clearRect(0, 0, innerWidth, innerHeight);
    const pf = PERFIS[modo];
    if (pf) {
      const n = Math.max(0, Math.round(pf.n * dens * (innerWidth < 700 ? .55 : 1)) || 0);
      while (parts.length < n) parts.push(novo(pf));
      if (parts.length > n) parts.length = n;
      const tt = (now - t0) / 1000;
      for (const q of parts) {
        q.x += (q.vx + Math.sin(tt * .6 + q.ph) * pf.wob * .3) * dt; q.y += q.vy * dt;
        if (q.y > innerHeight + 10 || q.y < -12 || q.x < -20 || q.x > innerWidth + 20) { Object.assign(q, novo(pf)); if (q.vx > 20) q.x = -10; if (q.vy < 0) q.y = innerHeight + 6; }
        const al = q.a * (pf.pisca ? .55 + .45 * Math.sin(tt * 2.4 + q.ph * 3) : 1) * dens;
        cx.beginPath(); cx.fillStyle = `rgba(${pf.cor},${al.toFixed(3)})`; cx.arc(q.x, q.y, q.r, 0, 6.283); cx.fill();
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return { set(m) { if (m === modo) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) m = null; modo = m; parts = []; dens = 0; alvo = m ? 1 : 0; } };
})();

// ---------------------------------------------------------------- codex
function aliasesAtuais() {
  const out = [];
  for (const [id, c] of Object.entries(CODEX)) {
    const al = LANG === 'en' ? (c.aliasesEn || [c.en && c.en.title]) : (c.aliasesPt || [c.pt && c.pt.title]);
    for (const a of al.filter(Boolean)) out.push([a, id]);
  }
  return out.sort((a, b) => b[0].length - a[0].length);
}
const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const linkUsados = new Set();
function linkify(text) {
  let html = esc(text);
  for (const [a, id] of aliasesAtuais()) {
    if (linkUsados.has(id)) continue;
    const re = new RegExp(`(^|[^\\p{L}])(${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'u');
    if (re.test(html)) { html = html.replace(re, `$1<button class="gloss" data-codex="${id}">$2</button>`); linkUsados.add(id); }
  }
  return html;
}
function abrirCodex(id) {
  const c = CODEX[id]; if (!c) return; const t = c[LANG] || c.pt || c.en; let pg = 0;
  const m = $('#codex'); $('#cxImg').style.backgroundImage = `url("${c.image}")`; $('#cxEye').textContent = t.eyebrow || ''; $('#cxTitle').textContent = t.title;
  const draw = () => { $('#cxText').innerHTML = t.pages[pg].map((p) => `<p>${esc(p)}</p>`).join(''); $('#cxPg').textContent = `${pg + 1} / ${t.pages.length}`; $('#cxPrev').disabled = pg === 0; $('#cxNext').disabled = pg === t.pages.length - 1; };
  $('#cxPrev').onclick = () => { pg--; draw(); }; $('#cxNext').onclick = () => { pg++; draw(); };
  draw(); m.classList.add('show'); A.tone(660, .5, 'sine', .03);
}
document.addEventListener('click', (e) => { const g = e.target.closest('.gloss'); if (g) { e.preventDefault(); abrirCodex(g.dataset.codex); } });
$('#cxClose').onclick = () => $('#codex').classList.remove('show');

function toast(t) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; $('#toasts').appendChild(el); A.aviso(); setTimeout(() => el.classList.add('out'), 3800); setTimeout(() => el.remove(), 4600); }

// ---------------------------------------------------------------- a Luz (Cap. I): o quanto Aheryn está aceso
// ---------------------------------------------------------------- a Luz, idêntica à do Cap. I
// O topo mostra a região do corpo (nada, dedos, pulsos, pescoço, peito, rosto), não o número.
// Os três Aheryns: quieto (até 30, o cânone), medido (31 a 59), aceso (60 ou mais).
window.quieto = (s) => s.luz <= 30;
window.medido = (s) => s.luz > 30 && s.luz < 60;
window.aceso = (s) => s.luz >= 60;
let luzShown = st.luz;
function regiao(l) { return l < 8 ? 0 : l < 30 ? 1 : l < 50 ? 2 : l < 68 ? 3 : l < 85 ? 4 : 5; }
function mudaLuz(d) {
  if (!d) return; const antes = st.luz; st.luz = clamp(st.luz + d, 0, 100);
  d > 0 ? A.luzSobe() : A.luzDesce();
  const cl = document.body.classList, k = d > 0 ? 'luz-sobe' : 'luz-desce';
  cl.remove('luz-sobe', 'luz-desce'); void document.body.offsetWidth; cl.add(k);
  clearTimeout(mudaLuz.t); mudaLuz.t = setTimeout(() => cl.remove(k), 1700);
  const r0 = regiao(antes), r1 = regiao(st.luz);
  if (r0 !== r1) { const c = document.createElement('div'); c.className = 'luzcentro ' + (d > 0 ? 'up' : 'down'); c.innerHTML = `<span>${esc(U('regioes')[r1])}</span>`; document.body.appendChild(c); setTimeout(() => c.remove(), 2200); }
}
// veias douradas nas bordas: crescem com a Luz (o mesmo desenho do Cap. I)
(function veias() {
  let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const W = 1000, H = 1000; let d = '', g = 0;
  const ramo = (x, y, ang, len, prof) => {
    let path = `M${x.toFixed(1)} ${y.toFixed(1)}`; const passos = 8 + Math.floor(rnd() * 4), seg = len / passos;
    for (let i = 0; i < passos; i++) {
      ang += (rnd() - .5) * .45; x += Math.cos(ang) * seg; y += Math.sin(ang) * seg; path += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (prof < 2 && i > 1 && rnd() < .3) ramo(x, y, ang + (rnd() < .5 ? -1 : 1) * (.45 + rnd() * .5), len * .42, prof + 1);
    }
    d += `<path pathLength="1" class="v${prof}" data-g="${g}" d="${path}"/>`;
  };
  for (let i = 0; i < 4; i++) { g = i; ramo(0, 120 + i * 230 + rnd() * 80, (rnd() - .5) * .7, 170 + rnd() * 90, 0); }
  for (let i = 0; i < 4; i++) { g = 4 + i; ramo(W, 100 + i * 230 + rnd() * 80, Math.PI + (rnd() - .5) * .7, 170 + rnd() * 90, 0); }
  g = 8; ramo(70, H, -Math.PI / 2 + .35, 200, 0); g = 9; ramo(W - 70, H, -Math.PI / 2 - .35, 200, 0);
  $('#veias').innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${d}</svg>`;
  [0, 1, 2, 3, 8].forEach((k) => $('#veias').querySelectorAll(`path[data-g="${k}"]`).forEach((pp) => pp.classList.add('esq')));
})();
function drawLuz() {
  luzShown += (st.luz - luzShown) * .08;
  document.documentElement.style.setProperty('--luz', (luzShown / 100).toFixed(3));
  { const r = regiao(luzShown); if (r !== drawLuz.r) { drawLuz.r = r; $('#luzV').textContent = U('regioes')[r]; } }
  const cl = document.body.classList;
  cl.toggle('luz-alta', luzShown >= 60); cl.toggle('luz-baixa', luzShown <= 25);
  cl.toggle('marcado', !!(st.c1 && st.c1.marcado));
  document.documentElement.style.setProperty('--turvo', Math.min(1, (st.turvo || 0) / 5).toFixed(2));
  requestAnimationFrame(drawLuz);
}

// ---------------------------------------------------------------- o odre de vinho de cacto
// Em páginas marcadas com bebe:true, tocar no odre dá um gole: a Luz cai, o mundo turva (st.turvo).
// Sóbrio, Aheryn ouve e cheira mais longe; bêbado, essas opções aparecem riscadas. No parto, cada gole vira névoa.
const LINHAS_GOLE = L.linhasGole || [];
const naAbertura = (p) => !!(p && p.abertura && (st.ab || 0) < p.abertura.anos.length);
function desenhaCantil() {
  const b = $('#cantil'); if (!b) return;
  b.querySelector('.nivel').style.setProperty('--n', (st.cantil / (L.cantil || 6)).toFixed(3));
  b.querySelector('.qt').textContent = st.cantil;
  const p = P[st.i], pode = !!(p && ((p.bebe && st.cantil > 0) || naAbertura(p)) && !document.body.classList.contains('mg-on') && $('#cover').classList.contains('hide'));
  b.disabled = !pode; b.classList.toggle('pode', pode);
  b.title = st.cantil <= 0 ? U('cantilVazio') : pode ? U('cantilBeber') : U('cantilAqui');
  b.classList.toggle('afoga', !!(pode && pensaViva));
}
function beber(origem) {
  if (st.cantil <= 0) return false;
  st.cantil--; st.turvo = (st.turvo || 0) + 1; st.bebidos = (st.bebidos || 0) + 1;
  A.gole(); mudaLuz(-6);
  document.body.classList.remove('bebe'); void document.body.offsetWidth; document.body.classList.add('bebe');
  registrar('gole_' + st.bebidos, origem || P[st.i].id);
  salvar(); desenhaCantil();
  return true;
}
$('#cantil') && ($('#cantil').onclick = () => {
  const p = P[st.i]; if (naAbertura(p)) return aberturaGole(p);
  if (!p || !p.bebe || st.cantil <= 0) return;
  escondeCoach();
  if (pensaViva) { if (!beber('pensa')) return; return pensaViva.afoga(); }
  if (!beber()) return;
  const k = Math.min(st.bebidos, LINHAS_GOLE.length) - 1;
  if (LINHAS_GOLE[k]) { txt.insertAdjacentHTML('beforeend', pHTML(tr(LINHAS_GOLE[k]), 'novo gole')); panel.scrollTop = panel.scrollHeight; }
});
const sobrio = () => (st.turvo || 0) <= (L.limiteSobrio != null ? L.limiteSobrio : 2);

// ---------------------------------------------------------------- ícones de gesto (instrução como ícone, não como frase)
const GESTO = {
  segurar: '<svg viewBox="0 0 64 64"><circle class="anel" cx="26" cy="14" r="11"/><g transform="translate(13 20) scale(1.6)"><path d="M10 9.5V4a2 2 0 0 0-4 0v10"/><path d="M10 9a2 2 0 0 1 4 0v1"/><path d="M14 10a2 2 0 0 1 4 0v1"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L6 14"/></g></svg>',
  tocar: '<svg viewBox="0 0 64 64"><circle class="onda" cx="26" cy="14" r="7"/><g transform="translate(13 20) scale(1.6)"><path d="M10 9.5V4a2 2 0 0 0-4 0v10"/><path d="M10 9a2 2 0 0 1 4 0v1"/><path d="M14 10a2 2 0 0 1 4 0v1"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L6 14"/></g></svg>',
  odre: '<svg viewBox="0 0 64 64"><path d="M24 8h16M26 8v8c-8 4-13 12-13 22 0 11 8 17 19 17s19-6 19-17c0-10-5-18-13-22V8"/><path class="gota" d="M32 30c3 4 5 7 5 9a5 5 0 0 1-10 0c0-2 2-5 5-9z"/></svg>',
  sol: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" class="anel"/><circle cx="32" cy="32" r="14" class="lua"/></svg>',
};
// o cartão do gesto aparece no centro na primeira vez e some no primeiro toque
function gesto(root, icone, titulo, sub, ms) {
  const g = document.createElement('div'); g.className = 'gesto ' + icone;
  g.innerHTML = `${GESTO[icone] || ''}<p>${esc(titulo)}</p>${sub ? `<small>${esc(sub)}</small>` : ''}`;
  root.appendChild(g); requestAnimationFrame(() => g.classList.add('on'));
  const some = () => { g.classList.remove('on'); setTimeout(() => g.remove(), 500); root.removeEventListener('pointerdown', some, true); removeEventListener('keydown', some, true); };
  setTimeout(() => { root.addEventListener('pointerdown', some, true); addEventListener('keydown', some, true); }, 350);
  if (ms) setTimeout(some, ms);
  return some;
}
// o "coach" do odre: uma seta e um ícone colados ao HUD
function mostraCoach(titulo, sub, ms) {
  escondeCoach();
  const c = document.createElement('div'); c.id = 'coach';
  c.innerHTML = `${GESTO.tocar}<div><p>${esc(titulo)}</p><small>${esc(sub)}</small></div>`;
  document.body.appendChild(c);
  // a seta do cartão aponta para o odre, onde quer que ele esteja no topo
  const r = $('#cantil').getBoundingClientRect();
  c.style.top = (r.bottom + 14) + 'px'; c.style.right = Math.max(8, innerWidth - (r.left + r.width / 2) - 28) + 'px';
  requestAnimationFrame(() => c.classList.add('on'));
  if (ms) later(escondeCoach, ms);
}
function escondeCoach() { const c = $('#coach'); if (!c) return; c.classList.remove('on'); setTimeout(() => c.remove(), 400); }

// ---------------------------------------------------------------- a língua de sensação (a mesma do Cap. I)
// Um pensamento sobe sobre a imagem. Segurar é segui-lo (acende); se o leitor não faz nada, ele afunda
// sozinho (Aheryn contém). Só no Cap. V: tocar no odre enquanto ele flutua é beber por cima dele.
const camada = document.createElement('div'); camada.id = 'pensa'; document.body.appendChild(camada);
let pensaViva = null;
function estadoDe(i) { let k = i; while (k > 0 && !P[k].estado) k--; return (P[k] && P[k].estado) || 'seco'; }
function posPensa(seed) {
  const r = (n) => { const x = Math.sin(seed * 9301 + n * 49297) * 10000; return x - Math.floor(x); };
  if (matchMedia('(max-width: 820px), (orientation: portrait)').matches) return { x: 45 + r(1) * 10, y: 14 + r(2) * 18 };
  const dir = document.body.classList.contains('lado-dir');
  return { x: (dir ? 8 : 54) + r(1) * 26, y: 18 + r(2) * 46 };
}
const listaDe = (x) => [].concat(x || []);
function desfechoPensa(th, como, novo) {
  const t = como === 'seguiu' ? th.mais : como === 'bebeu' ? th.beber : th.conter;
  listaDe(t).forEach((x) => { txt.insertAdjacentHTML('beforeend', pHTML(sub(tr(x)), (novo ? 'novo ' : '') + (como === 'seguiu' ? 'pensado' : como === 'bebeu' ? 'gole' : ''))); });
  if (novo) panel.scrollTop = panel.scrollHeight;
}
function sensacao(p, dir) {
  camada.innerHTML = ''; pensaViva = null;
  document.body.dataset.estado = estadoDe(st.i);
  const cl = document.body.classList;
  if (!p.acender) { cl.remove('veias-cheias', 'acendendo'); document.querySelectorAll('#veias path.off').forEach((x) => x.classList.remove('off')); }
  listaDe(p.pensa).forEach((th, k) => {
    const feito = st.feitos['pe:' + th.id];
    if (feito) { later(() => desfechoPensa(th, feito, false), 60); return; }
    if ((th.se && !th.se(st)) || (th.luzMin && st.luz < th.luzMin) || (th.luzMax && st.luz > th.luzMax)) return;
    later(() => { if (P[st.i] === p) sobePensa(p, th, k); }, (th.atraso || 3000) * (window.__LEITURA_K || 1));
  });
  if (p.trai) {
    const t = p.trai;
    if (st.feitos['tr:' + p.id]) { if (t.texto) later(() => appendParas(t.texto, 'trai'), 80); }
    else if (dir > 0 && (!t.se || t.se(st))) later(() => { if (P[st.i] === p) { st.feitos['tr:' + p.id] = 1; salvar(); traicao(t); } }, (t.atraso || 2000) * (window.__LEITURA_K || 1));
  }
}
function sobePensa(p, th, k) {
  const el = document.createElement('button'); el.className = 'pensa'; el.type = 'button';
  el.innerHTML = `<span>${esc(sub(tr(th.t)))}</span>`;
  const pos = posPensa(k + th.id.length * 7); el.style.left = pos.x + '%'; el.style.top = pos.y + '%';
  camada.appendChild(el); A.ctx && A.sobe();
  if (th.voz) fala(th.voz, 300);
  let raf = 0, t0 = 0, fim = false;
  const acaba = (como) => {
    if (fim || P[st.i] !== p) return;
    fim = true; clearTimeout(morre); cancelAnimationFrame(raf); pensaViva = null; desenhaCantil();
    st.feitos['pe:' + th.id] = como; registrar('pensa_' + th.id, como); salvar();
    if (como === 'seguiu') { mudaLuz(th.luz || 4); if (th.flag) listaDe(th.flag).forEach((f) => { st.f[f] = true; }); if (th.tomSeguir) st.tom[th.tomSeguir] = (st.tom[th.tomSeguir] || 0) + 1; el.classList.add('seguido'); }
    else { el.classList.add('contido'); const tm = como === 'bebeu' ? 'frieza' : th.tomConter; if (tm) st.tom[tm] = (st.tom[tm] || 0) + 1; }
    later(() => { if (P[st.i] === p) desfechoPensa(th, como, true); }, como === 'seguiu' ? 700 : 500);
    setTimeout(() => el.remove(), 1600);
  };
  const vida = (th.vida || 7500) * (window.__LEITURA_K ? 0.3 : 1);
  const morre = setTimeout(() => { if (!fim) acaba('conteve'); }, vida); timers.push(morre);
  // beber por cima: o odre afoga o pensamento (só onde se pode beber)
  pensaViva = { afoga: () => { if (!fim) acaba('bebeu'); } };
  desenhaCantil();
  const anda = () => { const q = Math.min(1, (performance.now() - t0) / 1100); el.style.setProperty('--k', q.toFixed(3)); if (q >= 1) return acaba('seguiu'); raf = requestAnimationFrame(anda); };
  el.addEventListener('pointerdown', (ev) => { if (fim) return; ev.preventDefault(); t0 = performance.now(); el.classList.add('segura'); raf = requestAnimationFrame(anda); });
  const solta = () => { if (fim) return; cancelAnimationFrame(raf); el.classList.remove('segura'); el.style.setProperty('--k', '0'); };
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => el.addEventListener(ev, solta));
  el.addEventListener('contextmenu', (ev) => ev.preventDefault());
  el.addEventListener('keydown', (ev) => { if ((ev.key === 'Enter' || ev.key === ' ') && !fim) { ev.preventDefault(); acaba('seguiu'); } });
  if (window.__PENSA_BOT) setTimeout(() => { if (!fim) acaba(window.__PENSA_BOT); }, 200);
}
// o corpo trai: as veias sobem sem o leitor fazer nada
function traicao(t) {
  const cl = document.body.classList; cl.remove('trai'); void document.body.offsetWidth; cl.add('trai');
  A.ctx && A.trai(); if (t.luz) mudaLuz(t.luz);
  if (t.voz) fala(t.voz, 700);
  if (t.texto) later(() => appendParas(t.texto, 'trai'), 900);
  setTimeout(() => cl.remove('trai'), 2600);
}
// o gesto final do Cap. V: o avesso do apagar do Cap. I. O leitor acende as veias, linha por linha.
function renderAcender(p) {
  const ps = [...txt.children]; const cl = document.body.classList;
  const esq = new Set([0, 1, 2, 3, 8]), marca = !!(st.c1 && st.c1.marcado);
  const grupos = [8, 9, 0, 4, 1, 5, 2, 6, 3, 7].filter((x) => !(marca && esq.has(x)));
  const acendeGrupo = (x) => document.querySelectorAll(`#veias path[data-g="${x}"]`).forEach((pp) => pp.classList.remove('off'));
  cl.add('veias-cheias');
  document.querySelectorAll('#veias path').forEach((pp) => pp.classList.add('off'));
  if (st.feitos['ac:' + p.id]) { grupos.forEach(acendeGrupo); return true; }
  ps.slice(1).forEach((el) => { el.style.display = 'none'; });
  let vis = 1; const total = ps.length;
  box.innerHTML = `<button class="apagar-btn acender-btn" aria-label="${esc(U('acenderA'))}"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 4v52M30 18l-12-10M30 18l12-10M30 32l-16 8M30 32l16 8M30 44l-8 10M30 44l8 10"/></svg></button><p class="dica acender-dica">${esc(U('acenderA'))}</p>`;
  const btn = box.querySelector('.apagar-btn');
  btn.onclick = () => {
    A.ctx && A.acende(); mudaLuz(2);
    const passos = Math.max(1, total - 1), porVez = Math.ceil(grupos.length / passos);
    grupos.splice(0, porVez).forEach(acendeGrupo);
    if (vis < total) { const el = ps[vis++]; el.style.display = ''; el.classList.add('novo'); panel.scrollTop = panel.scrollHeight; }
    if (vis >= total) {
      grupos.splice(0).forEach(acendeGrupo);
      box.innerHTML = ''; st.feitos['ac:' + p.id] = 1; salvar();
      setTimeout(() => setNext(true), 900);
    }
  };
  return false;
}

// ---------------------------------------------------------------- a abertura: os trinta anos, gole a gole, até a Luz chegar a 10
function renderAbertura(p) {
  const ab = p.abertura, k = st.ab || 0;
  document.body.classList.add('na-abertura');
  const cap = $('#hudCap');
  if (cap) { cap.textContent = st.c1 && st.c1.veio ? U('abLuzC1') : U('abLuz'); cap.hidden = false; }
  ab.anos.slice(0, k).forEach((a) => appendParas([a.t], 'ano'));
  if (k >= ab.anos.length) { appendParas([ab.fecho]); return true; }
  later(() => { if (P[st.i] === p && naAbertura(p)) mostraCoach(U('abBeber'), U('abBeberSub')); }, 1800 + paras(p.texto).length * 700);
  return false;
}
let abOcupado = 0;
function aberturaGole(p) {
  const ab = p.abertura, k = st.ab || 0; if (k >= ab.anos.length || performance.now() < abOcupado) return;
  escondeCoach();
  abOcupado = performance.now() + (ab.anos[k].chuva ? 1700 : 650);
  const a = ab.anos[k], ultimo = k === ab.anos.length - 1, alvo = 10;
  const passo = ultimo ? st.luz - alvo : Math.max(1, Math.round((st.luz - alvo) / (ab.anos.length - k)));
  A.gole(); document.body.classList.remove('bebe'); void document.body.offsetWidth; document.body.classList.add('bebe');
  if (a.chuva) { mudaLuz(a.chuva); later(() => mudaLuz(-(passo + a.chuva)), 1500); } else mudaLuz(-passo);
  st.ab = k + 1;
  txt.insertAdjacentHTML('beforeend', pHTML(tr(a.t), 'novo ano')); panel.scrollTop = panel.scrollHeight;
  if (st.ab >= ab.anos.length) {
    later(() => { st.luz = alvo; appendParas([ab.fecho]); setNext(true); panel.scrollTop = panel.scrollHeight; salvar(); desenhaCantil(); }, a.chuva ? 2200 : 1400);
  }
  salvar(); desenhaCantil();
}

// ---------------------------------------------------------------- estatísticas (Supabase)
function registrar(escolha, opcao) {
  fetch(`${SUPA.url}/rest/v1/livro_escolhas?on_conflict=sessao,capitulo,escolha`, {
    method: 'POST', headers: { apikey: SUPA.key, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ capitulo: L.id, escolha: String(escolha).slice(0, 40), opcao: String(opcao).slice(0, 40), sessao: st.sessao }),
  }).catch(() => {});
}
async function estatisticas() {
  try {
    const r = await fetch(`${SUPA.url}/rest/v1/rpc/livro_estatisticas`, { method: 'POST', headers: { apikey: SUPA.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_capitulo: L.id }) });
    return r.ok ? r.json() : [];
  } catch (e) { return []; }
}

// ---------------------------------------------------------------- render de página
const txt = $('#ptext'), box = $('#choices'), btnNext = $('#next'), btnPrev = $('#prev'), panel = $('#page');
// um parágrafo pode ser: 'texto', { se: st => bool, t: 'texto' } ou st => 'texto' | [textos] | null
const umPara = (p) => (typeof p === 'string' ? p : typeof p === 'function' ? p(st) : (p && p.se(st) ? p.t : null));
const sub = (s) => (L.subst ? L.subst(s, st, tr) : s);
const paras = (list) => [].concat(typeof list === 'function' ? list(st) : (list || [])).map(umPara).flat().filter(Boolean).map(tr).map(sub);
function pHTML(p, extra = '') { const dlg = p.startsWith('—'); return `<p class="${dlg ? 'dlg' : ''} ${extra}">${linkify(p)}</p>`; }
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const vozUrl = (n) => 'assets/audio/voz/' + n + '.mp3';
const fala = (nome, ms = 0) => { if (!nome) return; later(() => { if (A.ctx && A.on) A.narrate(vozUrl(nome), null, true); }, ms); };
// sons amarrados a um parágrafo: tocam quando o leitor, no ritmo médio de leitura, chega nele (p = índice; -1 = o último)
let cuesPend = [];
const palavras = (el) => (el.textContent || '').trim().split(/\s+/).length;
const msAte = (els, k) => { if (!els.length) return 900; if (k < 0) k = els.length + k; k = Math.max(0, Math.min(els.length - 1, k)); let w = 0; for (let i = 0; i < k; i++) w += palavras(els[i]); return (700 + (w / 3.3) * 1000) * (window.__LEITURA_K || 1); };
function agendaItens(itens, els, base = 0) {
  (itens || []).forEach((it) => {
    if (it.se && !it.se(st)) return;
    const c = { done: false, fim: !!it.fim };
    c.tocar = () => { if (c.done) return; c.done = true; if (!A.ctx || !A.on) return; if (it.voz) A.narrate(vozUrl(it.voz), null, true); else if (it.fn) it.fn(A); else if (it.sfx) A.sfx(it.sfx, it.v != null ? it.v : .7); else if (it.s) A.once(it.s, it.v != null ? it.v : .7); };
    if (c.fim) cuesPend.push(c);
    later(c.tocar, base + (it.p != null ? msAte(els, it.p) : (it.ms != null ? it.ms : 900)));
  });
}

function render(dir = 1) {
  clearTimers(); cuesPend = []; A.stopNarr(); linkUsados.clear();
  const p = P[st.i]; if (!p) return;
  if (p.aoEntrar && !st.feitos['in:' + p.id]) { st.feitos['in:' + p.id] = 1; p.aoEntrar(st, { mudaLuz, toast: (t) => later(() => toast(tr(t)), 600) }); }
  setFundo(resolveFundo(p));
  if (A.ctx) { A.setZone(p.zona); if (p.som && dir > 0) A.once(p.som, .55); }
  document.body.dataset.zona = p.zona;
  { let k = st.i; while (k > 0 && !P[k].parte) k--; $('#parte').textContent = P[k].parte ? U('parte') + ' ' + P[k].parte : (U('prologo') || U('parte') + ' I'); }
  document.body.classList.remove('na-abertura'); escondeCoach(); { const hc = $('#hudCap'); if (hc) hc.hidden = true; }
  const vis = P.filter(visivel), n = vis.indexOf(p) + 1; $('#pnum').textContent = `${n}`;
  $('#prog').style.setProperty('--p', (n / vis.length).toFixed(3));
  panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
  panel.classList.toggle('cartao', !!p.cartao);
  if (p.cartao) {
    const c = p.cartao;
    txt.innerHTML = `<div class="ct"><p class="ct-num">${U('parte')} ${c.num}</p><h2 class="ct-nome">${esc(tr(c.nome))}</h2><span class="ct-orn">✦</span>
      <blockquote class="ct-epi"><p>${esc(tr(c.epigrafe))}</p><cite>${esc(tr(c.fonte))}</cite></blockquote></div>`;
  } else txt.innerHTML = paras(p.texto).map((t, k) => pHTML(t, k === 0 && p.capitular ? 'cap' : '')).join('');
  box.innerHTML = ''; box.classList.remove('urgente', 'sobPressao');
  [...txt.children].forEach((el, k) => { el.style.animationDelay = (k * .35) + 's'; });
  const extras = $('#extras'); extras.innerHTML = '';
  const narr = narrOf(p);
  const narrTag = p.narracaoLang && p.narracaoLang !== LANG ? ` (${p.narracaoLang.toUpperCase()})` : '';
  if (narr) extras.insertAdjacentHTML('beforeend', `<button class="chip" id="narr" hidden><i class="eq"></i>${U('ouvir')}${narrTag}</button>`);
  const cena = typeof p.cena === 'function' ? p.cena(st) : p.cena;
  if (cena) extras.insertAdjacentHTML('beforeend', `<button class="chip" id="cena">${U('cena')}</button>`);
  if (narr) ligaNarr(p, narr, dir);
  if (p.sons && dir >= 0) agendaItens(p.sons, [...txt.children]);
  if (cena) $('#cena').onclick = () => verCena(cena);
  let livre = true;
  if (p.escolha) livre = renderEscolha(p);
  if (p.dialogo) livre = renderDialogo(p);
  if (p.minijogo) livre = renderMinijogo(p);
  if (p.abertura) livre = renderAbertura(p);
  sensacao(p, dir);
  if (p.acender) livre = renderAcender(p);
  setNext(livre);
  // a primeira página do capítulo em que dá para beber: o odre se apresenta (uma vez)
  if (p.bebe && st.cantil > 0 && !st.f._tutOdre) { st.f._tutOdre = true; later(() => { if (P[st.i] === p) mostraCoach(U('odreTut'), U('odreTutSub'), 7000); }, 2200); }
  btnPrev.disabled = idxVis(st.i, -1) < 0; btnPrev.textContent = U('voltar');
  btnNext.textContent = p.fim ? U('fim') : U('prox');
  st.feitos[p.id] = st.feitos[p.id] || 1; salvar();
  desenhaCantil();
  panel.scrollTop = 0;
}
// a dublagem: o botão só aparece se o arquivo existir (enquanto Marcelo não grava, a página segue muda)
function ligaNarr(p, url, dir) {
  const b = $('#narr'); if (!b || !A.ctx) return;
  A.buf(url).then((buf) => {
    if (!buf || P[st.i] !== p || !$('#narr')) return;
    b.hidden = false;
    b.onclick = () => {
      if (A.narr) { A.stopNarr(); b.classList.remove('on'); return; }
      b.classList.add('on'); A.narrate(url, () => b.classList.remove('on')).then((ok) => { if (!ok) b.classList.remove('on'); });
    };
    if (A.on && dir >= 0) later(() => { if (P[st.i] === p && !A.narr) b.click(); }, 700);
  });
}
function setNext(on) { btnNext.disabled = !on; btnNext.classList.toggle('pulse', on); }
function appendParas(list, cls = '') { const ps = paras(list); ps.forEach((t, k) => { txt.insertAdjacentHTML('beforeend', pHTML(t, 'novo ' + cls)); txt.lastElementChild.style.animationDelay = (k * .35) + 's'; }); return ps.length; }
const rotulo = (o) => (o.silencio ? U('silencioR') : tr(typeof o.txt === 'function' ? o.txt(st) : o.txt));
// opção que não está disponível agora (bêbado demais, odre vazio...): aparece riscada, com o motivo
const riscada = (o) => !!(o.riscavel && o.se && !o.se(st));
const motivo = (o) => (o.motivo ? `<small class="motivo">${esc(tr(typeof o.motivo === 'function' ? o.motivo(st) : o.motivo))}</small>` : '');
const travaDe = (o) => (o.luzMin && st.luz < o.luzMin ? U('travaQuieta') : o.luzMax && st.luz > o.luzMax ? (o.travaAcesaTxt ? tr(o.travaAcesaTxt) : U('travaAcesa')) : null);
const optHTMLbase = (o, k) => `<button class="opt ${o.silencio ? 'sil' : ''} ${riscada(o) ? 'riscada' : ''}" data-id="${o.id}" ${riscada(o) ? 'disabled aria-disabled="true"' : ''}><span class="k">${riscada(o) ? '–' : k + 1}</span><span class="tx">${o.silencio ? `<em>${U('silencio')}</em>` : esc(rotulo(o))}${riscada(o) ? motivo(o) : ''}</span></button>`;
const optHTML = (o, k) => { const tv = travaDe(o);
  if (tv) return `<button class="opt travada" disabled data-id="${o.id}"><span class="k">✕</span><span class="tx"><s>${o.silencio ? `<em>${U('silencio')}</em>` : esc(rotulo(o))}</s><small>${esc(tv)}</small></span></button>`;
  return optHTMLbase(o, k).replace('class="opt ', `class="opt ${o.luzMin ? 'acesa ' : ''}`); };
const opcoesVis = (lista) => lista.filter((o) => !o.se || o.se(st) || riscada(o));
const resultadoDe = (o) => (typeof o.resultado === 'function' ? o.resultado(st) : o.resultado);

// ----- escolhas: abrem só depois de "Próxima" (o leitor termina de ler antes de decidir)
function renderEscolha(p) {
  const e = p.escolha, feita = st.escolhas[e.id];
  if (feita) { const o = e.opcoes.find((x) => x.id === feita); if (o) { box.innerHTML = `<p class="feita">${U('escolheu')} ${esc(rotulo(o))}</p>`; appendParas(resultadoDe(o)); } return true; }
  p._revelado = false; box.innerHTML = '';
  return true;
}
function abreEscolha(p) {
  const e = p.escolha, ops = opcoesVis(e.opcoes);
  const livres = ops.filter((o) => !riscada(o)), presas = ops.filter(riscada);
  box.innerHTML = `<p class="eyebrow">${e.pergunta ? esc(tr(e.pergunta)) : U('oque')}</p>` + livres.map(optHTML).join('') + presas.map((o) => optHTML(o, 0)).join('');
  box.querySelectorAll('.opt:not(.riscada):not(.travada)').forEach((b) => b.onclick = () => escolher(p, b.dataset.id));
  // escolha com tempo (como o proibido do Cap. I): se ninguém decide, vale o padrão
  if (e.janela) {
    box.classList.add('urgente', 'sobPressao');
    box.insertAdjacentHTML('beforeend', `<div class="tenso" style="--j:${e.janela}s"></div>`);
    A.tone(220, .6, 'triangle', .04); A.tone(165, .9, 'sine', .04, .2);
    later(() => { if (!st.escolhas[e.id]) escolher(p, e.padrao); }, e.janela * 1000 * (window.__LEITURA_K ? .05 : 1));
  }
}
function aplicar(o) {
  if (!o) return;
  if (o.eixo) { st.perfil = st.perfil || {}; st.perfil[o.eixo] = (st.perfil[o.eixo] || 0) + 1; }
  if (o.tom) [].concat(o.tom).forEach((t) => { st.tom[t] = (st.tom[t] || 0) + 1; });
  if (o.luz) mudaLuz(o.luz);
  ['hessa', 'shaa', 'pira'].forEach((k) => { if (o[k]) st[k] = (st[k] || 0) + o[k]; });
  if (o.gole) beber('escolha');
  if (o.trai) later(() => traicao(o.trai), o.trai.atraso || 1500);
  if (o.flag) [].concat(o.flag).forEach((f) => { st.f[f] = true; });
  const av = typeof o.aviso === 'function' ? o.aviso(st) : o.aviso;
  if (av) later(() => toast(tr(av)), 500);
}
function escolher(p, id) {
  const e = p.escolha; if (st.escolhas[e.id]) return;
  const o = e.opcoes.find((x) => x.id === id); st.escolhas[e.id] = id;
  if (o.fundo) { (st.fundoPag = st.fundoPag || {})[p.id] = o.fundo; setFundo(o.fundo); }
  box.querySelectorAll('.opt').forEach((b) => { b.disabled = true; b.classList.toggle('sel', b.dataset.id === id); });
  box.classList.remove('sobPressao'); const tz = box.querySelector('.tenso'); tz && tz.remove();
  if (o.som) A.sfx(o.som, .7);
  aplicar(o); A.escolha(); registrar(e.id, id); salvar();
  later(() => { appendParas(resultadoDe(o)); setNext(true); desenhaCantil(); }, 450);
  if (o.voz) fala(typeof o.voz === 'function' ? o.voz(st) : o.voz, o.vozAtraso || 900);
}

// ----- diálogo em rodadas: cada opção tem a própria resposta; a rodada pode abrir com uma fala do outro
// a rodada pode depender do estado (r.se); 'antes' e 'resposta' podem ser funções
function renderDialogo(p) {
  const d = p.dialogo, feito = st.dialogo[p.id] || [];
  // a rodada seguinte pode depender da resposta anterior: a lista é refeita a cada passo
  const rodadasVis = () => { const f = st.dialogo[p.id] || []; return d.rodadas.filter((r) => f.some(([rid]) => rid === r.id) || !r.se || r.se(st)); };
  const log = document.createElement('div'); log.className = 'dlog'; txt.appendChild(log);
  const linha = (quem, t, novo) => { log.insertAdjacentHTML('beforeend', `<p class="dlg ${quem} ${novo ? 'novo' : ''}">— ${esc(t)}</p>`); };
  // a fala de Aheryn vem entre aspas na opção; sem aspas, é um gesto (vira narração, sem travessão)
  const minha = (o, novo) => { const r = rotulo(o), m = r.match(/^[“"](.*)[”"]$/s); if (m) linha('eu', m[1], novo); else log.insertAdjacentHTML('beforeend', `<p class="acao ${novo ? 'novo' : ''}">${esc(r)}</p>`); };
  const narra = (t, novo) => { log.insertAdjacentHTML('beforeend', `<p class="nar ${novo ? 'novo' : ''}">${linkify(t)}</p>`); };
  const lista = (x) => [].concat(typeof x === 'function' ? x(st) : x).filter(Boolean).map(umPara).flat().filter(Boolean);
  const resp = (r, o) => lista(o.resposta != null ? o.resposta : r.resposta);
  const emite = (l, novo) => l.forEach((t) => { const s = tr(t); s.startsWith('—') ? linha('ele', s.replace(/^—\s*/, ''), novo) : narra(s, novo); });
  feito.forEach(([rid, oid]) => {
    const r = d.rodadas.find((x) => x.id === rid), o = r.opcoes.find((x) => x.id === oid);
    if (r.antes) emite(lista(r.antes));
    o.silencio ? log.insertAdjacentHTML('beforeend', '<p class="dlg sil">…</p>') : minha(o);
    emite(resp(r, o));
  });
  const next = () => {
    const k = (st.dialogo[p.id] || []).length, RR = rodadasVis();
    if (k >= RR.length) { box.innerHTML = ''; appendParas(p.depois); setNext(true); return; }
    const r = RR[k];
    if (r.antes && !r._dito) { r._dito = true; emite(lista(r.antes), true); later(next, 1400); return; }
    const ops = opcoesVis(r.opcoes);
    box.innerHTML = `<p class="eyebrow">${r.pergunta ? esc(tr(r.pergunta)) : U('resp') + ' ' + esc(tr(d.interlocutor))}</p>` + ops.filter((o) => !riscada(o)).map(optHTML).join('') + ops.filter(riscada).map((o) => optHTML(o, 0)).join('');
    box.querySelectorAll('.opt:not(.riscada):not(.travada)').forEach((b) => b.onclick = () => {
      const o = r.opcoes.find((x) => x.id === b.dataset.id);
      (st.dialogo[p.id] = st.dialogo[p.id] || []).push([r.id, o.id]); st.escolhas[r.id] = o.id;
      aplicar(o); registrar(r.id, o.id); salvar(); A.escolha(); box.innerHTML = '';
      o.silencio ? log.insertAdjacentHTML('beforeend', '<p class="dlg sil novo">…</p>') : minha(o, true);
      later(() => { A.tone(196, .4, 'sine', .03); emite(resp(r, o), true); panel.scrollTop = panel.scrollHeight; }, 900);
      later(next, 2400);
    });
  };
  d.rodadas.forEach((r) => { r._dito = (st.dialogo[p.id] || []).some(([rid]) => rid === r.id); });
  next();
  return (st.dialogo[p.id] || []).length >= rodadasVis().length;
}

// ----- vídeo em tela cheia
function verCena(src) {
  const m = $('#cenaModal'), v = $('#cenaV'); v.src = vsrc(src); m.classList.add('show'); A.duck(true); v.play().catch(() => {});
  const close = () => { v.pause(); m.classList.remove('show'); A.duck(false); };
  $('#cenaClose').onclick = close; v.onended = close;
}

// ---------------------------------------------------------------- minijogos (window.JOGOS5)
let overlay = $('#mg');
function renovaOverlay() { const n = overlay.cloneNode(false); n.className = ''; n.innerHTML = ''; overlay.replaceWith(n); overlay = n; }
function abreOverlay(cls) { renovaOverlay(); overlay.className = 'show ' + cls; document.body.classList.add('mg-on'); desenhaCantil(); return overlay; }
function fechaOverlay() { renovaOverlay(); document.body.classList.remove('mg-on'); desenhaCantil(); }
// o que os jogos recebem: idioma, áudio, estado, tradução e as ferramentas do livro
const ctxJogo = (p) => ({ lang: LANG, A, st, tr, U, p, paras, mudaLuz, beber, sobrio, toast: (t) => toast(tr(t)), registrar, salvar, esc, linkify, vsrc, L, narrate: (n) => { if (A.ctx && A.on) A.narrate(vozUrl(n)); },
  // a instrução do jogo, como ícone no centro (some no primeiro toque)
  gesto: (root, icone, ms) => { const tipo = p.minijogo; return gesto(root, icone, (U('gesto') || {})[tipo] || '', ((U('gestoSub') || {})[tipo] || '') + (icone === 'segurar' && !matchMedia('(pointer: coarse)').matches ? ' · ' + U('teclaSeg') : ''), ms); } });
function renderMinijogo(p) {
  const tipo = p.minijogo, done = st.feitos['mg:' + p.id];
  if (done) { appendParas(p.depois); return true; }
  const dica = typeof U('dica')[tipo] === 'function' ? U('dica')[tipo](st) : U('dica')[tipo];
  const vb = (U('verboDe') || {})[tipo];
  box.innerHTML = `<p class="eyebrow">${U('momento')}</p><button class="opt jogar" id="mgGo"><span class="k">▶</span><span class="tx">${vb ? `<span class="verbo v-${vb}">${esc(U('verbo')[vb])}</span>` : ''}${U('mg')[tipo]}</span></button><p class="dica">${dica}</p>`;
  $('#mgGo').onclick = () => {
    box.innerHTML = '';
    const o = abreOverlay('j5 ' + tipo);
    window.JOGOS5[tipo](o, ctxJogo(p)).then((res) => {
      st.jogos[tipo] = res || true; st.feitos['mg:' + p.id] = 1; salvar(); fechaOverlay();
      if (p.aoTerminar) p.aoTerminar(st, res, { mudaLuz, toast: (t) => later(() => toast(tr(t)), 400) });
      if (res && res.nav) return irProxima();
      const n0 = txt.children.length; appendParas(p.depois); setNext(true);
      if (p.sonsDepois) agendaItens(p.sonsDepois, [...txt.children].slice(n0));
      if (p.vozDepois) { const v = typeof p.vozDepois === 'function' ? p.vozDepois(st) : p.vozDepois; if (v) fala(v, 1200); }
      salvar();
    });
  };
  return false;
}

// ---------------------------------------------------------------- navegação
function irProxima() {
  const p = P[st.i];
  if (p && p.escolha && !st.escolhas[p.escolha.id] && !p._revelado) { p._revelado = true; setNext(false); abreEscolha(p); box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
  cuesPend.forEach((c) => c.tocar()); cuesPend = [];
  if (p && p.aoSair && !st.feitos['out:' + p.id]) { st.feitos['out:' + p.id] = 1; p.aoSair(st); }
  if (p && p.fim) return resumo();
  const j = idxVis(st.i, 1); if (j >= P.length) return resumo();
  st.i = j; A.ctx && A.virar(); render(1);
}
function irAnterior() { const j = idxVis(st.i, -1); if (j < 0) return; st.i = j; A.ctx && A.virar(); render(-1); }
btnNext.onclick = () => { if (!btnNext.disabled) irProxima(); };
btnPrev.onclick = irAnterior;
addEventListener('keydown', (e) => {
  if (document.body.classList.contains('mg-on') || !$('#cover').classList.contains('hide')) return;
  if ($('#codex').classList.contains('show')) { if (e.key === 'Escape') $('#codex').classList.remove('show'); return; }
  if (['ArrowRight', 'Enter', ' '].includes(e.key)) { e.preventDefault(); if (!btnNext.disabled) irProxima(); }
  else if (e.key === 'ArrowLeft') irAnterior();
  else if (/^[1-5]$/.test(e.key)) { const b = box.querySelectorAll('.opt:not(:disabled)')[+e.key - 1]; b && b.click(); }
  else if (e.key === 'b' || e.key === 'B') { const c = $('#cantil'); c && !c.disabled && c.click(); }
});
let sx = null, sy = null;
panel.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
panel.addEventListener('touchend', (e) => {
  if (sx == null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0 && !btnNext.disabled) irProxima(); else if (dx > 0) irAnterior(); }
});

// ---------------------------------------------------------------- resumo final (estilo Telltale)
function guardaEstado() {
  try {
    const todos = JSON.parse(localStorage.getItem('aqv_estado') || '{}');
    todos.v = 1;
    todos[L.chaveEstado || 'cap5'] = Object.assign(L.estadoFinal(st), { pontos: st.pontos || null, quando: new Date().toISOString() });
    localStorage.setItem('aqv_estado', JSON.stringify(todos));
  } catch (e) {}
}
// pontuação escondida: o capítulo calcula as partes; a jornada soma os capítulos anteriores lidos neste navegador
function pontosCap1() {
  try {
    if (ANTES.cap1 && Number.isFinite(ANTES.cap1.pontos)) return Math.round(ANTES.cap1.pontos);
    const c1 = JSON.parse(localStorage.getItem('livro_cap01') || 'null');
    if (c1 && c1.jogo && Number.isFinite(Number(c1.jogo.score))) return Math.round(Number(c1.jogo.score));
  } catch (e) {}
  return null;
}
function anteriores() {
  const e = ANTES, out = {};
  const c1 = pontosCap1(); if (c1 != null) out.cap01 = c1;
  if (e.cap2 && e.cap2.pontos && Number.isFinite(e.cap2.pontos.total)) out.cap02 = Math.round(e.cap2.pontos.total);
  if (e.cap3 && Number.isFinite(e.cap3.pontos)) out.cap03 = Math.round(e.cap3.pontos);
  if (e.cap4 && e.cap4.pontos && Number.isFinite(e.cap4.pontos.total)) out.cap04 = Math.round(e.cap4.pontos.total);
  return out;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function jogadorId() {
  try {
    let j = localStorage.getItem('aqv_jogador');
    if (!j || !UUID.test(j)) {
      const c1 = JSON.parse(localStorage.getItem('livro_cap01') || 'null');
      j = c1 && UUID.test(c1.sessao || '') ? c1.sessao : UUID.test(st.sessao) ? st.sessao : (crypto.randomUUID ? crypto.randomUUID() : null);
      if (j) localStorage.setItem('aqv_jogador', j);
    }
    return j;
  } catch (e) { return UUID.test(st.sessao) ? st.sessao : null; }
}
function calculaPontos() {
  const r = L.pontos(st), ant = anteriores();
  st.pontos = { total: r.total, partes: r.partes, antes: ant, somaAntes: Object.values(ant).reduce((a, b) => a + b, 0) };
  return st.pontos;
}
async function enviaPontos(pt) {
  const j = jogadorId(); if (!j) return null;
  const rpc = (cap, pontos, detalhes) => fetch(`${SUPA.url}/rest/v1/rpc/livro_salva_pontos`, {
    method: 'POST', headers: { apikey: SUPA.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_jogador: j, p_capitulo: cap, p_pontos: pontos, p_detalhes: detalhes }),
  }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  for (const [cap, v] of Object.entries(pt.antes)) await rpc(cap, Math.min(2000000, v), { origem: L.id });
  const r = await rpc(L.id, pt.total, Object.fromEntries(pt.partes));
  return r && r[0] ? r[0] : null;
}
function mostraPontos(pt, srv) {
  const loc = LANG === 'en' ? 'en-US' : 'pt-BR', n = (x) => Number(x).toLocaleString(loc);
  const temAntes = Object.keys(pt.antes).length > 0;
  const jornada = srv && srv.total != null ? Number(srv.total) : temAntes ? pt.somaAntes + pt.total : null;
  $('#rsPontos').innerHTML = `
    <p class="eyebrow">${U('pontos')}</p>
    <p class="rs-num">${n(pt.total)}</p>
    <ul class="rs-pts">${pt.partes.map(([k, v]) => `<li><span>${U('pts')[k]}</span><b>${n(v)}</b></li>`).join('')}
    ${temAntes ? `<li><span>${U('pts').antes}</span><b>${n(pt.somaAntes)}</b></li>` : ''}</ul>
    ${jornada != null ? `<p class="rs-jornada"><span>${U('jornada')}</span><b>${n(jornada)}</b>${srv && srv.posicao ? `<em>${U('posicao')(n(srv.posicao), n(srv.leitores))}</em>` : ''}</p>` : `<p class="rs-sem">${U('semCap1')}</p>`}`;
}
async function resumo() {
  const pt = calculaPontos();
  guardaEstado(); salvar();
  A.stopNarr();
  $('#resumo').classList.add('show');
  mostraPontos(pt, null); enviaPontos(pt).then((srv) => { if (srv) mostraPontos(pt, srv); });
  const R = L.resumo(st, LANG);
  $('#rsLuz').textContent = Math.round(st.luz);
  $('#rsFrase').textContent = R.frase;
  const rv = R.revela;
  $('#rsRevela').innerHTML = !rv ? '' : typeof rv === 'string' ? `<p>${esc(rv)}</p>`
    : `<div class="kcard"><div class="kimg" style="background-image:url('${rv.img}')"></div><div class="ktx"><p class="eyebrow">${esc(rv.olho)}</p><h3>${esc(rv.nome)}</h3><p class="ksub">${esc(rv.titulo)}</p><p class="ktexto">${esc(rv.texto)}</p>${L.proximo.url && rv.link ? `<a class="klink" href="${L.proximo.url}">${esc(rv.link)} →</a>` : ''}</div></div>`;
  $('#rsRevela').classList.toggle('card', !!rv && typeof rv !== 'string');
  registrar('goles_total', String(Math.min(6, st.bebidos || 0)));
  $('#rsPerfil').innerHTML = R.perfil ? `<p class="eyebrow">${U('perfilT')}</p><p class="rs-perfil">${esc(R.perfil)}</p>` : '';
  const luzF = Math.round(st.luz), pers = luzF <= 30 ? 'quieto' : luzF < 60 ? 'medido' : 'aceso';
  $('#rsRel').innerHTML = [U('persona')[pers]].concat(R.notas).map((r, k) => `<li${k ? '' : ' class="persona"'}>${esc(r)}</li>`).join('');
  const desenha = (stats) => {
    $('#rsEsc').innerHTML = R.linhas.map((l) => {
      const tot = stats.filter((x) => x.escolha === l.id).reduce((a, b) => a + Number(b.total), 0);
      const mine = stats.find((x) => x.escolha === l.id && x.opcao === l.opcao);
      const pct = tot && mine ? Math.round((Number(mine.total) / tot) * 100) : null;
      return `<li><span class="q">${esc(l.q)}</span><span class="a">${esc(l.a)}</span>${pct != null ? `<span class="pct"><i style="width:${pct}%"></i><b>${U('mesmo')(pct)}</b></span>` : ''}</li>`;
    }).join('');
  };
  desenha([]); desenha(await estatisticas());
}
const reiniciar = () => { st = novoEstado(); if (L.inicio) L.inicio(st); luzShown = st.luz; salvar(); $('#resumo').classList.remove('show'); render(1); };
$('#rsReler').onclick = () => { if (confirm(U('confirm'))) reiniciar(); };
$('#menuReset').onclick = () => { if (confirm(U('confirm'))) reiniciar(); };

// ---------------------------------------------------------------- idioma
function aplicaIdioma() {
  document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('.lang').forEach((b) => { b.textContent = LANG === 'pt' ? 'EN' : 'PT'; b.setAttribute('aria-label', LANG === 'pt' ? 'Read in English' : 'Ler em português'); });
  $('#cvEye').textContent = U('coverEye'); $('#cvSub').textContent = LANG === 'en' ? L.subtituloEn : L.subtitulo; $('#cvLede').textContent = U('coverLede');
  $('#cvGo').textContent = salvo && salvo.i > 0 ? U('coverRestart') : U('coverGo'); $('#cvCont').textContent = U('coverCont'); $('#cvHint').textContent = U('coverHint');
  $('.tl .cap').textContent = U('capN'); $('#rhead').textContent = `${L.titulo} · ${LANG === 'en' ? L.subtituloEn : L.subtitulo}`;
  $('#luz').title = U('luzTitle'); $('#luz .lbl').textContent = U('luz');
  $('#rsEye').textContent = U('fimCap'); $('#rsH').textContent = U('ficou'); $('#rsLuzL').textContent = U('luz'); $('#rsSuas').textContent = U('suas'); $('#rsReler').textContent = U('reler');
  $('#rsProx').textContent = (LANG === 'en' ? L.proximo.tituloEn : L.proximo.titulo) + (L.proximo.url ? ' →' : '');
  document.title = LANG === 'en' ? L.tituloPagEn : L.tituloPag;
  desenhaCantil();
}
document.querySelectorAll('.lang').forEach((b) => b.addEventListener('click', () => {
  LANG = LANG === 'pt' ? 'en' : 'pt'; try { localStorage.setItem('livro_lang', LANG); } catch (e) {}
  aplicaIdioma(); if ($('#cover').classList.contains('hide') && !document.body.classList.contains('mg-on')) render(0); if ($('#resumo').classList.contains('show')) resumo();
}));

// ---------------------------------------------------------------- capa / início
$('#cvTitle').textContent = L.titulo; $('#cover').style.setProperty('--capa', `url("${L.capa}")`);
if (L.proximo.url) $('#rsProx').href = L.proximo.url; else { $('#rsProx').removeAttribute('href'); $('#rsProx').classList.add('off'); }
const salvo = carregar();
if (salvo && salvo.i > 0) $('#cvCont').hidden = false;
aplicaIdioma();
Clima.set('areia'); document.body.classList.add('na-capa');
const comecar = (continuar) => {
  A.init(); A.resume();
  st = continuar && salvo ? salvo : novoEstado();
  if (!(continuar && salvo) && L.inicio) L.inicio(st);
  luzShown = st.luz; salvar();
  ['assets/audio/hino/louvor.mp3', 'assets/audio/sfx/gole.mp3', 'assets/audio/sfx/luz.mp3', 'assets/audio/sfx/pagina.mp3'].forEach((u) => A.buf(u));
  $('#cover').classList.add('hide'); document.body.classList.remove('na-capa'); A.virar();
  // o intertítulo: tela escura, só a frase, antes da primeira página (só em começo novo)
  if (!(continuar && salvo) && L.intertitulo) intertitulo(tr(L.intertitulo), () => render(1)); else render(1);
};
function intertitulo(frase, depois) {
  let el = $('#intertitulo');
  if (!el) { el = document.createElement('section'); el.id = 'intertitulo'; el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
  el.innerHTML = `<p>${esc(frase)}</p>`; el.classList.remove('sai'); el.classList.add('show');
  let feito = false;
  const fim = () => { if (feito) return; feito = true; clearTimeout(t); el.classList.add('sai'); setTimeout(() => { el.classList.remove('show', 'sai'); }, 1200); setTimeout(depois, 500); };
  const t = setTimeout(fim, 5200);
  el.onclick = fim; const tecla = (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { document.removeEventListener('keydown', tecla, true); e.preventDefault(); e.stopPropagation(); fim(); } };
  document.addEventListener('keydown', tecla, true);
}
$('#cvGo').onclick = () => comecar(false);
$('#cvCont').onclick = () => comecar(true);
$('#som').onclick = () => { A.init(); A.setOn(!A.on); $('#som').classList.toggle('off', !A.on); };
drawLuz();
window.__LIVRO = { get st() { return st; }, set st(v) { st = v; }, render, irProxima, A, ir: (id) => { st.i = P.findIndex((p) => p.id === id); render(1); } };
})();
