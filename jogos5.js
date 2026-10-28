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
      if (window.__mgPausa) { last = now; return requestAnimationFrame(loop); }   // o cartão de instrução ainda está na tela
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
    // a duna com a Luz alta no escuro: o pulso brilha, e subir escondido custa mais (custoExtra); muda na hora se ele beber no minijogo
    const base = (a) => a.custo + (a.custoExtra ? a.custoExtra(st) : 0);
    const custoDe = (a) => (desc && !a.fim && base(a) > 1 && a.id !== 'ouvir' ? base(a) - 1 : base(a));
    const restam = () => Math.max(0, marcas - Math.ceil(t / cfg.segundosPorMarca - 1e-6));
    const desenha = () => {
      anelSol.style.strokeDasharray = `${(t / total) * 100} 100`;
      anel.classList.toggle('pouco', restam() <= 1);
      root.querySelectorAll('.mn-pt').forEach((b) => { const a = cfg.acoes.find((x) => x.id === b.dataset.id); const cu = custoDe(a); b.classList.toggle('caro', !feitas.includes(a.id) && cu > restam() && !a.fim); b.classList.toggle('desc', cu < base(a)); const bb = b.querySelector('b'); if (bb && !feitas.includes(a.id)) bb.textContent = '●'.repeat(cu); const ex = b.querySelector('small.extra'); if (ex) ex.style.display = a.custoExtra && a.custoExtra(st) && !feitas.includes(a.id) ? '' : 'none'; });
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
      b.innerHTML = `<i></i><span>${c.esc(tr(a.rotulo))}${a.custo ? `<b>${'●'.repeat(a.custo)}</b>` : ''}${trava ? `<small>${c.esc(tr(a.motivo))}</small>` : ''}${a.extraT && !trava ? `<small class="extra">${c.esc(tr(a.extraT))}</small>` : ''}</span>`;
      b.onclick = (e) => {
        e.stopPropagation(); if (fim || pausado || trava || feitas.includes(a.id)) return;
        if (!a.fim && custoDe(a) > restam()) { b.classList.remove('nao'); void b.offsetWidth; b.classList.add('nao'); A.tone(160, .3, 'square', .03); return; }
        feitas.push(a.id); b.classList.add('feito'); c.registrar('minuto_' + feitas.length, a.id);
        if (a.id === 'beber') c.beber('minutos');
        if (a.id === 'po') A.sfx('po-vento', .6, () => A.hiss(1.2, 1800, .6, .12)), setTimeout(() => A.sfx('cavalos-panico', .7), 600);
        if (a.id === 'tukk') A.sfx('arrasta', .5, () => A.hiss(1.4, 300, .6, .14, 0, 'lowpass'));
        const cu = custoDe(a); if (cu < base(a)) desc = 0; if (a.id === 'ouvir') desc = 1;
        t = Math.min(total, t + cu * cfg.segundosPorMarca); desenha();
        abrePassos(a);
      };
      caixa.appendChild(b);
    });
    // a ouvida tem duas partes: os soldados (sem voz) e o que Aheryn entende (com voz)
    const ouvir = cfg.acoes.find((a) => a.id === 'ouvir'); if (ouvir && !ouvir.passos) ouvir.passos = [ouvir.texto.slice(0, 3), ouvir.texto.slice(3)];
    const loop = (now) => {
      if (fim || !root.isConnected) return;
      if (window.__mgPausa) { last = now; return requestAnimationFrame(loop); }
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (!pausado) { t += dt * (BOT() ? 8 : 1); desenha(); if (t >= total) { t = total; desenha(); return encerra('tempo'); } }
      requestAnimationFrame(loop);
    };
    desenha(); requestAnimationFrame(loop);
    A.sfx('eclipse-total', .4);
    { const ed = setInterval(() => { if (!window.__mgPausa) { clearInterval(ed); setTimeout(() => c.narrate('c01-dica'), BOT() ? 100 : 1200); } }, 80); }
    // o tempo só começa a correr depois que o leitor viu o cartão do gesto (ou tocou na tela)
    const solta = () => { if (!fim && pausado && !painel.classList.contains('on')) { pausado = false; last = performance.now(); } };
    c.gesto(root, 'sol');
    { const espera = setInterval(() => { if (!window.__mgPausa) { clearInterval(espera); solta(); } }, 80); }
    if (BOT()) setTimeout(() => { ['shaa', 'ouvir'].forEach((id, i) => setTimeout(() => { const b = caixa.querySelector(`.mn-pt[data-id="${id}"]`); b && b.click(); }, 300 + i * 1200)); }, 200);
  });
}

// ================================================================== DERROTA (parto e rastro)
// Duas linhas na voz do Aheryn e um botão que recomeça só este jogo. A Luz volta ao que era na entrada.
function derrota(root, c, linhas, botao, refaz, luz0, voz) {
  const { tr, A, st } = c;
  A.abafa && A.abafa(false);
  // a animação de saída apagava a tela inteira, inclusive esta: tira antes de mostrar
  root.classList.remove('sai'); root.style.animation = 'none'; root.style.opacity = '1'; root.style.filter = 'none';
  const d = document.createElement('div'); d.className = 'j5-derrota';
  d.innerHTML = linhas.map((l, k) => `<p class="${k ? 'l2' : 'l1'}">${c.esc(tr(l))}</p>`).join('') + `<button class="cta">${c.esc(tr(botao))}</button>`;
  root.appendChild(d); requestAnimationFrame(() => d.classList.add('on'));
  A.tone(110, 2.2, 'sawtooth', .04, 0, 2); A.tone(73, 2.6, 'sine', .08, .1, 2.4);
  if (voz) setTimeout(() => c.narrate(voz), 1200);   // a voz do Aheryn, se o arquivo existir (sem arquivo, segue muda)
  const b = d.querySelector('button');
  b.onclick = () => { b.disabled = true; if (luz0 != null) c.mudaLuz(luz0 - st.luz); root.innerHTML = ''; root.style.animation = ''; root.style.opacity = ''; root.style.filter = ''; root.className = root.className.split(' ').filter((x) => !['final', 'lento', 'ok', 'flare', 'quatro', 'canta', 'longe', 'sai', 'dor'].includes(x)).join(' '); refaz(); };
  if (BOT()) setTimeout(() => b.click(), 200);
}

