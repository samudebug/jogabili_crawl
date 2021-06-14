const express = require('express')
const EpisodeController = require('../controllers/episodes')
const router = express.Router()
const episodeController = new EpisodeController()
router.get("/games", async (req, res) => {
    const page = req.query.page;
    res.send(await episodeController.getEpisodes(page, "games"))
});

router.get("/non-games", async (req, res) => {
    const page = req.query.page;
    res.send(await episodeController.getEpisodes(page, "non-games"));
})

module.exports = router;