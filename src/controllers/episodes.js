const axios = require('axios')
const cheerio = require('cheerio')
const xml2js = require('xml2js')
const dateFns = require('date-fns');
class EpisodeController {
    constructor(repository) {
        this.parser = new xml2js.Parser()
        this.repository = repository;
    }
    async getData(el, type) {
        const epData = {};
        epData.title = el.title[0]
        if (el.category) {

            epData.category = el.category[0]
        } else {
            epData.category = ""
        }
        const hasBlocksOnFeed = el.description[0].indexOf("<ul>");
        const hasItunesDescription = el["itunes:summary"];
        
        let description = "";
        if (hasItunesDescription) description = hasItunesDescription[0];
        else if (hasBlocksOnFeed > 0) description = el.description[0].substring(0, hasBlocksOnFeed);
        else description = el.description[0];
        epData.description = description;
        epData.audioUrl = el.enclosure[0]['$'].url;
        const { data } = await axios.get(el.link[0])
        const $ = cheerio.load(data)
        epData.subTitle = $('.entry-sub-title').text()
        epData.imageUrl = $('.wp-post-image').attr('src') ?? "";
        epData.pubDate = new Date(el.pubDate[0]);
        epData.type = type;
        let longDescription = "";
        const longDescriptionData = $('.entry-content').find('p').not('.powerpress_links');
        for (let i = 0; i < longDescriptionData.length; i++) {
            const element = cheerio.load(longDescriptionData[i]);
            longDescription += element.text();
            longDescription += "\n";
        }
        epData.longDescription = longDescription;
        const hasLinks = $('.theiaStickySidebar > #text-html-widget-7 > #text-html-widget-4 > #text-html-widget-5').first();
        if (hasLinks.length > 0) {
            const linksData = hasLinks.find('.widget_text > ul > li > a');
            const links = [];
            linksData.each((index, el) => {
                const element = cheerio.load(el);
                const link = {};
                link.title = element.text();
                link.linkUrl = el.attribs.href;
                links.push(link)
            })
            epData.links = links;
            const hasBlocks = $('.theiaStickySidebar > #text-html-widget-7 > #text-html-widget-4 > #text-html-widget-5 > #text-html-widget-5');
            if (hasBlocks.length > 0) {

                let blocksData = hasBlocks.find('.widget_text > ul > li');
                const blocks = [];
                if (blocksData.length == 0) {
                    blocksData = hasBlocks.find('.widget_text > p');
                    const blocksHtml = blocksData.html();
                    blocksData = blocksHtml.split("<br>");
                    blocksData.forEach((el) => {
                        const element = cheerio.load(el);
                        const block = {};
                        let textData = element.text();
                        const matches = textData.match(/[0-9]+:[0-9]+:[0-9]+/g)
                        if (matches != null) {
                            block.timestamp = matches[0];
    
                            block.title = textData.replace(block.timestamp, "").replace(": ", "").replace("-", "").trim();
                            blocks.push(block)
                        }
    
                    })
                } else {
                    blocksData.each((index, el) => {
                        const element = cheerio.load(el);
                        const block = {};
                        let textData = element.text();
                        const matches = textData.match(/[0-9]+:[0-9]+:[0-9]+/g)
                        if (matches != null) {
                            block.timestamp = matches[0];
    
                            block.title = textData.replace(block.timestamp, "").replace(": ", "").replace("-", "").trim();
                            blocks.push(block)
                        }
    
                    })
                }
                
                epData.blocks = blocks;

            }
        } else {
            let hasBlocks = $('.theiaStickySidebar > #text-html-widget-7 > #text-html-widget-5 > #text-html-widget-5');
            if (hasBlocks.length > 0) {
                let blocksData = hasBlocks.find('.widget_text > ul > li');
                const blocks = [];
                if (blocksData.length == 0) {
                    blocksData = hasBlocks.find('.widget_text > p');
                    const blocksHtml = blocksData.html();
                    blocksData = blocksHtml.split("<br>");
                    blocksData.forEach((el) => {
                        const element = cheerio.load(el);
                        const block = {};
                        let textData = element.text();
                        const matches = textData.match(/[0-9]+:[0-9]+:[0-9]+/g)
                        if (matches != null) {
                            block.timestamp = matches[0];
    
                            block.title = textData.replace(block.timestamp, "").replace(": ", "").replace("-", "").trim();
                            blocks.push(block)
                        }
    
                    })
                } else {
                    blocksData.each((index, el) => {
                        const element = cheerio.load(el);
                        const block = {};
                        let textData = element.text();
                        const matches = textData.match(/[0-9]+:[0-9]+:[0-9]+/g)
                        if (matches != null) {
                            block.timestamp = matches[0];
    
                            block.title = textData.replace(block.timestamp, "").replace(": ", "").replace("-", "").trim();
                            blocks.push(block)
                        }
    
                    })
                }
                epData.blocks = blocks;
            }
        }


        return epData
    }
    async getEpisodes(type, after) {
        try {
            const cachedGames = [
              {
                title: "Vértice #400: IV Centenário",
                category: "Vértice",
                description:
                  "Celebramos 400 episódios do Vértice respondendo perguntas, trazendo os lados bons e ruins da trilogia Fable, memórias e sentimentos com Secret of Mana, o gato-pássaro mais real de The Last Guardian e o prazer da descoberta em Dungeon Crawlers.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/3c685e211bc0592bd3269643b6c71af7.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/11/v400c.jpg",
                pubDate: "09/11/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli comemoram os 400 episódios do Vértice fazendo algo levemente diferente. Em vez de falar de notícias e lançamentos respondemos inúmeras perguntas dos ouvintes e falamos de alguns jogos que nos marcaram.\nFalamos sobre os lados bons e ruins da trilogia Fable, sobre memórias e sentimentos com Secret of Mana, sobre o gato-pássaro mais real do mundo em The Last Guardian e sobre o prazer da descoberta e da exploração em Dungeon Crawlers.\n",
                links: [
                  {
                    title: "Apoie o Jogabilidade no Orelo",
                    linkUrl: "https://orelo.cc/jogabilidade",
                  },
                ],
                blocks: [
                  {
                    timestamp: "00:07:26",
                    title: "Anúncios e mudanças no Jogabilidade",
                  },
                  {
                    timestamp: "00:27:14",
                    title: "Trilogia Fable",
                  },
                  {
                    timestamp: "01:02:08",
                    title: "Secret of Mana",
                  },
                  {
                    timestamp: "01:19:09",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:59:29",
                    title: "The Last Guadian",
                  },
                  {
                    timestamp: "02:15:14",
                    title: "Dungeon Crawlers",
                  },
                ],
              },
              {
                title:
                  "Vértice #399: Alan Wake 2, Nintendo Split Vem Aí, Xbox Series S mais caro e mais!",
                category: "Vértice",
                description:
                  "A profecia do Nintendo Split se aproxima da realidade, o louco aumento do preço do Xbox Series S, os gráficos realistas de Metal Gear Solid Δ, Alan Wake 2 supera todas as expectativas e Marvel's Spider-Man 2 se balança em alta velocidade.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/85126bc92273310427c927efe16c9c5a.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/11/v399.jpg",
                pubDate: "01/11/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli conversam sobre a profecia do Nintendo Split se aproximando da realidade, o louco aumento do preço do Xbox Series S no Brasil, os gráficos realistas de Metal Gear Solid Δ e mais!\nNos jogos, Alan Wake 2 supera todas as expectativas e Marvel’s Spider-Man 2 se balança em alta velocidade.\n",
                blocks: [
                  {
                    timestamp: "00:11:14",
                    title: "Nova patente da Nintendo lembra o “Nintendo Split”",
                  },
                  {
                    timestamp: "00:26:22",
                    title:
                      "Xbox Series S tem grande aumento de preço no Brasil",
                  },
                  {
                    timestamp: "00:36:23",
                    title: "Xbox Partner Preview",
                  },
                  {
                    timestamp: "00:54:11",
                    title: "Possíveis novo jogos de Metal Gear em coletâneas",
                  },
                  {
                    timestamp: "00:57:34",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:07:29",
                    title: "Jogo: Alan Wake 2",
                  },
                  {
                    timestamp: "01:56:20",
                    title:
                      "Novo Playstation 5 necessita de conexão com internet para o leitor de disco",
                  },
                  {
                    timestamp: "02:00:45",
                    title: "Xbox banirá acessórios de terceiros",
                  },
                  {
                    timestamp: "02:04:19",
                    title:
                      "Nintendo restringe torneios de Smash Bros. da comunidade",
                  },
                  {
                    timestamp: "02:09:02",
                    title: "Bundle de caridade para assistência médica de Gaza",
                  },
                  {
                    timestamp: "02:11:31",
                    title: "Finalmentes: Marvel’s SpiderMan 2",
                  },
                ],
              },
              {
                title:
                  "Vértice #398: Super Mario Wonder, Spider-Man 2, King Kong e mais!",
                category: "Vértice",
                description:
                  "Rasgamos seda pro fenomenal Super Mario Bros. Wonder, pras maravilhas técnicas de Marvel's Spider-Man 2, pro level design de Lords of the Fallen e mais!",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/60b4c2d8737cf4877edd1974cbe3c7ee.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/v398c.jpg",
                pubDate: "26/10/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, e Rafael Quina recebem Pelucks e conversam sobre a demissões na Playstation Visual Arts, as condições que geraram Skull Island: Rise of Kong e o primeiro cachorro speedrunner.\nAlém disso, rasgamos seda pro fenomenal Super Mario Bros. Wonder, pras maravilhas técnicas de Marvel’s Spider-Man 2 e pro level design de Lords of the Fallen e seus patchs.\n",
                blocks: [
                  {
                    timestamp: "00:18:40",
                    title: "Demissões na Playstation Visual Arts e Zen Studios",
                  },
                  {
                    timestamp: "00:22:47",
                    title: "Saída de Connie Booth da Playstation",
                  },
                  {
                    timestamp: "00:25:52",
                    title:
                      "Kojima não é citado nos novos créditos da coletânea de MGS",
                  },
                  {
                    timestamp: "00:31:12",
                    title:
                      "Skull Island: Rise of Kong vem pra competir com Gollum",
                  },
                  {
                    timestamp: "00:38:09",
                    title: "Cachorro fará speedrun no próximo Games Done Quick",
                  },
                  {
                    timestamp: "00:45:48",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:04:30",
                    title: "Jogo 1: Super Mario Bros. Wonder",
                  },
                  {
                    timestamp: "01:49:07",
                    title: "Jogo 2: Marvel’s SpiderMan 2",
                  },
                  {
                    timestamp: "02:35:55",
                    title: "Finalmente: Lords of the Fallen",
                  },
                ],
              },
              {
                title: "DASH #149: Red Dead Redemption 2",
                category: "DASH",
                description:
                  "Junto de dois novos membros da gangue Van der Linde, Caio Corraini e Guilherme Dias, cavalgamos de West Elizabeth à Lemoyne enquanto conversamos sobre as origens, o mundo, a história, o design e os personagens de Red Dead Redemption 2.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/badb38f9783cb3ae86333943dda4991c.mp3",
                subTitle: "Tenha um pouco de fé!",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/dash149c.jpg",
                pubDate: "24/10/2023",
                type: "games",
                longDescription:
                  "Já fazem cinco anos desde seu lançamento e ainda não há sinal de surgir outro jogo parecido.\nÉ por isso que André Campos se junta com dois novos membros da Gangue Van der Linde: Caio Corraini e Guilherme Dias, e enquanto viajam de West Elizabeth à Lemoyne, conversam sobre as origens, o mundo, a história, o design e os personagens de Red Dead Redemption 2.\nNessa jornada, nos familiarizamos com Arthur Morgan e vinte e tantos outros membros dessa gangue que, num mundo que não tem mais lugar para foras-da-lei, é lenta e dolorosamente esmagada pelo peso da civilização.\nO que, ou quem, dá pra salvar nesse processo? Será que Dutch tinha um plano? Quem é o pai de Jack? Qual o mistério por trás do estranho homem de cartola? E afinal, é possível constuir uma casa na presença de um puma?\n",
                links: [
                  {
                    title: "Review de Red Dead Redemption 2",
                    linkUrl: "https://www.youtube.com/watch?v=ALkMawcMxfg",
                  },
                  {
                    title: "O Melhor Vídeo já Feito",
                    linkUrl: "https://www.youtube.com/watch?v=Brp5iwZoCoc",
                  },
                ],
              },
              {
                title:
                  "Vértice #397: Lords of the Fallen, BGS 2023, Compra da Activision Finalizada, PS5 Slim e mais!",
                category: "Vértice",
                description:
                  "Falamos do que jogamos e vimos na BGS 2023, o fim da saga da compra da Activision, o anúncio do PlayStation 5 slim, primeiras impressões de Lords of the Fallen e o shmup brasileiro Esquadrão 51 Contra os Discos Voadores!",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/c4e0af03c37b1ed7d4087ed4ca716035.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/v397c.jpg",
                pubDate: "18/10/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, e Rafael Quina falam de suas visitas à BGS 2023 e os jogos que jogaram lá, o fim da saga da compra da Activision pela Microsoft, o anúncio de uma versão slim do PlayStation 5 e alguns rumores.\nAlém disso, damos nossas primeiras impressões do certamente único jogo chamado Lords of The Fallen e exaltamos o shmup brasileiro Esquadrão 51 Contra os Discos Voadores.\n",
                blocks: [
                  {
                    timestamp: "00:11:18",
                    title: "Brasil Game Show 2023",
                  },
                  {
                    timestamp: "00:54:24",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:09:13",
                    title: "Jogo: Lords of the Fallen",
                  },
                  {
                    timestamp: "01:51:38",
                    title:
                      "Compra da Activision Blizzard King pela Microsofrt é finalizada",
                  },
                  {
                    timestamp: "02:05:43",
                    title: "Pete Hines deixa Bethesda",
                  },
                  {
                    timestamp: "02:08:06",
                    title: "Playstation 5 Slim é anunciado",
                  },
                  {
                    timestamp: "02:19:40",
                    title: "Rumores sobre DLC de Lies of P e Elden Ring",
                  },
                  {
                    timestamp: "02:26:02",
                    title:
                      "Finalmentes: Armored Core VI: Fires of Rubicon vende 2.8 milhões de unidades",
                  },
                  {
                    timestamp: "02:26:40",
                    title:
                      "Finalmentes: Esquadrão 51 Contra os Discos Voadores",
                  },
                  {
                    timestamp: "02:34:18",
                    title: "Finalmentes: McCrispy Chicken Elite",
                  },
                  {
                    timestamp: "02:36:04",
                    title: "Finalmentes: pamonha de Romeu e Julieta",
                  },
                ],
              },
              {
                title:
                  "Vértice #396: Cocoon, Baldur’s Gate III, Demissões, Rumores e mais!",
                category: "Vértice",
                description:
                  "As infindáveis ondas de demissões de 2023, rumores e vazamentos da Naughty Dog, Persona 3 Reload em PT-BR, impressões iniciais de Assassin's Creed: Mirage, finais de Coccoon e intermediárias de Baldur's Gate III.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/efa8987d2845b303c361a6f725e2643e.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/v396c.jpg",
                pubDate: "11/10/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, e Rafael Quina discutem as infindáveis ondas de demissões que tem acorrido ao longo de 2023, o súbito fim da carreira de John Riccitiello na Unity, rumores e vazamentos sobre o futuro da Naughty Dog, Persona 3 Reload vindo em português e mais!\nAlém disso, damos algumas impressões iniciais de Assassin’s Creed: Mirage, impressões finais de Coccoon e intermediárias de Baldur’s Gate III.\n",
                blocks: [
                  {
                    timestamp: "00:07:22",
                    title: "CEO da Unity deixa empresa",
                  },
                  {
                    timestamp: "00:12:57",
                    title:
                      "Muitas demissões no meio dos vídeo games\n00:30:06: Telltale Games e Naughty Dog também demitem diversos funcionários",
                  },
                  {
                    timestamp: "00:40:11",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "00:50:13",
                    title: "Jogo 1: Assassin’s Creed Mirage",
                  },
                  {
                    timestamp: "01:00:22",
                    title: "Jogo 2: COCOON",
                  },
                  {
                    timestamp: "01:16:19",
                    title: "Rumores da Naughty Dog",
                  },
                  {
                    timestamp: "01:25:46",
                    title: "Rumores sobre novo God of War",
                  },
                  {
                    timestamp: "01:30:11",
                    title: "Persona 3 Reload virá em português do Brasil",
                  },
                  {
                    timestamp: "01:38:07",
                    title: "Executivos da Ubisoft presos",
                  },
                  {
                    timestamp: "01:41:53",
                    title: "Finalmentes: Baldur’s Gate 3",
                  },
                ],
              },
              {
                title:
                  "Vértice #395: Lies of P, Chants of Sennaar, Demissões, adeus Jim Ryan e mais!",
                category: "Vértice",
                description:
                  "Neste episódio, as demissões na Epic Games, o adeus ao Jim Ryan, o caos de Pokémon no Museu do Van Gogh, mais impressões de Lies of P, Chants of Sennaar e Infinity Strash: Dragon Quest.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/0d32725b0488a6b562aa0ba14e19e584.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/v395.jpg",
                pubDate: "04/10/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli discutem a grande leva de demissões que passou pela Epic Games, Team 17 e Creative Assembly. Também comentamos a aposentadoria do Jim Ryan, o caos de Pokémon no Museu do Van Gogh e a retirada dos FIFAs da lojas digitais.\nAlém disso, falamos mais de nossas experiênicas pinóquicas em Lies of P, do único Chants of Sennaar e o triste Infinity Strash: Dragon Quest.\n",
                blocks: [
                  {
                    timestamp: "00:08:13",
                    title: "Epic Games demite 16% de sua força de trabalho",
                  },
                  {
                    timestamp: "00:24:43",
                    title: "Hyenas é cancelado pela Sega",
                  },
                  {
                    timestamp: "00:32:47",
                    title: "Team17 passa por reestruturação",
                  },
                  {
                    timestamp: "00:38:41",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "00:49:32",
                    title: "Jogo 1: Lies of P",
                  },
                  {
                    timestamp: "01:38:14",
                    title: "Jogo 2: Chants of Sennaar",
                  },
                  {
                    timestamp: "01:49:53",
                    title: "Jogos FIFA mudam de nome e saem das lojas digitais",
                  },
                  {
                    timestamp: "01:58:49",
                    title: "Pokémon, Van Gogh e Scalpers",
                  },
                  {
                    timestamp: "02:08:19",
                    title: "Jim Ryan deixa cargo de CEO da Sony",
                  },
                  {
                    timestamp: "02:31:28",
                    title:
                      "Finalmentes: Infinity Strash: DRAGON QUEST The Adventure of Dai",
                  },
                ],
              },
              {
                title:
                  "Vértice #394: Vazamentos do Xbox, Dragon’s Dogma II, RE4: Separate Ways e mais!",
                category: "Vértice",
                description:
                  "O vazamento do Xbox, o progresso do Marco Legal dos Games, atualizações da Unity, o gameplay de Dragon's Dogma II, o DLC de Resident Evil 4, Separate Ways e mais!",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/cdcc0c21eb2f0a6381498e6ca698f441.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/09/v394c.jpg",
                pubDate: "29/09/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi e Rafael Quina discutem o imenso vazamento do Xbox, o progresso do Marco Legal dos Games, Hideki Kamiya deixando a Platinum, e a Unity voltando atrás em algumas decisões!\nAlém disso, damos impressões sobre a gameplay de Dragon’s Dogma II mostrada na Tokyo Game Show, e também sobre Separate Ways, o DLC de Resident Evil 4.\n\n",
                links: [
                  {
                    title:
                      "Quer ganhar um PlayStation 5? Inscreva-se e participe!",
                    linkUrl: "https://promoby.me/Jogablidade_Promobit_Sorteio",
                  },
                ],
                blocks: [
                  {
                    timestamp: "00:11:33",
                    title:
                      "Compra da Activision Blizzard pela Microsoft deve acabar até dia 18/10",
                  },
                  {
                    timestamp: "00:15:00",
                    title:
                      "Vazamento imenso sobre planos para futuro da Microsoft",
                  },
                  {
                    timestamp: "00:48:27",
                    title: "Phil Spencer sobre comprar a Nintendo",
                  },
                  {
                    timestamp: "00:55:29",
                    title: "Planos de futuros jogos da ZeniMax vazados",
                  },
                  {
                    timestamp: "01:02:31",
                    title: "Tabelas de jogos estimados para o Game Pass",
                  },
                  {
                    timestamp: "01:11:20",
                    title: "Tokyo Game Show 2023 e Dragon’s Dogma 2",
                  },
                  {
                    timestamp: "01:21:16",
                    title: "Sony foi hackeada",
                  },
                  {
                    timestamp: "01:24:15",
                    title: "Greve nos vídeo games foi aprovada",
                  },
                  {
                    timestamp: "01:26:22",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:37:28",
                    title:
                      "Marco Legal dos Games cooptado por interesses externos",
                  },
                  {
                    timestamp: "02:00:11",
                    title: "Hideki Kamiya deixa PlatinumGames",
                  },
                  {
                    timestamp: "02:09:09",
                    title: "Unity recua em suas mudanças",
                  },
                  {
                    timestamp: "02:23:55",
                    title: "Finalmentes: Resident Evil 4 – Caminhos Distintos",
                  },
                  {
                    timestamp: "02:35:47",
                    title: "Finalmentes: Lies of P",
                  },
                ],
              },
              {
                title:
                  "Vértice #393: Unity, Lies of P, Nintendo Direct, State of Play",
                category: "Vértice",
                description:
                  "Nesse episódio, recebemos Tiani Pixel para discutir as novas políticas de cobranças da Unity, damos primeiras impressões sobre Lies of P e comentamos alguns anúncios do Nintendo Direct e State of Play.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/396de6db93bf5f5f0a78706c369b79b0.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/09/v393c.jpg",
                pubDate: "20/09/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi e Rafael Quina discutem as novas políticas de cobranças da Unity e recebem Tiani Pixel para explicar seus impactos e como podem afetar desenvolvedores e a indústria.\nAlém disso, compartilhamos impressões inciais do pinóquio-souls, Lies of P, e comentamos alguns anúncios que rolaram nas recentes Nintendo Direct e State of Play.\n",
                blocks: [
                  {
                    timestamp: "00:04:57",
                    title:
                      "Unity muda sua política de taxa para desenvolvedores",
                  },
                  {
                    timestamp: "01:11:40",
                    title: "Jogo: Lies of P",
                  },
                  {
                    timestamp: "01:38:25",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "01:47:19",
                    title: "Novo IPhone rodando jogos pesados",
                  },
                  {
                    timestamp: "01:52:38",
                    title:
                      "Anunciado remake de Wizardry: Proving Grounds of the Mad Overlord",
                  },
                  {
                    timestamp: "01:58:40",
                    title: "Nintendo Direct 14/09",
                  },
                  {
                    timestamp: "02:19:56",
                    title: "State of Play 14/09",
                  },
                ],
              },
              {
                title:
                  "Vértice #392: Shadow Gambit, Starfield, FF7: Ever Crisis, Switch 2 e mais!",
                category: "Vértice",
                description:
                  "Recebemos o mago Ricardo Regis pra comentar os rumores do próximo console da Nintendo e de um novo F-Zero, além de navegarmos mais na imensidão de Starfield, nos mares de Shadow Gambit e no mundo do gacha de FF7: Ever Crisis.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/c2d3ac7a25df2690308a409e772b14b1.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/09/v392.jpg",
                pubDate: "13/09/2023",
                type: "games",
                longDescription:
                  "Essa semana André Campos, Eduardo Sushi e Rafael Quina recebem o mago Ricardo Regis pra comentar os rumores do próximo console da Nintendo, um possível novo F-Zero, a situação precária onde se encontram a Gearbox, a E3 e mais!\nAlém disso, navegamos ainda mais na imensidão de Starfield, nos mares fantásticos de Shadow Gambit: The Cursed Crew e no mundo do gacha com Final Fantasy VII: Ever Crisis.\n",
                blocks: [
                  {
                    timestamp: "00:16:32",
                    title: "Novos rumores sobre o sucessor do Nintendo Switch",
                  },
                  {
                    timestamp: "00:24:06",
                    title: "Possível retorno de FZero",
                  },
                  {
                    timestamp: "00:28:33",
                    title: "Zeda: Tears of the Kingdom não terá DLCs",
                  },
                  {
                    timestamp: "00:37:31",
                    title:
                      "Mimimi Games vai fechar e Shadow Gambit: The Cursed Crew",
                  },
                  {
                    timestamp: "01:14:58",
                    title: "Jogo: Starfield",
                  },
                  {
                    timestamp: "02:08:23",
                    title: "Perguntas dos ouvintes",
                  },
                  {
                    timestamp: "02:15:08",
                    title: "Modder cobra por DLSS em Starfield",
                  },
                  {
                    timestamp: "02:23:16",
                    title:
                      "Youtuber é preso por gameplay de Steins;Gate: My Darling’s Embrace",
                  },
                  {
                    timestamp: "02:27:55",
                    title: "Embracer Group está vendendo a Gearbox Software",
                  },
                  {
                    timestamp: "02:34:41",
                    title: "E3 não tem mais organizadores",
                  },
                  {
                    timestamp: "02:39:47",
                    title: "Finalmentes: Final Fantasy VII: Ever Crisis",
                  },
                  {
                    timestamp: "02:48:05",
                    title: "Finalmentes: Sea of Stars",
                  },
                ],
              },
            ];
            const cachedNonGames = [
              {
                title:
                  "Re:JACK by Crunchyroll #17: Mobile Suit Gundam – The Witch from Mercury",
                category: "JACK",
                description:
                  "Rumamos ao espaço para duelar no mais novo integrante da mais famosa série de robô gigante de todos os tempos. Nessa história, acompanhamos as trajetórias de Suletta Mecury e Miorine Rembran num mundo onde Gundams são proibidos.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42739/83f2c8cc33aa82e568e6e0b44e85ed84.mp3",
                subTitle: "Se recua ganha um, se avança ganha dois!",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/10/rejack_gwitch.jpg",
                pubDate: "16/10/2023",
                type: "non-games",
                longDescription:
                  "Rumo ao espaço, é hora de mais um episódio do Re:JACK by Crunchyroll!\nOs nobres André Campos, Eduardo Sushi, Rafael Quina e Fernando Tengu, da casa Jogabilidade na Escola Asticassia, já estão prontos para pilotar seus mobile suits e duelar no mais novo integrante da mais famosa série de robô gigante de todos os tempos: Mobile Suit Gundam – The Witch from Mercury.\nNessa história independente, acompanhamos as trajetórias acadêmicas, empreendedoras e amorosas de Suletta Mecury e Miorine Rembran, enquanto navegam pela politicagem do Grupo Benerit, num mundo onde Gundams são proibidos.\nLembrando que o Re:JACK é como um clube do livro mensal e no próximo, e último programa dessa temporada, voltaremos a não ter nenhum inimigo na segunda temporada de Vinland Saga.\n\n",
                links: [
                  {
                    title: "14 Dias Grátis de Crunchyroll",
                    linkUrl: "https://got.cr/podcast-jogabilidade",
                  },
                  {
                    title: "Miorine Cacatua",
                    linkUrl:
                      "https://cdn.donmai.us/original/f3/5d/f35d7b426418c3c68ea7e9bf65b00586.jpg",
                  },
                ],
              },
              {
                title: "Fora da Caixa #145: One Piece, Curitiba, Maceió",
                category: "Fora da Caixa",
                description:
                  "Nessa semana saímos da caixa e de casa, falando sobre viagens à Curitiba e Maceió. Além de discutirem a tão aguardada série live action de One Piece.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/ccce7e2b2067d6278405ea77e93f8830.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/09/fdc145.jpg",
                pubDate: "19/09/2023",
                type: "non-games",
                longDescription:
                  "Enfim chegou a hora que além de sair da caixa nós saímos de casa!\nEssa semana André Campos, Eduardo Sushi e Rafael Quina falam sobre viagens à Curitiba e Maceió. Além de discutirem a tão aguardada série live action de One Piece.\n",
                blocks: [
                  {
                    timestamp: "00:05:43",
                    title: "– Sushi em Curitiba",
                  },
                  {
                    timestamp: "00:44:31",
                    title: "– Rafa em Maceió",
                  },
                  {
                    timestamp: "00:56:36",
                    title: "– One Piece Live Action",
                  },
                ],
              },
              {
                title:
                  "Re:JACK by Crunchyroll #16: Jujutsu Kaisen (Temp. 1 + Filme)",
                category: "JACK",
                description:
                  "Lutas hype, personagens interessantes, estrutura esquisita, um caldeirão de todas as suas influências... Nesse episódio do Re:JACK voltamos a beber o mais puro suco do Shonen de lutinha com a primeira temporada e filme de Jujutsu Kaisen.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/23d740d2beccf0ff4d5ae9460608b6af.mp3",
                subTitle: "Amaldiçoado esteja!",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/09/rejack_jujutsu.jpg",
                pubDate: "07/09/2023",
                type: "non-games",
                longDescription:
                  "Sejam bem vindos à mais um semestre na Escola Secundária de Jujutsu da Prefeitura de Tokyo.\nNossos alunos recém matriculados (e lordes) se juntam para mais uma vez beber o mais puro suco do Shonen de lutinha enquanto discutem a primeira temporada da adaptação da obra de Gege Akutami, Jujutsu Kaisen. E, para ficarmos prontos para a segunda, também falamos sobre o filme Jujutsu Kaisen 0.\nLutas hype, personagens interessantes, estrutura esquisita, um caldeirão de todas as suas influências… Como definir essa aventura de Itadori Yuuji, Gojo Satoru e seus amigos? E afinal, será que temos Hunter x Hunter em casa?\nLembrando que o Re:JACK é como um clube do livro mensal e no próximo programa desbravaremos o espaço e retornaremos aos nossos mechas com Mobile Suit Gundam: The Witch from Mercury.\n\n",
                links: [
                  {
                    title: "14 Dias Grátis de Crunchyroll",
                    linkUrl: "https://got.cr/podcast-jogabilidade",
                  },
                ],
              },
              {
                title:
                  "Fora da Caixa #144: Barbie, Oppenheimer, Shin Kamen Rider, Silo e mais!",
                category: "Fora da Caixa",
                description:
                  "Recebemos a convidada Márcia Effect e compartilhamos como foi viver o momento Barbenheimer e nossas impressões sobre os filmes. Também discutimos as voadoras e sobretudos de Shin Kamen Rider, os mistérios da série Silo e mais!",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/1f959ebfcdc46dd64f87d97a449656a5.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/08/fdc144c.jpg",
                pubDate: "08/08/2023",
                type: "non-games",
                longDescription:
                  "Nós agora somos a morte, os destruidores das caixas. \nEssa semana André Campos, Rafael Quina e Fernando Mucioli recebem a convidada Márcia Effect e compartilham como foi viver o momento Barbenheimer e suas impressões sobre os filmes.\nTambém discutem as voadoras e sobretudos de Shin Kamen Rider, os mistérios da série Silo e mais!\n",
                blocks: [
                  {
                    timestamp: "00:03:35",
                    title: "– Barbenheimer",
                  },
                  {
                    timestamp: "00:58:17",
                    title: "– Shin Kamen Rider",
                  },
                  {
                    timestamp: "01:14:07",
                    title: "– Silo",
                  },
                  {
                    timestamp: "01:24:28",
                    title: "– Calls e outras aleatoriedades",
                  },
                ],
              },
              {
                title:
                  "Re:JACK by Crunchyroll #15: Hunter X Hunter (Eleição Presidencial)",
                category: "JACK",
                description:
                  "Nossos caçadores votantes reúnem-se para encerrar o anime de Hunter X Hunter discutindo esse último arco cheio de politicagem, poderes estranhos e regras complexas: a Eleição do Presidente Hunter.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/8fc22984d7121e28ed92bef6a7151d58.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/07/rejack15-hxh.jpg",
                pubDate: "31/07/2023",
                type: "non-games",
                longDescription:
                  "As votações foram encerradas e, com a maioria dos votos, está decretado o começo de mais um episódio do Re:JACK by Crunchyroll!\nDessa vez, os caçadores André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli reúnem-se para encerrar o anime de Hunter X Hunter discutindo o último arco: a Eleição do Presidente Hunter.\nEnquanto a politicagem corre solta na associação, Killua terá que lidar com sua complicada família para poder cumprir a promessa de salvar Gon e navegar os incríveis poderes, complexas regras e estranhos pedidos de sua irmã Alluka.\nLembrando que o Re:JACK é como um clube do livro mensal e no próximo programa embarcaremos na primeira temporada e filme de Jujutsu Kaisen. Então não deixe de assistir para acompanhar conosco!\n\n",
                links: [
                  {
                    title: "14 Dias Grátis de Crunchyroll",
                    linkUrl: "https://got.cr/podcast-jogabilidade",
                  },
                ],
              },
              {
                title:
                  "Fora da Caixa #143: Nimona, Infinity Pool, Black Mirror, Não-monogamia",
                category: "Fora da Caixa",
                description:
                  "Conversamos sobre o desconfortável e peculiar Infinity Pool, o belíssimo Nimona, a surpreendentemente legal nova temporada de Black Mirror, além de um papo sobre não-monogamia.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/5727d4288be51c52e63d32d383b21195.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/07/fdc143c.jpg",
                pubDate: "14/07/2023",
                type: "non-games",
                longDescription:
                  "Quando achamos que saimos da caixa você descobre que a caixa é só uma parte de uma caixa maior. \nEssa semana Eduardo Sushi, Rafael Quina e Fernando Mucioli conversam sobre um pouco de tudo: o desconfortável e peculiar Infinity Pool, o belíssimo Nimona, a surpreendentemente legal nova temporada de Black Mirror, além de um papo sobre não-monogamia.\n",
                blocks: [
                  {
                    timestamp: "00:04:07",
                    title: "– Nimona",
                  },
                  {
                    timestamp: "00:18:53",
                    title: "– Infinity Pool",
                  },
                  {
                    timestamp: "00:34:23",
                    title: "– Poliamor",
                  },
                  {
                    timestamp: "01:06:47",
                    title: "– Black Mirror Temporada 6",
                  },
                ],
              },
              {
                title: "Re:JACK by Crunchyroll #14: Vinland Saga (Temporada 1)",
                category: "JACK",
                description:
                  "Nesse episódio, navegamos pelos mares gelados do norte em busca de terras mais quentes e férteis numa discussão sobre a natureza da violência na primeira temporada de Vinland Saga.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/ef29dfe5296bf2f25f8a401410a35fe5.mp3",
                subTitle: "Um verdadeiro guerreiro não precisa de uma espada!",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/07/rejack13-vinlandsaga.jpg",
                pubDate: "05/07/2023",
                type: "non-games",
                longDescription:
                  "Saiba que você não tem inimigos, especialmente quando o Re:JACK by Crunchyroll está ao seu lado!\nEm mais um episódio, André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli navegam pelos mares gelados do norte em busca de terras mais quentes e férteis numa discussão sobre a natureza da violência na primeira temporada de Vinland Saga.\nEntramos de gaiato junto com Thorfinn em um navio viking para acompanhar sua jornada de vingança e sua complexa relação com Askeladd num anime que confunde e emociona em partes iguais.\nLembrando que o Re:JACK é como um clube do livro mensal e no próximo programa encerraremos Hunter x Hunter (2011) discutindo o Arco da Eleição. Então não deixe de assistir para acompanhar conosco!\n\n",
                links: [
                  {
                    title: "14 Dias Grátis de Crunchyroll",
                    linkUrl: "https://got.cr/podcast-jogabilidade",
                  },
                ],
              },
              {
                title:
                  "Fora da Caixa #142: Homem-Aranha, Barry, Akane-Banashi e mais!",
                category: "Fora da Caixa",
                description:
                  "Conversamos sobre o desconfortável e peculiar Sacrifício do Cervo Sagrado, o surpreendente Barry, o quentinho Akane-Banashi, a maravilha live action de Os Cavaleiros do Zodíaco e o incrível Homem-Aranha: Através do Aranhaverso.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/8aa79b7bb3218329376c5cf43b9a3bd7.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/06/fdc142c.jpg",
                pubDate: "27/06/2023",
                type: "non-games",
                longDescription:
                  "Apesar da estranheza e desconforto nós nos encontramos fora da caixa. \nEssa semana André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli conversam sobre um pouco de tudo: o desconfortável e peculiar Sacrifício do Cervo Sagrado, o surpreendente Barry, o quentinho Akane-Banashi, a maravilha live action de Os Cavaleiros do Zodíaco e o incrível Homem-Aranha: Através do Aranhaverso.\n",
                blocks: [
                  {
                    timestamp: "00:03:50",
                    title: "– O Sacrifício do Cervo Sagrado",
                  },
                  {
                    timestamp: "00:23:36",
                    title: "– Barry",
                  },
                  {
                    timestamp: "00:44:03",
                    title: "– Akane Banashi",
                  },
                  {
                    timestamp: "00:57:23",
                    title: "– Os Cavaleiros Do Zodíaco – Saint SeiyaO Começo",
                  },
                  {
                    timestamp: "1:12:33",
                    title: "– SpidermanAcross The Spider-verse",
                  },
                ],
              },
              {
                title:
                  "Fora da Caixa #141: Evil Dead Rise, Oshi no Ko, Inception e Tokusatsu Indie",
                category: "Fora da Caixa",
                description:
                  "Essa semana conversamos sobre um pouco de tudo: tem o tenso Evil Dead Rise; o desconcertante Oshi no Ko; o felicidade de fazer um piquenique; como é revisitar Inception e também sobre o cenário indie de tokusatsu.",
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/bf434dc996d06498928cfb5b211d403f.mp3",
                subTitle: "",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/05/fdc141c.jpg",
                pubDate: "23/05/2023",
                type: "non-games",
                longDescription:
                  "Quando enfim saímos da caixa percebemos que ainda estávamos dentro da caixa. \nEssa semana André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli conversam sobre um pouco de tudo: tem o tenso Evil Dead Rise; o desconcertante Oshi no Ko; o felicidade de fazer um piquenique; como é revisitar Inception e também sobre o cenário indie de tokusatsu.\n",
                blocks: [
                  {
                    timestamp: "00:04:00",
                    title: "– Evil Dead Rise",
                  },
                  {
                    timestamp: "00:25:11",
                    title: "– Oshi no Ko",
                  },
                  {
                    timestamp: "00:39:51",
                    title: "– Picnic do Rafa",
                  },
                  {
                    timestamp: "00:45:25",
                    title: "– Inception",
                  },
                  {
                    timestamp: "00:54:39",
                    title: "– Tokusatsu Indepedente",
                  },
                ],
              },
              {
                title: "Re:JACK by Crunchyroll #13: Ping Pong the Animation",
                category: "JACK",
                description:
                  'Nesse episódio, acompanhamos as jornadas de Makoto "Smile" Tsukimoto, Yutaka "Peco" Hoshino e grande elenco tentando encontrar seus propósitos no esforço, no talento e no prazer de se jogar tênis de mesa!',
                audioUrl:
                  "https://media.blubrry.com/bilid/audio.transistor.fm/m/shows/42741/805ea7f48adc42e02a632cf789209795.mp3",
                subTitle: "O herói transcende a lógica.",
                imageUrl:
                  "https://jogabilida.de/wp-content/uploads/2023/05/rejack13-pingpong.jpg",
                pubDate: "22/05/2023",
                type: "non-games",
                longDescription:
                  "Quando estiver em apuros, chame três vezes e o Re:JACK by Crunchyroll chegará!\nNesse episódio André Campos, Eduardo Sushi, Rafael Quina e Fernando Mucioli pegam suas raquetes, calçam seus tênis de marca, raspam suas cabeças e treinam com robôs enquanto discutem a premiada adaptação de Masaaki Yuasa do premiado mangá de Taiyou Matsumoto.\nEm Ping Pong the Animation, acompanhamos as jornadas de Makoto “Smile” Tsukimoto, Yutaka “Peco” Hoshino e grande elenco tentando encontrar seus propósitos no esforço, no talento e no prazer de se jogar tênis de mesa!\nLembrando que o Re:JACK é como um clube do livro mensal e no próximo programa discutiremos Vinland Saga (Primeira Temporada). Então não deixe de assistir para acompanhar conosco!\n\n",
                links: [
                  {
                    title: "14 Dias Grátis de Crunchyroll",
                    linkUrl: "https://got.cr/podcast-jogabilidade",
                  },
                ],
              },
            ];
            const lastEpisode = await this.repository.getLastEpisode(type);
            let lastEpisodeDate;
            if (lastEpisode.length > 0) {
              lastEpisodeDate = lastEpisode[0].pubDate;
            }
            // const result = type == "games" ? cachedGames : cachedNonGames;
            const { data } = await axios.get(
                type == "games" ? "https://games.jogabilida.de/" : "https://naogames.jogabilida.de/"
            );
            const parserResult = await this.parser.parseStringPromise(data);
            const filtered = parserResult.rss.channel[0].item.filter((el) =>
              dateFns.isBefore(lastEpisodeDate, new Date(el.pubDate[0]))
            );
            const newEpisodes = [];
            for await (const el of filtered) {
              const episode = await this.getData(el, type);
              this.repository.saveEpisode(episode);
            }
            // await this.repository.saveCachedEpisodes(newEpisodes);
            const result = await this.repository.getCachedEpisodes(type, after);
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = EpisodeController