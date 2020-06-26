const router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
let Product = require('../models/product.model');

const title = 'Product';

// get all items
router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Product.aggregate([
            {
                $project: {
                    product_name: 1,
                    category_id: 1,
                    purchase_price: 1,
                    _id: 1,
                    product_code: 1,
                    defaultAddress_country_id: 1,
                    defaultAddress_state_id: 1,
                },
            },
        ])
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
router
    .route('/add')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            new Product(req.body)
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
        }
    );

//group name statistic
router
    .route('/statistic')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Product.aggregate([
            { $unwind: '$category_id' },
            {
                $group: {
                    _id: '$category_id.label',
                    count: { $sum: 1 },
                },
            },
        ]).then((data) => res.json(data));
    });

// fetch data by id
router
    .route('/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Product.findById(req.params.id)
            .then((data) => res.json(data))
            .catch((err) =>
                res.status(400).json({
                    messagge: 'Error: ' + err,
                    variant: 'error',
                })
            );
    });

// delete data by id
router
    .route('/:id')
    .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
        Product.findByIdAndDelete(req.params.id)
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
router
    .route('/:id')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            Product.findByIdAndUpdate(req.params.id, req.body)
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
        }
    );

module.exports = router;
