# Cap. V · Aheryn, o Dia Comido · texto completo (PT + EN)

Gerado do roteiro do jogo. Linhas marcadas com *[se: ...]* só aparecem em certos caminhos; *[variável]* muda conforme as escolhas. Os textos dos minijogos (troca, minutos, ressaca, parto, rastro, diário) estão em capitulo5.js, nas seções de configuração.

## PARTE I · A Laje / The Slab
> No deserto, a água não se pede. Troca-se. / In the desert, no one asks for water. They trade for it. — ditado dos Queimados

### a01
- O deserto me acordou do jeito de sempre, pondo fogo em tudo o que a noite tinha deixado descoberto. Fiquei de cara na areia e fiz o inventário. Uma cabaça, vazia. Dois pés enterrados até o tornozelo, o que não me incomodava; amei poucas coisas sem reservas numa vida longa, e areia sob a sola é uma delas. Uma cabeça cheia de um silêncio que eu tinha pago com vinho de cacto e que voltaria a pagar antes do meio-dia.
  - *EN:* The desert woke me the way it always did, by setting fire to whatever the night had left uncovered. I lay with my face in the sand and took stock. One gourd, empty. Two feet, buried to the ankles, which I did not mind; I have loved few things without reservation in a long life, and sand under the soles is one of them. One head, full of a silence I had paid for in cactus wine and would be paying for again by noon.
- Trinta anos. Eu tinha descido para o sul para ser ninguém, e o deserto, que só é generoso numa coisa, me fez exatamente isso.
  - *EN:* Thirty years. I had come south to be no one, and the desert, which is generous in exactly one thing, had made me precisely that.

**Escolha: Antes de levantar:**
- **Sacudir a areia.** / Shake off the sand.
  - Levantei e bati a areia da roupa como quem quita uma dívida. Ela voltou no passo seguinte. O deserto não aceita pagamento.
    - *EN:* I stood and beat the sand out of my clothes like a man settling a debt. It was back by the next step. The desert does not accept payment.
- **Ficar mais um pouco com os pés nela.** / Stay a little longer with my feet in it.
  - Fiquei. A areia estava fresca a um palmo de fundura, como toda manhã, e toda manhã isso me surpreende, e já não restam muitas coisas que me surpreendam.
    - *EN:* I stayed. The sand was cool a hand’s depth down, as it is every morning, and every morning it surprises me, and there are not many things left that do.
- **Procurar a última gota na cabaça.** / Look in the gourd for a last drop.
  - Virei a cabaça sobre a boca e esperei, com a paciência dos verdadeiramente devotos. Nada caiu. Há manhãs em que até a fé vem vazia.
    - *EN:* I tipped the gourd over my mouth and waited, with the patience of the truly devout. Nothing came. Some mornings even faith is empty.

### a02 · minijogo: ressaca
- Os pensamentos voltaram com o sol. Sempre voltam. A noite os afoga e o calor os traz de volta, inchados, do jeito que o deserto devolve o que engoliu: anos depois e no lugar errado.
  - *EN:* The thoughts came back with the sun. They always do. The night drowns them, and the heat brings them up again, swollen, the way the desert gives back whatever it has swallowed: years later, and in the wrong place.

*Depois:*
- Alguns chegaram à superfície antes que eu os impedisse, e ficaram ali no calor, e eu os deixei ficar.
  - *EN:* A few of them reached the surface before I could stop them, and lay there in the heat, and I let them lie.

### a03
- *[se: (c1(st).luz || 0) >= 50]* Não desci para o sul em silêncio. Três dias depois do último gelo, caçadores me acharam num desfiladeiro de rocha negra, homens com redes e uma ordem lacrada. Lembro mais das redes do que dos homens. Lembro que daquela vez não recusei a luz, e que a rocha também se lembra: há um lugar naquele desfiladeiro onde nada cresce, e os Queimados dão a volta por ele.
  - *EN:* I did not come south quietly. Three days past the last ice, hunters found me in a pass of black rock, men with nets and a sealed writ. I remember the nets better than the men. I remember that I did not refuse the light that time, and that the rock remembers it too: there is a place in that pass where nothing grows, and the Burned walk around it.
- *[se: (c1(st).luz || 0) < 50]* Desci para o sul do jeito que a neve sai de um telhado, toda de uma vez e sem ruído. Quarenta dias de caminhada. O gelo virou cascalho, o cascalho virou pedra, a pedra virou areia, e em toda aquela encosta comprida do mundo ninguém pensou em olhar duas vezes para mais um velho descendo a ladeira. Cuidei disso: mantive os olhos nos pés e os pensamentos em coisa nenhuma.
  - *EN:* I came south the way snow leaves a roof, all at once and without a sound. Forty days of walking. The ice turned to scree, the scree to stone, the stone to sand, and in all that long slope of the world nobody thought to look twice at one more old man going downhill. I saw to that: I kept my eyes on my feet and my thoughts on nothing.
- *[se: !!c1(st).marcado]* Em algum ponto daquela caminhada parei de reparar que a luz já não subia pelo antebraço onde a mão de bronze tinha fechado. A pele ali ficou lisa e fria, como pedra de rio, e a luz passava em volta dela como a água passa em volta de uma pedra.
  - *EN:* Somewhere on that walk I stopped noticing that the light no longer climbed through the forearm the bronze hand had closed on. The skin there had gone smooth and cold, like a river stone, and the light went around it the way water goes around a stone.
- *[variável]* A pedra desceu comigo, no mesmo pano, e até hoje não me disse o que é.
  - *EN:* The stone came south with me, in the same cloth, and has still not told me what it is.
- *[se: !!c1(st).diario]* O diário também desceu comigo. Em trinta anos acrescentei onze páginas, o que dá mais ou menos uma a cada três anos, o que é mais ou menos a frequência com que tive algo que valesse a pena não esquecer.
  - *EN:* The diary came south too. In thirty years I have added eleven pages to it, which is roughly one every three years, which is roughly how often I have had something worth not forgetting.

### a04 · minijogo: laje · pode beber
- A Laje é uma única língua de pedra que o vento lambe há mais tempo do que o meu povo mantinha registros, e isso é muito tempo. Embaixo dela guardo tudo o que tenho. Não é muito. É exatamente o bastante para um estranho achar que alguém mora aqui, e uma casa não serve para mais nada.
  - *EN:* The slab is a single tongue of rock that the wind has been licking for longer than my people kept records, which is a long time. Under it I keep everything I own. It is not much. It is exactly enough to make a stranger think somebody lives here, and that is all a house is for.
- Antes de descer ao acampamento, contei tudo. Trinta anos, e nunca dei por falta de nada. Conto assim mesmo.
  - *EN:* Before going down to the camp, I counted everything. Thirty years, and I have never once found anything missing. I count anyway.

*Depois:*
- Estava tudo onde eu tinha deixado, menos a água. Peguei o odre vazio e desci.
  - *EN:* Everything was where I had left it, except the water. I took the empty skin and went down.

### a05
- O acampamento estava três vezes maior que uma semana antes, e crescia enquanto eu olhava. Hordas chegavam de todos os cantos da Boca Seca, longas filas pardas levantando o tipo de poeira que se vê a um dia de distância. No fim da estação seca os Grakh vão às Goelas beber, todos eles, porque não sobra outro lugar onde beber. Naquela semana, a Pira Errante fica onde estiver a água.
  - *EN:* The camp was three times the size it had been a week before, and growing while I watched. Hordes were coming in from every quarter of the Dry Mouth, long brown lines of them, raising the kind of dust you can see from a day away. At the end of the dry season the Grakh go to the Gullets to drink, all of them, because there is nowhere else left to drink. For that one week, the Wandering Pyre is wherever the water is.
- Redom sabe disso. Sabe há mais tempo do que estou aqui, e vem todo ano aos mesmos poços na mesma semana, e todo ano os Grakh estão lá. Não se pode pedir a um povo com sede que seja esperto sobre onde vai beber.
  - *EN:* Redom knows this. Redom has known it for longer than I have been here, and comes every year to the same wells in the same week, and every year the Grakh are there. You cannot ask a thirsty people to be clever about where they drink.
- Trinta anos, e nunca me deram um nome. Os Grakh nomeiam as coisas pelo som que elas fazem, e eu tomei muito cuidado para não fazer nenhum.
  - *EN:* Thirty years, and they had never given me a name. The Grakh name a thing by the sound it makes, and I have been very careful to make none.
