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
   II a V (as Goelas, o eclipse ao meio-dia, o parto à tarde, a partida à noite).
   30 anos depois do Cap. I; cerca de um ano antes do Torneio do Cap. IV.
   Estado do Cap. I: st.c1 (copiado de aqv_estado.cap1 em inicio()).
   ========================================================================== */
window.LIVRO_EN = window.LIVRO_EN || {};
const T = (pt, en) => { if (en != null) window.LIVRO_EN[pt] = en; return pt; };
const se = (cond, t) => ({ se: cond, t });
const IMG = (n) => 'assets/images/' + n + '.jpg';
const VID = (n) => 'assets/video/' + n + '.mp4';
const CLIP = (n) => 'assets/clip/' + n + '.mp4';

// ---------------------------------------------------------------- o que veio do Cap. I
const c1 = (st) => st.c1 || {};
const temPedra = (st) => !!c1(st).pedra;
const temDiario = (st) => !!c1(st).diario;
const marcado = (st) => !!c1(st).marcado;
const tocouProibido = (st) => !!(c1(st).escolhas && c1(st).escolhas.proibido === 'tocar');
const armadilha = (st) => (c1(st).escolhas && c1(st).escolhas.armadilha) || null;
const nomePedra = {
  valer: [T('a Pedra da Borda', 'the Edge Stone'), T('A Pedra da Borda', 'The Edge Stone')],
  gelunah: [T('o Olho de Gelunah', 'Gelunah’s Eye'), T('O Olho de Gelunah', 'Gelunah’s Eye')],
  misterio: [T('a pedra', 'the stone'), T('A pedra', 'The stone')],
};
// ---------------------------------------------------------------- atalhos de estado
const sobrio = (st) => (st.turvo || 0) <= 2;
const tukkTrocou = (st) => !!(st.jogos.troca && st.jogos.troca.ok && st.jogos.troca.ok.tukk);
const temAgua = (st) => tukkTrocou(st);
const parto = (st) => st.escolhas.proibido5 || 'crianca';
const fezMinuto = (st, a) => !!(st.jogos.minutos && st.jogos.minutos.feitas && st.jogos.minutos.feitas.includes(a));

window.LIVRO_UI = {
  pt: { parte: 'Parte', prox: 'Próxima', fim: 'Encerrar o capítulo', voltar: '← Voltar', ouvir: 'Ouvir Aheryn', cena: '▶ Ver a cena', oque: 'O que Aheryn faz?', escolheu: 'Você escolheu:', resp: 'Responder a', silencio: 'não dizer nada', silencioR: 'Silêncio', momento: 'Momento de jogo',
    luz: 'Luz', luzTitle: 'A Luz do Aheryn: sobe quando ele pensa, sente e lembra; desce quando ele bebe e se cala',
    cantilBeber: 'Beber um gole (tecla B): a Luz desce, o mundo turva', cantilAqui: 'Aqui não é hora de beber', cantilVazio: 'O odre está vazio',
    mg: { ressaca: 'O que o sol traz de volta', laje: 'Conferir a Laje', troca: 'Coisa por coisa', minutos: 'Os minutos', parto: 'Um pensamento a mais', rastro: 'O rastro' },
    dica: {
      ressaca: 'Os pensamentos sobem da areia. Toque para enterrar um. Se ele chegar ao alto, Aheryn lembra.',
      laje: 'Toque em cada coisa debaixo da Laje antes de descer.',
      troca: 'Leia o corpo antes da mão. Ponha no couro o que cada Grakh precisa, nem mais, nem menos.',
      minutos: 'O anel é o sol voltando. Cada ação gasta tempo. Não vai dar para tudo.',
      parto: (st) => 'Segure para pensar: a luz sobe. Solte: ela cai. Mantenha dentro da faixa dourada.' + ((st.turvo || 0) >= 2 ? ' O vinho vai fazer a mão tremer.' : ''),
      rastro: 'Toque no deserto para acender o caminho. Cada luz puxa os Tacets atrás de você. Leve-os para longe da Pira.',
    },
    coverEye: 'As Quatro Vontades · Livro I · Capítulo V', coverLede: 'Trinta anos na areia sem fazer um som. Hoje o céu escurece ao meio-dia.', coverGo: 'Entrar no deserto', coverCont: 'Continuar de onde parei', coverRestart: 'Começar do início', coverHint: 'Use fones. Avance com o botão, com a seta → ou deslizando para o lado.',
    confirm: 'Recomeçar o capítulo? Suas escolhas serão apagadas.', capN: 'Capítulo V', fimCap: 'Fim do Capítulo V', ficou: 'O que o escuro deixou', suas: 'O que você escolheu', reler: 'Reler e escolher diferente', mesmo: (p) => `${p}% dos leitores fizeram o mesmo`,
    perfilT: 'O Aheryn que você moldou',
    pontos: 'Pontuação do capítulo', jornada: 'Jornada (Capítulos I a V)', posicao: (p, n) => `${p}º de ${n} leitores`, semCap1: 'Jogue os capítulos anteriores neste navegador para somar a jornada.',
    pts: { troca: 'A troca', minutos: 'Os minutos', parto: 'O parto', rastro: 'O rastro', antes: 'Capítulos I a IV' },
  },
  en: { parte: 'Part', prox: 'Next', fim: 'Close the chapter', voltar: '← Back', ouvir: 'Listen to Aheryn', cena: '▶ Watch the scene', oque: 'What does Aheryn do?', escolheu: 'You chose:', resp: 'Answer', silencio: 'say nothing', silencioR: 'Silence', momento: 'Moment of play',
    luz: 'Light', luzTitle: 'Aheryn’s Light: it rises when he thinks, feels and remembers; it falls when he drinks and goes silent',
    cantilBeber: 'Take a swallow (B key): the Light falls, the world blurs', cantilAqui: 'This is no time to drink', cantilVazio: 'The skin is empty',
    mg: { ressaca: 'What the sun brings back', laje: 'Check the slab', troca: 'Thing for thing', minutos: 'The minutes', parto: 'One thought more', rastro: 'The trail' },
    dica: {
      ressaca: 'Thoughts rise from the sand. Tap one to bury it. If it reaches the top, Aheryn remembers.',
      laje: 'Touch everything under the slab before going down.',
      troca: 'Read the body before the hand. Put on the hide what each Grakh needs, no more and no less.',
      minutos: 'The ring is the sun coming back. Every action costs time. You will not have enough.',
      parto: (st) => 'Hold to think: the light rises. Let go: it falls. Keep it inside the golden band.' + ((st.turvo || 0) >= 2 ? ' The wine will make the hand shake.' : ''),
      rastro: 'Tap the desert to light the way. Each light pulls the Tacets after you. Lead them far from the Pyre.',
    },
    coverEye: 'The Four Wills · Book I · Chapter V', coverLede: 'Thirty years in the sand without making a sound. Today the sky goes dark at noon.', coverGo: 'Walk into the desert', coverCont: 'Continue where I left off', coverRestart: 'Start from the beginning', coverHint: 'Wear headphones. Move on with the button, the → key, or a swipe.',
    confirm: 'Restart the chapter? Your choices will be erased.', capN: 'Chapter V', fimCap: 'End of Chapter V', ficou: 'What the dark left', suas: 'What you chose', reler: 'Read again and choose differently', mesmo: (p) => `${p}% of readers did the same`,
    perfilT: 'The Aheryn you shaped',
    pontos: 'Chapter score', jornada: 'Journey (Chapters I to V)', posicao: (p, n) => `#${p} of ${n} readers`, semCap1: 'Play the earlier chapters in this browser to add up the journey.',
    pts: { troca: 'The trade', minutos: 'The minutes', parto: 'The birth', rastro: 'The trail', antes: 'Chapters I to IV' },
  },
};

