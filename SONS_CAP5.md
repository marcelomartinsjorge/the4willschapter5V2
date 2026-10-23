# Cap. V · Lista de sons (efeitos e ambientes)

## Situação atual
**Instalados:** 8 ambientes em loop e 30 efeitos, todos nivelados (volume parecido entre eles) e com a emenda dos loops suavizada para não estalar. Os loops têm cerca de 14 s (a emenda ficou 0,8 s mais curta).
- **`roda-nome`:** você mandou 4 variações (`roda-nome1` a `roda-nome4`). O livro toca as quatro escalonadas, uma a cada ~1,1 s, para soar como a roda inteira repetindo o nome.
- **`grakh-bufa.mp3`:** não veio no pacote. Montei um provisório com o seu `po-vento` e o começo do `grakh-grunhe` (dois sopros de narina e um peito grave). Se quiser trocar, gere com o prompt da tabela e salve por cima, em `assets/audio/sfx/`.
- **Falta só a dublagem** (`assets/audio/voz/`, ver `ROTEIRO_DUBLAGEM_CAP5.md`).

Abaixo, a lista original com os prompts.

Os nomes de arquivo abaixo já estão ligados no livro. É só gerar, salvar com **este nome exato** e colocar na pasta indicada. Nada quebra enquanto eles não chegam:
- **Reserva sintetizada:** o motor toca um som feito por código no lugar.
- **Silêncio:** a página segue muda até o arquivo chegar.

Os prompts estão em inglês, prontos para colar (ElevenLabs Sound Effects ou similar).

Já vieram do Cap. I e estão no pacote: `sfx/pagina`, `sfx/gole`, `sfx/luz`, `sfx/diario-abre`, `sfx/diario-pagina`, `sfx/diario-fecha`, `tacet_passos.mp3`, `hino/louvor.mp3`.

## 1. Ambientes em loop · pasta `assets/audio/`
60 a 90 s, sem música, sem vozes. Enquanto não chegam, o motor toca um vento (ou um zumbido grave, no eclipse e na roda) sintetizado.

| Arquivo | Onde | Prompt |
|---|---|---|
| `laje-dia-loop.mp3` | Parte I, manhã na Laje | hot desert wind over stone, distant insects, sand grains shifting, creak of dry wood, very sparse and quiet, seamless loop |
| `laje-noite-loop.mp3` | Parte I, a noite na Laje | cold desert night wind, faint distant drumming and low voices of a huge encampment far away, crackle of one small ember, seamless loop |
| `acampamento-loop.mp3` | Parte I, o acampamento e a troca | a large nomadic camp: bones clacking, hide flaps, deep gravelly voices murmuring, children's low laughter, cooking fires, seamless loop |
| `goelas-loop.mp3` | Parte II, os poços | a huge crowd gathered around deep wells: low murmur of thousands of deep voices, water dripping deep underground, dusty wind, seamless loop |
| `batalha-loop.mp3` | Parte II e III, o choque e a luz voltando | ancient battle without music: shield impacts, roars, steel on bone, war horns far away, crowd shouting, seamless loop |
| `eclipse-loop.mp3` | Parte III, o eclipse | the eerie silence of a total eclipse: birds and insects abruptly stop, a thin cold wind, distant breathing of a stunned crowd, a very low drone underneath, seamless loop |
| `roda-loop.mp3` | Parte IV, a roda | a silent circle of huge beings: slow deep breaths, sand shifting under feet, a tight silence, seamless loop |
| `deserto-noite-loop.mp3` | Parte V, a partida | empty desert night, a long thin wind, faint sand hiss, a far distant low hum of the earth, seamless loop |

## 2. Efeitos · pasta `assets/audio/sfx/`

