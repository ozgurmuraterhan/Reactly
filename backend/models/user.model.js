const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    created_user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 15,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Array,
        required: true,
    },
    resetPasswordToken: {
        type: String,
        default: "asdasdasdas--example--6yhjkoıu7654esxcvbhythbvfde45ty",
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now(),
    },
});

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err) return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        else {
            if (!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