// ================================================================== PARTO (Pensamento · o clímax)
function parto(root, c) {
  const { tr, A, st, L } = c, cfg = L.parto;
  const luz0 = st.luz;
  // a preparação: 5+ pontos, nenhuma dor; menos, as dores aparecem como runas (Q W E A S D) e é preciso apertá-las sem largar a luz
  const prep = cfg.preparo ? cfg.preparo(st) : 5;
  const TECLAS = 'QWEASD';
  const dois = (st.escolhas.proibido5 || 'crianca') === 'dois';
  // 'os dois': o coração de Shaa cai sozinho; a preparação (o quanto Aheryn ajudou os outros) decide a velocidade e as dores
  const ptsDois = dois && cfg.preparoDois ? cfg.preparoDois(st) : 0;
  const nivel = dois && cfg.dois ? cfg.dois.find((n) => ptsDois >= n.min) : null;
  const turvo = st.turvo || 0, marca = !!(st.c1 && st.c1.marcado);
  return new Promise((resolve) => {
    root.innerHTML = `<video class="j5-bg" src="${c.vsrc('assets/clip/veias.mp4')}" muted loop playsinline autoplay></video><div class="j5-veu"></div>
      <div class="pt-brilho"></div>
      <div class="pt-linhas"></div>
      <div class="pt-medidor"><div class="pt-faixa"></div><div class="pt-luz"></div><div class="pt-marca"></div></div>
      <div class="pt-cores"><span class="pt-c rapido" title="cria"></span>${dois ? '<span class="pt-c lento" title="Shaa"></span>' : ''}</div>
      <div class="pt-vida"><i></i><span>${c.esc(tr(cfg.vidaT))}</span></div>${dois ? `<div class="pt-vida pt-vida-s"><i></i><span>${c.esc(tr(cfg.vidaShaaT))}</span></div>` : ''}`;
    const v = root.querySelector('video'); v && v.play().catch(() => {});
    const $ = (s) => root.querySelector(s);
    const faixaEl = $('.pt-faixa'), luzEl = $('.pt-luz'), marcaEl = $('.pt-marca'), vidaEl = $('.pt-vida i'), vidaSEl = $('.pt-vida-s i'), brilho = $('.pt-brilho'), linhas = $('.pt-linhas');
    const DUR = BOT() ? 6 : 28, larg = Math.max(.14, (nivel ? nivel.larg : dois ? .22 : .26) - (marca ? .03 : 0) - Math.min(.04, turvo * .01));
    // o mundo some: só ficam os corações
    A.abafa(true);
    const pz = pensar(root);
    c.gesto(root, 'segurar');
    // ---- as dores (runas): aparecem no meio da tela; a letra certa (ou um toque nela) segura a dor; deixar apagar custa vida
    const runas = [];
    let intervalo = 2.3 + .6 * prep, vidaRuna = 2.2 + .15 * prep, proxRuna = prep >= 5 ? Infinity : 4;
    if (nivel) { proxRuna = nivel.runas ? 4 : Infinity; if (nivel.runas) { intervalo = nivel.runas[0]; vidaRuna = nivel.runas[1]; } }
    let vidaS = 1, shaaFoi = false;   // o coração dela (só em 'os dois')
    const acerta = (r) => {
      if (r.fim) return; r.fim = true; r.el.classList.add('ok'); setTimeout(() => r.el.remove(), 350);
      vida = Math.min(1, vida + .02); if (dois && !shaaFoi) vidaS = Math.min(1, vidaS + .03); A.tone(587.33 * (1 + TECLAS.indexOf(r.k) * .12), .3, 'sine', .05); A.tone(1174.7, .2, 'triangle', .02);
    };
    const novaRuna = () => {
      const k = TECLAS[Math.floor(Math.random() * TECLAS.length)];
      const el = document.createElement('button'); el.type = 'button'; el.className = 'pt-runa'; el.textContent = k;
      el.style.left = (26 + Math.random() * 40) + '%'; el.style.top = (24 + Math.random() * 44) + '%'; el.style.setProperty('--v', vidaRuna + 's');
      const r = { k, el, t: t, fim: false };
      el.addEventListener('pointerdown', (ev) => { ev.stopPropagation(); ev.preventDefault(); acerta(r); }, true);
      root.appendChild(el); runas.push(r);
      A.tone(220, .5, 'triangle', .035); A.tone(165, .7, 'sine', .03, .05);
    };
    const tecla = (ev) => {
      const k = ev.key && ev.key.length === 1 ? ev.key.toUpperCase() : '';
      if (!TECLAS.includes(k) || fim) return;
      ev.preventDefault(); const r = runas.find((x) => !x.fim && x.k === k); if (r) acerta(r);
    };
    addEventListener('keydown', tecla);
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
      if (window.__mgPausa) { last = now; return requestAnimationFrame(loop); }
      const dt = Math.min(.05, (now - last) / 1000) * (window.__JOGO_RAPIDO || 1); last = now; t += dt;
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
      if (dois && !shaaFoi && !BOT()) {
        vidaS = clamp(vidaS + ((ok ? .08 : 0) - nivel.dreno) * dt, 0, 1);
        if (vidaS <= 0) { shaaFoi = true; const l = $('.pt-c.lento'); if (l) { l.classList.add('parou'); l.style.opacity = .12; } root.querySelector('.pt-vida-s').classList.add('parou'); A.tone(65, 1.6, 'sine', .07, 0, 1.4); c.registrar('shaa_parou', String(Math.round(t))); }
      }
      if (vidaSEl) vidaSEl.style.width = (vidaS * 100) + '%';
      if (Lz > .95) { alto += dt; if (alto > .45) { alto = -1.2; flares++; root.classList.remove('flare'); void root.offsetWidth; root.classList.add('flare'); c.mudaLuz(3); A.sfx('farol', .5, () => A.tone(1200, .6, 'sine', .05, 0, 1.4)); } } else if (alto > 0) alto = 0; else alto = Math.min(0, alto + dt);
      brilho.style.opacity = (.15 + Lz * .85).toFixed(2);
      pz.brilho(Lz);
      document.documentElement.style.setProperty('--luzParto', Lz.toFixed(3));
      // os corações
      if (t >= proxR) { proxR = t + 60 / bpmR; A.sfx('coracao-rapido', .5, () => A.batida(.35, false)); const r = $('.pt-c.rapido'); r.classList.remove('bate'); void r.offsetWidth; r.classList.add('bate'); }
      if (dois && !shaaFoi && t >= proxL) { bpmL = 24 + 24 * vidaS; proxL = t + 60 / bpmL; A.sfx('coracao-lento', clamp(.12 + .43 * vidaS, .12, .55), () => A.batida(clamp(.1 + .5 * vidaS, .1, .6), true)); const l = $('.pt-c.lento'); l.classList.remove('bate'); void l.offsetWidth; l.classList.add('bate'); l.style.opacity = clamp(.25 + .75 * vidaS, .25, 1); }
      if (window.__JOGO_DEBUG) window.__ptT = [t, proxRuna, vida, runas.length];
      if (t >= proxRuna && t < DUR - 2.5 && !BOT()) { novaRuna(); proxRuna = t + intervalo * (.8 + Math.random() * .4); }
      runas.forEach((r) => { if (!r.fim && t - r.t > vidaRuna) { r.fim = true; r.el.classList.add('apagou'); setTimeout(() => r.el.remove(), 400); vida = Math.max(0, vida - .07); if (dois && !shaaFoi) vidaS = Math.max(0, vidaS - .06); vel -= .45; root.classList.remove('dor'); void root.offsetWidth; root.classList.add('dor'); A.tone(98, .5, 'sawtooth', .05, 0, .6); } });
      if (vida >= (mostradas + 1) / (cfg.linhas.length + 1)) linha(true);
      if (t >= DUR) return termina();
      requestAnimationFrame(loop);
    };
    // o fim em câmera lenta: o vídeo quase para, a luz toma a tela, um último coração, e só então o texto
    const termina = () => {
      fim = true; pz.fim(); removeEventListener('keydown', tecla); runas.forEach((r) => r.el.remove());
      // a vida não chegou: a cria não respira. Volta para o começo do parto (como a pedra de Gromm no Cap. I)
      const falhou = window.__PARTO_FALHA || (!BOT() && vida < (nivel ? nivel.criaMin : .6));
      if (falhou) {
        c.registrar('parto_falhou', String(Math.round(vida * 100)));
        if (v) { try { v.playbackRate = .25; } catch (e) {} }
        setTimeout(() => { window.__PARTO_FALHA = false; derrota(root, c, cfg.falhaT, cfg.tentarT, () => parto(root, c).then(resolve), luz0, 'parto-falha'); }, BOT() ? 100 : 1600);
        return;
      }
      while (mostradas < cfg.linhas.length) linha();
      if (window.__SHAA_FALHA) { shaaFoi = true; window.__SHAA_FALHA = false; }
      const viva = dois && !shaaFoi;
      const fr = clamp(dentro / DUR, 0, 1);
      c.mudaLuz((dois ? 30 : 20));
      root.classList.add('final', 'lento');
      if (v) { try { v.playbackRate = .25; } catch (e) {} }
      pz.brilho(1);
      setTimeout(() => A.sfx('coracao-rapido', .7, () => A.batida(.6, false)), 900);
      setTimeout(() => A.sfx('coracao-rapido', .5, () => A.batida(.4, false)), 2200);
      if (viva) setTimeout(() => A.sfx('coracao-lento', .45, () => A.batida(.5, true)), 1500);   // e o lento, ainda ali
      c.registrar('parto', dois ? (viva ? 'dois_viva' : 'dois') : 'crianca');
      setTimeout(() => { A.abafa(false); resolve({ dentro: fr, flares, vida, shaa: dois ? viva : null, preparoDois: dois ? ptsDois : null }); }, BOT() ? 200 : 4200);
    };
    requestAnimationFrame((n) => { last = n; requestAnimationFrame(loop); });
  });
}