- No meio da descida, uma criança Grakh entrou atrás de mim e começou a imitar o meu andar, pousando cada pé com um cuidado enorme e teatral, para não fazer barulho. Era bom nisso. Melhor do que eu na idade dele, e eu tive mestres.
  - *EN:* Halfway down, a Grakh child fell in behind me and began to copy my walk, setting each foot down with enormous, theatrical care, so as not to make a sound. He was good at it. He was better at it than I was at his age, and I had been taught by masters.

**Escolha: A criança atrás dele:**
- **Deixar que ele siga.** / Let him follow.
  - Deixei. Descemos a encosta juntos, dois silêncios, um deles muito satisfeito consigo mesmo.
    - *EN:* I let him. We went down the slope together, two silences, one of them very pleased with itself.
- **Estalar a língua para ele.** / Click my tongue at him.
  - Estalei a língua para ele, uma vez, sem me virar. Foi o primeiro som que fiz perto do acampamento em mais tempo do que consigo lembrar. Ele parou na hora. Depois estalou de volta e desceu a encosta correndo, estalando a língua para tudo o que via pela frente: uma cabra, uma tenda, os próprios pés.
    - *EN:* I clicked my tongue at him, once, without turning around. It was the first sound I had made near the camp in longer than I could remember. He stopped dead. Then he clicked back, and ran off down the slope clicking at everything he passed: a goat, a tent, his own feet.
- **Parar e olhar para ele até ele ir embora.** / Stop and look at him until he goes.
  - Parei e olhei para ele. Tenho um olhar para isso, aperfeiçoado ao longo de um século; já mandou embora homens melhores que uma criança Grakh. Ele me encarou com grande interesse, depois ficou entediado e foi embora, o que eu decidi contar como vitória.
    - *EN:* I stopped and looked at him. I have a look for this, perfected over a century; it has sent away better men than a Grakh child. He stared back with great interest, then got bored and left, which I chose to count as a victory.

### a06 · minijogo: troca · pode beber
- Meu ponto de troca é uma pedra chata na borda do acampamento e um couro que estendo em cima dela. Os Grakh não comerciam; me disseram isso no meu primeiro ano, com uma lança, e eu nunca discuti. O que fazem é pôr uma coisa ao lado de outra, olhar para as duas e decidir. Se isso não é comércio, é pelo menos o irmão mais novo dele, aquele que ainda não aprendeu a mentir.
  - *EN:* My place of trade is a flat stone at the edge of the camp, and a hide I spread over it. The Grakh do not trade; they told me so in my first year, with a spear, and I have never argued. What they do instead is put one thing down beside another thing, look at both, and decide. If that is not trade, it is at least its younger brother, the one who has not yet learned to lie.

*Depois:*
- Nem toda troca fechou. As que não fecharam foram embora sem uma palavra, o que entre os Grakh é uma palavra.
  - *EN:* Not every trade closed. The ones that did not went away without a word, which among the Grakh is a word.
- *[se: !!(st.jogos.troca && st.jogos.troca.ok && st.jogos.troca.ok.tukk)]* O odre estava cheio outra vez.
  - *EN:* The water skin was full again.
- *[se: !tukkTrocou(st)]* Eu continuava sem água.
  - *EN:* I still had no water.

### a07
- Depois, Shaa. Ela atravessou a areia na velocidade de uma mulher que carrega uma segunda pessoa, uma mão embaixo da barriga como para segurá-la, e já vinha rindo antes de chegar, de alguma coisa que eu não via. A maioria dos Grakh fica a uma lança de distância de mim sem pensar nisso, do jeito que se mantém a mão longe do fogo. Shaa sentou tão perto que nossos joelhos quase se tocaram.
  - *EN:* Then Shaa. She came across the sand at the speed of a woman carrying a second person, one hand under her belly as if to keep it from falling, and she was laughing before she reached me, at nothing I could see. Most of the Grakh keep a spear’s length from me without thinking about it, the way you keep your hand away from a fire. Shaa sat down so close our knees almost touched.
- — Shaa ter dor. Aqui, e aqui. A cria chutar como querer sair pelas costas.
  - *EN:* — Shaa have pain. Here, and here. Baby kick like it want out through the back.
- Não trazia nada nas mãos. Olhou para elas como se isso a surpreendesse e então tirou do pescoço o cordão: um único dente, maior que o meu dedo.
  - *EN:* She had nothing in her hands. She looked at them as if this surprised her, and then took the cord from around her neck: a single tooth, longer than my finger.
- — Primeira caçada. Primeira morte da Shaa. Dente bom.
  - *EN:* — First hunt. Shaa first kill. Good tooth.

**Diálogo · O dente sobre o couro:**
- **Aceitar o dente.** / Accept the tooth.
  - — Bom. Agora Shaa não dever nada. Agora você não dever nada.
    - *EN:* — Good. Now Shaa owe nothing. Now you owe nothing.
  - Dei a ela a tintura para a dor. Ela virou na boca como se fosse doce e fez uma careta que o acampamento inteiro podia ler.
    - *EN:* I gave her the tincture for the pain. She tipped it into her mouth like a sweet and made a face the whole camp could have read.
- **Dizer a ela que fique com o dente.** / Tell her to keep the tooth.
  - — Grakh não aceitar presente. Presente ser dívida sorrindo.
    - *EN:* — Grakh not take gift. Gift is debt with a smile.
  - Ela olhou por cima do ombro antes de pegar a tintura assim mesmo, depressa, e pendurou o dente de volta no pescoço. Alguém na borda do acampamento tinha visto.
    - *EN:* She looked over her shoulder before she took the tincture anyway, quickly, and hung the tooth back around her neck. Someone at the edge of the camp had seen.
- **Nada em troca de nada.** / Nothing for nothing.
  - — Justo.
    - *EN:* — Fair.
  - Disse do jeito que os Grakh dizem tudo o que é verdade, sem sentimento nenhum, e levantou e foi embora. Ao meio-dia voltou com um odre de água, sentou à mesma distância, perto demais, e estendeu a mão.
    - *EN:* She said it the way the Grakh say everything that is true, without any feeling about it, and got up and left. At midday she came back with a skin of water, sat down at the same distance, too close, and held out her hand.

**Diálogo · Ela quer ver a luz.**
- — Dizer que você ter luz. Debaixo da pele. Como fogo debaixo da areia. Shaa querer ver.
  - *EN:* — They say you have light. Under the skin. Like fire under sand. Shaa want to see.
- **Puxar o pano do pulso e pensar em alguma coisa.** / Pull the cloth back from my wrist and think of something.
  - Puxei o pano do pulso e pensei em chuva. A luz subiu pelas veias como água subindo num poço seco. Shaa parou de rir. Pegou o meu pulso e o encostou na barriga, sem pedir, e alguma coisa lá dentro chutou o lugar onde estava a luz, com força, duas vezes.
    - *EN:* I pulled the cloth back from my wrist and thought of rain. The light came up through the veins like water rising in a dry well. Shaa stopped laughing. She took my wrist and laid it against her belly, without asking, and something inside kicked the place where the light was, hard, twice.
  - — A cria gostar.
    - *EN:* — Baby like it.
- **“Ela só aparece quando estou bêbado, e ainda não estou bêbado o bastante para você.”** / “It only comes out when I’m drunk, and I’m not drunk enough for you yet.”
  - — Shaa esperar.
    - *EN:* — Shaa wait.
  - Ela acomodou o peso na areia, as duas mãos na barriga, e não levantou.
    - *EN:* She settled her weight on the sand, both hands on her belly, and did not get up.
- **(silêncio)** / 
  - Ela esperou. Depois deu dois tapinhas no meu joelho, do jeito que se dá num bicho que não entendeu, e levantou.
    - *EN:* She waited. Then she patted my knee, twice, the way you pat an animal that has not understood, and got up.

### a08
- Na sombra de uma parede de couro, Ghru mastigava uma raiz com a concentração lenta dos muito velhos. É o Grakh mais velho que conheço. Tem trinta e oito anos. Entre o povo dele, é uma idade que se anuncia, como um título, e ele anuncia sempre.
  - *EN:* In the shade of a hide wall, Ghru was chewing a root with the slow concentration of the very old. He is the oldest Grakh I know. He is thirty-eight. Among his people that is an age you announce, like a title, and he announces it often.
