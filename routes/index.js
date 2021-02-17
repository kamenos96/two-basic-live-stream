const router = require('express').Router()
const got = require('got')
const prettyMs = require('pretty-ms')
const axios = require('axios')

// Set streaming uri
const streamUri = process.env.STREAM_URI || false

router.get('/', (_req, res, next) => {
  // Check if stream uri present
  if (!streamUri) {
    return next(new Error('Stream URI does not exist'))
  }

  got
    .stream(streamUri)
    .on('error', _err => next(new Error()))
    .pipe(res)
})

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

router.get('/nowplaying', async (_req, res, next) => {
  const statsUrl = streamUri + '/stats?json=1'
  try {
    const {
      data: {
        streamstatus,
        songtitle: song,
        servertitle: broadcastproducer,
        servergenre: broadcasttitle
      }
    } = await axios.get(statsUrl)

    if (streamstatus) {
      const broadcastInfo = {}

      broadcastInfo.status = 'online'
      broadcastInfo.statuscode = streamstatus

      broadcastInfo.broadcast = {
        producer:
          broadcastproducer !== 'listen2myradio.com'
            ? broadcastproducer
            : 'AutoDJ',
        title: broadcasttitle !== 'Unspecified' ? broadcasttitle : undefined
      }

      const [songTitle, songArtist] = song && song.split('-')
      broadcastInfo.song =
        {
          artist: songTitle.trim() || undefined,
          title: songArtist.trim() || undefined
        } || undefined

      return res.json(broadcastInfo)
    } else {
      return res.json({ status: 'offline', statuscode: 0 })
    }
  } catch (_error) {
    next(new Error())
  }
})

router.get('/songhistory', async (_req, res, next) => {
  const historyUri = streamUri + '/played?type=json'

  try {
    const { data } = await axios.get(historyUri)
    const songs = data
      .slice(1)
      .map(song => ({ playedat: song.playedat, title: song.title }))

    res.json({
      status: 'online',
      statuscode: 1,
      history: songs || undefined
    })
  } catch (_error) {
    next(new Error())
  }
})

router.use(function (_err, _req, res, _next) {
  res.json({
    status: 'offline',
    statuscode: 0
  })
})

module.exports = router