// ================================================================== RASTRO (Pensamento · o tabuleiro)
// Casas ligadas no mapa. Na vez dele: andar uma casa, correr duas (gasta Luz) ou esperar; cantar (uma vez) vale para esta vez e a seguinte.
// Depois, cada Tacet anda uma casa (o caminho mais curto): até ele, se o enxerga (a até R.visao casas, ou se ele canta); senão, para a Pira.
// Perde: um Tacet entra na casa dele, ou chega à Pira. Vence: na areia aberta, com os três a até R.visao casas.
// Passo duplo (o compasso aperta) a cada R.dobra[cedo] vezes; com Luz alta, a cada R.dobraAlta. A seta de cada Tacet mostra o próximo passo.
// Calibrado com um resolvedor (toda partida tem saída) e com jogadores modelados (ver NOTAS_CAP5).
function rastro(root, c) {
  const { tr, A, st, L } = c, cfg = L.rastro, R = cfg.regras;
  const luz0 = st.luz;
  const cedo = Math.min(3, st.tacetsCedo || 0);
  return new Promise((resolve) => {
    root.classList.add('explorar', 'tabuleiro');
    const { caixa } = palco(root, 'assets/images/mapa-rastro.jpg', 1920 / 1080);
    const AR = 9 / 16;
    // ---- o grafo
    const ids = Object.keys(cfg.casas), ix = Object.fromEntries(ids.map((k, i) => [k, i])), n = ids.length;
    const pos = ids.map((k) => ({ x: cfg.casas[k][0], y: cfg.casas[k][1] }));
    const adj = ids.map(() => []); cfg.ligacoes.forEach(([a, b]) => { adj[ix[a]].push(ix[b]); adj[ix[b]].push(ix[a]); }); adj.forEach((l) => l.sort((a, b) => a - b));
    const dist = ids.map((_, s) => { const d = Array(n).fill(99); d[s] = 0; const q = [s]; while (q.length) { const u = q.shift(); for (const v of adj[u]) if (d[v] > d[u] + 1) { d[v] = d[u] + 1; q.push(v); } } return d; });
    const prox = (de, para) => (de === para ? de : adj[de].reduce((m, v) => (dist[v][para] < dist[m][para] ? v : m), adj[de][0]));
    const PIRA = ix[cfg.pira], META = ix[cfg.meta];
    // perseguindo, a Pira não é caminho (ela só é destino de quem se perdeu): distâncias e passos sem ela
    const distS = ids.map((_, s0) => { const d = Array(n).fill(99); if (s0 === PIRA) return d; d[s0] = 0; const q = [s0]; while (q.length) { const u = q.shift(); for (const v of adj[u]) if (v !== PIRA && d[v] > d[u] + 1) { d[v] = d[u] + 1; q.push(v); } } return d; });
    const proxS = (de, para) => { if (de === para) return de; const viz = adj[de].filter((v) => v !== PIRA); return viz.reduce((m, v) => (distS[v][para] < distS[m][para] ? v : m), viz[0]); };
    // ---- o desenho
    caixa.insertAdjacentHTML('beforeend', `<svg class="tb-svg" viewBox="0 0 100 56.25" preserveAspectRatio="none">
        ${cfg.ligacoes.map(([a, b]) => `<line class="tb-lig" x1="${pos[ix[a]].x}" y1="${pos[ix[a]].y * AR}" x2="${pos[ix[b]].x}" y2="${pos[ix[b]].y * AR}"/>`).join('')}
        <g class="tb-setas"></g></svg>`);
    const setasG = caixa.querySelector('.tb-setas');
    const casaEl = ids.map((k, i) => {
      const e = document.createElement('button'); e.type = 'button';
      e.className = 'tb-casa' + (i === PIRA ? ' pira' : '') + (i === META ? ' meta' : '');
      e.style.left = pos[i].x + '%'; e.style.top = pos[i].y + '%';
      if (i === PIRA) e.innerHTML = `<span>${c.esc(tr(cfg.piraT))}</span>`;
      if (i === META) e.innerHTML = `<span>${c.esc(tr(cfg.oesteT))}</span>`;
      e.addEventListener('click', (ev) => { ev.stopPropagation(); clica(i); });
      caixa.appendChild(e); return e;
    });
    const peca = (cls, img) => { const e = document.createElement('div'); e.className = 'tb-peca ' + cls; e.innerHTML = `<img src="${img}" alt=""><b></b>`; caixa.appendChild(e); return e; };
    const euEl = peca('eu', 'assets/images/rosto-aheryn.png');
    root.insertAdjacentHTML('beforeend', `<div class="rt-hud tb-hud"><p class="rt-chips"><span>Tacets</span><i></i><i></i><i></i></p><p class="rt-msg"></p><div class="rt-bts"><button class="ghost tb-esperar">${c.esc(tr(cfg.esperarT))}</button><button class="ghost rt-cantar">♪ ${c.esc(tr(cfg.cantarT))}</button></div></div>`);
    const $ = (s) => root.querySelector(s), msg = $('.rt-msg'), cantarB = $('.rt-cantar'), esperarB = $('.tb-esperar');
    const chips = [...root.querySelectorAll('.rt-chips i')];
    // ---- o estado
    let eu = ix[cfg.inicio], vez = 0, fim = false, ocupado = false, cantoArmado = false, cantoResta = 0, cantou = false, perdeu = 0, corridas = 0, viuPrimeiro = false;
    const tacets = cfg.tacetsDe[cedo].map((k, i) => ({ i, at: ix[k], estado: 'chamado', el: peca('tacet', 'assets/images/rosto-tacet.png') }));
    const dobraDe = () => Math.min(R.dobra[cedo] || 999, st.luz >= 60 ? R.dobraAlta : 999);
    const passosNa = (v) => (v % dobraDe() === 0 ? 2 : 1);
    const ve = (tc, onde, cantando) => cantando || distS[tc.at][onde] <= R.visao;
    // o próximo passo: quem se perdeu desce para a Pira; os outros (chamados pela luz, ou seguindo) vêm até ele
    const proximo = (tc, onde, cantando) => (tc.estado === 'perdido' && !ve(tc, onde, cantando) ? prox(tc.at, PIRA) : proxS(tc.at, onde));
    const anda = (tc, onde, cantando) => {
      if (tc.estado === 'perdido' && ve(tc, onde, cantando)) tc.estado = 'segue';   // ele voltou para perto (ou cantou)
      tc.at = proximo(tc, onde, cantando);
      if (tc.estado !== 'perdido') { if (ve(tc, onde, cantando)) tc.estado = 'segue'; else if (tc.estado === 'segue') { tc.estado = 'perdido'; perdeu++; } }
    };
    const avisa = (t) => { msg.textContent = tr(t); };
    // casas para onde ele pode ir: vizinhas (andar) e a duas casas (correr, se tem Luz), sem Tacet e sem a Pira
    const opcoes = () => {
      const livre = (v) => v !== PIRA && !tacets.some((tc) => tc.at === v), out = new Map();
      for (const v of adj[eu]) if (livre(v)) { out.set(v, 'andar'); }
      if (st.luz - R.custoCorrer >= R.luzPiso) for (const v of adj[eu]) if (livre(v)) for (const w of adj[v]) if (w !== eu && livre(w) && !out.has(w)) out.set(w, 'correr');
      return out;
    };
    const desenha = () => {
      const p = pos[eu];
      euEl.style.left = p.x + '%'; euEl.style.top = p.y + '%';
      const op = fim || ocupado ? new Map() : opcoes();
      casaEl.forEach((e, i) => { e.classList.toggle('andar', op.get(i) === 'andar'); e.classList.toggle('correr', op.get(i) === 'correr'); e.disabled = !op.has(i); });
      const cantando = cantoArmado || cantoResta > 0, duplo = passosNa(vez + 1) === 2;
      let setas = '';
      tacets.forEach((tc, k) => {
        const q = pos[tc.at]; tc.el.style.left = q.x + '%'; tc.el.style.top = q.y + '%';
        // dois ou três na mesma casa: lado a lado, para os rostos e os números não se cobrirem
        const juntos = tacets.filter((o) => o.at === tc.at), kk = juntos.indexOf(tc); tc.el.style.marginLeft = ((kk - (juntos.length - 1) / 2) * 26) + 'px';
        const d = distS[tc.at][eu], perdido = tc.estado === 'perdido' && !ve(tc, eu, cantando);
        tc.el.classList.toggle('perdido', perdido); tc.el.querySelector('b').textContent = d;
        chips[k].className = perdido ? 'perdido' : 'segue';
        // a seta: o próximo passo (dois, se o compasso aperta), numa cópia que não mexe no estado
        const sombra = { at: tc.at, estado: tc.estado };
        for (let s = 0; s < (duplo ? 2 : 1); s++) { const de = sombra.at; const pr = proximo(sombra, eu, cantando); if (pr === de) break; setas += `<line class="tb-seta ${perdido ? 'pira' : ''}" x1="${pos[de].x}" y1="${pos[de].y * AR}" x2="${pos[pr].x}" y2="${pos[pr].y * AR}" marker-end="url(#tbPonta)"/>`; sombra.at = pr; }
      });
      setasG.innerHTML = `<defs><marker id="tbPonta" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="currentColor"/></marker></defs>` + setas;
      cantarB.disabled = cantou || fim; cantarB.classList.toggle('on', cantoArmado || cantoResta > 0);
      esperarB.disabled = fim || ocupado;
      const fora = tacets.filter((tc) => tc.estado === 'perdido' && !ve(tc, eu, cantando)).length;
      avisa(fora ? cfg.perdeuT : duplo ? cfg.duploT : cfg.objetivoT);
    };
    const termina = (ok) => {
      if (fim) return; fim = true; desenha();
      c.registrar('rastro', String(dist[PIRA][eu]));
      if (ok) { avisa(cfg.prontoT); root.classList.add('longe'); }
      setTimeout(() => { root.classList.add('sai'); setTimeout(() => resolve({ distancia: dist[PIRA][eu] * 7, luzes: vez, cantou, perdeu, corridas }), BOT() ? 50 : 1400); }, BOT() ? 50 : 1400);
    };
    const perde = (linhas, voz, motivo) => {
      fim = true; c.registrar('rastro_falhou', motivo); desenha();
      setTimeout(() => derrota(root, c, linhas, cfg.tentarT, () => rastro(root, c).then(resolve), luz0, voz), BOT() ? 50 : 900);
    };
    // ---- a vez dele, depois a vez deles
    const joga = (destino, tipo) => {
      if (fim || ocupado) return;
      ocupado = true; vez++;
      const cantando = cantoArmado || cantoResta > 0;
      if (cantoArmado) { cantoArmado = false; cantoResta = R.cantoVezes; cantou = true; canta(); }
      if (tipo === 'correr') { corridas++; c.mudaLuz(-R.custoCorrer); }
      eu = destino; A.tone(tipo === 'correr' ? 760 : 620, .25, 'sine', .03);
      desenha();
      setTimeout(() => {
        const passos = passosNa(vez);
        for (let s = 0; s < passos && !fim; s++) {
          for (const tc of tacets) anda(tc, eu, cantando);
        }
        if (A.ctx && A.on) A.sfx('compasso-tres', .3, () => A.hiss(.12, 220, .8, .06, 0, 'lowpass'));
        if (!viuPrimeiro && tacets.some((tc) => tc.estado === 'segue')) { viuPrimeiro = true; root.classList.add('quatro'); const m = document.createElement('p'); m.className = 'rt-quatro'; m.textContent = tr(cfg.quatroT); root.appendChild(m); c.narrate('rastro-quatro', true); setTimeout(() => m.remove(), 4200); }
        if (cantoResta > 0 && !cantoArmado && cantando) cantoResta--;
        ocupado = false;
        if (window.__RASTRO_FALHA) { window.__RASTRO_FALHA = false; return perde(cfg.falhaT, 'rastro-falha', 'teste'); }
        if (tacets.some((tc) => tc.at === eu)) return dist[PIRA][eu] <= R.vistaPira ? perde(cfg.falhaT, 'rastro-falha', 'perto') : perde(cfg.falhaLongeT, null, 'meio');
        if (tacets.some((tc) => tc.at === PIRA)) return perde(cfg.falhaPiraT, null, 'pira');
        if (eu === META && tacets.every((tc) => distS[tc.at][eu] <= R.visao)) return termina(true);
        desenha();
      }, BOT() ? 30 : 450);
    };
    const clica = (i) => { if (fim || ocupado || window.__mgPausa) return; const t = opcoes().get(i); if (t) joga(i, t); };
    esperarB.onclick = () => { if (!fim && !ocupado && !window.__mgPausa) joga(eu, 'esperar'); };
    // cantar: vale para a próxima jogada e a seguinte (os três ouvem de onde estiverem); o louvor do Cap. I com a letra
    const canta = () => {
      root.classList.add('canta');
      A.once('assets/audio/hino/louvor.mp3', .9).then((dur) => {
        const D = dur || 18, L5 = cfg.letra || [];
        const caixaL = document.createElement('div'); caixaL.className = 'rt-letra'; root.appendChild(caixaL);
        L5.forEach(([lm, tradu], k) => setTimeout(() => { if (!root.isConnected) return; caixaL.innerHTML = `<p>${c.esc(lm)}</p><small>${c.esc(tr(tradu))}</small>`; caixaL.classList.remove('on'); void caixaL.offsetWidth; caixaL.classList.add('on'); }, (k / L5.length) * D * 1000));
        setTimeout(() => { root.classList.remove('canta'); caixaL.remove(); }, (D + .5) * 1000);
      });
      st.tom.ternura = (st.tom.ternura || 0) + 1;
    };
    cantarB.onclick = () => { if (cantou || fim || window.__mgPausa) return; cantoArmado = !cantoArmado; desenha(); };
    c.gesto(root, 'tocar');
    desenha();
    if (BOT()) setTimeout(() => { eu = META; tacets.forEach((tc) => { tc.at = adj[META][0]; tc.estado = 'segue'; }); desenha(); termina(true); }, 300);
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
    <g class="bc-graos"><g class="bc-pedacos"><path d="M48 44l7-5 6 4-3 6h-8z"/><path d="M66 41l9-3 5 5-6 5-8-2z"/><path d="M84 45l6-4 7 3-4 5h-7z"/><path d="M58 49l5-3 5 3-4 3z"/></g><g class="bc-grao"><circle cx="50" cy="45" r="1.6"/><circle cx="57" cy="48" r="1.3"/><circle cx="63" cy="43" r="1.5"/><circle cx="70" cy="47" r="1.7"/><circle cx="77" cy="44" r="1.4"/><circle cx="84" cy="47" r="1.6"/><circle cx="90" cy="44" r="1.3"/><circle cx="66" cy="50" r="1.2"/><circle cx="80" cy="50" r="1.3"/></g></g>
    <g class="bc-mao-pilao"><rect x="86" y="4" width="14" height="52" rx="7" transform="rotate(28 93 30)" fill="#a39a8c" stroke="#2a2622" stroke-width="2"/></g></svg>`,
  pote: `<svg class="bc-svg" viewBox="0 0 140 120" aria-hidden="true"><defs><linearGradient id="bcPot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8653a"/><stop offset="1" stop-color="#5a2a14"/></linearGradient></defs>
    <g class="bc-vapor"><path d="M52 24c-6-8 6-12 0-20"/><path d="M70 22c-6-8 6-12 0-20"/><path d="M88 24c-6-8 6-12 0-20"/></g>
    <path d="M38 40 Q20 70 34 96 Q70 116 106 96 Q120 70 102 40 Z" fill="url(#bcPot)" stroke="#2a140a" stroke-width="2"/>
    <ellipse cx="70" cy="40" rx="34" ry="9" fill="#3a1c0d" stroke="#d48a5a" stroke-width="2"/>
    <ellipse class="bc-dentro" cx="70" cy="41" rx="28" ry="6"/>
    <ellipse class="bc-mancha" cx="74" cy="41" rx="13" ry="3.4"/>
    <g class="bc-bolhas"><circle cx="60" cy="41" r="2.2"/><circle cx="76" cy="40" r="1.6"/><circle cx="68" cy="43" r="1.8"/><circle cx="84" cy="42" r="2"/><circle cx="52" cy="42" r="1.5"/></g></svg>`,
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
// ---------- a avaliação: o que importa é o resultado, não a ordem dos gestos
// Cada receita diz (alvo): o que vai no pote e no pilão, até onde moer, até onde esquentar antes e depois de verter o pilão,
// e se precisa mexer. O jogador pode moer enquanto o pote esquenta, acender antes de pôr a resina etc.
// Estados que o olho vê: moagem 0 pedaços · 1 grãos · 2 pó ; calor 0 frio · 1 vapor · 2 bolhas · 3 fervura.
const avaliaReceita = (alvo, f) => {
  const mot = []; let er = 0;
  const soma = (n, k, x) => { if (n > 0) { er += n; mot.push([k, x]); } };
  // ingredientes: no lugar certo, nenhum de fora (o que falta já decide 'perdido' lá fora)
  (f.noPote || []).forEach((id) => { if (!(alvo.pote || []).includes(id)) soma(1, (alvo.pilao || []).includes(id) ? 'vaso' : 'extra', id); });
  (f.noPilao || []).forEach((id) => { if (!(alvo.pilao || []).includes(id)) soma(1, (alvo.pote || []).includes(id) ? 'vaso' : 'extra', id); });
  if (!alvo.pote && f.usouPote) soma(1, 'semPote');
  // moagem
  if (alvo.moer) {
    const m = f.moagem == null ? 0 : f.moagem;
    if (alvo.moer === 'fino') soma(m === 2 ? 0 : m === 1 ? 1 : 1.5, m === 1 ? 'grosso' : 'inteiro');
    else soma(m === 1 ? 0 : m === 2 ? .5 : 1.5, m === 2 ? 'fino' : 'inteiro');
  }
  // calor, antes e depois de verter o pilão
  const calor = (quer, pico) => {
    if (quer === 'vapor') return pico === 1 ? null : pico === 2 ? [.5, 'passou'] : pico === 3 ? [1.5, 'ferveu'] : [1, 'frio'];
    if (quer === 'bolhas') return pico === 2 ? null : pico === 1 ? [1, 'fraco'] : pico === 3 ? [1, 'ferveu'] : [1.5, 'frio'];
    if (quer === 'nada') return pico === 0 ? null : [[0, .5, 1, 1.5][pico], 'fogo'];
    return pico === 3 ? [1, 'ferveu'] : null;
  };
  if (alvo.pote || f.usouPote) ['antes', 'depois'].forEach((fase) => { const r = calor(alvo[fase], f.pico[fase] || 0); if (r) soma(r[0], r[1]); });
  if (alvo.mexer && !f.mexido) soma(1, 'mexer');
  return { er, mot };
};
function bancada(root, c) {
  const { tr, A, st, p, L } = c, B = L.bancada, ses = p.bancada || {}, alf = L.alforje(st);
  const noite = ses.sessao === 'noite', turvo = st.turvo || 0;
  const ING = Object.fromEntries(B.ingredientes.map((x) => [x.id, x]));
  const e = c.esc;
  // o vinho embaralha o olho: o que se vê no pote fica um pouco à frente ou atrás do que é
  const desvio = turvo >= 2 ? (Math.random() < .5 ? -1 : 1) * (.05 + Math.random() * .05) : 0;
  const T_MOER = turvo >= 2 ? 2.9 : 2.2;   // segundos de pilão para ir de pedaços a pó
  return new Promise((resolve) => {
    root.classList.add('bancada'); if (noite) root.classList.add('noite'); if (turvo >= 2) root.classList.add('turvo');
    const fundo = noite ? "url('assets/images/bancada-noite.jpg'), url('assets/images/laje-noite.jpg')" : "url('assets/images/bancada.jpg'), url('assets/images/laje.jpg')";
    root.innerHTML = `<div class="j5-bg" style="background-image:${fundo}"></div><div class="j5-veu forte"></div>
      <div class="bc">
        <header class="bc-top"><p class="bc-tit"><b>${e(tr(B.titulo))}</b><small>${e(tr(noite ? B.noiteT : B.manhaT))}</small></p><p class="bc-rec"></p><button class="ghost bc-abrir">${e(tr(B.abrir))}</button></header>
        <div class="bc-prat"></div>
        <div class="bc-est">
          <button class="bc-st bc-pilao">${BC_SVG.pilao}<span class="bc-rot">${e(tr(B.pilaoT))}</span><span class="bc-cont"></span></button>
          <div class="bc-fogo">
            <button class="bc-st bc-pote">${BC_SVG.pote}<span class="bc-rot">${e(tr(B.poteT))}</span><span class="bc-cont"></span></button>
            <button class="bc-brasa">${BC_SVG.brasa}<span class="bc-rot">${e(tr(B.brasaT))}</span></button>
          </div>
          <button class="bc-st bc-guardar">${BC_SVG.guardar}<span class="bc-rot">${e(tr(B.guardarT))}</span></button>
        </div>
        <p class="bc-dica"></p>
        <div class="bc-base"><div class="bc-alf"></div><div class="bc-bts"><button class="ghost bc-fora">${e(tr(B.esvaziarT))}</button><button class="cta bc-sair">${e(tr(ses.sair || B.abrir))}</button></div></div>
      </div>
      <div class="bc-couro"><div class="bc-pele"></div></div>
      <div class="bc-res"></div>`;
    const $ = (s) => root.querySelector(s);
    const prat = $('.bc-prat'), pilEl = $('.bc-pilao'), poteEl = $('.bc-pote'), brasaEl = $('.bc-brasa'), guardEl = $('.bc-guardar');
    const dica = $('.bc-dica'), alfEl = $('.bc-alf'), couro = $('.bc-couro'), pele = $('.bc-pele'), resEl = $('.bc-res'), recEl = $('.bc-rec');
    // pilão: [{id, m}] (m de 0 a 1) · pote: ids, com o que veio do pilão marcado · calor do pote de 0 a ~1.2
    let rec = null, mao = null, pilao = [], pote = [], mistura = 1, calor = 0, fogo = false, fim = false, borrado = [], lembrou = 0;
    let ficha = null;   // o que a mão fez nesta receita (para a avaliação)
    const novaFicha = () => ({ noPote: [], noPilao: [], usouPote: false, moagem: null, verteu: false, mexido: false, pico: { antes: 0, depois: 0 } });
    const feitos = [];
    const temIng = (id) => ING[id].sempre || (alf.ingr[id] || 0) > 0;
    const podeFazer = (r) => r.usa.every(temIng);
    const ocupado = () => pilao.length || pote.length || fogo;
    const avisa = (t, cls) => { dica.textContent = tr(t); dica.className = 'bc-dica on ' + (cls || ''); };
    const treme = (el) => { el.classList.remove('nao'); void el.offsetWidth; el.classList.add('nao'); A.tone(160, .25, 'square', .025); };
    const dicaPadrao = () => { if (!rec) return avisa(B.dEscolha); if (mao === 'pilao') return avisa(B.dPilaoMao, 'mao'); if (mao) return avisa(tr(B.naMao) + ': ' + tr(ING[mao].nome) + '. ' + tr(B.dMao), 'mao'); avisa(B.dLivre); };
    const nivelMoagem = () => { if (!pilao.length) return null; const m = Math.min(...pilao.map((x) => x.m)); return m >= .75 ? 2 : m >= .35 ? 1 : 0; };
    const nivelCalor = (v) => { const x = v + desvio; return x >= .8 ? 3 : x >= .5 ? 2 : x >= .25 ? 1 : 0; };
    const nivelReal = (v) => (v >= .8 ? 3 : v >= .5 ? 2 : v >= .25 ? 1 : 0);
    // ---------- desenho
    const desenhaPrat = () => {
      prat.innerHTML = B.ingredientes.map((x) => { const n = x.sempre ? '∞' : (alf.ingr[x.id] || 0); return `<button class="bc-ing ${mao === x.id ? 'sel' : ''} ${!x.sempre && !n ? 'zero' : ''}" data-id="${x.id}" style="--c:${x.cor}">${ING_IC[x.id] || ''}<span>${e(tr(x.nome))}</span><em>${n}</em></button>`; }).join('');
      prat.querySelectorAll('.bc-ing').forEach((b) => b.onclick = () => pega(b.dataset.id, b));
    };
    const desenhaAlf = () => {
      alfEl.innerHTML = `<span>${e(tr(B.alforjeT))}</span>` + (alf.prontos.map((u) => { const r = B.receitas.find((x) => x.id === u.id); return `<i class="bc-pr q-${u.q}" title="${e(tr(r.nome))} · ${e(tr(B.qual[u.q]))}">${ICON[r.ic] || ''}</i>`; }).join('') || '<em>—</em>');
    };
    // o que muda a cada quadro: a moagem, o calor, a mistura (só classes e variáveis de CSS)
    const desenhaVivo = () => {
      const nm = nivelMoagem();
      pilEl.classList.toggle('m0', nm === 0); pilEl.classList.toggle('m1', nm === 1); pilEl.classList.toggle('m2', nm === 2);
      const nc = pote.length ? nivelCalor(calor) : 0;
      for (let k = 1; k <= 3; k++) poteEl.classList.toggle('q' + k, nc === k);
      poteEl.style.setProperty('--mist', (1 - mistura).toFixed(2));
    };
    const desenhaEst = () => {
      const cp = misturaCor(pilao.map((x) => ING[x.id].cor)), cq = misturaCor(pote.filter((x) => !x.doPilao || mistura >= 1).map((x) => ING[x.id].cor)), cm = misturaCor(pote.filter((x) => x.doPilao).map((x) => ING[x.id].cor));
      pilEl.style.setProperty('--c', cp || 'transparent'); pilEl.classList.toggle('cheio', !!pilao.length);
      poteEl.style.setProperty('--c', (mistura >= 1 ? misturaCor(pote.map((x) => ING[x.id].cor)) : cq) || cm || 'transparent'); poteEl.style.setProperty('--c2', cm || 'transparent');
      poteEl.classList.toggle('cheio', !!pote.length);
      pilEl.querySelector('.bc-cont').textContent = pilao.map((x) => tr(ING[x.id].nome)).join(' · ');
      poteEl.querySelector('.bc-cont').textContent = pote.map((x) => tr(ING[x.id].nome)).join(' · ');
      pilEl.classList.toggle('alvo', !!mao && mao !== 'pilao'); poteEl.classList.toggle('alvo', !!mao);
      pilEl.classList.toggle('na-mao', mao === 'pilao');
      root.classList.toggle('fogo', fogo); brasaEl.classList.toggle('on', fogo);
      recEl.textContent = rec ? tr(rec.nome) : '';
      $('.bc-sair').classList.toggle('off', !!ocupado());
      $('.bc-fora').disabled = !ocupado();
      desenhaPrat(); dicaPadrao(); desenhaVivo();
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
      gasta(id);
      if (onde === 'pilao') { pilao.push({ id, m: 0 }); ficha.noPilao.push(id); A.sfx('ingrediente-pilao', .5, () => A.hiss(.15, 1200, .8, .08)); }
      else { pote.push({ id }); ficha.noPote.push(id); ficha.usouPote = true; calor *= .6; A.sfx('ingrediente-pote', .5, () => A.tone(300, .2, 'sine', .04, 0, .7)); }
      mao = null; desenhaEst();
    };
    const verter = () => {
      if (!pilao.length) return;
      ficha.moagem = nivelMoagem(); ficha.verteu = true; ficha.usouPote = true;
      pote.push(...pilao.map((x) => ({ id: x.id, doPilao: true }))); pilao = []; mistura = 0; calor *= .3; mao = null;
      A.sfx('despejar', .5, () => A.hiss(.5, 500, .6, .1, 0, 'lowpass')); desenhaEst();
    };
    const liga = () => { fogo = true; A.sfx('brasa-acende', .5, () => A.hiss(.6, 1600, .5, .08)); desenhaEst(); };
    const desliga = () => { if (!fogo) return; fogo = false; A.sfx('brasa-apaga', .45, () => A.hiss(.3, 400, .6, .06, 0, 'lowpass')); desenhaEst(); };
    // segurar: moer e mexer são contínuos (o olho decide quando parar); tocar: pôr e levar
    const segurar = (el, pode, faz, toque, som) => {
      let t0 = 0, ativo = false;
      const para = () => { ativo = false; el.classList.remove('segura'); };
      el.addEventListener('pointerdown', (ev) => {
        if (fim || couro.classList.contains('on') || resEl.classList.contains('on')) return;
        ev.preventDefault(); t0 = performance.now();
        setTimeout(() => { if (t0 > 0 && pode()) { ativo = true; el.classList.add('segura'); som && som(); } }, 220);
      });
      el.addEventListener('pointerup', () => { const dt = performance.now() - t0; if (t0 > 0 && dt < 220) toque(); para(); t0 = 0; });
      el.addEventListener('pointerleave', () => { para(); t0 = 0; });
      el.addEventListener('pointercancel', () => { para(); t0 = 0; });
      return { get ativo() { return ativo; }, faz };
    };
    const mPil = segurar(pilEl, () => !!rec && !mao && pilao.length > 0, (dt) => { pilao.forEach((x) => { x.m = Math.min(1, x.m + dt / T_MOER); }); },
      () => {
        if (!rec) return avisa(B.dEscolha);
        if (mao && mao !== 'pilao') return poeNo('pilao', mao);
        if (mao === 'pilao') { mao = null; return desenhaEst(); }
        if (!pilao.length) return avisa(B.dVazio);
        mao = 'pilao'; desenhaEst();
      }, () => A.sfx('pilao-moer', .55, () => { for (let i = 0; i < 4; i++) A.hiss(.18, 900 + i * 120, .9, .07, i * .3); }));
    const mPot = segurar(poteEl, () => !!rec && !mao && pote.length > 0, (dt) => { if (mistura < 1) { mistura = Math.min(1, mistura + dt / 1.1); if (mistura >= 1) { ficha.mexido = true; desenhaEst(); } } },
      () => {
        if (!rec) return avisa(B.dEscolha);
        if (mao === 'pilao') return verter();
        if (mao) return poeNo('pote', mao);
        avisa(pote.length ? B.dSegMexer : B.dVazio);
      }, () => A.sfx('colher-mexe', .5, () => A.hiss(.6, 700, 1.2, .07)));
    brasaEl.onclick = () => { if (fim || !rec) return rec ? null : avisa(B.dEscolha); fogo ? desliga() : liga(); };
    guardEl.onclick = () => {
      if (fim) return; if (!rec) return avisa(B.dEscolha);
      if (!pilao.length && !pote.length) { treme(guardEl); return avisa(B.dVazio); }
      if (fogo) desliga();
      if (pilao.length) ficha.moagem = nivelMoagem();   // o pó vai direto do pilão para a bolsa
      const mix = new Set(pote.map((x) => x.id).concat(pilao.map((x) => x.id)));
      const av = avaliaReceita(rec.alvo, ficha);
      const q = !rec.usa.every((id) => mix.has(id)) ? 'falhou' : av.er === 0 ? 'bom' : av.er <= 1.5 ? 'medio' : av.er <= 3.5 ? 'ruim' : 'falhou';
      if (q !== 'falhou') alf.prontos.push({ uid: 'u' + (alf.seq = (alf.seq || 1) + 1), id: rec.id, q });
      alf.feitos.push({ id: rec.id, q, ses: ses.sessao }); feitos.push({ id: rec.id, q });
      c.registrar('bancada_' + rec.id, q); c.salvar();
      A.sfx(q === 'falhou' ? 'despejar' : 'guardar-pote', .55, () => (q === 'falhou' ? A.hiss(.6, 300, .5, .1, 0, 'lowpass') : A.tone(520, .5, 'sine', .04)));
      // o que saiu do ponto: no máximo duas coisas, na voz dele
      const motivos = q === 'bom' ? [] : av.mot.slice(0, 2).map(([k, id]) => tr(B.motivo[k]).replace('{i}', id ? tr(ING[id].nome) : ''));
      if (q === 'falhou' && !rec.usa.every((id) => mix.has(id))) motivos.unshift(tr(B.motivo.falta));
      const r = rec; pilao = []; pote = []; mistura = 1; calor = 0; ficha = null; mao = null; rec = null; desenhaEst(); desenhaAlf();
      resEl.innerHTML = `<div class="bc-card q-${q}">${ICON[r.ic] || ''}<p class="bc-rn">${e(tr(r.nome))}<small>${e(tr(r.sub))}</small></p><p class="bc-q">${e(tr(B.qual[q]))}</p><p class="bc-rl">${e(tr(B.resultado[q]))}</p>${motivos.length ? `<ul class="bc-mot">${motivos.slice(0, 2).map((m) => `<li>${e(m)}</li>`).join('')}</ul>` : ''}<button class="cta bc-ok">${e(c.lang === 'en' ? 'Continue' : 'Continuar')}</button></div>`;
      resEl.classList.add('on');
      resEl.querySelector('.bc-ok').onclick = () => { resEl.classList.remove('on'); abreCouro(); };
    };
    $('.bc-fora').onclick = () => {
      if (!ocupado()) return;
      desliga(); pilao = []; pote = []; mistura = 1; calor = 0; ficha = rec ? novaFicha() : null; mao = null;
      A.sfx('despejar', .5, () => A.hiss(.6, 300, .5, .1, 0, 'lowpass')); desenhaEst();
    };
    $('.bc-sair').onclick = () => {
      if (ocupado()) { treme($('.bc-sair')); return avisa(B.dOcupado); }
      fim = true; couro.classList.remove('on');
      A.sfx('passos-areia', .5, () => A.hiss(.3, 300, .6, .1, 0, 'lowpass'));
      setTimeout(() => resolve({ sessao: ses.sessao, feitos }), BOT() ? 50 : 300);
    };
    // ---------- o couro (cobre a bancada; o fogo continua aceso por baixo)
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
      const outra = pele.querySelector('.bc-outra'); if (outra) outra.onclick = () => { rec = null; ficha = null; mao = null; desenhaEst(); listaCouro(); };
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
      rec = r; ficha = novaFicha(); mao = null;
      const k = turvo >= 4 ? r.linhas.length - 1 : turvo >= 2 ? Math.ceil(r.linhas.length / 2) : turvo >= 1 ? 1 : 0;
      borrado = [...r.linhas.keys()].sort(() => Math.random() - .5).slice(0, k);
      A.sfx('receita-couro', .45, () => A.hiss(.4, 2400, .5, .05)); desenhaEst(); receitaCouro();
    };
    const abreCouro = () => { if (fim) return; rec ? receitaCouro() : listaCouro(); couro.classList.add('on'); };
    const fechaCouro = () => { couro.classList.remove('on'); dicaPadrao(); };
    $('.bc-abrir').onclick = abreCouro;
    // ---------- o relógio: moer, mexer, o calor do pote (sobe com fogo e com algo dentro; esfria devagar sem fogo)
    let last = performance.now(), somBolha = 0;
    const loop = (now) => {
      if (fim || !root.isConnected) return;
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (window.__mgPausa) return requestAnimationFrame(loop);
      if (mPil.ativo) mPil.faz(dt);
      if (mPot.ativo) mPot.faz(dt);
      if (pote.length) {
        calor = fogo ? Math.min(1.2, calor + .07 * dt) : Math.max(0, calor - .035 * dt);
        if (ficha) { const fase = ficha.verteu ? 'depois' : 'antes'; ficha.pico[fase] = Math.max(ficha.pico[fase], nivelReal(calor)); }
        const nc = nivelCalor(calor);
        if (nc >= 2 && now > somBolha) { somBolha = now + (nc === 3 ? 380 : 900); A.sfx('pote-borbulha', nc === 3 ? .5 : .3, () => { A.tone(180, .25, 'sine', .05, 0, 1.6); A.tone(240, .2, 'sine', .03, .12, 1.4); }); }
      } else calor = 0;
      desenhaVivo();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    desenhaAlf(); desenhaEst();
    // primeiro o cartão de instrução, depois o couro (o couro é a primeira coisa que ele lê)
    c.gesto(root, 'tocar');
    { const ec = setInterval(() => { if (!window.__mgPausa) { clearInterval(ec); setTimeout(abreCouro, BOT() ? 20 : 300); } }, 80); }
    // ---------- testes automáticos: faz certo o que der, nesta ordem
    if (BOT()) {
      const ordem = noite ? ['po', 'unguento', 'tintura'] : ['antidoto', 'unguento', 'po'];
      const espera = (ms) => new Promise((r) => setTimeout(r, ms));
      const PICO = { nada: 0, vapor: 1, bolhas: 2 };
      (async () => {
        await espera(300);
        for (const id of ordem) {
          const r = B.receitas.find((x) => x.id === id); if (!podeFazer(r)) continue;
          escolhe(r); fechaCouro(); const a = r.alvo;
          (a.pote || []).forEach((i) => poeNo('pote', i)); ficha.pico.antes = PICO[a.antes] || 0;
          (a.pilao || []).forEach((i) => poeNo('pilao', i)); pilao.forEach((x) => { x.m = a.moer === 'grosso' ? .5 : 1; });
          if (a.pote) { verter(); ficha.pico.depois = PICO[a.depois] || 0; if (a.mexer) { mistura = 1; ficha.mexido = true; } }
          calor = 0; await espera(30); guardEl.click();
          await espera(60); const ok = root.querySelector('.bc-ok'); ok && ok.click(); await espera(60);
        }
        fechaCouro(); $('.bc-sair').click();
      })();
    }
  });
}

window.JOGOS5 = { ressaca, laje, bancada, troca, minutos, parto, rastro };
})();
