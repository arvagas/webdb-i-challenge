const express = require('express')

const router = express.Router()

const db = require('../data/dbConfig.js')

// @@@@@@@@@@ Custom Middleware @@@@@@@@@@
function validateAccId(req, res, next) {
    const { id } = req.params

    db('accounts')
    .where({ id })
    .first()
    .then(account => {
        if (account) next()
        else res.status(404).json({ message: "invalid account id" })
    })
    .catch(err => res.status(500).json(err))
}

function validateAccObj(req, res, next) {
    const accObj = req.body

    if (!accObj) res.status(400).json({ message: "missing body request" })
    else if (!accObj.name || !accObj.budget) res.status(400).json({ message: "missing required name or budget field" })
    else if (accObj && accObj.name && accObj.budget) next()
}

function validateQueryStr(req, res, next) {
    const queryStr = req.body

    if (Object.getOwnPropertyNames(queryStr).length === 0) next()
    else if (queryStr.hasOwnProperty('limit') || queryStr.hasOwnProperty('sortby') || queryStr.hasOwnProperty('sortdir')) {
        if (!queryStr.sortby && queryStr.sortdir) res.status(400).json({ message: "missing required sortby field" })
        else next()
    }
    else res.status(500).json({ message: "object does not contain valid property types" })
}

// @@@@@@@@@@ GET requests @@@@@@@@@@
// Get all accounts
router.get('/', validateQueryStr, (req, res) => {
    const queryStr = req.body

    if (Object.getOwnPropertyNames(queryStr).length === 0) {
        db('accounts')
        .then(accounts => res.json(accounts))
        .catch(err => res.status(500).json(err))
    } else if (!queryStr.sortby) {
        db('accounts')
        .limit(queryStr.limit)
        .then(accounts => res.json(accounts))
        .catch(err => res.status(500).json(err))
    } else {
        db('accounts')
        .orderBy(queryStr.sortby, queryStr.sortdir)
        .limit(queryStr.limit)
        .then(accounts => res.json(accounts))
        .catch(err => res.status(500).json(err))
    }
})

//Get specific accounts
router.get('/:id', validateAccId, (req, res) => {
    const { id } = req.params

    db('accounts')
    .where({ id })
    .first()
    .then(account => res.json(account))
    .catch(err => res.status(500).json(err))
})

// @@@@@@@@@@ POST request @@@@@@@@@@
router.post('/', validateAccObj, (req, res) => {
    const newAcc = req.body

    db('accounts')
    .insert(newAcc, 'id')
    .then(([id]) => {
        db('accounts')
        .where({ id })
        .first()
        .then(account => res.json(account))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
})

// @@@@@@@@@@ DELETE request @@@@@@@@@@
router.delete('/:id', validateAccId, (req, res) => {
    const { id } = req.params

    db('accounts')
    .where({ id })
    .first()
    .then(remAccount => {
        db('accounts')
        .where({ id })
        .del()
        .then(count => res.json(remAccount))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
})

// @@@@@@@@@@ PUT request @@@@@@@@@@
router.put('/:id', validateAccId, validateAccObj, (req, res) => {
    const { id } = req.params
    const changes = req.body

    db('accounts')
    .where({ id })
    .update(changes)
    .then(count => res.json({ id: id, ...changes }))
    .catch(err => res.status(500).json(err))
})

module.exports = router