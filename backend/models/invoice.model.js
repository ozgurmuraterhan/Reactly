const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
    {
        created_user: {
            required: true,
            type: Object,
        },
        draft: {
            required: true,
            type: Boolean,
        },
        no: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        serie: {
            type: String,
            trim: true,
        },
        created: {
            type: Date,
            required: true,
        },
        due_date: {
            type: Date,
        },
        date_send: {
            type: Date,
        },
        customer_id: {
            type: Array,
        },
        due_note: {
            type: String,
        },
        payments: {
            type: Array,
            trim: true,
        },
        subtotal: {
            type: Number,
        },
        taxtotal: {
            type: Number,
        },
        discount: {
            type: Number,
        },
        discountType: {
            type: String,
        },
        discountValue: {
            type: Number,
        },
        total: {
            type: Number,
        },
        default_payment_method: {
            type: Array,
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
        items: {
            type: Array,
        },
        quantity: {
            type: String,
        },
        quantity_name: {
            type: String,
        },
        spesific_id: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
