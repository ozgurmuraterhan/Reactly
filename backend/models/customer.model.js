const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        created_user: {
            required: true,
            type: Object,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },

        group_id: {
            type: Array,
            trim: true,
        },

        taxoffice: {
            type: String,
            trim: true,
        },

        taxnumber: {
            type: String,
        },

        ssn: {
            type: String,
        },

        executive: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
        },
        fax: {
            type: String,
        },
        web: {
            type: String,
        },
        default_payment_method: {
            type: Array,
        },
        risk: {
            type: Number,
        },
        defaultAddress_country_id: {
            type: String,
        },
        defaultAddress_state_id: {
            type: String,
        },
        defaultAddress_town: {
            type: String,
        },
        defaultAddress_zipcode: {
            type: Number,
        },
        defaultAddress_address: {
            type: String,
        },
        billingAddress_country_id: {
            type: String,
        },
        billingAddress_state_id: {
            type: String,
        },
        billingAddress_town: {
            type: String,
            trim: true,
        },
        billingAddress_zipcode: {
            type: Number,
            trim: true,
        },
        billingAddress_address: {
            type: String,
            trim: true,
        },
        shippingAddress_country_id: {
            type: String,
        },
        shippingAddress_state_id: {
            type: String,
        },
        shippingAddress_town: {
            type: String,
            trim: true,
        },
        shippingAddress_zipcode: {
            type: Number,
            trim: true,
        },
        shippingAddress_address: {
            type: String,
            trim: true,
        },
        spesific_id: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
