const router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
let Exercise = require('../models/exercise.model');

router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Exercise.find()
            .then((Exercise) => res.json(Exercise))
            .catch((err) => res.status(400).json('Error: ' + err));
    });

router
    .route('/add')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            const username = req.body.username;
            const description = req.body.description;
            const duration = Number(req.body.duration);
            const date = Date.parse(req.body.date);

            const newExercises = new Exercise({
                username,
                description,
                duration,
                date,
            });

            newExercises
                .save()
                .then(() => res.json('Exercises added'))
                .catch((err) => res.status(400).json('Error: ' + err));
        }
    );

router
    .route('/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Exercise.findById(req.params.id)
            .then((Exercise) => res.json(Exercise))
            .catch((err) => res.status(400).json('Error: ' + err));
    });

router
    .route('/:id')
    .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
        Exercise.findByIdAndDelete(req.params.id)
            .then((Exercise) => res.json('Exercises Deleted'))
            .catch((err) => res.status(400).json('Error: ' + err));
    });

router
    .route('/update/:id')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            Exercise.findById(req.params.id)
                .then((exercise) => {
                    exercise.username = req.body.username;
                    exercise.description = req.body.description;
                    exercise.duration = Number(req.body.duration);
                    exercise.date = Date.parse(req.body.date);
                    exercise.save().then(() => res.json('Exercises Update'));
                })
                .catch((err) => res.status(400).json('Error: ' + err));
        }
    );

module.exports = router;
