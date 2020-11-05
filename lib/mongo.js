const { MongoClient } = require('mongodb')

const uri = 'mongodb://127.0.0.1:27017'

const client = new MongoClient(uri, { useUnifiedTopology: true })

module.exports.connectDb = async () => {
  await client.connect()
  await client.db('chat').command({ ping: 1 })
  console.log('Connected successfully to db!')
}

module.exports.mongoClient = client
