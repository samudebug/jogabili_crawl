const express = require('express')
const EpisodeController = require('../controllers/episodes');
const EpisodesRepository = require('../services/episodesDb');
const router = express.Router()
const episodesRepository = new EpisodesRepository();
const episodeController = new EpisodeController(episodesRepository)
router.get("/games", async (req, res) => {
    const after = req.query.after;
    res.send(await episodeController.getEpisodes("games", after))
});

router.get("/non-games", async (req, res) => {
    const after = req.query.after;
    res.send(await episodeController.getEpisodes("non-games", after));
})

module.exports = router;