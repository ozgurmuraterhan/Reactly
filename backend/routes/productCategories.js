const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let ProductCatagories = require("../models/productcategories.model");
let Product = require("../models/product.model");
let User = require("../models/user.model");

const title = "Products Group";
const roleTitle = "productsCategories";
// get all items
router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        User.find({ username: req.user.username }).then((data) => {
            const rolesControl = data[0].role[0];
            if (rolesControl[roleTitle + "list"]) {
                ProductCatagories.find()
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) =>
                        res.json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else if (rolesControl[roleTitle + "onlyyou"]) {
                ProductCatagories.find({ "created_user.id": `${req.user._id}` })

                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) =>
                        res.json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else {
                res.status(403).json({
                    message: {
                        messagge: "You are not authorized, go away!",
                        variant: "error",
                    },
                });
            }
        });
    });

// post new items
router
    .route("/add")
    .post(
        passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            User.find({ username: req.user.username }).then((data) => {
                const rolesControl = data[0].role[0];
                if (rolesControl[roleTitle + "create"]) {
                    new ProductCatagories(req.body)
                        .save()
                        .then(() =>
                            res.json({
                                messagge: title + " Added",
                                variant: "success",
                            })
                        )
                        .catch((err) =>
                            res.json({
                                messagge: " Error: " + err,
                                variant: "error",
                            })
                        );
                } else {
                    res.status(403).json({
                        message: {
                            messagge: "You are not authorized, go away!",
                            variant: "error",
                        },
                    });
                }
            });
        }
    );

// fetch data by id
router
    .route("/:id")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        User.find({ username: req.user.username }).then((data) => {
            const rolesControl = data[0].role[0];
            if (rolesControl[roleTitle + "list"]) {
                ProductCatagories.findById(req.params.id)
                    .then((data) => res.json(data))
                    .catch((err) =>
                        res.status(400).json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else if (rolesControl[roleTitle + "onlyyou"]) {
                ProductCatagories.findOne({
                    _id: req.params.id,
                    "created_user.id": `${req.user._id}`,
                })
                    .then((data) => {
                        if (data) {
                            res.json(data);
                        } else {
                            res.status(403).json({
                                message: {
                                    messagge:
                                        "You are not authorized, go away!",
                                    variant: "error",
                                },
                            });
                        }
                    })
                    .catch((err) =>
                        res.status(400).json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else {
                res.status(403).json({
                    message: {
                        messagge: "You are not authorized, go away!",
                        variant: "error",
                    },
                });
            }
        });
    });

// delete data by id
router
    .route("/:id")
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
        User.find({ username: req.user.username }).then((data) => {
            const rolesControl = data[0].role[0];
            if (rolesControl[roleTitle + "delete"]) {
                Product.updateMany(
                    {},
                    { $pull: { group_id: { value: req.params.id } } },
                    { multi: true }
                ).catch((err) => console.log(err));
                ProductCatagories.findByIdAndDelete(req.params.id)
                    .then((data) =>
                        res.json({
                            messagge: title + " Deleted",
                            variant: "info",
                        })
                    )
                    .catch((err) =>
                        res.status(400).json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else if (rolesControl[roleTitle + "onlyyou"]) {
                Product.updateMany(
                    {},
                    { $pull: { group_id: { value: req.params.id } } },
                    { multi: true }
                ).catch((err) => console.log(err));
                ProductCatagories.deleteOne({
                    _id: req.params.id,
                    "created_user.id": `${req.user._id}`,
                })
                    .then((resdata) => {
                        if (resdata.deletedCount > 0) {
                            res.json({
                                messagge: title + " delete",
                                variant: "success",
                            });
                        } else {
                            res.status(403).json({
                                message: {
                                    messagge:
                                        "You are not authorized, go away!",
                                    variant: "error",
                                },
                            });
                        }
                    })
                    .catch((err) =>
                        res.status(400).json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else {
                res.status(403).json({
                    message: {
                        messagge: "You are not authorized, go away!",
                        variant: "error",
                    },
                });
            }
        });
    });

// update data by id
router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            User.find({ username: req.user.username }).then((data) => {
                const rolesControl = data[0].role[0];
                if (rolesControl[roleTitle + "edit"]) {
                    //Products collection group_id update by id
                    Product.updateMany(
                        { "group_id.value": req.params.id },
                        { $set: { "group_id.$.label": req.body.name } }
                    ).catch((err) => console.log(err));

                    //ProductsGroup update
                    ProductCatagories.findByIdAndUpdate(req.params.id, req.body)
                        .then(() =>
                            res.json({
                                messagge: title + " Updated",
                                variant: "success",
                            })
                        )
                        .catch((err) =>
                            res.status(400).json({
                                messagge: "Error: " + err,
                                variant: "error",
                            })
                        );
                } else if (rolesControl[roleTitle + "onlyyou"]) {
                    //Products collection group_id update by id
                    Product.updateMany(
                        { "group_id.value": req.params.id },
                        { $set: { "group_id.$.label": req.body.name } }
                    ).catch((err) => console.log(err));

                    //ProductsGroup update
                    ProductCatagories.findOneAndUpdate({
                        _id: req.params.id,
                        "created_user.id": `${req.user._id}`,
                    })
                        .then((resdata) => {
                            if (resdata) {
                                res.json({
                                    messagge: title + " Update",
                                    variant: "success",
                                });
                            } else {
                                res.json({
                                    messagge:
                                        " You are not authorized, go away!",
                                    variant: "error",
                                });
                            }
                        })
                        .catch((err) =>
                            res.status(400).json({
                                messagge: "Error: " + err,
                                variant: "error",
                            })
                        );
                } else {
                    res.status(403).json({
                        message: {
                            messagge: "You are not authorized, go away!",
                            variant: "error",
                        },
                    });
                }
            });
        }
    );

module.exports = router;
