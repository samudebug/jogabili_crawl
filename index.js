const dotenv = require('dotenv');
dotenv.config();
var admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.ADMIN_CREDENTIALS);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const express = require('express')
const router = require('./src/routes')
const app = express()
const http = require('http');
const morgan = require('morgan');

app.use(morgan('combined'));
app.use(express.json())
app.use('/', router)

const server = http.createServer(app);

const port = process.env.PORT || 3000
const host = "0.0.0.0";

server.listen(port, host)
server.on("listening", () => {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
})