- — Amanhã, as Goelas. Todo mundo. E o Tinido vir, como todo ano. Este ano ele trazer mais homem que areia.
  - *EN:* — Tomorrow, the Gullets. Everybody. And the Tinn come, like every year. This year he bring more men than sand.
- Tinido é como os Grakh chamam o comandante de Redom: o som que a armadura dele faz quando ele anda. Deram-lhe nome do único jeito que dão nome a qualquer coisa.
  - *EN:* The Tinn is what the Grakh call the commander of Redom: the sound his armour makes when he walks. They had named him the only way they name anything.
- — E talvez o dia ser comido.
  - *EN:* — And maybe the day be eaten.
- Riu com os ombros.
  - *EN:* He laughed with his shoulders.
- — Quando o dia ser comido, nascer o maior. A mãe de Ghru dizer isso. A mãe dela dizer isso. Ninguém ver. Todo mundo lembrar.
  - *EN:* — When the day be eaten, the greatest be born. Ghru mother say that. Her mother say that. Nobody see. Everybody remember.

**Diálogo · Perguntar a Ghru:**
- **“O que é que come um dia?”** / “What eats a day?”
  - — Ghru não saber. A mãe de Ghru não saber. Ela dizer assim mesmo. Dizer não custar nada.
    - *EN:* — Ghru not know. Ghru mother not know. She say it anyway. Saying cost nothing.
- **“Me fale do Tinido.”** / “Tell me about the Tinn.”
  - — Ele andar na frente. Sempre na frente. Outros chefes empurrar os homens, o Tinido ir primeiro. Hessa querer muito a cabeça dele.
    - *EN:* — He walk in front. Always in front. Other chiefs push the men ahead, Tinn go first. Hessa want his head very much.
- **Contar os dentes dele em vez de ouvir.** / Count his teeth instead of listening.
  - Onze. No ano anterior eram catorze. Ghru percebeu que eu contava e arreganhou os dentes, para ajudar.
    - *EN:* Eleven. Last year there had been fourteen. Ghru noticed me counting and bared them, to help.
  - — Você não ouvir. Bom. Ninguém ouvir Ghru. Ghru falar assim mesmo.
    - *EN:* — You not listen. Good. Nobody listen to Ghru. Ghru talk anyway.

**Diálogo · E então:**
- **“Quem te deu o nome?”** / “Who gave you your name?”
  - — Mãe. Ghru nascer com areia na garganta. Primeiro som: ghrrru. Então: Ghru.
    - *EN:* — Mother. Ghru born with sand in throat. First sound: ghrrru. So: Ghru.
  - Fez o som para mim, um pequeno desmoronamento no fundo da garganta, muito satisfeito, como se o tivesse inventado naquela manhã.
    - *EN:* He made the sound for me, a small rockslide at the back of his throat, very pleased with it, as if he had invented it that morning.
- **“Quem foi o maior, da última vez?”** / “Who was the greatest, the last time?”
  - — Ninguém saber. Ele vir quando o dia ser comido, ele ir. Não morrer. Só ir. Talvez voltar. Talvez Ghru comer esta raiz e morrer. Quem saber.
    - *EN:* — Nobody know. He come when the day be eaten, he go. Not die. Just go. Maybe come back. Maybe Ghru eat this root and die. Who know.
- **Deixá-lo com a raiz.** / Leave him to his root.
  - Ele nem levantou os olhos. Entre os Grakh, uma conversa termina quando alguém para de estar nela.
    - *EN:* He did not look up. Among the Grakh, a conversation is over when someone stops being in it.

*Depois:*
- Eu tinha ouvido a frase do dia comido umas cem vezes em trinta anos, sempre da boca dos velhos, sempre com aquele riso nos ombros. Entre os Grakh, profecia é como o tempo entre outros povos: assunto para reclamar, sem pressa nenhuma.
  - *EN:* I had heard the line about the day being eaten perhaps a hundred times in thirty years, always from the old, always with that laugh in the shoulders. Among the Grakh, prophecy is like weather among other peoples: something to complain about, in no particular hurry.

### a09 · pode beber
- Hessa estivera olhando o tempo todo. Sempre olha, sempre da mesma distância, uma lança e um pouco mais, com uma das mãos pousada no cabo da maça às costas. O nome dela é o som que a água faz numa pedra quente. Combina com ela mais do que qualquer nome que já ouvi.
  - *EN:* Hessa had been watching the whole time. She always does, from the same distance, a spear’s length and a little more, one hand resting on the haft of the mace across her back. Her name is the sound water makes on a hot stone. It suits her better than any name I have ever heard.
- Mandou Tukk embora com duas palavras, do jeito Grakh, sem dobra nenhuma nos verbos. Então se virou para mim e mudou.
  - *EN:* She sent Tukk off with two words, in the Grakh way, with no bend in the verbs at all. Then she turned to me, and changed.
- Comigo Hessa fala a língua dos homens, inteira, cada verbo no lugar, com as vogais compridas e abertas dos Queimados. No ombro esquerdo ela tem uma velha marca ritual deles, das que eles queimam nos cativos, e por cima dela alguém depois cortou três linhas a faca, fundas e deliberadas, como quem risca uma palavra. Nunca perguntei. Ela nunca contou. É a conversa mais longa que já tivemos.
  - *EN:* With me Hessa speaks the language of men, all of it, every verb in its place, with the long open vowels of the Burned. On her left shoulder there is an old ritual brand of theirs, the kind they burn into captives, and across it someone later cut three lines with a knife, deep and deliberate, as if crossing out a word. I have never asked. She has never told me. It is the longest conversation we have had.
- *[se: tukkTrocou(st)]* Estendi o odre de água. Ela pegou, arrancou a tampa com os dentes e despejou na areia entre nós, devagar, até o fim, olhando para mim o tempo todo.
  - *EN:* I held out the water skin. She took it, pulled the stopper with her teeth, and poured it out on the sand between us, slowly, all of it, looking at me the whole time.
- *[se: !temAgua(st)]* Estendi o odre de vinho. Ela pegou, arrancou a tampa com os dentes, cheirou e despejou um gole comprido na areia entre nós, devagar, olhando para mim o tempo todo. Depois me devolveu o odre.
  - *EN:* I held out the skin of wine. She took it, pulled the stopper with her teeth, smelled it, and poured a long swallow of it out on the sand between us, slowly, looking at me the whole time. Then she handed the skin back.

**Diálogo · Responder a Hessa:**
- — Você fica porque os potes mantêm o meu povo de pé. Homens que deviam cair não caem. É o único motivo de você ainda estar naquela pedra. Não confunda com outro.
  - *EN:* — You stay because the pots keep my people standing. Men who should fall, don’t. That is the only reason you are still on that stone. Do not mistake it for another.
- **“Então somos úteis um ao outro.”** / “Then we are useful to each other.”
  - — Útil é palavra de ferramenta.
    - *EN:* — Useful is a word for tools.
- **“São só ervas.”** / “It is only herbs.”
  - — Os Queimados também diziam que era só sangue.
    - *EN:* — The Burned also said it was only blood.
- **Fazer o sinal de troca que os Grakh do gelo me ensinaram.** / Make the sign of exchange the Grakh of the ice taught me. *(se: (c1(st).aug || 0) >= 1)*
  - Os olhos dela foram para a minha mão e ficaram ali um instante a mais do que precisavam. A mão na maça desceu para junto do corpo.
    - *EN:* Her eyes went to my hand and stayed there a moment longer than they needed to. The hand on the mace came down to her side.
- **Baixar os olhos e ir embora.** / Lower my eyes and go.
  - Ela me deixou ir. Vindo de Hessa, é uma cortesia.
    - *EN:* She let me go. From Hessa, that is a courtesy.

**Diálogo · Hessa:** *(se: st.escolhas.hessa1 !== 'baixar')*
- — O Tinido está a dois dias dos poços. Talvez um. Esteja longe.
  - *EN:* — The Tinn is two days from the wells. Maybe one. Be far away.
- **“Preciso de água. A água está nos poços.”** / “I need water. The water is at the wells.”
  - — Então beba depressa.
    - *EN:* — Then drink fast.
