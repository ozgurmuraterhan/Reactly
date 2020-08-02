const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const passport = require("passport");
const JWT = require("jsonwebtoken");

// get all items
router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
        if (req.user.role.includes(roleTitle + ".list")) {
            User.find()
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
            User.find({ created_user: req.user._id })
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
module.exports = router;
