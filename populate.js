const dateFns = require('date-fns');
const dotenv = require("dotenv");
const axios = require("axios");
const xml2js = require("xml2js");

dotenv.config();
var admin = require("firebase-admin");
const EpisodesRepository = require("./src/services/episodesDb");
const EpisodeController = require("./src/controllers/episodes");
const serviceAccount = JSON.parse(process.env.ADMIN_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const collection = admin.firestore().collection('episodes');
async function getOlderEpisode(type) {
  const query = await collection.where('type', '==', type).orderBy('pubDate', 'asc').limit(1).get();
  return query.docs.map((el) => ({id: el.id, ...el.data(), pubDate: el.data().pubDate.toDate()}))
}
const repository = new EpisodesRepository();
const controller = new EpisodeController(repository);

async function getFilteredEpisodes(type) {
  const olderEpisode = await getOlderEpisode(type);
  const parser = new xml2js.Parser();
  let lastEpisodeDate;
  if (olderEpisode.length > 0) {
    lastEpisodeDate = olderEpisode[0].pubDate;
  }
  // const result = type == "games" ? cachedGames : cachedNonGames;
  const { data } = await axios.get(
    type == "games"
      ? "https://games.jogabilida.de/"
      : "https://naogames.jogabilida.de/"
  );
  const parserResult = await parser.parseStringPromise(data);
  const filtered = parserResult.rss.channel[0].item.filter((el) =>
    true
  );
  for await (const el of filtered) {
    const episode = await controller.getData(el, type);
    repository.saveEpisode(episode);
  }
}

async function setup() {

  await Promise.all([
    getFilteredEpisodes("games"),
    getFilteredEpisodes("non-games"),
  ]);
}
setup();