- **“Estou sempre longe. Mesmo parado aqui.”** / “I am always far away. Even standing here.”
  - Alguma coisa se mexeu no canto da boca dela e foi guardada no mesmo instante.
    - *EN:* Something moved at the corner of her mouth and was put away at once.
- **(silêncio)** / 
  - Ela me deu as costas. Hessa não dá as costas a homens armados. Nunca soube ao certo sobre qual de nós dois isso diz mais.
    - *EN:* She turned her back on me. Hessa does not turn her back on armed men. I have never been sure which of us that says more about.

### a10 · pode beber
- Naquela noite sentei na beira da Laje com o odre de vinho de cacto e fiquei olhando as hordas chegarem. As fogueiras foram acendendo uma a uma pelo escuro, até a planície lá embaixo parecer um céu que tinha caído e era teimoso demais para apagar.
  - *EN:* That night I sat at the edge of the slab with the skin of cactus wine and watched the hordes come in. Their fires went on one by one across the dark, until the plain below looked like a sky that had fallen and was too stubborn to go out.
- Sem lua. Na noite anterior também não houvera. O meu povo costumava esperar por noites assim, por motivos que eu tinha bebido para fora da cabeça havia muito tempo.
  - *EN:* No moon. There had been none the night before, either. My people used to watch for nights like these, for reasons I had drunk out of my head a long time ago.
- *[variável]* Por baixo dos tambores, através da pedra e para dentro da sola dos meus pés, veio outra coisa: muitos pés, longe, a leste, batendo no chão ao mesmo tempo. Os Grakh não marcham em passo. Nada vivo marcha em passo a não ser que alguém esteja gritando com ele.
  - *EN:* Under the drums, through the rock and into the soles of my feet, came something else: many feet, far to the east, striking the ground at the same time. The Grakh do not walk in step. Nothing alive walks in step unless someone is shouting at it.
- *[variável]* Contei, por hábito, esperando o três. Não era três. Eram mil homens fingindo ser um.
  - *EN:* I counted, out of habit, waiting for the three. It was not three. It was a thousand men pretending to be one.

## PARTE II · As Goelas / The Gullets
> A Pira não tem lugar. Tem fogo. / The Pyre has no place. It has a fire. — dito Grakh

### b01 · pode beber
- Eu nunca tinha visto tantos deles num lugar só, e já vi exércitos. Estavam em volta das Goelas em anéis, do jeito que bichos ficam em volta de um fogo, cem de fundura, os velhos mais perto da água e as crianças mais perto de coisa nenhuma. Naquele dia, a Pira Errante era ali. Toda horda que ainda tinha pernas viera beber.
  - *EN:* I had never seen so many of them in one place, and I have seen armies. They stood around the Gullets in rings, the way animals stand around a fire, a hundred deep, the old ones nearest the water and the children nearest nothing at all. That day the Wandering Pyre was there. Every horde that still had legs had come to drink.
- As Goelas são três gargantas na rocha que descem mais fundo do que uma corda consegue acompanhar. No fim da estação seca a água fica tão baixa que os Grakh descem meninos amarrados em cordas para encher os odres e os puxam de volta, pingando e orgulhosos.
  - *EN:* The Gullets are three throats in the rock that go down farther than a rope can follow. At the end of the dry season the water sits so low that the Grakh lower boys on ropes to fill the skins, and haul them up again, dripping and proud.
- *[se: st.shaa >= 1]* Shaa me viu do outro lado do poço mais próximo e acenou com o braço inteiro, como se de outro jeito eu pudesse não vê-la. Não era possível não vê-la.
  - *EN:* Shaa saw me from across the nearest well and waved with her whole arm, as if I might otherwise miss her. It was not possible to miss her.
- *[se: st.shaa < 1]* Shaa estava junto do poço mais próximo, bebendo nas mãos. Não levantou os olhos.
  - *EN:* Shaa was by the nearest well, drinking from her hands. She did not look up.

### b02 · pode beber
- Vieram do leste na hora em que as sombras são mais curtas, numa coluna tão reta que parecia riscada a régua na areia. Escudos, lanças, pano vermelho. Atrás deles, as armações de madeira das máquinas de cerco, puxadas por bois, balançando como pássaros lentos.
  - *EN:* They came out of the east at the hour when shadows are shortest, in a column so straight it looked ruled onto the sand. Shields, spears, red cloth. Behind them the timber frames of siege engines, dragged by oxen, nodding like slow birds.
- Na frente, debaixo de uma bandeira vermelha, vinha o Tinido.
  - *EN:* At the front, under a red banner, rode the Tinn.
- Dois Grakh, feridos em alguma escaramuça anterior, estavam caídos no descampado entre as linhas. O Tinido levantou a mão, e a coluna inteira parou e esperou, em pleno sol, enquanto outros Grakh corriam e arrastavam os dois para longe. Depois ele baixou a mão.
  - *EN:* Two Grakh, wounded in some earlier skirmish, lay in the open between the lines. The Tinn raised his hand, and the whole column stopped and waited, in the full sun, while other Grakh ran out and dragged the two of them away. Then he lowered his hand.

**Escolha: Aheryn olha para:**
- **A bandeira.** / The banner.
  - Uma espada branca sobre vermelho e, como guarda, uma balança. Conheci homens capazes de falar uma hora sobre o que aquilo significa. Conheci uns poucos que viviam aquilo. Esses nunca explicavam nada.
    - *EN:* A white sword on red, and for a guard, a pair of scales. I have known men who could talk for an hour about what that means. I have known a few who lived it. Those never explained anything.
- **O homem da frente.** / The man in front.
  - Nem moço, nem velho. Sem elmo; levava-o debaixo do braço, e os homens dele podiam ver o seu rosto de qualquer ponto da coluna. Montava como quem nunca precisou olhar para baixo para saber onde estão os pés.
    - *EN:* Not young, not old. No helmet; he carried it under his arm, and his men could see his face from anywhere in the column. He sat the horse like a man who has never once had to look down to know where his feet are.
- **Contá-los.** / Count them.
  - Contei os estandartes e multipliquei pelo que costuma ficar debaixo de um estandarte. Mais homens do que Ghru tinha dito. Ghru tinha dito mais homens que areia.
    - *EN:* I counted the standards and multiplied by what usually stands under a standard. More men than Ghru had said. Ghru had said more men than sand.

### b03 · pode beber
- Então as linhas se encontraram, e por um tempo não houve nada para ver além do que sempre há: homens e Grakh tentando ocupar o mesmo pedaço de chão, e o chão se recusando a tomar partido.
  - *EN:* Then the lines met, and for a while there was nothing to see but what there always is: men and Grakh trying to occupy the same piece of ground, and the ground refusing to take sides.
- Tukk estava na frente. Uma semana antes, não conseguia ficar de pé. Agora levava uma lança no ombro, quebrava a haste e seguia.
  - *EN:* Tukk was at the front. A week before, he could not stand. Now he was taking a spear in the shoulder, snapping off the shaft, and going on.
- *[se: (st.turvo || 0) <= 2]* O vento mudou e me trouxe, através da poeira, do sangue e do suor de mil corpos, um cheiro que eu conhecia melhor que qualquer um deles: resina, raiz amarga, a argila cinza em que eu moo as duas. O meu unguento. Estava em metade dos Grakh daquela linha.
  - *EN:* The wind changed, and brought me, through dust and blood and the sweat of a thousand bodies, a smell I knew better than any of them: resin, bitter root, the grey clay I grind them in. My ointment. It was on half the Grakh in that line.
- *[se: !sobrio(st)]* O vento trouxe alguma coisa. Poeira, sangue. Eu não estava em condições de ser exigente.
  - *EN:* The wind brought something. Dust, blood. I was in no state to be particular.

### b04
- A luz mudou primeiro. Ficou rala e estranha, da cor de luz atravessando um vidro sujo, e as sombras das lanças ganharam bordas nítidas, nítidas demais, como recortadas a faca. O calor saiu do ar de uma vez. Depois os pássaros pararam.
  - *EN:* The light changed first. It went thin and strange, the colour of light through dirty glass, and the shadows of the spears grew edges, too sharp, as if cut with a knife. The heat went out of the air all at once. Then the birds stopped.
