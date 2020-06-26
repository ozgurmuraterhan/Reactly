const router = require('express').Router();
let Exercise = require('../models/exercise.model');

router.route('/').get((req, res, next) => {
    Exercise.find()
        .then((Exercise) => res.json(Exercise))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res, next) => {
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
});

router.route('/:id').get((req, res, next) => {
    Exercise.findById(req.params.id)
        .then((Exercise) => res.json(Exercise))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then((Exercise) => res.json('Exercises Deleted'))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res, next) => {
    Exercise.findById(req.params.id)
        .then((exercise) => {
            exercise.username = req.body.username;
            exercise.description = req.body.description;
            exercise.duration = Number(req.body.duration);
            exercise.date = Date.parse(req.body.date);
            exercise.save().then(() => res.json('Exercises Update'));
        })
        .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
