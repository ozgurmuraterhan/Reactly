const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        created_user: {
            required: true,
            type: Object,
        },
        product_name: {
            type: String,
            required: true,
            trim: true,
        },
        category_id: {
            type: Array,
            required: true,
        },
        purchase_price: {
            type: Number,
            required: true,
        },
        sale_price: {
            type: Number,
            required: true,
        },
        product_code: {
            type: String,
            trim: true,
        },
        product_vat: {
            type: Number,
            required: true,
        },
        product_stock: {
            type: Number,
            required: true,
        },
        product_description: {
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

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
