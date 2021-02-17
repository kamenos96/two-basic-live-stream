const io = require('socket.io')
const { socketIoOptions } = require('./config/index')

const PROD = process.env.NODE_ENV === 'production'

module.exports = class Socket {
  constructor(server) {
    this.io = io(server, socketIoOptions)
  }

  _onConnection(callback) {
    this.io.on('connection', socket => {
      this.socket = socket
      if (!PROD) {
        console.log('open connection:', this.socket.id)
      }
      callback()
    })
  }

  _onDisconnection(callback) {
    this.socket.on('disconnect', () => {
      if (!PROD) {
        console.log('close connection:', this.socket.id)
      }
      callback()
    })
  }

  _emit(eventName, payload, local = false) {
    if (local) {
      this.socket.emit(eventName, payload)
    } else {
      this.io.emit(eventName, payload)
    }
  }

  _on(eventName, callback, local = false) {
    if (local) {
      this.socket.on(eventName, (args, cb) => cb(callback.bind(this)(args)))
    } else {
      this.io.emit(eventName, callback())
    }
  }
}

// const onConnection = server => {
// io.on("connection", (socket) => {
//   if (!PROD) {
//     console.log('open connection:', socket.id)
//   }
//   socket.on("hello", (arg) => {
//     console.log(arg); // world
//   });
//   this.io.emit('user-count', io.engine.clientsCount)
//   this._onDisconnection(socket);
// });
// }

// }
