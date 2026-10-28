/* ==========================================================================
   AS QUATRO VONTADES · CAPÍTULO V · AHERYN — O DIA COMIDO (roteiro interativo)
   --------------------------------------------------------------------------
   Cada texto vem em par: T('português', 'english'). O inglês é o original do
   jogo; o português é a tradução. O PT é a chave; mudou um, mude o outro.
   Aheryn narra no PRETÉRITO (único POV assim). Travessão só em diálogo.
   Grakh falam no infinitivo, em caixa normal (o CAPS é dos Aug). Hessa fala
   a língua inteira com Aheryn (foi cativa dos Queimados) e o infinitivo com
   os Grakh: isso se mostra, não se explica.
   Linha do tempo: Dia 1 = Partes I (a Laje, a troca, a noite). Dia 2 = Partes
   II a V (as Goelas, o eclipse de dia, o parto à tarde, a partida à noite).
   30 anos depois do Cap. I; cerca de um ano antes do Torneio do Cap. IV.
   Estado do Cap. I: st.c1 (copiado de aqv_estado.cap1 em inicio()).
   ========================================================================== */
window.LIVRO_EN = window.LIVRO_EN || {};
const T = (pt, en) => { if (en != null) window.LIVRO_EN[pt] = en; return pt; };
const se = (cond, t) => ({ se: cond, t });
const IMG = (n) => 'assets/images/' + n + '.jpg';
const VID = (n) => 'assets/video/' + n + '.mp4';
const CLIP = (n) => 'assets/clip/' + n + '.mp4';

// ---------------------------------------------------------------- os três Aheryns (a mesma régua do Cap. I)
window.quieto = (st) => st.luz <= 30;
window.medido = (st) => st.luz > 30 && st.luz < 60;
window.aceso = (st) => st.luz >= 60;
const quieto = window.quieto, medido = window.medido, aceso = window.aceso;

// ---------------------------------------------------------------- o que veio do Cap. I
const c1 = (st) => st.c1 || {};
const temPedra = (st) => !!c1(st).pedra;
const temDiario = (st) => !!c1(st).diario;
const marcado = (st) => !!c1(st).marcado;
const tocouProibido = (st) => !!(c1(st).escolhas && c1(st).escolhas.proibido === 'tocar');
const armadilha = (st) => (c1(st).escolhas && c1(st).escolhas.armadilha) || null;
const esc1 = (st, k) => (c1(st).escolhas || {})[k] || null;
// o que o mundo sabe do Aheryn depois do Cap. I: a MESMA regra do Cap. II (aula de história)
//   relato = lutou e matou com Luz ≥ 45 · taverna = ergueu o gelo · boato = Luz final ≥ 60 · extintos = o resto
const mundo = (st) => { const k = c1(st); if (!k.veio) return 'extintos'; if (k.cacadores === 'lutar' && (k.luz || 0) >= 45) return 'relato'; if (k.cacadores === 'gelo') return 'taverna'; if ((k.luz || 0) >= 60) return 'boato'; return 'extintos'; };
// o Aheryn que o jogador fez no Cap. I (sem o Cap. I, o medido)
const persona1 = (st) => { const k = c1(st); if (!k.veio) return 'medido'; return k.luz <= 30 ? 'quieto' : k.luz < 60 ? 'medido' : 'aceso'; };
const matou = (st) => c1(st).cacadores === 'lutar';
const olhouBesta = (st) => esc1(st, 'olharCacadores') === 'besta';
const deuComida = (st) => c1(st).cacadores === 'fome';
const afogou = (st, id) => (c1(st).afogados || []).includes(id);
// o pensamento que o jogador se recusou a afogar no Cap. I (o texto exato dos goles)
const GOLES1 = {
  'O século passado.': 'The last century.', 'Quando os Lúmae existiam.': 'When the Lúmae still existed.', 'Quando eu era o herói do meu povo.': 'When I was my people’s hero.',
  'Todas as magias que sei lançar.': 'Every spell I know I can cast.', 'O olhar dela, hoje, sobre a montanha.': 'Her gaze, today, over the mountain.', 'Um dragão triste, a oeste.': 'A sad dragon, to the west.',
  'O ombro que ainda dói.': 'The shoulder that still hurts.', 'O gigante que eu não fui ver.': 'The giant I did not go to see.', 'O sangue de Gromm no chão.': 'Gromm’s blood on the ground.', 'O homem da besta, caindo de costas.': 'The man with the crossbow, falling backwards.',
};
Object.entries(GOLES1).forEach(([pt, en]) => T(pt, en));
const guardado1 = (st) => (c1(st).guardados || []).find((g) => g !== 'O homem da besta, caindo de costas.') || null;
const nomePedra = {
  valer: [T('a Pedra da Borda', 'the Edge Stone'), T('A Pedra da Borda', 'The Edge Stone')],
  gelunah: [T('o Olho de Gelunah', 'Gelunah’s Eye'), T('O Olho de Gelunah', 'Gelunah’s Eye')],
  misterio: [T('a pedra', 'the stone'), T('A pedra', 'The stone')],
  cor: [T('a pedra azul', 'the blue stone'), T('A pedra azul', 'The blue stone')],
};
// ---------------------------------------------------------------- atalhos de estado
const sobrio = (st) => (st.turvo || 0) <= 2;
const tukkTrocou = (st) => !!(st.jogos.troca && st.jogos.troca.ok && st.jogos.troca.ok.tukk);
const parto = (st) => st.escolhas.proibido5 || 'crianca';
const fezMinuto = (st, a) => !!(st.jogos.minutos && st.jogos.minutos.feitas && st.jogos.minutos.feitas.includes(a));

// ---------------------------------------------------------------- o alforje: o que a bancada da Laje faz e o que o capítulo gasta
//   prontos: cada pote/frasco/bolsa feito, com a qualidade (bom · medio · ruim)
//   ingr: o que ainda há para preparar (argila e cinza nunca acabam)
//   Gastos: tintura (Shaa, a07 · o parto, d05) · antídoto, unguento e pó (a troca, b01t) · pó (os cavalos, c01)
//   · unguento (Tukk e o braço de Hessa, c04; o braço ainda na roda, d02). Numa run perfeita não sobra nada e ninguém fica sem:
//   resina 3, raiz 4 (com a do Ghru), seiva 2, flor 1, creosoto 2, ferrão 1 → 3 unguentos, 1 tintura (+ a velha), 1 antídoto, 2 pós.
const novoAlforje = () => ({ seq: 1, prontos: [{ uid: 'u0', id: 'tintura', q: 'medio', velho: true }], ingr: { resina: 2, raiz: 2, flor: 1, seiva: 1, creosoto: 1, ferrao: 0 }, feitos: [] });
const alf = (st) => (st.alforje = st.alforje || novoAlforje());
const temPronto = (st, id) => alf(st).prontos.some((x) => x.id === id);
const QORD = { ruim: 0, medio: 1, bom: 2 };
// gasta primeiro o pior (o melhor fica para depois)
// quando a qualidade muda o resultado (pó no eclipse, graxa nos feridos, tintura no parto), gasta o melhor
const usaMelhor = (st, id) => { const a = alf(st); let k = -1; a.prontos.forEach((x, i) => { if (x.id === id && (k < 0 || QORD[x.q] > QORD[a.prontos[k].q])) k = i; }); return k >= 0 ? a.prontos.splice(k, 1)[0] : null; };
const quantos = (st, id) => alf(st).prontos.filter((x) => x.id === id).length;
// Hessa em cinco faixas: a soma de tudo o que ela viu e recebeu
const hessaFaixa = (st) => { const h = st.hessa || 0; return h <= -2 ? 'hostil' : h === -1 ? 'fria' : h === 0 ? 'neutra' : h === 1 ? 'respeito' : 'confianca'; };
const hessaBem = (st) => ['respeito', 'confianca'].includes(hessaFaixa(st));
// Tukk: inteiro (arrastado e tratado), sem o braço (arrastado, sem graxa boa), morto (ficou na linha)
// Shaa salva ('os dois'): quanto Aheryn ajudou os outros antes da roda, de 0 a 9.
//   Shaa: o dente (aceitar ou dar de presente), a luz mostrada (pouca 2, média 1, muita 0; recusar tira 1), junto dela no eclipse (de 0 a 3) · Hessa: confiança 2, respeito 1
//   tintura no parto: bem feita 2, média ou mal feita 1 · as três trocas fechadas: 1 · Tukk arrastado da linha: 1
const preparoDois = (st) => {
  const ok = Object.values((st.jogos.troca || {}).ok || {}).filter(Boolean).length;
  const shaaPts = (['aceitar', 'presente'].includes(st.escolhas.dente) ? 1 : 0) + ({ baixa: 2, media: 1, alta: 0 }[st.f.luzShaa] || (st.f.mostrou_luz && !st.f.luzShaa ? 1 : 0)) + (st.f.junto_shaa ? 1 : 0) - (st.escolhas.verLuz === 'recusa' ? 1 : 0);
  return Math.max(0, Math.min(3, shaaPts))
    + ({ confianca: 2, respeito: 1 }[hessaFaixa(st)] || 0) + ({ bom: 2, medio: 1, ruim: 1 }[st.f.tinturaParto] || 0)
    + (ok >= 3 ? 1 : 0) + (st.f.salvou_tukk ? 1 : 0);
};
const nivelDois = (st) => window.LIVRO.parto.dois.find((n) => preparoDois(st) >= n.min);
const shaaViva = (st) => parto(st) === 'dois' && !!st.f.shaa_viva;
// o vinho passa com o tempo: cada virada que o texto marca (a batalha, o fim do eclipse, a roda) tira 1 do turvo
const passaTempo = (k) => (st) => { if (st.f['_tempo_' + k]) return; st.f['_tempo_' + k] = true; st.turvo = Math.max(0, (st.turvo || 0) - 1); };
const tukkFim = (st) => (!st.f.salvou_tukk ? 'morto' : st.f.tukk || 'sem_braco');
const usaPronto = (st, id) => { const a = alf(st); let k = -1; a.prontos.forEach((x, i) => { if (x.id === id && (k < 0 || QORD[x.q] < QORD[a.prontos[k].q])) k = i; }); return k >= 0 ? a.prontos.splice(k, 1)[0] : null; };

// a roda diz o nome: as quatro gravações sobrepostas, de dentro para fora, e o nome
// aparecendo pela tela como eco (cada voz é um Grakh diferente na roda)
const rodaDizONome = (A) => {
  const vozes = ['roda-nome1', 'roda-nome3', 'roda-nome2', 'roda-nome4', 'roda-nome1', 'roda-nome4'];
  const quando = [0, 380, 820, 1150, 1900, 2300], vol = [.62, .5, .52, .44, .3, .26];
  vozes.forEach((n, i) => setTimeout(() => A.sfx(n, vol[i], () => { if (!i) { A.tone(98, 1.4, 'sawtooth', .03, 0, .9); A.hiss(1.2, 300, .6, .06, .1, 'lowpass'); } }), quando[i]));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 11; i++) setTimeout(() => {
    const e = document.createElement('span'); e.className = 'eco'; e.textContent = 'Kronk';
    const ang = Math.random() * 6.283, r = 18 + i * 3.4 + Math.random() * 6;
    e.style.left = (50 + Math.cos(ang) * r * 1.2) + '%'; e.style.top = (46 + Math.sin(ang) * r * .8) + '%';
    e.style.fontSize = (34 - i * 1.6) + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 3600);
  }, i * 260);
};

// o fecho da Laje, pelo Aheryn do momento
const fechoLaje = (st) => (st.luz <= 30 ? T('Contei. Estava tudo lá, menos a água. Peguei o odre vazio e desci.', 'I counted. Everything was there, except the water. I took the empty skin and went down.')
  : st.luz < 60 ? T('Contei devagar. Contar é o que sobra quando não há mais nada em que pensar. Estava tudo onde eu tinha deixado, menos a água. Peguei o odre vazio e desci.', 'I counted slowly. Counting is what is left when there is nothing else to think about. Everything was where I had left it, except the water. I took the empty skin and went down.')
    : T('Os Lúmae mediam o tempo pelas estrelas. Eu meço pelo que falta, e naquela manhã faltava água. Peguei o odre vazio e desci.', 'The Lúmae measured time by the stars. I measure it by what is missing, and that morning it was water. I took the empty skin and went down.'));

// a noite sem lua (a10): o que o chão diz a quem está sóbrio
const MARCHA_NAO = T('O chão talvez estivesse tentando me dizer alguma coisa. Àquela hora eu não estava recebendo recados.', 'The ground may have been trying to tell me something. At that hour I was not taking messages.');
const marcha = (st) => ((st.turvo || 0) > 2 ? [MARCHA_NAO]
  : [T('Por baixo dos tambores, através da pedra e para dentro da sola dos meus pés, veio outra coisa: muitos pés, longe, a leste, batendo no chão ao mesmo tempo. Os Grakh não marcham em passo. Nada vivo marcha em passo a não ser que alguém esteja gritando com ele.', 'Under the drums, through the rock and into the soles of my feet, came something else: many feet, far to the east, striking the ground at the same time. The Grakh do not walk in step. Nothing alive walks in step unless someone is shouting at it.'),
    c1(st).leu_tacets ? T('Contei, por hábito, esperando o três. Não era três. Eram mil homens fingindo ser um.', 'I counted, out of habit, waiting for the three. It was not three. It was a thousand men pretending to be one.') : null].filter(Boolean));

window.LIVRO_UI = {
  pt: { regioes: ['nada', 'dedos', 'pulsos', 'pescoço', 'peito', 'rosto'], travaQuieta: 'A cabeça está quieta demais para isso.', travaAcesa: 'A luz não deixa calar.', acenderA: 'Acender',
    persona: { quieto: 'O Aheryn que você fez: quieto. Trinta anos de vinho, e ainda assim a noite o acendeu.', medido: 'O Aheryn que você fez: medido. Pensou só o que podia pagar, e pagou.', aceso: 'O Aheryn que você fez: aceso. Pensou tudo o que um Lúmae pensa, e brilhou por isso.' },
    parte: 'Parte', prologo: 'Trinta anos', prox: 'Próxima', fim: 'Encerrar o capítulo', voltar: '← Voltar', ouvir: 'Ouvir Aheryn', cena: '▶ Ver a cena', oque: 'O que Aheryn faz?', escolheu: 'Você escolheu:', resp: 'Responder a', silencio: 'não dizer nada', silencioR: 'Silêncio', momento: 'Momento de jogo',
    luz: 'Luz', luzTitle: 'A Luz do Aheryn: sobe quando ele pensa, sente e lembra; desce quando ele bebe e se cala',
    cantilBeber: 'Beber um gole (tecla B): a Luz desce, o mundo turva', cantilAqui: 'Aqui não é hora de beber', cantilVazio: 'O odre está vazio',
    mg: { ressaca: 'O que o sol traz de volta', laje: 'Conferir a Laje', troca: 'Coisa por coisa', bancada: 'A bancada', minutos: 'Os minutos', parto: 'Um pensamento a mais', rastro: 'O rastro' },
    // os três verbos do jogo: Pensamento (segurar acende), Olhar (tocar no que brilha) e o momento único do capítulo
    verbo: { pensamento: 'Pensamento', olhar: 'Olhar', unico: 'Momento único' },
    verboDe: { ressaca: 'pensamento', parto: 'pensamento', rastro: 'pensamento', laje: 'olhar', troca: 'olhar', bancada: 'olhar', minutos: 'unico' },
    dica: {
      ressaca: 'Os pensamentos sobem da areia, um de cada vez. Segure para deixar um subir até o alto: Aheryn lembra. Solte, e a areia o cobre.',
      laje: 'Toque em cada coisa debaixo da Laje antes de descer.',
      troca: 'Toque no que brilha para ler o corpo do Grakh. Depois ponha no couro o que ele precisa. Bem feito, basta; se não for, ele vai querer mais alguma coisa junto. Tocar no que está no couro traz de volta.',
      bancada: (st) => 'Leia a receita no couro e feche-o: o couro cobre a bancada. Depois faça de memória: toque num ingrediente e no pilão ou no pote, segure o pilão para moer e o pote para mexer, toque na brasa para pôr e tirar do fogo. Olhe o pilão e o pote: a receita diz até onde moer e esquentar. A ordem é sua.' + ((st.turvo || 0) >= 2 ? ' O vinho vai embaralhar o couro.' : ''),
      minutos: 'O anel é o sol voltando. Cada ação gasta tempo. Não vai dar para tudo. Quem ouve antes, pisa melhor.',
      parto: (st) => 'Segure para pensar: a luz sobe. Solte: ela cai. Mantenha dentro da faixa dourada.' + ((st.turvo || 0) >= 2 ? ' O vinho vai fazer a mão tremer.' : '') + (parto(st) === 'dois' ? (nivelDois(st).runas ? ' As dores dela aparecem com uma letra: aperte a letra, ou toque nela, sem largar a luz.' : '') + ' Com os dois, a barra de baixo é o coração de Shaa: ele cai sozinho, e só a luz dentro da faixa o sustenta.' : window.LIVRO.parto.preparo(st) < 5 ? ' As dores dela aparecem com uma letra: aperte a letra, ou toque nela, sem largar a luz.' : ''),
      rastro: 'É um tabuleiro. Na sua vez, toque numa casa vizinha para andar, ou numa a duas casas para correr, que gasta Luz, ou espere. Depois cada Tacet anda uma casa na sua direção, e a seta mostra para onde. Eles só veem você a até quatro casas; mais longe, descem para a Pira. Se um entrar na sua casa, ou chegar à Pira, você perde. Cantar, uma vez só: nesta vez e na seguinte, os três ouvem você de onde estiverem. Leve os três até a areia aberta.',
    },
    // a instrução no centro da tela, na primeira vez de cada jogo
    gesto: { ressaca: 'Segure para lembrar', parto: 'Segure para pensar', rastro: 'Toque numa casa para andar', laje: 'Toque no que brilha', troca: 'Toque no que brilha', bancada: 'Leia, depois faça', minutos: 'Cada ação gasta sol' },
    gestoSub: { ressaca: 'solte, e a areia cobre', parto: (st) => 'mantenha a luz na faixa' + ((parto(st) === 'dois' ? nivelDois(st).runas : window.LIVRO.parto.preparo(st) < 5) ? ' e aperte as letras que aparecerem' : ''), rastro: 'eles andam depois de você', laje: 'cada coisa conta uma história', troca: 'leia o corpo, depois a mão', bancada: 'o couro cobre a bancada', minutos: 'não vai dar para tudo' },
    teclaSeg: 'ou segure espaço', comecar: 'Toque para começar',
    abBeber: 'Beba', abBeberSub: 'toque no odre ou aperte B', abLuzC1: 'A Luz com que Aheryn deixou a Borda do Mundo', abLuz: 'A Luz de Aheryn',
    odreTut: 'O odre', odreTutSub: 'aqui dá para beber · B',
    coverEye: 'As Quatro Vontades · Livro I · Capítulo V', coverLede: 'Trinta anos na areia sem fazer um som. Hoje o dia escurece.', coverGo: 'Entrar no deserto', coverCont: 'Continuar de onde parei', coverRestart: 'Começar do início', coverHint: 'Use fones. Avance com o botão, com a seta → ou deslizando para o lado.',
    confirm: 'Recomeçar o capítulo? Suas escolhas serão apagadas.', capN: 'Capítulo V', fimCap: 'Fim do Capítulo V', ficou: 'O que o escuro deixou', suas: 'O que você escolheu', reler: 'Reler e escolher diferente', mesmo: (p) => `${p}% dos leitores fizeram o mesmo`,
    perfilT: 'O Aheryn que você moldou',
    pontos: 'Pontuação do capítulo', jornada: 'Jornada (Capítulos I a V)', posicao: (p, n) => `${p}º de ${n} leitores`, semCap1: 'Jogue os capítulos anteriores neste navegador para somar a jornada.',
    pts: { bancada: 'A bancada', troca: 'A troca', minutos: 'Os minutos', parto: 'O parto', rastro: 'O rastro', antes: 'Capítulos I a IV' },
  },
  en: { regioes: ['nothing', 'fingertips', 'wrists', 'neck', 'chest', 'face'], travaQuieta: 'My head is too quiet for that.', travaAcesa: 'The light won’t let me be silent.', acenderA: 'Light it',
    persona: { quieto: 'The Aheryn you made: quiet. Thirty years of wine, and still the night lit him.', medido: 'The Aheryn you made: measured. He thought only what he could pay for, and he paid.', aceso: 'The Aheryn you made: lit. He thought everything a Lúmae thinks, and shone for it.' },
    parte: 'Part', prologo: 'Thirty years', prox: 'Next', fim: 'Close the chapter', voltar: '← Back', ouvir: 'Listen to Aheryn', cena: '▶ Watch the scene', oque: 'What does Aheryn do?', escolheu: 'You chose:', resp: 'Answer', silencio: 'say nothing', silencioR: 'Silence', momento: 'Moment of play',
    luz: 'Light', luzTitle: 'Aheryn’s Light: it rises when he thinks, feels and remembers; it falls when he drinks and goes silent',
    cantilBeber: 'Take a swallow (B key): the Light falls, the world blurs', cantilAqui: 'This is no time to drink', cantilVazio: 'The skin is empty',
    mg: { ressaca: 'What the sun brings back', laje: 'Check the slab', troca: 'Thing for thing', bancada: 'The bench', minutos: 'The minutes', parto: 'One thought more', rastro: 'The trail' },
    verbo: { pensamento: 'Thought', olhar: 'Look', unico: 'One of a kind' },
    verboDe: { ressaca: 'pensamento', parto: 'pensamento', rastro: 'pensamento', laje: 'olhar', troca: 'olhar', bancada: 'olhar', minutos: 'unico' },
    dica: {
      ressaca: 'Thoughts rise from the sand, one at a time. Hold to let one rise to the top: Aheryn remembers. Let go, and the sand covers it.',
      laje: 'Touch everything under the slab before going down.',
      troca: 'Touch what glows to read the Grakh’s body. Then put on the hide what he needs. Well made, it is enough; if not, he will want something more on top. Touch what is on the hide to take it back.',
      bancada: (st) => 'Read the recipe on the hide and close it: the hide covers the bench. Then make it from memory: touch an ingredient and then the mortar or the pot, hold the mortar to grind and the pot to stir, touch the embers to put on and take off the fire. Watch the mortar and the pot: the recipe says how far to grind and to heat. The order is up to you.' + ((st.turvo || 0) >= 2 ? ' The wine will scramble the hide.' : ''),
      minutos: 'The ring is the sun coming back. Every action costs time. You will not have enough. Whoever listens first steps better.',
      parto: (st) => 'Hold to think: the light rises. Let go: it falls. Keep it inside the golden band.' + ((st.turvo || 0) >= 2 ? ' The wine will make the hand shake.' : '') + (parto(st) === 'dois' ? (nivelDois(st).runas ? ' Her pains appear with a letter: press it, or tap it, without letting go of the light.' : '') + ' With both, the lower bar is Shaa’s heart: it falls on its own, and only the light inside the band holds it up.' : window.LIVRO.parto.preparo(st) < 5 ? ' Her pains appear with a letter: press it, or tap it, without letting go of the light.' : ''),
      rastro: 'It is a board. On your turn, touch a neighbouring space to walk, or one two spaces away to run, which costs Light, or wait. Then each Tacet moves one space toward you, and the arrow shows where. They only see you up to four spaces away; farther than that, they go down to the Pyre. If one enters your space, or reaches the Pyre, you lose. Sing, only once: this turn and the next, all three hear you wherever they are. Lead all three to the open sand.',
    },
    gesto: { ressaca: 'Hold to remember', parto: 'Hold to think', rastro: 'Touch a space to walk', laje: 'Touch what glows', troca: 'Touch what glows', bancada: 'Read, then make', minutos: 'Every action spends sun' },
    gestoSub: { ressaca: 'let go, and the sand covers it', parto: (st) => 'keep the light in the band' + ((parto(st) === 'dois' ? nivelDois(st).runas : window.LIVRO.parto.preparo(st) < 5) ? ' and press the letters that appear' : ''), rastro: 'they move after you', laje: 'every thing tells a story', troca: 'read the body, then the hand', bancada: 'the hide covers the bench', minutos: 'you will not have enough' },
    teclaSeg: 'or hold space', comecar: 'Tap to begin',
    abBeber: 'Drink', abBeberSub: 'tap the skin or press B', abLuzC1: 'The Light Aheryn carried away from the Edge of the World', abLuz: 'Aheryn’s Light',
    odreTut: 'The skin', odreTutSub: 'you can drink here · B',
    coverEye: 'The Four Wills · Book I · Chapter V', coverLede: 'Thirty years in the sand without making a sound. Today the day goes dark.', coverGo: 'Walk into the desert', coverCont: 'Continue where I left off', coverRestart: 'Start from the beginning', coverHint: 'Wear headphones. Move on with the button, the → key, or a swipe.',
    confirm: 'Restart the chapter? Your choices will be erased.', capN: 'Chapter V', fimCap: 'End of Chapter V', ficou: 'What the dark left', suas: 'What you chose', reler: 'Read again and choose differently', mesmo: (p) => `${p}% of readers did the same`,
    perfilT: 'The Aheryn you shaped',
    pontos: 'Chapter score', jornada: 'Journey (Chapters I to V)', posicao: (p, n) => `#${p} of ${n} readers`, semCap1: 'Play the earlier chapters in this browser to add up the journey.',
    pts: { bancada: 'The bench', troca: 'The trade', minutos: 'The minutes', parto: 'The birth', rastro: 'The trail', antes: 'Chapters I to IV' },
  },
};

