const router = require('express').Router();
let CustomersGroups = require('../models/customersgroups.model');
let Customer = require('../models/customer.model');

const title = 'Customers Group';

// get all items
router.route('/').get((req, res, next) => {
    CustomersGroups.find()
        .then((data) => res.json(data))
        .catch((err) =>
            res.json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

// post new items
router.route('/add').post((req, res, next) => {
    new CustomersGroups(req.body)
        .save()
        .then(() =>
            res.json({
                messagge: title + ' Added',
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

// fetch data by id
router.route('/:id').get((req, res, next) => {
    CustomersGroups.findById(req.params.id)
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
    Customer.updateMany(
        {},
        { $pull: { group_id: { value: req.params.id } } },
        { multi: true }
    ).catch((err) => console.log(err));
    CustomersGroups.findByIdAndDelete(req.params.id)
        .then((data) =>
            res.json({
                messagge: title + ' Deleted',
                variant: 'info',
            })
        )
        .catch((err) =>
            res.status(400).json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

// update data by id
router.route('/:id').post((req, res, next) => {
    //Customers collection group_id update by id
    Customer.updateMany(
        { 'group_id.value': req.params.id },
        { $set: { 'group_id.$.label': req.body.name } }
    ).catch((err) => console.log(err));

    //customersGroup update
    CustomersGroups.findByIdAndUpdate(req.params.id, req.body)
        .then(() =>
            res.json({
                messagge: title + ' Updated',
                variant: 'success',
            })
        )
        .catch((err) =>
            res.status(400).json({
                messagge: 'Error: ' + err,
                variant: 'error',
            })
        );
});

module.exports = router;