- Olhei para cima, porque todos olhavam para cima. Tinham arrancado uma mordida preta do sol. Eu sabia o que era. Sabia desde antes de qualquer pessoa naquele campo ter nascido: a lua passando na frente, como passa uma vez na vida de alguém, em algum lugar do mundo. O meu povo tinha tabelas para isso. As tabelas queimaram junto com o meu povo. Sobrou um fato velho, que eu disse para mim mesmo, baixinho: não dura. Minutos. Um punhado.
  - *EN:* I looked up, because everyone was looking up. A black bite had been taken out of the sun. I knew what it was. I had known since before anyone on that field was born: the moon, crossing in front, as it does once in a lifetime, somewhere in the world. My people had tables for it. The tables burned with my people. What was left was one old fact, which I said to myself under my breath: it does not last. Minutes. A handful.
- Do lado de Redom, a linha começou a envergar. Homens baixavam os escudos para apontar o céu, e em algum lugar das fileiras uma voz achou as palavras que o país deles usa para o ano em que o meu povo foi extinto, e as palavras correram a linha mais depressa que qualquer ordem.
  - *EN:* On the Redom side the line began to bend. Men lowered their shields to point at the sky, and somewhere in the ranks a voice found the words their country uses for the year my people were put out, and the words ran down the line faster than any order.
- — As luzes! As luzes estão se apagando!
  - *EN:* — The lights! The lights are going out!
- Do outro lado, os Grakh começaram a urrar. Ghru estava na borda do poço mais próximo, os dois braços para cima, gritando a frase velha para o céu sem riso nenhum nos ombros.
  - *EN:* On the other side, the Grakh began to roar. Ghru was on the rim of the nearest well, both arms up, shouting the old line at the sky with no laugh in his shoulders at all.
- — Dia ser comido! Dia ser comido!
  - *EN:* — Day be eaten! Day be eaten!
- E no meio de tudo isso, uma voz que eu ouvia do outro lado do campo, porque era o único homem ali gritando alguma coisa útil:
  - *EN:* And in the middle of it, one voice I could hear across the whole field, because he was the only man there shouting something useful:
- — Firmes! É só o escuro! Segurem a linha!
  - *EN:* — Hold! It is only the dark! Hold the line!
- O Tinido. Não olhou para cima nem uma vez. A essa altura eu também tinha parado de olhar, e acho que éramos os dois únicos naquele campo: o que entendia o céu e o que ia morrer debaixo dele. Só um de nós estava a descoberto.
  - *EN:* The Tinn. He never once looked up. By then I had stopped looking too, and I think we were the only two on that field who had: the one who understood the sky, and the one who would die under it. Only one of us was standing in the open.
- *[se: !!c1(st).pedra]* No bolso, a pedra tinha ficado violeta, a cor que ela não tem em nenhuma outra luz, e fechei a mão em volta dela como se ela pudesse me denunciar.
  - *EN:* In my pocket the stone had gone violet, a colour it has in no other light, and I closed my hand over it as if it might give me away.

## PARTE III · O Dia Comido / The Eaten Day
> O que se apaga no céu se apaga nos homens. / What goes out in the sky goes out in men. — nota Lúmae à margem, sem assinatura

### c01 · minijogo: minutos · pode beber
- Eu tinha, pela aritmética mais velha que conheço, cinco minutos. Talvez seis. Todos os outros naquele campo tinham a eternidade, e estavam se comportando de acordo.
  - *EN:* I had, by the oldest arithmetic I know, five minutes. Perhaps six. Everyone else on that field had forever, and was behaving accordingly.

*Depois:*
- Eu tinha gastado os meus minutos. O escuro tinha talvez mais um.
  - *EN:* I had spent my minutes. The dark had perhaps one left.

### c02
- *[se: !!st.f.abriu_guarda]* Sem os cavalos, o Tinido foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro pelo vão que os cavalos tinham deixado, direto para ele, e nada se pôs no caminho dela, porque eu tinha cuidado disso.
  - *EN:* With his horses gone, the Tinn went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark through the gap the horses had left, straight at him, and nothing stood in her way, because I had seen to that.
- *[se: !st.f.abriu_guarda]* O Tinido desceu do cavalo e foi a pé até onde a linha dele se partia, sozinho, para segurá-la com o próprio corpo. Hessa saiu do escuro direto para ele, atravessando três homens que estavam no caminho, e chegou ao outro lado deles sangrando no braço e sem diminuir o passo.
  - *EN:* The Tinn got down from his horse and went on foot to where his line was breaking, alone, to hold it with his own body. Hessa came out of the dark straight at him, through three men who were in her way, and came out the other side of them bleeding from the arm and no slower.
- Ele a viu chegando. Firmou os pés.
  - *EN:* He saw her coming. He set his feet.
- Um besteiro atrás dele ergueu a arma na direção dela. Sem virar a cabeça, o Tinido estendeu a mão esquerda e empurrou a besta para baixo.
  - *EN:* A crossbowman behind him raised his weapon toward her. Without turning his head, the Tinn put out his left hand and pushed the bow down.
- Então ela chegou.
  - *EN:* Then she was on him.
- Três golpes. Ele desviou o primeiro. Desviou o segundo, e isso lhe custou a espada. O terceiro desceu onde o pescoço encontra o ombro, e ele caiu de joelhos, e depois de frente na areia, e o caminho inteiro até o chão não tirou os olhos dela.
  - *EN:* Three blows. He turned the first. He turned the second, and it cost him the sword. The third came down where the neck meets the shoulder, and he went to his knees, and then forward onto the sand, and the whole way down he did not take his eyes off her.
- Hessa ficou de pé sobre ele no escuro. Não ergueu a maça de novo.
  - *EN:* Hessa stood over him in the dark. She did not raise the mace again.
- *[se: !!st.f.ouviu_oficial]* Agora eu sabia por que ele tinha vindo de tão longe, em pessoa. Isso não tornou mais fácil assistir. Saber as coisas raramente torna; eu teria gostado de ouvir o contrário, só uma vez.
  - *EN:* I knew now why he had come all this way himself. It did not make watching easier. Knowing things rarely does; I would have liked, just once, to be told otherwise.
- *[se: !!st.f.escondeu]* Assisti a tudo das pedras, o que quer dizer que assisti do jeito que assisti à maior parte das coisas na vida: de onde elas não me alcançavam.
  - *EN:* I watched it all from the rocks, which is to say I watched it the way I have watched most things in my life: from where they could not reach me.

### c03
- Então o sol voltou. Primeiro uma única conta branca na beira do escuro, depois uma lâmina, e todas as sombras do campo giraram de uma vez, e homens que gritavam um instante antes ficaram piscando uns para os outros como estranhos acordando na mesma cama.
  - *EN:* Then the sun came back. First a single white bead on the rim of the dark, then a blade of it, and every shadow on the field swung around at once, and men who had been shouting a moment before stood blinking at each other like strangers waking in the same bed.
- Redom recuou. E recuou bem, isso eu admito: em ordem, os escudos travados, levando o Tinido entre quatro homens, em cima da própria capa. Os besteiros vinham de costas na retaguarda, como são treinados a fazer, e na última elevação se viraram e soltaram uma salva contra a multidão nos poços, como também são treinados a fazer.
  - *EN:* Redom pulled back. It did it well, I will grant them that: in order, shields locked, carrying the Tinn between four men on his own cloak. The crossbowmen walked backward at the rear, as they are trained to, and at the last rise they turned and loosed one volley into the crowd at the wells, as they are also trained to.
- Não havia mais mão nenhuma para empurrar as bestas para baixo.
  - *EN:* There was no hand left to push the bows down.
- *[se: !!st.f.junto_shaa]* Eu segurava o braço de Shaa quando a acertaram. Senti cada um chegar, pelo corpo dela, até a minha mão. Cinco. Contei do jeito que conto tudo, e depois continuei contando, porque a cria debaixo da minha outra mão ainda se mexia, e eu não queria parar de saber disso.
  - *EN:* I was holding Shaa’s arm when they hit her. I felt each one arrive through her body into my hand. Five. I counted them the way I count everything, and then I went on counting, because the child under my other hand was still moving, and I did not want to stop knowing that.
