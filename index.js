const express = require('express')
const router = require('./src/routes')
const app = express()
const http = require('http');

app.use(express.json())
app.use('/', router)
const server = http.createServer(app);

const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost";

server.listen(port, host)
server.on("listening", () => {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
})