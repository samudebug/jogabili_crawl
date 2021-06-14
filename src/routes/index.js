const express = require('express')
const episodeRouter = require('./episodes')

const router = express.Router()

router.use('/episodes', episodeRouter)

module.exports = router