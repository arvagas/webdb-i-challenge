const express = require('express')

const router = express.Router()

const db = require('../data/dbConfig.js')

// @@@@@@@@@@ GET requests @@@@@@@@@@
// Get all accounts
router.get('/', (req, res) => {
    db('accounts')
    .then(accounts => res.json(accounts))
    .catch(err => res.status(500).json(err))
})

//Get specific accounts
router.get('/:id', (req, res) => {
    const { id } = req.params

    db('accounts')
    .where({ id })
    .first()
    .then(account => res.json(account))
    .catch(err => res.status(500).json(err))
})

// @@@@@@@@@@ POST request @@@@@@@@@@
router.post('/', (req, res) => {
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
// router.delete()

// @@@@@@@@@@ PUT request @@@@@@@@@@
// router.put()

module.exports = router