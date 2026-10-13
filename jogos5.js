/* ==========================================================================
   Capítulo V · os momentos de jogo
   RESSACA  · os pensamentos sobem da areia: enterrar ou deixar lembrar
   LAJE     · conferir o abrigo (point-and-click do Cap. I) + o diário do deserto
   TROCA    · coisa por coisa: ler o corpo do Grakh e pôr no couro só o justo
   MINUTOS  · o eclipse: um mapa no escuro, o anel do sol voltando, ações que custam tempo
   PARTO    · um pensamento a mais: segurar a luz dentro da faixa, no compasso do coração
   RASTRO   · acender o caminho e levar os Tacets para longe da Pira
   Cada jogo recebe (root, ctx) e devolve uma Promise com o resultado.
   Nenhum deles muda o que é fixo: só o custo, o tom e a pontuação.
   ========================================================================== */
(() => {
'use strict';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BOT = () => !!window.__JOGO_BOT;   // testes automáticos

// ------------------------------------------------------------------ ícones (SVG simples, traço)
const ICON = {
  pote: '<svg viewBox="0 0 32 32"><path d="M10 6h12M11 6v3c-4 2-5 6-5 9 0 6 4 9 10 9s10-3 10-9c0-3-1-7-5-9V6"/></svg>',
  frasco: '<svg viewBox="0 0 32 32"><path d="M13 4h6M14 4v7l-6 12c-1 3 1 5 4 5h8c3 0 5-2 4-5l-6-12V4"/><path d="M11 20h10"/></svg>',
  gota: '<svg viewBox="0 0 32 32"><path d="M16 4c5 7 9 12 9 17a9 9 0 0 1-18 0c0-5 4-10 9-17z"/></svg>',
  bolsa: '<svg viewBox="0 0 32 32"><path d="M11 9c2 2 8 2 10 0M10 9l-3 14c0 3 3 5 9 5s9-2 9-5L22 9M13 6c1 2 5 2 6 0"/></svg>',
};

// ------------------------------------------------------------------ uma imagem 16:9 que cabe na tela (e rola de lado no celular)
function palco(root, img, prop) {
  root.insertAdjacentHTML('beforeend', `<div class="ex-rolo"><div class="ex-caixa" style="--r:${prop};background-image:url('${img}')"></div></div>`);
  const rolo = root.querySelector('.ex-rolo'), caixa = root.querySelector('.ex-caixa');
  requestAnimationFrame(() => {
    rolo.scrollLeft = (rolo.scrollWidth - rolo.clientWidth) / 2;
    // no celular a imagem rola de lado: uma dica que some no primeiro deslize
    if (rolo.scrollWidth > rolo.clientWidth + 20) {
      const d = document.createElement('p'); d.className = 'ex-deslize'; d.textContent = '‹  ' + (document.documentElement.lang === 'en' ? 'Swipe to see it all' : 'Deslize para ver tudo') + '  ›'; root.appendChild(d);
      rolo.addEventListener('scroll', () => d.classList.add('some'), { once: true });
    }
  });
  return { rolo, caixa };
}

// ================================================================== RESSACA
function ressaca(root, c) {
  const { tr, A, st, L } = c;
  const cfg = L.ressaca, lista = cfg.pensamentos(st);
  return new Promise((resolve) => {
    root.innerHTML = `<div class="j5-bg" style="background-image:url('assets/images/areia-amanhecer.jpg')"></div><div class="j5-veu"></div>
      <div class="rs-campo"></div><div class="rs-lembra" aria-live="polite"></div>
      <p class="j5-dica">${c.esc(c.U('dica').ressaca)}</p>`;
    const campo = root.querySelector('.rs-campo'), painel = root.querySelector('.rs-lembra');
    const subiram = [], enterrados = []; let vivos = 0, k = 0, fim = false;
    const fila = []; let mostrando = false;
    const mostra = () => {
      if (mostrando || !fila.length) return; mostrando = true;
      const t = fila.shift(); painel.innerHTML = `<p>${c.esc(tr(t))}</p>`; painel.classList.add('on');
      setTimeout(() => { painel.classList.remove('on'); setTimeout(() => { mostrando = false; mostra(); }, 600); }, Math.max(4200, tr(t).length * 55));
    };
    const encerra = () => {
      if (fim) return; fim = true;
      setTimeout(() => {
        const nomes = lista.filter((p) => subiram.includes(p.id)).map((p) => tr(p.rotulo));
        painel.innerHTML = `<p class="rs-sum"><span>${c.esc(tr(cfg.subiuT))}:</span> ${nomes.length ? nomes.map(c.esc).join(' · ') : c.esc(tr(cfg.nadaT))}</p>`; painel.classList.add('on');
        if (subiram.length >= 4) st.tom.ternura = (st.tom.ternura || 0) + 1; else if (subiram.length === 0) st.tom.frieza = (st.tom.frieza || 0) + 1;
        c.registrar('ressaca', String(subiram.length));
        setTimeout(() => resolve({ subiram, enterrados }), 3600);
      }, fila.length ? 3000 : 900);
    };
    const nasce = (p) => {
      vivos++;
      const b = document.createElement('button'); b.className = 'rs-pens' + (p.forte ? ' forte' : ''); b.textContent = tr(p.rotulo);
      const x = 18 + ((k * 37) % 64) + Math.random() * 6; k++;
      b.style.left = x + '%'; b.style.top = '86%';
      campo.appendChild(b);
      let hp = p.forte ? 2 : 1, y = 86, morto = false; const vel = p.forte ? 12 : 7.6;   // % de tela por segundo... em ~9 s chega ao alto
      const t0 = performance.now(); let last = t0;
      const sobe = (now) => {
        if (morto) return;
        const dt = Math.min(.1, (now - last) / 1000); last = now; y -= vel * dt;
        b.style.top = y + '%'; b.style.setProperty('--b', clamp((86 - y) / 58, .15, 1).toFixed(2));
        if (y <= 27) { morto = true; b.classList.add('chega'); subiram.push(p.id); c.mudaLuz(p.forte ? 6 : 4); A.sfx('pensamento-sobe', .5, () => { A.tone(660, .7, 'sine', .04); A.tone(990, .9, 'sine', .025, .1); }); fila.push(p.texto); mostra(); setTimeout(() => b.remove(), 1200); if (--vivos === 0 && k >= lista.length) encerra(); return; }
        requestAnimationFrame(sobe);
      };
      requestAnimationFrame(sobe);
      b.onclick = () => {
        if (morto) return;
        if (--hp > 0) { b.classList.remove('resiste'); void b.offsetWidth; b.classList.add('resiste'); A.sfx('areia-enterra', .5, () => A.hiss(.3, 500, .6, .12, 0, 'lowpass')); y += 6; return; }
        morto = true; b.classList.add('enterra'); enterrados.push(p.id); A.sfx('areia-enterra', .6, () => A.hiss(.5, 380, .5, .18, 0, 'lowpass'));
        setTimeout(() => b.remove(), 900); if (--vivos === 0 && k >= lista.length) encerra();
      };
      if (BOT()) setTimeout(() => { if (!morto && p.id !== 'chuva' && p.id !== 'menina') { b.click(); b.click(); } }, 400);
    };
    lista.forEach((p, i) => setTimeout(() => nasce(p), 900 + i * (BOT() ? 500 : 3400)));
  });
}

// ================================================================== LAJE (point-and-click) + diário
function laje(root, c) {
  const { tr, A, st, p, L } = c, ex = p.laje;
  return new Promise((resolve) => {
    st.explorar = st.explorar || {};
    const reg = st.explorar[p.id] = st.explorar[p.id] || { vistos: [] };
    root.classList.add('explorar');
    const pontos = ex.pontos.filter((pt) => !pt.se || pt.se(st));
    const obrig = pontos.filter((pt) => !pt.opcional);
    const { rolo, caixa } = palco(root, ex.img, ex.proporcao);
    root.insertAdjacentHTML('beforeend', `<p class="ex-instr"></p><div class="ex-texto"><div class="ex-corpo"></div><div class="ex-acoes"></div></div>`);
    const corpo = root.querySelector('.ex-corpo'), acoes = root.querySelector('.ex-acoes'), instr = root.querySelector('.ex-instr');
    let ocupado = false;
    const mostra = (lista) => { corpo.innerHTML = c.paras(lista).map((t) => `<p>${c.linkify(t)}</p>`).join(''); corpo.scrollTop = 0; corpo.classList.remove('novo'); void corpo.offsetWidth; corpo.classList.add('novo'); };
    const marca = (pt, b) => { if (!reg.vistos.includes(pt.id)) reg.vistos.push(pt.id); b.classList.add('visto'); c.salvar(); atualiza(); };
    const porta = () => {
      if (acoes.querySelector('.porta')) return;
      acoes.innerHTML = `<p class="ex-fecho">${c.esc(tr(ex.fecho))}</p><button class="cta porta">${c.esc(tr(ex.porta))}</button>`;
      acoes.querySelector('.porta').onclick = () => { A.sfx('passos-areia', .5, () => A.hiss(.3, 300, .6, .1, 0, 'lowpass')); resolve({ nav: true, vistos: reg.vistos.slice() }); };
    };
    const atualiza = () => {
      const n = obrig.filter((pt) => reg.vistos.includes(pt.id)).length;
      instr.textContent = `${tr(ex.instrucao)} · ${n}/${obrig.length}`;
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
      const b = document.createElement('button');
      b.className = 'ex-pt' + (pt.gema ? ' gema' : '') + (reg.vistos.includes(pt.id) ? ' visto' : '');
      Object.assign(b.style, { left: (pt.x - pt.w / 2) + '%', top: (pt.y - pt.h / 2) + '%', width: pt.w + '%', height: pt.h + '%' });
      b.setAttribute('aria-label', tr(pt.rotulo));
      b.innerHTML = `<i></i><span>${c.esc(tr(pt.rotulo))}</span>`;
      b.onclick = (e) => {
        e.stopPropagation(); if (ocupado) return;
        if (pt.tipo === 'diario') return diario(pt, b);
        if (pt.som) A.sfx(pt.som, .55);
        mostra(typeof pt.texto === 'function' ? pt.texto(st) : pt.texto); marca(pt, b);
      };
      caixa.appendChild(b);
    });
    mostra(c.paras(p.texto).slice(-1));
    atualiza();
    if (BOT()) setTimeout(() => { [...caixa.querySelectorAll('.ex-pt')].forEach((b, i) => setTimeout(() => !ocupado && b.click(), 100 + i * 120)); setTimeout(() => { const d = root.querySelector('.dz-fechar'); d && d.click(); }, 1600); setTimeout(() => { const pb = root.querySelector('.porta'); pb && pb.click(); }, 2600); }, 300);
  });
}

// ================================================================== TROCA
function troca(root, c) {
  const { tr, A, st, L } = c, cfg = L.troca;
  return new Promise((resolve) => {
    root.innerHTML = `<div class="j5-bg" style="background-image:url('assets/images/ponto-troca.jpg')"></div><div class="j5-veu forte"></div>
      <div class="tc">
        <div class="tc-cli"><p class="tc-nome"></p><p class="tc-chega"></p><p class="tc-oferta"></p></div>
        <div class="tc-couro"><p class="tc-rot">${c.esc(tr(cfg.noCouro))}</p><div class="tc-mesa"></div><p class="tc-sinal"></p></div>
        <div class="tc-prat"><p class="tc-rot">${c.esc(tr(cfg.teus))}</p><div class="tc-itens">${cfg.itens.map((it) => `<button class="tc-it" data-id="${it.id}">${ICON[it.ic]}<span>${c.esc(tr(it.nome))}</span></button>`).join('')}</div></div>
        <div class="tc-acoes"><button class="cta tc-go" disabled>${c.esc(tr(cfg.empurrar))}</button></div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const mesa = $('.tc-mesa'), sinal = $('.tc-sinal'), go = $('.tc-go');
    const res = { ok: {}, demais: 0, pontos: 0 };
    let ci = 0, posto = [], tent = 0, travado = false;
    const nomeIt = (id) => tr(cfg.itens.find((x) => x.id === id).nome);
    const leitura = () => {
      const cl = cfg.clientes[ci]; if (!posto.length) { sinal.textContent = ''; sinal.className = 'tc-sinal'; return; }
      const tem = posto.includes(cl.precisa), exato = tem && posto.length === 1;
      sinal.className = 'tc-sinal on ' + (exato ? 'bom' : tem ? 'demais' : 'errado');
      sinal.textContent = exato ? tr(cl.bom) : tem ? tr(cfg.demais) : tr(cfg.errado).replace('{n}', cl.nome);
    };
    const desenhaMesa = () => {
      mesa.innerHTML = posto.map((id, i) => { const it = cfg.itens.find((x) => x.id === id); return `<button class="tc-tok" data-i="${i}" title="${c.esc(nomeIt(id))}">${ICON[it.ic]}</button>`; }).join('');
      mesa.querySelectorAll('.tc-tok').forEach((b) => b.onclick = () => { if (travado) return; posto.splice(+b.dataset.i, 1); A.sfx('couro-item', .4, () => A.hiss(.12, 700, .8, .08)); desenhaMesa(); leitura(); });
      go.disabled = !posto.length || travado;
    };
    const cliente = () => {
      const cl = cfg.clientes[ci]; posto = []; tent = 0; travado = false;
      $('.tc-nome').textContent = cl.nome; $('.tc-chega').textContent = tr(cl.chega);
      $('.tc-oferta').innerHTML = `<span>${c.esc(tr(cfg.oferece))}:</span> ${c.esc(tr(cl.oferta))}`;
      $('.tc-cli').classList.remove('in'); void $('.tc-cli').offsetWidth; $('.tc-cli').classList.add('in');
      desenhaMesa(); leitura();
      if (BOT()) setTimeout(() => { root.querySelector(`.tc-it[data-id="${cl.precisa}"]`).click(); setTimeout(() => go.click(), 150); }, 300);
    };
    root.querySelectorAll('.tc-it').forEach((b) => b.onclick = () => {
      if (travado || posto.length >= 3) return;
      posto.push(b.dataset.id); A.sfx('couro-item', .5, () => A.hiss(.12, 900, .8, .1)); desenhaMesa(); leitura();
      const cl = cfg.clientes[ci];
      if (b.dataset.id === cl.precisa && posto.length === 1) A.sfx('grakh-bufa', .5, () => A.hiss(.4, 260, .8, .12, 0, 'lowpass'));
    });
    const proximo = () => { ci++; if (ci >= cfg.clientes.length) { c.registrar('troca', String(Object.values(res.ok).filter(Boolean).length)); return setTimeout(() => resolve(res), 400); } cliente(); };
    go.onclick = () => {
      if (travado || !posto.length) return;
      const cl = cfg.clientes[ci], tem = posto.includes(cl.precisa), exato = tem && posto.length === 1;
      travado = true; go.disabled = true;
      if (exato || tem) {
        res.ok[cl.id] = true;
        if (exato) { res.pontos += tent === 0 ? 2400 : 1400; st.pira += tent === 0 ? 1 : 0; }
        else { res.demais++; res.pontos += 700; if (res.demais === 1) { st.hessa -= 1; c.toast(cfg.hessaViu); } }
        A.sfx('grakh-grunhe', .55, () => A.tone(110, .5, 'sawtooth', .05, 0, .8));
        sinal.className = 'tc-sinal on bom'; sinal.textContent = (exato ? '' : tr(cfg.devolve) + ' ') + tr(cl.aceita);
        mesa.classList.add('leva'); setTimeout(() => { mesa.classList.remove('leva'); proximo(); }, BOT() ? 300 : 3600);
        return;
      }
      tent++;
      if (tent >= 2) {
        res.ok[cl.id] = false; st.pira -= 1;
        sinal.className = 'tc-sinal on errado'; sinal.textContent = tr(cfg.vaiEmbora).replace('{n}', cl.nome);
        setTimeout(proximo, BOT() ? 300 : 3200); return;
      }
      sinal.className = 'tc-sinal on errado'; sinal.textContent = tr(cfg.recusa);
      $('.tc-couro').classList.remove('nao'); void $('.tc-couro').offsetWidth; $('.tc-couro').classList.add('nao');
      setTimeout(() => { travado = false; posto = []; desenhaMesa(); leitura(); }, 1600);
    };
    cliente();
  });
}

// ================================================================== MINUTOS (o eclipse)
function minutos(root, c) {
  const { tr, A, st, L } = c, cfg = L.minutos;
  return new Promise((resolve) => {
    root.classList.add('explorar');
    const { rolo, caixa } = palco(root, 'assets/images/goelas-escuro.jpg', 1920 / 1080);
    root.insertAdjacentHTML('beforeend', `
      <div class="mn-anel"><svg viewBox="0 0 100 100"><circle class="fundo" cx="50" cy="50" r="40"/><circle class="sol" cx="50" cy="50" r="40" pathLength="100"/><circle class="lua" cx="50" cy="50" r="31"/></svg><span>${c.esc(tr(cfg.anelT))}</span></div>
      <div class="mn-painel"><div class="mn-txt"></div><button class="cta mn-ok">${c.lang === 'en' ? 'Continue' : 'Continuar'}</button></div>`);
    const anelSol = root.querySelector('.sol'), painel = root.querySelector('.mn-painel'), ptxt = root.querySelector('.mn-txt'), ok = root.querySelector('.mn-ok');
    const total = cfg.marcas * cfg.segundosPorMarca;
    let t = 0, pausado = false, fim = false, last = performance.now();
    const feitas = [];
    const restam = () => Math.max(0, cfg.marcas - Math.ceil(t / cfg.segundosPorMarca - 1e-6));
    const desenha = () => { anelSol.style.strokeDasharray = `${(t / total) * 100} 100`; root.querySelectorAll('.mn-pt').forEach((b) => { const a = cfg.acoes.find((x) => x.id === b.dataset.id); b.classList.toggle('caro', !feitas.includes(a.id) && a.custo > restam() && !a.fim); }); };
    const encerra = (motivoFim) => {
      if (fim) return; fim = true;
      A.sfx('sol-volta', .6, () => { A.tone(880, 1.4, 'sine', .04); A.tone(1320, 1.8, 'sine', .025, .2); });
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
        ok.onclick = () => { k++; if (k < passos.length) return passo(); painel.classList.remove('on'); pausado = false; last = performance.now(); if (a.fim || t >= total - .01) encerra(a.fim ? 'esconder' : 'tempo'); };
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
        if (!a.fim && a.custo > restam()) { b.classList.remove('nao'); void b.offsetWidth; b.classList.add('nao'); A.tone(160, .3, 'square', .03); return; }
        feitas.push(a.id); b.classList.add('feito'); c.registrar('minuto_' + feitas.length, a.id);
        if (a.id === 'beber') c.beber('minutos');
        if (a.id === 'po') A.sfx('po-vento', .6, () => A.hiss(1.2, 1800, .6, .12)), setTimeout(() => A.sfx('cavalos-panico', .7), 600);
        if (a.id === 'tukk') A.sfx('arrasta', .5, () => A.hiss(1.4, 300, .6, .14, 0, 'lowpass'));
        t = Math.min(total, t + a.custo * cfg.segundosPorMarca); desenha();
        abrePassos(a);
      };
      caixa.appendChild(b);
    });
    // a ouvida tem duas partes: os soldados (sem voz) e o que Aheryn entende (com voz)
    const ouvir = cfg.acoes.find((a) => a.id === 'ouvir'); if (ouvir && !ouvir.passos) ouvir.passos = [ouvir.texto.slice(0, 3), ouvir.texto.slice(3)];
    const loop = (now) => {
      if (fim) return;
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (!pausado) { t += dt * (BOT() ? 8 : 1); desenha(); if (t >= total) { t = total; desenha(); return encerra('tempo'); } }
      requestAnimationFrame(loop);
    };
    desenha(); requestAnimationFrame(loop);
    A.sfx('eclipse-total', .4);
    if (BOT()) setTimeout(() => { ['shaa', 'ouvir'].forEach((id, i) => setTimeout(() => { const b = caixa.querySelector(`.mn-pt[data-id="${id}"]`); b && b.click(); }, 300 + i * 1200)); }, 200);
  });
}

// ================================================================== PARTO (um pensamento a mais)
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
      <div class="pt-vida"><i></i><span>${c.esc(tr(cfg.vidaT))}</span></div>
      <p class="j5-dica">${c.esc(tr(cfg.segurarT))}<small>${c.lang === 'en' ? 'touch and hold, or hold space' : 'toque e segure, ou segure espaço'}</small></p>`;
    const v = root.querySelector('video'); v && v.play().catch(() => {});
    const $ = (s) => root.querySelector(s);
    const faixaEl = $('.pt-faixa'), luzEl = $('.pt-luz'), marcaEl = $('.pt-marca'), vidaEl = $('.pt-vida i'), brilho = $('.pt-brilho'), linhas = $('.pt-linhas');
    const DUR = BOT() ? 6 : 28, larg = Math.max(.14, (dois ? .22 : .26) - (marca ? .03 : 0) - Math.min(.04, turvo * .01));
    let segura = false, Lz = .1, vel = 0, t = 0, dentro = 0, flares = 0, alto = 0, vida = 0, mostradas = 0, fim = false, last = performance.now();
    let bpmR = 148, bpmL = 46, proxR = 0, proxL = .4, pulso = 0;
    const centro = (tt) => {
      if (!dois) return .52 + Math.sin(tt * .8) * .13 + Math.sin(tt * .31) * .05;
      // dois corações: a faixa sobe e desce puxada pelos dois ritmos
      return .62 + Math.sin(tt * 1.15) * .1 + Math.sin(tt * .47 + 1) * .08;
    };
    const down = (e) => { if (e) e.preventDefault(); segura = true; root.classList.add('segura'); };
    const up = () => { segura = false; root.classList.remove('segura'); };
    root.addEventListener('pointerdown', down); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    const kd = (e) => { if (e.code === 'Space') { e.preventDefault(); down(); } }, ku = (e) => { if (e.code === 'Space') up(); };
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    const limpa = () => { removeEventListener('pointerup', up); removeEventListener('pointercancel', up); removeEventListener('keydown', kd); removeEventListener('keyup', ku); };
    const linha = () => {
      if (mostradas >= cfg.linhas.length) return;
      const p = document.createElement('p'); p.textContent = tr(cfg.linhas[mostradas]); p.style.setProperty('--i', mostradas); linhas.appendChild(p); mostradas++;
      if (linhas.children.length > 4) linhas.firstElementChild.classList.add('vai');
      setTimeout(() => { const f = linhas.querySelector('.vai'); f && f.remove(); }, 1500);
    };
    const loop = (now) => {
      if (fim) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
      // a luz: segurar sobe, soltar cai; o vinho faz a mão tremer
      const acel = segura ? 1.7 : -1.45;
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
      document.documentElement.style.setProperty('--luzParto', Lz.toFixed(3));
      // os corações
      if (t >= proxR) { proxR = t + 60 / bpmR; A.sfx('coracao-rapido', .45, () => A.batida(.35, false)); root.querySelector('.pt-c.rapido').classList.remove('bate'); void root.offsetWidth; root.querySelector('.pt-c.rapido').classList.add('bate'); }
      if (dois && t >= proxL) { bpmL = Math.max(26, 46 - t * .6); proxL = t + 60 / bpmL; A.sfx('coracao-lento', clamp(.5 - t / DUR * .35, .1, .5), () => A.batida(clamp(.6 - t / DUR * .5, .1, .6), true)); const l = root.querySelector('.pt-c.lento'); l.classList.remove('bate'); void l.offsetWidth; l.classList.add('bate'); l.style.opacity = clamp(1 - t / DUR, .25, 1); }
      if (vida >= (mostradas + 1) / (cfg.linhas.length + 1)) linha();
      if (t >= DUR) return termina();
      requestAnimationFrame(loop);
    };
    const termina = () => {
      fim = true; limpa(); up();
      while (mostradas < cfg.linhas.length) linha();
      const fr = clamp(dentro / DUR, 0, 1);
      c.mudaLuz((dois ? 30 : 20));
      root.classList.add('final');
      c.registrar('parto', dois ? 'dois' : 'crianca');
      setTimeout(() => resolve({ dentro: fr, flares, vida }), BOT() ? 200 : 2600);
    };
    requestAnimationFrame((n) => { last = n; requestAnimationFrame(loop); });
  });
}

// ================================================================== RASTRO
function rastro(root, c) {
  const { tr, A, st, L } = c, cfg = L.rastro;
  return new Promise((resolve) => {
    root.classList.add('explorar');
    const { caixa } = palco(root, 'assets/images/mapa-rastro.jpg', 1920 / 1080);
    caixa.insertAdjacentHTML('beforeend', `<svg class="rt-svg" viewBox="0 0 100 56.25" preserveAspectRatio="none"><polyline class="rt-linha" points=""/></svg><div class="rt-pira" style="left:${cfg.pira.x}%;top:${cfg.pira.y}%"></div><div class="rt-alcance"></div>`);
    root.insertAdjacentHTML('beforeend', `<div class="rt-hud"><p class="rt-dist"></p><p class="rt-msg"></p><div class="rt-bts"><button class="ghost rt-cantar">♪ ${c.esc(tr(cfg.cantarT))}</button><button class="cta rt-ir" disabled>${c.esc(tr(cfg.irT))}</button></div></div>`);
    const $ = (s) => root.querySelector(s), linhaEl = $('.rt-linha'), alcance = $('.rt-alcance'), distEl = $('.rt-dist'), msg = $('.rt-msg'), ir = $('.rt-ir'), cantarB = $('.rt-cantar');
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
    caixa.addEventListener('click', (e) => {
      if (fim) return;
      const r = caixa.getBoundingClientRect(), p = { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 };
      if (p.x < 2 || p.x > 98 || p.y < 3 || p.y > 97) return;
      if (d(p, ultima()) > alc()) { msg.textContent = tr(cfg.alcanceT); alcance.classList.remove('nao'); void alcance.offsetWidth; alcance.classList.add('nao'); return; }
      luzes.push(p);
      const f = document.createElement('div'); f.className = 'rt-farol' + (cantando ? ' canto' : ''); f.style.left = p.x + '%'; f.style.top = p.y + '%'; caixa.appendChild(f);
      c.mudaLuz(cantando ? 4 : 3); A.sfx('farol', .55, () => { A.tone(700, .8, 'sine', .05, 0, 1.3); A.tone(1050, 1, 'sine', .03, .08); });
      desenha();
    });
    cantarB.onclick = () => {
      if (cantando) return; cantando = true; cantou = true; cantarB.classList.add('on'); root.classList.add('canta');
      A.once('assets/audio/hino/louvor.mp3', .9).then((dur) => setTimeout(() => { cantando = false; cantarB.classList.remove('on'); root.classList.remove('canta'); desenha(); }, ((dur || 14) + .5) * 1000));
      st.tom.ternura = (st.tom.ternura || 0) + 1; desenha();
    };
    ir.onclick = () => {
      if (fim) return; fim = true;
      const dist = Math.round(d(ultima(), cfg.pira));
      c.registrar('rastro', String(Math.min(99, dist)));
      root.classList.add('sai');
      setTimeout(() => resolve({ distancia: dist, luzes: luzes.length - 1, cantou }), BOT() ? 100 : 1400);
    };
    let last = performance.now();
    const passo = setInterval(() => { if (!fim && A.ctx && A.on) A.sfx('compasso-tres', .25, () => A.hiss(.12, 220, .8, .06, 0, 'lowpass')); }, 900);
    const loop = (now) => {
      if (fim) { clearInterval(passo); return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const alvo = luzes.length > 1 ? ultima() : cfg.pira;
      const vel = (luzes.length > 1 ? (cantou ? 4.6 : 3.8) : 1.6) * (BOT() ? 4 : 1);
      tacets.forEach((tc, k) => {
        const ax = alvo.x + (k - 1) * 2, ay = alvo.y + (k % 2) * 2, dx = ax - tc.x, dy = (ay - tc.y) * AR, dd = Math.hypot(dx, dy);
        if (dd > .8) { tc.x += dx / dd * vel * dt; tc.y += (dy / dd) * vel * dt / AR; }
        tc.el.style.left = tc.x + '%'; tc.el.style.top = tc.y + '%';
      });
      if (!quebrou && luzes.length > 1) { quebrou = true; root.classList.add('quatro'); const m = document.createElement('p'); m.className = 'rt-quatro'; m.textContent = tr(cfg.quatroT); root.appendChild(m); setTimeout(() => m.remove(), 4200); A.once('assets/audio/tacet_passos.mp3', .45); }
      requestAnimationFrame(loop);
    };
    desenha(); requestAnimationFrame(loop);
    if (BOT()) { let k = 0; const pts = [[64, 58], [52, 48], [40, 40], [28, 34], [16, 30], [8, 22]]; const tk = setInterval(() => { const r = caixa.getBoundingClientRect(); const [x, y] = pts[k++]; caixa.dispatchEvent(new MouseEvent('click', { clientX: r.left + x / 100 * r.width, clientY: r.top + y / 100 * r.height, bubbles: true })); if (k >= pts.length) { clearInterval(tk); setTimeout(() => ir.click(), 300); } }, 250); }
  });
}

window.JOGOS5 = { ressaca, laje, troca, minutos, parto, rastro };
})();