- *[se: !st.f.junto_shaa]* Quando cheguei ao poço, Shaa estava caída de lado na borda. Cinco virotes. Contei do jeito que conto tudo. Depois pus a mão na barriga dela, porque precisava saber, e a cria chutou.
  - *EN:* When I reached the well, Shaa was lying on her side on the rim. Five bolts. I counted them the way I count everything. Then I put my hand on her belly, because I had to know, and the child kicked it.

## PARTE IV · O Nome / The Name
> O primeiro som é o primeiro nome. / The first sound is the first name. — costume Grakh

### d01
- Vieram sem que ninguém chamasse. Os sobreviventes dos poços, os feridos e os inteiros, atravessaram a areia de um em um, de dois em dois, e ficaram em volta de nós, de Shaa e de mim, até virarem uma parede, cem de fundura, e nenhuma luz passava por ela além da que vinha de cima.
  - *EN:* They came without being called. The survivors of the wells, the wounded and the whole, came across the sand in ones and twos and stood around us, around Shaa and me, until there was a wall of them, a hundred deep, and no light came through it but what came from above.
- Ninguém falou. Os Grakh não são um povo quieto, e eu nunca tinha ouvido cem deles sem fazer som nenhum. Era o tipo de silêncio que está esperando alguma coisa.
  - *EN:* Nobody spoke. The Grakh are not a quiet people, and I had never heard a hundred of them make no sound at all. It was the kind of silence that is waiting for something.
- O dia tinha sido comido. Todos tinham ouvido isso cem vezes, da boca dos velhos, com uma risada. Agora estavam em roda em volta de uma mulher morrendo cuja barriga ainda se mexia, e ninguém ria.
  - *EN:* The day had been eaten. They had all heard it said a hundred times, by the old, with a laugh. Now they stood in a ring around a dying woman whose belly was still moving, and nobody was laughing.
- *[se: !!st.f.mostrou_luz]* Shaa achou o meu pulso na areia e o puxou, fraca, para o mesmo lugar onde o tinha puxado na véspera.
  - *EN:* Shaa found my wrist on the sand and pulled it, weakly, to the same place she had pulled it the day before.

### d02
- A parede se abriu, e Hessa passou por ela.
  - *EN:* The wall opened, and Hessa came through it.
- Ela parou a uma lança de distância de mim, a distância de sempre. Então deu o último passo, o que nunca tinha dado, e deixou a maça escorregar das costas para a areia, aos meus pés.
  - *EN:* She stopped a spear’s length from me, the old distance. Then she took the last step, the one she had never taken, and let the mace slide off her back onto the sand at my feet.
- *[se: !st.f.abriu_guarda]* O braço ainda sangrava onde os três homens o tinham achado. Ela não tinha amarrado.
  - *EN:* Her arm was still bleeding where the three men had found it. She had not tied it.
- Era a mão que sempre estivera pousada naquele cabo. Agora, vazia, não sabia o que fazer. Fechou, e abriu.
  - *EN:* It was the hand that had always rested on that haft. Now, empty, it did not know what to do. It closed, and opened.
- *[variável]* — Seja lá o que você for. Seja. Agora.
  - *EN:* — Whatever it is you are. Be it. Now.
- Ela não terminou o que vinha depois disso. A boca ficou aberta em volta das palavras por um instante, e fechou.
  - *EN:* She did not finish whatever came after that. Her mouth stayed open around the words for a moment, and closed.
- Entre os Grakh, o que ela tinha acabado de fazer não tem palavra. Pedir é dívida, e dívida é uma coisa que os Grakh preferem morrer a carregar. Já os vi fazer isso.
  - *EN:* Among the Grakh, what she had just done has no word. Asking is a debt, and a debt is a thing the Grakh would rather die than carry. I have seen them do it.

### d03
- Para fazer o que ela pedia eu teria de pensar. Não os pensamentos pequenos que deixo passar em dia de chuva, mas tudo, de uma vez, do jeito que eu pensava antes, do jeito que fez o meu povo ser visto. E para pensar eu teria de parar de beber.
  - *EN:* To do what she was asking I would have to think. Not the small thoughts I let through on rainy days, but all of it, all at once, the way I used to think, the way that got my people seen. And to think, I would have to stop drinking.
- *[variável]* O odre de vinho de cacto pendia do meu quadril, onde pende há trinta anos. Ainda havia um pouco. Sempre há um pouco.
  - *EN:* The skin of cactus wine hung at my hip, where it has hung for thirty years. There was some left. There is always some left.

**Escolha: O odre:**
- **Derramar na areia.** / Pour it out on the sand.
  - Tirei a tampa, virei o odre e deixei escorrer na areia, como Hessa tinha feito com o que eu lhe oferecera. A areia bebeu mais depressa do que eu jamais bebi.
    - *EN:* I pulled the stopper, turned the skin over and let it run out onto the sand, as Hessa had done with what I offered her. The sand drank it faster than I ever have.
- **Entregar a Hessa.** / Give it to Hessa.
  - Estendi para ela. Ela pegou sem olhar e ficou segurando, do jeito que se segura uma coisa que alguém nos entrega num enterro.
    - *EN:* I held it out to her. She took it without looking at it and stood holding it, the way you hold a thing someone has handed you at a funeral.
- **Um último gole.** / One last swallow. *(se: st.cantil > 0)*
  - Mais um. Pela firmeza da mão, disse a mim mesmo, e a minha mão, que me conhece há muito tempo, também não acreditou.
    - *EN:* One more. For the steadiness of the hand, I told myself, and my hand, which has known me a long time, did not believe it either.

### d04
- Conheço dois tipos de magia. Um é uma cortesia que se pede ao mundo, como pedir ao vizinho que tire a carroça do caminho; o gelo me fez esse favor por cinquenta anos. O outro não pede. É enfiar a mão no pano de que o mundo é tecido e puxar um fio, e cada fio puxado acende você como uma lamparina numa janela, para qualquer coisa que saiba olhar.
  - *EN:* I know two kinds of magic. One is a courtesy you ask of the world, like asking a neighbour to move his cart; the ice did me that favour for fifty years. The other does not ask. It is reaching into the cloth the world is woven from and pulling a thread, and every thread you pull lights you up like a lamp in a window, for anything that knows how to look.
- *[se: (c1(st).gelunah || 0) >= 1]* Pedi ao frio primeiro. Por hábito, por afeto, não sei. Não havia frio a quem pedir. Havia areia por cem léguas em todas as direções, e a areia nunca me fez cortesia nenhuma.
  - *EN:* I asked the cold first. From habit, from affection, I do not know. There was no cold to ask. There was sand for a hundred leagues in every direction, and the sand has never once done me a courtesy.
- *[se: ((st.jogos.ressaca && st.jogos.ressaca.subiram) || []).includes('menina')]* Pensei na menina da febre, e na cura dobrada bem pequena na minha cabeça, onde guardo tudo o que não me é permitido usar.
  - *EN:* I thought of the girl with the fever, and of the cure folded small in my head, where I keep everything I am not allowed to use.
- *[se: !!(c1(st).escolhas && c1(st).escolhas.proibido === 'tocar')]* A mão subiu, a mesma mão, à mesma altura. Desta vez seguiu.
  - *EN:* The hand rose, the same hand, to the same height. This time it kept going.

**Escolha: O que Aheryn vai buscar?**
- **Os dois: a mãe e a cria.** / Both of them: the mother and the child.
  - Dois corações. Um lento e falhando, um rápido e furioso. Eu ia segurar os dois, ou tentar. Fui o melhor do meu povo exatamente nesse tipo de arrogância.
    - *EN:* Two hearts. One slow and failing, one fast and furious. I would hold both, or try. I was the best of my people at exactly this kind of arrogance.
- **Só a cria.** / Only the child.
  - Um coração. O pequeno, o rápido. O de Shaa deixei onde estava, aquietando sozinho, e espero nunca me perguntarem se aquilo foi sabedoria ou aritmética.
    - *EN:* One heart. The small, fast one. Shaa’s I left where it was, going quiet on its own, and I hope never to be asked whether that was wisdom or arithmetic.

### d05 · minijogo: parto
- Ajoelhei na areia com as mãos sobre ela e parei de segurar os pensamentos para baixo.
  - *EN:* I knelt in the sand with my hands on her and stopped holding my thoughts down.