| Arquivo | Onde toca | Reserva? | Prompt |
|---|---|---|---|
| **`kronk.mp3`** | Parte IV, o som do nome | sim | two layers, no comedy: first a short dry crack like cartilage or green wood giving way, sharp and high; immediately followed by a low wet muffled thud, short; total about 1.2 seconds; dark and visceral but not gory, no voice, no music |
| `choro-cria.mp3` | logo depois do nome | sim | the first cry of a newborn creature, low and short, huge-chested, more a small roar than a wail |
| `roda-nome.mp3` | a roda repete "Kronk" | não | many deep gravelly voices softly repeating one word, "Kronk", one after another, low, solemn, like a ritual murmur, spreading outward |
| `coracao-rapido.mp3` | minijogo do parto (a cria) | sim | a single fast small strong heartbeat, close, one beat only (the game repeats it) |
| `coracao-lento.mp3` | minijogo do parto (Shaa, opção "os dois") | sim | a single slow weak heartbeat, close, one beat only, slightly irregular |
| `gole-cacto.mp3` | cada gole do odre | sim (usa o `gole` do Cap. I) | one swallow from a leather skin, a liquid gulp and a quiet breath out |
| `pensamento-sobe.mp3` | minijogo da ressaca: uma lembrança chega ao alto | sim | a soft rising shimmer, warm and brief, like a memory surfacing |
| `areia-enterra.mp3` | minijogo da ressaca: enterrar um pensamento | sim | a handful of dry sand poured and pressed down, soft and short |
| `cabaca.mp3` | a Laje: as cabaças | não | fermenting gourd bubbling slowly, thick liquid popping gently |
| `pote-abre.mp3` | a Laje: os potes | não | a clay pot lid lifted off with a dry scrape |
| `passos-areia.mp3` | sair da Laje | sim | a few slow barefoot steps on sand, soft |
| `couro-item.mp3` | minijogo da troca: pôr ou tirar um item | sim | a small object placed on a stretched hide, soft thump of leather |
| `grakh-bufa.mp3` | troca: o Grakh se interessa | sim | a huge creature snorting through its nose, deep chest resonance |
| `grakh-grunhe.mp3` | troca: o Grakh aceita | sim | a low throaty grunt of approval from a huge creature |
| `agua-areia.mp3` | derramar o odre | não | liquid poured from a leather skin onto dry sand, absorbed quickly |
| `corneta-redom.mp3` | a coluna de Redom aparece | não | a single deep war-horn call from a disciplined army, echoing over open desert |
| `armadura-tinido.mp3` | o Tinido à frente da coluna | não | plate armour clinking and ringing as a heavy man walks, a metallic chime on each step, distinctive and rhythmic |
| `eclipse-total.mp3` | começo do minijogo "Os minutos" | não | a deep sub-bass swell and a sudden hush, as if the whole world held its breath |
| `po-vento.mp3` | minutos: jogar o pó | sim | a handful of powder thrown into the wind, a soft whoosh and fine hiss |
| `cavalos-panico.mp3` | minutos: os cavalos empinam | não | horses neighing and rearing in panic, hooves stamping, riders shouting |
| `arrasta.mp3` | minutos: arrastar Tukk | sim | a heavy body dragged across sand and gravel, effort, slow |
| `sol-volta.mp3` | fim dos minutos | sim | a bright rising shimmer, like light breaking through, ending in a soft ring |
| `golpe.mp3` | o golpe de Hessa | sim | a heavy stone mace striking plate armour once, a deep metallic crack, then silence |
| `virotes.mp3` | a salva dos besteiros | não | a volley of five crossbow bolts released together and whistling through the air |
| `virote-impacto.mp3` | os virotes acertam Shaa | não | a single dull muffled impact, very short, not graphic |
| `marreta-chao.mp3` | Hessa larga a maça | não | a heavy stone-headed mace dropped onto sand, deep soft thud |
| `farol.mp3` | minijogo do rastro: cada luz acesa (e o brilho alto no parto) | sim | a flare of magical light igniting: a rising shimmering tone with a soft crystalline tail |
| `compasso-tres.mp3` | minijogo do rastro: os Tacets andando | sim | far-away metal-and-stone steps in a steady count of three, felt through the ground more than heard, one step only |

## 3. Música (opcional)
O capítulo não depende de música: as camas sonoras e o louvor do Cap. I (que Aheryn canta no minijogo do rastro, quando o leitor toca em **Cantar**) seguram a atmosfera. Se você quiser trilha no eclipse, gere no Udio e me mande. Eu ligo na página certa sem mexer em mais nada.
