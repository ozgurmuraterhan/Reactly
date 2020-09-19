const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpensesCategoriesSchema = new Schema(
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

const Expensescategories = mongoose.model("Expensescategories", ExpensesCategoriesSchema);

module.exports = Expensescategories;
