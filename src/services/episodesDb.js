const admin = require('firebase-admin');
const lodash = require('lodash');
class EpisodesRepository {
  constructor() {
    this.collection = admin.firestore().collection('episodes');
  }

  async getLastEpisode(type) {
    const data = await this.collection
      .where("type", "==", type)
      .orderBy("pubDate", "desc")
      .limit(1)
      .get();
    return data.docs.map((el) => ({ id: el.id, ...el.data(), pubDate: el.data().pubDate.toDate() }));
  }

  async getCachedEpisodes(type, after) {
    const query = this.collection.where('type', '==', type).orderBy('pubDate', "desc");
    if (after) {
      console.log('after', after)
      query.startAfter(await this.collection.doc(after).get());
    }
    query.limit(10);
    const data = await query.get();
    return data.docs.map((el) => ({
      id: el.id,
      ...el.data(),
      pubDate: el.data().pubDate.toDate(),
    }));
  }

  async saveEpisode(episode) {
    let newEpisode = {}
    Object.keys(episode).forEach((key) => {
      if (episode[key] == undefined) {
        newEpisode[key] = ""
        return;
      }
      newEpisode[key] = episode[key];
    })
    await this.collection.add(newEpisode);
  }

  async saveCachedEpisodes(episodes) {
    const chunks = lodash.chunk(episodes, 500)
    for await (const chunk of chunks) {
        const batch = admin.firestore().batch();
        chunk.forEach(element => {
          batch.create(this.collection.doc(), element);
        });
        batch.commit();
    }
  }
}

module.exports = EpisodesRepository;