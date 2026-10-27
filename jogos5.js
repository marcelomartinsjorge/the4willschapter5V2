/* ==========================================================================
   Capítulo V · os momentos de jogo, em TRÊS VERBOS e um momento único
   PENSAMENTO (segurar acende; soltar apaga)
     RESSACA · os pensamentos sobem da areia: segurar faz um subir até virar lembrança
     PARTO   · um pensamento a mais: segurar a luz dentro da faixa, no compasso do coração
     RASTRO  · segurar no deserto acende uma luz; cada luz puxa os Tacets para longe da Pira
   OLHAR (tocar no que brilha)
     LAJE    · conferir o abrigo (o point-and-click do Cap. I) + o diário do deserto
     BANCADA · a alquimia debaixo da Laje: ler o couro, fazer de memória (manhã e noite)
     TROCA   · ler o corpo do Grakh na imagem e pôr no couro só o justo
   MOMENTO ÚNICO
     MINUTOS · o eclipse: um mapa no escuro, o anel do sol voltando, ações que custam tempo
   Cada jogo recebe (root, ctx) e devolve uma Promise com o resultado.
   Nenhum deles muda o que é fixo: só o custo, o tom e a pontuação.
   ========================================================================== */
(() => {
'use strict';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const BOT = () => !!window.__JOGO_BOT;   // testes automáticos

// ------------------------------------------------------------------ ícones dos potes (SVG simples, traço)
const ICON = {
  pote: '<svg viewBox="0 0 32 32"><path d="M10 6h12M11 6v3c-4 2-5 6-5 9 0 6 4 9 10 9s10-3 10-9c0-3-1-7-5-9V6"/></svg>',
  frasco: '<svg viewBox="0 0 32 32"><path d="M13 4h6M14 4v7l-6 12c-1 3 1 5 4 5h8c3 0 5-2 4-5l-6-12V4"/><path d="M11 20h10"/></svg>',
  gota: '<svg viewBox="0 0 32 32"><path d="M16 4c5 7 9 12 9 17a9 9 0 0 1-18 0c0-5 4-10 9-17z"/></svg>',
  bolsa: '<svg viewBox="0 0 32 32"><path d="M11 9c2 2 8 2 10 0M10 9l-3 14c0 3 3 5 9 5s9-2 9-5L22 9M13 6c1 2 5 2 6 0"/></svg>',
};
// os ingredientes da bancada (mesmo traço)
const ING_IC = {
  resina: '<svg viewBox="0 0 32 32"><path d="M16 5c-4 6-7 10-7 14a7 7 0 0 0 14 0c0-4-3-8-7-14z"/><path d="M12.5 19.5a3.5 3.5 0 0 0 3.5 3.5"/></svg>',
  raiz: '<svg viewBox="0 0 32 32"><path d="M16 4v8M16 12c-3 3-6 5-8 10M16 12c2 4 2 9 1 15M16 12c3 2 6 5 7 10M11 18l-3 1M20 17l2 3"/></svg>',
  flor: '<svg viewBox="0 0 32 32"><circle cx="16" cy="15" r="3"/><path d="M16 12c-2-4 0-7 0-7s2 3 0 7M19 14c3-3 7-2 7-2s-2 4-7 3M18 18c3 2 3 6 3 6s-4-1-5-5M14 18c-3 2-3 6-3 6s4-1 5-5M13 14c-3-3-7-2-7-2s2 4 7 3"/><path d="M16 21v7"/></svg>',
  seiva: '<svg viewBox="0 0 32 32"><path d="M13 28V9a3 3 0 0 1 6 0v19M19 16h3a2 2 0 0 0 2-2v-4M13 19h-3a2 2 0 0 1-2-2v-3"/><path d="M24 22c-1.5 2-2 3-2 4a2 2 0 0 0 4 0c0-1-.5-2-2-4z"/></svg>',
  creosoto: '<svg viewBox="0 0 32 32"><path d="M8 27L24 5M12 22c-3 0-5-2-5-4 2 0 5 1 5 4zM15 18c0-3 2-5 4-5 0 2-1 5-4 5zM18 14c-3 0-5-2-5-4 2 0 5 1 5 4zM21 10c0-3 2-4 4-4 0 2-1 4-4 4z"/></svg>',
  ferrao: '<svg viewBox="0 0 32 32"><path d="M8 27c9 0 14-5 14-12 0-5-4-8-8-6-2 1-2 4 0 5"/><path d="M14 9l-1-4 3 2"/></svg>',
  argila: '<svg viewBox="0 0 32 32"><path d="M5 22c0-5 5-8 11-8s11 3 11 8-5 5-11 5-11 0-11-5z"/><path d="M10 19c3-1.5 6-1.5 9 0"/></svg>',
  cinza: '<svg viewBox="0 0 32 32"><path d="M4 26h24M7 26c1-5 4-8 9-8s8 3 9 8"/><circle cx="12" cy="13" r="1"/><circle cx="18" cy="10" r="1"/><circle cx="21" cy="14" r="1"/></svg>',
};

// ------------------------------------------------------------------ uma imagem 16:9 que cabe na tela (e rola de lado no celular)
function palco(root, img, prop) {
  root.insertAdjacentHTML('beforeend', `<div class="ex-rolo"><div class="ex-caixa" style="--r:${prop};background-image:url('${img}')"></div></div>`);
  const rolo = root.querySelector('.ex-rolo'), caixa = root.querySelector('.ex-caixa');
  requestAnimationFrame(() => {
    rolo.scrollLeft = (rolo.scrollWidth - rolo.clientWidth) / 2;
    if (rolo.scrollWidth > rolo.clientWidth + 20) {
      const d = document.createElement('p'); d.className = 'ex-deslize'; d.textContent = '‹  ' + (document.documentElement.lang === 'en' ? 'Swipe to see it all' : 'Deslize para ver tudo') + '  ›'; root.appendChild(d);
      rolo.addEventListener('scroll', () => d.classList.add('some'), { once: true });
    }
  });
  return { rolo, caixa };
}

// ================================================================== VERBO · PENSAMENTO
// Um controle só para os três jogos: segurar (dedo, mouse ou espaço) acende; soltar apaga.
// As veias douradas na borda da tela mostram o quanto Aheryn está pensando.
function pensar(root, opts = {}) {
  root.classList.add('pensar');
  root.insertAdjacentHTML('beforeend', '<div class="pz-veias" aria-hidden="true"></div>');
  const veias = root.querySelector('.pz-veias');
  let seg = false;
  const down = (e) => { if (opts.alvo && !opts.alvo(e)) return; if (e && e.cancelable) e.preventDefault(); if (seg) return; seg = true; root.classList.add('segura'); opts.down && opts.down(e); };
  const up = (e) => { if (!seg) return; seg = false; root.classList.remove('segura'); opts.up && opts.up(e); };
  const kd = (e) => { if (e.code === 'Space' && opts.tecla !== false) { e.preventDefault(); if (!e.repeat) down(); } };
  const ku = (e) => { if (e.code === 'Space' && opts.tecla !== false) up(); };
  (opts.el || root).addEventListener('pointerdown', down);
  addEventListener('pointerup', up); addEventListener('pointercancel', up); addEventListener('keydown', kd); addEventListener('keyup', ku);
  return {
    get segura() { return seg; },
    set segura(v) { v ? down() : up(); },
    brilho(v) { veias.style.setProperty('--pz', clamp(v, 0, 1).toFixed(3)); },
    fim() { up(); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); removeEventListener('keydown', kd); removeEventListener('keyup', ku); },
  };
}

// ================================================================== VERBO · OLHAR
// A imagem inteira, pontos que brilham de leve, um contador grande e o painel de texto embaixo.
function olhar(root, c, { img, prop, rotulo }) {
  root.classList.add('explorar', 'olhar');
  const { rolo, caixa } = palco(root, img, prop);
  root.insertAdjacentHTML('beforeend', `<p class="ex-instr"></p><div class="ex-texto"><div class="ex-corpo"></div><div class="ex-acoes"></div></div>`);
  const corpo = root.querySelector('.ex-corpo'), acoes = root.querySelector('.ex-acoes'), instr = root.querySelector('.ex-instr');
  const api = {
    rolo, caixa, corpo, acoes,
    contador(n, tot, extra) { instr.innerHTML = `<span>${c.esc(rotulo)}${extra ? ' · ' + c.esc(extra) : ''}</span><b>${n}<small>/${tot}</small></b>`; },
    mostra(lista, somar) {
      const html = c.paras(lista).map((t) => `<p class="novo">${c.linkify(t)}</p>`).join('');
      if (somar) { corpo.insertAdjacentHTML('beforeend', html); corpo.scrollTop = corpo.scrollHeight; }
      else { corpo.innerHTML = html; corpo.scrollTop = 0; }
    },
    ponto(pt, onclick) {
      const b = document.createElement('button');
      b.className = 'ex-pt' + (pt.gema ? ' gema' : '');
      Object.assign(b.style, { left: (pt.x - pt.w / 2) + '%', top: (pt.y - pt.h / 2) + '%', width: pt.w + '%', height: pt.h + '%' });
      b.setAttribute('aria-label', c.tr(pt.rotulo)); b.dataset.id = pt.id;
      b.innerHTML = `<i></i><span>${c.esc(c.tr(pt.rotulo))}</span>`;
      b.onclick = (e) => { e.stopPropagation(); onclick(b, e); };
      caixa.appendChild(b); return b;
    },
  };
  return api;
}

// ================================================================== RESSACA (Pensamento)
// Um pensamento de cada vez sobe da areia. Segurar faz ele subir; soltar deixa a areia cobrir.
// Se chegar ao alto, Aheryn lembra (e a Luz sobe). O Título sobe sozinho: não se enterra.
function ressaca(root, c) {
  const { tr, A, st, L } = c;
  const cfg = L.ressaca, lista = cfg.pensamentos(st);
  return new Promise((resolve) => {
    root.innerHTML = `<div class="j5-bg" style="background-image:url('assets/images/areia-amanhecer.jpg')"></div><div class="j5-veu"></div>
      <div class="rs-areia"></div>
      <div class="rs-pens"><span class="rs-t"></span><small class="rs-sub"></small></div>
      <div class="rs-lembra" aria-live="polite"></div>
      <ol class="rs-cont">${lista.map(() => '<li></li>').join('')}</ol>`;
    const el = root.querySelector('.rs-pens'), tEl = root.querySelector('.rs-t'), subEl = root.querySelector('.rs-sub'), painel = root.querySelector('.rs-lembra'), cont = root.querySelectorAll('.rs-cont li');
    const subiram = [], enterrados = [];
    const pz = pensar(root);
    c.gesto(root, 'segurar');
    let k = -1, y = 0, vivo = false, graca = 0, fim = false, espera = 0, lendo = false, last = performance.now();
    const proximo = () => {
      k++; if (k >= lista.length) return encerra();
      const p = lista[k]; y = 0; vivo = true; graca = 1.1;
      tEl.textContent = tr(p.rotulo); subEl.textContent = p.forte ? tr(p.sub || cfg.tituloT) : '';
      el.className = 'rs-pens nasce' + (p.forte ? ' forte' : '');
      cont[k] && cont[k].classList.add('agora');
    };
    const lembra = (p) => {
      vivo = false; subiram.push(p.id); el.classList.add('chega'); cont[k] && (cont[k].className = 'subiu');
      c.mudaLuz(p.forte ? 6 : 4);
      A.sfx('pensamento-sobe', .5, () => { A.tone(660, .7, 'sine', .04); A.tone(990, .9, 'sine', .025, .1); });
      const txt = tr(p.texto);
      painel.innerHTML = `<p>${c.esc(txt)}<small class="rs-toque">${c.lang === 'en' ? 'tap to go on' : 'toque para seguir'}</small></p><button class="rs-seguir" aria-label="${c.lang === 'en' ? 'Continue' : 'Continuar'}">›</button>`; painel.classList.add('on'); lendo = true;
      // a lembrança fica até o leitor tocar (ninguém perde texto); o próximo pensamento espera
      espera = BOT() ? .3 : Infinity;
      painel.onclick = (e) => { e.stopPropagation(); if (espera > 0) espera = .001; };
      painel.querySelector('.rs-seguir').onclick = (e) => { e.stopPropagation(); if (espera > 0) espera = .001; };
    };
    const cobre = (p) => {
      vivo = false; enterrados.push(p.id); el.classList.add('enterra'); cont[k] && (cont[k].className = 'enterrado');
      A.sfx('areia-enterra', .6, () => A.hiss(.5, 380, .5, .18, 0, 'lowpass'));
      espera = BOT() ? .2 : 1.1;
    };
    const encerra = () => {
      if (fim) return; fim = true; pz.fim();
      el.className = 'rs-pens fora';
      const nomes = lista.filter((p) => subiram.includes(p.id)).map((p) => tr(p.rotulo));
      painel.innerHTML = `<p class="rs-sum"><span>${c.esc(tr(cfg.subiuT))}:</span> ${nomes.length ? nomes.map(c.esc).join(' · ') : c.esc(tr(cfg.nadaT))}</p>`; painel.classList.add('on');
      if (subiram.length >= 4) st.tom.ternura = (st.tom.ternura || 0) + 1; else if (subiram.length <= 1) st.tom.frieza = (st.tom.frieza || 0) + 1;
      c.registrar('ressaca', String(subiram.length));
      setTimeout(() => resolve({ subiram, enterrados }), BOT() ? 200 : 3400);
    };
    const loop = (now) => {
      if (fim || !el.isConnected) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const p = lista[k];
      if (vivo && p) {
        if (BOT()) pz.segura = ['chuva', 'menina'].includes(p.id);
        const seg = pz.segura;
        let vy = seg ? .32 : (p.forte ? .1 : -.21);
        if (graca > 0) { graca -= dt; if (!seg) vy = .05; }
        y += vy * dt * (BOT() ? 4 : 1);
        el.style.setProperty('--y', clamp(y, -.2, 1).toFixed(3));
        el.classList.toggle('sobe', seg);
        pz.brilho(.15 + clamp(y, 0, 1) * .7 + (seg ? .15 : 0));
        if (y >= 1) lembra(p); else if (y <= -.16) cobre(p);
      } else if (espera > 0) {
        espera -= dt;
        if (espera <= 0) { const lia = lendo; if (lendo) { painel.classList.remove('on'); lendo = false; } setTimeout(proximo, lia ? 550 : 250); espera = -1; }
      }
      requestAnimationFrame(loop);
    };
    setTimeout(() => { proximo(); requestAnimationFrame((n) => { last = n; requestAnimationFrame(loop); }); }, BOT() ? 100 : 1600);
  });
}

// ================================================================== LAJE (Olhar) + diário
function laje(root, c) {
  const { tr, A, st, p, L } = c, ex = p.laje;
  return new Promise((resolve) => {
    st.explorar = st.explorar || {};
    const reg = st.explorar[p.id] = st.explorar[p.id] || { vistos: [] };
    const pontos = ex.pontos.filter((pt) => !pt.se || pt.se(st));
    const obrig = pontos.filter((pt) => !pt.opcional);
    const O = olhar(root, c, { img: ex.img, prop: ex.proporcao, rotulo: tr(ex.instrucao) });
    c.gesto(root, 'tocar');
    let ocupado = false;
    const marca = (pt, b) => { if (!reg.vistos.includes(pt.id)) { reg.vistos.push(pt.id); if (pt.aoVer) pt.aoVer(st); } b.classList.add('visto'); c.salvar(); atualiza(); };
    const porta = () => {
      if (O.acoes.querySelector('.porta')) return;
      O.acoes.innerHTML = `<p class="ex-fecho">${c.esc(tr(typeof ex.fecho === 'function' ? ex.fecho(st) : ex.fecho))}</p><button class="cta porta">${c.esc(tr(ex.porta))}</button>`;
      O.acoes.querySelector('.porta').onclick = () => { A.sfx('passos-areia', .5, () => A.hiss(.3, 300, .6, .1, 0, 'lowpass')); resolve({ nav: true, vistos: reg.vistos.slice() }); };
    };
    const atualiza = () => {
      const n = obrig.filter((pt) => reg.vistos.includes(pt.id)).length;
      O.contador(n, obrig.length);
      if (n >= obrig.length && !ocupado) porta();
    };
    // o diário do deserto: capa, lista, entradas
    const diario = (pt, b) => {
      const D = L.diario; A.sfx('diario-abre', .6);
      const m = document.createElement('div'); m.className = 'ex-modal diario';
      m.innerHTML = `<div class="dz" style="background-image:url('assets/images/diario-deserto.jpg')"></div><div class="dz-texto"></div>`;
      root.appendChild(m); ocupado = true; requestAnimationFrame(() => m.classList.add('on'));
      const tx = m.querySelector('.dz-texto');
      const fechar = () => { A.sfx('diario-fecha', .6); m.classList.remove('on'); setTimeout(() => m.remove(), 380); ocupado = false; marca(pt, b); };
      const lista = () => {
        tx.innerHTML = `<h3>${c.esc(tr(D.titulo))}</h3><ol class="dz-lista">${D.entradas.map((e, i) => `<li><button data-i="${i}">${c.esc(tr(e.titulo))}</button></li>`).join('')}</ol><div class="dz-acoes"><button class="ghost dz-fechar">${c.esc(tr(D.fechar))}</button></div>`;
        tx.querySelectorAll('.dz-lista button').forEach((bt) => bt.onclick = () => entrada(D.entradas[+bt.dataset.i]));
        tx.querySelector('.dz-fechar').onclick = fechar;
      };
      const entrada = (e) => {
        A.sfx('diario-pagina', .6);
        tx.innerHTML = `<h3>${c.esc(tr(e.titulo))}</h3><p>${c.esc(tr(e.texto))}</p><div class="dz-acoes"><button class="ghost dz-voltar">${c.esc(tr(D.voltar))}</button><button class="ghost dz-fechar">${c.esc(tr(D.fechar))}</button></div>`;
        tx.querySelector('.dz-voltar').onclick = lista; tx.querySelector('.dz-fechar').onclick = fechar;
      };
      lista();
    };
    pontos.forEach((pt) => {
      const b = O.ponto(pt, () => {
        if (ocupado) return;
        if (pt.tipo === 'diario') return diario(pt, b);
        if (pt.som) A.sfx(pt.som, .55);
        O.mostra(typeof pt.texto === 'function' ? pt.texto(st) : pt.texto); marca(pt, b);
      });
      if (reg.vistos.includes(pt.id)) b.classList.add('visto');
    });
    O.mostra(c.paras(p.texto).slice(-1));
    atualiza();
    if (BOT()) setTimeout(() => { [...O.caixa.querySelectorAll('.ex-pt')].forEach((b, i) => setTimeout(() => !ocupado && b.click(), 100 + i * 120)); setTimeout(() => { const d = root.querySelector('.dz-fechar'); d && d.click(); }, 1600); setTimeout(() => { const pb = root.querySelector('.porta'); pb && pb.click(); }, 2600); }, 300);
  });
}

// ================================================================== TROCA (Olhar)
// Cada Grakh senta do outro lado do couro. Os pontos do corpo dele brilham na imagem:
// ler o corpo diz o que ele precisa. Os itens vêm do alforje (o que a bancada fez + ingredientes).
// Preço: o item que ele precisa, bem feito, basta; médio pede mais uma coisa; mal feito, mais duas.
// O que está no couro volta para o alforje com um toque, até empurrar.
const QV = { ruim: 0, medio: 1, bom: 2 };
function troca(root, c) {
  const { tr, A, st, L } = c, cfg = L.troca, B = L.bancada, alf = L.alforje(st);
  const nomeIng = (id) => tr((B.ingredientes.find((x) => x.id === id) || {}).nome || id);
  const nomeRec = (id) => tr((B.receitas.find((x) => x.id === id) || {}).nome || id);
  return new Promise((resolve) => {
    root.classList.add('troca');
    const O = olhar(root, c, { img: cfg.img, prop: 1920 / 1080, rotulo: tr(cfg.olharT) });
    c.gesto(root, 'tocar');
    O.acoes.innerHTML = `
      <div class="tc-couro"><p class="tc-rot">${c.esc(tr(cfg.noCouro))}</p><div class="tc-mesa"></div></div>
      <div class="tc-itens"></div>
      <p class="tc-sinal"></p>
      <div class="tc-bts"><button class="ghost tc-nao">${c.esc(tr(cfg.naoTem))}</button><button class="cta tc-go" disabled>${c.esc(tr(cfg.empurrar))}</button></div>`;
    const $ = (s) => root.querySelector(s);
    const mesa = $('.tc-mesa'), sinal = $('.tc-sinal'), go = $('.tc-go'), nao = $('.tc-nao'), itens = $('.tc-itens');
    const res = { ok: {}, q: {}, demais: 0, pontos: 0, olhou: 0 };
    let ci = 0, posto = [], tent = 0, travado = false, vistos = [];
    const unid = (k) => (k.startsWith('u:') ? alf.prontos.find((u) => 'u:' + u.uid === k) : null);
    const qtd = (k) => posto.filter((x) => x === k).length;
    const icDe = (k) => { const u = unid(k); return u ? ICON[cfg.icones[u.id]] || ICON.pote : (ING_IC[k.slice(2)] || ICON.bolsa); };
    const nomeDe = (k) => { const u = unid(k); return u ? nomeRec(u.id) : nomeIng(k.slice(2)); };
    const desenhaItens = () => {
      const P1 = alf.prontos.filter((u) => !posto.includes('u:' + u.uid));
      const P2 = Object.entries(alf.ingr).map(([id, n]) => [id, n - qtd('i:' + id)]).filter(([, n]) => n > 0);
      itens.innerHTML = P1.map((u) => `<button class="tc-it" data-k="u:${u.uid}">${ICON[cfg.icones[u.id]] || ICON.pote}<span>${c.esc(nomeRec(u.id))}</span><em class="q q-${u.q}">${c.esc(tr(B.qual[u.q]))}</em></button>`).join('')
        + P2.map(([id, n]) => `<button class="tc-it ingr" data-k="i:${id}">${ING_IC[id] || ICON.bolsa}<span>${c.esc(nomeIng(id))}</span><em class="n">×${n}</em></button>`).join('');
      itens.querySelectorAll('.tc-it').forEach((b) => b.onclick = () => {
        if (travado || posto.length >= 4) return;
        posto.push(b.dataset.k); A.sfx('couro-item', .5, () => A.hiss(.12, 900, .8, .1)); desenhaMesa(); leitura();
        const u = unid(b.dataset.k), cl = cfg.clientes[ci];
        if (u && u.id === cl.precisa) A.sfx('grakh-bufa', .5, () => A.hiss(.4, 260, .8, .12, 0, 'lowpass'));
      });
    };
    // o que está no couro, do ponto de vista dele
    const avalia = () => {
      const cl = cfg.clientes[ci];
      const precisos = posto.map(unid).filter((u) => u && u.id === cl.precisa);
      if (!precisos.length) return { tem: false, n: posto.length };
      const melhor = precisos.reduce((a, b) => (QV[b.q] > QV[a.q] ? b : a));
      return { tem: true, melhor, q: melhor.q, preco: cfg.preco[melhor.q] || 1, n: posto.length };
    };
    const leitura = () => {
      const cl = cfg.clientes[ci]; if (!posto.length) { sinal.textContent = ''; sinal.className = 'tc-sinal'; return; }
      const v = avalia();
      const cls = !v.tem ? 'errado' : v.n < v.preco ? 'quer' : v.n === v.preco ? 'bom' : 'demais';
      sinal.className = 'tc-sinal on ' + cls;
      sinal.textContent = !v.tem ? tr(cfg.errado).replace('{n}', cl.nome) : v.n < v.preco ? tr((cl.quer || {})[v.q] || cfg.recusa) : v.n === v.preco ? tr(cl.bom) : tr(cfg.demais);
    };
    const desenhaMesa = () => {
      mesa.innerHTML = posto.map((k, i) => `<button class="tc-tok" data-i="${i}" title="${c.esc(nomeDe(k))}">${icDe(k)}</button>`).join('');
      mesa.querySelectorAll('.tc-tok').forEach((b) => b.onclick = () => { if (travado) return; posto.splice(+b.dataset.i, 1); A.sfx('couro-item', .4, () => A.hiss(.12, 700, .8, .08)); desenhaMesa(); leitura(); });
      go.disabled = !posto.length || travado; nao.disabled = travado;
      desenhaItens();
    };
    const bts = cfg.pontos.map((pt) => O.ponto(pt, (b) => {
      if (travado) return;
      const cl = cfg.clientes[ci];
      if (!vistos.includes(pt.id)) { vistos.push(pt.id); res.olhou++; }
      b.classList.add('visto'); A.tone(520, .25, 'sine', .025);
      O.mostra([cl.pistas[pt.id]], true);
      O.contador(vistos.length, cfg.pontos.length, cl.nome);
    }));
    const cliente = () => {
      const cl = cfg.clientes[ci]; posto = []; tent = 0; travado = false; vistos = [];
      bts.forEach((b) => b.classList.remove('visto'));
      O.corpo.innerHTML = `<p class="tc-nome">${c.esc(cl.nome)}<small>${c.esc(tr(cfg.oferece))}: ${c.esc(tr(cl.oferta))}</small></p><p class="novo">${c.linkify(tr(cl.chega))}</p>`;
      O.corpo.classList.remove('in'); void O.corpo.offsetWidth; O.corpo.classList.add('in');
      O.contador(0, cfg.pontos.length, cl.nome);
      desenhaMesa(); leitura();
      if (BOT()) setTimeout(() => {
        bts[0].click();
        const precisos = alf.prontos.filter((u) => u.id === cl.precisa).sort((a, b) => QV[b.q] - QV[a.q]);
        if (!precisos.length) return nao.click();
        posto.push('u:' + precisos[0].uid);
        const preco = cfg.preco[precisos[0].q] || 1;
        const outros = alf.prontos.filter((u) => u.uid !== precisos[0].uid && !['antidoto', 'unguento', 'po'].includes(u.id)).map((u) => 'u:' + u.uid)
          .concat(Object.entries(alf.ingr).flatMap(([id, n]) => Array(Math.max(0, n)).fill('i:' + id)));
        while (posto.length < preco && outros.length) posto.push(outros.shift());
        desenhaMesa(); leitura(); setTimeout(() => (posto.length >= preco ? go.click() : nao.click()), 150);
      }, 300);
    };
    const proximo = () => { ci++; if (ci >= cfg.clientes.length) { c.registrar('troca', String(Object.values(res.ok).filter(Boolean).length)); c.salvar(); return setTimeout(() => resolve(res), 400); } cliente(); };
    const consome = (k) => {
      if (k.startsWith('u:')) { const i = alf.prontos.findIndex((u) => 'u:' + u.uid === k); if (i >= 0) alf.prontos.splice(i, 1); }
      else { const id = k.slice(2); alf.ingr[id] = Math.max(0, (alf.ingr[id] || 0) - 1); }
    };
    go.onclick = () => {
      if (travado || !posto.length) return;
      const cl = cfg.clientes[ci], v = avalia();
      travado = true; go.disabled = true; nao.disabled = true;
      if (v.tem && v.n >= v.preco) {
        const resto = posto.slice(); resto.splice(resto.indexOf('u:' + v.melhor.uid), 1);
        const levar = ['u:' + v.melhor.uid].concat(resto.slice(0, v.preco - 1)), volta = resto.slice(v.preco - 1);
        levar.forEach(consome);
        res.ok[cl.id] = true; res.q[cl.id] = v.q;
        const exato = !volta.length;
        const base = { bom: 2400, medio: 1600, ruim: 1000 }[v.q] || 1000;
        res.pontos += exato ? (tent === 0 ? base : Math.round(base * .6)) : 700;
        if (exato && tent === 0 && v.q === 'bom') st.pira += 1;
        if (!exato) { res.demais++; if (res.demais === 1) { st.hessa -= 1; c.toast(cfg.hessaViu); } }
        A.sfx('grakh-grunhe', .55, () => A.tone(110, .5, 'sawtooth', .05, 0, .8));
        sinal.className = 'tc-sinal on bom';
        sinal.textContent = (exato ? '' : tr(cfg.devolve) + ' ') + tr(cl.aceita) + (v.preco > 1 ? ' ' + tr(cfg.levaResto) : '');
        mesa.classList.add('leva');
        setTimeout(() => { mesa.classList.remove('leva'); posto = []; c.salvar(); proximo(); }, BOT() ? 300 : 3800);
        return;
      }
      tent++;
      if (tent >= 2) {
        res.ok[cl.id] = false; st.pira -= 1; posto = []; desenhaMesa();
        sinal.className = 'tc-sinal on errado'; sinal.textContent = tr(cfg.vaiEmbora).replace('{n}', cl.nome);
        setTimeout(proximo, BOT() ? 300 : 3200); return;
      }
      sinal.className = 'tc-sinal on errado'; sinal.textContent = tr(cfg.recusa);
      $('.tc-couro').classList.remove('nao'); void $('.tc-couro').offsetWidth; $('.tc-couro').classList.add('nao');
      setTimeout(() => { travado = false; desenhaMesa(); leitura(); }, 1600);
    };
    // não ter o que ele precisa não é recusar: ele só vai embora
    nao.onclick = () => {
      if (travado) return; travado = true; go.disabled = true; nao.disabled = true;
      const cl = cfg.clientes[ci]; res.ok[cl.id] = false; posto = []; desenhaMesa();
      sinal.className = 'tc-sinal on errado'; sinal.textContent = tr(cfg.vaiEmbora).replace('{n}', cl.nome);
      setTimeout(proximo, BOT() ? 300 : 3000);
    };
    cliente();
  });
}

// ================================================================== MINUTOS (o momento único: o eclipse)
function minutos(root, c) {
  const { tr, A, st, L } = c, cfg = L.minutos;
  return new Promise((resolve) => {
    root.classList.add('explorar');
    const { caixa } = palco(root, 'assets/images/goelas-escuro.jpg', 1920 / 1080);
    root.insertAdjacentHTML('beforeend', `
      <div class="mn-anel"><svg viewBox="0 0 100 100"><circle class="fundo" cx="50" cy="50" r="40"/><circle class="sol" cx="50" cy="50" r="40" pathLength="100"/><circle class="lua" cx="50" cy="50" r="31"/></svg><span>${c.esc(tr(cfg.anelT))}</span></div>
      <div class="mn-painel"><div class="mn-txt"></div><button class="cta mn-ok">${c.lang === 'en' ? 'Continue' : 'Continuar'}</button></div>`);
    const anel = root.querySelector('.mn-anel'), anelSol = root.querySelector('.sol'), painel = root.querySelector('.mn-painel'), ptxt = root.querySelector('.mn-txt'), ok = root.querySelector('.mn-ok');
    // no escuro, quem está apagado anda sem ser visto: Luz baixa ganha uma marca
    const marcas = cfg.marcas + (st.luz <= 30 ? 1 : 0);
    const total = marcas * cfg.segundosPorMarca;
    let t = 0, pausado = true, fim = false, last = performance.now();
    const feitas = [];
    // ouvir os soldados mostra onde pisar: a próxima ação custa uma marca a menos (quem bebe não ouve, mas ganha a marca extra)
    let desc = 0;
    const custoDe = (a) => (desc && !a.fim && a.custo > 1 && a.id !== 'ouvir' ? a.custo - 1 : a.custo);
    const restam = () => Math.max(0, marcas - Math.ceil(t / cfg.segundosPorMarca - 1e-6));
    const desenha = () => {
      anelSol.style.strokeDasharray = `${(t / total) * 100} 100`;
      anel.classList.toggle('pouco', restam() <= 1);
      root.querySelectorAll('.mn-pt').forEach((b) => { const a = cfg.acoes.find((x) => x.id === b.dataset.id); const cu = custoDe(a); b.classList.toggle('caro', !feitas.includes(a.id) && cu > restam() && !a.fim); b.classList.toggle('desc', cu < a.custo); const bb = b.querySelector('b'); if (bb && !feitas.includes(a.id)) bb.textContent = '●'.repeat(cu); });
    };
    const encerra = (motivoFim) => {
      if (fim) return; fim = true;
      A.sfx('sol-volta', .6, () => { A.tone(880, 1.4, 'sine', .04); A.tone(1320, 1.8, 'sine', .025, .2); });
      root.classList.add('volta');
      ptxt.innerHTML = `<p class="mn-fim">${c.esc(tr(cfg.acabouT))}</p>`; ok.textContent = c.lang === 'en' ? 'The light comes back' : 'A luz volta';
      painel.classList.add('on'); ok.onclick = () => resolve({ feitas, marcasSobrando: restam(), fim: motivoFim });
      if (BOT()) setTimeout(() => ok.click(), 300);
    };
    const abrePassos = (a) => {
      const passos = a.passos || [a.texto]; let k = 0;
      const passo = () => {
        const lista = c.paras(passos[k]);
        ptxt.innerHTML = lista.map((s) => `<p class="${s.startsWith('—') ? 'dlg' : ''}">${c.esc(s)}</p>`).join(''); ptxt.scrollTop = 0;
        if (a.voz && k === passos.length - 1) setTimeout(() => c.narrate(a.voz), 600);
        ok.textContent = c.lang === 'en' ? 'Continue' : 'Continuar';
        ok.onclick = () => { k++; if (k < passos.length) return passo(); painel.classList.remove('on'); pausado = false; last = performance.now(); if (a.id === 'ouvir' && cfg.pisarT) { c.toast(cfg.pisarT); setTimeout(() => c.narrate('c01-pisar'), 500); } if (a.fim || t >= total - .01) encerra(a.fim ? 'esconder' : 'tempo'); };
        if (BOT()) setTimeout(() => ok.click(), 200);
      };
      painel.classList.add('on'); pausado = true; passo();
    };
    cfg.acoes.forEach((a) => {
      const trava = a.trava && a.trava(st);
      const b = document.createElement('button'); b.className = 'mn-pt' + (trava ? ' trava' : '') + (a.fim ? ' fim' : ''); b.dataset.id = a.id;
      b.style.left = a.x + '%'; b.style.top = a.y + '%';
      b.innerHTML = `<i></i><span>${c.esc(tr(a.rotulo))}${a.custo ? `<b>${'●'.repeat(a.custo)}</b>` : ''}${trava ? `<small>${c.esc(tr(a.motivo))}</small>` : ''}</span>`;
      b.onclick = (e) => {
        e.stopPropagation(); if (fim || pausado || trava || feitas.includes(a.id)) return;
        if (!a.fim && custoDe(a) > restam()) { b.classList.remove('nao'); void b.offsetWidth; b.classList.add('nao'); A.tone(160, .3, 'square', .03); return; }
        feitas.push(a.id); b.classList.add('feito'); c.registrar('minuto_' + feitas.length, a.id);
        if (a.id === 'beber') c.beber('minutos');
        if (a.id === 'po') A.sfx('po-vento', .6, () => A.hiss(1.2, 1800, .6, .12)), setTimeout(() => A.sfx('cavalos-panico', .7), 600);
        if (a.id === 'tukk') A.sfx('arrasta', .5, () => A.hiss(1.4, 300, .6, .14, 0, 'lowpass'));
        const cu = custoDe(a); if (cu < a.custo) desc = 0; if (a.id === 'ouvir') desc = 1;
        t = Math.min(total, t + cu * cfg.segundosPorMarca); desenha();
        abrePassos(a);
      };
      caixa.appendChild(b);
    });
    // a ouvida tem duas partes: os soldados (sem voz) e o que Aheryn entende (com voz)
    const ouvir = cfg.acoes.find((a) => a.id === 'ouvir'); if (ouvir && !ouvir.passos) ouvir.passos = [ouvir.texto.slice(0, 3), ouvir.texto.slice(3)];
    const loop = (now) => {
      if (fim || !root.isConnected) return;
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (!pausado) { t += dt * (BOT() ? 8 : 1); desenha(); if (t >= total) { t = total; desenha(); return encerra('tempo'); } }
      requestAnimationFrame(loop);
    };
    desenha(); requestAnimationFrame(loop);
    A.sfx('eclipse-total', .4);
    setTimeout(() => c.narrate('c01-dica'), BOT() ? 100 : 3600);
    // o tempo só começa a correr depois que o leitor viu o cartão do gesto (ou tocou na tela)
    const solta = () => { if (!fim && pausado && !painel.classList.contains('on')) { pausado = false; last = performance.now(); } };
    c.gesto(root, 'sol', BOT() ? 50 : 3200);
    root.addEventListener('pointerdown', solta, { once: true, capture: true });
    setTimeout(solta, BOT() ? 60 : 3300);
    if (BOT()) setTimeout(() => { ['shaa', 'ouvir'].forEach((id, i) => setTimeout(() => { const b = caixa.querySelector(`.mn-pt[data-id="${id}"]`); b && b.click(); }, 300 + i * 1200)); }, 200);
  });
}

// ================================================================== PARTO (Pensamento · o clímax)
function parto(root, c) {
  const { tr, A, st, L } = c, cfg = L.parto;
  const dois = (st.escolhas.proibido5 || 'crianca') === 'dois';
  const turvo = st.turvo || 0, marca = !!(st.c1 && st.c1.marcado);
  return new Promise((resolve) => {
    root.innerHTML = `<video class="j5-bg" src="${c.vsrc('assets/clip/veias.mp4')}" muted loop playsinline autoplay></video><div class="j5-veu"></div>
      <div class="pt-brilho"></div>
      <div class="pt-linhas"></div>
      <div class="pt-medidor"><div class="pt-faixa"></div><div class="pt-luz"></div><div class="pt-marca"></div></div>
      <div class="pt-cores"><span class="pt-c rapido" title="cria"></span>${dois ? '<span class="pt-c lento" title="Shaa"></span>' : ''}</div>
      <div class="pt-vida"><i></i><span>${c.esc(tr(cfg.vidaT))}</span></div>`;
    const v = root.querySelector('video'); v && v.play().catch(() => {});
    const $ = (s) => root.querySelector(s);
    const faixaEl = $('.pt-faixa'), luzEl = $('.pt-luz'), marcaEl = $('.pt-marca'), vidaEl = $('.pt-vida i'), brilho = $('.pt-brilho'), linhas = $('.pt-linhas');
    const DUR = BOT() ? 6 : 28, larg = Math.max(.14, (dois ? .22 : .26) - (marca ? .03 : 0) - Math.min(.04, turvo * .01));
    // o mundo some: só ficam os corações
    A.abafa(true);
    const pz = pensar(root);
    c.gesto(root, 'segurar');
    let Lz = .1, vel = 0, t = 0, dentro = 0, flares = 0, alto = 0, vida = 0, mostradas = 0, fim = false, last = performance.now();
    let bpmR = 148, bpmL = 46, proxR = 0, proxL = .4;
    const centro = (tt) => {
      if (!dois) return .52 + Math.sin(tt * .8) * .13 + Math.sin(tt * .31) * .05;
      // dois corações: a faixa sobe e desce puxada pelos dois ritmos
      return .62 + Math.sin(tt * 1.15) * .1 + Math.sin(tt * .47 + 1) * .08;
    };
    const linha = (voz) => {
      if (mostradas >= cfg.linhas.length) return;
      // cada pensamento que sobe também é dito: quem segura a luz não consegue ler (parto-1 … parto-8)
      if (voz) c.narrate('parto-' + (mostradas + 1), true);
      const p = document.createElement('p'); p.textContent = tr(cfg.linhas[mostradas]); p.style.setProperty('--i', mostradas); linhas.appendChild(p); mostradas++;
      if (linhas.children.length > 4) linhas.firstElementChild.classList.add('vai');
      setTimeout(() => { const f = linhas.querySelector('.vai'); f && f.remove(); }, 1500);
    };
    const loop = (now) => {
      if (fim || !faixaEl.isConnected) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
      // a luz: segurar sobe, soltar cai; o vinho faz a mão tremer
      const acel = pz.segura ? 1.7 : -1.45;
      vel = clamp(vel + acel * dt, -.9, .9); vel *= Math.pow(.25, dt);
      Lz = clamp(Lz + vel * dt + (turvo ? Math.sin(t * (5 + turvo)) * .0045 * turvo + (Math.random() - .5) * .006 * turvo : 0), 0, 1);
      if (Lz <= 0 || Lz >= 1) vel *= -.2;
      if (BOT()) { Lz = centro(t); vel = 0; }
      const cc = centro(t), lo = cc - larg / 2, hi = cc + larg / 2, ok = Lz >= lo && Lz <= hi;
      faixaEl.style.bottom = (lo * 100) + '%'; faixaEl.style.height = (larg * 100) + '%';
      luzEl.style.height = (Lz * 100) + '%'; marcaEl.style.bottom = (Lz * 100) + '%';
      root.classList.toggle('ok', ok);
      if (ok) { dentro += dt; vida = Math.min(1, vida + dt / (DUR * .48)); } else vida = Math.max(0, vida - dt * .01);
      vidaEl.style.width = (vida * 100) + '%';
      if (Lz > .95) { alto += dt; if (alto > .45) { alto = -1.2; flares++; root.classList.remove('flare'); void root.offsetWidth; root.classList.add('flare'); c.mudaLuz(3); A.sfx('farol', .5, () => A.tone(1200, .6, 'sine', .05, 0, 1.4)); } } else if (alto > 0) alto = 0; else alto = Math.min(0, alto + dt);
      brilho.style.opacity = (.15 + Lz * .85).toFixed(2);
      pz.brilho(Lz);
      document.documentElement.style.setProperty('--luzParto', Lz.toFixed(3));
      // os corações
      if (t >= proxR) { proxR = t + 60 / bpmR; A.sfx('coracao-rapido', .5, () => A.batida(.35, false)); const r = $('.pt-c.rapido'); r.classList.remove('bate'); void r.offsetWidth; r.classList.add('bate'); }
      if (dois && t >= proxL) { bpmL = Math.max(26, 46 - t * .6); proxL = t + 60 / bpmL; A.sfx('coracao-lento', clamp(.55 - t / DUR * .35, .12, .55), () => A.batida(clamp(.6 - t / DUR * .5, .1, .6), true)); const l = $('.pt-c.lento'); l.classList.remove('bate'); void l.offsetWidth; l.classList.add('bate'); l.style.opacity = clamp(1 - t / DUR, .25, 1); }
      if (vida >= (mostradas + 1) / (cfg.linhas.length + 1)) linha(true);
      if (t >= DUR) return termina();
      requestAnimationFrame(loop);
    };
    // o fim em câmera lenta: o vídeo quase para, a luz toma a tela, um último coração, e só então o texto
    const termina = () => {
      fim = true; pz.fim();
      while (mostradas < cfg.linhas.length) linha();
      const fr = clamp(dentro / DUR, 0, 1);
      c.mudaLuz((dois ? 30 : 20));
      root.classList.add('final', 'lento');
      if (v) { try { v.playbackRate = .25; } catch (e) {} }
      pz.brilho(1);
      setTimeout(() => A.sfx('coracao-rapido', .7, () => A.batida(.6, false)), 900);
      setTimeout(() => A.sfx('coracao-rapido', .5, () => A.batida(.4, false)), 2200);
      c.registrar('parto', dois ? 'dois' : 'crianca');
      setTimeout(() => { A.abafa(false); resolve({ dentro: fr, flares, vida }); }, BOT() ? 200 : 4200);
    };
    requestAnimationFrame((n) => { last = n; requestAnimationFrame(loop); });
  });
}

// ================================================================== RASTRO (Pensamento)
// Segurar num ponto do deserto, dentro do alcance, acende uma luz ali. Cada luz puxa os Tacets.
function rastro(root, c) {
  const { tr, A, st, L } = c, cfg = L.rastro;
  return new Promise((resolve) => {
    root.classList.add('explorar');
    const { caixa } = palco(root, 'assets/images/mapa-rastro.jpg', 1920 / 1080);
    caixa.insertAdjacentHTML('beforeend', `<svg class="rt-svg" viewBox="0 0 100 56.25" preserveAspectRatio="none"><polyline class="rt-linha" points=""/></svg><div class="rt-pira" style="left:${cfg.pira.x}%;top:${cfg.pira.y}%"></div><div class="rt-alcance"></div><div class="rt-carga"></div>`);
    root.insertAdjacentHTML('beforeend', `<div class="rt-hud"><p class="rt-dist"></p><p class="rt-msg"></p><div class="rt-bts"><button class="ghost rt-cantar">♪ ${c.esc(tr(cfg.cantarT))}</button><button class="cta rt-ir" disabled>${c.esc(tr(cfg.irT))}</button></div></div>`);
    const $ = (s) => root.querySelector(s), linhaEl = $('.rt-linha'), alcance = $('.rt-alcance'), carga = $('.rt-carga'), distEl = $('.rt-dist'), msg = $('.rt-msg'), ir = $('.rt-ir'), cantarB = $('.rt-cantar');
    const AR = 9 / 16;
    const d = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * AR);   // em % da largura
    const minimo = 46 + 9 * (st.tacetsCedo || 0) + (st.luz > 75 ? 4 : 0);
    let cantando = false, cantou = false, fim = false, quebrou = false;
    const luzes = [{ x: cfg.pira.x - 5, y: cfg.pira.y - 7, ini: true }];
    const alc = () => (cantando ? 25 : 18);
    const tacets = [0, 1, 2].map((k) => ({ x: cfg.tacetsDe.x + k * 3, y: cfg.tacetsDe.y + (k % 2) * 3, el: null }));
    tacets.forEach((tc) => { tc.el = document.createElement('div'); tc.el.className = 'rt-tacet'; caixa.appendChild(tc.el); });
    const eu = document.createElement('div'); eu.className = 'rt-eu'; caixa.appendChild(eu);
    const ultima = () => luzes[luzes.length - 1];
    const desenha = () => {
      const u = ultima();
      linhaEl.setAttribute('points', luzes.map((l) => `${l.x},${l.y * AR}`).join(' '));
      alcance.style.left = u.x + '%'; alcance.style.top = u.y + '%'; alcance.style.width = (alc() * 2) + '%';
      eu.style.left = u.x + '%'; eu.style.top = u.y + '%';
      const dist = d(u, cfg.pira);
      distEl.innerHTML = `${c.esc(tr(cfg.distT))}: <b>${Math.round(dist)}</b> <small>/ ${c.esc(tr(cfg.minT))} ${minimo}</small>`;
      const longe = dist >= minimo && luzes.length > 1;
      ir.disabled = !longe; msg.textContent = longe ? tr(cfg.longeT) : (luzes.length > 1 ? tr(cfg.pertoT) : '');
      root.classList.toggle('longe', longe);
    };
    const acende = (p) => {
      luzes.push(p);
      const f = document.createElement('div'); f.className = 'rt-farol' + (cantando ? ' canto' : ''); f.style.left = p.x + '%'; f.style.top = p.y + '%'; caixa.appendChild(f);
      c.mudaLuz(cantando ? 4 : 3); A.sfx('farol', .55, () => { A.tone(700, .8, 'sine', .05, 0, 1.3); A.tone(1050, 1, 'sine', .03, .08); });
      desenha();
    };
    // segurar para acender: um anel enche no lugar do dedo; soltar antes apaga
    const ponto = (e) => { const r = caixa.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 }; };
    let alvo = null, t0 = 0;
    const DUR_CARGA = () => (cantando ? 380 : 560);
    const pz = pensar(root, {
      el: caixa, tecla: false,
      alvo: (e) => {
        if (fim || !e || e.button > 0) return false;
        const p = ponto(e);
        if (p.x < 2 || p.x > 98 || p.y < 3 || p.y > 97) return false;
        if (d(p, ultima()) > alc()) { msg.textContent = tr(cfg.alcanceT); alcance.classList.remove('nao'); void alcance.offsetWidth; alcance.classList.add('nao'); A.tone(160, .25, 'square', .025); return false; }
        alvo = p; return true;
      },
      down: () => { t0 = performance.now(); carga.style.left = alvo.x + '%'; carga.style.top = alvo.y + '%'; carga.classList.add('on'); A.tone(440, .5, 'sine', .025, 0, 1.6); },
      up: () => { carga.classList.remove('on'); carga.style.setProperty('--k', 0); alvo = null; },
    });
    const enche = () => {
      if (fim || !root.isConnected) return;
      if (pz.segura && alvo) {
        const k = clamp((performance.now() - t0) / DUR_CARGA(), 0, 1); carga.style.setProperty('--k', k.toFixed(3)); pz.brilho(.3 + k * .6);
        if (k >= 1) { const p = alvo; pz.segura = false; acende(p); }
      } else pz.brilho(cantando ? .5 : .2);
      requestAnimationFrame(enche);
    };
    requestAnimationFrame(enche);
    c.gesto(root, 'segurar');
    cantarB.onclick = () => {
      if (cantando) return; cantando = true; cantou = true; cantarB.classList.add('on'); root.classList.add('canta');
      A.once('assets/audio/hino/louvor.mp3', .9).then((dur) => {
        const D = dur || 18, L5 = cfg.letra || [];
        // as estrofes do louvor do Cap. I, uma de cada vez, enquanto ele canta
        const caixaL = document.createElement('div'); caixaL.className = 'rt-letra'; root.appendChild(caixaL);
        L5.forEach(([lm, tradu], k) => setTimeout(() => { if (!root.isConnected) return; caixaL.innerHTML = `<p>${c.esc(lm)}</p><small>${c.esc(tr(tradu))}</small>`; caixaL.classList.remove('on'); void caixaL.offsetWidth; caixaL.classList.add('on'); }, (k * D / L5.length) * 1000));
        setTimeout(() => { cantando = false; cantarB.classList.remove('on'); root.classList.remove('canta'); caixaL.remove(); desenha(); }, (D + .5) * 1000);
      });
      st.tom.ternura = (st.tom.ternura || 0) + 1; desenha();
    };
    ir.onclick = () => {
      if (fim) return; fim = true; pz.fim();
      const dist = Math.round(d(ultima(), cfg.pira));
      c.registrar('rastro', String(Math.min(99, dist)));
      root.classList.add('sai');
      setTimeout(() => resolve({ distancia: dist, luzes: luzes.length - 1, cantou }), BOT() ? 100 : 1400);
    };
    let last = performance.now();
    const passo = setInterval(() => { if (!fim && A.ctx && A.on) A.sfx('compasso-tres', .25, () => A.hiss(.12, 220, .8, .06, 0, 'lowpass')); }, 900);
    const loop = (now) => {
      if (fim || !root.isConnected) { clearInterval(passo); return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const destino = luzes.length > 1 ? ultima() : cfg.pira;
      const vel = (luzes.length > 1 ? (cantou ? 4.6 : 3.8) : 1.6) * (BOT() ? 4 : 1);
      tacets.forEach((tc, k) => {
        const ax = destino.x + (k - 1) * 2, ay = destino.y + (k % 2) * 2, dx = ax - tc.x, dy = (ay - tc.y) * AR, dd = Math.hypot(dx, dy);
        if (dd > .8) { tc.x += dx / dd * vel * dt; tc.y += (dy / dd) * vel * dt / AR; }
        tc.el.style.left = tc.x + '%'; tc.el.style.top = tc.y + '%';
      });
      if (!quebrou && luzes.length > 1) { quebrou = true; root.classList.add('quatro'); const m = document.createElement('p'); m.className = 'rt-quatro'; m.textContent = tr(cfg.quatroT); root.appendChild(m); c.narrate('rastro-quatro', true); setTimeout(() => m.remove(), 4200); A.once('assets/audio/tacet_passos.mp3', .45); }
      requestAnimationFrame(loop);
    };
    desenha(); requestAnimationFrame(loop);
    if (BOT()) { let k = 0; const pts = [[64, 58], [52, 48], [40, 40], [28, 34], [16, 30], [8, 22]]; const tk = setInterval(() => { const [x, y] = pts[k++]; acende({ x, y }); if (k >= pts.length) { clearInterval(tk); setTimeout(() => ir.click(), 300); } }, 250); }
  });
}

