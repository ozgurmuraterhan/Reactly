const router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
let BankAccounts = require('../models/bankaccounts.model');

const title = 'Bank Accounts';

// get all items
router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        BankAccounts.find()
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
            new BankAccounts(req.body)
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
        BankAccounts.aggregate([
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
router
    .route('/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        BankAccounts.findById(req.params.id)
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
        BankAccounts.findByIdAndDelete(req.params.id)
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
            BankAccounts.findByIdAndUpdate(req.params.id, req.body)
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
