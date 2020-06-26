const router = require('express').Router();
let ProductCatagories = require('../models/productcategories.model');
let Product = require('../models/product.model');

const title = 'Products Group';

// get all items
router.route('/').get((req, res, next) => {
    ProductCatagories.find()
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
    new ProductCatagories(req.body)
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
    ProductCatagories.findById(req.params.id)
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
    Product.updateMany(
        {},
        { $pull: { category_id: { value: req.params.id } } },
        { multi: true }
    ).catch((err) => console.log(err));
    ProductCatagories.findByIdAndDelete(req.params.id)
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
    //Products collection group_id update by id
    Product.updateMany(
        { 'category_id.value': req.params.id },
        { $set: { 'category_id.$.label': req.body.name } }
    ).catch((err) => console.log(err));

    //ProductsGroup update
    ProductCatagories.findByIdAndUpdate(req.params.id, req.body)
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
