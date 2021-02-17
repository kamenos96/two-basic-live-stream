const prettyMs = require('pretty-ms')
const Socket = require('./socket')

const PROD = process.env.NODE_ENV === 'production'

module.exports = class SocketEvents extends Socket {
  constructor(server) {
    super(server)
    this._onConnection(() => {
      this._emit('clientsCount', this.onClientCount())
      this._on('uptime', this.onUptime, true)
      this._onDisconnection(() => {
        this.onDisconnect()
      })
    })
  }

  onDisconnect() {
    this._emit('clientsCount', this.onClientCount())
  }

  onUptime() {
    return {
      uptime: prettyMs(process.uptime())
    }
  }

  onClientCount() {
    return {
      clients: this.io.engine.clientsCount
    }
  }
}
