const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let BankAccounts = require("../models/bankaccounts.model");

const title = "Bank Accounts";
const roleTitle = "bankaccounts";

// get all items
router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            BankAccounts.find()
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
            BankAccounts.find({ created_user: req.user._id })
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
                new BankAccounts(req.body)
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

//group name statistic
router
    .route("/statistic")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            BankAccounts.aggregate([
                { $unwind: "$group_id" },
                {
                    $group: {
                        _id: "$group_id.label",
                        count: { $sum: 1 },
                    },
                },
            ]).then((data) => res.json(data));
        }
    });

// fetch data by id
router
    .route("/:id")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            BankAccounts.findById(req.params.id)
                .then((data) => res.json(data))
                .catch((err) =>
                    res.status(400).json({
                        messagge: "Error: " + err,
                        variant: "error",
                    })
                );
        } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
            BankAccounts.findOne({
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
            BankAccounts.findByIdAndDelete(req.params.id)
                .then((data) =>
                    res.json({
                        messagge: title + " Deleted",
                        variant: "info",
                    })
                )
                .catch((err) =>
                    res.json({
                        messagge: "Error: " + err,
                        variant: "error",
                    })
                );
        } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
            BankAccounts.deleteOne({
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

// update data by id
router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            if (req.user.role.includes(roleTitle + ".edit")) {
                BankAccounts.findByIdAndUpdate(req.params.id, req.body)
                    .then(() =>
                        res.json({
                            messagge: title + " Update",
                            variant: "success",
                        })
                    )
                    .catch((err) =>
                        res.json({
                            messagge: "Error: " + err,
                            variant: "error",
                        })
                    );
            } else if (req.user.role.includes(roleTitle + ".onlyyou")) {
                BankAccounts.findOneAndUpdate(
                    { _id: req.params.id, created_user: req.user._id },
                    req.body
                )
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
        }
    );

module.exports = router;
