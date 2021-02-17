const os = require('os')
const dns = require('dns')
const express = require('express')
const http = require('http')
const favicon = require('serve-favicon')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes/index')
const { corsOptions } = require('./config/index')
// const SocketEvents = require('./socket-events')

/**
 * Variables initiation
 */

// Get hostname
const hostname = os.hostname()

// Init server port
const serverport = process.env.PORT || 3000

/**
 * Server initiation
 */

// Init express server
const app = express()

// Init http server
const server = http.createServer(app)

// Init socket server
// new SocketEvents(server)

// Set favicon
app.use(favicon('./assets/favicon.ico'))

// Init cors
app.use(cors(corsOptions))

// Set routes
app.use('/', routes)

server.listen(serverport, () => {
  dns.lookup(hostname, (_err, ip) => {
    // retrieve network local ip
    // process.stdout.write('Audio Proxy Server runs under\n');
    process.stdout.write('Server runs under\n')
    process.stdout.write(`  Local: http://localhost:${serverport}\n`)
    process.stdout.write(`  Home Network: http://${ip}:${serverport}\n`)
  })
})
