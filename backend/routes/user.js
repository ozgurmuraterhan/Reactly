const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;

const nodemailer = require("nodemailer");

const signToken = (userID) => {
    return JWT.sign(
        {
            iss: process.env.PASPORTJS_KEY,
            sub: userID,
        },
        process.env.PASPORTJS_KEY,
        { expiresIn: "30 days" }
    );
};

router.put("/updatePasswordViaEmail", (req, res) => {
    User.findOne({
        username: req.body.username,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: { $gte: Date.now() },
    }).then((user) => {
        if (user == null) {
            console.error("password reset link is invalid or has expired");
            res.status(403).send(
                "password reset link is invalid or has expired"
            );
        } else if (user != null) {
            console.log("user exists in db");
            bcrypt
                .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                .then((hashedPassword) => {
                    User.findOneAndUpdate(
                        {
                            username: req.body.username,
                        },
                        {
                            password: hashedPassword,
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        }
                    )
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));
                })
                .then(() => {
                    console.log("password updated");
                    res.status(200).send({ message: "password updated" });
                });
        } else {
            console.error("no user exists in db to update");
            res.status(401).json("no user exists in db to update");
        }
    });
});

router.post("/register", (req, res) => {
    const { username, password, role } = req.body;

    User.findOne({ username }, (err, user) => {
        if (err)
            res.status(500).json({
                message: { msgBody: "Error has occured", msgError: true },
            });
        if (user)
            res.status(400).json({
                message: {
                    msgBody: "Username is already taken",
                    msgError: true,
                },
            });
        else {
            const newUser = new User({ username, password, role });
            newUser.save((err) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured",
                            msgError: true,
                        },
                    });
                else
                    res.status(201).json({
                        message: {
                            msgBody: "Account successfully created",
                            msgError: false,
                        },
                    });
            });
        }
    });
});

router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        if (req.isAuthenticated()) {
            const { _id, username, role, name, surname,company,isCustomer } = req.user;
            const token = signToken(_id);
            res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: true,
            });
            res.status(200).json({
                isAuthenticated: true,
                user: { username, role, id: _id, name: name + " " + surname, company: company, isCustomer: isCustomer },
            });
        }
    }
);

router.get("/reset", (req, res) => {
    User.findOne({
        resetPasswordToken: req.query.resetPasswordToken,
        resetPasswordExpires: { $gte: Date.now() },
    }).then((user) => {
        if (user == null) {
            console.error("password reset link is invalid or has expired");
            res.status(403).send(
                "password reset link is invalid or has expired"
            );
        } else {
            res.status(200).send({
                username: user.username,
                message: "password reset link a-ok",
            });
        }
    });
});

router.post("/forgotPassword", (req, res) => {
    if (req.body.username === "") {
        res.status(400).send("email required");
    }

    User.findOne({ username: req.body.username }).then((user) => {
        if (user === null) {
            console.error("email not in database");
            res.status(403).send("email not in db");
        } else {
            const token = crypto.randomBytes(20).toString("hex");
            user.updateOne({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000,
            })
                .then((res) => console.log(res + " added"))
                .catch((err) => console.log(err));

            const transporter = nodemailer.createTransport({
                host: `${process.env.MAIL_HOST}`,
                port: 587,
                secure: false,
                tls: { rejectUnauthorized: false },
                auth: {
                    user: `merhan@`,
                    pass: `U&e224$!`,
                },
            });

            const mailOptions = {
                from: `merhan@`,
                to: `${user.username}`,
                subject: "Link To Reset Password",
                text:
                    "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                    "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
                    `http://localhost:3000/reset/${token}\n\n` +
                    "If you did not request this, please ignore this email and your password will remain unchanged.\n",
            };

            console.log("sending mail");

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error("there was an error: ", err);
                } else {
                    console.log("here is the res: ", response);
                    res.status(200).json("recovery email sent");
                }
            });
        }
    });
});
router.get(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.clearCookie("access_token");
        res.json({
            user: { username: "", role: "", id: "", name: "",company: "", isCustomer: ""  },
            success: true,
        });
    }
);

router.get(
    "/admin",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        if (req.user.role === "admin") {
            res.status(200).json({
                message: { msgBody: "You are an admin", msgError: false },
            });
        } else {
            res.status(403).json({
                message: {
                    msgBody: "You're not an admin,go away",
                    msgError: true,
                },
            });
        }
    }
);

router.get(
    "/authenticated",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { username, role, _id, name, surname,company,isCustomer } = req.user;
        res.status(200).json({
            isAuthenticated: true,
            user: { username, role, id: _id, name: name + " " + surname, company: company, isCustomer: isCustomer },
        });
    }
);

module.exports = router;
