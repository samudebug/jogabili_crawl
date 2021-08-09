const axios = require('axios')
const cheerio = require('cheerio')
const xml2js = require('xml2js')
class EpisodeController {
    constructor() {
        this.parser = new xml2js.Parser()
    }
    async getData(el, type) {
        const epData = {};
        epData.title = el.title[0]
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
        epData.imageUrl = $('.wp-post-image').attr('data-src')
        epData.pubDate = $('.date').first().text();
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
    async getEpisodes(page = 1, type) {
        try {
            const { data } = await axios.get(
                type == "games" ? "https://games.jogabilida.de/" : "https://naogames.jogabilida.de/"
            );
            const parserResult = await this.parser.parseStringPromise(data);
            const sliced = parserResult.rss.channel[0].item.slice((page - 1) * 10, (page * 10))
            const result = await Promise.all(sliced.map(async (el) => {
                return await this.getData(el, type);

            }))
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = EpisodeController