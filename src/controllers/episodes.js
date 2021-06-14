const axios = require('axios')
const cheerio = require('cheerio')
const xml2js = require('xml2js')
class EpisodeController {
    constructor() {
        this.parser = new xml2js.Parser()
    }
    async getEpisodes(page = 1, type) {
        try {
            const { data } = await axios.get(
                type == "games" ? "https://games.jogabilida.de/" : "https://naogames.jogabilida.de/"
            );
            const parserResult = await this.parser.parseStringPromise(data);
            const sliced = parserResult.rss.channel[0].item.slice((page - 1) * 10, (page * 10))
            const result = await Promise.all(sliced.map(async (el) => {
                const epData = {};
                epData.title = el.title[0]
                const hasBlocks = el.description[0].indexOf("<ul>");
                const hasItunesDescription = el["itunes:summary"];
                
                let description = "";
                if (hasItunesDescription) description = hasItunesDescription[0];
                else if (hasBlocks > 0) description = el.description[0].substring(0, hasBlocks);
                else description = el.description[0];
                epData.description = description;
                const { data } = await axios.get(el.link[0])
                const $ = cheerio.load(data)
                epData.subTitle = $('.entry-sub-title').text()
                epData.imageUrl = $('.wp-post-image').attr('data-src')
                epData.pubDate = $('.date').first().text();
                epData.type = type;
                return epData
            }))
            return result
        } catch(error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = EpisodeController