// ================================================================== BANCADA (Olhar · a alquimia debaixo da Laje)
// Ler a receita no couro; o couro cobre a bancada. Depois, fazer de memória:
//   tocar num ingrediente e no pilão ou no pote · segurar o pilão (moer) · segurar o pote (mexer)
//   tocar na brasa (pôr e tirar do fogo; os riscos contam sozinhos) · tocar em Guardar (fim)
// O que a mão faz vira uma lista de passos e é comparado com a receita: sem erro, bem feito.
// O vinho embaralha linhas do couro; segurar sobre ele faz lembrar (e a Luz sobe um pouco).
const BC_SVG = {
  pilao: `<svg class="bc-svg" viewBox="0 0 140 110" aria-hidden="true"><defs><linearGradient id="bcPil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d8579"/><stop offset="1" stop-color="#3b3631"/></linearGradient></defs>
    <path d="M18 44 Q22 98 70 100 Q118 98 122 44 Z" fill="url(#bcPil)" stroke="#201c18" stroke-width="2"/>
    <ellipse cx="70" cy="44" rx="52" ry="13" fill="#2a2622" stroke="#9c9386" stroke-width="2"/>
    <ellipse class="bc-dentro" cx="70" cy="46" rx="40" ry="8"/>
    <g class="bc-mao-pilao"><rect x="86" y="4" width="14" height="52" rx="7" transform="rotate(28 93 30)" fill="#a39a8c" stroke="#2a2622" stroke-width="2"/></g></svg>`,
  pote: `<svg class="bc-svg" viewBox="0 0 140 120" aria-hidden="true"><defs><linearGradient id="bcPot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8653a"/><stop offset="1" stop-color="#5a2a14"/></linearGradient></defs>
    <g class="bc-vapor"><path d="M52 24c-6-8 6-12 0-20"/><path d="M70 22c-6-8 6-12 0-20"/><path d="M88 24c-6-8 6-12 0-20"/></g>
    <path d="M38 40 Q20 70 34 96 Q70 116 106 96 Q120 70 102 40 Z" fill="url(#bcPot)" stroke="#2a140a" stroke-width="2"/>
    <ellipse cx="70" cy="40" rx="34" ry="9" fill="#3a1c0d" stroke="#d48a5a" stroke-width="2"/>
    <ellipse class="bc-dentro" cx="70" cy="41" rx="28" ry="6"/>
    <g class="bc-bolhas"><circle cx="60" cy="41" r="2.2"/><circle cx="76" cy="40" r="1.6"/><circle cx="68" cy="43" r="1.8"/></g></svg>`,
  brasa: `<svg class="bc-svg" viewBox="0 0 140 46" aria-hidden="true"><ellipse class="bc-brilho" cx="70" cy="26" rx="54" ry="14"/>
    <path d="M20 30 Q30 18 44 26 Q40 38 24 38 Z M96 26 Q110 16 122 30 Q118 40 102 38 Z M58 34 Q70 24 84 34 Q78 42 62 42 Z" fill="#4a4038" stroke="#1d1814" stroke-width="2"/>
    <g class="bc-coals"><circle cx="54" cy="28" r="5"/><circle cx="68" cy="24" r="6"/><circle cx="84" cy="28" r="5"/><circle cx="76" cy="31" r="4"/><circle cx="60" cy="32" r="4"/></g></svg>`,
  guardar: `<svg class="bc-svg" viewBox="0 0 140 110" aria-hidden="true"><path d="M48 22h18M50 22v16l-14 34c-3 9 2 16 11 16h22c9 0 14-7 11-16L66 38V22" fill="rgba(200,220,230,.08)" stroke="#d9c7a6" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M90 52c4 4 20 4 24 0l6 34c0 8-8 12-18 12s-18-4-18-12z M94 46c3 4 13 4 16 0" fill="rgba(160,110,60,.25)" stroke="#d9c7a6" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
};
const misturaCor = (cores) => {
  if (!cores.length) return null;
  const rgb = cores.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const m = [0, 1, 2].map((k) => Math.round(rgb.reduce((a, c) => a + c[k], 0) / rgb.length));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
};
// comparar a mão com a receita: pôr vários no mesmo lugar em seguida vale em qualquer ordem
const normaliza = (arr) => {
  const out = []; let i = 0;
  while (i < arr.length) {
    const k = arr[i].split(':')[0];
    if (k === 'pilao' || k === 'pote') { let j = i; while (j < arr.length && arr[j].split(':')[0] === k) j++; out.push(...arr.slice(i, j).sort()); i = j; }
    else out.push(arr[i++]);
  }
  return out;
};
const erros = (req, got) => {
  const a = normaliza(req), b = normaliza(got), ch = (t) => (t.startsWith('fogo:') ? 'fogo' : t);
  const n = a.length, m = b.length, D = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) D[i][j] = ch(a[i]) === ch(b[j]) ? D[i + 1][j + 1] + 1 : Math.max(D[i + 1][j], D[i][j + 1]);
  let e = (n - D[0][0]) + (m - D[0][0]), i = 0, j = 0;
  while (i < n && j < m) {
    if (ch(a[i]) === ch(b[j])) { if (a[i] !== b[j]) e += Math.min(1.5, Math.abs(+a[i].split(':')[1] - +b[j].split(':')[1]) * .5); i++; j++; }
    else if (D[i + 1][j] >= D[i][j + 1]) i++; else j++;
  }
  return e;
};
function bancada(root, c) {
  const { tr, A, st, p, L } = c, B = L.bancada, ses = p.bancada || {}, alf = L.alforje(st);
  const noite = ses.sessao === 'noite', turvo = st.turvo || 0;
  const ING = Object.fromEntries(B.ingredientes.map((x) => [x.id, x]));
  const e = c.esc;
  return new Promise((resolve) => {
    root.classList.add('bancada'); if (noite) root.classList.add('noite'); if (turvo >= 2) root.classList.add('turvo');
    const fundo = noite ? "url('assets/images/bancada-noite.jpg'), url('assets/images/laje-noite.jpg')" : "url('assets/images/bancada.jpg'), url('assets/images/laje.jpg')";
    root.innerHTML = `<div class="j5-bg" style="background-image:${fundo}"></div><div class="j5-veu forte"></div>
      <div class="bc">
        <header class="bc-top"><p class="bc-tit"><b>${e(tr(B.titulo))}</b><small>${e(tr(noite ? B.noiteT : B.manhaT))}</small></p><p class="bc-rec"></p><button class="ghost bc-abrir">${e(tr(B.abrir))}</button></header>
        <div class="bc-prat"></div>
        <div class="bc-est">
          <button class="bc-st bc-pilao">${BC_SVG.pilao}<span class="bc-rot">${e(tr(B.pilaoT))}</span><span class="bc-cont"></span><i class="bc-anel"></i></button>
          <div class="bc-fogo">
            <button class="bc-st bc-pote">${BC_SVG.pote}<span class="bc-rot">${e(tr(B.poteT))}</span><span class="bc-cont"></span><i class="bc-anel"></i></button>
            <button class="bc-brasa">${BC_SVG.brasa}<span class="bc-rot">${e(tr(B.brasaT))}</span></button>
            <div class="bc-riscos" aria-live="polite"></div>
          </div>
          <button class="bc-st bc-guardar">${BC_SVG.guardar}<span class="bc-rot">${e(tr(B.guardarT))}</span></button>
        </div>
        <p class="bc-dica"></p>
        <div class="bc-base"><div class="bc-alf"></div><div class="bc-bts"><button class="ghost bc-fora">${e(tr(B.esvaziarT))}</button><button class="cta bc-sair">${e(tr(ses.sair || B.abrir))}</button></div></div>
      </div>
      <div class="bc-couro"><div class="bc-pele"></div></div>
      <div class="bc-res"></div>`;
    const $ = (s) => root.querySelector(s);
    const prat = $('.bc-prat'), pilEl = $('.bc-pilao'), poteEl = $('.bc-pote'), brasaEl = $('.bc-brasa'), riscosEl = $('.bc-riscos'), guardEl = $('.bc-guardar');
    const dica = $('.bc-dica'), alfEl = $('.bc-alf'), couro = $('.bc-couro'), pele = $('.bc-pele'), resEl = $('.bc-res'), recEl = $('.bc-rec');
    let rec = null, mao = null, pilao = [], pote = [], log = [], fogo = false, riscos = 0, tRisco = 0, proxRisco = 0, fim = false, borrado = [], lembrou = 0;
    const feitos = [];
    const temIng = (id) => ING[id].sempre || (alf.ingr[id] || 0) > 0;
    const podeFazer = (r) => r.usa.every(temIng);
    const ocupado = () => pilao.length || pote.length || fogo;
    const avisa = (t, cls) => { dica.textContent = tr(t); dica.className = 'bc-dica on ' + (cls || ''); };
    const treme = (el) => { el.classList.remove('nao'); void el.offsetWidth; el.classList.add('nao'); A.tone(160, .25, 'square', .025); };
    const dicaPadrao = () => { if (!rec) return avisa(B.dEscolha); if (mao === 'pilao') return avisa(B.dPilaoMao, 'mao'); if (mao) return avisa(tr(B.naMao) + ': ' + tr(ING[mao].nome) + '. ' + tr(B.dMao), 'mao'); avisa(B.dLivre); };
    // ---------- desenho
    const desenhaPrat = () => {
      prat.innerHTML = B.ingredientes.map((x) => { const n = x.sempre ? '∞' : (alf.ingr[x.id] || 0); return `<button class="bc-ing ${mao === x.id ? 'sel' : ''} ${!x.sempre && !n ? 'zero' : ''}" data-id="${x.id}" style="--c:${x.cor}">${ING_IC[x.id] || ''}<span>${e(tr(x.nome))}</span><em>${n}</em></button>`; }).join('');
      prat.querySelectorAll('.bc-ing').forEach((b) => b.onclick = () => pega(b.dataset.id, b));
    };
    const desenhaAlf = () => {
      alfEl.innerHTML = `<span>${e(tr(B.alforjeT))}</span>` + (alf.prontos.map((u) => { const r = B.receitas.find((x) => x.id === u.id); return `<i class="bc-pr q-${u.q}" title="${e(tr(r.nome))} · ${e(tr(B.qual[u.q]))}">${ICON[r.ic] || ''}</i>`; }).join('') || '<em>—</em>');
    };
    const desenhaEst = () => {
      const cp = misturaCor(pilao.map((x) => ING[x.id].cor)), cq = misturaCor(pote.map((id) => ING[id].cor));
      pilEl.style.setProperty('--c', cp || 'transparent'); pilEl.classList.toggle('cheio', !!pilao.length); pilEl.classList.toggle('moido', pilao.length > 0 && pilao.every((x) => x.moido));
      poteEl.style.setProperty('--c', cq || 'transparent'); poteEl.classList.toggle('cheio', !!pote.length);
      pilEl.querySelector('.bc-cont').textContent = pilao.map((x) => tr(ING[x.id].nome)).join(' · ');
      poteEl.querySelector('.bc-cont').textContent = pote.map((id) => tr(ING[id].nome)).join(' · ');
      pilEl.classList.toggle('alvo', !!mao && mao !== 'pilao'); poteEl.classList.toggle('alvo', !!mao);
      pilEl.classList.toggle('na-mao', mao === 'pilao');
      root.classList.toggle('fogo', fogo); brasaEl.classList.toggle('on', fogo);
      recEl.textContent = rec ? tr(rec.nome) : '';
      $('.bc-sair').classList.toggle('off', !!ocupado());
      $('.bc-fora').disabled = !ocupado();
      desenhaPrat(); dicaPadrao();
    };
    // ---------- as mãos
    const pega = (id, b) => {
      if (fim) return;
      if (!rec) { treme(b); return avisa(B.dEscolha); }
      if (!temIng(id)) return treme(b);
      mao = mao === id ? null : id; A.tone(620, .12, 'sine', .02); desenhaEst();
    };
    const gasta = (id) => { if (!ING[id].sempre) alf.ingr[id] = Math.max(0, (alf.ingr[id] || 0) - 1); };
    const poeNo = (onde, id) => {
      gasta(id); log.push(onde + ':' + id);
      if (onde === 'pilao') { pilao.push({ id, moido: false }); A.sfx('ingrediente-pilao', .5, () => A.hiss(.15, 1200, .8, .08)); }
      else { pote.push(id); A.sfx('ingrediente-pote', .5, () => A.tone(300, .2, 'sine', .04, 0, .7)); }
      mao = null; desenhaEst();
    };
    const moer = () => { pilao.forEach((x) => { x.moido = true; }); log.push('moer'); desenhaEst(); };
    const verter = () => { pote.push(...pilao.map((x) => x.id)); pilao = []; log.push('verter'); mao = null; A.sfx('despejar', .5, () => A.hiss(.5, 500, .6, .1, 0, 'lowpass')); desenhaEst(); };
    const mexer = () => { log.push('mexer'); A.sfx('colher-mexe', .5, () => A.hiss(.6, 700, 1.2, .07)); desenhaEst(); };
    const liga = () => { fogo = true; riscos = 0; tRisco = performance.now(); proxRisco = intervalo(); riscosEl.innerHTML = ''; A.sfx('brasa-acende', .5, () => A.hiss(.6, 1600, .5, .08)); desenhaEst(); };
    const desliga = (registra = true) => { if (!fogo) return; fogo = false; if (registra) log.push('fogo:' + riscos); A.sfx('brasa-apaga', .45, () => A.hiss(.3, 400, .6, .06, 0, 'lowpass')); setTimeout(() => { if (!fogo) riscosEl.innerHTML = ''; }, 1600); desenhaEst(); };
    const intervalo = () => (BOT() ? 40 : 2300 * (turvo >= 2 ? 1 + (Math.random() - .5) * .5 : 1));
    const risco = () => {
      riscos++; const r = document.createElement('i'); riscosEl.appendChild(r);
      poteEl.classList.remove('borbulha'); void poteEl.offsetWidth; poteEl.classList.add('borbulha');
      A.sfx('pote-borbulha', .5, () => { A.tone(180, .25, 'sine', .05, 0, 1.6); A.tone(240, .2, 'sine', .03, .12, 1.4); });
    };
    // segurar (moer, mexer) e tocar (pôr, levar) no mesmo lugar
    const segurar = (el, ms, pode, feito, toque, som) => {
      let t0 = 0, raf = 0, ativo = false;
      const para = () => { cancelAnimationFrame(raf); ativo = false; el.classList.remove('segura'); el.style.setProperty('--k', 0); };
      el.addEventListener('pointerdown', (ev) => {
        if (fim || couro.classList.contains('on') || resEl.classList.contains('on')) return;
        ev.preventDefault(); t0 = performance.now(); ativo = pode();
        if (!ativo) return;
        el.classList.add('segura'); som && som();
        const passo = () => { const k = Math.min(1, (performance.now() - t0) / ms); el.style.setProperty('--k', k.toFixed(3)); if (k >= 1) { para(); t0 = -1; feito(); return; } raf = requestAnimationFrame(passo); };
        raf = requestAnimationFrame(passo);
      });
      el.addEventListener('pointerup', () => { const dt = performance.now() - t0; if (t0 > 0 && dt < 260) toque(); para(); t0 = 0; });
      el.addEventListener('pointerleave', () => { para(); t0 = 0; });
      el.addEventListener('pointercancel', () => { para(); t0 = 0; });
    };
    segurar(pilEl, turvo >= 2 ? 1700 : 1300,
      () => !!rec && !mao && pilao.some((x) => !x.moido), moer,
      () => {
        if (!rec) return avisa(B.dEscolha);
        if (mao && mao !== 'pilao') return poeNo('pilao', mao);
        if (mao === 'pilao') { mao = null; return desenhaEst(); }
        if (!pilao.length) return avisa(B.dVazio);
        if (pilao.some((x) => !x.moido)) return avisa(B.dSegMoer);
        mao = 'pilao'; desenhaEst();
      }, () => A.sfx('pilao-moer', .55, () => { for (let i = 0; i < 4; i++) A.hiss(.18, 900 + i * 120, .9, .07, i * .3); }));
    segurar(poteEl, 1100,
      () => !!rec && !mao && pote.length > 0, mexer,
      () => {
        if (!rec) return avisa(B.dEscolha);
        if (mao === 'pilao') return verter();
        if (mao) return poeNo('pote', mao);
        avisa(pote.length ? B.dSegMexer : B.dVazio);
      });
    brasaEl.onclick = () => { if (fim || !rec) return rec ? null : avisa(B.dEscolha); fogo ? desliga() : liga(); };
    guardEl.onclick = () => {
      if (fim) return; if (!rec) return avisa(B.dEscolha);
      if (!pilao.length && !pote.length) { treme(guardEl); return avisa(B.dVazio); }
      if (fogo) desliga();
      log.push('guardar');
      const mix = new Set(pote.concat(pilao.map((x) => x.id)));
      const er = erros(rec.passos, log);
      const q = !rec.usa.every((id) => mix.has(id)) ? 'falhou' : er === 0 ? 'bom' : er <= 1.5 ? 'medio' : er <= 3.5 ? 'ruim' : 'falhou';
      if (q !== 'falhou') alf.prontos.push({ uid: 'u' + (alf.seq = (alf.seq || 1) + 1), id: rec.id, q });
      alf.feitos.push({ id: rec.id, q, ses: ses.sessao }); feitos.push({ id: rec.id, q });
      c.registrar('bancada_' + rec.id, q); c.salvar();
      A.sfx(q === 'falhou' ? 'despejar' : 'guardar-pote', .55, () => (q === 'falhou' ? A.hiss(.6, 300, .5, .1, 0, 'lowpass') : A.tone(520, .5, 'sine', .04)));
      const r = rec; pilao = []; pote = []; log = []; mao = null; rec = null; desenhaEst(); desenhaAlf();
      resEl.innerHTML = `<div class="bc-card q-${q}">${ICON[r.ic] || ''}<p class="bc-rn">${e(tr(r.nome))}<small>${e(tr(r.sub))}</small></p><p class="bc-q">${e(tr(B.qual[q]))}</p><p class="bc-rl">${e(tr(B.resultado[q]))}</p><button class="cta bc-ok">${e(c.lang === 'en' ? 'Continue' : 'Continuar')}</button></div>`;
      resEl.classList.add('on');
      resEl.querySelector('.bc-ok').onclick = () => { resEl.classList.remove('on'); abreCouro(); };
    };
    $('.bc-fora').onclick = () => {
      if (!ocupado()) return;
      desliga(false); pilao = []; pote = []; log = []; mao = null;
      A.sfx('despejar', .5, () => A.hiss(.6, 300, .5, .1, 0, 'lowpass')); desenhaEst();
    };
    $('.bc-sair').onclick = () => {
      if (ocupado()) { treme($('.bc-sair')); return avisa(B.dOcupado); }
      fim = true; couro.classList.remove('on');
      A.sfx('passos-areia', .5, () => A.hiss(.3, 300, .6, .1, 0, 'lowpass'));
      setTimeout(() => resolve({ sessao: ses.sessao, feitos }), BOT() ? 50 : 300);
    };
    // ---------- o couro (cobre a bancada; o fogo continua contando)
    const listaCouro = () => {
      pele.innerHTML = `<h3>${e(tr(B.couroT))}</h3><p class="bc-sub">${e(tr(B.couroSub))}</p>
        <div class="bc-lista">${B.receitas.map((r) => `<div class="bc-r ${podeFazer(r) ? '' : 'nao'}"><p class="bc-rn">${ICON[r.ic] || ''}<span>${e(tr(r.nome))}<small>${e(tr(r.sub))}</small></span></p>
          <p class="bc-usa">${r.usa.map((id) => `<span class="${temIng(id) ? '' : 'falta'}">${e(tr(ING[id].nome))}${ING[id].sempre ? '' : ` <b>${alf.ingr[id] || 0}</b>`}</span>`).join('')}</p>
          <button class="ghost bc-prep" data-id="${r.id}" ${podeFazer(r) && !ocupado() ? '' : 'disabled'}>${e(tr(podeFazer(r) ? B.preparar : B.falta))}</button></div>`).join('')}</div>
        <div class="bc-cbts"><button class="ghost bc-fecha">${e(c.lang === 'en' ? 'Close' : 'Fechar')}</button></div>`;
      pele.querySelectorAll('.bc-prep').forEach((b) => b.onclick = () => escolhe(B.receitas.find((r) => r.id === b.dataset.id)));
      pele.querySelector('.bc-fecha').onclick = fechaCouro;
    };
    const receitaCouro = () => {
      pele.innerHTML = `<h3>${e(tr(rec.nome))}</h3><p class="bc-sub">${e(tr(rec.sub))}</p>
        <ol class="bc-passos">${rec.linhas.map((l, i) => `<li class="${borrado.includes(i) ? 'bl' : ''}">${e(tr(l))}</li>`).join('')}</ol>
        ${borrado.length ? `<p class="bc-turvo">${e(tr(B.turvoT))}</p>` : ''}
        <div class="bc-cbts">${ocupado() ? '' : `<button class="ghost bc-outra">${e(tr(B.outra))}</button>`}<button class="cta bc-fecha">${e(tr(B.fechar))}</button></div>`;
      const outra = pele.querySelector('.bc-outra'); if (outra) outra.onclick = () => { rec = null; mao = null; desenhaEst(); listaCouro(); };
      pele.querySelector('.bc-fecha').onclick = fechaCouro;
      // segurar sobre o couro: as linhas borradas voltam enquanto ele pensa (a Luz sobe)
      const ol = pele.querySelector('.bc-passos');
      if (borrado.length) {
        let iv = 0;
        const solta = () => { ol.classList.remove('lembra'); clearInterval(iv); };
        ol.addEventListener('pointerdown', (ev) => { ev.preventDefault(); ol.classList.add('lembra'); iv = setInterval(() => { if (lembrou < 4) { lembrou++; c.mudaLuz(1); } }, 1400); });
        ol.addEventListener('pointerup', solta); ol.addEventListener('pointerleave', solta); ol.addEventListener('pointercancel', solta);
      }
    };
    const escolhe = (r) => {
      rec = r; log = []; mao = null;
      const k = turvo >= 4 ? r.linhas.length - 1 : turvo >= 2 ? Math.ceil(r.linhas.length / 2) : turvo >= 1 ? 1 : 0;
      borrado = [...r.linhas.keys()].sort(() => Math.random() - .5).slice(0, k);
      A.sfx('receita-couro', .45, () => A.hiss(.4, 2400, .5, .05)); desenhaEst(); receitaCouro();
    };
    const abreCouro = () => { if (fim) return; rec ? receitaCouro() : listaCouro(); couro.classList.add('on'); };
    const fechaCouro = () => { couro.classList.remove('on'); dicaPadrao(); };
    $('.bc-abrir').onclick = abreCouro;
    // ---------- o relógio do fogo
    const loop = (now) => {
      if (fim || !root.isConnected) return;
      if (fogo && now - tRisco >= proxRisco) { tRisco = now; proxRisco = intervalo(); risco(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    desenhaAlf(); desenhaEst();
    // primeiro o gesto, depois o couro (o couro é a primeira coisa que ele lê)
    c.gesto(root, 'tocar', BOT() ? 50 : 2400);
    setTimeout(abreCouro, BOT() ? 60 : 2700);
    // ---------- testes automáticos: faz certo o que der, nesta ordem
    if (BOT()) {
      const ordem = noite ? ['po', 'unguento', 'tintura'] : ['antidoto', 'unguento', 'po'];
      const espera = (ms) => new Promise((r) => setTimeout(r, ms));
      (async () => {
        await espera(200);
        for (const id of ordem) {
          const r = B.receitas.find((x) => x.id === id); if (!podeFazer(r)) continue;
          escolhe(r); fechaCouro();
          for (const t of r.passos) {
            const [k, v] = t.split(':');
            if (k === 'pilao' || k === 'pote') poeNo(k, v); else if (k === 'moer') moer(); else if (k === 'verter') verter(); else if (k === 'mexer') mexer();
            else if (k === 'fogo') { liga(); riscos = +v; desliga(); } else if (k === 'guardar') guardEl.click();
            await espera(30);
          }
          await espera(60); const ok = root.querySelector('.bc-ok'); ok && ok.click(); await espera(60);
        }
        fechaCouro(); $('.bc-sair').click();
      })();
    }
  });
}

window.JOGOS5 = { ressaca, laje, bancada, troca, minutos, parto, rastro };
})();
