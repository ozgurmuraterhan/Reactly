const router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
let Invoice = require('../models/invoice.model');

const title = 'Invoice';

// get all items
router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Invoice.find()
            .then((data) => {
                res.json(data);
            })
            .catch((err) =>
                res.json({
                    messagge: 'Error: ' + err,
                    variant: 'error',
                })
            );
    });

// post new items
router.route('/add').post((req, res, next) => {
    new Invoice(req.body)
        .save()
        .then(() =>
            res.json({
                messagge: title + ' Added',
                variant: 'success',
            })
        )
        .catch((err) =>
            res.json({
                messagge: ' Error: ' + err,
                variant: 'error',
            })
        );
});

// statistic
router.route('/statistic').get((req, res, next) => {
    Invoice.aggregate([
        { $unwind: '$group_id' },
        {
            $group: {
                _id: '$group_id.label',
                count: { $sum: 1 },
            },
        },
    ]).then((data) => res.json(data));
});

// fetch data by id
router.route('/:id').get((req, res, next) => {
    Invoice.findById(req.params.id)
        .then((data) => res.json(data))
        .catch((err) =>
            res.status(400).json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

// delete data by id
router.route('/:id').delete((req, res) => {
    Invoice.findByIdAndDelete(req.params.id)
        .then((data) =>
            res.json({
                messagge: title + ' Deleted',
                variant: 'info',
            })
        )
        .catch((err) =>
            res.json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

// update data by id
router.route('/:id').post((req, res, next) => {
    Invoice.findByIdAndUpdate(req.params.id, req.body)
        .then(() =>
            res.json({
                messagge: title + ' Update',
                variant: 'success',
            })
        )
        .catch((err) =>
            res.json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

module.exports = router;
