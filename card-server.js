const Datastore = require('nedb')
const db = new Datastore({ filename: 'card.db', autoload: true })

const fastify = require('fastify')({
  logger: true
})

fastify.get('/card', (request, reply) => {
  if (!request.query.id) {
    reply.code(400).send('missing param id')
    return
  }
  db.findOne({ _id: request.query.id }, (err, doc) => {
    if (err) {
      reply.code(500).send(err.message)
    } else if (doc) {
      reply.send(doc)
    } else {
      reply.code(404).send()
    }
  })
})

fastify.post('/new', (request, reply) => {
  db.insert(request.body, (err, newDoc) => {
    if (err) {
      reply.code(500).send(err.message)
      return
    }
    reply.send({ id: newDoc._id })
  })
})

fastify.listen(7700, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})
