const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let CustomersGroups = require("../models/customersgroups.model");
let Customer = require("../models/customer.model");

const title = "Customers Group";
const roleTitle = "customersgroup";
// get all items
router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            CustomersGroups.find()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) =>
                    res.json({
                        messagge: "Error: " + err,
                        variant: "error",
                    })
                );
        } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
            CustomersGroups.find({ created_user: req.user._id })
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

// post new items
router
    .route("/add")
    .post(
        passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            if (req.user.role.includes(roleTitle + ".create")) {
                new CustomersGroups(req.body)
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
        }
    );

// fetch data by id
router
    .route("/:id")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            CustomersGroups.findById(req.params.id)
                .then((data) => res.json(data))
                .catch((err) =>
                    res.status(400).json({
                        messagge: "Error: " + err,
                        variant: "error",
                    })
                );
        } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
            CustomersGroups.findOne({
                _id: req.params.id,
                created_user: req.user._id,
            })
                .then((data) => {
                    if (data) {
                        res.json(data);
                    } else {
                        res.status(403).json({
                            message: {
                                messagge: "You are not authorized, go away!",
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

// delete data by id
router
    .route("/:id")
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
        if (req.user.role.includes(roleTitle + ".remove")) {
            Customer.updateMany(
                {},
                { $pull: { group_id: { value: req.params.id } } },
                { multi: true }
            ).catch((err) => console.log(err));
            CustomersGroups.findByIdAndDelete(req.params.id)
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
        } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
            Customer.updateMany(
                {},
                { $pull: { group_id: { value: req.params.id } } },
                { multi: true }
            ).catch((err) => console.log(err));
            CustomersGroups.deleteOne({
                _id: req.params.id,
                created_user: req.user._id,
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
                                messagge: "You are not authorized, go away!",
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

// update data by id
router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            if (req.user.role.includes(roleTitle + ".edit")) {
                //Customers collection group_id update by id
                Customer.updateMany(
                    { "group_id.value": req.params.id },
                    { $set: { "group_id.$.label": req.body.name } }
                ).catch((err) => console.log(err));

                //customersGroup update
                CustomersGroups.findByIdAndUpdate(req.params.id, req.body)
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
            } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
                //Customers collection group_id update by id
                Customer.updateMany(
                    { "group_id.value": req.params.id },
                    { $set: { "group_id.$.label": req.body.name } }
                ).catch((err) => console.log(err));

                //customersGroup update
                CustomersGroups.findOneAndUpdate({
                    _id: req.params.id,
                    created_user: req.user._id,
                })
                    .then((resdata) => {
                        if (resdata) {
                            res.json({
                                messagge: title + " Update",
                                variant: "success",
                            });
                        } else {
                            res.json({
                                messagge: " You are not authorized, go away!",
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
        }
    );

module.exports = router;
