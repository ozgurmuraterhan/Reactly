const User = require("../models/user.model");

const getRole = (username) => {
    User.find({ username }).then((data) => {
        console.log(data[0].role);
        const x = data[0].role;
        return x;
    });
};

module.exports = getRole;
