const router = require('express').Router();
let Customer = require('../models/customer.model');

const title = 'Customer';

// get all items
router.route('/').get((req, res, next) => {
    Customer.aggregate([
        {
            $project: {
                company: 1,
                email: 1,
                phone: 1,
                _id: 1,
                group_id: 1,
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
router.route('/add').post((req, res, next) => {
    new Customer(req.body)
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

//group name statistic
router.route('/statistic').get((req, res, next) => {
    Customer.aggregate([
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
    Customer.findById(req.params.id)
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
    Customer.findByIdAndDelete(req.params.id)
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
    Customer.findByIdAndUpdate(req.params.id, req.body)
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
