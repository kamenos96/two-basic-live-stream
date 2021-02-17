const router = require('express').Router()
const got = require('got')
const prettyMs = require('pretty-ms')
// const axios = require('axios')

// Set streaming uri
const streamUri = process.env.STREAM_URI || false

router.get('/', (_req, res, next) => {
  // Check if stream uri present
  if (!streamUri) {
    return next(new Error('Stream URI does not exist'))
  }

  got
    .stream(streamUri)
    .on('error', err => next(new Error(err)))
    .pipe(res)
})

router.get('/health', (_req, res) => {
  const response = {
    statusCode: streamStatus ? 200 : 500,
    body: {
      status: streamStatus ? 'online' : 'offline',
      uptime: streamStatus ? prettyMs(process.uptime()) : undefined
    }
  }
  res.status(response.statusCode).json(response.body)
})

router.use(function (err, _req, res, _next) {
  process.stderr.write(err.message)
  res.status(500).send('Something broke!')
})

module.exports = router