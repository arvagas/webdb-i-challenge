const express = require('express')

const accountsRoute = require('./api/accountsRoute')

const server = express()
server.use(express.json())

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)

    next()
}

// @@@@@@@@@@ Global Middleware @@@@@@@@@@
server.use(logger)

// Route handling
server.use('/api/accounts', accountsRoute)

// Hello World test
server.get('/', (req, res) => {
    res.json('Hello World from webdb-i-challenge')
})

module.exports = server