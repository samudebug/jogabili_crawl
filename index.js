const express = require('express')
const router = require('./src/routes')
const app = express()

app.use(express.json())
app.use('/', router)

const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost";

app.listen(port, () => {
    console.log("App listening on port", port)
}) 