window.LIVRO = {
  id: 'cap05',
  chaveEstado: 'cap5',
  titulo: 'Aheryn',
  subtitulo: 'O Dia Comido',
  subtituloEn: 'The Eaten Day',
  tituloPag: 'Aheryn, o Dia Comido · As Quatro Vontades',
  tituloPagEn: 'Aheryn, the Eaten Day · The Four Wills',
  capa: IMG('capa'),
  luzInicial: 10,
  cantil: 6,
  proximo: { titulo: 'Um ano depois · Capítulo IV, Laus', tituloEn: 'A year later · Chapter IV, Laus', url: 'https://marcelomartinsjorge.github.io/the4willschapter4V2/' },

  // o Cap. I: o que o leitor deixou na Borda do Mundo (copiado uma vez, no início)
  inicio: (st) => {
    let a = {}; try { a = JSON.parse(localStorage.getItem('aqv_estado') || '{}') || {}; } catch (e) {}
    const k = a.cap1 || null;
    let guardados = []; try { const s1 = JSON.parse(localStorage.getItem('livro_cap01') || 'null'); guardados = (s1 && s1.guardados) || []; } catch (e) {}
    st.c1 = k ? { luz: k.luz, aug: k.aug || 0, gelunah: k.gelunah || 0, marcado: !!k.marcado, ferido: !!k.ferido, leu_tacets: !!k.leu_tacets, diario: !!k.diario, pedra: k.pedra || null, escolhas: k.escolhas || {}, guardados, veio: true } : { luz: 20, veio: false, escolhas: {} };
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
        texto: T('Hessa era criança na primeira vez que atirou uma pedra em mim. A pontaria melhorou desde então. A opinião sobre mim, nem um pouco.', 'Hessa was a child the first time she threw a stone at me. Her aim has improved since. Her opinion of me, not at all.') },
      { id: 'vinho', rotulo: T('O primeiro vinho de cacto.', 'The first cactus wine.'),
        texto: T('Meu primeiro vinho de cacto tinha gosto de vinagre onde um lagarto morreu. Bebi tudo. É preciso começar por algum lugar.', 'My first cactus wine tasted like vinegar a lizard had died in. I drank all of it. One has to start somewhere.') },
      { id: 'tempestade', rotulo: T('O cheiro de uma tempestade.', 'The smell of a storm.'),
        texto: T('Uma vez senti o cheiro de uma tempestade de areia um dia inteiro antes de ela chegar, e não contei a ninguém. Quem entende do tempo vira alguém a quem se começa a pedir coisas.', 'Once I smelled a sandstorm a full day before it came, and told no one. A man who knows the weather is a man people start to ask things of.') },
      { id: 'chuva', rotulo: T('Chuva, uma vez.', 'Rain, once.'),
        texto: T('Choveu uma vez, no décimo primeiro ano. Fiquei debaixo dela feito um tolo, e a luz subiu por baixo da pele, e eu deixei, porque não havia ninguém para ver além da chuva.', 'It rained once, in the eleventh year. I stood in it like a fool, and the light came up under my skin, and I let it, because there was no one to see but the rain.') },
      { id: 'menina', rotulo: T('Uma menina com febre.', 'A girl with a fever.'),
        texto: T('Uma menina Grakh, com uma febre que eu podia ter quebrado com um único pensamento. Dei à mãe a tintura. A tintura não bastou. A mãe nunca mais trocou comigo, e eu a entendi perfeitamente.', 'A Grakh girl, with a fever I could have broken with a single thought. I gave her mother the tincture instead. The tincture was not enough. Her mother never traded with me again, and I understood her perfectly.') },
      (c1(st).gelunah || 0) >= 1
        ? { id: 'frio', rotulo: T('Um olho violeta, sobre uma montanha.', 'A violet eye, over a mountain.'),
          texto: T('Trinta anos, e toda manhã ainda olho primeiro para o norte, antes de olhar para qualquer outro lugar. Lá não há nada além de mais deserto.', 'Thirty years, and every morning I still look north first, before I look anywhere else. There is nothing there but more desert.') }
        : { id: 'frio', rotulo: T('O frio.', 'The cold.'),
          texto: T('Sinto falta do frio como a língua sente falta de um dente arrancado: volta sempre ao lugar onde havia alguma coisa.', 'I miss the cold the way a tongue misses a pulled tooth: it keeps going back to the place where something used to be.') },
      (c1(st).guardados || []).length
        ? { id: 'guardado', rotulo: T('Algo que não afoguei, trinta anos atrás.', 'Something I did not drown, thirty years ago.'),
          texto: T('Na Borda do Mundo houve um pensamento que me recusei a afogar. Carreguei-o pela encosta inteira do mundo. Pesa o mesmo.', 'At the Edge of the World there was one thought I refused to drown. I carried it down the whole slope of the world. It weighs the same.') }
        : null,
      { id: 'titulo', forte: true, rotulo: T('O Título.', 'The Title.'),
        texto: T('O Título. Não vou dizê-lo. Ele não precisa de mim para isso.', 'The Title. I will not say it. It does not need me to.') },
    ].filter(Boolean),
    enterrarT: T('Enterrado.', 'Buried.'),
    subiuT: T('O que subiu', 'What rose'),
    nadaT: T('enterrou tudo', 'buried everything'),
  },

  troca: {
    itens: [
      { id: 'unguento', nome: T('Unguento', 'Ointment'), ic: 'pote' },
      { id: 'tintura', nome: T('Tintura de febre', 'Fever tincture'), ic: 'frasco' },
      { id: 'antidoto', nome: T('Antídoto', 'Antidote'), ic: 'gota' },
      { id: 'po', nome: T('Pó de esconder cheiro', 'Scent-masking powder'), ic: 'bolsa' },
    ],
    clientes: [
      { id: 'ghru', nome: 'Ghru', precisa: 'antidoto', oferta: T('duas tiras de carne seca', 'two strips of dried meat'),
        chega: T('Ghru sentou do outro lado do couro sem dizer nada, como sempre, como se a pedra fosse dele primeiro. Mantinha a mão esquerda afastada do corpo, com a palma para baixo. As costas da mão estavam inchadas e roxas em volta de dois furinhos.', 'Ghru sat down across the hide without a word, as he always does, as if the stone had been his first. He held his left hand away from his body, palm down. The back of it was swollen and purple around two small holes.'),
        bom: T('As narinas dele abriram.', 'His nostrils opened.'),
        aceita: T('Ghru pegou o antídoto, cheirou e virou tudo na boca de uma vez. A carne ficou no couro. É assim que se faz.', 'Ghru took the antidote, sniffed it, and tipped it into his mouth in one go. The meat stayed on the hide. That is how it is done.') },
      { id: 'tukk', nome: 'Tukk', precisa: 'unguento', oferta: T('um odre cheio de água', 'a full skin of water'),
        chega: T('Depois veio Tukk. Uma semana antes ele tinha vindo com uma ferida no flanco que fedia a podre, e eu lhe dera o unguento. Agora pôs a mão espalmada sobre o lugar, onde a pele tinha fechado limpa, deixou a mão ali, e olhou para os meus potes.', 'Tukk came next. A week before, he had come with a wound in his side that stank of rot, and I had given him the ointment. Now he laid his hand flat over the place, where the skin had closed clean, kept it there, and looked at my pots.'),
        bom: T('A mão dele saiu do flanco.', 'His hand came away from his side.'),
        aceita: T('Tukk pegou o pote e deixou o odre. Estava cheio. Pesava mais do que parecia, como a água sempre pesa.', 'Tukk took the pot and left the skin. It was full. It was heavier than it looked, as water always is.') },
      { id: 'durr', nome: 'Durr', precisa: 'po', oferta: T('uma pele de gato-do-deserto', 'a sand-cat hide'),
        chega: T('Durr, um caçador, cheirou a parte de dentro do próprio pulso, fez uma careta e pôs uma pele de gato-do-deserto na pedra. Quem se cheira antes da caçada é quem já foi farejado primeiro.', 'Durr, a hunter, sniffed the inside of his own wrist, made a face, and laid a sand-cat hide on the stone. A man who smells himself before a hunt is a man who has been smelled first.'),
        bom: T('Ele se inclinou para a frente.', 'He leaned in.'),
        aceita: T('Durr pegou a bolsinha de pó, enfiou no cinto e foi embora agachado, como quem já está caçando.', 'Durr took the pouch of powder, tucked it into his belt and left already crouching, a man halfway into the hunt.') },
    ],
    errado: T('{n} olhou para aquilo, depois para mim, e não se mexeu.', '{n} looked at it, then at me, and did not move.'),
    demais: T('A mão dele parou acima do couro. Os Grakh não pegam mais do que é justo; cheira demais a dívida.', 'His hand stopped above the hide. The Grakh do not take more than is fair; it smells too much like owing.'),
    devolve: T('Ele empurrou de volta o que sobrava, com um dedo só, e pegou apenas o justo.', 'He pushed the extra back across the hide with one finger and took only what was fair.'),
    recusa: T('Ele não se mexeu. O couro ficou entre nós.', 'He did not move. The hide stayed between us.'),
    vaiEmbora: T('{n} levantou e foi embora, levando o que tinha trazido.', '{n} got up and left, taking what he had brought.'),
    empurrar: T('Empurrar o couro', 'Push the hide across'),
    oferece: T('Oferece', 'Offers'),
    teus: T('Seus potes', 'Your pots'),
    noCouro: T('No couro', 'On the hide'),
    hessaViu: T('Hessa viu.', 'Hessa saw.'),
  },

  minutos: {
    // custo em marcas do anel (o anel tem 5); o tempo também corre sozinho
    acoes: [
      { id: 'ouvir', custo: 2, x: 15, y: 20, rotulo: T('Subir a duna e ouvir', 'Climb the dune and listen'), trava: (st) => !sobrio(st), motivo: T('ouvido turvo de vinho', 'ears dulled by wine'),
        texto: [
          T('Do alto da duna o campo era uma tigela de barulho, e deixei os ouvidos descerem por ela, passando pelos urros, pelos cavalos, até achar dois homens de Redom agachados atrás de um escudo, falando alto demais, do jeito que falam os homens com medo.', 'From the top of the dune the field was a bowl of noise, and I let my ears go down into it, past the roaring, past the horses, until I found two men of Redom crouched behind a shield, talking too loud, the way frightened men do.'),
          T('— Eles não ficam no chão, capitão. A gente corta no primeiro dia e no terceiro estão de volta na linha, fedendo àquela graxa cinza.', '— They don’t stay down, Captain. We cut them on the first day and they’re back in the line by the third, stinking of that grey grease.'),
          T('— Por isso ele veio em pessoa. Este ano, não. Ele diz que, se deixarmos um de pé nos poços, nossos filhos vão voltar aqui de barba.', '— That’s why he came himself. Not this year. He says if we leave one standing at the wells, our sons will be back here with beards.'),
          T('Graxa cinza. Resina, raiz amarga e a argila em que eu moo as duas. Eu a tinha trocado por água e por ser deixado em paz. Tinham me deixado em paz. E ali estava a conta, vinda lá do leste, numa coluna tão reta que parecia riscada a régua na areia.', 'Grey grease. Resin, bitter root, and the clay I grind them in. I had traded it for water and for being left alone. I had been left alone. And here was the bill, come all the way from the east, in a column so straight it looked ruled onto the sand.'),
        ], voz: 'c01-ouvir' },
      { id: 'po', custo: 2, x: 84, y: 47, rotulo: T('Jogar o pó no vento dos cavalos', 'Throw the powder into the horses’ wind'),
        texto: [T('Desci pelas pedras até onde o vento corria dos poços na direção dos cavalos de Redom, abri a bolsa e soltei o pó. Ele é feito para esconder o cheiro de um homem daquilo que ele caça. O que faz com um cavalo que já não enxerga é outra coisa. A fileira de cavalos em volta do Tinido empinou toda de uma vez, derrubou dois cavaleiros e disparou, e pelo espaço de um fôlego não houve nada entre o Tinido e o escuro além de ar.', 'I came down along the rocks to where the wind ran from the wells toward the Redom horses, opened the pouch, and let the powder go. It is made to hide a man’s smell from whatever he hunts. What it does to a horse that can no longer see is something else. The line of horses around the Tinn went up on their hind legs all at once, threw two riders, and bolted, and for the space of a breath there was nothing between the Tinn and the dark but air.')] },
      { id: 'tukk', custo: 2, x: 67, y: 79, rotulo: T('Arrastar Tukk para fora da linha', 'Drag Tukk out of the line'),
        texto: [
          T('Tukk estava no chão, com uma segunda lança no corpo e a primeira ainda no ombro, tentando se levantar num braço que já não obedecia. Peguei-o por baixo dos ombros e puxei. Ele pesava o que pesa um cavalo. Não usei a luz para isso, e as minhas costas vão se lembrar por mais tempo do que eu.', 'Tukk was down, with a second spear in him and the first still in his shoulder, trying to get up on an arm that no longer answered. I took him under both shoulders and pulled. He weighed what a horse weighs. I did not use the light to do it, and my back will remember it longer than I will.'),
          se((st) => !!c1(st).ferido, T('O ombro velho, o que a pedra de Gromm tinha achado, gritou o caminho inteiro.', 'The old shoulder, the one Gromm’s rock had found, screamed the whole way.')),
        ] },
      { id: 'shaa', custo: 2, x: 58, y: 64, rotulo: T('Ir até Shaa, no poço', 'Go to Shaa, at the well'),
        texto: [T('Shaa estava na borda do poço, de joelhos, os dois braços em volta da barriga, como se o escuro fosse chuva e a cria pudesse se molhar. Ajoelhei ao lado dela, peguei-a pelo braço e comecei a puxá-la para as pedras, e ela veio, devagar, tão depressa quanto duas pessoas conseguem.', 'Shaa was on the rim of the well, on her knees, both arms around her belly, as if the dark were rain and the child might get wet. I knelt beside her, took her by the arm and began to pull her toward the rocks, and she came, slowly, as fast as two people can.')] },
      { id: 'beber', custo: 1, x: 50, y: 93, rotulo: T('Beber', 'Drink'), trava: (st) => st.cantil <= 0, motivo: T('o odre está vazio', 'the skin is empty'),
        texto: [T('Bebi, ali, no escuro, com o mundo acabando em volta, porque é o que minhas mãos sabem fazer quando não sabem o que fazer.', 'I drank, there, in the dark, with the world ending around me, because it is what my hands do when they do not know what to do.')] },
      { id: 'esconder', custo: 0, x: 22, y: 86, fim: true, rotulo: T('Esconder-se nas pedras e esperar', 'Hide among the rocks and wait'),
        texto: [T('Encostei as costas nas pedras e esperei a luz, como um bicho sensato. É uma coisa em que sou muito bom. Nunca tive menos orgulho de uma habilidade.', 'I pressed my back into the rocks and waited for the light, like a sensible animal. It is a thing I am very good at. I have never been less proud of a skill.')] },
    ],
    marcas: 5, segundosPorMarca: 11,
    anelT: T('o sol voltando', 'the sun returning'),
    acabouT: T('A borda do sol aparece.', 'The rim of the sun appears.'),
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
  },

  rastro: {
    pira: { x: 77, y: 76 },
    tacetsDe: { x: 62, y: 10 },
    cantarT: T('Cantar', 'Sing'),
    irT: T('Seguir em frente', 'Walk on'),
    distT: T('Distância da Pira', 'Distance from the Pyre'),
    minT: T('mínimo', 'minimum'),
    longeT: T('Longe o bastante. Pode seguir.', 'Far enough. You can walk on.'),
    pertoT: T('Ainda perto demais da Pira.', 'Still too close to the Pyre.'),
    alcanceT: T('Longe demais para um passo. Acenda mais perto.', 'Too far for one stride. Light closer.'),
    quatroT: T('O compasso quebrou de três para quatro.', 'The count broke from three to four.'),
  },

  // ---------------------------------------------------------------- o diário (só para quem o levou no Cap. I)
  diario: {
    titulo: T('Lembranças do Velho Mundo', 'Memories of the Old World'),
    entradas: [
      { titulo: T('Do primeiro ano seco', 'The first dry year'), texto: T('Areia em tudo. No pão, na tinta, nas dobras desta página. Decidi parar de brigar com ela e chamá-la de tempero.', 'Sand in everything. In the bread, in the ink, in the creases of this page. I have decided to stop fighting it and call it seasoning.') },
      { titulo: T('Sobre os Grakh', 'On the Grakh'), texto: T('Dão nome a uma coisa pelo primeiro som que ela faz. Uma criança, pelo primeiro choro; um bicho, pelo último. Em onze anos não me deram nome. Considero o maior elogio que o deserto sabe fazer.', 'They name a thing by the first sound it makes. A child by its first cry; a beast by its last. In eleven years they have not named me. I take it as the highest compliment the desert knows how to pay.') },
      { titulo: T('Sobre a menina', 'On the girl'), texto: T('A febre levou a menina na quarta noite. Eu tive a cura na cabeça o tempo todo, dobrada bem pequena, onde guardo tudo o que não me é permitido usar. A mãe parou de vir ao ponto de troca.', 'The fever took the girl on the fourth night. I had the cure in my head the whole time, folded small, where I keep everything I am not allowed to use. Her mother has stopped coming to the trading stone.') },
      { titulo: T('Ontem à noite', 'Last night'), texto: T('Duas noites sem lua. O meu povo saberia o que isso quer dizer. Eu só sei que eles saberiam.', 'Two nights without a moon. My people would have known what that means. I only know that they would have known.') },
      { titulo: T('Outras páginas', 'Other pages'), texto: T('Há outras. Podem esperar. Tudo neste deserto pode esperar, menos a água.', 'There are others. They can wait. Everything in this desert can wait, except water.') },
    ],
    abrir: T('Abrir', 'Open'), fechar: T('Fechar', 'Close'), voltar: T('← Voltar', '← Back'),
  },

  paginas: [

    // ===================================================== I · A LAJE
    { id: 'parte-I', parte: 'I', zona: 'laje', fundo: { img: IMG('laje'), kb: 'in', dim: .62, clima: 'areia' },
      cartao: { num: 'I', nome: T('A Laje', 'The Slab'), epigrafe: T('No deserto, a água não se pede. Troca-se.', 'In the desert, no one asks for water. They trade for it.'), fonte: T('ditado dos Queimados', 'saying of the Burned') } },

    { id: 'a01', zona: 'laje', fundo: { clip: CLIP('ressaca'), img: IMG('areia-amanhecer'), dim: .38, foco: '70% 55%', clima: 'areia' }, capitular: true,
      narracao: 'assets/audio/voz/a01-areia.mp3', narracaoLang: 'en',
      texto: [
        T('O deserto me acordou do jeito de sempre, pondo fogo em tudo o que a noite tinha deixado descoberto. Fiquei de cara na areia e fiz o inventário. Uma cabaça, vazia. Dois pés enterrados até o tornozelo, o que não me incomodava; amei poucas coisas sem reservas numa vida longa, e areia sob a sola é uma delas. Uma cabeça cheia de um silêncio que eu tinha pago com vinho de cacto e que voltaria a pagar antes do meio-dia.', 'The desert woke me the way it always did, by setting fire to whatever the night had left uncovered. I lay with my face in the sand and took stock. One gourd, empty. Two feet, buried to the ankles, which I did not mind; I have loved few things without reservation in a long life, and sand under the soles is one of them. One head, full of a silence I had paid for in cactus wine and would be paying for again by noon.'),
        T('Trinta anos. Eu tinha descido para o sul para ser ninguém, e o deserto, que só é generoso numa coisa, me fez exatamente isso.', 'Thirty years. I had come south to be no one, and the desert, which is generous in exactly one thing, had made me precisely that.'),
      ],
      escolha: { id: 'acordar', pergunta: T('Antes de levantar:', 'Before getting up:'), opcoes: [
        { id: 'sacudir', tom: 'frieza', txt: T('Sacudir a areia.', 'Shake off the sand.'),
          resultado: [T('Levantei e bati a areia da roupa como quem quita uma dívida. Ela voltou no passo seguinte. O deserto não aceita pagamento.', 'I stood and beat the sand out of my clothes like a man settling a debt. It was back by the next step. The desert does not accept payment.')] },
        { id: 'ficar', tom: 'ternura', luz: 2, txt: T('Ficar mais um pouco com os pés nela.', 'Stay a little longer with my feet in it.'),
          resultado: [T('Fiquei. A areia estava fresca a um palmo de fundura, como toda manhã, e toda manhã isso me surpreende, e já não restam muitas coisas que me surpreendam.', 'I stayed. The sand was cool a hand’s depth down, as it is every morning, and every morning it surprises me, and there are not many things left that do.')] },
        { id: 'gota', tom: 'ironia', txt: T('Procurar a última gota na cabaça.', 'Look in the gourd for a last drop.'),
          resultado: [T('Virei a cabaça sobre a boca e esperei, com a paciência dos verdadeiramente devotos. Nada caiu. Há manhãs em que até a fé vem vazia.', 'I tipped the gourd over my mouth and waited, with the patience of the truly devout. Nothing came. Some mornings even faith is empty.')] },
      ] } },

    { id: 'a02', zona: 'laje', fundo: { img: IMG('areia-amanhecer'), kb: 'in', dim: .5, foco: '70% 55%', clima: 'areia' },
      texto: [
        T('Os pensamentos voltaram com o sol. Sempre voltam. A noite os afoga e o calor os traz de volta, inchados, do jeito que o deserto devolve o que engoliu: anos depois e no lugar errado.', 'The thoughts came back with the sun. They always do. The night drowns them, and the heat brings them up again, swollen, the way the desert gives back whatever it has swallowed: years later, and in the wrong place.'),
      ],
      minijogo: 'ressaca',
      depois: (st) => {
        const n = ((st.jogos.ressaca && st.jogos.ressaca.subiram) || []).length;
        return [n === 0 ? T('Enterrei todos. A areia aceitou sem comentário. É uma boa ouvinte; é do que gosto nela, e o que não lhe perdoo.', 'I buried all of them. The sand took them without comment. It is a good listener; that is what I like about it, and what I hold against it.')
          : n <= 3 ? T('Alguns chegaram à superfície antes que eu os impedisse, e ficaram ali no calor, e eu os deixei ficar.', 'A few of them reached the surface before I could stop them, and lay there in the heat, and I let them lie.')
            : T('Deixei que viessem. Um homem só consegue enterrar até certo ponto antes de estar de pé numa cova que ele mesmo cavou.', 'I let them come. A man can only bury so much before he is standing in a grave of his own digging.')];
      } },

    { id: 'a03', zona: 'laje', fundo: (st) => (temDiario(st) ? { img: IMG('diario-deserto'), kb: 'in', dim: .55, foco: '30% 50%', lado: 'dir', clima: 'areia' } : { img: IMG('areia-amanhecer'), kb: 'out', dim: .55, foco: '60% 50%', clima: 'areia' }),
      narracao: (st) => ((c1(st).luz || 0) >= 50 ? 'assets/audio/voz/a03-alta.mp3' : 'assets/audio/voz/a03-baixa.mp3'), narracaoLang: 'en',
      texto: [
        se((st) => (c1(st).luz || 0) >= 50, T('Não desci para o sul em silêncio. Três dias depois do último gelo, caçadores me acharam num desfiladeiro de rocha negra, homens com redes e uma ordem lacrada. Lembro mais das redes do que dos homens. Lembro que daquela vez não recusei a luz, e que a rocha também se lembra: há um lugar naquele desfiladeiro onde nada cresce, e os Queimados dão a volta por ele.', 'I did not come south quietly. Three days past the last ice, hunters found me in a pass of black rock, men with nets and a sealed writ. I remember the nets better than the men. I remember that I did not refuse the light that time, and that the rock remembers it too: there is a place in that pass where nothing grows, and the Burned walk around it.')),
        se((st) => (c1(st).luz || 0) < 50, T('Desci para o sul do jeito que a neve sai de um telhado, toda de uma vez e sem ruído. Quarenta dias de caminhada. O gelo virou cascalho, o cascalho virou pedra, a pedra virou areia, e em toda aquela encosta comprida do mundo ninguém pensou em olhar duas vezes para mais um velho descendo a ladeira. Cuidei disso: mantive os olhos nos pés e os pensamentos em coisa nenhuma.', 'I came south the way snow leaves a roof, all at once and without a sound. Forty days of walking. The ice turned to scree, the scree to stone, the stone to sand, and in all that long slope of the world nobody thought to look twice at one more old man going downhill. I saw to that: I kept my eyes on my feet and my thoughts on nothing.')),
        se(marcado, T('Em algum ponto daquela caminhada parei de reparar que a luz já não subia pelo antebraço onde a mão de bronze tinha fechado. A pele ali ficou lisa e fria, como pedra de rio, e a luz passava em volta dela como a água passa em volta de uma pedra.', 'Somewhere on that walk I stopped noticing that the light no longer climbed through the forearm the bronze hand had closed on. The skin there had gone smooth and cold, like a river stone, and the light went around it the way water goes around a stone.')),
        (st) => (temPedra(st) ? nomePedra[c1(st).pedra.motivo] ? [T('{P1} desceu comigo, no mesmo pano, e até hoje não me disse o que é.', '{P1} came south with me, in the same cloth, and has still not told me what it is.')] : null : null),
        se(temDiario, T('O diário também desceu comigo. Em trinta anos acrescentei onze páginas, o que dá mais ou menos uma a cada três anos, o que é mais ou menos a frequência com que tive algo que valesse a pena não esquecer.', 'The diary came south too. In thirty years I have added eleven pages to it, which is roughly one every three years, which is roughly how often I have had something worth not forgetting.')),
      ] },

    { id: 'a04', zona: 'laje', fundo: { img: IMG('laje'), kb: 'in', dim: .45, foco: '60% 55%', clima: 'poeira' }, capitular: true, bebe: true,
      texto: [
        T('A Laje é uma única língua de pedra que o vento lambe há mais tempo do que o meu povo mantinha registros, e isso é muito tempo. Embaixo dela guardo tudo o que tenho. Não é muito. É exatamente o bastante para um estranho achar que alguém mora aqui, e uma casa não serve para mais nada.', 'The slab is a single tongue of rock that the wind has been licking for longer than my people kept records, which is a long time. Under it I keep everything I own. It is not much. It is exactly enough to make a stranger think somebody lives here, and that is all a house is for.'),
        T('Antes de descer ao acampamento, contei tudo. Trinta anos, e nunca dei por falta de nada. Conto assim mesmo.', 'Before going down to the camp, I counted everything. Thirty years, and I have never once found anything missing. I count anyway.'),
      ],
      minijogo: 'laje',
      laje: {
        img: IMG('laje'), proporcao: 1920 / 1080,
        instrucao: T('Conferir a Laje', 'Check the slab'), porta: T('Descer ao acampamento', 'Go down to the camp'),
        fecho: T('Estava tudo onde eu tinha deixado, menos a água. Peguei o odre vazio e desci.', 'Everything was where I had left it, except the water. I took the empty skin and went down.'),
        pontos: [
          { id: 'cabacas', x: 64, y: 58, w: 14, h: 20, rotulo: T('As cabaças', 'The gourds'), som: 'cabaca',
            texto: [T('Fruto de cacto amassado, deixado brigando consigo mesmo no escuro por nove dias. No décimo destilo o que sobrou num alambique de barro que eu mesmo construí e nunca perdoei. Sai límpido, cheira a açúcar queimado e cachorro velho, e faz o que preciso que faça.', 'Cactus fruit, mashed and left to argue with itself in the dark for nine days. On the tenth I distill what is left in a clay still I built myself and have never forgiven. It comes out clear, smells of burnt sugar and old dogs, and does what I need it to do.')] },
          { id: 'potes', x: 88, y: 80, w: 20, h: 22, rotulo: T('Os potes', 'The pots'), som: 'pote-abre',
            texto: [T('O unguento para feridas, a tintura para febre, o antídoto para bichos de ferrão, o pó que esconde o cheiro de um homem daquilo que ele caça. Trinta anos atrás eu não conhecia nenhuma dessas plantas. Hoje conheço como conhecia as estrelas, ou seja, melhor do que gostaria.', 'Ointment for wounds, tincture for fever, antidote for things with stings, the powder that hides a man’s smell from whatever he hunts. Thirty years ago I knew none of these plants. Now I know them the way I used to know the stars, which is to say better than I would like.')] },
          { id: 'riscos', x: 67, y: 30, w: 8, h: 14, rotulo: T('Os riscos', 'The marks'),
            texto: [T('Um risco para cada estação seca. No norte eu contava invernos numa viga. Aqui conto secas numa pedra. Parei de conferir o total no vigésimo ano. A pedra e eu discordamos sobre ele, como a viga e eu discordávamos, e aprendi a deixar as coisas inanimadas ganharem.', 'One scratch for every dry season. In the north I counted winters on a beam. Here I count droughts on a rock. I stopped checking the total in the twentieth year. The rock and I disagree about it, as the beam and I did, and I have learned to let inanimate things win.')] },
          { id: 'odre', x: 91, y: 33, w: 9, h: 24, rotulo: T('O odre', 'The water skin'),
            texto: [T('Vazio. No fim da estação seca tudo está vazio, menos os poços, e os poços são onde todos estão. Eu teria de ir às Goelas.', 'Empty. At the end of the dry season everything is empty except the wells, and the wells are where everyone is. I would have to go to the Gullets.')] },
          { id: 'panos', x: 53, y: 27, w: 13, h: 26, rotulo: T('Os panos', 'The wraps'),
            texto: [T('Faixas compridas de pano cru. O sol daqui queimaria uma pele como a minha até virar papel numa única tarde, e o pano impede isso. Impede também que alguém veja o que se mexe por baixo dela quando eu penso. Uso pelo primeiro motivo. É o que digo a mim mesmo, e tenho o velho hábito de acreditar em mim.', 'Long strips of undyed cloth. The sun here would burn skin like mine to paper in a single afternoon, and the cloth stops that. It also stops anyone from seeing what moves underneath it when I think. I wear it for the first reason. That is what I tell myself, and I have a long habit of believing me.')] },
          { id: 'pele', x: 14, y: 86, w: 22, h: 18, opcional: true, rotulo: T('A pele', 'The hide'),
            texto: [T('Uma pele de gato-do-deserto no chão, onde um homem dormiria, se dormisse. Eu não durmo. Algumas noites deito nela de olhos abertos e deixo o escuro passar através de mim, que é o mais perto que a minha espécie chega, e desconfio que não seja muito perto.', 'A sand-cat hide on the floor, where a man would sleep, if he slept. I do not. Some nights I lie on it with my eyes open and let the dark go through me, which is as close as my kind comes, and which I suspect is not very close at all.')] },
          { id: 'presas', x: 75, y: 26, w: 8, h: 24, opcional: true, rotulo: T('As presas', 'The tusks'),
            texto: [T('Pagamento dos Grakh, ao longo dos anos. Eles pagam com o que têm, e o que têm são quase sempre as partes dos bichos que já comeram. Tenho uma parede inteira de gratidão que não serve para nada.', 'Payment from the Grakh, over the years. They pay in what they have, and what they have is mostly the parts of animals they have already eaten. I have a whole wall of gratitude I cannot use.')] },
          { id: 'pedra', x: 25, y: 61, w: 6, h: 8, opcional: true, se: temPedra, gema: true, rotulo: T('A pedra', 'The stone'),
            texto: (st) => [T('{P1} estava no pano, dentro da tigela de sempre. Naquela luz, cinza. Só tem a cor que escolhe.', '{P1} lay in its cloth, in the usual bowl. In that light, grey. It is only ever the colour it chooses.')] },
          { id: 'diario', x: 38, y: 61, w: 7, h: 8, opcional: true, se: temDiario, tipo: 'diario', rotulo: T('O diário', 'The diary') },
        ],
      },
      depois: [T('Estava tudo onde eu tinha deixado, menos a água. Peguei o odre vazio e desci.', 'Everything was where I had left it, except the water. I took the empty skin and went down.')] },

    { id: 'a05', zona: 'acampamento', fundo: { img: IMG('acampamento'), kb: 'in', dim: .45, foco: '30% 50%', lado: 'dir', clima: 'areia' }, capitular: true,
      texto: [
        T('O acampamento estava três vezes maior que uma semana antes, e crescia enquanto eu olhava. Hordas chegavam de todos os cantos da Boca Seca, longas filas pardas levantando o tipo de poeira que se vê a um dia de distância. No fim da estação seca os Grakh vão às Goelas beber, todos eles, porque não sobra outro lugar onde beber. Naquela semana, a Pira Errante fica onde estiver a água.', 'The camp was three times the size it had been a week before, and growing while I watched. Hordes were coming in from every quarter of the Dry Mouth, long brown lines of them, raising the kind of dust you can see from a day away. At the end of the dry season the Grakh go to the Gullets to drink, all of them, because there is nowhere else left to drink. For that one week, the Wandering Pyre is wherever the water is.'),
        T('Redom sabe disso. Sabe há mais tempo do que estou aqui, e vem todo ano aos mesmos poços na mesma semana, e todo ano os Grakh estão lá. Não se pode pedir a um povo com sede que seja esperto sobre onde vai beber.', 'Redom knows this. Redom has known it for longer than I have been here, and comes every year to the same wells in the same week, and every year the Grakh are there. You cannot ask a thirsty people to be clever about where they drink.'),
        T('Trinta anos, e nunca me deram um nome. Os Grakh nomeiam as coisas pelo som que elas fazem, e eu tomei muito cuidado para não fazer nenhum.', 'Thirty years, and they had never given me a name. The Grakh name a thing by the sound it makes, and I have been very careful to make none.'),
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
        T('Meu ponto de troca é uma pedra chata na borda do acampamento e um couro que estendo em cima dela. Os Grakh não comerciam; me disseram isso no meu primeiro ano, com uma lança, e eu nunca discuti. O que fazem é pôr uma coisa ao lado de outra, olhar para as duas e decidir. Se isso não é comércio, é pelo menos o irmão mais novo dele, aquele que ainda não aprendeu a mentir.', 'My place of trade is a flat stone at the edge of the camp, and a hide I spread over it. The Grakh do not trade; they told me so in my first year, with a spear, and I have never argued. What they do instead is put one thing down beside another thing, look at both, and decide. If that is not trade, it is at least its younger brother, the one who has not yet learned to lie.'),
      ],
      minijogo: 'troca',
      depois: (st) => {
        const t = st.jogos.troca || {}, ok = Object.values(t.ok || {}).filter(Boolean).length, demais = t.demais || 0;
        return [
          ok === 3 && !demais ? T('Três trocas, três exatas. Ninguém agradeceu, e ninguém precisava. Quando uma coisa é justa, não sobra nada a dizer.', 'Three trades, three exact. Nobody thanked me, and nobody needed to. When a thing is fair, there is nothing left over to say.')
            : ok < 3 ? T('Nem toda troca fechou. As que não fecharam foram embora sem uma palavra, o que entre os Grakh é uma palavra.', 'Not every trade closed. The ones that did not went away without a word, which among the Grakh is a word.')
              : T('Dei mais do que era justo, e o que sobrava voltou para mim pelo couro. Não se dá presente a um Grakh. Só se consegue deixá-lo desconfiado.', 'I gave more than was fair, and the extra came back to me across the hide. You cannot give a Grakh a gift. You can only make him suspicious.'),
          se(tukkTrocou, T('O odre estava cheio outra vez.', 'The water skin was full again.')),
          se((st) => !tukkTrocou(st), T('Eu continuava sem água.', 'I still had no water.')),
        ];
      } },

    { id: 'a07', zona: 'acampamento', fundo: { img: IMG('shaa'), kb: 'in', dim: .4, foco: '78% 40%', clima: 'poeira' }, capitular: true,
      texto: [
        T('Depois, Shaa. Ela atravessou a areia na velocidade de uma mulher que carrega uma segunda pessoa, uma mão embaixo da barriga como para segurá-la, e já vinha rindo antes de chegar, de alguma coisa que eu não via. A maioria dos Grakh fica a uma lança de distância de mim sem pensar nisso, do jeito que se mantém a mão longe do fogo. Shaa sentou tão perto que nossos joelhos quase se tocaram.', 'Then Shaa. She came across the sand at the speed of a woman carrying a second person, one hand under her belly as if to keep it from falling, and she was laughing before she reached me, at nothing I could see. Most of the Grakh keep a spear’s length from me without thinking about it, the way you keep your hand away from a fire. Shaa sat down so close our knees almost touched.'),
        T('— Shaa ter dor. Aqui, e aqui. A cria chutar como querer sair pelas costas.', '— Shaa have pain. Here, and here. Baby kick like it want out through the back.'),
        T('Não trazia nada nas mãos. Olhou para elas como se isso a surpreendesse e então tirou do pescoço o cordão: um único dente, maior que o meu dedo.', 'She had nothing in her hands. She looked at them as if this surprised her, and then took the cord from around her neck: a single tooth, longer than my finger.'),
        T('— Primeira caçada. Primeira morte da Shaa. Dente bom.', '— First hunt. Shaa first kill. Good tooth.'),
      ],
      dialogo: { interlocutor: 'Shaa', rodadas: [
        { id: 'dente', pergunta: T('O dente sobre o couro:', 'The tooth on the hide:'), opcoes: [
          { id: 'aceitar', tom: 'ternura', shaa: 1, txt: T('Aceitar o dente.', 'Accept the tooth.'),
            resposta: [T('— Bom. Agora Shaa não dever nada. Agora você não dever nada.', '— Good. Now Shaa owe nothing. Now you owe nothing.'), T('Dei a ela a tintura para a dor. Ela virou na boca como se fosse doce e fez uma careta que o acampamento inteiro podia ler.', 'I gave her the tincture for the pain. She tipped it into her mouth like a sweet and made a face the whole camp could have read.')] },
          { id: 'presente', tom: 'ternura', shaa: 1, pira: -1, aviso: T('Alguém viu.', 'Someone saw.'), txt: T('Dizer a ela que fique com o dente.', 'Tell her to keep the tooth.'),
            resposta: [T('— Grakh não aceitar presente. Presente ser dívida sorrindo.', '— Grakh not take gift. Gift is debt with a smile.'), T('Ela olhou por cima do ombro antes de pegar a tintura assim mesmo, depressa, e pendurou o dente de volta no pescoço. Alguém na borda do acampamento tinha visto.', 'She looked over her shoulder before she took the tincture anyway, quickly, and hung the tooth back around her neck. Someone at the edge of the camp had seen.')] },
          { id: 'nada', tom: 'frieza', txt: T('Nada em troca de nada.', 'Nothing for nothing.'),
            resposta: [T('— Justo.', '— Fair.'), T('Disse do jeito que os Grakh dizem tudo o que é verdade, sem sentimento nenhum, e levantou e foi embora. Ao meio-dia voltou com um odre de água, sentou à mesma distância, perto demais, e estendeu a mão.', 'She said it the way the Grakh say everything that is true, without any feeling about it, and got up and left. At midday she came back with a skin of water, sat down at the same distance, too close, and held out her hand.')] },
        ] },
        { id: 'verLuz', antes: [T('— Dizer que você ter luz. Debaixo da pele. Como fogo debaixo da areia. Shaa querer ver.', '— They say you have light. Under the skin. Like fire under sand. Shaa want to see.')],
          pergunta: T('Ela quer ver a luz.', 'She wants to see the light.'), opcoes: [
            { id: 'mostrar', tom: 'ternura', luz: 10, shaa: 1, hessa: -1, flag: 'mostrou_luz', aviso: T('Hessa viu a luz.', 'Hessa saw the light.'), txt: T('Puxar o pano do pulso e pensar em alguma coisa.', 'Pull the cloth back from my wrist and think of something.'),
              resposta: [T('Puxei o pano do pulso e pensei em chuva. A luz subiu pelas veias como água subindo num poço seco. Shaa parou de rir. Pegou o meu pulso e o encostou na barriga, sem pedir, e alguma coisa lá dentro chutou o lugar onde estava a luz, com força, duas vezes.', 'I pulled the cloth back from my wrist and thought of rain. The light came up through the veins like water rising in a dry well. Shaa stopped laughing. She took my wrist and laid it against her belly, without asking, and something inside kicked the place where the light was, hard, twice.'), T('— A cria gostar.', '— Baby like it.')] },
            { id: 'piada', tom: 'ironia', txt: T('“Ela só aparece quando estou bêbado, e ainda não estou bêbado o bastante para você.”', '“It only comes out when I’m drunk, and I’m not drunk enough for you yet.”'),
              resposta: [T('— Shaa esperar.', '— Shaa wait.'), T('Ela acomodou o peso na areia, as duas mãos na barriga, e não levantou.', 'She settled her weight on the sand, both hands on her belly, and did not get up.')] },
            { id: 'calar', silencio: true, tom: 'frieza', luz: -2,
              resposta: [T('Ela esperou. Depois deu dois tapinhas no meu joelho, do jeito que se dá num bicho que não entendeu, e levantou.', 'She waited. Then she patted my knee, twice, the way you pat an animal that has not understood, and got up.')] },
          ] },
      ] } },

    { id: 'a08', zona: 'acampamento', fundo: { img: IMG('ghru'), kb: 'in', dim: .42, foco: '72% 45%', clima: 'poeira' }, capitular: true,
      texto: [
        T('Na sombra de uma parede de couro, Ghru mastigava uma raiz com a concentração lenta dos muito velhos. É o Grakh mais velho que conheço. Tem trinta e oito anos. Entre o povo dele, é uma idade que se anuncia, como um título, e ele anuncia sempre.', 'In the shade of a hide wall, Ghru was chewing a root with the slow concentration of the very old. He is the oldest Grakh I know. He is thirty-eight. Among his people that is an age you announce, like a title, and he announces it often.'),
        T('— Amanhã, as Goelas. Todo mundo. E o Tinido vir, como todo ano. Este ano ele trazer mais homem que areia.', '— Tomorrow, the Gullets. Everybody. And the Tinn come, like every year. This year he bring more men than sand.'),
        T('Tinido é como os Grakh chamam o comandante de Redom: o som que a armadura dele faz quando ele anda. Deram-lhe nome do único jeito que dão nome a qualquer coisa.', 'The Tinn is what the Grakh call the commander of Redom: the sound his armour makes when he walks. They had named him the only way they name anything.'),
        T('— E talvez o dia ser comido.', '— And maybe the day be eaten.'),
        T('Riu com os ombros.', 'He laughed with his shoulders.'),
        T('— Quando o dia ser comido, nascer o maior. A mãe de Ghru dizer isso. A mãe dela dizer isso. Ninguém ver. Todo mundo lembrar.', '— When the day be eaten, the greatest be born. Ghru mother say that. Her mother say that. Nobody see. Everybody remember.'),
      ],
      dialogo: { interlocutor: 'Ghru', rodadas: [
        { id: 'ghru1', pergunta: T('Perguntar a Ghru:', 'Ask Ghru:'), opcoes: [
          { id: 'come', tom: 'curiosidade', txt: T('“O que é que come um dia?”', '“What eats a day?”'),
            resposta: [T('— Ghru não saber. A mãe de Ghru não saber. Ela dizer assim mesmo. Dizer não custar nada.', '— Ghru not know. Ghru mother not know. She say it anyway. Saying cost nothing.')] },
          { id: 'tinido', tom: 'curiosidade', flag: 'perguntouTinido', txt: T('“Me fale do Tinido.”', '“Tell me about the Tinn.”'),
            resposta: [T('— Ele andar na frente. Sempre na frente. Outros chefes empurrar os homens, o Tinido ir primeiro. Hessa querer muito a cabeça dele.', '— He walk in front. Always in front. Other chiefs push the men ahead, Tinn go first. Hessa want his head very much.')] },
          { id: 'dentes', tom: 'ironia', txt: T('Contar os dentes dele em vez de ouvir.', 'Count his teeth instead of listening.'),
            resposta: [T('Onze. No ano anterior eram catorze. Ghru percebeu que eu contava e arreganhou os dentes, para ajudar.', 'Eleven. Last year there had been fourteen. Ghru noticed me counting and bared them, to help.'), T('— Você não ouvir. Bom. Ninguém ouvir Ghru. Ghru falar assim mesmo.', '— You not listen. Good. Nobody listen to Ghru. Ghru talk anyway.')] },
        ] },
        { id: 'ghru2', pergunta: T('E então:', 'And then:'), opcoes: [
          { id: 'nome', tom: 'curiosidade', flag: 'sabeNome', txt: T('“Quem te deu o nome?”', '“Who gave you your name?”'),
            resposta: [T('— Mãe. Ghru nascer com areia na garganta. Primeiro som: ghrrru. Então: Ghru.', '— Mother. Ghru born with sand in throat. First sound: ghrrru. So: Ghru.'), T('Fez o som para mim, um pequeno desmoronamento no fundo da garganta, muito satisfeito, como se o tivesse inventado naquela manhã.', 'He made the sound for me, a small rockslide at the back of his throat, very pleased with it, as if he had invented it that morning.')] },
          { id: 'maior', tom: 'curiosidade', txt: T('“Quem foi o maior, da última vez?”', '“Who was the greatest, the last time?”'),
            resposta: [T('— Ninguém saber. Ele vir quando o dia ser comido, ele ir. Não morrer. Só ir. Talvez voltar. Talvez Ghru comer esta raiz e morrer. Quem saber.', '— Nobody know. He come when the day be eaten, he go. Not die. Just go. Maybe come back. Maybe Ghru eat this root and die. Who know.')] },
          { id: 'deixar', tom: 'frieza', txt: T('Deixá-lo com a raiz.', 'Leave him to his root.'),
            resposta: [T('Ele nem levantou os olhos. Entre os Grakh, uma conversa termina quando alguém para de estar nela.', 'He did not look up. Among the Grakh, a conversation is over when someone stops being in it.')] },
        ] },
      ] },
      depois: [T('Eu tinha ouvido a frase do dia comido umas cem vezes em trinta anos, sempre da boca dos velhos, sempre com aquele riso nos ombros. Entre os Grakh, profecia é como o tempo entre outros povos: assunto para reclamar, sem pressa nenhuma.', 'I had heard the line about the day being eaten perhaps a hundred times in thirty years, always from the old, always with that laugh in the shoulders. Among the Grakh, prophecy is like weather among other peoples: something to complain about, in no particular hurry.')] },

    { id: 'a09', zona: 'acampamento', fundo: { img: IMG('hessa'), kb: 'in', dim: .4, foco: '20% 45%', lado: 'dir', clima: 'poeira' }, capitular: true, bebe: true,
      texto: [
        T('Hessa estivera olhando o tempo todo. Sempre olha, sempre da mesma distância, uma lança e um pouco mais, com uma das mãos pousada no cabo da maça às costas. O nome dela é o som que a água faz numa pedra quente. Combina com ela mais do que qualquer nome que já ouvi.', 'Hessa had been watching the whole time. She always does, from the same distance, a spear’s length and a little more, one hand resting on the haft of the mace across her back. Her name is the sound water makes on a hot stone. It suits her better than any name I have ever heard.'),
        T('Mandou Tukk embora com duas palavras, do jeito Grakh, sem dobra nenhuma nos verbos. Então se virou para mim e mudou.', 'She sent Tukk off with two words, in the Grakh way, with no bend in the verbs at all. Then she turned to me, and changed.'),
        T('Comigo Hessa fala a língua dos homens, inteira, cada verbo no lugar, com as vogais compridas e abertas dos Queimados. No ombro esquerdo ela tem uma velha marca ritual deles, das que eles queimam nos cativos, e por cima dela alguém depois cortou três linhas a faca, fundas e deliberadas, como quem risca uma palavra. Nunca perguntei. Ela nunca contou. É a conversa mais longa que já tivemos.', 'With me Hessa speaks the language of men, all of it, every verb in its place, with the long open vowels of the Burned. On her left shoulder there is an old ritual brand of theirs, the kind they burn into captives, and across it someone later cut three lines with a knife, deep and deliberate, as if crossing out a word. I have never asked. She has never told me. It is the longest conversation we have had.'),
        se(temAgua, T('Estendi o odre de água. Ela pegou, arrancou a tampa com os dentes e despejou na areia entre nós, devagar, até o fim, olhando para mim o tempo todo.', 'I held out the water skin. She took it, pulled the stopper with her teeth, and poured it out on the sand between us, slowly, all of it, looking at me the whole time.')),
        se((st) => !temAgua(st), T('Estendi o odre de vinho. Ela pegou, arrancou a tampa com os dentes, cheirou e despejou um gole comprido na areia entre nós, devagar, olhando para mim o tempo todo. Depois me devolveu o odre.', 'I held out the skin of wine. She took it, pulled the stopper with her teeth, smelled it, and poured a long swallow of it out on the sand between us, slowly, looking at me the whole time. Then she handed the skin back.')),
      ],
      aoEntrar: (st) => { if (!temAgua(st)) st.cantil = Math.max(0, st.cantil - 1); },
      dialogo: { interlocutor: 'Hessa', rodadas: [
        { id: 'hessa1', antes: [T('— Você fica porque os potes mantêm o meu povo de pé. Homens que deviam cair não caem. É o único motivo de você ainda estar naquela pedra. Não confunda com outro.', '— You stay because the pots keep my people standing. Men who should fall, don’t. That is the only reason you are still on that stone. Do not mistake it for another.')],
          pergunta: T('Responder a Hessa:', 'Answer Hessa:'), opcoes: [
            { id: 'uteis', tom: 'ironia', txt: T('“Então somos úteis um ao outro.”', '“Then we are useful to each other.”'),
              resposta: [T('— Útil é palavra de ferramenta.', '— Useful is a word for tools.')] },
            { id: 'ervas', tom: 'frieza', hessa: -1, aviso: T('Hessa vai lembrar disso.', 'Hessa will remember that.'), flag: 'mentiuErvas', txt: T('“São só ervas.”', '“It is only herbs.”'),
              resposta: [T('— Os Queimados também diziam que era só sangue.', '— The Burned also said it was only blood.')] },
            { id: 'sinal', se: (st) => (c1(st).aug || 0) >= 1, tom: 'curiosidade', hessa: 1, aviso: T('Hessa vai lembrar disso.', 'Hessa will remember that.'), txt: T('Fazer o sinal de troca que os Grakh do gelo me ensinaram.', 'Make the sign of exchange the Grakh of the ice taught me.'),
              resposta: [T('Os olhos dela foram para a minha mão e ficaram ali um instante a mais do que precisavam. A mão na maça desceu para junto do corpo.', 'Her eyes went to my hand and stayed there a moment longer than they needed to. The hand on the mace came down to her side.')] },
            { id: 'baixar', tom: 'frieza', hessa: 1, txt: T('Baixar os olhos e ir embora.', 'Lower my eyes and go.'),
              resposta: [T('Ela me deixou ir. Vindo de Hessa, é uma cortesia.', 'She let me go. From Hessa, that is a courtesy.')] },
          ] },
        { id: 'hessa2', se: (st) => st.escolhas.hessa1 !== 'baixar', antes: [T('— O Tinido está a dois dias dos poços. Talvez um. Esteja longe.', '— The Tinn is two days from the wells. Maybe one. Be far away.')],
          pergunta: T('Hessa:', 'Hessa:'), opcoes: [
            { id: 'agua', txt: T('“Preciso de água. A água está nos poços.”', '“I need water. The water is at the wells.”'),
              resposta: [T('— Então beba depressa.', '— Then drink fast.')] },
            { id: 'longe', tom: 'ironia', txt: T('“Estou sempre longe. Mesmo parado aqui.”', '“I am always far away. Even standing here.”'),
              resposta: [T('Alguma coisa se mexeu no canto da boca dela e foi guardada no mesmo instante.', 'Something moved at the corner of her mouth and was put away at once.')] },
            { id: 'cala', silencio: true, tom: 'frieza',
              resposta: [T('Ela me deu as costas. Hessa não dá as costas a homens armados. Nunca soube ao certo sobre qual de nós dois isso diz mais.', 'She turned her back on me. Hessa does not turn her back on armed men. I have never been sure which of us that says more about.')] },
          ] },
      ] } },

    { id: 'a10', zona: 'noite', fundo: { clip: CLIP('fogueiras'), img: IMG('laje-noite'), dim: .35, foco: '45% 60%', clima: 'estrelas' }, capitular: true, bebe: true,
      texto: [
        T('Naquela noite sentei na beira da Laje com o odre de vinho de cacto e fiquei olhando as hordas chegarem. As fogueiras foram acendendo uma a uma pelo escuro, até a planície lá embaixo parecer um céu que tinha caído e era teimoso demais para apagar.', 'That night I sat at the edge of the slab with the skin of cactus wine and watched the hordes come in. Their fires went on one by one across the dark, until the plain below looked like a sky that had fallen and was too stubborn to go out.'),
        T('Sem lua. Na noite anterior também não houvera. O meu povo costumava esperar por noites assim, por motivos que eu tinha bebido para fora da cabeça havia muito tempo.', 'No moon. There had been none the night before, either. My people used to watch for nights like these, for reasons I had drunk out of my head a long time ago.'),
        (st) => ((st.turvo || 0) <= 1
          ? [T('Por baixo dos tambores, através da pedra e para dentro da sola dos meus pés, veio outra coisa: muitos pés, longe, a leste, batendo no chão ao mesmo tempo. Os Grakh não marcham em passo. Nada vivo marcha em passo a não ser que alguém esteja gritando com ele.', 'Under the drums, through the rock and into the soles of my feet, came something else: many feet, far to the east, striking the ground at the same time. The Grakh do not walk in step. Nothing alive walks in step unless someone is shouting at it.'),
            c1(st).leu_tacets ? T('Contei, por hábito, esperando o três. Não era três. Eram mil homens fingindo ser um.', 'I counted, out of habit, waiting for the three. It was not three. It was a thousand men pretending to be one.') : null]
          : [T('O chão talvez estivesse tentando me dizer alguma coisa. Àquela hora eu não estava recebendo recados.', 'The ground may have been trying to tell me something. At that hour I was not taking messages.')]),
      ],
      aoEntrar: (st) => { st.f.sentiuMarcha = (st.turvo || 0) <= 1; },
      fimDeParte: true },

    // ===================================================== II · AS GOELAS
    { id: 'parte-II', parte: 'II', zona: 'goelas', fundo: { img: IMG('goelas'), kb: 'in', dim: .62, clima: 'poeira' },
      cartao: { num: 'II', nome: T('As Goelas', 'The Gullets'), epigrafe: T('A Pira não tem lugar. Tem fogo.', 'The Pyre has no place. It has a fire.'), fonte: T('dito Grakh', 'Grakh saying') },
      // a noite cura um pouco: a manhã devolve parte da cabeça
      aoEntrar: (st) => { st.turvo = Math.max(0, (st.turvo || 0) - 3); } },

    { id: 'b01', zona: 'goelas', fundo: { img: IMG('goelas'), kb: 'in', dim: .42, foco: '55% 55%', clima: 'poeira' }, capitular: true, bebe: true,
      narracao: 'assets/audio/voz/b01-goelas.mp3', narracaoLang: 'en',
      texto: [
        T('Eu nunca tinha visto tantos deles num lugar só, e já vi exércitos. Estavam em volta das Goelas em anéis, do jeito que bichos ficam em volta de um fogo, cem de fundura, os velhos mais perto da água e as crianças mais perto de coisa nenhuma. Naquele dia, a Pira Errante era ali. Toda horda que ainda tinha pernas viera beber.', 'I had never seen so many of them in one place, and I have seen armies. They stood around the Gullets in rings, the way animals stand around a fire, a hundred deep, the old ones nearest the water and the children nearest nothing at all. That day the Wandering Pyre was there. Every horde that still had legs had come to drink.'),
        T('As Goelas são três gargantas na rocha que descem mais fundo do que uma corda consegue acompanhar. No fim da estação seca a água fica tão baixa que os Grakh descem meninos amarrados em cordas para encher os odres e os puxam de volta, pingando e orgulhosos.', 'The Gullets are three throats in the rock that go down farther than a rope can follow. At the end of the dry season the water sits so low that the Grakh lower boys on ropes to fill the skins, and haul them up again, dripping and proud.'),
        se((st) => st.shaa >= 1, T('Shaa me viu do outro lado do poço mais próximo e acenou com o braço inteiro, como se de outro jeito eu pudesse não vê-la. Não era possível não vê-la.', 'Shaa saw me from across the nearest well and waved with her whole arm, as if I might otherwise miss her. It was not possible to miss her.')),
        se((st) => st.shaa < 1, T('Shaa estava junto do poço mais próximo, bebendo nas mãos. Não levantou os olhos.', 'Shaa was by the nearest well, drinking from her hands. She did not look up.')),
      ] },

    { id: 'b02', zona: 'goelas', fundo: { video: VID('coluna'), img: IMG('coluna-redom'), dim: .38, foco: '40% 50%', lado: 'dir', clima: 'poeira' }, capitular: true, bebe: true,
      sons: [{ sfx: 'corneta-redom', p: 0, v: .6 }, { sfx: 'armadura-tinido', p: 1, v: .5 }],
      texto: [
        T('Vieram do leste na hora em que as sombras são mais curtas, numa coluna tão reta que parecia riscada a régua na areia. Escudos, lanças, pano vermelho. Atrás deles, as armações de madeira das máquinas de cerco, puxadas por bois, balançando como pássaros lentos.', 'They came out of the east at the hour when shadows are shortest, in a column so straight it looked ruled onto the sand. Shields, spears, red cloth. Behind them the timber frames of siege engines, dragged by oxen, nodding like slow birds.'),
        T('Na frente, debaixo de uma bandeira vermelha, vinha o Tinido.', 'At the front, under a red banner, rode the Tinn.'),
        T('Dois Grakh, feridos em alguma escaramuça anterior, estavam caídos no descampado entre as linhas. O Tinido levantou a mão, e a coluna inteira parou e esperou, em pleno sol, enquanto outros Grakh corriam e arrastavam os dois para longe. Depois ele baixou a mão.', 'Two Grakh, wounded in some earlier skirmish, lay in the open between the lines. The Tinn raised his hand, and the whole column stopped and waited, in the full sun, while other Grakh ran out and dragged the two of them away. Then he lowered his hand.'),
      ],
      escolha: { id: 'olhar', pergunta: T('Aheryn olha para:', 'Aheryn looks at:'), opcoes: [
        { id: 'bandeira', tom: 'ironia', txt: T('A bandeira.', 'The banner.'),
          resultado: [T('Uma espada branca sobre vermelho e, como guarda, uma balança. Conheci homens capazes de falar uma hora sobre o que aquilo significa. Conheci uns poucos que viviam aquilo. Esses nunca explicavam nada.', 'A white sword on red, and for a guard, a pair of scales. I have known men who could talk for an hour about what that means. I have known a few who lived it. Those never explained anything.')] },
        { id: 'homem', tom: 'curiosidade', txt: T('O homem da frente.', 'The man in front.'), fundo: { img: IMG('tinido'), kb: 'in', dim: .38, foco: '70% 35%', lado: 'dir' },
          resultado: [T('Nem moço, nem velho. Sem elmo; levava-o debaixo do braço, e os homens dele podiam ver o seu rosto de qualquer ponto da coluna. Montava como quem nunca precisou olhar para baixo para saber onde estão os pés.', 'Not young, not old. No helmet; he carried it under his arm, and his men could see his face from anywhere in the column. He sat the horse like a man who has never once had to look down to know where his feet are.')] },
        { id: 'contar', tom: 'ironia', txt: T('Contá-los.', 'Count them.'),
          resultado: [T('Contei os estandartes e multipliquei pelo que costuma ficar debaixo de um estandarte. Mais homens do que Ghru tinha dito. Ghru tinha dito mais homens que areia.', 'I counted the standards and multiplied by what usually stands under a standard. More men than Ghru had said. Ghru had said more men than sand.')] },
      ] } },

    { id: 'b03', zona: 'batalha', fundo: { img: IMG('choque'), kb: 'in', dim: .42, foco: '55% 50%', lado: 'dir', clima: 'poeira' }, bebe: true,
      texto: [
        T('Então as linhas se encontraram, e por um tempo não houve nada para ver além do que sempre há: homens e Grakh tentando ocupar o mesmo pedaço de chão, e o chão se recusando a tomar partido.', 'Then the lines met, and for a while there was nothing to see but what there always is: men and Grakh trying to occupy the same piece of ground, and the ground refusing to take sides.'),
        T('Tukk estava na frente. Uma semana antes, não conseguia ficar de pé. Agora levava uma lança no ombro, quebrava a haste e seguia.', 'Tukk was at the front. A week before, he could not stand. Now he was taking a spear in the shoulder, snapping off the shaft, and going on.'),
        se(sobrio, T('O vento mudou e me trouxe, através da poeira, do sangue e do suor de mil corpos, um cheiro que eu conhecia melhor que qualquer um deles: resina, raiz amarga, a argila cinza em que eu moo as duas. O meu unguento. Estava em metade dos Grakh daquela linha.', 'The wind changed, and brought me, through dust and blood and the sweat of a thousand bodies, a smell I knew better than any of them: resin, bitter root, the grey clay I grind them in. My ointment. It was on half the Grakh in that line.')),
        se((st) => !sobrio(st), T('O vento trouxe alguma coisa. Poeira, sangue. Eu não estava em condições de ser exigente.', 'The wind brought something. Dust, blood. I was in no state to be particular.')),
      ],
      aoSair: (st) => { if (sobrio(st)) st.f.sentiu_unguento = true; } },

    { id: 'b04', zona: 'eclipse', fundo: { video: VID('eclipse'), img: IMG('eclipse-comeca'), dim: .3, foco: '60% 30%', clima: 'cinza', umaVez: true },
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
        T('O Tinido. Não olhou para cima nem uma vez. A essa altura eu também tinha parado de olhar, e acho que éramos os dois únicos naquele campo: o que entendia o céu e o que ia morrer debaixo dele. Só um de nós estava a descoberto.', 'The Tinn. He never once looked up. By then I had stopped looking too, and I think we were the only two on that field who had: the one who understood the sky, and the one who would die under it. Only one of us was standing in the open.'),
        se(temPedra, T('No bolso, a pedra tinha ficado violeta, a cor que ela não tem em nenhuma outra luz, e fechei a mão em volta dela como se ela pudesse me denunciar.', 'In my pocket the stone had gone violet, a colour it has in no other light, and I closed my hand over it as if it might give me away.')),
      ],
      fimDeParte: true },

    // ===================================================== III · O DIA COMIDO
    { id: 'parte-III', parte: 'III', zona: 'eclipse', fundo: { img: IMG('codex-eclipse'), kb: 'in', dim: .55, clima: 'cinza' },
      cartao: { num: 'III', nome: T('O Dia Comido', 'The Eaten Day'), epigrafe: T('O que se apaga no céu se apaga nos homens.', 'What goes out in the sky goes out in men.'), fonte: T('nota Lúmae à margem, sem assinatura', 'Lúmae note in a margin, unsigned') } },

    { id: 'c01', zona: 'eclipse', fundo: { img: IMG('goelas-escuro'), kb: 'in', dim: .4, foco: '50% 50%', clima: 'cinza' }, bebe: true,
      texto: [
        T('Eu tinha, pela aritmética mais velha que conheço, cinco minutos. Talvez seis. Todos os outros naquele campo tinham a eternidade, e estavam se comportando de acordo.', 'I had, by the oldest arithmetic I know, five minutes. Perhaps six. Everyone else on that field had forever, and was behaving accordingly.'),
      ],
      minijogo: 'minutos',
      aoTerminar: (st, r, k) => {
        const f = (r && r.feitas) || [];
        if (f.includes('ouvir')) st.f.ouviu_oficial = true;
        if (f.includes('po')) { st.f.abriu_guarda = true; st.hessa += 1; k.toast(T('Hessa vai lembrar disso.', 'Hessa will remember that.')); }
        if (f.includes('tukk')) { st.f.salvou_tukk = true; st.pira += 1; }
        if (f.includes('shaa')) { st.f.junto_shaa = true; st.shaa += 1; }
        if (f.includes('esconder')) st.f.escondeu = true;
        st.tom.ternura = (st.tom.ternura || 0) + (f.includes('shaa') ? 1 : 0) + (f.includes('tukk') ? 1 : 0);
        st.tom.curiosidade = (st.tom.curiosidade || 0) + (f.includes('ouvir') ? 1 : 0);
        st.tom.frieza = (st.tom.frieza || 0) + (f.includes('esconder') ? 1 : 0);
      },
      depois: [T('Eu tinha gastado os meus minutos. O escuro tinha talvez mais um.', 'I had spent my minutes. The dark had perhaps one left.')] },

    { id: 'c02', zona: 'eclipse', fundo: { video: VID('tinido-cai'), img: IMG('hessa-tinido'), dim: .3, foco: '70% 40%', clima: 'cinza', umaVez: true },
      sons: [{ p: 4, fn: (A) => A.sfx('golpe', .7, () => { A.hiss(.2, 900, 1, .3); A.tone(80, .4, 'sine', .3, .05, .5); }) }],
      texto: [
        se((st) => !!st.f.abriu_guarda, T('Sem os cavalos, o Tinido foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro pelo vão que os cavalos tinham deixado, direto para ele, e nada se pôs no caminho dela, porque eu tinha cuidado disso.', 'With his horses gone, the Tinn went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark through the gap the horses had left, straight at him, and nothing stood in her way, because I had seen to that.')),
        se((st) => !st.f.abriu_guarda, T('O Tinido desceu do cavalo e foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro direto para ele, atravessando três homens que estavam no caminho, e chegou ao outro lado deles sangrando no braço e sem diminuir o passo.', 'The Tinn got down from his horse and went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark straight at him, through three men who were in her way, and came out the other side of them bleeding from the arm and no slower.')),
        T('Ele a viu chegando. Firmou os pés.', 'He saw her coming. He set his feet.'),
        T('Um besteiro atrás dele ergueu a arma na direção dela. Sem virar a cabeça, o Tinido estendeu a mão esquerda e empurrou a besta para baixo.', 'A crossbowman behind him raised his weapon toward her. Without turning his head, the Tinn put out his left hand and pushed the bow down.'),
        T('Então ela chegou.', 'Then she was on him.'),
        T('Três golpes. Ele desviou o primeiro. Desviou o segundo, e isso lhe custou a espada. O terceiro desceu onde o pescoço encontra o ombro, e ele caiu de joelhos, e depois de frente na areia, e o caminho inteiro até o chão não tirou os olhos dela.', 'Three blows. He turned the first. He turned the second, and it cost him the sword. The third came down where the neck meets the shoulder, and he went to his knees, and then forward onto the sand, and the whole way down he did not take his eyes off her.'),
        T('Hessa ficou de pé sobre ele no escuro. Não ergueu a maça de novo.', 'Hessa stood over him in the dark. She did not raise the mace again.'),
        se((st) => !!st.f.ouviu_oficial, T('Agora eu sabia por que ele tinha vindo de tão longe, em pessoa. Isso não tornou mais fácil assistir. Saber as coisas raramente torna; eu teria gostado de ouvir o contrário, só uma vez.', 'I knew now why he had come all this way himself. It did not make watching easier. Knowing things rarely does; I would have liked, just once, to be told otherwise.')),
        se((st) => !!st.f.escondeu, T('Assisti a tudo das pedras, o que quer dizer que assisti do jeito que assisti à maior parte das coisas na vida: de onde elas não me alcançavam.', 'I watched it all from the rocks, which is to say I watched it the way I have watched most things in my life: from where they could not reach me.')),
      ] },

    { id: 'c03', zona: 'batalha', fundo: { clip: CLIP('luz-volta'), img: IMG('luz-volta'), dim: .35, foco: '70% 40%', clima: 'poeira' },
      sons: [{ sfx: 'virotes', p: 1, v: .75, fim: true }, { sfx: 'virote-impacto', p: 3, v: .6 }],
      texto: [
        T('Então o sol voltou. Primeiro uma única conta branca na beira do escuro, depois uma lâmina, e todas as sombras do campo giraram de uma vez, e homens que gritavam um instante antes ficaram piscando uns para os outros como estranhos acordando na mesma cama.', 'Then the sun came back. First a single white bead on the rim of the dark, then a blade of it, and every shadow on the field swung around at once, and men who had been shouting a moment before stood blinking at each other like strangers waking in the same bed.'),
        T('Redom recuou. E recuou bem, isso eu admito: em ordem, os escudos travados, levando o Tinido entre quatro homens, em cima da própria capa. Os besteiros vinham de costas na retaguarda, como são treinados a fazer, e na última elevação se viraram e soltaram uma salva contra a multidão nos poços, como também são treinados a fazer.', 'Redom pulled back. It did it well, I will grant them that: in order, shields locked, carrying the Tinn between four men on his own cloak. The crossbowmen walked backward at the rear, as they are trained to, and at the last rise they turned and loosed one volley into the crowd at the wells, as they are also trained to.'),
        T('Não havia mais mão nenhuma para empurrar as bestas para baixo.', 'There was no hand left to push the bows down.'),
        se((st) => !!st.f.junto_shaa, T('Eu segurava o braço de Shaa quando a acertaram. Senti cada um chegar, pelo corpo dela, até a minha mão. Cinco. Contei do jeito que conto tudo, e depois continuei contando, porque a cria debaixo da minha outra mão ainda se mexia, e eu não queria parar de saber disso.', 'I was holding Shaa’s arm when they hit her. I felt each one arrive through her body into my hand. Five. I counted them the way I count everything, and then I went on counting, because the child under my other hand was still moving, and I did not want to stop knowing that.')),
        se((st) => !st.f.junto_shaa, T('Quando cheguei ao poço, Shaa estava caída de lado na borda. Cinco virotes. Contei do jeito que conto tudo. Depois pus a mão na barriga dela, porque precisava saber, e a cria chutou.', 'When I reached the well, Shaa was lying on her side on the rim. Five bolts. I counted them the way I count everything. Then I put my hand on her belly, because I had to know, and the child kicked it.')),
      ],
      fimDeParte: true },

    // ===================================================== IV · O NOME
    { id: 'parte-IV', parte: 'IV', zona: 'roda', fundo: { img: IMG('roda'), kb: 'in', dim: .6, clima: 'poeira' },
      cartao: { num: 'IV', nome: T('O Nome', 'The Name'), epigrafe: T('O primeiro som é o primeiro nome.', 'The first sound is the first name.'), fonte: T('costume Grakh', 'Grakh custom') } },

    { id: 'd01', zona: 'roda', fundo: { clip: CLIP('roda'), img: IMG('roda'), dim: .35, foco: '40% 55%', lado: 'dir', clima: 'poeira' }, capitular: true,
      narracao: 'assets/audio/voz/d01-roda.mp3', narracaoLang: 'en',
      texto: [
        T('Vieram sem que ninguém chamasse. Os sobreviventes dos poços, os feridos e os inteiros, atravessaram a areia de um em um, de dois em dois, e ficaram em volta de nós, de Shaa e de mim, até virarem uma parede, cem de fundura, e nenhuma luz passava por ela além da que vinha de cima.', 'They came without being called. The survivors of the wells, the wounded and the whole, came across the sand in ones and twos and stood around us, around Shaa and me, until there was a wall of them, a hundred deep, and no light came through it but what came from above.'),
        T('Ninguém falou. Os Grakh não são um povo quieto, e eu nunca tinha ouvido cem deles sem fazer som nenhum. Era o tipo de silêncio que está esperando alguma coisa.', 'Nobody spoke. The Grakh are not a quiet people, and I had never heard a hundred of them make no sound at all. It was the kind of silence that is waiting for something.'),
        T('O dia tinha sido comido. Todos tinham ouvido isso cem vezes, da boca dos velhos, com uma risada. Agora estavam em roda em volta de uma mulher morrendo cuja barriga ainda se mexia, e ninguém ria.', 'The day had been eaten. They had all heard it said a hundred times, by the old, with a laugh. Now they stood in a ring around a dying woman whose belly was still moving, and nobody was laughing.'),
        se((st) => !!st.f.mostrou_luz, T('Shaa achou o meu pulso na areia e o puxou, fraca, para o mesmo lugar onde o tinha puxado na véspera.', 'Shaa found my wrist on the sand and pulled it, weakly, to the same place she had pulled it the day before.')),
      ] },

    { id: 'd02', zona: 'roda', fundo: { img: IMG('arma-no-chao'), kb: 'in', dim: .42, foco: '70% 50%', lado: 'dir', clima: 'poeira' },
      sons: [{ sfx: 'marreta-chao', p: 1, v: .7 }],
      texto: [
        T('A parede se abriu, e Hessa passou por ela.', 'The wall opened, and Hessa came through it.'),
        T('Ela parou a uma lança de distância de mim, a distância de sempre. Então deu o último passo, o que nunca tinha dado, e deixou a maça escorregar das costas para a areia, aos meus pés.', 'She stopped a spear’s length from me, the old distance. Then she took the last step, the one she had never taken, and let the mace slide off her back onto the sand at my feet.'),
        se((st) => !st.f.abriu_guarda, T('O braço ainda sangrava onde os três homens o tinham achado. Ela não tinha amarrado.', 'Her arm was still bleeding where the three men had found it. She had not tied it.')),
        T('Era a mão que sempre estivera pousada naquele cabo. Agora, vazia, não sabia o que fazer. Fechou, e abriu.', 'It was the hand that had always rested on that haft. Now, empty, it did not know what to do. It closed, and opened.'),
        (st) => (st.hessa >= 1 ? T('— O que você guarda debaixo do pano. Use. Estou pedindo.', '— What you keep under the cloth. Use it. I am asking.')
          : st.hessa <= -1 ? T('— Eu sei o que você é. Não me importa. Salve a cria.', '— I know what you are. I do not care. Save the child.')
            : T('— Seja lá o que você for. Seja. Agora.', '— Whatever it is you are. Be it. Now.')),
        T('Ela não terminou o que vinha depois disso. A boca ficou aberta em volta das palavras por um instante, e fechou.', 'She did not finish whatever came after that. Her mouth stayed open around the words for a moment, and closed.'),
        T('Entre os Grakh, o que ela tinha acabado de fazer não tem palavra. Pedir é dívida, e dívida é uma coisa que os Grakh preferem morrer a carregar. Já os vi fazer isso.', 'Among the Grakh, what she had just done has no word. Asking is a debt, and a debt is a thing the Grakh would rather die than carry. I have seen them do it.'),
      ] },

    { id: 'd03', zona: 'roda', fundo: { img: IMG('cantil-areia'), kb: 'in', dim: .45, foco: '75% 50%', lado: 'dir', clima: 'poeira' },
      texto: [
        T('Para fazer o que ela pedia eu teria de pensar. Não os pensamentos pequenos que deixo passar em dia de chuva, mas tudo, de uma vez, do jeito que eu pensava antes, do jeito que fez o meu povo ser visto. E para pensar eu teria de parar de beber.', 'To do what she was asking I would have to think. Not the small thoughts I let through on rainy days, but all of it, all at once, the way I used to think, the way that got my people seen. And to think, I would have to stop drinking.'),
        (st) => (st.cantil > 0 ? T('O odre de vinho de cacto pendia do meu quadril, onde pende há trinta anos. Ainda havia um pouco. Sempre há um pouco.', 'The skin of cactus wine hung at my hip, where it has hung for thirty years. There was some left. There is always some left.')
          : T('O odre de vinho de cacto pendia do meu quadril, onde pende há trinta anos, vazio. Eu tinha cuidado disso mais cedo, um gole de cada vez.', 'The skin of cactus wine hung at my hip, where it has hung for thirty years, empty. I had seen to that earlier, one swallow at a time.')),
      ],
      escolha: { id: 'odre', pergunta: T('O odre:', 'The skin:'), opcoes: [
        { id: 'derramar', tom: 'ternura', flag: 'derramou', som: 'agua-areia', txt: T('Derramar na areia.', 'Pour it out on the sand.'),
          resultado: (st) => [st.cantil > 0 ? T('Tirei a tampa, virei o odre e deixei escorrer na areia, como Hessa tinha feito com o que eu lhe oferecera. A areia bebeu mais depressa do que eu jamais bebi.', 'I pulled the stopper, turned the skin over and let it run out onto the sand, as Hessa had done with what I offered her. The sand drank it faster than I ever have.')
            : T('Não havia nada para derramar. Virei o odre assim mesmo e sacudi, e caíram umas gotas. Pareceu necessário.', 'There was nothing to pour. I turned the skin over anyway and shook it, and a few drops fell. It seemed necessary.')] },
        { id: 'entregar', tom: 'ironia', flag: 'deuOdre', txt: T('Entregar a Hessa.', 'Give it to Hessa.'),
          resultado: [T('Estendi para ela. Ela pegou sem olhar e ficou segurando, do jeito que se segura uma coisa que alguém nos entrega num enterro.', 'I held it out to her. She took it without looking at it and stood holding it, the way you hold a thing someone has handed you at a funeral.')] },
        { id: 'gole', tom: 'frieza', gole: true, riscavel: true, se: (st) => st.cantil > 0, motivo: T('o odre está vazio', 'the skin is empty'), txt: T('Um último gole.', 'One last swallow.'),
          resultado: [T('Mais um. Pela firmeza da mão, disse a mim mesmo, e a minha mão, que me conhece há muito tempo, também não acreditou.', 'One more. For the steadiness of the hand, I told myself, and my hand, which has known me a long time, did not believe it either.')] },
      ] },
      aoSair: (st) => { if (st.escolhas.odre !== 'gole') st.cantil = 0; } },

    { id: 'd04', zona: 'roda', fundo: { img: IMG('shaa-luz'), kb: 'in', dim: .4, foco: '50% 45%', clima: 'poeira' }, capitular: true,
      sons: [{ voz: 'd04-mao', p: -1, se: tocouProibido }],
      texto: [
        T('Conheço dois tipos de magia. Um é uma cortesia que se pede ao mundo, como pedir ao vizinho que tire a carroça do caminho; o gelo me fez esse favor por cinquenta anos. O outro não pede. É enfiar a mão no pano de que o mundo é tecido e puxar um fio, e cada fio puxado acende você como uma lamparina numa janela, para qualquer coisa que saiba olhar.', 'I know two kinds of magic. One is a courtesy you ask of the world, like asking a neighbour to move his cart; the ice did me that favour for fifty years. The other does not ask. It is reaching into the cloth the world is woven from and pulling a thread, and every thread you pull lights you up like a lamp in a window, for anything that knows how to look.'),
        se((st) => (c1(st).gelunah || 0) >= 1, T('Pedi ao frio primeiro. Por hábito, por afeto, não sei. Não havia frio a quem pedir. Havia areia por cem léguas em todas as direções, e a areia nunca me fez cortesia nenhuma.', 'I asked the cold first. From habit, from affection, I do not know. There was no cold to ask. There was sand for a hundred leagues in every direction, and the sand has never once done me a courtesy.')),
        se((st) => ((st.jogos.ressaca && st.jogos.ressaca.subiram) || []).includes('menina'), T('Pensei na menina da febre, e na cura dobrada bem pequena na minha cabeça, onde guardo tudo o que não me é permitido usar.', 'I thought of the girl with the fever, and of the cure folded small in my head, where I keep everything I am not allowed to use.')),
        se(tocouProibido, T('A mão subiu, a mesma mão, à mesma altura. Desta vez seguiu.', 'The hand rose, the same hand, to the same height. This time it kept going.')),
      ],
      escolha: { id: 'proibido5', pergunta: T('O que Aheryn vai buscar?', 'What does Aheryn reach for?'), opcoes: [
        { id: 'dois', tom: 'ternura', luz: 8, txt: T('Os dois: a mãe e a cria.', 'Both of them: the mother and the child.'),
          resultado: [T('Dois corações. Um lento e falhando, um rápido e furioso. Eu ia segurar os dois, ou tentar. Fui o melhor do meu povo exatamente nesse tipo de arrogância.', 'Two hearts. One slow and failing, one fast and furious. I would hold both, or try. I was the best of my people at exactly this kind of arrogance.')] },
        { id: 'crianca', tom: 'frieza', txt: T('Só a cria.', 'Only the child.'),
          resultado: [T('Um coração. O pequeno, o rápido. O de Shaa deixei onde estava, aquietando sozinho, e espero nunca me perguntarem se aquilo foi sabedoria ou aritmética.', 'One heart. The small, fast one. Shaa’s I left where it was, going quiet on its own, and I hope never to be asked whether that was wisdom or arithmetic.')] },
      ] } },

    { id: 'd05', zona: 'roda', fundo: { clip: CLIP('veias'), img: IMG('aheryn-acende'), dim: .32, foco: '60% 35%', lado: 'dir', clima: 'brasas' },
      texto: [
        T('Ajoelhei na areia com as mãos sobre ela e parei de segurar os pensamentos para baixo.', 'I knelt in the sand with my hands on her and stopped holding my thoughts down.'),
      ],
      minijogo: 'parto',
      aoTerminar: (st, r) => {
        const fl = (r && r.flares) || 0;
        st.tacetsCedo = (parto(st) === 'dois' ? 1 : 0) + (fl >= 3 ? 1 : 0);
      },
      depois: [
        T('A luz subiu por mim como água subindo num poço, toda ela, cada linha ao mesmo tempo, a testa, a garganta, o peito, os braços, até as caras da roda ficarem iluminadas de ouro por baixo e eu poder ver cada uma delas, e cada uma delas poder me ver.', 'The light came up through me like water up a well, all of it, every line at once, the forehead, the throat, the chest, the arms, until the faces in the ring were lit gold from below and I could see every one of them, and every one of them could see me.'),
        se(marcado, T('Pelo antebraço onde o bronze tinha fechado, nada passou. A luz deu a volta.', 'Through the forearm where the bronze had closed, nothing came. The light went around it.')),
        T('— Aqui. A lâmina, aqui. Não mais fundo que o seu polegar.', '— Here. The blade, here. No deeper than your thumb.'),
        T('Hessa ajoelhou do outro lado de Shaa com uma faca curta e curva e fez exatamente o que eu disse: a mulher que não bebia da minha mão, recebendo ordens da luz que vigiava havia quinze anos a uma lança de distância.', 'Hessa knelt on the other side of Shaa with a short curved knife and did exactly what I told her: the woman who would not drink from my hand, taking orders from the light she had watched for fifteen years from a spear’s length away.'),
      ] },

    { id: 'd06', zona: 'roda', fundo: { img: IMG('maos-hessa'), kb: 'in', dim: .38, foco: '55% 50%', lado: 'dir', clima: 'brasas' },
      narracao: 'assets/audio/voz/d06-som.mp3', narracaoLang: 'en',
      sons: [{ fn: (A) => A.kronk(), p: 1, fim: true }, { p: 4, fim: true, fn: (A) => A.sfx('choro-cria', .8, () => { A.tone(220, .9, 'sawtooth', .05, 0, .7); A.tone(180, 1.2, 'sawtooth', .04, .5, .6); }) }],
      texto: [
        T('Vou contar uma vez, do jeito que foi.', 'I will tell it once, as it was.'),
        T('Houve um som. Primeiro um estalo, seco e curto, como madeira verde, como cartilagem cedendo. Depois um baque, grave e molhado, de alguma coisa pesada se soltando para dentro de mãos que estavam prontas para ela.', 'There was a sound. First a crack, dry and short, like green wood, like cartilage giving way. Then a thud, low and wet, of something heavy coming free into hands that were ready for it.'),
        T('Depois, nada. A roda não respirou. A cria nas mãos de Hessa também não respirou, pelo tempo que um coração leva para decidir.', 'Then nothing. The ring did not breathe. The child in Hessa’s hands did not breathe either, for as long as it takes a heart to decide.'),
        T('Depois respirou.', 'Then it did.'),
        T('Chorou do jeito que os Grakh choram, ou seja, urrou, pequena e furiosa, para o céu, para o sol que tinha voltado, para todos nós.', 'It cried the way the Grakh cry, which is to say it roared, small and furious, at the sky, at the sun that had come back, at all of us.'),
        se((st) => armadilha(st) === 'salvar', T('Os olhos estavam abertos, virados para mim, do jeito que aquele da cova me olhou lá na Borda do Mundo. Parece que nunca consegui resistir a isso. É uma fraqueza que vou levar para o túmulo, o que quer dizer que não tão cedo.', 'Its eyes were open, and turned on me, the way the one in the pit had looked up at me at the Edge of the World. It seems I have never been able to resist that. It is a weakness I will take to my grave, which is to say nowhere soon.')),
      ] },

    { id: 'd07', zona: 'roda', fundo: { img: IMG('recem-nascido'), kb: 'out', dim: .4, foco: '60% 50%', lado: 'dir', clima: 'brasas' },
      sons: [{ p: 4, fim: true, fn: (A) => ['roda-nome1', 'roda-nome3', 'roda-nome2', 'roda-nome4'].forEach((n, i) => setTimeout(() => A.sfx(n, .6 - i * .06, () => { if (!i) { A.tone(98, 1.4, 'sawtooth', .03, 0, .9); A.hiss(1.2, 300, .6, .06, .1, 'lowpass'); } }), i * 1100)) }],
      texto: [
        (st) => (parto(st) === 'dois' ? T('Shaa ainda estava ali. Eu a tinha segurado até ali. Ela estendeu a mão, e Hessa deitou a cria na dobra do braço dela, e Shaa olhou para ela, para ela inteira, como quem conta.', 'Shaa was still there. I had held her that long. She put out a hand, and Hessa laid the child in the crook of her arm, and Shaa looked at it, at the whole of it, as if she were counting.')
          : T('Shaa quase não estava mais ali. Os olhos dela acharam o som antes de achar a cria.', 'Shaa was almost gone. Her eyes found the sound before they found the child.')),
        T('— Kronk…', '— Kronk…'),
        T('Era o som. Era o primeiro som, o que ele fez ao chegar ao mundo, e ela o tinha ouvido, e o devolvia a ele como nome, que é a lei mais antiga que os Grakh têm.', 'That was the sound. That was the first sound, the one he made coming into the world, and she had heard it, and she gave it back to him as a name, which is the oldest law the Grakh have.'),
        T('Então ela parou de respirar, quieta, sem alarde, do jeito que os Grakh fazem tudo o que não tem remédio.', 'Then she stopped breathing, quietly, without any fuss, the way the Grakh do everything that cannot be helped.'),
        se((st) => armadilha(st) === 'frio', T('Contei a respiração dela até não haver mais nenhuma, como uma vez contei na beira de uma cova na neve. É a única reza que sei.', 'I counted her breaths until there were none, as I once counted at the edge of a pit in the snow. It is the only prayer I know.')),
        T('A roda disse o nome. Um por um, baixo, de dentro para fora, do jeito que a água se espalha na areia. Kronk. Kronk. Kronk.', 'The ring said the name. One by one, low, from the inside out, the way water spreads in sand. Kronk. Kronk. Kronk.'),
        T('E Ghru, junto do meu ombro, sem riso nenhum:', 'And Ghru, at my shoulder, with no laugh anywhere in him:'),
        T('— Dia ser comido. Maior nascer.', '— Day be eaten. Greatest be born.'),
        T('Eu sabia o que tinha comido o dia. Uma pedra no céu passando na frente de um fogo no céu, como faz desde antes de existirem Grakh para dar nome a isso. Eu sabia tudo isso. O que eu não sabia era o que aquilo significava, e eu era o único naquela roda que achava que essas eram duas perguntas diferentes.', 'I knew what had eaten the day. A stone in the sky crossing in front of a fire in the sky, as it has done since before there were Grakh to name it. I knew all of that. What I did not know was what it meant, and I was the only one in that circle who thought those were two different questions.'),
      ] },

    { id: 'd08', zona: 'roda', fundo: { img: IMG('depois'), kb: 'in', dim: .4, foco: '60% 60%', lado: 'dir', clima: 'poeira' },
      sons: [{ s: 'assets/audio/tacet_passos.mp3', p: 2, v: .5, fim: true }],
      texto: [
        T('Depois a roda se desfez devagar, do jeito que uma multidão deixa um fogo de que não precisa mais. Voltaram para os seus mortos. Hessa foi com a cria.', 'Afterwards the ring came apart slowly, the way a crowd leaves a fire it no longer needs. They went back to their dead. Hessa went with the child.'),
        (st) => (parto(st) === 'dois'
          ? T('Sentei na areia e comecei a apagar a luz, uma linha de cada vez, como faço todo dia há oitenta anos. A testa apagou. A garganta apagou. O peito não quis, nem os braços. Eu tinha puxado dois fios, e o pano ainda tremia onde eu tinha mexido.', 'I sat in the sand and began to put the light out, one line at a time, as I have done every day for eighty years. The forehead went. The throat went. The chest would not, nor the arms. I had pulled two threads, and the cloth was still trembling where I had touched it.')
          : T('Sentei na areia e comecei a apagar a luz, uma linha de cada vez, como faço todo dia há oitenta anos. A testa apagou. A garganta apagou. O peito apagou, devagar. Os braços não quiseram.', 'I sat in the sand and began to put the light out, one line at a time, as I have done every day for eighty years. The forehead went. The throat went. The chest went, slowly. The arms would not.')),
        T('Então, através da areia e para dentro das minhas mãos, de muito longe, veio um ritmo que eu não sentia havia trinta anos. Metal e pedra em chão duro. Um, dois, três. Um, dois, três.', 'Then, through the sand and into my hands, from very far away, came a rhythm I had not felt in thirty years. Metal and stone on hard ground. One, two, three. One, two, three.'),
        T('Claro. Claro que estavam escutando, todo esse tempo, à espera exatamente disto.', 'Of course. Of course they had been listening, all this time, for exactly this.'),
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
        se((st) => (st.tacetsCedo || 0) >= 1, T('Com o tanto que eu tinha arrancado de mim por Shaa e pela cria, eles viriam depressa, e eu teria de levá-los longe.', 'With as much as I had pulled out of myself for Shaa and the child, they would be coming fast, and I would have to take them far.')),
      ] },

    { id: 'e02', zona: 'deserto', fundo: { img: IMG('recem-nascido'), kb: 'in', dim: .45, foco: '60% 50%', lado: 'dir', clima: 'estrelas' },
      texto: [
        T('Hessa me achou antes que eu terminasse de amarrar os panos. Trazia a cria no ombro, enrolada numa pele, e a mão livre já estava de volta no cabo da maça, onde sempre esteve.', 'Hessa found me before I had finished tying the wraps. She carried the child on her shoulder, wrapped in a hide, and her free hand was already back on the haft of the mace, where it has always been.'),
        T('— Você vai embora.', '— You are leaving.'),
        T('Não era pergunta.', 'It was not a question.'),
      ],
      dialogo: { interlocutor: 'Hessa', rodadas: [
        { id: 'adeus', pergunta: T('Dizer a Hessa:', 'Say to Hessa:'), opcoes: [
          { id: 'cuide', tom: 'ternura', txt: T('“Cuide dele.”', '“Look after him.”'),
            resposta: [T('Ela olhou para a cria, e para mim, e não disse nada, o que entre os Grakh é uma promessa, porque uma palavra poderia ser quebrada.', 'She looked at the child, and at me, and said nothing, which among the Grakh is a promise, because a word could be broken.')] },
          { id: 'nome', tom: ['ternura', 'curiosidade'], flag: 'disse_nome', txt: T('“Meu nome é Aheryn.”', '“My name is Aheryn.”'),
            resposta: [T('— Aheryn.', '— Aheryn.'), T('Ela disse com cuidado, do jeito que se testa uma tábua antes de pôr o peso nela. Foi a primeira vez em trinta anos que alguém disse esse nome em voz alta, contando comigo.', 'She said it carefully, the way you test a plank before you put your weight on it. It was the first time in thirty years anyone had said it aloud, myself included.')] },
          { id: 'lua', tom: ['ironia', 'curiosidade'], txt: T('“O que comeu o dia foi a lua. O sol sempre volta.”', '“What ate the day was the moon. The sun always comes back.”'),
            resposta: [T('— Então os velhos acertaram e erraram.', '— Then the old ones were right, and wrong.'), T('Ela pesou aquilo e guardou em algum lugar, e eu nunca vou saber onde.', 'She weighed it and put it away somewhere, and I will never know where.')] },
          { id: 'cala', silencio: true, tom: 'frieza',
            resposta: [T('Ela esperou o tempo de um fôlego. Depois virou e voltou para o acampamento, sem olhar para trás, e isso também estava certo.', 'She waited the length of a breath. Then she turned and went back toward the camp, without looking back, and that was right too.')] },
        ] },
        { id: 'tinido', se: (st) => st.escolhas.adeus !== 'cala',
          antes: (st) => (st.f.abriu_guarda ? [T('— Os cavalos foram você.', '— The horses were you.'), T('Também não era pergunta, então não respondi.', 'That was not a question either, so I did not answer it.')] : [T('— O Tinido. Você viu.', '— The Tinn. You saw.')]),
          pergunta: T('Sobre o Tinido:', 'About the Tinn:'), opcoes: [
            { id: 'besta', tom: 'curiosidade', txt: T('“Ele empurrou para baixo a besta que mirava você.”', '“He pushed down the bow that was aimed at you.”'),
              resposta: [T('— Eu vi.', '— I saw.'), T('Ela olhou para o leste, para onde o tinham levado, e por um bom tempo não olhou para mais nada.', 'She looked east, where they had carried him, and for a long while she did not look at anything else.')] },
            { id: 'boa', tom: 'ironia', txt: T('“Foi uma boa morte.”', '“It was a good death.”'),
              resposta: [T('— Não existe morte boa. Existe morte terminada.', '— There are no good deaths. There are deaths that are finished.')] },
            { id: 'nada', silencio: true, tom: 'frieza',
              resposta: [T('Ela assentiu uma vez, para ninguém.', 'She nodded once, to no one.')] },
          ] },
      ] } },

    { id: 'e03', zona: 'deserto', fundo: { img: IMG('recem-nascido'), kb: 'out', dim: .45, foco: '60% 50%', lado: 'dir', clima: 'estrelas' },
      se: (st) => st.escolhas.adeus !== 'cala',
      texto: [
        T('A cria dormia no ombro dela, se essa é a palavra para uma coisa tão furiosa em repouso. O punho estava fechado numa dobra da pele, muito apertado, como se alguém fosse tentar tirá-la dele.', 'The child was asleep on her shoulder, if that is the word for something that furious at rest. His fist was closed on a fold of the hide, very tight, as if somebody might try to take it from him.'),
      ],
      escolha: { id: 'cria', pergunta: T('Antes de partir:', 'Before leaving:'), opcoes: [
        { id: 'tocar', tom: 'ternura', txt: T('Tocar o punho dele.', 'Touch his fist.'),
          resultado: [T('Pus um dedo no punho. Ele abriu, fechou em volta do meu dedo e segurou com uma força que envergonharia um homem adulto de Redom. Tirei o dedo de volta. Deu algum trabalho.', 'I put one finger on the fist. It opened, closed around my finger, and held on with a strength that would have embarrassed a grown man of Redom. I took my finger back. It took some doing.')] },
        { id: 'naoTocar', tom: 'frieza', txt: T('Não tocar.', 'Do not touch him.'),
          resultado: [T('Não o toquei. As coisas que eu toco têm o costume de ser encontradas.', 'I did not touch him. Things I touch have a way of being found.')] },
        { id: 'pedra', se: temPedra, tom: 'ternura', flag: 'deixou_pedra', txt: T('Deixar a pedra na dobra da pele.', 'Leave the stone in the fold of the hide.'),
          resultado: [T('Tirei a pedra do bolso e a pus na dobra da pele, junto do punho fechado. Naquela luz ela estava cinza. Que seja o mistério de outra pessoa por um tempo.', 'I took the stone out of my pocket and put it into the fold of the hide, against the closed fist. In that light it was grey. Let it be someone else’s mystery for a while.')] },
      ] } },

    { id: 'e04', zona: 'deserto', se: temDiario, fundo: { img: IMG('diario-deserto'), kb: 'in', dim: .45, foco: '30% 50%', lado: 'dir', clima: 'estrelas' },
      texto: [
        T('O diário estava no fundo do embrulho, onde o tinha posto trinta anos antes, na Borda do Mundo. A décima segunda página estava em branco.', 'The diary was at the bottom of the bundle, where I had put it thirty years before, at the Edge of the World. The twelfth page was blank.'),
      ],
      escolha: { id: 'diario5', pergunta: T('O diário:', 'The diary:'), opcoes: [
        { id: 'escrever', tom: 'curiosidade', flag: 'escreveu', voz: 'e04-diario', vozAtraso: 1200, txt: T('Escrever o dia.', 'Write the day down.'),
          resultado: [
            T('Escrevi de pé, com a luz ainda nas mãos, o que fazia a tinta parecer ouro:', 'I wrote it standing up, with the light still in my hands, which made the ink look like gold:'),
            T('“Décima segunda página. O dia foi comido ao meio-dia e devolvido poucos minutos depois, como os dias costumam ser. Uma criança nasceu no escuro dele e recebeu o nome do seu primeiro som. Vão dizer que o maior chegou. Eu só sei que um coração pequeno batia rápido debaixo das minhas mãos e que deixei que ele fizesse barulho. Parto esta noite. Pela primeira vez, parto antes.”', '“Twelfth page. The day was eaten at noon and given back a few minutes later, as days usually are. A child was born in the dark of it and named for his first sound. They will say the greatest has come. I only know that a small heart beat fast under my hands, and that I let it be loud. I leave tonight. For once, I leave first.”'),
          ] },
        { id: 'branco', tom: 'frieza', txt: T('Deixar a página em branco.', 'Leave the page blank.'),
          resultado: [T('Deixei a página em branco. Há dias que não precisam de ajuda para serem lembrados.', 'I left the page blank. Some days need no help being remembered.')] },
      ] } },

    { id: 'e05', zona: 'deserto', fundo: { img: IMG('mapa-rastro'), kb: 'in', dim: .4, foco: '50% 50%', clima: 'estrelas' },
      texto: [
        T('A noite caiu sobre a Pira de uma vez, do jeito que cai no deserto, sem discutir com ninguém. Atrás de mim acendiam as fogueiras para os mortos. Ao norte, três pontos de bronze pegavam a luz das estrelas e a perdiam de novo, e vinham, no compasso de três.', 'Night came down on the Pyre all at once, the way it does in the desert, without discussing it with anyone. Behind me the fires were being lit for the dead. To the north, three points of bronze caught the starlight and lost it again, and came on, in their count of three.'),
      ],
      minijogo: 'rastro',
      depois: (st) => {
        const r = st.jogos.rastro || {};
        return [r.cantou ? T('Cantei enquanto acendia. A canção inteira, na língua que ninguém mais vivo fala, cada verso que me chama de grande. Pela primeira vez, ela serviu para alguma coisa.', 'I sang while I lit the way. The whole song, in the language nobody else alive speaks, every verse that calls me great. For once, it was good for something.')
          : T('Acendi o caminho em silêncio, um ponto de cada vez, como quem deixa migalhas para trás numa floresta que não tem árvores.', 'I lit the way in silence, one point at a time, like a man leaving crumbs behind him in a forest with no trees.')];
      } },

    { id: 'e06', zona: 'deserto', fundo: { video: VID('rastro'), img: IMG('deserto-noite'), dim: .35, foco: '60% 50%', clima: 'estrelas' }, capitular: true,
      narracao: 'assets/audio/voz/e06-fim.mp3', narracaoLang: 'en',
      sons: [{ s: 'assets/audio/tacet_passos.mp3', p: 1, v: .4 }],
      texto: [
        T('Caminhei para oeste, areia aberta adentro, aceso da testa à ponta dos dedos, que é a coisa mais tola que uma criatura caçada pode fazer, e raras vezes tive tanta certeza de alguma coisa.', 'I walked west into the open sand, lit from forehead to fingertips, which is the most foolish thing a hunted creature can do, and I have rarely been so sure of anything.'),
        T('Atrás de mim, o compasso quebrou de três para quatro. Tinham me achado. Era a ideia.', 'Behind me, the count broke from three to four. They had found me. That was the idea.'),
        T('Passei trinta anos sem fazer um som. Naquela noite, sem ninguém para ouvir além da areia e das coisas que me seguiam, fiz um.', 'I had spent thirty years making no sound. That night, with no one to hear it but the sand and the things that were following me, I made one.'),
        se((st) => !!(st.jogos.rastro && st.jogos.rastro.cantou), T('Lá atrás, os tambores dos mortos pararam pelo tempo de um verso, e recomeçaram.', 'Far behind me, the drums for the dead stopped for the length of a verse, and started again.')),
        se((st) => !!st.f.estalou, T('Em algum lugar atrás de mim, no acampamento, crianças estalavam a língua umas para as outras no escuro. Levei quase uma duna inteira para entender que estavam dizendo o meu nome.', 'Somewhere behind me, in the camp, children were clicking their tongues at each other in the dark. It took me most of a dune to understand that they were saying my name.')),
        se((st) => !!st.f.disse_nome, T('E em algum lugar atrás de mim, pela primeira vez em trinta anos, alguém sabia o meu nome.', 'And somewhere behind me, for the first time in thirty years, someone knew my name.')),
        se((st) => !!st.f.derramou, T('Eu não tinha nada para beber. Então pensei. A noite inteira, pensei em voz alta, debaixo da pele, e deixei brilhar.', 'I had nothing to drink. So I thought. All night long I thought out loud, under the skin, and let it shine.')),
        se(marcado, T('Só o antebraço onde o bronze tinha fechado ficou escuro, uma faixa de noite num homem aceso, como uma sombra que eu carregasse para alguém.', 'Only the forearm the bronze had closed on stayed dark, a strip of night on a lit man, like a shadow I was carrying for someone.')),
      ],
      fim: true },
  ],

  // ---------------------------------------------------------------- o que este capítulo deixa para os próximos
  estadoFinal: (st) => ({
    luz: Math.round(st.luz), hessa: st.hessa, shaa: st.shaa, pira: st.pira, turvo: st.turvo, bebidos: st.bebidos || 0,
    parto: parto(st), odre: st.escolhas.odre || null, despedida: st.escolhas.adeus || null,
    disseNome: !!st.f.disse_nome, estalou: !!st.f.estalou, deixouPedra: !!st.f.deixou_pedra, escreveu: !!st.f.escreveu,
    abriuGuarda: !!st.f.abriu_guarda, ouviuOficial: !!st.f.ouviu_oficial, salvouTukk: !!st.f.salvou_tukk, mostrouLuz: !!st.f.mostrou_luz, mentiuErvas: !!st.f.mentiuErvas,
    tom: st.tom, rastro: st.jogos.rastro || null, escolhas: st.escolhas,
  }),

  // ---------------------------------------------------------------- pontuação escondida
  pontos: (st) => {
    const t = st.jogos.troca || {}, m = st.jogos.minutos || {}, p = st.jogos.parto || {}, r = st.jogos.rastro || {};
    const pt = Math.max(500, Math.round((t.pontos || 0)));
    const pm = Math.max(500, Math.round(1500 * ((m.feitas || []).filter((a) => ['ouvir', 'po', 'tukk', 'shaa'].includes(a)).length) + 400 * (m.marcasSobrando || 0) + (m.feitas || []).includes('esconder') * 300));
    const pp = Math.max(800, Math.round(12000 * (p.dentro || 0) - 600 * (p.flares || 0) + (parto(st) === 'dois' ? 3000 : 0)));
    const pr = Math.max(800, Math.round(140 * (r.distancia || 0) + (r.cantou ? 2500 : 0) - 300 * Math.max(0, (r.luzes || 0) - 8)));
    const partes = [['troca', pt], ['minutos', pm], ['parto', pp], ['rastro', pr]];
    return { total: partes.reduce((a, [, v]) => a + v, 0), partes };
  },

  // ---------------------------------------------------------------- tela final (um narrador fora do roleplay)
  resumo: (st, lang) => {
    const t = (pt) => (lang === 'en' && window.LIVRO_EN[pt] != null ? window.LIVRO_EN[pt] : pt);
    const luz = Math.round(st.luz);
    const frase = luz >= 70 ? t(T('Aheryn entrou na noite brilhando. Qualquer coisa no deserto que saiba olhar vai saber onde ele está. Era essa a ideia.', 'Aheryn walked into the night shining. Anything in the desert that knows how to look will know where he is. That was the point.'))
      : luz <= 35 ? t(T('Aheryn deu aos Tacets só a luz necessária para segui-lo, e nem um grão a mais. Trinta anos de prática.', 'Aheryn gave the Tacets just enough light to follow, and not a grain more. Thirty years of practice.'))
        : t(T('Aheryn acendeu o caminho e guardou um pouco para si. Velhos hábitos.', 'Aheryn lit the way and kept a little back for himself. Old habits.'));
    const revela = t(T('O homem que os Grakh chamavam de Tinido era Kassian D’Orrose, General-Rei de Redom. Seus homens o levaram para casa sobre a própria capa. Um ano depois, no Torneio Real convocado para substituí-lo, um cavaleiro de elmo fechado se inscreveu com o nome de Laus.', 'The man the Grakh called the Tinn was Kassian D’Orrose, General-King of Redom. His men carried him home on his own cloak. A year later, at the Royal Tournament called to replace him, a rider in a closed helm entered under the name Laus.'));
    const n = [];
    n.push(st.f.abriu_guarda ? t(T('Hessa: viu os cavalos empinarem. Vai lembrar de quem abriu o caminho.', 'Hessa: she saw the horses go up. She will remember who opened the way.'))
      : st.hessa >= 1 ? t(T('Hessa: entre vocês, agora, há menos do que uma lança de distância.', 'Hessa: there is less than a spear’s length between you now.'))
        : st.hessa <= -1 ? t(T('Hessa: vai lembrar das ervas, e da luz.', 'Hessa: she will remember the herbs, and the light.'))
          : t(T('Hessa: a distância de sempre, uma lança e um pouco mais.', 'Hessa: the old distance, a spear and a little more.')));
    n.push(parto(st) === 'dois' ? t(T('Shaa: viveu o bastante para segurar o filho.', 'Shaa: she lived long enough to hold her son.')) : t(T('Shaa: deu o nome ao filho com o último fôlego.', 'Shaa: she named her son with her last breath.')));
    if (st.f.mostrou_luz) n.push(t(T('A cria sentiu a sua luz antes de nascer.', 'The child felt your light before he was born.')));
    n.push(st.f.ouviu_oficial ? t(T('A graxa cinza: agora você sabe por que o exército veio. Os Grakh nunca vão saber.', 'The grey grease: you know now why the army came. The Grakh will never know.'))
      : st.f.sentiu_unguento ? t(T('A graxa cinza: você sentiu o cheiro dela na linha de frente, e não perguntou por quê.', 'The grey grease: you smelled it on the front line, and did not ask why.'))
        : t(T('A graxa cinza: você nunca soube por que Redom veio com tanta força este ano.', 'The grey grease: you never learned why Redom came in such force this year.')));
    n.push(st.f.salvou_tukk ? t(T('Tukk: vivo, com duas pontas de lança para mostrar.', 'Tukk: alive, with two spearheads to show for it.')) : t(T('Tukk: não voltou da linha.', 'Tukk: he did not come back from the line.')));
    const r = st.jogos.rastro || {};
    if (r.distancia != null) n.push(t(T('Os Tacets: levados para longe da Pira, até onde a luz alcançou.', 'The Tacets: led away from the Pyre, as far as the light would reach.')));
    if (st.f.disse_nome) n.push(t(T('O seu nome: Hessa sabe.', 'Your name: Hessa knows it.')));
    if (st.f.estalou) n.push(t(T('As crianças da Pira deram um nome a você: um estalo de língua.', 'The children of the Pyre gave you a name: a click of the tongue.')));
    if (st.f.deixou_pedra) n.push(t(T('A pedra: na dobra da pele da cria.', 'The stone: in a fold of the child’s hide.')));
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
    const linhas = [];
    if (st.escolhas.proibido5) linhas.push({ id: 'proibido5', opcao: st.escolhas.proibido5, q: t(T('Na roda, o que Aheryn foi buscar', 'In the ring, what Aheryn reached for')), a: t(PARTO[st.escolhas.proibido5]) });
    if (st.escolhas.odre) linhas.push({ id: 'odre', opcao: st.escolhas.odre, q: t(T('O odre de vinho', 'The skin of wine')), a: t(ODRE[st.escolhas.odre]) });
    if (st.escolhas.adeus) linhas.push({ id: 'adeus', opcao: st.escolhas.adeus, q: t(T('As últimas palavras a Hessa', 'The last words to Hessa')), a: t(ADEUS[st.escolhas.adeus]) });
    if (st.escolhas.menino) linhas.push({ id: 'menino', opcao: st.escolhas.menino, q: t(T('A criança que imitava o seu andar', 'The child who copied your walk')), a: t(MENINO[st.escolhas.menino]) });
    return { frase, revela, notas: n, perfil: t(PERFIL[top]), linhas };
  },
};

// os textos com o nome da pedra do Cap. I ({P1}) são resolvidos na hora, já no idioma da leitura
window.LIVRO.subst = (s, st, tr) => {
  if (s.indexOf('{P1}') < 0) return s;
  const pd = st.c1 && st.c1.pedra, par = pd && nomePedra[pd.motivo];
  return s.replace(/\{P1\}/g, par ? tr(par[1]) : tr(T('A pedra', 'The stone')));
};
