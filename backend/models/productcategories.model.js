const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductCategoriesSchema = new Schema(
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

const ProductCategories = mongoose.model(
    "ProductCategories",
    ProductCategoriesSchema
);

module.exports = ProductCategories;
