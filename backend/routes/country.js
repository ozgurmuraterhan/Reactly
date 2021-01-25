const router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
let Country = require('../models/country.model');

const title = 'Country';

// get all items
router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Country.find().then((data) => res.json(data));
    });

// get item 
router
    .route('/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Country.find({ name: req.params.id }).then((data) => res.json(data));
    });

module.exports = router;