*Depois:*
- A luz subiu por mim como água subindo num poço, toda ela, cada linha ao mesmo tempo, a testa, a garganta, o peito, os braços, até as caras da roda ficarem iluminadas de ouro por baixo e eu poder ver cada uma delas, e cada uma delas poder me ver.
  - *EN:* The light came up through me like water up a well, all of it, every line at once, the forehead, the throat, the chest, the arms, until the faces in the ring were lit gold from below and I could see every one of them, and every one of them could see me.
- *[se: !!c1(st).marcado]* Pelo antebraço onde o bronze tinha fechado, nada passou. A luz deu a volta.
  - *EN:* Through the forearm where the bronze had closed, nothing came. The light went around it.
- — Aqui. A lâmina, aqui. Não mais fundo que o seu polegar.
  - *EN:* — Here. The blade, here. No deeper than your thumb.
- Hessa ajoelhou do outro lado de Shaa com uma faca curta e curva e fez exatamente o que eu disse: a mulher que não bebia da minha mão, recebendo ordens da luz que vigiava havia quinze anos a uma lança de distância.
  - *EN:* Hessa knelt on the other side of Shaa with a short curved knife and did exactly what I told her: the woman who would not drink from my hand, taking orders from the light she had watched for fifteen years from a spear’s length away.

### d06
- Vou contar uma vez, do jeito que foi.
  - *EN:* I will tell it once, as it was.
- Houve um som. Primeiro um estalo, seco e curto, como madeira verde, como cartilagem cedendo. Depois um baque, grave e molhado, de alguma coisa pesada se soltando para dentro de mãos que estavam prontas para ela.
  - *EN:* There was a sound. First a crack, dry and short, like green wood, like cartilage giving way. Then a thud, low and wet, of something heavy coming free into hands that were ready for it.
- Depois, nada. A roda não respirou. A cria nas mãos de Hessa também não respirou, pelo tempo que um coração leva para decidir.
  - *EN:* Then nothing. The ring did not breathe. The child in Hessa’s hands did not breathe either, for as long as it takes a heart to decide.
- Depois respirou.
  - *EN:* Then it did.
- Chorou do jeito que os Grakh choram, ou seja, urrou, pequena e furiosa, para o céu, para o sol que tinha voltado, para todos nós.
  - *EN:* It cried the way the Grakh cry, which is to say it roared, small and furious, at the sky, at the sun that had come back, at all of us.
- *[se: armadilha(st) === 'salvar']* Os olhos estavam abertos, virados para mim, do jeito que aquele da cova me olhou lá na Borda do Mundo. Parece que nunca consegui resistir a isso. É uma fraqueza que vou levar para o túmulo, o que quer dizer que não tão cedo.
  - *EN:* Its eyes were open, and turned on me, the way the one in the pit had looked up at me at the Edge of the World. It seems I have never been able to resist that. It is a weakness I will take to my grave, which is to say nowhere soon.

### d07
- *[variável]* Shaa quase não estava mais ali. Os olhos dela acharam o som antes de achar a cria.
  - *EN:* Shaa was almost gone. Her eyes found the sound before they found the child.
- — Kronk…
  - *EN:* — Kronk…
- Era o som. Era o primeiro som, o que ele fez ao chegar ao mundo, e ela o tinha ouvido, e o devolvia a ele como nome, que é a lei mais antiga que os Grakh têm.
  - *EN:* That was the sound. That was the first sound, the one he made coming into the world, and she had heard it, and she gave it back to him as a name, which is the oldest law the Grakh have.
- Então ela parou de respirar, quieta, sem alarde, do jeito que os Grakh fazem tudo o que não tem remédio.
  - *EN:* Then she stopped breathing, quietly, without any fuss, the way the Grakh do everything that cannot be helped.
- *[se: armadilha(st) === 'frio']* Contei a respiração dela até não haver mais nenhuma, como uma vez contei na beira de uma cova na neve. É a única reza que sei.
  - *EN:* I counted her breaths until there were none, as I once counted at the edge of a pit in the snow. It is the only prayer I know.
- A roda disse o nome. Um por um, baixo, de dentro para fora, do jeito que a água se espalha na areia. Kronk. Kronk. Kronk.
  - *EN:* The ring said the name. One by one, low, from the inside out, the way water spreads in sand. Kronk. Kronk. Kronk.
- E Ghru, junto do meu ombro, sem riso nenhum:
  - *EN:* And Ghru, at my shoulder, with no laugh anywhere in him:
- — Dia ser comido. Maior nascer.
  - *EN:* — Day be eaten. Greatest be born.
- Eu sabia o que tinha comido o dia. Uma pedra no céu passando na frente de um fogo no céu, como faz desde antes de existirem Grakh para dar nome a isso. Eu sabia tudo isso. O que eu não sabia era o que aquilo significava, e eu era o único naquela roda que achava que essas eram duas perguntas diferentes.
  - *EN:* I knew what had eaten the day. A stone in the sky crossing in front of a fire in the sky, as it has done since before there were Grakh to name it. I knew all of that. What I did not know was what it meant, and I was the only one in that circle who thought those were two different questions.

### d08
- Depois a roda se desfez devagar, do jeito que uma multidão deixa um fogo de que não precisa mais. Voltaram para os seus mortos. Hessa foi com a cria.
  - *EN:* Afterwards the ring came apart slowly, the way a crowd leaves a fire it no longer needs. They went back to their dead. Hessa went with the child.
- *[variável]* Sentei na areia e comecei a apagar a luz, uma linha de cada vez, como faço todo dia há oitenta anos. A testa apagou. A garganta apagou. O peito apagou, devagar. Os braços não quiseram.
  - *EN:* I sat in the sand and began to put the light out, one line at a time, as I have done every day for eighty years. The forehead went. The throat went. The chest went, slowly. The arms would not.
- Então, através da areia e para dentro das minhas mãos, de muito longe, veio um ritmo que eu não sentia havia trinta anos. Metal e pedra em chão duro. Um, dois, três. Um, dois, três.
  - *EN:* Then, through the sand and into my hands, from very far away, came a rhythm I had not felt in thirty years. Metal and stone on hard ground. One, two, three. One, two, three.
- Claro. Claro que estavam escutando, todo esse tempo, à espera exatamente disto.
  - *EN:* Of course. Of course they had been listening, all this time, for exactly this.

## PARTE V · O Rastro / The Trail
> Aeth-vorunda, sæl’aeth mor’ilenne. / Aeth-vorunda, sæl’aeth mor’ilenne. — louvor Lúmae, terceiro verso

### e01
- No norte, quando vieram atrás de mim, eu fugi. É o que eu faço. Sou o melhor fugitivo que o meu povo já produziu, e o único que ainda foge.
  - *EN:* In the north, when they came for me, I ran. It is what I do. I am the finest fugitive my people ever produced, and the only one still running.
- Os Tacets seguem a luz. Não importa no acampamento de quem ela esteja. Se eu ficasse, eles entrariam na Pira no compasso de três, e a Pira os receberia com lanças, e bronze não se incomoda muito com lanças.
  - *EN:* The Tacets follow the light. Whose camp it is standing in makes no difference. If I stayed, they would walk into the Pyre in their count of three, and the Pyre would meet them with spears, and bronze does not much mind spears.
- Então eu iria. Desta vez não para longe deles. À frente deles. Aceso.
  - *EN:* So I would go. Not away from them, this time. Ahead of them. Lit.
- *[se: (st.tacetsCedo || 0) >= 1]* Com o tanto que eu tinha arrancado de mim por Shaa e pela cria, eles viriam depressa, e eu teria de levá-los longe.
  - *EN:* With as much as I had pulled out of myself for Shaa and the child, they would be coming fast, and I would have to take them far.

### e02
- Hessa me achou antes que eu terminasse de amarrar os panos. Trazia a cria no ombro, enrolada numa pele, e a mão livre já estava de volta no cabo da maça, onde sempre esteve.
  - *EN:* Hessa found me before I had finished tying the wraps. She carried the child on her shoulder, wrapped in a hide, and her free hand was already back on the haft of the mace, where it has always been.
- — Você vai embora.
  - *EN:* — You are leaving.
- Não era pergunta.
  - *EN:* It was not a question.

**Diálogo · Dizer a Hessa:**
- **“Cuide dele.”** / “Look after him.”
  - Ela olhou para a cria, e para mim, e não disse nada, o que entre os Grakh é uma promessa, porque uma palavra poderia ser quebrada.
    - *EN:* She looked at the child, and at me, and said nothing, which among the Grakh is a promise, because a word could be broken.