window.LIVRO = {
  id: 'cap05',
  chaveEstado: 'cap5',
  titulo: 'Aheryn',
  subtitulo: 'O Dia Comido',
  intertitulo: T('Trinta anos depois de Aheryn deixar a Borda do Mundo.', 'Thirty years after Aheryn left the Edge of the World.'),
  subtituloEn: 'The Eaten Day',
  tituloPag: 'Aheryn, o Dia Comido · As Quatro Vontades',
  tituloPagEn: 'Aheryn, the Eaten Day · The Four Wills',
  capa: IMG('capa'),
  luzInicial: 10,
  cantil: 6,
  alforje: alf,
  proximo: { titulo: 'Um ano depois · Capítulo IV, Laus', tituloEn: 'A year later · Chapter IV, Laus', url: 'https://marcelomartinsjorge.github.io/the4willschapter4V2/' },

  // o Cap. I: o que o leitor deixou na Borda do Mundo (copiado uma vez, no início)
  inicio: (st) => {
    let a = {}; try { a = JSON.parse(localStorage.getItem('aqv_estado') || '{}') || {}; } catch (e) {}
    const k = a.cap1 || null;
    let guardados = []; try { const s1 = JSON.parse(localStorage.getItem('livro_cap01') || 'null'); guardados = (s1 && s1.guardados) || []; } catch (e) {}
    st.c1 = k ? Object.assign({}, k, { aug: k.aug || 0, gelunah: k.gelunah || 0, marcado: !!k.marcado, leu_tacets: !!k.leu_tacets, diario: !!k.diario, pedra: k.pedra || null, escolhas: k.escolhas || {}, afogados: k.afogados || [], cacadores: k.cacadores || (k.escolhas && k.escolhas.cacadores) || null, guardados, veio: true }) : { luz: 20, veio: false, escolhas: {} };
    // a abertura começa com a Luz que o leitor tinha no fim do Cap. I e a derruba, gole a gole, até 10
    st.luz = k && Number.isFinite(k.luz) ? Math.max(24, Math.min(100, Math.round(k.luz))) : 40;
    st.alforje = novoAlforje();
  },

  // as zonas de som (os arquivos chegam depois; até lá, vento ou zumbido sintetizados)
  zonas: {
    laje: { src: 'assets/audio/laje-dia-loop.mp3', volume: .5, reserva: 'vento' },
    noite: { src: 'assets/audio/laje-noite-loop.mp3', volume: .5, reserva: 'vento' },
    acampamento: { src: 'assets/audio/acampamento-loop.mp3', volume: .5, reserva: 'vento' },
    goelas: { src: 'assets/audio/goelas-loop.mp3', volume: .5, reserva: 'vento' },
    batalha: { src: 'assets/audio/batalha-loop.mp3', volume: .55, reserva: 'vento' },
    eclipse: { src: 'assets/audio/eclipse-loop.mp3', volume: .55, reserva: 'zumbido' },
    roda: { src: 'assets/audio/roda-loop.mp3', volume: .45, reserva: 'zumbido' },
    deserto: { src: 'assets/audio/deserto-noite-loop.mp3', volume: .5, reserva: 'vento' },
  },

  // cada gole do odre, em qualquer página onde se pode beber
  linhasGole: [
    T('Bebi.', 'I drank.'),
    T('Bebi de novo, e o mundo amoleceu um pouco nas bordas.', 'I drank again, and the world went a little softer at the edges.'),
    T('Mais um. O pensamento que eu estava tendo perdeu o fio, e a ideia era essa.', 'Another. The thought I was having lost its thread, which was the idea.'),
    T('Mais um. Minha mão conhecia o caminho até a boca melhor do que eu.', 'Another. My hand knew the way to my mouth better than I did.'),
    T('Mais um. Em algum lugar de mim, uma coisa que antes era esperta se sentou.', 'Another. Somewhere in me, something that used to be clever sat down.'),
    T('O último. O odre ficou vazio, e eu também, por enquanto.', 'The last. The skin was empty, and so, for the moment, was I.'),
  ],

  // ---------------------------------------------------------------- configuração dos jogos
  ressaca: {
    // cada pensamento: rótulo (o que flutua) e lembrança (o que fica escrito se ele chegar ao alto)
    pensamentos: (st) => [
      { id: 'hessa', rotulo: T('Uma pedra, atirada por uma criança.', 'A stone, thrown by a child.'),
        texto: T('Hessa era criança na primeira vez que atirou uma pedra em mim. Acertou o joelho. Hoje acertaria a cabeça, e ela sabe disso.', 'Hessa was a child the first time she threw a stone at me. It hit my knee. Today it would hit my head, and she knows it.') },
      { id: 'vinho', rotulo: T('O primeiro vinho de cacto.', 'The first cactus wine.'),
        texto: T('Meu primeiro vinho de cacto tinha gosto de vinagre onde um lagarto morreu. Bebi tudo, e no dia seguinte fiz mais.', 'My first cactus wine tasted like vinegar a lizard had died in. I drank all of it, and the next day I made more.') },
      { id: 'tempestade', rotulo: T('O cheiro de uma tempestade.', 'The smell of a storm.'),
        texto: T('Uma vez senti o cheiro de uma tempestade de areia um dia antes de ela chegar, e guardei para mim. Se soubessem que eu sinto o tempo chegar, viriam me perguntar dele toda semana.', 'Once I smelled a sandstorm a day before it came, and kept it to myself. If they knew I can smell weather coming, they would be at my stone every week asking about it.') },
      { id: 'chuva', rotulo: T('Chuva, uma vez.', 'Rain, once.'),
        texto: T('Choveu uma vez, no décimo primeiro ano. Fiquei debaixo dela feito um tolo, e a luz subiu por baixo da pele, e eu deixei, porque não havia quem visse além da chuva.', 'It rained once, in the eleventh year. I stood in it like a fool, and the light came up under my skin, and I let it, because there was no one to see but the rain.') },
      { id: 'menina', rotulo: T('Uma menina com febre.', 'A girl with a fever.'),
        texto: T('Uma menina Grakh, com uma febre que eu podia ter quebrado com um único pensamento. Dei à mãe a tintura. A tintura não bastou. A mãe nunca mais trocou comigo.', 'A Grakh girl, with a fever I could have broken with a single thought. I gave her mother the tincture instead. The tincture was not enough. Her mother never traded with me again.') },
      afogou(st, 'gelunah')
        ? { id: 'frio', rotulo: T('Um frio com olhos.', 'A cold with eyes.'),
          texto: T('Há um frio de que não consigo lembrar a origem. Ele tem olhos. Toda manhã ainda olho para o norte antes de olhar para qualquer outro lugar, e não sei por quê.', 'There is a cold I cannot place. It has eyes. Every morning I still look north before I look anywhere else, and I do not know why.') }
      : (c1(st).gelunah || 0) >= 1
        ? { id: 'frio', rotulo: T('Um olho violeta, sobre uma montanha.', 'A violet eye, over a mountain.'),
          texto: T('Toda manhã ainda olho primeiro para o norte, antes de olhar para qualquer outro lugar. Lá não há nada além de mais deserto.', 'Every morning I still look north first, before I look anywhere else. There is nothing there but more desert.') }
        : { id: 'frio', rotulo: T('O frio.', 'The cold.'),
          texto: T('Sinto falta do frio. Lá o ar ficava parado. Aqui até a noite se mexe.', 'I miss the cold. Up there the air stood still. Here even the night moves.') },
      deuComida(st)
        ? { id: 'garoto', rotulo: T('Um garoto de Frígia, com pinguins no peito.', 'A boy from Frígia, penguins against his chest.'),
          texto: T('Uma vez dei cinco pinguins a um garoto com fome, e ele não agradeceu. Foi a troca mais justa da minha vida, e nunca soube se ele comeu.', 'Once I gave five penguins to a hungry boy, and he did not thank me. It was the fairest trade of my life, and I never learned whether he ate.') }
        : null,
      // o que o jogador se recusou a afogar nos goles do Cap. I volta com o texto exato
      guardado1(st)
        ? { id: 'guardado', rotulo: guardado1(st),
          texto: T('Na Borda do Mundo houve um pensamento que me recusei a afogar. Carreguei-o por toda a encosta do mundo. Pesa o mesmo.', 'At the Edge of the World there was one thought I refused to drown. I carried it down the whole slope of the world. It weighs the same.') }
        : null,
      // quem matou o caçador no Cap. I: esse pensamento não afunda, sobe sozinho como o Título
      matou(st)
        ? { id: 'besta', forte: true, sub: T('Esse não afunda.', 'This one does not sink.'), rotulo: T('O homem da besta.', 'The man with the crossbow.'),
          texto: T('Ele ainda cai de costas na neve quando fecho os olhos, me olhando como quem não entendia a conta.', 'He still falls backwards into the snow when I close my eyes, looking at me like a man who did not understand the sum.') }
        : null,
      { id: 'titulo', forte: true, rotulo: T('O Título.', 'The Title.'),
        texto: T('O Título. Não vou dizê-lo. Ele não precisa de mim para isso.', 'The Title. I will not say it. It does not need me to.') },
    ].filter(Boolean),
    enterrarT: T('Enterrado.', 'Buried.'),
    tituloT: T('O Título sobe sozinho.', 'The Title rises on its own.'),
    subiuT: T('O que subiu', 'What rose'),
    nadaT: T('enterrou tudo', 'buried everything'),
  },

  // a bancada debaixo da Laje (a alquimia): ler o couro, depois fazer de memória
  //   passos (o que o jogo confere): pilao:X · pote:X · moer · verter (pilão no pote) · fogo:N (riscos) · mexer · guardar
  //   qualidade: sem erro = bom · até 1,5 erro = medio · até 3,5 = ruim · mais que isso, ou faltou ingrediente = falhou
  bancada: {
    ingredientes: [
      { id: 'resina', nome: T('Resina', 'Resin'), cor: '#c98a2e' },
      { id: 'raiz', nome: T('Raiz amarga', 'Bitter root'), cor: '#8a5a3a' },
      { id: 'flor', nome: T('Flor de cacto', 'Cactus flower'), cor: '#d86a8e' },
      { id: 'seiva', nome: T('Seiva de cacto', 'Cactus sap'), cor: '#9fb35a' },
      { id: 'creosoto', nome: T('Creosoto', 'Creosote'), cor: '#5d6b3a' },
      { id: 'ferrao', nome: T('Ferrão de escorpião', 'Scorpion sting'), cor: '#4a3426' },
      { id: 'argila', nome: T('Argila cinza', 'Grey clay'), cor: '#9a948a', sempre: true },
      { id: 'cinza', nome: T('Cinza', 'Ash'), cor: '#6e6a66', sempre: true },
    ],
    receitas: [
      // alvo: o que vai em cada lugar, até onde moer (fino = pó, grosso = grãos), até onde esquentar antes e depois de verter o pilão
      //   (vapor, bolhas, nada; sem valor = qualquer coisa menos ferver) e se precisa mexer. A ordem dos gestos é livre.
      { id: 'unguento', nome: T('Unguento', 'Ointment'), sub: T('a graxa cinza', 'the grey grease'), ic: 'pote', usa: ['resina', 'raiz', 'argila'],
        alvo: { pote: ['resina'], pilao: ['argila', 'raiz'], moer: 'fino', antes: 'vapor', mexer: true },
        linhas: [T('Resina no pote, no fogo até subir o vapor. A resina tem de derreter, não ferver.', 'Resin in the pot, on the fire until the steam rises. The resin has to melt, not boil.'), T('Raiz e argila no pilão. Moer até não sobrar fibra.', 'Root and clay in the mortar. Grind until no fibre is left.'), T('O pilão no pote. Mexer até a cor ficar uma só.', 'The mortar into the pot. Stir until it is one colour.'), T('Guardar.', 'Store it.')] },
      { id: 'tintura', nome: T('Tintura', 'Tincture'), sub: T('para febre e dor', 'for fever and pain'), ic: 'frasco', usa: ['seiva', 'flor'],
        alvo: { pote: ['seiva'], pilao: ['flor'], moer: 'grosso', antes: 'bolhas', depois: 'vapor' },
        linhas: [T('Seiva no pote, no fogo até borbulhar.', 'Sap in the pot, on the fire until it bubbles.'), T('A flor no pilão. Moer pouco: a flor só precisa abrir.', 'The flower in the mortar. Grind a little: the flower only needs to open.'), T('O pilão no pote. Mais fogo, só até subir o vapor.', 'The mortar into the pot. More fire, only until the steam rises.'), T('Guardar no frasco.', 'Into the flask.')] },
      { id: 'antidoto', nome: T('Antídoto', 'Antidote'), sub: T('para picada de ferrão', 'for stings'), ic: 'gota', usa: ['ferrao', 'raiz', 'seiva'],
        alvo: { pote: ['seiva'], pilao: ['ferrao', 'raiz'], moer: 'fino', antes: 'nada', depois: 'nada', mexer: true },
        linhas: [T('Ferrão e raiz no pilão. Moer até virar pó.', 'Sting and root in the mortar. Grind to powder.'), T('Seiva no pote. Sem fogo.', 'Sap in the pot. No fire.'), T('O pilão no pote. Mexer até a cor ficar uma só.', 'The mortar into the pot. Stir until it is one colour.'), T('Guardar no frasco.', 'Into the flask.')] },
      { id: 'po', nome: T('Pó de esconder cheiro', 'Scent-masking powder'), sub: T('para caçador', 'for hunters'), ic: 'bolsa', usa: ['creosoto', 'cinza'],
        alvo: { pilao: ['creosoto', 'cinza'], moer: 'fino' },
        linhas: [T('Creosoto no pilão. Moer até virar pó.', 'Creosote in the mortar. Grind to powder.'), T('Cinza por cima. Moer de novo.', 'Ash on top. Grind again.'), T('Direto para a bolsa. O pote não entra.', 'Straight into the pouch. The pot stays out of it.')] },
    ],
    qual: { bom: T('bem feito', 'well made'), medio: T('médio', 'fair'), ruim: T('mal feito', 'poorly made'), falhou: T('perdido', 'ruined') },
    resultado: {
      bom: T('Cheirei. Cheirava como deve cheirar.', 'I smelled it. It smelled the way it should.'),
      medio: T('Serve. Já fiz melhor com menos.', 'It will do. I have made better with less.'),
      ruim: T('Saiu grosso e com cheiro de queimado. Alguém vai aceitar, e vai pedir mais alguma coisa junto.', 'It came out thick and smelling burnt. Someone will take it, and ask for something more on top.'),
      falhou: T('Aquilo não tinha nome. Joguei atrás da Laje.', 'That had no name. I threw it out behind the slab.'),
    },
    couroT: T('O couro das receitas', 'The recipe hide'), couroSub: T('riscado à faca, uma receita de cada vez, ao longo dos anos', 'scratched with the knife, one recipe at a time, over the years'),
    abrir: T('Ler o couro', 'Read the hide'), fechar: T('Fechar o couro e fazer', 'Close the hide and make it'), outra: T('Outra receita', 'Another recipe'),
    preparar: T('Preparar', 'Make this'), falta: T('falta', 'missing'), sempre: T('sempre há', 'always some'),
    alforjeT: T('No alforje', 'In the pack'), naMao: T('Na mão', 'In hand'),
    pilaoT: T('Pilão', 'Mortar'), poteT: T('Pote', 'Pot'), brasaT: T('Brasa', 'Embers'), guardarT: T('Guardar', 'Store it'), esvaziarT: T('Jogar fora', 'Throw it out'),
    dEscolha: T('Leia o couro e escolha uma receita.', 'Read the hide and choose a recipe.'),
    dMao: T('Toque no pilão ou no pote para pôr.', 'Touch the mortar or the pot to put it in.'),
    dPilaoMao: T('Toque no pote para despejar o pilão.', 'Touch the pot to empty the mortar into it.'),
    dLivre: T('Toque num ingrediente · segure o pilão para moer · segure o pote para mexer · toque na brasa para pôr e tirar do fogo', 'Touch an ingredient · hold the mortar to grind · hold the pot to stir · touch the embers to put on and take off the fire'),
    dVazio: T('Não há nada aí.', 'There is nothing in it.'),
    dOcupado: T('Guarde ou jogue fora o que está na bancada antes de sair.', 'Store or throw out what is on the bench before you leave.'),
    turvoT: T('O vinho embaralha o couro. Segure sobre ele para lembrar.', 'The wine scrambles the hide. Hold on it to remember.'),
    fogoT: T('no fogo', 'on the fire'),
    titulo: T('A bancada', 'The bench'), manhaT: T('De manhã', 'Morning'), noiteT: T('À noite', 'Night'),
    // o que saiu do ponto (na carta do resultado, no máximo duas coisas)
    motivo: {
      vaso: T('{i} foi para o lugar errado.', '{i} went in the wrong place.'), extra: T('{i} não era desta receita.', '{i} did not belong in this one.'),
      semPote: T('O pó não leva pote.', 'The powder takes no pot.'), falta: T('Faltou ingrediente.', 'Something was missing.'),
      grosso: T('Ficou fibra no pilão.', 'There was fibre left in the mortar.'), inteiro: T('Quase não moí.', 'I hardly ground it at all.'), fino: T('Moí demais.', 'I ground it too fine.'),
      frio: T('O pote mal esquentou.', 'The pot barely warmed.'), fraco: T('Tirei do fogo antes de borbulhar.', 'I took it off the fire before it bubbled.'),
      passou: T('Deixei borbulhar, e era só até o vapor.', 'I let it bubble, and it only needed to steam.'), ferveu: T('Ferveu.', 'It boiled.'),
      fogo: T('Pus fogo onde a receita não pedia.', 'I put it on the fire, and the recipe asked for none.'), mexer: T('A cor não ficou uma só: faltou mexer.', 'It never became one colour: it needed more stirring.'),
    },
    dSegMoer: T('Segure o pilão para moer.', 'Hold the mortar to grind.'), dSegMexer: T('Segure o pote para mexer.', 'Hold the pot to stir.'),
  },

  troca: {
    // os itens vêm do alforje (o que a bancada fez + os ingredientes que sobraram)
    // preço: o item que ele precisa, bem feito, basta; médio pede mais uma coisa; mal feito, mais duas
    preco: { bom: 1, medio: 2, ruim: 3 },
    icones: { unguento: 'pote', tintura: 'frasco', antidoto: 'gota', po: 'bolsa' },
    // os pontos do corpo do Grakh na imagem (verbo Olhar): cada cliente tem a sua leitura em cada um
    img: IMG('ponto-troca'),
    pontos: [
      { id: 'mao', x: 59, y: 40, w: 13, h: 26, rotulo: T('A mão', 'The hand') },
      { id: 'corpo', x: 85, y: 20, w: 16, h: 30, rotulo: T('O corpo', 'The body') },
      { id: 'oferta', x: 72, y: 74, w: 26, h: 20, rotulo: T('O que ele trouxe', 'What he brought') },
    ],
    olharT: T('Olhar', 'Look'),
    clientes: [
      { id: 'ghru', nome: 'Ghru', precisa: 'antidoto', oferta: T('duas tiras de carne seca', 'two strips of dried meat'),
        chega: T('Ghru sentou do outro lado do couro sem dizer nada, como sempre.', 'Ghru sat down across the hide without a word, as he always does.'),
        pistas: {
          mao: T('Mantinha a mão esquerda afastada do corpo, com a palma para baixo. As costas da mão estavam inchadas e roxas em volta de dois furinhos.', 'He held his left hand away from his body, palm down. The back of it was swollen and purple around two small holes.'),
          corpo: T('Mantinha o braço duro, longe do corpo, e não o apoiava em nada.', 'He kept the arm stiff, away from his body, and rested it on nothing.'),
          oferta: T('Duas tiras de carne seca, uma ao lado da outra, postas com cuidado. Ghru costuma oferecer uma.', 'Two strips of dried meat, side by side, laid down with care. Ghru usually offers one.'),
        },
        bom: T('As narinas dele abriram.', 'His nostrils opened.'),
        quer: { medio: T('Ghru cheirou o frasco e ficou olhando para o resto das minhas coisas.', 'Ghru sniffed the flask and kept looking at the rest of my things.'),
          ruim: T('Ghru cheirou o frasco, cuspiu de lado e ficou olhando para o resto das minhas coisas, uma por uma.', 'Ghru sniffed the flask, spat to one side, and kept looking at the rest of my things, one by one.') },
        aceita: T('Ghru pegou o antídoto, cheirou e virou tudo na boca de uma vez. A carne ficou no couro.', 'Ghru took the antidote, sniffed it, and tipped it into his mouth in one go. The meat stayed on the hide.') },
      { id: 'tukk', nome: 'Tukk', precisa: 'unguento', oferta: T('um odre cheio de água', 'a full skin of water'),
        chega: T('Depois veio Tukk. Uma semana antes ele tinha vindo com uma ferida no flanco que fedia a podre, e eu lhe dera o unguento.', 'Tukk came next. A week before, he had come with a wound in his side that stank of rot, and I had given him the ointment.'),
        pistas: {
          mao: T('Pôs a mão espalmada sobre o flanco, onde a pele tinha fechado limpa, e deixou a mão ali, olhando para os meus potes.', 'He laid his hand flat over his side, where the skin had closed clean, and kept it there, looking at my pots.'),
          corpo: T('Já vinha pintado para a luta, argila branca até os ombros, sobre a pele cinza.', 'He was painted for the fight already, white clay to the shoulders, over the grey skin.'),
          oferta: T('Um odre cheio de água. No fim da estação seca, com meninos descendo em cordas para buscá-la, não é um preço pequeno.', 'A full skin of water. At the end of the dry season, with boys going down on ropes to fetch it, that is no small price.'),
        },
        bom: T('A mão dele saiu do flanco.', 'His hand came away from his side.'),
        quer: { medio: T('Tukk cheirou o pote e deixou a mão em cima do odre.', 'Tukk smelled the pot and kept his hand on the skin.'),
          ruim: T('Tukk cheirou o pote e puxou o odre um palmo para trás.', 'Tukk smelled the pot and pulled the skin back a hand’s width.') },
        aceita: T('Tukk pegou o pote e deixou o odre. Estava cheio, e pesava.', 'Tukk took the pot and left the skin. It was full, and heavy.') },
      { id: 'durr', nome: 'Durr', precisa: 'po', oferta: T('uma pele de gato-do-deserto', 'a sand-cat hide'),
        chega: T('Durr, um caçador, veio por último, baixo e quieto, e pôs uma pele na pedra.', 'Durr, a hunter, came last, low and quiet, and laid a hide on the stone.'),
        pistas: {
          mao: T('Levou o pulso ao nariz, cheirou a parte de dentro e fez uma careta.', 'He lifted his wrist to his nose, sniffed the inside of it, and made a face.'),
          corpo: T('Ficou agachado em vez de sentar, o peso na ponta dos pés, e cheirou o pulso outra vez.', 'He crouched instead of sitting, his weight on his toes, and sniffed his wrist again.'),
          oferta: T('Uma pele de gato-do-deserto. Só se pega um desses chegando contra o vento.', 'A sand-cat hide. You only catch one of those by coming at it downwind.'),
        },
        bom: T('Ele se inclinou para a frente.', 'He leaned in.'),
        quer: { medio: T('Durr esfregou um pouco do pó no pulso, cheirou e ficou esperando, agachado.', 'Durr rubbed a little of the powder into his wrist, sniffed, and waited, crouching.'),
          ruim: T('Durr esfregou o pó no pulso, cheirou e balançou a cabeça devagar.', 'Durr rubbed the powder into his wrist, sniffed, and slowly shook his head.') },
        aceita: T('Durr pegou a bolsinha de pó, enfiou no cinto e foi embora agachado.', 'Durr took the pouch of powder, tucked it into his belt, and left crouching.') },
    ],
    errado: T('{n} olhou para aquilo, depois para mim, e não se mexeu.', '{n} looked at it, then at me, and did not move.'),
    demais: T('A mão dele parou acima do couro.', 'His hand stopped above the hide.'),
    devolve: T('Ele empurrou de volta o que sobrava, com um dedo só, e pegou apenas o que tinha vindo buscar.', 'He pushed the extra back across the hide with one finger and took only what he had come for.'),
    recusa: T('Ele não se mexeu. O couro ficou entre nós.', 'He did not move. The hide stayed between us.'),
    vaiEmbora: T('{n} levantou e foi embora, levando o que tinha trazido.', '{n} got up and left, taking what he had brought.'),
    empurrar: T('Empurrar o couro', 'Push the hide across'),
    oferece: T('Oferece', 'Offers'),
    teus: T('O alforje', 'The pack'),
    noCouro: T('No couro', 'On the hide'),
    hessaViu: T('Hessa viu.', 'Hessa saw.'),
    levaResto: T('Pegou também o que eu tinha posto ao lado.', 'He took what I had put beside it as well.'),
    naoTem: T('Deixar que ele vá', 'Let him go'),
    ingrT: T('Ingredientes', 'Ingredients'),
  },

  minutos: {
    // custo em marcas do anel (o anel tem 5); o tempo também corre sozinho
    acoes: [
      { id: 'ouvir', custo: 2, x: 15, y: 20, rotulo: T('Subir a duna e ouvir', 'Climb the dune and listen'), trava: (st) => !sobrio(st), motivo: T('ouvido turvo de vinho', 'ears dulled by wine'),
        custoExtra: (st) => (st.luz >= 60 ? 1 : 0), extraT: T('o pulso brilha na duna', 'the wrist glows on the dune'),
        texto: [
          T('Do alto da duna deixei os ouvidos descerem pelo barulho, passando pelos urros, pelos cavalos, até achar dois homens de Redom agachados atrás de um escudo, falando alto demais.', 'From the top of the dune I let my ears go down into the noise, past the roaring, past the horses, until I found two men of Redom crouched behind a shield, talking too loud.'),
          T('— Eles não ficam no chão, capitão. A gente corta no primeiro dia e no terceiro estão de volta na linha, fedendo àquela graxa cinza.', '— They don’t stay down, Captain. We cut them on the first day and they’re back in the line by the third, stinking of that grey grease.'),
          T('— Por isso ele veio em pessoa. Este ano, não. Ele diz que, se deixarmos um de pé nos poços, nossos filhos vão voltar aqui de barba.', '— That’s why he came himself. Not this year. He says if we leave one standing at the wells, our sons will be back here with beards.'),
          T('Graxa cinza. Resina, raiz amarga e a argila em que eu moo as duas. Eu a tinha trocado por água e por ser deixado em paz. Tinham me deixado em paz. E ali estava a conta, vinda lá do leste, numa coluna tão reta que parecia riscada a régua na areia.', 'Grey grease. Resin, bitter root, and the clay I grind them in. I had traded it for water and for being left alone. I had been left alone. And here was the bill, come all the way from the east, in a column so straight it looked ruled onto the sand.'),
        ], voz: 'c01-ouvir' },
      { id: 'po', custo: 2, x: 84, y: 47, rotulo: T('Jogar o pó no vento dos cavalos', 'Throw the powder into the horses’ wind'), trava: (st) => !temPronto(st, 'po'), motivo: T('não sobrou pó', 'no powder left'),
        texto: [T('Desci pelas pedras até onde o vento corria dos poços na direção dos cavalos de Redom, abri a bolsa e soltei o pó. Ele é feito para esconder o cheiro de um homem daquilo que ele caça. O que faz com um cavalo que já não enxerga é outra coisa. A fileira de cavalos em volta do Tinido empinou toda de uma vez, derrubou dois cavaleiros e disparou, e pelo espaço de um fôlego não houve nada entre o Tinido e o escuro além de ar.', 'I came down along the rocks to where the wind ran from the wells toward the Redom horses, opened the pouch, and let the powder go. It is made to hide a man’s smell from whatever he hunts. What it does to a horse that can no longer see is something else. The line of horses around the Tinn went up on their hind legs all at once, threw two riders, and bolted, and for the space of a breath there was nothing between the Tinn and the dark but air.')] },
      { id: 'tukk', custo: 2, x: 67, y: 79, rotulo: T('Arrastar Tukk para fora da linha', 'Drag Tukk out of the line'),
        texto: [
          T('Tukk estava no chão, com uma segunda lança no corpo e a primeira ainda no ombro, tentando se levantar num braço que já não obedecia. Peguei-o por baixo dos ombros e puxei. Ele pesava o que pesa um cavalo. Não usei a luz para isso, e as minhas costas vão se lembrar por mais tempo do que eu.', 'Tukk was down, with a second spear in him and the first still in his shoulder, trying to get up on an arm that no longer answered. I took him under both shoulders and pulled. He weighed what a horse weighs. I did not use the light to do it, and my back will remember it longer than I will.'),
          se(matou, T('O ombro direito, o da seta de Frígia, gritou o caminho todo.', 'My right shoulder, the one the Frígia bolt had found, screamed the whole way.')),
        ] },
      { id: 'shaa', custo: 2, x: 58, y: 64, rotulo: T('Ir até Shaa, no poço', 'Go to Shaa, at the well'),
        texto: [T('Shaa estava na borda do poço, de joelhos, os dois braços em volta da barriga. Ajoelhei ao lado dela, peguei-a pelo braço e comecei a puxá-la para as pedras, e ela veio, devagar.', 'Shaa was on the rim of the well, on her knees, both arms around her belly. I knelt beside her, took her by the arm and began to pull her toward the rocks, and she came, slowly.')] },
      { id: 'beber', custo: 1, x: 50, y: 93, rotulo: T('Beber', 'Drink'), trava: (st) => st.cantil <= 0, motivo: T('o odre está vazio', 'the skin is empty'),
        texto: [T('Bebi, ali, no escuro, com o mundo acabando em volta.', 'I drank, there, in the dark, with the world ending around me.')] },
      { id: 'esconder', custo: 0, x: 22, y: 86, fim: true, rotulo: T('Esconder-se nas pedras e esperar', 'Hide among the rocks and wait'),
        texto: [T('Encostei as costas nas pedras e esperei a luz voltar. Sei fazer isso muito bem.', 'I pressed my back into the rocks and waited for the light to come back. I am very good at that.')] },
    ],
    marcas: 5, segundosPorMarca: 11,
    anelT: T('o sol voltando', 'the sun returning'),
    acabouT: T('A borda do sol aparece.', 'The rim of the sun appears.'),
    pisarT: T('Agora eu sabia onde pisar.', 'Now I knew where to step.'),
  },

  parto: {
    linhas: [
      T('A chuva do décimo primeiro ano.', 'The rain in the eleventh year.'),
      T('A praça que nunca estava suja.', 'The square that was never dirty.'),
      T('O frio, e um olho violeta nele.', 'The cold, and a violet eye in it.'),
      T('A noite em que acendemos todos juntos, e a noite virou dia.', 'The night we all lit together, and night became day.'),
      T('A menina da febre.', 'The girl with the fever.'),
      T('A borda de tudo, e o que vi depois dela.', 'The edge of everything, and what I saw beyond it.'),
      T('A canção.', 'The song.'),
      T('Um coração pequeno, rápido como o de um pássaro.', 'A small heart, quick as a bird’s.'),
    ],
    segurarT: T('segure para pensar', 'hold to think'),
    vidaT: T('a vida, segura', 'the life, held'),
    // a preparação deixa o parto mais fácil: tintura (bem feita conta mais), Hessa segurando Shaa, Aheryn junto dela no eclipse.
    // 5 pontos ou mais: nenhuma dor para apertar. Menos que isso: as dores aparecem como as runas do hino do gelo (Q W E A S D).
    preparo: (st) => ({ bom: 2, medio: 1, ruim: 1 }[st.f.tinturaParto] || 0) + ({ confianca: 2, respeito: 1 }[hessaFaixa(st)] || 0) + (st.f.junto_shaa ? 1 : 0),
    dorT: T('a dor dela', 'her pain'),
    // 'os dois': o coração de Shaa cai sozinho (dreno por segundo) e só a luz dentro da faixa o sustenta (.08 por segundo).
    // Quanto mais Aheryn ajudou os outros (preparoDois, 0 a 9), mais larga a faixa, mais devagar ele cai e menos dores aparecem.
    //   larg: largura da faixa · runas: [intervalo, duração] em segundos, ou null · criaMin: a vida da cria que basta no fim
    //   (a cria não fica mais difícil que no 'só a cria': o difícil é Shaa).
    // Calibrado numa simulação da física com três jogadores (na faixa ~90%, ~65% e ~40% do tempo), Shaa salva:
    //   8-9 pontos: todos · 5-7: o bom e o médio · 2-4: o bom · 0-1: metade das vezes do bom.
    dois: [
      { min: 8, larg: .27, dreno: .065, runas: null, criaMin: .5 },
      { min: 5, larg: .24, dreno: .078, runas: [3.6, 3.0], criaMin: .48 },
      { min: 2, larg: .22, dreno: .092, runas: [2.6, 2.4], criaMin: .42 },
      { min: 0, larg: .20, dreno: .107, runas: [2.0, 2.0], criaMin: .25 },
    ],
    vidaShaaT: T('o coração dela', 'her heart'),
    preparoDois,
    falhaT: [T('A luz não chegou a tempo.', 'The light did not get there in time.'), T('O coração pequeno parou debaixo da minha mão.', 'The small heart stopped under my hand.')],
    tentarT: T('Voltar ao começo do parto', 'Back to the start of the birth'),
  },

  rastro: {
    // o tabuleiro sobre o mapa (mapa-rastro.jpg), em % da largura e da altura: a Pira embaixo à direita,
    // os Tacets descem das pedras a leste, a areia aberta fica na borda oeste
    casas: { P: [77, 76], A: [69, 70], s1: [61, 74], s2: [53, 69], n1: [62, 66], n2: [55, 62], n3: [48, 58], n4: [41, 55], n5: [34, 53], n6: [27, 51], n7: [20, 49], n8: [13, 50], G: [5, 52],
      u1: [56, 53], u2: [48, 48], u3: [40, 45], u4: [32, 44], u5: [24, 43], e0: [95, 34], e1: [90, 45], e2: [85, 55], e6: [78, 63], e7: [98, 57], e3: [94, 66], e4: [87, 71] },
    ligacoes: [['P', 'A'], ['P', 's1'], ['A', 's1'], ['A', 'n1'], ['n1', 's1'], ['s1', 's2'], ['s2', 'n3'], ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4'], ['n4', 'n5'], ['n5', 'n6'], ['n6', 'n7'], ['n7', 'n8'], ['n8', 'G'],
      ['n2', 'u1'], ['u1', 'u2'], ['u2', 'u3'], ['u3', 'u4'], ['u4', 'u5'], ['u5', 'n7'], ['u5', 'n8'], ['n3', 'u2'], ['n4', 'u3'], ['n6', 'u4'],
      ['e0', 'e1'], ['e1', 'e2'], ['e2', 'e6'], ['e6', 'A'], ['e6', 'P'], ['e6', 'n1'], ['e7', 'e3'], ['e3', 'e4'], ['e4', 'e6'], ['e4', 'P'], ['e2', 'e3']],
    pira: 'P', meta: 'G', inicio: 'A',
    // de onde os três descem, pelo quanto saíram cedo (0 a 3)
    tacetsDe: [['e0', 'e1', 'e7'], ['e1', 'e2', 'e3'], ['e1', 'e2', 'e3'], ['e2', 'e3', 'e4']],
    // visão em casas; passo duplo a cada dobra[cedo] vezes (999 = nunca), e a cada dobraAlta com Luz 60+; correr custa Luz.
    // Resolvedor: toda combinação de Luz e cedo tem saída. Jogadores modelados (300 partidas): o médio vence 95% a 100%;
    // o fraco, 76% a 100% (o mais difícil é Luz baixa com os Tacets saídos cedo).
    regras: { visao: 4, dobra: [999, 999, 6, 5], dobraAlta: 4, custoCorrer: 6, luzPiso: 10, cantoVezes: 2, vistaPira: 3 },
    piraT: T('A Pira', 'The Pyre'),
    cantarT: T('Cantar', 'Sing'),
    // o louvor do Cap. I: as estrofes aparecem enquanto Aheryn canta (a língua morta e a tradução)
    letra: [
      ['Sæl’orin vethas, dumael corvethune', T('luz que caminha, sob o peso do silêncio', 'light that walks beneath the weight of silence')],
      ['Yr’onai selu, tharennis vael-korei', T('nós fomos o nome, agora somos a névoa', 'we were the name, now we are the mist')],
      ['Aeth-vorunda, sæl’aeth mor’ilenne', T('ele viu mais longe, ele voltou inteiro', 'he saw farther, he came back whole')],
      ['Dumael, dumael, corvethune sæl’orin', T('silêncio, silêncio, sob o peso da luz', 'silence, silence, beneath the weight of light')],
      ['Yr’onai selu, thariel, thariel', T('nós fomos o nome, chorai, chorai', 'we were the name, weep, weep')],
      ['Vael-korei sæl’aeth, mor’ilenne vorunda', T('a névoa é luz, o inteiro é distância', 'the mist is light, the whole is distance')],
    ],
    irT: T('Seguir em frente', 'Walk on'),
    oesteT: T('Areia aberta', 'Open sand'),
    esperarT: T('Esperar', 'Wait'),
    objetivoT: T('Leve os três até a areia aberta.', 'Lead all three to the open sand.'),
    perdeuT: T('Um deles não vê você: desce para a Pira.', 'One of them cannot see you: it is going down to the Pyre.'),
    duploT: T('Na próxima vez, o compasso aperta: eles andam duas casas.', 'Next time, the count tightens: they move two spaces.'),
    prontoT: T('Os três atrás de você.', 'All three behind you.'),
    quatroT: T('O compasso quebrou de três para quatro.', 'The count broke from three to four.'),
    falhaT: [T('Perto demais.', 'Too close.'), T('O compasso me alcançou ainda à vista da Pira, e não parou em mim.', 'The count caught me still in sight of the Pyre, and it did not stop at me.')],
    falhaLongeT: [T('Perto demais.', 'Too close.'), T('O compasso me alcançou no meio da areia.', 'The count caught me out in the open sand.')],
    falhaPiraT: [T('Longe demais.', 'Too far.'), T('Um deles perdeu a minha luz e desceu para a Pira.', 'One of them lost my light and went down to the Pyre.')],
    tentarT: T('Voltar ao começo do rastro', 'Back to the start of the trail'),
  },

  // ---------------------------------------------------------------- o diário (só para quem o levou no Cap. I)
  diario: {
    titulo: T('Lembranças do Velho Mundo', 'Memories of the Old World'),
    entradas: [
      { titulo: T('Do primeiro ano seco', 'The first dry year'), texto: T('Areia em tudo. No pão, na tinta, nas dobras desta página. Decidi parar de brigar com ela e chamá-la de tempero.', 'Sand in everything. In the bread, in the ink, in the creases of this page. I have decided to stop fighting it and call it seasoning.') },
      { titulo: T('Sobre os Grakh', 'On the Grakh'), texto: T('Dão nome a uma coisa pelo primeiro som que ela faz. Uma criança, pelo primeiro choro; um animal, pelo último. Em onze anos não me deram nome. Considero o maior elogio que o deserto sabe fazer.', 'They name a thing by the first sound it makes. A child by its first cry; a beast by its last. In eleven years they have not named me. I take it as the highest compliment the desert knows how to pay.') },
      { titulo: T('Sobre a menina', 'On the girl'), texto: T('A febre levou a menina na quarta noite. Eu tive a cura na cabeça o tempo todo, dobrada bem pequena, onde guardo tudo o que não me é permitido usar. A mãe parou de vir ao ponto de troca.', 'The fever took the girl on the fourth night. I had the cure in my head the whole time, folded small, where I keep everything I am not allowed to use. Her mother has stopped coming to the trading stone.') },
      { titulo: T('Ontem à noite', 'Last night'), texto: T('Duas noites sem lua. O meu povo saberia o que isso quer dizer. Eu só sei que eles saberiam.', 'Two nights without a moon. My people would have known what that means. I only know that they would have known.') },
      { titulo: T('Outras páginas', 'Other pages'), texto: T('Há outras. Podem esperar. Tudo neste deserto pode esperar, menos a água.', 'There are others. They can wait. Everything in this desert can wait, except water.') },
    ],
    abrir: T('Abrir', 'Open'), fechar: T('Fechar', 'Close'), voltar: T('← Voltar', '← Back'),
  },

  paginas: [

    // ===================================================== ABERTURA · OS TRINTA ANOS
    // A Luz que o leitor trouxe do Cap. I aparece no topo e cai, gole a gole, até 10.
    // Ensina o odre (toque nele ou tecla B) sem gastar os seis goles do capítulo.
    { id: 'a00', zona: 'noite', fundo: { img: IMG('cantil-areia'), kb: 'in', dim: .48, foco: '72% 50%', lado: 'dir', clima: 'estrelas' }, capitular: true,
      // uma voz por variante da primeira frase (quieto / medido / aceso); a segunda frase é igual para todos
      sons: [{ voz: 'a00-quieto', p: 0, se: (st) => persona1(st) === 'quieto' }, { voz: 'a00-medido', p: 0, se: (st) => persona1(st) === 'medido' }, { voz: 'a00-aceso', p: 0, se: (st) => persona1(st) === 'aceso' }, { voz: 'a00-apagar', p: 0 }],
      texto: [
        (st) => ({
          quieto: T('Desci do gelo quase apagado. Eu sempre fui bom nisso. O que sobrou era uma brasa do tamanho de uma unha, e ela demorou muito para entender que devia ir embora também.', 'I came down from the ice almost dark. I have always been good at that. What was left was an ember the size of a fingernail, and it took a very long time to understand that it should leave too.'),
          medido: T('Desci do gelo com a luz pela metade, contando os degraus no escuro.', 'I came down from the ice half lit, counting the steps in the dark.'),
          aceso: T('Desci do gelo ainda aceso, uma brasa esquecida na cinza.', 'I came down from the ice still lit, an ember forgotten in the ash.'),
        }[persona1(st)]),
        T('Há jeitos mais rápidos de apagar uma luz, mas nenhum deixa a gente vivo para aproveitar o escuro.', 'There are quicker ways to put out a light, but none of them leaves you alive to enjoy the dark.'),
      ],
      abertura: {
        anos: [
          { t: T('O primeiro ano. O vinho era ruim e as noites eram compridas, e descobri que um encurtava as outras.', 'The first year. The wine was bad and the nights were long, and I found that the one made the other shorter.') },
          { t: T('O quinto ano. Aprendi qual cacto fermenta e qual mata, mais ou menos nessa ordem.', 'The fifth year. I learned which cactus ferments and which one kills, more or less in that order.') },
          { t: T('O décimo primeiro ano. Choveu uma vez, e por uma tarde a luz levou a melhor. Compensei naquela mesma noite.', 'The eleventh year. It rained once, and for an afternoon the light got the better of me. I made up for it that same night.'), chuva: 8 },
          { t: T('O vigésimo ano. Parei de contar os riscos na pedra.', 'The twentieth year. I stopped counting the scratches on the rock.') },
          { t: T('O trigésimo ano. O que sobrou da luz cabia debaixo de uma faixa de pano no pulso, e na maioria dos dias eu não saberia dizer se ainda estava ali.', 'The thirtieth year. What was left of the light fitted under a strip of cloth at the wrist, and most days I could not have told you it was there.') },
        ],
        fecho: T('Na última noite do trigésimo ano bebi até a areia subir ao meu encontro.', 'On the last night of the thirtieth year I drank until the sand came up to meet me.'),
      } },

    // ===================================================== I · A LAJE
    { id: 'parte-I', parte: 'I', zona: 'laje', fundo: { img: IMG('laje'), kb: 'in', dim: .62, clima: 'areia' },
      cartao: { num: 'I', nome: T('A Laje', 'The Slab'), epigrafe: T('No deserto, a água não se pede. Troca-se.', 'In the desert, no one asks for water. They trade for it.'), fonte: T('ditado dos Queimados', 'saying of the Burned') } },

    { id: 'a01', zona: 'laje', estado: 'ressaca', fundo: { clip: CLIP('ressaca'), img: IMG('areia-amanhecer'), dim: .38, foco: '70% 55%', clima: 'areia' }, capitular: true,
      narracao: 'assets/audio/voz/a01-areia.mp3', narracaoLang: 'en',
      texto: [
        T('O deserto me acordou do jeito de sempre, com um vento seco, ardido e áspero. Fiquei de cara na areia e fiz o inventário. Uma cabaça, vazia. Dois pés enterrados até o tornozelo, o que não me incomodava; amei poucas coisas sem reservas numa vida longa, e areia sob a sola é uma delas. Uma cabeça cheia de um silêncio que eu tinha pago com vinho de cacto e que voltaria a pagar antes do meio-dia.', 'The desert woke me the way it always did, with a dry wind, stinging and rough. I lay with my face in the sand and took stock. One gourd, empty. Two feet, buried to the ankles, which I did not mind; I have loved few things without reservation in a long life, and sand under the soles is one of them. One head, full of a silence I had paid for in cactus wine and would be paying for again by noon.'),
        T('Eu tinha descido para o sul para ser ninguém, e o deserto, que só é generoso numa coisa, me fez exatamente isso.', 'I had come south to be no one, and the desert, which is generous in exactly one thing, had made me precisely that.'),
      ],
      escolha: { id: 'acordar', pergunta: T('Antes de levantar:', 'Before getting up:'), opcoes: [
        { id: 'sacudir', tom: 'frieza', txt: T('Sacudir a areia.', 'Shake off the sand.'),
          resultado: [T('Levantei e bati a areia da roupa. No passo seguinte ela estava de volta: nas dobras do pano, nos cílios, entre os dentes.', 'I stood and beat the sand out of my clothes. By the next step it was back: in the folds of the cloth, in my eyelashes, between my teeth.')] },
        { id: 'ficar', tom: 'ternura', luz: 2, txt: T('Ficar mais um pouco com os pés nela.', 'Stay a little longer with my feet in it.'),
          resultado: [T('Fiquei. A um palmo de fundura a areia ainda guardava o frio da noite, e enterrei os dedos até achá-lo.', 'I stayed. A hand’s depth down the sand still kept the cold of the night, and I dug my toes in until I found it.')] },
        { id: 'gota', tom: 'ironia', txt: T('Procurar a última gota na cabaça.', 'Look in the gourd for a last drop.'),
          resultado: [T('Virei a cabaça sobre a boca e esperei, com a paciência de um Tacet. Nada caiu. Quis estar de volta ao gelo, antes de virem me buscar.', 'I tipped the gourd over my mouth and waited, with the patience of a Tacet. Nothing fell. I wanted to be back on the ice, before they came for me.')] },
      ] } },

    { id: 'a02', zona: 'laje', fundo: { img: IMG('areia-amanhecer'), kb: 'in', dim: .5, foco: '70% 55%', clima: 'areia' },
      texto: [
        T('Os pensamentos voltaram com o sol. O vinho os afoga à noite, e de manhã o calor os traz de volta, um por um, inchados.', 'The thoughts came back with the sun. Wine drowns them at night, and in the morning the heat brings them up again, one by one, swollen.'),
      ],
      minijogo: 'ressaca',
      depois: (st) => {
        const n = ((st.jogos.ressaca && st.jogos.ressaca.subiram) || []).length;
        return [n === 0 ? T('Enterrei todos. Fiquei com a cabeça vazia e a boca seca, que é como começo quase todos os dias.', 'I buried all of them. I was left with an empty head and a dry mouth, which is how I begin most days.')
          : n <= 3 ? T('Alguns chegaram à superfície antes que eu os impedisse, e ficaram ali no calor, e eu os deixei ficar.', 'A few of them reached the surface before I could stop them, and lay there in the heat, and I let them lie.')
            : T('Deixei que viessem. Fiquei sentado na areia com eles até o sol subir demais para ficar ali.', 'I let them come. I sat in the sand with them until the sun was too high to stay.')];
      } },

    { id: 'a03', zona: 'laje', fundo: (st) => (temDiario(st) ? { img: IMG('diario-deserto'), kb: 'in', dim: .55, foco: '30% 50%', lado: 'dir', clima: 'areia' } : { img: IMG('areia-amanhecer'), kb: 'out', dim: .55, foco: '60% 50%', clima: 'areia' }),
      narracao: (st) => 'assets/audio/voz/a03-' + mundo(st) + '.mp3', narracaoLang: 'en',
      texto: [
        // a saída da Borda do Mundo: teve problemas ou não, conforme o que o mundo soube (a regra do Cap. II)
        (st) => ({
          relato: T('Não desci para o sul em paz. Três semanas depois do último gelo, num desfiladeiro de rocha negra, homens me esperavam com redes e de olho numa recompensa. Alguém tinha contado o que viu.', 'I did not come south in peace. Three weeks past the last ice, in a pass of black rock, men were waiting for me with nets and a mind to collect a bounty. Someone had told what they saw.'),
          taverna: T('A estrada para o sul passava por Frígia. Numa taverna de teto baixo, perto da fronteira, três caçadores contavam a história de um velho que acendia a mão na neve. Contavam bem: a cada rodada o velho ficava mais alto e a luz mais forte. Ninguém acreditava, e todo mundo pagava. Paguei uma rodada também, de capuz, no fundo da sala, e saí antes do fim. Nas versões que ouvi depois, eu morria.', 'The road south went through Frígia. In a low-roofed tavern near the border, three hunters were telling the story of an old man who lit up his hand in the snow. They told it well: with every round the old man grew taller and the light grew brighter. Nobody believed them, and everybody paid. I paid for a round too, hooded, at the back of the room, and left before the end. In the versions I heard later, I died.'),
          boato: T('Desci para o sul ouvindo falar de mim. Nas estalagens do caminho, gente que nunca tinha ido ao norte discutia umas luzes vistas sobre a Borda, numa noite, verdes ou douradas conforme o vinho. Um jurava que era um dragão. Outro, que eram os Lúmae voltando. Nenhum deles perguntou nada ao velho que comia sozinho no canto. Fiz o que sei fazer: mantive os olhos no prato e os pensamentos em coisa nenhuma.', 'I came south hearing about myself. In the inns along the road, people who had never been north argued about lights seen over the Edge one night, green or gold depending on the wine. One swore it was a dragon. Another, that it was the Lúmae coming back. None of them asked anything of the old man eating alone in the corner. I did what I know how to do: I kept my eyes on my plate and my thoughts on nothing.'),
          extintos: T('Desci para o sul do jeito que a neve sai de um telhado, toda de uma vez e sem ruído. Quarenta dias de caminhada. O gelo virou cascalho, o cascalho virou pedra, a pedra virou areia, e em toda aquela encosta comprida do mundo nenhum olho se demorou em mais um velho descendo a ladeira. Cuidei disso: mantive os olhos nos pés e os pensamentos em coisa nenhuma.', 'I came south the way snow leaves a roof, all at once and without a sound. Forty days of walking. The ice turned to scree, the scree to stone, the stone to sand, and in all that long slope of the world no eye lingered on one more old man going downhill. I saw to that: I kept my eyes on my feet and my thoughts on nothing.'),
        }[mundo(st)]),
        se(marcado, T('Em algum ponto daquela caminhada parei de reparar que a luz já não subia pelo antebraço onde a mão de bronze tinha fechado. A pele ali ficou lisa e fria, e a luz passava em volta dela sem entrar.', 'Somewhere on that walk I stopped noticing that the light no longer climbed through the forearm the bronze hand had closed on. The skin there had gone smooth and cold, and the light went around it without going in.')),
        (st) => (temPedra(st) ? nomePedra[c1(st).pedra.motivo] ? [T('{P1} desceu comigo, no mesmo pano, e até hoje não me disse o que é.', '{P1} came south with me, in the same cloth, and has still not told me what it is.')] : null : null),
        se(temDiario, T('O diário também desceu comigo. Desde então acrescentei onze páginas, mais ou menos uma a cada três anos.', 'The diary came south too. Since then I have added eleven pages, roughly one every three years.')),
      ] },

    { id: 'a04', zona: 'laje', fundo: { img: IMG('laje'), kb: 'in', dim: .45, foco: '60% 55%', clima: 'poeira' }, capitular: true, bebe: true,
      texto: [
        T('A Laje é uma língua de pedra comprida, gasta pelo vento, com uma sombra embaixo do tamanho de um homem deitado. Ali eu guardo tudo o que tenho.', 'The slab is a long tongue of rock worn down by the wind, with a shadow underneath the size of a man lying down. That is where I keep everything I own.'),
        T('Antes de descer ao acampamento, contei tudo, como faço toda manhã.', 'Before going down to the camp, I counted everything, as I do every morning.'),
      ],
      minijogo: 'laje',
      laje: {
        img: IMG('laje'), proporcao: 1920 / 1080,
        instrucao: T('Conferir a Laje', 'Check the slab'), porta: T('Sentar na bancada', 'Sit down at the bench'),
        fecho: T('Faltava a água, e faltava quase tudo nos potes.', 'The water was missing, and nearly everything in the pots.'),
        pontos: [
          { id: 'cabacas', x: 64, y: 58, w: 14, h: 20, rotulo: T('As cabaças', 'The gourds'), som: 'cabaca',
            texto: [T('Fruto de cacto amassado, deixado fermentando no escuro por nove dias. No décimo destilo o que sobrou num alambique de barro que eu mesmo construí. Sai límpido, cheira a açúcar queimado e cachorro velho, e faz o que preciso que faça.', 'Cactus fruit, mashed and left to ferment in the dark for nine days. On the tenth I distill what is left in a clay still I built myself. It comes out clear, smells of burnt sugar and old dogs, and does what I need it to do.')] },
          { id: 'potes', x: 88, y: 80, w: 20, h: 22, rotulo: T('Os potes', 'The pots'), som: 'pote-abre',
            texto: [T('Unguento para feridas, tintura para febre, antídoto para picada de ferrão, o pó que esconde o cheiro de um homem daquilo que ele caça. No fim da estação seca, quase todos vazios. Sobrava um frasco de tintura. O resto eu teria de fazer na bancada. Quando cheguei, não conhecia nenhuma dessas plantas. Hoje conheço cada uma pelo cheiro.', 'Ointment for wounds, tincture for fever, antidote for stings, the powder that hides a man’s smell from whatever he hunts. At the end of the dry season, nearly all of them empty. One flask of tincture was left. The rest I would have to make at the bench. When I came, I knew none of these plants. Now I know each one by its smell.')] },
          { id: 'escorpiao', x: 47, y: 82, w: 8, h: 10, rotulo: T('Uma sombra que se mexe', 'A shadow that moves'), som: 'escorpiao', aoVer: (st) => { alf(st).ingr.ferrao = Math.max(1, alf(st).ingr.ferrao || 0); },
            texto: [T('Um escorpião, do tamanho do meu polegar, na sombra de uma pedra. Prendi com a tigela, tirei o ferrão com a ponta da faca e guardei. O resto dele soltei na areia.', 'A scorpion the size of my thumb, in the shade of a stone. I trapped it under the bowl, took the sting off with the point of the knife, and kept it. The rest of him I let go on the sand.')] },
          { id: 'riscos', x: 67, y: 30, w: 8, h: 14, rotulo: T('Os riscos', 'The marks'),
            texto: [T('Um risco para cada estação seca, feito com a ponta da faca. Os primeiros são mais fundos.', 'One scratch for every dry season, made with the point of the knife. The first ones are deeper.')] },
          { id: 'odre', x: 91, y: 33, w: 9, h: 24, rotulo: T('O odre', 'The water skin'),
            texto: [T('Vazio. No fim da estação seca tudo está vazio, menos os poços, e os poços são onde todos estão. Eu teria de ir às Goelas.', 'Empty. At the end of the dry season everything is empty except the wells, and the wells are where everyone is. I would have to go to the Gullets.')] },
          { id: 'panos', x: 53, y: 27, w: 13, h: 26, rotulo: T('Os panos', 'The wraps'),
            texto: [T('Faixas compridas de pano cru. O sol daqui queimaria uma pele como a minha numa única tarde, e o pano impede isso. Impede também que alguém veja o que se acende por baixo dela quando eu penso.', 'Long strips of undyed cloth. The sun here would burn skin like mine in a single afternoon, and the cloth stops that. It also stops anyone from seeing what lights up underneath it when I think.')] },
          { id: 'pedra', x: 25, y: 61, w: 6, h: 8, opcional: true, se: temPedra, gema: true, rotulo: T('A pedra', 'The stone'),
            texto: (st) => [T('{P1} estava no pano, dentro da tigela. Naquela luz, cinza.', '{P1} lay in its cloth, in the bowl. In that light, grey.')] },
          { id: 'diario', x: 38, y: 61, w: 7, h: 8, opcional: true, se: temDiario, tipo: 'diario', rotulo: T('O diário', 'The diary') },
        ],
      } },

    // a bancada, de manhã: o que dá para fazer com o que está na Laje (o vinho ainda não pesa)
    { id: 'a04b', zona: 'laje', fundo: { img: IMG('bancada'), kb: 'in', dim: .5, foco: '50% 60%', clima: 'poeira' }, bebe: true,
      texto: [
        T('A bancada é uma pedra chata debaixo da Laje, com a brasa ao lado, o pilão e o pote de barro. Os Grakh chegariam aos poços no dia seguinte, e na véspera dos poços todos vêm à minha pedra de troca.', 'The bench is a flat stone under the slab, with the embers beside it, the mortar and the clay pot. The Grakh would reach the wells the next day, and on the eve of the wells everyone comes to my trading stone.'),
        T('Fiz o que dava para fazer com o que eu tinha.', 'I made what could be made with what I had.'),
      ],
      minijogo: 'bancada', bancada: { sessao: 'manha', sair: T('Descer ao acampamento', 'Go down to the camp') },
      depois: (st) => [fechoLaje(st)] },

    { id: 'a05', zona: 'acampamento', estado: 'seco', fundo: { img: IMG('acampamento'), kb: 'in', dim: .45, foco: '30% 50%', lado: 'dir', clima: 'areia' }, capitular: true,
      sons: [{ voz: 'a05-nome', p: 3 }],
      pensa: [{ id: 'imitar', voz: 'p-imitar', atraso: 16000, luz: 3, tomSeguir: 'ternura', t: T('Ninguém me imitava desde que eu era alguém.', 'No one had copied me since I was someone.'),
        mais: T('Na Cidade-Espelho, os aprendizes copiavam o meu passo na praça, e eu fingia não ver, e via.', 'In the Mirror City, the apprentices used to copy my walk across the square, and I pretended not to see, and saw.') }],
      texto: [
        T('O acampamento estava três vezes maior que uma semana antes, e crescia enquanto eu olhava. Hordas chegavam de todos os cantos da Boca Seca, longas filas pardas levantando uma poeira que se via a um dia de distância. No fim da estação seca os Grakh vão às Goelas beber, todos eles, porque não sobra outro lugar onde beber.', 'The camp was three times the size it had been a week before, and growing while I watched. Hordes were coming in from every quarter of the Dry Mouth, long brown lines of them, raising a dust you could see from a day away. At the end of the dry season the Grakh go to the Gullets to drink, all of them, because there is nowhere else left to drink.'),
        se(quieto, T('Desci sem olhar para os lados.', 'I went down without looking to either side.')),
        se(medido, T('Desci devagar, contando as hordas pela poeira.', 'I went down slowly, counting the hordes by their dust.')),
        se(aceso, T('Pelas colunas de poeira dava para contar as hordas: onze, talvez doze. Nunca tinham vindo tantas. Um povo com sede é previsível, e o que é previsível acaba sendo caçado.', 'You could count the hordes by their columns of dust: eleven, perhaps twelve. So many had never come before. A thirsty people is predictable, and what is predictable ends up hunted.')),
        T('Redom sabe disso, e vem todo ano aos mesmos poços na mesma semana.', 'Redom knows this, and comes every year to the same wells in the same week.'),
        T('Nunca me deram um nome. Os Grakh nomeiam as coisas pelo som que elas fazem, e eu tomei muito cuidado para não fazer nenhum.', 'They had never given me a name. The Grakh name a thing by the sound it makes, and I have been very careful to make none.'),
        T('No meio da descida, uma criança Grakh entrou atrás de mim e começou a imitar o meu andar, pousando cada pé com um cuidado enorme e teatral, para não fazer barulho. Era bom nisso. Melhor do que eu na idade dele, e eu tive mestres.', 'Halfway down, a Grakh child fell in behind me and began to copy my walk, setting each foot down with enormous, theatrical care, so as not to make a sound. He was good at it. He was better at it than I was at his age, and I had been taught by masters.'),
      ],
      escolha: { id: 'menino', pergunta: T('A criança atrás dele:', 'The child behind him:'), opcoes: [
        { id: 'deixar', tom: 'ternura', txt: T('Deixar que ele siga.', 'Let him follow.'),
          resultado: [T('Deixei. Descemos a encosta juntos, dois silêncios, um deles muito satisfeito consigo mesmo.', 'I let him. We went down the slope together, two silences, one of them very pleased with itself.')] },
        { id: 'estalar', tom: ['ternura', 'curiosidade'], flag: 'estalou', luz: 2, txt: T('Estalar a língua para ele.', 'Click my tongue at him.'),
          resultado: [T('Estalei a língua para ele, uma vez, sem me virar. Foi o primeiro som que fiz perto do acampamento em mais tempo do que consigo lembrar. Ele parou na hora. Depois estalou de volta e desceu a encosta correndo, estalando a língua para tudo o que via pela frente: uma cabra, uma tenda, os próprios pés.', 'I clicked my tongue at him, once, without turning around. It was the first sound I had made near the camp in longer than I could remember. He stopped dead. Then he clicked back, and ran off down the slope clicking at everything he passed: a goat, a tent, his own feet.')] },
        { id: 'encarar', tom: 'frieza', txt: T('Parar e olhar para ele até ele ir embora.', 'Stop and look at him until he goes.'),
          resultado: [T('Parei e olhei para ele. Tenho um olhar para isso, aperfeiçoado ao longo de um século; já mandou embora homens melhores que uma criança Grakh. Ele me encarou com grande interesse, depois ficou entediado e foi embora, o que eu decidi contar como vitória.', 'I stopped and looked at him. I have a look for this, perfected over a century; it has sent away better men than a Grakh child. He stared back with great interest, then got bored and left, which I chose to count as a victory.')] },
      ] } },

    { id: 'a06', zona: 'acampamento', fundo: { img: IMG('ponto-troca'), kb: 'in', dim: .45, foco: '60% 55%', clima: 'poeira' }, bebe: true,
      texto: [
        T('Meu ponto de troca é uma pedra chata na borda do acampamento e um couro que estendo em cima dela. Os Grakh não comerciam; me disseram isso no meu primeiro ano, com uma lança encostada no meu peito. Eles põem uma coisa ao lado de outra, olham para as duas e decidem.', 'My place of trade is a flat stone at the edge of the camp, and a hide I spread over it. The Grakh do not trade; they told me so in my first year, with a spear against my chest. They put one thing down beside another, look at both, and decide.'),
        T('Naquele dia o couro ficou vazio. O que os Grakh tinham, guardavam para os poços.', 'That day the hide stayed empty. Whatever the Grakh had, they were keeping for the wells.'),
      ] },

    { id: 'a07', zona: 'acampamento', estado: 'companhia', fundo: { img: IMG('shaa'), kb: 'in', dim: .4, foco: '78% 40%', clima: 'poeira' }, capitular: true, bebe: true,
      texto: [
        T('Só Shaa veio. Atravessou a areia devagar, uma mão embaixo da barriga, e já vinha rindo antes de chegar, as tranças batendo nas costas. Os dentes de baixo eram grandes demais para a boca, e quando ela ria apareciam todos. A maioria dos Grakh não se aproxima de mim. Shaa sentou tão perto que nossos joelhos quase se tocaram.', 'Only Shaa came. She crossed the sand slowly, one hand under her belly, and she was laughing before she reached me, her braids slapping against her back. Her lower teeth were too big for her mouth, and when she laughed they all showed. Most of the Grakh do not come near me. Shaa sat down so close our knees almost touched.'),
        se(quieto, T('Não me afastei.', 'I did not move away.')),
        se(medido, T('Com ela ali, a minha cabeça ficou quieta.', 'With her there, my head went quiet.')),
        se(aceso, T('Com ela tão perto, a cabeça parou de fazer contas. Os Grakh não ligam para o que eu sou, e isso me descansa mais do que o vinho.', 'With her that close, my head stopped doing sums. The Grakh do not care what I am, and that rests me more than the wine does.')),
        T('— Shaa ter dor. Aqui. E aqui. Cria chutar costas. Chutar, chutar, chutar.', '— Shaa have pain. Here. And here. Baby kick the back. Kick, kick, kick.'),
        T('Não trazia nada nas mãos. Olhou para elas como se isso a surpreendesse e então tirou do pescoço o cordão: um único dente, maior que o meu dedo.', 'She had nothing in her hands. She looked at them as if this surprised her, and then took the cord from around her neck: a single tooth, longer than my finger.'),
        T('— Shaa matar sozinha. Primeira caçada. Dente grande.', '— Shaa kill alone. First hunt. Big tooth.'),
      ],
      aoSair: (st) => { if (st.escolhas.dente) usaPronto(st, 'tintura'); },
      dialogo: { interlocutor: 'Shaa', rodadas: [
        { id: 'dente', pergunta: T('O dente sobre o couro:', 'The tooth on the hide:'), opcoes: [
          { id: 'aceitar', tom: 'ternura', shaa: 1, txt: T('Aceitar o dente.', 'Accept the tooth.'),
            resposta: [T('— Bom! Troca feita.', '— Good! Trade done.'), T('Dei a ela a tintura para a dor. Ela virou o frasco na boca de uma vez e fez uma careta que o acampamento todo viu.', 'I gave her the tincture for the pain. She tipped the flask into her mouth in one go and made a face the whole camp saw.')] },
          { id: 'presente', tom: 'ternura', shaa: 1, pira: -1, aviso: T('Alguém viu.', 'Someone saw.'), txt: T('Dizer a ela que fique com o dente.', 'Tell her to keep the tooth.'),
            resposta: [T('— Não! Shaa pagar. Grakh sempre pagar.', '— No! Shaa pay. Grakh always pay.'), T('Mesmo assim, olhou por cima do ombro, pegou o frasco de tintura depressa, fechou a mão em volta dele e pendurou o dente de volta no pescoço. Alguém na borda do acampamento tinha visto.', 'Even so, she looked over her shoulder, took the flask of tincture quickly, closed her hand around it, and hung the tooth back around her neck. Someone at the edge of the camp had seen.')] },
          { id: 'nada', tom: 'frieza', txt: T('Nada em troca de nada.', 'Nothing for nothing.'),
            resposta: [T('— Justo.', '— Fair.'), T('Levantou e foi embora sem olhar para trás. Ao meio-dia voltou com um punhado de tâmaras secas, sentou perto demais outra vez e estendeu a mão.', 'She got up and left without looking back. At midday she came back with a handful of dried dates, sat too close again, and held out her hand.')] },
        ] },
        // a luz que ele mostra depende da Luz que ele tem (medida antes da escolha): pouca, ela confia mais; muita, assusta
        { id: 'verLuz', antes: (st) => [T('— Velhos dizer: você ter luz. Debaixo da pele. Shaa querer ver. Mostrar!', '— Old ones say you have light. Under the skin. Shaa want to see. Show!'),
          aceso(st) ? T('Naquele dia a luz estava perto da pele.', 'That day the light was close under the skin.') : quieto(st) ? T('O vinho tinha deixado da luz só um fio.', 'The wine had left only a thread of the light.') : null],
          pergunta: T('Ela quer ver a luz.', 'She wants to see the light.'), opcoes: [
            { id: 'mostrar', tom: 'ternura', flag: 'mostrou_luz', txt: T('Puxar o pano do pulso.', 'Pull the cloth back from my wrist.'),
              luz: (st) => (quieto(st) ? 6 : 10),
              aoEscolher: (st) => { const l = st._luzEscolha != null ? st._luzEscolha : st.luz; st.f.luzShaa = l <= 30 ? 'baixa' : l < 60 ? 'media' : 'alta';
                st.shaa = (st.shaa || 0) + ({ baixa: 2, media: 1, alta: 0 })[st.f.luzShaa];
                if (st.f.luzShaa !== 'baixa') st.hessa -= 1; },   // um fio, de longe, Hessa não vê
              aviso: (st) => (st.f.luzShaa === 'baixa' ? null : T('Hessa viu a luz.', 'Hessa saw the light.')),
              resposta: (st) => ({
                baixa: [T('Puxei o pano. Debaixo dele quase não havia nada: o vinho tinha deixado um fio. Pensei em chuva, no cheiro dela chegando, no som das gotas na areia, e o fio subiu pelas veias aos poucos, morno, da cor de uma brasa coberta.', 'I pulled the cloth back. There was almost nothing under it: the wine had left a thread. I thought of rain, of the smell of it coming, of the sound of drops on the sand, and the thread climbed my veins a little at a time, warm, the colour of a banked coal.'),
                  T('Shaa parou de rir. Segurou o pulso com as duas mãos e o encostou na barriga, sem pedir, e alguma coisa lá dentro chutou o lugar onde estava a luz, com força.', 'Shaa stopped laughing. She held the wrist in both hands and pressed it to her belly, without asking, and something inside kicked the place where the light was, hard.'),
                  T('— A cria gostar. Shaa gostar.', '— Baby like. Shaa like.')],
                media: [T('Puxei o pano e deixei a luz subir. Ela veio pelas veias até o cotovelo, sem pressa, e Shaa parou de rir. Pegou o pulso e o encostou na barriga, sem pedir, e alguma coisa lá dentro chutou o lugar onde estava a luz, com força.', 'I pulled the cloth back and let the light rise. It came up my veins to the elbow, unhurried, and Shaa stopped laughing. She took the wrist and pressed it to her belly, without asking, and something inside kicked the place where the light was, hard.'),
                  T('— A cria gostar.', '— The baby likes it.')],
                alta: [T('Puxei o pano, e a luz não esperou: subiu pelo braço até o pescoço de uma vez, clara demais para o meio-dia. Shaa recolheu a mão e se afastou um palmo na areia.', 'I pulled the cloth back, and the light did not wait: it went up my arm to my neck all at once, too bright for midday. Shaa drew her hand back and shifted a palm’s width away on the sand.'),
                  T('Pôs as duas mãos na barriga, por cima da cria, e não me tocou.', 'She put both hands on her belly, over the child, and did not touch me.'),
                  T('— Muito. Luz muito.', '— Much. Light much.')],
              })[st.f.luzShaa] },
            { id: 'recusa', tom: 'frieza', shaa: -1, aviso: T('Shaa vai lembrar disso.', 'Shaa will remember that.'), txt: T('“Não. Isso não se mostra.”', '“No. That is not for showing.”'),
              resposta: [T('— Hm. Shaa ir.', '— Hm. Shaa go.'), T('Ela ficou parada um fôlego, com os olhos no pano. Depois saiu, as duas mãos na barriga.', 'She stayed still for a breath, her eyes on the cloth. Then she went, both hands on her belly.')] },
          ] },
      ] } },

    { id: 'a08', zona: 'acampamento', estado: 'companhia', fundo: { img: IMG('ghru'), kb: 'in', dim: .42, foco: '72% 45%', clima: 'poeira' }, capitular: true,
      texto: [
        T('Na sombra de uma parede de couro, Ghru mastigava uma raiz só do lado direito; do esquerdo já não tinha dentes. É o Grakh mais velho que conheço. Tem trinta e oito anos e me diz isso a cada visita, antes de qualquer outra coisa.', 'In the shade of a hide wall, Ghru was chewing a root on the right side only; on the left he had no teeth left. He is the oldest Grakh I know. He is thirty-eight, and he tells me so every visit, before anything else.'),
        T('— Amanhã, as Goelas. Todo mundo. E o Tinido vir, como todo ano. Este ano trazer muito homem. Muito. Durr contar fogueira deles e perder a conta.', '— Tomorrow, the Gullets. Everybody. And the Tinn come, like every year. This year bring many men. Many. Durr count their fires and lose count.'),
        T('Tinido é como os Grakh chamam o comandante de Redom: o som que a armadura dele faz quando ele anda.', 'The Tinn is what the Grakh call the commander of Redom: the sound his armour makes when he walks.'),
        T('— E lua sumir. Duas noite já. Lua sumir, velhos dizer: talvez dia ser comido.', '— And moon gone. Two nights now. Moon gone, old ones say: maybe day be eaten.'),
        T('Riu com os ombros.', 'He laughed with his shoulders.'),
        T('— Dia ser comido, nascer o maior. Mãe de Ghru dizer isso. Mãe da mãe dizer. Toda lua sumida, velhos dizer. Dia nunca ser comido.', '— Day be eaten, greatest be born. Ghru mother say that. Her mother say that. Every moon gone, old ones say it. Day never eaten.'),
      ],
      dialogo: { interlocutor: 'Ghru', rodadas: [
        { id: 'ghru1', pergunta: T('Perguntar a Ghru:', 'Ask Ghru:'), opcoes: [
          { id: 'come', tom: 'curiosidade', txt: T('“O que é que come um dia?”', '“What eats a day?”'),
            resposta: [T('— Ghru não saber. Ghru perguntar à mãe uma vez. Mãe bater em Ghru com osso.', '— Ghru not know. Ghru ask mother once. Mother hit Ghru with bone.')] },
          { id: 'tinido', tom: 'curiosidade', flag: 'perguntouTinido', txt: T('“Me fale do Tinido.”', '“Tell me about the Tinn.”'),
            resposta: [T('— Ele andar na frente. Sempre na frente. Outros chefes empurrar os homens, o Tinido ir primeiro. Hessa querer muito a cabeça dele.', '— He walk in front. Always in front. Other chiefs push the men ahead, Tinn go first. Hessa want his head very much.')] },
          { id: 'quantas', luzMin: 60, tom: 'curiosidade', txt: T('“Quantas vezes o dia já foi comido?”', '“How many times has the day been eaten?”'),
            resposta: [T('— Ghru nunca ver. Mãe de Ghru nunca ver. Mãe da mãe ver uma vez. Ficar cega de um olho. Olhar demais.', '— Ghru never see. Ghru mother never see. Her mother see once. Go blind one eye. Look too much.')] },
          { id: 'dentes', tom: 'ironia', txt: T('Contar os dentes dele em vez de ouvir.', 'Count his teeth instead of listening.'),
            resposta: [T('Onze. No ano anterior eram catorze. Ghru percebeu que eu contava e arreganhou os dentes, para ajudar.', 'Eleven. Last year there had been fourteen. Ghru noticed me counting and bared them, to help.'), T('— Onze. Ghru saber. Ano que vem, dez.', '— Eleven. Ghru know. Next year, ten.')] },
        ] },
        { id: 'ghru2', pergunta: T('E então:', 'And then:'), opcoes: [
          { id: 'nome', tom: 'curiosidade', flag: 'sabeNome', txt: T('“Quem te deu o nome?”', '“Who gave you your name?”'),
            resposta: [T('— Mãe. Ghru nascer com areia na garganta. Primeiro som: ghrrru. Então: Ghru.', '— Mother. Ghru born with sand in throat. First sound: ghrrru. So: Ghru.'), T('Fez o som para mim, duas vezes, do fundo da garganta, muito satisfeito.', 'He made the sound for me, twice, from the back of his throat, very pleased with it.')] },
          { id: 'maior', tom: 'curiosidade', txt: T('“Quem foi o maior, da última vez?”', '“Who was the greatest, the last time?”'),
            resposta: [T('— Ninguém saber. Ele vir quando o dia ser comido, ele ir. Não morrer. Só ir. Talvez voltar. Talvez Ghru comer esta raiz e morrer. Quem saber.', '— Nobody know. He come when the day be eaten, he go. Not die. Just go. Maybe come back. Maybe Ghru eat this root and die. Who know.')] },
          { id: 'deixar', tom: 'frieza', txt: T('Deixá-lo com a raiz.', 'Leave him to his root.'),
            resposta: [T('Ele não levantou os olhos. Quando olhei para trás, ainda falava da raiz, para o vento.', 'He did not look up. When I looked back, he was still talking about the root, to the wind.')] },
        ] },
      ] },
      aoSair: (st) => { if (st.escolhas.ghru2 && st.escolhas.ghru2 !== 'deixar' && !st.f.raizGhru) { st.f.raizGhru = true; alf(st).ingr.raiz = (alf(st).ingr.raiz || 0) + 1; } },
      depois: [se((st) => st.escolhas.ghru2 && st.escolhas.ghru2 !== 'deixar', T('Quando levantei, Ghru partiu a raiz em duas com os dentes do lado direito e me estendeu a metade molhada. — Raiz boa. Ghru pagar a conversa.', 'When I got up, Ghru bit the root in two with the teeth on his right side and held out the wet half to me. — Good root. Ghru pay for the talk.')),
        T('Eu tinha ouvido a frase do dia comido muitas vezes, sempre numa noite sem lua, sempre de um velho, sempre com aquele riso nos ombros. Na manhã seguinte o sol nascia inteiro.', 'I had heard the line about the eaten day many times, always on a moonless night, always from an old one, always with that laugh in the shoulders. The next morning the sun rose whole.'),
        se(aceso, T('Toda profecia é o jeito de um povo dizer que ainda espera alguma coisa. A dos Grakh, pelo menos, não marcava data.', 'Every prophecy is a people’s way of saying it still expects something. The Grakh one, at least, named no date.'))] },

    { id: 'a09', zona: 'acampamento', fundo: { img: IMG('hessa'), kb: 'in', dim: .4, foco: '20% 45%', lado: 'dir', clima: 'poeira' }, capitular: true, bebe: true,
      texto: [
        T('Hessa estivera olhando o tempo todo, da distância de sempre, uma lança e um pouco mais, com uma das mãos pousada no cabo da maça às costas. O nome dela é o som que a água faz numa pedra quente.', 'Hessa had been watching the whole time, from the usual distance, a spear’s length and a little more, one hand resting on the haft of the mace across her back. Her name is the sound water makes on a hot stone.'),
        T('Entre os guerreiros da Pira, Hessa é a que os outros usam de medida. Os mais novos copiam o passo dela; os mais velhos param de falar quando ela passa. Os Grakh a chamam de Quebra-Lanças: quando ela caça, a lança entra com tanta força que a haste estala dentro do animal.', 'Among the warriors of the Pyre, Hessa is the one the others measure themselves by. The young ones copy her stride; the old ones stop talking when she goes by. The Grakh call her Spear-Breaker: when she hunts, the spear goes in so hard that the shaft snaps inside the animal.'),
        T('Mandou Tukk embora com duas palavras, do jeito Grakh, sem dobra nenhuma nos verbos. Então se virou para mim e mudou.', 'She sent Tukk off with two words, in the Grakh way, with no bend in the verbs at all. Then she turned to me, and changed.'),
        T('Comigo Hessa fala a língua dos homens, inteira, cada verbo no lugar, com as vogais compridas e abertas dos Queimados. No ombro esquerdo ela tem uma velha marca deles, das que eles queimam nos cativos, e por cima dela alguém depois cortou três linhas a faca, fundas, como quem risca uma palavra.', 'With me Hessa speaks the language of men, all of it, every verb in its place, with the long open vowels of the Burned. On her left shoulder there is an old brand of theirs, the kind they burn into captives, and across it someone later cut three lines with a knife, deep, as if crossing out a word.'),
        (T('Estendi o odre de vinho. Ela pegou, arrancou a tampa com os dentes, cheirou e despejou um gole comprido na areia entre nós, devagar, olhando para mim o tempo todo. Depois me devolveu o odre.', 'I held out the skin of wine. She took it, pulled the stopper with her teeth, smelled it, and poured a long swallow of it out on the sand between us, slowly, looking at me the whole time. Then she handed the skin back.')),
        // a dica vem antes da conversa: dá tempo de beber (o odre está à mão nesta página)
        se((st) => st.luz >= 60 && !st.f.mostrou_luz && !st.f.hessa_viu_luz, T('O pulso estava quente, e ela estava perto.', 'My wrist was warm, and she was close.')),
      ],
      aoEntrar: (st) => { st.cantil = Math.max(0, st.cantil - 1); },
      dialogo: { interlocutor: 'Hessa', continuar: true, rodadas: [
        // a Luz é conferida quando ela começa a falar, e não quando ele chega
        { id: 'hessa1', antes: (st) => {
          if (!st.f._hessaConferiu) { st.f._hessaConferiu = true; if (st.luz >= 60 && !st.f.mostrou_luz && !st.f.hessa_viu_luz) { st.f.hessa_viu_luz = true; st.hessa -= 1; if (window.LIVRO_TOAST) window.LIVRO_TOAST(T('Hessa viu a luz.', 'Hessa saw the light.')); } }
          return (st.f.hessa_viu_luz && !st.f.mostrou_luz ? [T('Os olhos dela desceram para o pano do meu pulso e para o que passava por baixo dele. A mão dela voltou para o cabo da maça.', 'Her eyes went down to the cloth at my wrist, and to what was moving under it. Her hand went back to the haft of the mace.')] : []).concat([T('— Você fica porque os potes mantêm os meus de pé. Homens que deviam cair não caem. É o único motivo de você ainda estar naquela pedra. Não confunda com outro.', '— You stay because the pots keep my own standing. Men who should fall, don’t. That is the only reason you are still on that stone. Do not mistake it for another.')]); },
          pergunta: T('Responder a Hessa:', 'Answer Hessa:'), opcoes: [
            { id: 'uteis', tom: 'ironia', txt: T('“Então somos úteis um ao outro.”', '“Then we are useful to each other.”'),
              resposta: [T('Ela não respondeu. Olhou os meus potes, depois para mim, e cuspiu na areia.', 'She did not answer. She looked at my pots, then at me, and spat on the sand.')] },
            { id: 'ervas', luzMax: 45, travaAcesaTxt: T('As mãos estão acesas demais para mentir.', 'My hands are too lit to lie.'), tom: 'frieza', hessa: -1, aviso: T('Hessa vai lembrar disso.', 'Hessa will remember that.'), flag: 'mentiuErvas', txt: T('“São só ervas.”', '“It is only herbs.”'),
              resposta: [T('— Os Queimados passavam unguento nas minhas costas depois do chicote. Também diziam que era só erva.', '— The Burned rubbed ointment into my back after the whip. They also said it was only herbs.')] },
            { id: 'sinal', se: (st) => (c1(st).aug || 0) >= 1, tom: 'curiosidade', hessa: 1, aviso: T('Hessa vai lembrar disso.', 'Hessa will remember that.'), txt: T('Fazer o sinal de troca que os Aug me ensinaram.', 'Make the sign of exchange the Aug taught me.'),
              resposta: [T('Os olhos dela foram para a minha mão e ficaram ali um instante a mais do que precisavam. A mão na maça desceu para junto do corpo.', 'Her eyes went to my hand and stayed there a moment longer than they needed to. The hand on the mace came down to her side.')] },
            { id: 'lingua', luzMin: 60, tom: 'curiosidade', txt: T('“Quem te ensinou a língua inteira também te ensinou a desconfiar dela.”', '“Whoever taught you the whole language also taught you to distrust it.”'),
              resposta: [T('Ela passou o polegar pelas três linhas do ombro e não respondeu.', 'She ran her thumb along the three lines on her shoulder and did not answer.')] },
            { id: 'baixar', tom: 'frieza', hessa: 1, txt: T('Baixar os olhos e ir embora.', 'Lower my eyes and go.'),
              resposta: [T('Ela me deixou ir sem dizer mais nada.', 'She let me go without another word.')] },
          ] },
        { id: 'hessa2', se: (st) => st.escolhas.hessa1 !== 'baixar', antes: [T('— O Tinido está a dois dias dos poços. Talvez um. Esteja longe.', '— The Tinn is two days from the wells. Maybe one. Be far away.')],
          pergunta: T('Hessa:', 'Hessa:'), opcoes: [
            { id: 'agua', txt: T('“Preciso de água. A água está nos poços.”', '“I need water. The water is at the wells.”'),
              resposta: [T('— Então beba depressa.', '— Then drink fast.')] },
            { id: 'longe', tom: 'ironia', txt: T('“Estou sempre longe. Mesmo parado aqui.”', '“I am always far away. Even standing here.”'),
              resposta: [T('Alguma coisa se mexeu no canto da boca dela e foi guardada no mesmo instante.', 'Something moved at the corner of her mouth and was put away at once.')] },
            { id: 'cala', silencio: true, luzMax: 80, tom: 'frieza',
              resposta: [T('Ela virou e foi embora. Era a primeira vez que me dava as costas.', 'She turned and walked away. It was the first time she had turned her back on me.')] },
          ] },
      ] } },

    { id: 'a10', zona: 'noite', fundo: { clip: CLIP('fogueiras'), img: IMG('laje-noite'), dim: .35, foco: '45% 60%', clima: 'estrelas' }, capitular: true, bebe: true,
      sons: [{ voz: 'a10-sem-lua', p: -1 }],
      texto: [
        T('Naquela noite sentei na beira da Laje com o odre de vinho de cacto e fiquei olhando as hordas chegarem. As fogueiras foram acendendo uma a uma pelo escuro, até a planície lá embaixo ficar mais acesa que o céu.', 'That night I sat at the edge of the slab with the skin of cactus wine and watched the hordes come in. Their fires went on one by one across the dark, until the plain below was brighter than the sky.'),
        se(aceso, T('Debaixo do pano, o pulso brilhava. Na Laje, a única luz acesa era a minha, e o norte tem olhos.', 'Under the cloth, my wrist was glowing. On the slab the only light burning was mine, and the north has eyes.')),
        T('Sem lua. Na noite anterior também não houvera. O meu povo costumava esperar por noites assim, por motivos que eu tinha bebido para fora da cabeça havia muito tempo.', 'No moon. There had been none the night before, either. My people used to watch for nights like these, for reasons I had drunk out of my head a long time ago.'),
      ],
      pensa: [{ id: 'semlua', voz: 'p-lua', atraso: 9000, luz: 4, tomSeguir: 'curiosidade', t: T('Duas noites sem lua.', 'Two nights without a moon.'),
        mais: T('Na Cidade-Espelho, numa noite sem lua, os telhados enchiam de gente olhando para cima com tabelas no colo. Eu era um deles.', 'In the Mirror City, on a moonless night, the rooftops filled with people looking up with tables in their laps. I was one of them.'),
        beber: T('Bebi antes que a pergunta terminasse de se formar.', 'I drank before the question could finish taking shape.') }],
      // a noite sem lua é uma decisão do odre: só quem fica sóbrio sente o exército marchando
      escolha: { id: 'noite', pergunta: T('O odre:', 'The skin:'), opcoes: [
        { id: 'beber', tom: 'frieza', gole: true, riscavel: true, se: (st) => st.cantil > 0, motivo: T('o odre está vazio', 'the skin is empty'), txt: T('Beber até a planície parar de brilhar.', 'Drink until the plain stops shining.'),
          resultado: [T('Bebi até as fogueiras virarem uma mancha só.', 'I drank until the fires ran together into one smear.'), MARCHA_NAO] },
        { id: 'sobrio', tom: 'curiosidade', luz: 3, txt: T('Ficar sóbrio e olhar.', 'Stay sober and watch.'),
          resultado: (st) => [T('Deixei o odre fechado no colo.', 'I left the skin stoppered in my lap.')].concat(marcha(st)) },
        { id: 'contar', luzMin: 60, tom: 'curiosidade', luz: 2, txt: T('Contar as fogueiras.', 'Count the fires.'),
          resultado: (st) => [T('Contei as fogueiras de cem em cem. Passei de três mil e parei. Cada fogueira era uma família.', 'I counted the fires, a hundred at a time. I passed three thousand and stopped. Every fire was a family.')].concat(marcha(st)) },
      ] },
      aoSair: (st) => { st.f.sentiuMarcha = st.escolhas.noite !== 'beber' && (st.turvo || 0) <= 2; if (st.escolhas.noite === 'beber') st.turvo = (st.turvo || 0) + 2; if (st.luz >= 60) st.f.tacets_noite = true; } },

    // a bancada, à noite: o que se juntou no caminho; quem bebeu prepara bêbado
    { id: 'a11', zona: 'noite', fundo: { img: IMG('bancada-noite'), kb: 'in', dim: .45, foco: '50% 60%', clima: 'estrelas' }, bebe: true,
      aoEntrar: (st) => { const a = alf(st); ['seiva', 'creosoto', 'raiz', 'resina'].forEach((k) => { a.ingr[k] = (a.ingr[k] || 0) + 1; }); },
      texto: [
        T('No caminho de volta eu tinha enchido a cabaça pequena de seiva, cortado um galho de creosoto, arrancado uma raiz amarga do leito seco e raspado resina de um tronco morto. Acendi a brasa debaixo da Laje.', 'On the way back I had filled the small gourd with sap, cut a branch of creosote, pulled a bitter root from the dry bed and scraped resin off a dead trunk. I lit the embers under the slab.'),
        se((st) => !!st.f.raizGhru, T('A metade da raiz de Ghru ainda estava molhada.', 'Ghru’s half of the root was still wet.')),
        se((st) => (st.turvo || 0) >= 2, T('Fazer remédio bêbado é má ideia. Eu sabia disso e sentei mesmo assim.', 'Making medicine drunk is a bad idea. I knew it and sat down anyway.')),
      ],
      minijogo: 'bancada', bancada: { sessao: 'noite', sair: T('Dormir', 'Sleep') },
      depois: (st) => [(st.turvo || 0) >= 2 ? T('Dormi debaixo da Laje com o pote ainda morno ao lado.', 'I slept under the slab with the pot still warm beside me.')
        : T('Dormi debaixo da Laje com o cheiro da resina nas mãos.', 'I slept under the slab with the smell of resin on my hands.')],
      fimDeParte: true },

    // ===================================================== II · AS GOELAS
    { id: 'parte-II', parte: 'II', zona: 'goelas', fundo: { img: IMG('goelas'), kb: 'in', dim: .62, clima: 'poeira' },
      cartao: { num: 'II', nome: T('As Goelas', 'The Gullets'), epigrafe: T('A Pira não tem lugar. Tem fogo.', 'The Pyre has no place. It has a fire.'), fonte: T('dito Grakh', 'Grakh saying') },
      // a noite cura um pouco: a manhã devolve parte da cabeça
      aoEntrar: (st) => { st.turvo = Math.max(0, (st.turvo || 0) - 3); } },

    { id: 'b01', zona: 'goelas', fundo: { img: IMG('goelas'), kb: 'in', dim: .42, foco: '55% 55%', clima: 'poeira' }, capitular: true, bebe: true,
      narracao: 'assets/audio/voz/b01-goelas.mp3', narracaoLang: 'en',
      texto: [
        T('Eu nunca tinha visto tantos deles num lugar só, e já vi exércitos. Estavam em volta das Goelas em anéis, cem de fundura, os velhos mais perto da água e as crianças mais longe. Naquele dia, a Pira Errante era ali. Toda horda que ainda tinha pernas viera beber.', 'I had never seen so many of them in one place, and I have seen armies. They stood around the Gullets in rings, a hundred deep, the old ones nearest the water and the children farthest from it. That day the Wandering Pyre was there. Every horde that still had legs had come to drink.'),
        T('As Goelas são três gargantas na rocha que descem mais fundo do que uma corda consegue acompanhar. No fim da estação seca a água fica tão baixa que os Grakh descem meninos amarrados em cordas para encher os odres e os puxam de volta, pingando e orgulhosos.', 'The Gullets are three throats in the rock that go down farther than a rope can follow. At the end of the dry season the water sits so low that the Grakh lower boys on ropes to fill the skins, and haul them up again, dripping and proud.'),
        se((st) => st.shaa >= 1, T('Shaa me viu do outro lado do poço mais próximo e acenou com o braço todo.', 'Shaa saw me from across the nearest well and waved with her whole arm.')),
        se((st) => st.shaa < 1, T('Shaa estava junto do poço mais próximo, bebendo nas mãos. Não levantou os olhos.', 'Shaa was by the nearest well, drinking from her hands. She did not look up.')),
      ] },

    { id: 'b01t', zona: 'goelas', fundo: { img: IMG('ponto-troca'), kb: 'in', dim: .45, foco: '60% 55%', clima: 'poeira' }, bebe: true,
      texto: [
        T('Estendi o couro numa pedra chata acima do poço mais próximo. O que os Grakh tinham guardado na véspera, traziam agora. Na manhã de uma luta, um Grakh quer três coisas: uma picada que não incha, uma ferida que não abre e um cheiro que o outro lado não consegue seguir.', 'I spread my hide on a flat stone above the nearest well. Whatever the Grakh had been keeping back the day before, they brought now. On the morning of a fight a Grakh wants three things: a bite that will not swell, a wound that will not open, and a smell the other side cannot follow.'),
        (st) => (['antidoto', 'unguento', 'po'].every((id) => temPronto(st, id)) ? T('Eu tinha as três, em potes.', 'I had all three, in pots.')
          : T('Eu tinha o que a bancada tinha deixado fazer.', 'I had what the bench had let me make.')),
      ],
      minijogo: 'troca',
      depois: (st) => {
        const t = st.jogos.troca || {}, ok = Object.values(t.ok || {}).filter(Boolean).length, demais = t.demais || 0;
        return [
          ok === 3 && !demais ? T('Três trocas, três exatas. Ninguém agradeceu. Os Grakh não agradecem troca justa.', 'Three trades, three exact. Nobody thanked me. The Grakh do not thank anyone for a fair trade.')
            : ok < 3 ? T('Nem toda troca fechou. Quem não aceitou levantou e foi embora sem dizer nada.', 'Not every trade closed. Those who did not accept got up and left without a word.')
              : T('Dei mais do que era justo, e o que sobrava voltou para mim pelo couro.', 'I gave more than was fair, and the extra came back to me across the hide.'),
          se(tukkTrocou, T('O odre de água estava cheio.', 'The water skin was full.')),
          se((st) => !tukkTrocou(st), T('Eu continuava sem água.', 'I still had no water.')),
        ];
      } },

    { id: 'b02', zona: 'goelas', fundo: { video: VID('coluna'), img: IMG('coluna-redom'), dim: .38, foco: '40% 50%', lado: 'dir', clima: 'poeira' }, capitular: true, bebe: true,
      sons: [{ sfx: 'corneta-redom', p: 0, v: .6 }, { sfx: 'armadura-tinido', p: 1, v: .5 }, { voz: 'b02-tinido', p: 2 }],
      texto: [
        T('Vieram do leste na hora em que as sombras são mais curtas, em coluna, sem uma curva do primeiro ao último homem. Escudos, lanças, pano vermelho. Atrás deles, as armações de madeira das máquinas de cerco, puxadas por bois, balançando como pássaros lentos.', 'They came out of the east at the hour when shadows are shortest, in column, without a bend from the first man to the last. Shields, spears, red cloth. Behind them the timber frames of siege engines, dragged by oxen, nodding like slow birds.'),
        T('Na frente, debaixo de uma bandeira vermelha, vinha o Tinido.', 'At the front, under a red banner, rode the Tinn.'),
        T('Dois Grakh, feridos em alguma escaramuça anterior, estavam caídos no descampado entre as linhas. O Tinido levantou a mão, e a coluna parou e esperou, em pleno sol, enquanto outros Grakh corriam e arrastavam os dois para longe. Depois ele baixou a mão.', 'Two Grakh, wounded in some earlier skirmish, lay in the open between the lines. The Tinn raised his hand, and the column stopped and waited, in the full sun, while other Grakh ran out and dragged the two of them away. Then he lowered his hand.'),
        se(quieto, T('A coluna parou. Esperei que voltasse a andar.', 'The column stopped. I waited for it to move again.')),
        se(medido, T('Um comandante que para a coluna por dois feridos do inimigo. Guardei isso.', 'A commander who halts the column for two of the enemy’s wounded. I kept that.')),
        se(aceso, T('Um comandante que para um exército, em pleno sol, para o inimigo recolher os próprios feridos. Ou é um tolo, ou é o único homem ali que sabe exatamente o que está fazendo. Os dois tipos costumam morrer cedo.', 'A commander who halts an army, in the full sun, so the enemy can gather its own wounded. Either he is a fool, or he is the only man there who knows exactly what he is doing. Both kinds tend to die young.')),
      ],
      escolha: { id: 'olhar', pergunta: T('Aheryn olha para:', 'Aheryn looks at:'), opcoes: [
        { id: 'bandeira', tom: 'ironia', txt: T('A bandeira.', 'The banner.'),
          resultado: [T('Uma espada branca sobre vermelho e, como guarda, uma balança.', 'A white sword on red, and for a guard, a pair of scales.')] },
        { id: 'homem', tom: 'curiosidade', txt: T('O homem da frente.', 'The man in front.'), fundo: { img: IMG('tinido'), kb: 'in', dim: .38, foco: '70% 35%' },
          resultado: [T('Nem moço, nem velho. Sem elmo; levava-o debaixo do braço, e os homens dele podiam ver o seu rosto de qualquer ponto da coluna. Montava sem olhar para o chão.', 'Not young, not old. No helmet; he carried it under his arm, and his men could see his face from anywhere in the column. He rode without looking at the ground.')] },
        { id: 'maquinas', luzMin: 60, tom: 'curiosidade', txt: T('As máquinas de cerco.', 'The siege engines.'),
          resultado: [T('Trouxeram máquinas de cerco a um lugar sem muralhas. Não vinham sitiar nada. Vinham para ficar.', 'They had brought siege engines to a place with no walls. They had not come to besiege anything. They had come to stay.')] },
        { id: 'contar', tom: 'ironia', txt: T('Contá-los.', 'Count them.'),
          resultado: [T('Contei os estandartes e multipliquei pelo que costuma ficar debaixo de um estandarte. Mais homens do que Ghru tinha dito. Ghru tinha dito mais homens que areia.', 'I counted the standards and multiplied by what usually stands under a standard. More men than Ghru had said. Ghru had said more men than sand.')] },
      ] } },

    { id: 'b03', zona: 'batalha', estado: 'alerta', fundo: { img: IMG('choque'), kb: 'in', dim: .42, foco: '55% 50%', lado: 'dir', clima: 'poeira' }, bebe: true,
      aoEntrar: passaTempo('b03'),
      // a corneta e, logo atrás, o choque das linhas (guerra-comeca, o som que Marcelo mandou)
      sons: [{ sfx: 'corneta-redom', p: 2, v: .55 }, { sfx: 'guerra-comeca', p: 2, v: .8 }],
      texto: [
        T('Não houve conversa. Redom não manda arautos aos Grakh, e os Grakh não teriam esperado um deles terminar de falar. A coluna se abriu em linha a uns quinhentos passos dos poços, sem pressa nenhuma, e atrás dela os homens começaram a montar as máquinas, peça por peça. Tinham a tarde toda.', 'There was no parley. Redom sends no heralds to the Grakh, and the Grakh would not have waited for one to finish. The column opened into a line some five hundred paces from the wells, in no hurry at all, and behind it men began putting the engines together, piece by piece. They had all afternoon.'),
        T('Durante uma hora, nada. O sol batia igual nos dois lados. Os Grakh se juntaram na borda dos poços, com as lanças de caça fincadas na areia atrás deles. Contra Redom, eles lutam de maça: a ponta de uma lança escorrega no aço, e uma maça não precisa furar a armadura para quebrar o que está dentro. Começaram a bater os pés e o cabo das maças no chão, devagar no começo, depois cada vez mais depressa, até que o som deixou de vir de algum lugar e passou a vir da areia. Do lado de Redom, ninguém se mexeu. Então uma corneta tocou uma vez só, e a linha vermelha começou a andar.', 'For an hour, nothing. The sun beat on both sides alike. The Grakh gathered at the lip of the wells, their hunting spears planted in the sand behind them. Against Redom they fight with the mace: a spearpoint skids on steel, and a mace does not need to pierce the armour to break what is inside it. They began to beat their feet and the hafts of their maces on the ground, slowly at first, then faster and faster, until the sound stopped coming from anywhere and started coming from the sand. On Redom\'s side, no one moved. Then a horn sounded, once, and the red line began to walk.'),
        T('Então as linhas se encontraram, e por um tempo não houve nada para ver além de homens e Grakh tentando ocupar o mesmo pedaço de chão.', 'Then the lines met, and for a while there was nothing to see but men and Grakh trying to occupy the same piece of ground.'),
        T('Tukk estava na frente. Uma semana antes, não conseguia ficar de pé. Agora levava uma lança no ombro, quebrava a haste e seguia.', 'Tukk was at the front. A week before, he could not stand. Now he was taking a spear in the shoulder, snapping off the shaft, and going on.'),
        se((st) => !sobrio(st), T('O vento trouxe alguma coisa. Poeira, sangue. Eu não estava em condições de separar uma da outra.', 'The wind brought something. Dust, blood. I was in no state to tell one from the other.')),
      ],
      pensa: [{ id: 'unguento', voz: 'p-cheiro', se: sobrio, atraso: 9000, luz: 3, flag: 'sentiu_unguento', tomSeguir: 'curiosidade', tomConter: 'frieza',
        t: T('Esse cheiro eu conheço.', 'I know that smell.'),
        mais: T('O vento mudou e me trouxe, através da poeira, do sangue e do suor de mil corpos, um cheiro que eu conhecia melhor que qualquer um deles: resina, raiz amarga, a argila cinza em que eu moo as duas. O meu unguento. Estava em metade dos Grakh daquela linha.', 'The wind changed, and brought me, through dust and blood and the sweat of a thousand bodies, a smell I knew better than any of them: resin, bitter root, the grey clay I grind them in. My ointment. It was on half the Grakh in that line.'),
        conter: T('Deixei o cheiro ir embora com o vento. Há coisas que é melhor não reconhecer em público.', 'I let the smell go with the wind. Some things are better not recognized in public.'),
        beber: T('Bebi antes que o cheiro virasse nome.', 'I drank before the smell could become a name.') }] },

    { id: 'b04', zona: 'eclipse', estado: 'alerta',
      pensa: [{ id: 'tabelas', voz: 'p-tabelas', luzMin: 31, atraso: 15000, luz: 4, tomSeguir: 'curiosidade', t: T('As tabelas.', 'The tables.'),
        mais: T('Eu as tinha visto uma vez, gravadas em bronze, numa sala onde se falava baixo. Linhas de números que terminavam numa data. Esta, talvez, se eu ainda soubesse ler o fim da linha.', 'I had seen them once, cut into bronze, in a room where people spoke in murmurs. Lines of numbers that ran down to a date. This one, perhaps, if I could still read the end of the line.') }],
      trai: { se: temPedra, luz: 3, atraso: 26000 }, fundo: { video: VID('eclipse'), img: IMG('eclipse-comeca'), dim: .3, foco: '60% 30%', clima: 'cinza', umaVez: true },
      sons: [{ voz: 'b04-minutos', p: 1 }],
      texto: [
        T('A luz mudou primeiro. Ficou rala e estranha, da cor de luz atravessando um vidro sujo, e as sombras das lanças ganharam bordas nítidas, nítidas demais, como recortadas a faca. O calor saiu do ar de uma vez. Depois os pássaros pararam.', 'The light changed first. It went thin and strange, the colour of light through dirty glass, and the shadows of the spears grew edges, too sharp, as if cut with a knife. The heat went out of the air all at once. Then the birds stopped.'),
        T('Olhei para cima, porque todos olhavam para cima. Tinham arrancado uma mordida preta do sol. Eu sabia o que era. Sabia desde antes de qualquer pessoa naquele campo ter nascido: a lua passando na frente, como passa uma vez na vida de alguém, em algum lugar do mundo. O meu povo tinha tabelas para isso. As tabelas queimaram junto com o meu povo. Sobrou um fato velho, que eu disse para mim mesmo, baixinho: não dura. Minutos. Um punhado.', 'I looked up, because everyone was looking up. A black bite had been taken out of the sun. I knew what it was. I had known since before anyone on that field was born: the moon, crossing in front, as it does once in a lifetime, somewhere in the world. My people had tables for it. The tables burned with my people. What was left was one old fact, which I said to myself under my breath: it does not last. Minutes. A handful.'),
        T('Do lado de Redom, a linha começou a envergar. Homens baixavam os escudos para apontar o céu, e em algum lugar das fileiras uma voz achou as palavras que o país deles usa para o ano em que o meu povo foi extinto, e as palavras correram a linha mais depressa que qualquer ordem.', 'On the Redom side the line began to bend. Men lowered their shields to point at the sky, and somewhere in the ranks a voice found the words their country uses for the year my people were put out, and the words ran down the line faster than any order.'),
        T('— As luzes! As luzes estão se apagando!', '— The lights! The lights are going out!'),
        T('Do outro lado, os Grakh começaram a urrar. Ghru estava na borda do poço mais próximo, os dois braços para cima, gritando a frase velha para o céu sem riso nenhum nos ombros.', 'On the other side, the Grakh began to roar. Ghru was on the rim of the nearest well, both arms up, shouting the old line at the sky with no laugh in his shoulders at all.'),
        T('— Dia ser comido! Dia ser comido!', '— Day be eaten! Day be eaten!'),
        T('E no meio de tudo isso, uma voz que eu ouvia do outro lado do campo, porque era o único homem ali gritando alguma coisa útil:', 'And in the middle of it, one voice I could hear across the whole field, because he was the only man there shouting something useful:'),
        T('— Firmes! É só o escuro! Segurem a linha!', '— Hold! It is only the dark! Hold the line!'),
        T('O Tinido. Não olhou para cima nem uma vez. A essa altura eu também tinha parado de olhar. Éramos os dois únicos naquele campo que sabiam que o escuro ia passar. Eu tinha dito isso baixinho, para mim mesmo. Ele gritava para a linha inteira.', 'The Tinn. He never once looked up. By then I had stopped looking too. We were the only two on that field who knew the dark would pass. I had said it under my breath, to myself. He was shouting it to his whole line.'),
        se(temPedra, T('No bolso, a pedra tinha ficado violeta, a cor que ela não tem em nenhuma outra luz, e fechei a mão em volta dela.', 'In my pocket the stone had gone violet, a colour it has in no other light, and I closed my hand over it.')),
      ],
      fimDeParte: true },

    // ===================================================== III · O DIA COMIDO
    { id: 'parte-III', parte: 'III', zona: 'eclipse', fundo: { img: IMG('codex-eclipse'), kb: 'in', dim: .55, clima: 'cinza' },
      cartao: { num: 'III', nome: T('O Dia Comido', 'The Eaten Day'), epigrafe: T('O que se apaga no céu se apaga nos homens.', 'What goes out in the sky goes out in men.'), fonte: T('nota Lúmae à margem, sem assinatura', 'Lúmae note in a margin, unsigned') } },

    { id: 'c01', zona: 'eclipse', fundo: { img: IMG('goelas-escuro'), kb: 'in', dim: .4, foco: '50% 50%', clima: 'cinza' }, bebe: true,
      sons: [{ voz: 'c01-cinco', p: 0 }],
      texto: [
        T('Eu tinha, pelas contas mais velhas que conheço, cinco minutos. Talvez seis.', 'I had, by the oldest arithmetic I know, five minutes. Perhaps six.'),
        (st) => (quieto(st) ? T('No escuro, eu era só mais uma sombra entre milhares.', 'In the dark I was just one more shadow among thousands.')
          : medido(st) ? T('Debaixo do pano do pulso corria um fio de luz. Mantive o braço junto do corpo.', 'Under the cloth at my wrist ran a thread of light. I kept the arm against my body.')
          : T('No escuro, a luz debaixo da minha pele era a coisa mais clara do campo. E o norte tem olhos.', 'In the dark, the light under my skin was the brightest thing on the field. And the north has eyes.')),
      ],
      minijogo: 'minutos',
      aoTerminar: (st, r, k) => {
        const f = (r && r.feitas) || [];
        if (f.includes('ouvir')) st.f.ouviu_oficial = true;
        if (f.includes('po')) { const q = usaMelhor(st, 'po'); st.f.po_q = q ? q.q : 'medio'; st.f.abriu_guarda = true; st.hessa += 1; k.toast(T('Hessa vai lembrar disso.', 'Hessa will remember that.')); }
        if (f.includes('tukk')) { st.f.salvou_tukk = true; st.pira += 1; }
        if (f.includes('shaa')) { st.f.junto_shaa = true; st.shaa += 1; }
        if (f.includes('esconder')) st.f.escondeu = true;
        st.tom.ternura = (st.tom.ternura || 0) + (f.includes('shaa') ? 1 : 0) + (f.includes('tukk') ? 1 : 0);
        st.tom.curiosidade = (st.tom.curiosidade || 0) + (f.includes('ouvir') ? 1 : 0);
        st.tom.frieza = (st.tom.frieza || 0) + (f.includes('esconder') ? 1 : 0);
        // a luz alta no escuro chama os Tacets: conferida no fim dos minutos, depois de quem bebeu no minijogo
        if (st.luz >= 60) st.f.tacets_eclipse = true;
      },
      depois: [T('Eu tinha gastado os meus minutos. O escuro tinha talvez mais um.', 'I had spent my minutes. The dark had perhaps one left.')] },

    { id: 'c02', zona: 'eclipse', estado: 'alerta', fundo: { video: VID('tinido-cai'), img: IMG('hessa-tinido'), dim: .3, foco: '70% 40%', clima: 'cinza', umaVez: true },
      sons: [{ p: 4, fn: (A) => A.sfx('golpe', .7, () => { A.hiss(.2, 900, 1, .3); A.tone(80, .4, 'sine', .3, .05, .5); }) }],
      texto: [
        // um parágrafo só (o som do golpe está amarrado ao índice): a rota do pó, a qualidade do pó e o olhar de Hessa
        (st) => {
          const olha = hessaBem(st), pt = [], en = [];
          if (st.f.abriu_guarda && st.f.po_q !== 'ruim') { pt.push('Sem os cavalos, o Tinido foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro pelo vão que os cavalos tinham deixado, direto para ele, e nada se pôs no caminho dela, porque eu tinha cuidado disso.'); en.push('With his horses gone, the Tinn went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark through the gap the horses had left, straight at him, and nothing stood in her way, because I had seen to that.'); }
          else if (st.f.abriu_guarda) { pt.push('Metade dos cavalos disparou, e o Tinido desceu do dele e foi a pé até onde a linha se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro pelo vão que os cavalos tinham deixado, mas o vão fechou pela metade, e ela atravessou dois homens para passar.'); en.push('Half the horses bolted, and the Tinn got down from his and went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark through the gap the horses had left, but the gap closed halfway, and she went through two men to get past.'); }
          else { pt.push('O Tinido desceu do cavalo e foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro direto para ele, atravessando três homens que estavam no caminho, e chegou ao outro lado deles sangrando no braço e sem diminuir o passo.'); en.push('The Tinn got down from his horse and went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark straight at him, through three men who were in her way, and came out the other side of them bleeding from the arm and no slower.'); }
          // o olhar entra entre o Tinido e a corrida dela
          if (olha) return T(pt[0].replace('Hessa saiu do escuro', 'Hessa olhou uma vez para onde eu estava. Depois saiu do escuro'), en[0].replace('Hessa came out of the dark', 'Hessa looked once toward where I was. Then she came out of the dark'));
          return T(pt[0], en[0]);
        },
        T('Ele a viu chegando. Firmou os pés.', 'He saw her coming. He set his feet.'),
        T('Um besteiro atrás dele ergueu a arma na direção dela. Sem virar a cabeça, o Tinido estendeu a mão esquerda e empurrou a besta para baixo.', 'A crossbowman behind him raised his weapon toward her. Without turning his head, the Tinn put out his left hand and pushed the bow down.'),
        se(matou, T('Eu já tinha estado do outro lado de uma besta, uma vez. Respondi com a espada. Ele respondeu com a mão.', 'I had been on the other end of a crossbow once. I answered it with a sword. He answered it with his hand.')),
        T('Então ela chegou.', 'Then she was on him.'),
        T('Três golpes. Ele desviou o primeiro. Desviou o segundo, e isso lhe custou a espada. O terceiro desceu onde o pescoço encontra o ombro, e ele caiu de joelhos, e depois de frente na areia, e até o chão não tirou os olhos dela.', 'Three blows. He turned the first. He turned the second, and it cost him the sword. The third came down where the neck meets the shoulder, and he went to his knees, and then forward onto the sand, and all the way to the ground he did not take his eyes off her.'),
        T('Hessa ficou de pé sobre ele no escuro. Não ergueu a maça de novo.', 'Hessa stood over him in the dark. She did not raise the mace again.'),
        se(medido, T('Eu não tirei os olhos dele.', 'I did not take my eyes off him.')),
        se(aceso, T('Morreu olhando para quem o matava. Os Lúmae tinham uma palavra para isso, para a última cortesia entre dois soldados. Esqueci qual.', 'He died looking at the one who killed him. The Lúmae had a word for that, for the last courtesy between two soldiers. I have forgotten which.')),
        se((st) => !!st.f.ouviu_oficial, T('Agora eu sabia por que ele tinha vindo de tão longe, em pessoa. Isso não tornou mais fácil assistir.', 'I knew now why he had come all this way himself. It did not make watching easier.')),
        se((st) => !!st.f.escondeu, T('Assisti a tudo das pedras, de onde não me alcançava.', 'I watched it all from the rocks, where it could not reach me.')),
      ] },

    { id: 'c03', zona: 'batalha', estado: 'alerta',
      aoEntrar: passaTempo('c03'),
      trai: { luz: 6, atraso: 15000, voz: 'c03-trai', texto: [T('No quinto, a luz saiu de mim, até o rosto, e eu não fiz nada para segurá-la. Não havia mais nada para esconder de ninguém.', 'At the fifth, the light came out of me, up to my face, and I did nothing to hold it. There was nothing left to hide from anyone.')] }, fundo: { clip: CLIP('luz-volta'), img: IMG('luz-volta'), dim: .35, foco: '70% 40%', clima: 'poeira' },
      sons: [{ sfx: 'virotes', p: 1, v: .75, fim: true }, { sfx: 'virote-impacto', p: 3, v: .6 }, { voz: 'c03-sol-volta', p: 0 }],
      texto: [
        T('Então o sol voltou. Primeiro uma única conta branca na beira do escuro, depois uma lâmina, e todas as sombras do campo giraram de uma vez, e homens que gritavam um instante antes ficaram piscando uns para os outros.', 'Then the sun came back. First a single white bead on the rim of the dark, then a blade of it, and every shadow on the field swung around at once, and men who had been shouting a moment before stood blinking at each other.'),
        T('Redom recuou, e recuou bem, o que é mais difícil do que avançar bem: em ordem, os escudos travados, levando o Tinido entre quatro homens, em cima da própria capa. Os besteiros vinham de costas na retaguarda, como são treinados a fazer, e na última elevação se viraram e soltaram uma salva contra a multidão nos poços, como também são treinados a fazer.', 'Redom fell back, and fell back well, which is harder than advancing well: in order, shields locked, carrying the Tinn between four men on his own cloak. The crossbowmen walked backward at the rear, as they are trained to, and at the last rise they turned and loosed one volley into the crowd at the wells, as they are also trained to.'),
        se(olhouBesta, T('Vi o dedo do primeiro besteiro sair do lado do gatilho e ir para cima dele. Já tinha visto aquilo uma vez, na neve. Daquela vez, eu estava na frente.', 'I saw the first crossbowman’s finger leave the side of the trigger and settle onto it. I had seen that once before, in the snow. That time, I was the one in front of it.')),
        T('Não havia mais mão nenhuma para empurrar as bestas para baixo.', 'There was no hand left to push the bows down.'),
        se((st) => !!st.f.junto_shaa, T('Eu segurava o braço de Shaa quando a acertaram. Senti cada um chegar, pelo corpo dela, até a minha mão. Cinco. Depois pus a outra mão na barriga dela, e a cria ainda se mexia.', 'I was holding Shaa’s arm when they hit her. I felt each one arrive through her body into my hand. Five. Then I put my other hand on her belly, and the child was still moving.')),
        se((st) => !st.f.junto_shaa, T('Quando cheguei ao poço, Shaa estava caída de lado na borda. Cinco virotes. Pus a mão na barriga dela, e a cria chutou.', 'When I reached the well, Shaa was lying on her side on the rim. Five bolts. I put my hand on her belly, and the child kicked.')),
      ],
      fimDeParte: true },

    // ===================================================== IV · O NOME
    { id: 'parte-IV', parte: 'IV', zona: 'roda', fundo: { img: IMG('roda'), kb: 'in', dim: .6, clima: 'poeira' },
      cartao: { num: 'IV', nome: T('O Nome', 'The Name'), epigrafe: T('O primeiro som é o primeiro nome.', 'The first sound is the first name.'), fonte: T('costume Grakh', 'Grakh custom') } },

    { id: 'd01', zona: 'roda', fundo: { clip: CLIP('roda'), img: IMG('roda'), dim: .35, foco: '40% 55%', lado: 'dir', clima: 'poeira' }, capitular: true,
      aoEntrar: passaTempo('d01'),
      narracao: 'assets/audio/voz/d01-roda.mp3', narracaoLang: 'en',
      texto: [
        T('Vieram sem serem chamados. Os sobreviventes dos poços, os feridos e os ilesos, atravessaram a areia de um em um, de dois em dois, e ficaram em volta de nós, de Shaa e de mim, até virarem uma parede, cem de fundura, e nenhuma luz passava por ela além da que vinha de cima.', 'They came without being called. The survivors of the wells, the wounded and the unhurt, came across the sand in ones and twos and stood around us, around Shaa and me, until there was a wall of them, a hundred deep, and no light came through it but what came from above.'),
        T('Ninguém falou. Eu nunca tinha ouvido cem Grakh juntos sem fazer som nenhum.', 'Nobody spoke. I had never heard a hundred Grakh together make no sound at all.'),
        T('O dia tinha sido comido. Todos tinham ouvido isso cem vezes, da boca dos velhos, com uma risada. Agora estavam em roda em volta de uma mulher morrendo cuja barriga ainda se mexia, e ninguém ria.', 'The day had been eaten. They had all heard it said a hundred times, by the old, with a laugh. Now they stood in a ring around a dying woman whose belly was still moving, and nobody was laughing.'),
        se((st) => !!st.f.mostrou_luz, T('Shaa achou o meu pulso na areia e o puxou, fraca, para o mesmo lugar onde o tinha puxado na véspera.', 'Shaa found my wrist on the sand and pulled it, weakly, to the same place she had pulled it the day before.')),
      ] },

    { id: 'd02', zona: 'roda', fundo: { img: IMG('arma-no-chao'), kb: 'in', dim: .42, foco: '70% 50%', lado: 'dir', clima: 'poeira' },
      sons: [{ sfx: 'marreta-chao', p: 1, v: .7 }],
      texto: [
        T('A parede se abriu, e Hessa passou por ela.', 'The wall opened, and Hessa came through it.'),
        T('Ela parou onde sempre parava. Então deu o último passo, o que nunca tinha dado, e deixou a maça escorregar das costas para a areia, aos meus pés.', 'She stopped where she always stopped. Then she took the last step, the one she had never taken, and let the mace slide off her back onto the sand at my feet.'),
        se((st) => (c1(st).aug || 0) >= 1, T('O último que me acompanhou além da distância de sempre era do tamanho de uma pedra, e também não disse nada.', 'The last one who walked with me past the usual distance was the size of a boulder, and he did not say anything either.')),
        se((st) => !st.f.cuidou_hessa, T('O braço ainda sangrava. Ela não tinha amarrado.', 'Her arm was still bleeding. She had not tied it.')),
        T('Era a mão que sempre estivera pousada naquele cabo. Agora, vazia, fechou, e abriu.', 'It was the hand that had always rested on that haft. Now, empty, it closed, and opened.'),
        (st) => (st.hessa >= 1 ? T('— O que você guarda debaixo do pano. Use. Estou pedindo.', '— What you keep under the cloth. Use it. I am asking.')
          : st.hessa <= -1 ? T('— Eu sei o que você é. Não me importa. Salve a cria.', '— I know what you are. I do not care. Save the child.')
            : T('— Seja lá o que você for. Agora.', '— Whatever it is you are. Now.')),
        T('Ela não terminou o que vinha depois disso. A boca ficou aberta um instante, e fechou.', 'She did not finish whatever came after that. Her mouth stayed open a moment, and closed.'),
        T('Os Grakh não pedem. Pegam, trocam ou morrem sem.', 'The Grakh do not ask. They take, they trade, or they die without.'),
      ],
      escolha: { id: 'pedido', pergunta: T('Responder a Hessa:', 'Answer Hessa:'), opcoes: [
        { id: 'parte', tom: 'ironia', hessa: 1, txt: T('“Você já pôs a sua parte no couro.”', '“You have already put your part on the hide.”'),
          resultado: [T('— Você já pôs a sua parte no couro.', '— You have already put your part on the hide.'), T('Ela olhou a maça na areia como se a visse pela primeira vez. Depois ajoelhou do outro lado de Shaa.', 'She looked at the mace on the sand as if she were seeing it for the first time. Then she knelt on the other side of Shaa.')] },
        { id: 'graxa', se: (st) => !st.f.cuidou_hessa && temPronto(st, 'unguento'), tom: 'ternura', hessa: 1, flag: 'cuidou_hessa', txt: T('Abrir o pote de graxa cinza e passar no braço dela.', 'Open the pot of grey grease and put it on her arm.'),
          resultado: [T('Passei a graxa no corte com dois dedos. Ela deixou. Olhou para o braço, depois para mim, e ajoelhou do outro lado de Shaa.', 'I worked the grease into the cut with two fingers. She let me. She looked at the arm, then at me, and knelt on the other side of Shaa.')] },
        { id: 'assentir', tom: 'ternura', txt: T('Assentir.', 'Nod.'),
          resultado: [T('Assenti uma vez. Ela soltou o ar que estava segurando desde o poço.', 'I nodded once. She let out the breath she had been holding since the well.')] },
        { id: 'calar', silencio: true, luzMax: 80, tom: 'frieza',
          resultado: [T('Ajoelhei sem dizer nada.', 'I knelt without a word.')] },
      ] },
      aoSair: (st) => { if (st.escolhas.pedido === 'graxa') usaMelhor(st, 'unguento'); } },

    { id: 'd03', zona: 'roda', fundo: { img: IMG('cantil-areia'), kb: 'in', dim: .45, foco: '75% 50%', lado: 'dir', clima: 'poeira' },
      sons: [{ voz: 'd03-pensar', p: 0 }],
      texto: [
        T('Para fazer o que ela pedia eu teria de pensar. Não os pensamentos pequenos que deixo passar em dia de chuva: tudo, de uma vez, como eu pensava antes, como fez o meu povo ser visto. E para pensar eu teria de parar de beber.', 'To do what she was asking I would have to think. Not the small thoughts I let through on rainy days: all of it, all at once, the way I used to think, the way that got my people seen. And to think, I would have to stop drinking.'),
        (st) => (st.cantil > 0 ? T('O odre de vinho de cacto pendia do meu quadril, como sempre. Ainda havia um pouco.', 'The skin of cactus wine hung at my hip, as always. There was some left.')
          : T('O odre de vinho de cacto pendia do meu quadril, vazio. Eu tinha cuidado disso mais cedo, um gole de cada vez.', 'The skin of cactus wine hung at my hip, empty. I had seen to that earlier, one swallow at a time.')),
      ],
      escolha: { id: 'odre', pergunta: T('O odre:', 'The skin:'), opcoes: [
        { id: 'derramar', tom: 'ternura', flag: 'derramou', som: 'agua-areia', txt: T('Derramar na areia.', 'Pour it out on the sand.'),
          resultado: (st) => [st.cantil > 0 ? T('Tirei a tampa, virei o odre e deixei escorrer na areia, como Hessa tinha feito com o que eu lhe oferecera. A areia bebeu mais depressa do que eu jamais bebi.', 'I pulled the stopper, turned the skin over and let it run out onto the sand, as Hessa had done with what I offered her. The sand drank it faster than I ever have.')
            : T('Não havia nada para derramar. Virei o odre e sacudi, e caíram umas gotas.', 'There was nothing to pour. I turned the skin over and shook it, and a few drops fell.')] },
        { id: 'entregar', tom: 'ironia', flag: 'deuOdre', txt: T('Entregar a Hessa.', 'Give it to Hessa.'),
          resultado: [T('Estendi para ela. Ela pegou sem olhar e ficou segurando, sem saber onde pôr.', 'I held it out to her. She took it without looking and stood holding it, not knowing where to put it.')] },
        { id: 'gole', tom: 'frieza', gole: true, riscavel: true, se: (st) => st.cantil > 0, motivo: T('o odre está vazio', 'the skin is empty'), txt: T('Um último gole.', 'One last swallow.'),
          resultado: [T('Mais um. Pela firmeza da mão, disse a mim mesmo.', 'One more. For the steadiness of the hand, I told myself.')] },
      ] },
      aoSair: (st) => { if (st.escolhas.odre !== 'gole') st.cantil = 0; } },

    { id: 'd04', zona: 'roda', fundo: { img: IMG('shaa-luz'), kb: 'in', dim: .4, foco: '50% 45%', clima: 'poeira' }, capitular: true,
      sons: [{ voz: 'd04-mao', p: -1, se: tocouProibido }, { voz: 'd04-magia', p: 0 }],
      texto: [
        T('Conheço dois tipos de magia. Um é uma cortesia que se pede ao mundo, como pedir ao vizinho que tire a carroça do caminho; o gelo me fez esse favor por cinquenta anos. O outro não pede. É enfiar a mão no pano de que o mundo é tecido e puxar um fio, e cada fio puxado acende você como uma lamparina numa janela, para qualquer coisa que saiba olhar.', 'I know two kinds of magic. One is a courtesy you ask of the world, like asking a neighbour to move his cart; the ice did me that favour for fifty years. The other does not ask. It is reaching into the cloth the world is woven from and pulling a thread, and every thread you pull lights you up like a lamp in a window, for anything that knows how to look.'),
        se((st) => (c1(st).gelunah || 0) >= 1, T('Pedi ao frio primeiro. Por hábito, por afeto, não sei. Não havia frio a quem pedir. Havia areia por cem léguas em todas as direções, e a areia nunca me fez cortesia nenhuma.', 'I asked the cold first. From habit, from affection, I do not know. There was no cold to ask. There was sand for a hundred leagues in every direction, and the sand has never once done me a courtesy.')),
        se((st) => ((st.jogos.ressaca && st.jogos.ressaca.subiram) || []).includes('menina'), T('Pensei na menina da febre, e na cura dobrada bem pequena na minha cabeça, onde guardo tudo o que não me é permitido usar.', 'I thought of the girl with the fever, and of the cure folded small in my head, where I keep everything I am not allowed to use.')),
        se((st) => afogou(st, 'magia'), T('Na Borda do Mundo, eu tinha bebido aquela porta até ela fechar. Não tinha tranca. Só estava esperando.', 'At the Edge of the World, I had drunk that door shut. It had no lock. It had only been waiting.')),
        se(tocouProibido, T('A mão subiu, a mesma mão, à mesma altura. Desta vez seguiu.', 'The hand rose, the same hand, to the same height. This time it kept going.')),
      ],
      // com tempo, como o proibido do Cap. I: se o leitor não decide, Aheryn vai buscar só a cria
      escolha: { id: 'proibido5', janela: 9, padrao: 'crianca', pergunta: T('O que Aheryn vai buscar?', 'What does Aheryn reach for?'), opcoes: [
        { id: 'dois', tom: 'ternura', luz: 8, txt: T('Os dois: a mãe e a cria.', 'Both of them: the mother and the child.'),
          resultado: [T('Dois corações. Um lento e falhando, um rápido e furioso. Eu ia segurar os dois, ou tentar. Fui o melhor do meu povo exatamente nesse tipo de arrogância.', 'Two hearts. One slow and failing, one fast and furious. I would hold both, or try. I was the best of my people at exactly this kind of arrogance.')] },
        { id: 'crianca', tom: 'frieza', txt: T('Só a cria.', 'Only the child.'),
          resultado: [T('Um coração. O pequeno, o rápido. O de Shaa deixei onde estava, aquietando sozinho, e espero nunca me perguntarem se aquilo foi sabedoria ou aritmética.', 'One heart. The small, fast one. Shaa’s I left where it was, going quiet on its own, and I hope never to be asked whether that was wisdom or arithmetic.')] },
      ] } },

    { id: 'd05', zona: 'roda', fundo: { clip: CLIP('veias'), img: IMG('aheryn-acende'), dim: .32, foco: '60% 35%', lado: 'dir', clima: 'brasas' },
      aoEntrar: (st) => { if (!st.f.tinturaParto && temPronto(st, 'tintura')) { const q = usaMelhor(st, 'tintura'); st.f.tinturaParto = q ? q.q : 'medio'; } },
      texto: [
        T('Ajoelhei na areia com as mãos sobre ela e parei de segurar os pensamentos para baixo.', 'I knelt in the sand with my hands on her and stopped holding my thoughts down.'),
        se((st) => !!st.f.tinturaParto, T('Antes, pus a tintura na boca de Shaa, o frasco todo, e esperei três respirações.', 'First I put the tincture in Shaa’s mouth, the whole flask, and waited three breaths.')),
        se(hessaBem, T('Hessa segurou os ombros de Shaa por trás, sem que eu pedisse.', 'Hessa held Shaa’s shoulders from behind, without my asking.')),
        se((st) => hessaFaixa(st) === 'hostil', T('Hessa ficou de pé atrás de mim, com a maça de volta na mão.', 'Hessa stood behind me, the mace back in her hand.')),
      ],
      minijogo: 'parto',
      aoTerminar: (st, r) => {
        const fl = (r && r.flares) || 0;
        st.tacetsCedo = (parto(st) === 'dois' ? 1 : 0) + (fl >= 3 ? 1 : 0) + (st.f.tacets_eclipse ? 1 : 0) + (st.f.tacets_noite ? 1 : 0);
        st.f.shaa_viva = parto(st) === 'dois' && !!(r && r.shaa);
      },
      depois: [
        T('A luz subiu por mim como água subindo num poço, toda ela, cada linha ao mesmo tempo, a testa, a garganta, o peito, os braços, até os rostos da roda ficarem iluminados de ouro por baixo e eu poder ver cada um deles, e cada um deles poder me ver.', 'The light came up through me like water up a well, all of it, every line at once, the forehead, the throat, the chest, the arms, until the faces in the ring were lit gold from below and I could see every one of them, and every one of them could see me.'),
        se(marcado, T('Pelo antebraço onde o bronze tinha fechado, nada passou. A luz deu a volta.', 'Through the forearm where the bronze had closed, nothing came. The light went around it.')),
        T('— Aqui. A lâmina, aqui. Não mais fundo que o seu polegar.', '— Here. The blade, here. No deeper than your thumb.'),
        T('Hessa ajoelhou do outro lado de Shaa com uma faca curta e curva e fez exatamente o que eu disse.', 'Hessa knelt on the other side of Shaa with a short curved knife and did exactly what I told her.'),
      ] },

    { id: 'd06', zona: 'roda', fundo: { img: IMG('maos-hessa'), kb: 'in', dim: .38, foco: '55% 50%', lado: 'dir', clima: 'brasas' },
      narracao: 'assets/audio/voz/d06-som.mp3', narracaoLang: 'en',
      sons: [{ fn: (A) => { A.kronk(); document.body.classList.remove('impacto'); void document.body.offsetWidth; document.body.classList.add('impacto'); }, p: 1, fim: true }, { p: 4, fim: true, fn: (A) => A.sfx('choro-cria', .8, () => { A.tone(220, .9, 'sawtooth', .05, 0, .7); A.tone(180, 1.2, 'sawtooth', .04, .5, .6); }) }],
      texto: [
        T('Vou contar uma vez, do jeito que foi.', 'I will tell it once, as it was.'),
        T('Houve um som. Primeiro um estalo, seco e curto, como madeira verde, como cartilagem cedendo. Depois um baque, grave e molhado, de alguma coisa pesada se soltando para dentro de mãos que estavam prontas para ela.', 'There was a sound. First a crack, dry and short, like green wood, like cartilage giving way. Then a thud, low and wet, of something heavy coming free into hands that were ready for it.'),
        T('Depois, nada. A roda não respirou. A cria nas mãos de Hessa também não respirou, pelo tempo que um coração leva para decidir.', 'Then nothing. The ring did not breathe. The child in Hessa’s hands did not breathe either, for as long as it takes a heart to decide.'),
        T('Depois respirou.', 'Then it did.'),
        T('Urrou, pequena e furiosa, para o céu, para o sol que tinha voltado, para todos nós. Os Grakh choram assim.', 'It roared, small and furious, at the sky, at the sun that had come back, at all of us. That is how the Grakh cry.'),
        se((st) => armadilha(st) === 'salvar', T('Os olhos estavam abertos, virados para mim, como os daquele da cova, na Borda do Mundo.', 'Its eyes were open, and turned on me, like the one in the pit at the Edge of the World.')),
      ] },

    { id: 'd07', zona: 'roda',
      pensa: [{ id: 'maior', voz: 'p-maior', luzMin: 60, atraso: 24000, luz: 3, tomSeguir: 'ternura', t: T('Maior.', 'Greatest.'),
        mais: T('Uma vez me deram uma palavra assim, e uma canção para carregá-la. Que sirva melhor nele.', 'Once they gave me a word like that, and a song to carry it. May it fit him better.') }], fundo: { img: IMG('recem-nascido'), kb: 'out', dim: .4, foco: '60% 50%', lado: 'dir', clima: 'brasas' },
      sons: [{ p: 4, fim: true, fn: rodaDizONome, se: (st) => !shaaViva(st) }, { p: 5, fim: true, fn: rodaDizONome, se: shaaViva }, { voz: 'd07-pergunta', p: -1 }],
      texto: [
        (st) => (shaaViva(st) ? T('Shaa ainda estava ali. O coração lento batia debaixo da minha outra mão, fraco, mas no mesmo lugar. Hessa deitou a cria na dobra do braço dela, e Shaa olhou para ela, de cima a baixo, sem pressa.', 'Shaa was still there. The slow heart was beating under my other hand, weak, but in the same place. Hessa laid the child in the crook of her arm, and Shaa looked it over from top to bottom, taking her time.')
          : parto(st) === 'dois' ? T('Shaa ainda estava ali. Eu a tinha segurado até ali. Ela estendeu a mão, e Hessa deitou a cria na dobra do braço dela, e Shaa olhou para ela, de cima a baixo, sem pressa.', 'Shaa was still there. I had held her that long. She put out a hand, and Hessa laid the child in the crook of her arm, and Shaa looked it over from top to bottom, taking her time.')
          : T('Shaa quase não estava mais ali. Os olhos dela acharam o som antes de achar a cria.', 'Shaa was almost gone. Her eyes found the sound before they found the child.')),
        T('— Kronk…', '— Kronk…'),
        T('Era o som. Era o primeiro som, o que ele fez ao chegar ao mundo, e ela o tinha ouvido, e o devolvia a ele como nome, que é a lei mais antiga que os Grakh têm.', 'That was the sound. That was the first sound, the one he made coming into the world, and she had heard it, and she gave it back to him as a name, which is the oldest law the Grakh have.'),
        se((st) => !shaaViva(st), T('Então ela parou de respirar, quieta, sem alarde.', 'Then she stopped breathing, quietly, without any fuss.')),
        se(shaaViva, T('Depois achou o meu pulso na areia e deu dois tapinhas nele.', 'Then she found my wrist in the sand and gave it two small pats.')),
        se(shaaViva, T('— Shaa ficar.', '— Shaa stay.')),
        se((st) => armadilha(st) === 'frio' && !shaaViva(st), T('Contei a respiração dela até não haver mais nenhuma, como uma vez contei na beira de uma cova na neve. É a única reza que sei.', 'I counted her breaths until there were none, as I once counted at the edge of a pit in the snow. It is the only prayer I know.')),
        T('A roda disse o nome. Um por um, baixo, de dentro para fora. Kronk. Kronk. Kronk.', 'The ring said the name. One by one, low, from the inside out. Kronk. Kronk. Kronk.'),
        T('E Ghru, junto do meu ombro, sem riso nenhum:', 'And Ghru, at my shoulder, with no laugh anywhere in him:'),
        T('— Dia ser comido. Maior nascer.', '— Day be eaten. Greatest be born.'),
        T('Eu sabia o que tinha comido o dia. Uma pedra no céu passando na frente de um fogo no céu, como faz desde antes de existirem Grakh para dar nome a isso. Eu sabia tudo isso. O que eu não sabia era o que aquilo significava, e eu era o único naquela roda que achava que essas eram duas perguntas diferentes.', 'I knew what had eaten the day. A stone in the sky crossing in front of a fire in the sky, as it has done since before there were Grakh to name it. I knew all of that. What I did not know was what it meant, and I was the only one in that circle who thought those were two different questions.'),
      ] },

    { id: 'd08', zona: 'roda', fundo: { img: IMG('depois'), kb: 'in', dim: .4, foco: '60% 60%', lado: 'dir', clima: 'poeira' },
      sons: [{ s: 'assets/audio/tacet_passos.mp3', p: 2, v: .5, fim: true }, { voz: 'd08-ritmo', p: 2 }],
      texto: [
        (st) => (shaaViva(st) ? T('Depois a roda se desfez. Voltaram para os seus mortos. Dois deles levaram Shaa numa pele esticada entre lanças, e Hessa foi junto, com a cria.', 'Afterwards the ring came apart. They went back to their dead. Two of them carried Shaa off on a hide stretched between spears, and Hessa went with them, with the child.')
          : T('Depois a roda se desfez devagar. Voltaram para os seus mortos. Hessa foi com a cria.', 'Afterwards the ring came apart slowly. They went back to their dead. Hessa went with the child.')),
        (st) => (parto(st) === 'dois'
          ? T('Sentei na areia e comecei a apagar a luz, uma linha de cada vez, como faço todo dia há mais de um século. A testa apagou. A garganta apagou. O peito não quis, nem os braços. Eu tinha puxado dois fios, e o pano ainda tremia onde eu tinha mexido.', 'I sat in the sand and began to put the light out, one line at a time, as I have done every day for more than a century. The forehead went. The throat went. The chest would not, nor the arms. I had pulled two threads, and the cloth was still trembling where I had touched it.')
          : T('Sentei na areia e comecei a apagar a luz, uma linha de cada vez, como faço todo dia há mais de um século. A testa apagou. A garganta apagou. O peito apagou, devagar. Os braços não quiseram.', 'I sat in the sand and began to put the light out, one line at a time, as I have done every day for more than a century. The forehead went. The throat went. The chest went, slowly. The arms would not.')),
        T('Então, através da areia e para dentro das minhas mãos, de muito longe, veio um ritmo que eu não sentia desde a Borda do Mundo. Metal e pedra em chão duro. Um, dois, três. Um, dois, três.', 'Then, through the sand and into my hands, from very far away, came a rhythm I had not felt since the Edge of the World. Metal and stone on hard ground. One, two, three. One, two, three.'),
        T('Claro. Claro que estavam escutando, todo esse tempo, à espera exatamente disto.', 'Of course. Of course they had been listening, all this time, for exactly this.'),
        se((st) => !!(st.f.tacets_eclipse || st.f.tacets_noite), T('Longe, mas não tão longe quanto deviam estar. Tinham começado a andar antes, em algum momento do escuro.', 'Far off, but not as far off as they should have been. They had started walking sooner, somewhere in the dark.')),
      ],
      fimDeParte: true },

    // ===================================================== V · O RASTRO
    { id: 'parte-V', parte: 'V', zona: 'deserto', fundo: { img: IMG('deserto-noite'), kb: 'in', dim: .6, clima: 'estrelas' },
      cartao: { num: 'V', nome: T('O Rastro', 'The Trail'), epigrafe: 'Aeth-vorunda, sæl’aeth mor’ilenne.', fonte: T('louvor Lúmae, terceiro verso', 'Lúmae praise, third verse') } },

    { id: 'e01', zona: 'deserto', fundo: { img: IMG('deserto-noite'), kb: 'in', dim: .38, foco: '70% 50%', clima: 'estrelas' }, capitular: true,
      narracao: 'assets/audio/voz/e01-partir.mp3', narracaoLang: 'en',
      texto: [
        T('No norte, quando vieram atrás de mim, eu fugi. É o que eu faço. Sou o melhor fugitivo que o meu povo já produziu, e o único que ainda foge.', 'In the north, when they came for me, I ran. It is what I do. I am the finest fugitive my people ever produced, and the only one still running.'),
        T('Os Tacets seguem a luz. Não importa no acampamento de quem ela esteja. Se eu ficasse, eles entrariam na Pira no compasso de três, e a Pira os receberia com lanças, e bronze não se incomoda muito com lanças.', 'The Tacets follow the light. Whose camp it is standing in makes no difference. If I stayed, they would walk into the Pyre in their count of three, and the Pyre would meet them with spears, and bronze does not much mind spears.'),
        T('Então eu iria. Desta vez não para longe deles. À frente deles. Aceso.', 'So I would go. Not away from them, this time. Ahead of them. Lit.'),
        se((st) => (st.tacetsCedo || 0) - (st.f.tacets_eclipse ? 1 : 0) - (st.f.tacets_noite ? 1 : 0) >= 1, T('Com o tanto que eu tinha arrancado de mim por Shaa e pela cria, eles viriam depressa, e eu teria de levá-los longe.', 'With as much as I had pulled out of myself for Shaa and the child, they would be coming fast, and I would have to take them far.')),
      ] },

    // antes de ir: os feridos nos poços. A graxa que sobrou decide Tukk e o braço de Hessa
    // (depois do parto, e não logo depois da batalha: na batalha Aheryn está com Shaa, que está morrendo)
    { id: 'e01b', zona: 'goelas', fundo: { img: IMG('feridos-pocos'), kb: 'in', dim: .42, foco: '50% 50%', clima: 'brasas' },
      aoEntrar: (st) => { if (!st.f.salvou_tukk && !st.f._tukkPerdido) { st.f._tukkPerdido = true; st.hessa -= 1; } },
      texto: [
        T('Antes de ir, desci aos poços. Estavam cheios de feridos. Os Grakh não gritam quando sangram: fazem um som baixo, de garganta, e toda a borda dos poços fazia esse som.', 'Before I went, I went down to the wells. They were full of the wounded. The Grakh do not scream when they bleed: they make a low sound in the throat, and the whole rim of the wells was making it.'),
        (st) => (st.f.salvou_tukk ? T('Tukk estava deitado atrás das pedras, onde eu o tinha largado no escuro, com as duas pontas de lança ainda no corpo.', 'Tukk was lying behind the rocks, where I had left him in the dark, with both spearheads still in him.')
          : T('Tukk não tinha voltado da linha. Quatro deles o trouxeram nos ombros quando o sol voltou, e pela maneira de carregar não havia mais o que fazer.', 'Tukk had not come back from the line. Four of them brought him in on their shoulders when the sun came back, and from the way they carried him there was nothing left to do.')),
        (st) => (st.f.cuidou_hessa ? T('Hessa estava sentada na pedra mais alta, com a cria no colo e o braço ainda brilhando da graxa.', 'Hessa was sitting on the highest rock, the child in her lap and her arm still shining with the grease.')
          : st.f.abriu_guarda ? T('Hessa estava sentada na pedra mais alta, com a cria no colo e um corte no braço que a espada do Tinido tinha aberto antes de cair da mão dele.', 'Hessa was sitting on the highest rock, the child in her lap and a cut on her arm the Tinn’s sword had opened before it fell from his hand.')
            : T('Hessa estava sentada na pedra mais alta, com a cria no colo e o braço aberto pelos três homens que tinha atravessado.', 'Hessa was sitting on the highest rock, the child in her lap and her arm laid open by the three men she had gone through.')),
        se(shaaViva, T('Ao pé da pedra, Shaa dormia enrolada numa pele. Respirava curto, mas respirava.', 'At the foot of the rock, Shaa was asleep, wrapped in a hide. Her breathing was short, but it went on.')),
        (st) => { const n = quantos(st, 'unguento');
          return n === 0 ? T('No alforje, nenhum pote de graxa.', 'In the pack, not one pot of grease.')
            : n === 1 ? T('No alforje, um pote de graxa.', 'In the pack, one pot of grease.')
              : T('No alforje, ' + (n === 2 ? 'dois' : 'três') + ' potes de graxa.', 'In the pack, ' + (n === 2 ? 'two' : 'three') + ' pots of grease.'); },
      ],
      dialogo: { interlocutor: 'Tukk', rodadas: [
        { id: 'feridoTukk', se: (st) => !!st.f.salvou_tukk, pergunta: T('Tukk:', 'Tukk:'), opcoes: [
          { id: 'graxa', se: (st) => temPronto(st, 'unguento'), tom: 'ternura', txt: T('Abrir um pote nas feridas dele.', 'Open a pot on his wounds.'),
            aoEscolher: (st) => { const q = usaMelhor(st, 'unguento'); st.f.tukk = q && q.q === 'ruim' ? 'sem_braco' : 'inteiro'; st.hessa += 1; },
            resposta: (st) => (st.f.tukk === 'inteiro'
              ? [T('Arranquei as duas pontas e enchi os buracos de graxa. Ele parou de fazer o som.', 'I pulled out both points and filled the holes with grease. He stopped making the sound.')]
              : [T('Arranquei as duas pontas e enchi os buracos de graxa. A graxa estava mal feita e ardeu. Aquele ombro não ia voltar a levantar uma lança.', 'I pulled out both points and filled the holes with grease. The grease was badly made and it burned. That shoulder was not going to lift a spear again.')]) },
          { id: 'nada', tom: 'frieza', txt: (st) => (temPronto(st, 'unguento') ? T('Guardar a graxa.', 'Keep the grease.') : T('Não ter o que pôr nele.', 'Have nothing to put on him.')), aoEscolher: (st) => { st.f.tukk = 'sem_braco'; },
            resposta: [T('Ele continuou fazendo o som baixo. Aquele ombro não ia voltar a levantar uma lança.', 'He went on making the low sound. That shoulder was not going to lift a spear again.')] },
        ] },
        { id: 'bracoHessa', se: (st) => !st.f.cuidou_hessa, pergunta: T('O braço de Hessa:', 'Hessa’s arm:'), opcoes: [
          { id: 'graxa', se: (st) => temPronto(st, 'unguento'), tom: 'ternura', flag: 'cuidou_hessa', txt: T('Subir até a pedra e passar a graxa no corte dela.', 'Climb to the rock and put the grease on her cut.'),
            aoEscolher: (st) => { const q = usaMelhor(st, 'unguento'); st.f.graxaHessa = q ? q.q : 'medio'; if (st.f.graxaHessa !== 'ruim') st.hessa += 1; },
            resposta: (st) => (st.f.graxaHessa === 'ruim'
              ? [T('Ela deixou. A graxa ardeu, e ela olhou para mim e guardou aquilo.', 'She let me. The grease burned, and she looked at me and kept that.')]
              : [T('Ela deixou. Olhou para o braço, depois para mim, e não disse nada.', 'She let me. She looked at the arm, then at me, and said nothing.')]) },
          { id: 'nada', tom: 'frieza', txt: (st) => (temPronto(st, 'unguento') ? T('Ficar onde estava.', 'Stay where I was.') : T('Não ter o que pôr nela.', 'Have nothing to put on her.')),
            resposta: [T('Ela não pediu, e eu não fui.', 'She did not ask, and I did not go.')] },
        ] },
      ] } },

    { id: 'e02', zona: 'deserto', fundo: { img: IMG('recem-nascido'), kb: 'in', dim: .45, foco: '60% 50%', clima: 'estrelas' },
      texto: [
        T('Hessa me achou antes que eu terminasse de amarrar os panos. Trazia a cria no ombro, enrolada numa pele, e a mão livre já estava de volta no cabo da maça, onde sempre esteve.', 'Hessa found me before I had finished tying the wraps. She carried the child on her shoulder, wrapped in a hide, and her free hand was already back on the haft of the mace, where it has always been.'),
        T('— Você vai embora.', '— You are leaving.'),
        T('Não era pergunta.', 'It was not a question.'),
        (st) => ({ confianca: T('Então tirou a cria do ombro e a pôs nos meus braços pelo tempo de um fôlego, e a pegou de volta.', 'Then she took the child off her shoulder and put him in my arms for the space of a breath, and took him back.'),
          respeito: T('Parou perto, ao alcance da minha mão.', 'She stopped close, within reach of my hand.'),
          hostil: T('Não chegou perto. Falou de onde estava.', 'She did not come close. She spoke from where she stood.') })[hessaFaixa(st)] || null,
      ],
      dialogo: { interlocutor: 'Hessa', rodadas: [
        { id: 'adeus', pergunta: T('Dizer a Hessa:', 'Say to Hessa:'), opcoes: [
          { id: 'cuide', tom: 'ternura', txt: T('“Cuide dele.”', '“Look after him.”'),
            resposta: [T('Ela olhou para a cria, depois para mim, e ajeitou a pele em volta dele.', 'She looked at the child, then at me, and tucked the hide closer around him.')] },
          { id: 'nome', tom: ['ternura', 'curiosidade'], flag: 'disse_nome', txt: T('“Meu nome é Aheryn.”', '“My name is Aheryn.”'),
            resposta: [T('— Aheryn.', '— Aheryn.'), T('Ela disse devagar, as duas sílabas separadas. Ninguém dizia esse nome em voz alta desde a Borda do Mundo, nem eu.', 'She said it slowly, the two syllables apart. No one had said that name aloud since the Edge of the World, not even me.')] },
          { id: 'lua', tom: ['ironia', 'curiosidade'], txt: T('“O que comeu o dia foi a lua. O sol sempre volta.”', '“What ate the day was the moon. The sun always comes back.”'),
            resposta: [T('— A lua. Vou contar ao Ghru. Ele não vai acreditar.', '— The moon. I will tell Ghru. He will not believe it.'), T('Ela não sorriu, mas quase.', 'She did not smile, but nearly.')] },
          { id: 'cala', silencio: true, tom: 'frieza',
            resposta: [T('Ela esperou o tempo de um fôlego. Depois virou e voltou para o acampamento, sem olhar para trás.', 'She waited the length of a breath. Then she turned and went back toward the camp, without looking back.')] },
        ] },
        { id: 'tinido', se: (st) => st.escolhas.adeus !== 'cala',
          antes: (st) => (st.f.abriu_guarda ? [T('— Os cavalos foram você.', '— The horses were you.'), T('Também não era pergunta, então não respondi.', 'That was not a question either, so I did not answer it.')] : [T('— O Tinido. Você viu.', '— The Tinn. You saw.')]),
          pergunta: T('Sobre o Tinido:', 'About the Tinn:'), opcoes: [
            { id: 'besta', tom: 'curiosidade', txt: T('“Ele empurrou para baixo a besta que mirava você.”', '“He pushed down the bow that was aimed at you.”'),
              resposta: [T('— Eu vi.', '— I saw.'), T('Ela olhou para o leste, para onde o tinham levado, e por um bom tempo não olhou para mais nada.', 'She looked east, where they had carried him, and for a long while she did not look at anything else.')] },
            { id: 'boa', tom: 'ironia', txt: T('“Foi uma boa morte.”', '“It was a good death.”'),
              resposta: [T('— Foi rápida. Fui eu.', '— It was quick. It was me.')] },
            { id: 'nada', silencio: true, tom: 'frieza',
              resposta: [T('Ela assentiu uma vez, para a noite.', 'She nodded once, to the night.')] },
          ] },
      ] } },

    { id: 'e03', zona: 'deserto', fundo: { img: IMG('recem-nascido'), kb: 'out', dim: .45, foco: '60% 50%', clima: 'estrelas' },
      se: (st) => st.escolhas.adeus !== 'cala',
      texto: [
        T('A cria dormia no ombro dela, de punho fechado numa dobra da pele, muito apertado.', 'The child was asleep on her shoulder, his fist closed tight on a fold of the hide.'),
        (st) => (shaaViva(st) ? { confianca: T('— Shaa conta a Kronk quem tirou ele dela. Eu também.', '— Shaa will tell Kronk who took him out of her. So will I.'),
          respeito: T('— Se Kronk perguntar, digo que foi você.', '— If Kronk asks, I will say it was you.'),
          neutra: T('— Kronk vai ter a mãe dele. O resto ele pergunta quando tiver idade.', '— Kronk will have his mother. The rest he can ask when he is old enough.'),
          fria: T('— Kronk vai ter a mãe dele. De você, não sei.', '— Kronk will have his mother. About you, I do not know.'),
          hostil: T('— Kronk nunca vai saber que foi magia.', '— Kronk will never know it was magic.') }
          : { confianca: T('— Kronk vai saber quem tirou ele da mãe. Eu mesma conto.', '— Kronk will know who took him out of his mother. I will tell him myself.'),
          respeito: T('— Se Kronk perguntar, digo que foi você.', '— If Kronk asks, I will say it was you.'),
          neutra: T('— Kronk vai saber da mãe dele. O resto ele pergunta quando tiver idade.', '— Kronk will know about his mother. The rest he can ask when he is old enough.'),
          fria: T('— Kronk vai saber da mãe dele. De você, não sei.', '— Kronk will know about his mother. About you, I do not know.'),
          hostil: T('— Kronk nunca vai saber que foi magia.', '— Kronk will never know it was magic.') })[hessaFaixa(st)],
      ],
      escolha: { id: 'cria', pergunta: T('Antes de partir:', 'Before leaving:'), opcoes: [
        { id: 'tocar', tom: 'ternura', txt: T('Tocar o punho dele.', 'Touch his fist.'),
          resultado: [T('Pus um dedo no punho. Ele abriu, fechou em volta do meu dedo e não soltou. Tirei o dedo de volta. Deu algum trabalho.', 'I put one finger on the fist. It opened, closed around my finger, and would not let go. I took my finger back. It took some doing.')] },
        { id: 'naoTocar', tom: 'frieza', txt: T('Não tocar.', 'Do not touch him.'),
          resultado: [T('Não o toquei. As coisas que eu toco têm o costume de ser encontradas.', 'I did not touch him. Things I touch have a way of being found.')] },
      ] } },

    { id: 'e04', zona: 'deserto', se: temDiario, fundo: { img: IMG('diario-deserto'), kb: 'in', dim: .45, foco: '30% 50%', lado: 'dir', clima: 'estrelas' },
      texto: [
        T('O diário estava no fundo do embrulho, onde o tinha posto na Borda do Mundo. A décima segunda página estava em branco.', 'The diary was at the bottom of the bundle, where I had put it at the Edge of the World. The twelfth page was blank.'),
      ],
      escolha: { id: 'diario5', pergunta: T('O diário:', 'The diary:'), opcoes: [
        { id: 'escrever', tom: 'curiosidade', flag: 'escreveu', voz: 'e04-diario', vozAtraso: 1200, txt: T('Escrever o dia.', 'Write the day down.'),
          resultado: [
            T('Escrevi de pé, com a luz ainda nas mãos, o que fazia a tinta parecer ouro:', 'I wrote it standing up, with the light still in my hands, which made the ink look like gold:'),
            T('“Décima segunda página. O dia foi comido e devolvido poucos minutos depois, como os dias costumam ser. Uma criança nasceu no escuro dele e recebeu o nome do seu primeiro som. Vão dizer que o maior chegou. Eu só sei que um coração pequeno batia rápido debaixo das minhas mãos e que deixei que ele fizesse barulho. Parto esta noite. Pela primeira vez, parto antes.”', '“Twelfth page. The day was eaten and given back a few minutes later, as days usually are. A child was born in the dark of it and named for his first sound. They will say the greatest has come. I only know that a small heart beat fast under my hands, and that I let it be loud. I leave tonight. For once, I leave first.”'),
          ] },
        { id: 'branco', tom: 'frieza', txt: T('Deixar a página em branco.', 'Leave the page blank.'),
          resultado: [T('Deixei a página em branco. Há dias que não precisam de ajuda para serem lembrados.', 'I left the page blank. Some days need no help being remembered.')] },
      ] } },

    { id: 'e05', zona: 'deserto',
      sons: [{ voz: 'e05-noite', p: 0 }],
      pensa: [{ id: 'geracoes', voz: 'p-geracoes', luzMin: 31, atraso: 9000, luz: 3, tomSeguir: 'ironia', t: T('Eles vão contar isso por gerações.', 'They will tell this for generations.'),
        mais: T('Um velho que acendeu na roda e foi embora antes do sol. Em três gerações eu teria asas. Em cinco, seria uma lua.', 'An old man who lit up in the ring and left before sunrise. In three generations I would have wings. In five, I would be a moon.') }], fundo: { img: IMG('mapa-rastro'), kb: 'in', dim: .4, foco: '50% 50%', clima: 'estrelas' },
      texto: [
        T('A noite caiu sobre a Pira de uma vez. Atrás de mim acendiam as fogueiras para os mortos. Ao norte, três pontos de bronze pegavam a luz das estrelas e a perdiam de novo, e vinham, no compasso de três.', 'Night came down on the Pyre all at once. Behind me the fires were being lit for the dead. To the north, three points of bronze caught the starlight and lost it again, and came on, in their count of three.'),
      ],
      minijogo: 'rastro',
      depois: (st) => {
        const r = st.jogos.rastro || {};
        const hino = r.cantou && esc1(st, 'hino');
        return [hino === 'dentro' ? T('Na Borda do Mundo eu o tinha cantado de boca fechada. Desta vez abri.', 'At the Edge of the World I had sung it with my mouth shut. This time I opened it.')
          : hino === 'frestas' ? T('Da última vez, a luz tinha saído pelas frestas de uma cabana. Aqui não havia frestas. Havia o deserto.', 'The last time, the light had come out through the cracks of a cabin. Here there were no cracks. There was the desert.') : null,
          r.cantou ? T('Cantei enquanto acendia. A canção inteira, na língua que já não tem quem a fale, cada verso que me chama de grande. Pela primeira vez, ela serviu para alguma coisa.', 'I sang while I lit the way. The whole song, in the language no one alive is left to speak, every verse that calls me great. For once, it was good for something.')
          : T('Acendi o caminho em silêncio, um ponto de cada vez.', 'I lit the way in silence, one point at a time.')];
      } },

    { id: 'e06', zona: 'deserto', acender: true, estado: 'seco', fundo: { video: VID('rastro'), img: IMG('deserto-noite'), dim: .35, foco: '60% 50%', clima: 'estrelas' }, capitular: true,
      narracao: 'assets/audio/voz/e06-fim.mp3', narracaoLang: 'en',
      sons: [{ s: 'assets/audio/tacet_passos.mp3', p: 1, v: .4 }],
      texto: [
        T('Caminhei para oeste, areia aberta adentro, aceso da testa à ponta dos dedos, que é a coisa mais tola que uma criatura caçada pode fazer, e raras vezes tive tanta certeza de alguma coisa.', 'I walked west into the open sand, lit from forehead to fingertips, which is the most foolish thing a hunted creature can do, and I have rarely been so sure of anything.'),
        T('Atrás de mim, o compasso quebrou de três para quatro. Tinham me achado. Era a ideia.', 'Behind me, the count broke from three to four. They had found me. That was the idea.'),
        T('Passei trinta anos sem fazer um som. Naquela noite, sem ouvidos em volta além da areia e das coisas que me seguiam, fiz um.', 'I had spent thirty years making no sound. That night, with no ears around but the sand and the things that were following me, I made one.'),
        se((st) => !!(st.jogos.rastro && st.jogos.rastro.cantou), T('Lá atrás, os tambores dos mortos pararam pelo tempo de um verso, e recomeçaram.', 'Far behind me, the drums for the dead stopped for the length of a verse, and started again.')),
        se((st) => !!st.f.estalou, T('Em algum lugar atrás de mim, no acampamento, crianças estalavam a língua umas para as outras no escuro. Levei quase uma duna para entender que estavam dizendo o meu nome.', 'Somewhere behind me, in the camp, children were clicking their tongues at each other in the dark. It took me most of a dune to understand that they were saying my name.')),
        se((st) => !!st.f.disse_nome, T('E em algum lugar atrás de mim, alguém sabia o meu nome.', 'And somewhere behind me, someone knew my name.')),
        se((st) => !!st.f.derramou, T('Eu não tinha nada para beber. Então pensei. A noite inteira, pensei em voz alta, debaixo da pele, e deixei brilhar.', 'I had nothing to drink. So I thought. All night long I thought out loud, under the skin, and let it shine.')),
        se(marcado, T('Só o antebraço onde o bronze tinha fechado ficou escuro.', 'Only the forearm the bronze had closed on stayed dark.')),
      ],
      fim: true },
  ],

  // ---------------------------------------------------------------- o que este capítulo deixa para os próximos
  estadoFinal: (st) => ({
    luz: Math.round(st.luz), hessa: st.hessa, shaa: st.shaa, pira: st.pira, turvo: st.turvo, bebidos: st.bebidos || 0,
    parto: parto(st), odre: st.escolhas.odre || null, despedida: st.escolhas.adeus || null,
    disseNome: !!st.f.disse_nome, estalou: !!st.f.estalou, deixouPedra: !!st.f.deixou_pedra, escreveu: !!st.f.escreveu,
    abriuGuarda: !!st.f.abriu_guarda, ouviuOficial: !!st.f.ouviu_oficial, salvouTukk: !!st.f.salvou_tukk, mostrouLuz: !!st.f.mostrou_luz, mentiuErvas: !!st.f.mentiuErvas,
    shaaViva: shaaViva(st), luzShaa: st.f.luzShaa || null, cuidouHessa: !!st.f.cuidou_hessa, hessaFaixa: hessaFaixa(st), tukk: tukkFim(st), hessaViuLuz: !!(st.f.mostrou_luz || st.f.hessa_viu_luz),
    // o que sobrou no alforje: os próximos capítulos do Aheryn leem (sem histórico, só o que há)
    alforje: { prontos: alf(st).prontos.map((x) => ({ id: x.id, q: x.q })), ingr: Object.fromEntries(Object.entries(alf(st).ingr).filter(([, v]) => v > 0)) },
    tom: st.tom, rastro: st.jogos.rastro || null, escolhas: st.escolhas,
  }),

  // ---------------------------------------------------------------- pontuação escondida
  pontos: (st) => {
    const t = st.jogos.troca || {}, m = st.jogos.minutos || {}, p = st.jogos.parto || {}, r = st.jogos.rastro || {};
    const pt = Math.max(500, Math.round((t.pontos || 0)));
    const pm = Math.max(500, Math.round(1500 * ((m.feitas || []).filter((a) => ['ouvir', 'po', 'tukk', 'shaa'].includes(a)).length) + 400 * (m.marcasSobrando || 0) + (m.feitas || []).includes('esconder') * 300));
    const pp = Math.max(800, Math.round(12000 * (p.dentro || 0) - 600 * (p.flares || 0) + (parto(st) === 'dois' ? 3000 : 0) + (shaaViva(st) ? 2500 : 0)));
    const pr = Math.max(800, Math.round(140 * (r.distancia || 0) + (r.cantou ? 2500 : 0) - 300 * Math.max(0, (r.luzes || 0) - 8)));
    const VALQ = { bom: 900, medio: 500, ruim: 200, falhou: 0 };
    const pb = Math.max(300, (alf(st).feitos || []).reduce((a, x) => a + (VALQ[x.q] || 0), 0));
    const partes = [['bancada', pb], ['troca', pt], ['minutos', pm], ['parto', pp], ['rastro', pr]];
    return { total: partes.reduce((a, [, v]) => a + v, 0), partes };
  },

  // ---------------------------------------------------------------- tela final (um narrador fora do roleplay)
  resumo: (st, lang) => {
    const t = (pt) => (lang === 'en' && window.LIVRO_EN[pt] != null ? window.LIVRO_EN[pt] : pt);
    const luz = Math.round(st.luz);
    const frase = luz >= 70 ? t(T('Aheryn entrou na noite brilhando. Qualquer coisa no deserto que saiba olhar vai saber onde ele está. Era essa a ideia.', 'Aheryn walked into the night shining. Anything in the desert that knows how to look will know where he is. That was the point.'))
      : luz <= 35 ? t(T('Aheryn deu aos Tacets só a luz necessária para segui-lo, e nem um grão a mais. Trinta anos de prática.', 'Aheryn gave the Tacets just enough light to follow, and not a grain more. Thirty years of practice.'))
        : t(T('Aheryn acendeu o caminho e guardou um pouco para si. Velhos hábitos.', 'Aheryn lit the way and kept a little back for himself. Old habits.'));
    // o gancho entre as duas linhas da história: um cartão, não um parágrafo
    const revela = {
      img: IMG('tinido'),
      olho: t(T('O homem que os Grakh chamavam de Tinido', 'The man the Grakh called the Tinn')),
      nome: 'Kassian D’Orrose',
      titulo: t(T('General-Rei de Redom', 'General-King of Redom')),
      texto: t(T('Seus homens o levaram para casa sobre a própria capa. Um ano depois, no Torneio Real convocado para substituí-lo, um cavaleiro de elmo fechado se inscreveu com o nome de Laus.', 'His men carried him home on his own cloak. A year later, at the Royal Tournament called to replace him, a rider in a closed helm entered under the name Laus.')),
      link: t(T('Capítulo IV · Laus, o Azarão', 'Chapter IV · Laus, the Underdog')),
    };
    const n = [];
    { const fx = hessaFaixa(st);
      n.push(fx === 'confianca' ? t(T('Hessa: entre você e ela, agora, não há mais distância.', 'Hessa: there is no distance left between you and her now.'))
        : fx === 'respeito' ? (st.f.abriu_guarda ? t(T('Hessa: viu os cavalos empinarem. Vai lembrar de quem abriu o caminho.', 'Hessa: she saw the horses go up. She will remember who opened the way.'))
          : t(T('Hessa: se Kronk perguntar, ela vai dizer que foi você.', 'Hessa: if Kronk asks, she will say it was you.')))
          : fx === 'neutra' ? t(T('Hessa: nada mudou entre você e ela.', 'Hessa: nothing has changed between you and her.'))
            : fx === 'fria' ? t(T('Hessa: vai lembrar do que viu, e não vai contar tudo.', 'Hessa: she will remember what she saw, and she will not tell all of it.'))
              : t(T('Hessa: Kronk nunca vai saber que foi magia.', 'Hessa: Kronk will never know it was magic.'))); }
    n.push(shaaViva(st) ? t(T('Shaa: viva, com o filho no peito.', 'Shaa: alive, with her son at her breast.')) : parto(st) === 'dois' ? t(T('Shaa: viveu o bastante para segurar o filho.', 'Shaa: she lived long enough to hold her son.')) : t(T('Shaa: deu o nome ao filho com o último fôlego.', 'Shaa: she named her son with her last breath.')));
    if (st.f.mostrou_luz && st.f.luzShaa !== 'alta') n.push(t(T('A cria sentiu a sua luz antes de nascer.', 'The child felt your light before he was born.')));
    n.push(st.f.ouviu_oficial ? t(T('A graxa cinza: agora você sabe por que o exército veio. Os Grakh nunca vão saber.', 'The grey grease: you know now why the army came. The Grakh will never know.'))
      : st.f.sentiu_unguento ? t(T('A graxa cinza: você sentiu o cheiro dela na linha de frente, e não perguntou por quê.', 'The grey grease: you smelled it on the front line, and did not ask why.'))
        : t(T('A graxa cinza: você nunca soube por que Redom veio com tanta força este ano.', 'The grey grease: you never learned why Redom came in such force this year.')));
    n.push({ inteiro: t(T('Tukk: vivo, com duas pontas de lança para mostrar.', 'Tukk: alive, with two spearheads to show for it.')), sem_braco: t(T('Tukk: vivo, sem o braço da lança.', 'Tukk: alive, without his spear arm.')), morto: t(T('Tukk: não voltou da linha.', 'Tukk: he did not come back from the line.')) }[tukkFim(st)]);
    const r = st.jogos.rastro || {};
    if (st.f.tacets_noite) n.push(t(T('Os Tacets: começaram a andar na noite antes dos poços, puxados pela sua luz.', 'The Tacets: they began to walk the night before the wells, drawn by your light.')));
    else if (st.f.tacets_eclipse) n.push(t(T('Os Tacets: começaram a andar durante o eclipse, puxados pela sua luz.', 'The Tacets: they began to walk during the eclipse, drawn by your light.')));
    if (r.distancia != null) n.push(t(T('Os Tacets: levados para longe da Pira, até onde a luz alcançou.', 'The Tacets: led away from the Pyre, as far as the light would reach.')));
    if (st.f.disse_nome) n.push(t(T('O seu nome: Hessa sabe.', 'Your name: Hessa knows it.')));
    if (st.f.estalou) n.push(t(T('As crianças da Pira deram um nome a você: um estalo de língua.', 'The children of the Pyre gave you a name: a click of the tongue.')));
    if (st.f.cuidou_hessa) n.push(t(T('Hessa: deixou você passar a graxa cinza no braço dela.', 'Hessa: she let you put the grey grease on her arm.')));
    // o que Aheryn levou no alforje (fica salvo para os próximos capítulos dele)
    { const B = window.LIVRO.bancada, a = alf(st);
      const nomeR = (id) => t((B.receitas.find((r) => r.id === id) || {}).nome || id);
      const prontos = a.prontos.map((x) => `${nomeR(x.id)} (${t(B.qual[x.q])})`);
      n.push(prontos.length ? t(T('No alforje, para a estrada: ', 'In the pack, for the road: ')) + prontos.join(', ') + '.' : t(T('No alforje, para a estrada: nada que a bancada tenha feito.', 'In the pack, for the road: nothing the bench made.'))); }
    // o temperamento: o tom que mais pesou nas escolhas
    const tons = Object.entries(st.tom || {}).sort((a, b) => b[1] - a[1]);
    const top = tons.length ? tons[0][0] : 'frieza';
    const PERFIL = {
      ironia: T('Irônico até o fim: recebeu o dia comido com uma piada pronta, e a guardou para si.', 'Wry to the end: he met the eaten day with a joke ready, and kept it to himself.'),
      ternura: T('Mais perto do que pretendia: deixou gente chegar ao alcance do braço, e uma delas era muito pequena.', 'Closer than he meant to be: he let people within arm’s reach, and one of them was very small.'),
      frieza: T('Contido: deu ao mundo o que era justo e nem um grão a mais. No fim, bastou.', 'Contained: he gave the world what was fair and not a grain more. In the end, it was enough.'),
      curiosidade: T('Ainda perguntando: com mais de cem anos, ainda queria saber como as coisas se chamam, e por quê.', 'Still asking: past a hundred years old, and he still wanted to know what things are called, and why.'),
    };
    const ODRE = { derramar: T('Derramou na areia', 'Poured it into the sand'), entregar: T('Entregou a Hessa', 'Gave it to Hessa'), gole: T('Um último gole', 'One last swallow') };
    const PARTO = { dois: T('A mãe e a cria', 'The mother and the child'), crianca: T('Só a cria', 'Only the child') };
    const ADEUS = { cuide: T('“Cuide dele.”', '“Look after him.”'), nome: T('“Meu nome é Aheryn.”', '“My name is Aheryn.”'), lua: T('“O que comeu o dia foi a lua.”', '“What ate the day was the moon.”'), cala: T('Silêncio', 'Silence') };
    const MENINO = { deixar: T('Deixou que ele seguisse', 'Let him follow'), estalar: T('Estalou a língua', 'Clicked your tongue'), encarar: T('Encarou até ele ir', 'Stared until he left') };
    const VERLUZ = { mostrar: T('Mostrou a luz a Shaa', 'Showed Shaa the light'), recusa: T('Recusou', 'Refused') };
    const HESSA1 = { uteis: T('“Então somos úteis um ao outro.”', '“Then we are useful to each other.”'), ervas: T('“São só ervas.”', '“It is only herbs.”'), sinal: T('O sinal de troca do gelo', 'The exchange sign of the ice'), baixar: T('Baixou os olhos e foi embora', 'Lowered your eyes and went') };
    const OLHAR = { bandeira: T('A bandeira', 'The banner'), homem: T('O homem da frente', 'The man in front'), contar: T('Contou os estandartes', 'Counted the standards') };
    const CRIA = { tocar: T('Tocou o punho dele', 'Touched his fist'), naoTocar: T('Não tocou', 'Did not touch him'), pedra: T('Deixou a pedra na pele', 'Left the stone in the hide') };
    const linhas = [];
    if (st.escolhas.proibido5) linhas.push({ id: 'proibido5', opcao: st.escolhas.proibido5, q: t(T('Na roda, o que Aheryn foi buscar', 'In the ring, what Aheryn reached for')), a: t(PARTO[st.escolhas.proibido5]) });
    if (st.escolhas.odre) linhas.push({ id: 'odre', opcao: st.escolhas.odre, q: t(T('O odre de vinho', 'The skin of wine')), a: t(ODRE[st.escolhas.odre]) });
    if (st.escolhas.adeus) linhas.push({ id: 'adeus', opcao: st.escolhas.adeus, q: t(T('As últimas palavras a Hessa', 'The last words to Hessa')), a: t(ADEUS[st.escolhas.adeus]) });
    if (st.escolhas.menino) linhas.push({ id: 'menino', opcao: st.escolhas.menino, q: t(T('A criança que imitava o seu andar', 'The child who copied your walk')), a: t(MENINO[st.escolhas.menino]) });
    if (st.escolhas.verLuz) linhas.push({ id: 'verLuz', opcao: st.escolhas.verLuz, q: t(T('Shaa pediu para ver a luz', 'Shaa asked to see the light')), a: t(VERLUZ[st.escolhas.verLuz]) });
    if (st.escolhas.hessa1) linhas.push({ id: 'hessa1', opcao: st.escolhas.hessa1, q: t(T('Quando Hessa falou dos potes', 'When Hessa spoke of the pots')), a: t(HESSA1[st.escolhas.hessa1]) });
    if (st.escolhas.olhar) linhas.push({ id: 'olhar', opcao: st.escolhas.olhar, q: t(T('Diante da coluna de Redom', 'Facing the Redom column')), a: t(OLHAR[st.escolhas.olhar]) });
    if (st.escolhas.cria) linhas.push({ id: 'cria', opcao: st.escolhas.cria, q: t(T('Antes de partir, a cria', 'Before leaving, the child')), a: t(CRIA[st.escolhas.cria]) });
    // os goles: quanto do odre o leitor bebeu no capítulo inteiro (a abertura não conta)
    const g = Math.min(6, st.bebidos || 0);
    linhas.push({ id: 'goles_total', opcao: String(g), q: t(T('Goles do odre', 'Swallows from the skin')), a: g === 0 ? t(T('Nenhum', 'None')) : g === 1 ? t(T('1 gole', '1 swallow')) : (lang === 'en' ? `${g} swallows` : `${g} goles`) });
    return { frase, revela, notas: n, perfil: t(PERFIL[top]), linhas };
  },
};

// os textos com o nome da pedra do Cap. I ({P1}) são resolvidos na hora, já no idioma da leitura
window.LIVRO.subst = (s, st, tr) => {
  if (s.indexOf('{P1}') < 0) return s;
  const pd = st.c1 && st.c1.pedra, par = pd && nomePedra[pd.motivo];
  return s.replace(/\{P1\}/g, par ? tr(par[1]) : tr(T('A pedra', 'The stone')));
};
