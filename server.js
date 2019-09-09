const express = require('express')

const db = require('./data/dbConfig.js')

const server = express()

server.use(express.json())

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)

    next()
}

server.use(logger)

server.get('/', (req, res) => {
    res.json('Hello World')
})

module.exports = server