- **“Meu nome é Aheryn.”** / “My name is Aheryn.”
  - — Aheryn.
    - *EN:* — Aheryn.
  - Ela disse com cuidado, do jeito que se testa uma tábua antes de pôr o peso nela. Foi a primeira vez em trinta anos que alguém disse esse nome em voz alta, contando comigo.
    - *EN:* She said it carefully, the way you test a plank before you put your weight on it. It was the first time in thirty years anyone had said it aloud, myself included.
- **“O que comeu o dia foi a lua. O sol sempre volta.”** / “What ate the day was the moon. The sun always comes back.”
  - — Então os velhos acertaram e erraram.
    - *EN:* — Then the old ones were right, and wrong.
  - Ela pesou aquilo e guardou em algum lugar, e eu nunca vou saber onde.
    - *EN:* She weighed it and put it away somewhere, and I will never know where.
- **(silêncio)** / 
  - Ela esperou o tempo de um fôlego. Depois virou e voltou para o acampamento, sem olhar para trás, e isso também estava certo.
    - *EN:* She waited the length of a breath. Then she turned and went back toward the camp, without looking back, and that was right too.

**Diálogo · Sobre o Tinido:** *(se: st.escolhas.adeus !== 'cala')*
- — Os cavalos foram você.
  - *EN:* — The horses were you.
- Também não era pergunta, então não respondi.
  - *EN:* That was not a question either, so I did not answer it.
- **“Ele empurrou para baixo a besta que mirava você.”** / “He pushed down the bow that was aimed at you.”
  - — Eu vi.
    - *EN:* — I saw.
  - Ela olhou para o leste, para onde o tinham levado, e por um bom tempo não olhou para mais nada.
    - *EN:* She looked east, where they had carried him, and for a long while she did not look at anything else.
- **“Foi uma boa morte.”** / “It was a good death.”
  - — Não existe morte boa. Existe morte terminada.
    - *EN:* — There are no good deaths. There are deaths that are finished.
- **(silêncio)** / 
  - Ela assentiu uma vez, para ninguém.
    - *EN:* She nodded once, to no one.

### e03 *(só se: st.escolhas.adeus !== 'cala')*
- A cria dormia no ombro dela, se essa é a palavra para uma coisa tão furiosa em repouso. O punho estava fechado numa dobra da pele, muito apertado, como se alguém fosse tentar tirá-la dele.
  - *EN:* The child was asleep on her shoulder, if that is the word for something that furious at rest. His fist was closed on a fold of the hide, very tight, as if somebody might try to take it from him.

**Escolha: Antes de partir:**
- **Tocar o punho dele.** / Touch his fist.
  - Pus um dedo no punho. Ele abriu, fechou em volta do meu dedo e segurou com uma força que envergonharia um homem adulto de Redom. Tirei o dedo de volta. Deu algum trabalho.
    - *EN:* I put one finger on the fist. It opened, closed around my finger, and held on with a strength that would have embarrassed a grown man of Redom. I took my finger back. It took some doing.
- **Não tocar.** / Do not touch him.
  - Não o toquei. As coisas que eu toco têm o costume de ser encontradas.
    - *EN:* I did not touch him. Things I touch have a way of being found.
- **Deixar a pedra na dobra da pele.** / Leave the stone in the fold of the hide. *(se: !!c1(st).pedra)*
  - Tirei a pedra do bolso e a pus na dobra da pele, junto do punho fechado. Naquela luz ela estava cinza. Que seja o mistério de outra pessoa por um tempo.
    - *EN:* I took the stone out of my pocket and put it into the fold of the hide, against the closed fist. In that light it was grey. Let it be someone else’s mystery for a while.

### e04 *(só se: !!c1(st).diario)*
- O diário estava no fundo do embrulho, onde o tinha posto trinta anos antes, na Borda do Mundo. A décima segunda página estava em branco.
  - *EN:* The diary was at the bottom of the bundle, where I had put it thirty years before, at the Edge of the World. The twelfth page was blank.

**Escolha: O diário:**
- **Escrever o dia.** / Write the day down.
  - Escrevi de pé, com a luz ainda nas mãos, o que fazia a tinta parecer ouro:
    - *EN:* I wrote it standing up, with the light still in my hands, which made the ink look like gold:
  - “Décima segunda página. O dia foi comido ao meio-dia e devolvido poucos minutos depois, como os dias costumam ser. Uma criança nasceu no escuro dele e recebeu o nome do seu primeiro som. Vão dizer que o maior chegou. Eu só sei que um coração pequeno batia rápido debaixo das minhas mãos e que deixei que ele fizesse barulho. Parto esta noite. Pela primeira vez, parto antes.”
    - *EN:* “Twelfth page. The day was eaten at noon and given back a few minutes later, as days usually are. A child was born in the dark of it and named for his first sound. They will say the greatest has come. I only know that a small heart beat fast under my hands, and that I let it be loud. I leave tonight. For once, I leave first.”
- **Deixar a página em branco.** / Leave the page blank.
  - Deixei a página em branco. Há dias que não precisam de ajuda para serem lembrados.
    - *EN:* I left the page blank. Some days need no help being remembered.

### e05 · minijogo: rastro
- A noite caiu sobre a Pira de uma vez, do jeito que cai no deserto, sem discutir com ninguém. Atrás de mim acendiam as fogueiras para os mortos. Ao norte, três pontos de bronze pegavam a luz das estrelas e a perdiam de novo, e vinham, no compasso de três.
  - *EN:* Night came down on the Pyre all at once, the way it does in the desert, without discussing it with anyone. Behind me the fires were being lit for the dead. To the north, three points of bronze caught the starlight and lost it again, and came on, in their count of three.

*Depois:*
- Acendi o caminho em silêncio, um ponto de cada vez, como quem deixa migalhas para trás numa floresta que não tem árvores.
  - *EN:* I lit the way in silence, one point at a time, like a man leaving crumbs behind him in a forest with no trees.

### e06
- Caminhei para oeste, areia aberta adentro, aceso da testa à ponta dos dedos, que é a coisa mais tola que uma criatura caçada pode fazer, e raras vezes tive tanta certeza de alguma coisa.
  - *EN:* I walked west into the open sand, lit from forehead to fingertips, which is the most foolish thing a hunted creature can do, and I have rarely been so sure of anything.
- Atrás de mim, o compasso quebrou de três para quatro. Tinham me achado. Era a ideia.
  - *EN:* Behind me, the count broke from three to four. They had found me. That was the idea.
- Passei trinta anos sem fazer um som. Naquela noite, sem ninguém para ouvir além da areia e das coisas que me seguiam, fiz um.
  - *EN:* I had spent thirty years making no sound. That night, with no one to hear it but the sand and the things that were following me, I made one.
- *[se: !!(st.jogos.rastro && st.jogos.rastro.cantou)]* Lá atrás, os tambores dos mortos pararam pelo tempo de um verso, e recomeçaram.
  - *EN:* Far behind me, the drums for the dead stopped for the length of a verse, and started again.
- *[se: !!st.f.estalou]* Em algum lugar atrás de mim, no acampamento, crianças estalavam a língua umas para as outras no escuro. Levei quase uma duna inteira para entender que estavam dizendo o meu nome.
  - *EN:* Somewhere behind me, in the camp, children were clicking their tongues at each other in the dark. It took me most of a dune to understand that they were saying my name.
- *[se: !!st.f.disse_nome]* E em algum lugar atrás de mim, pela primeira vez em trinta anos, alguém sabia o meu nome.
  - *EN:* And somewhere behind me, for the first time in thirty years, someone knew my name.
- *[se: !!st.f.derramou]* Eu não tinha nada para beber. Então pensei. A noite inteira, pensei em voz alta, debaixo da pele, e deixei brilhar.
  - *EN:* I had nothing to drink. So I thought. All night long I thought out loud, under the skin, and let it shine.
- *[se: !!c1(st).marcado]* Só o antebraço onde o bronze tinha fechado ficou escuro, uma faixa de noite num homem aceso, como uma sombra que eu carregasse para alguém.
  - *EN:* Only the forearm the bronze had closed on stayed dark, a strip of night on a lit man, like a shadow I was carrying for someone.
