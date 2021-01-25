const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomersGroupsSchema = new Schema(
    {
        created_user: {
            required: true,
            type: Object,
        },
        name: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const CustomersGroups = mongoose.model(
    "customersgroups",
    CustomersGroupsSchema
);

module.exports = CustomersGroups;
