// Socket.io options
module.exports = {
  cors: {
    origin: [
      'http://localhost:5000',
      'https://two-basic.live',
      'http://dev.two-basic.live',
      'http://beta.two-basic.live'
    ],
    methods: ['GET', 'POST']
  },
  serveClient: false
}
