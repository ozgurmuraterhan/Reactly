const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankAccountsSchema = new Schema(
   {
      created_user: {
         required: true,
         type: Object,
      },
      name: {
         required: true,
         type: String,
         trim: true,
      },

      note: {
         required: true,
         type: String,
         trim: true,
      },

      category_id: {
         type: Array,
      },

      expense_date: {
         required: true,
         type: Date,
      },

      expense: {
         type: Number,
      },

      customer_id: {
         type: Array,
      },

      billable: {
         type: Boolean,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

const BankAccounts = mongoose.model("BankAccounts", BankAccountsSchema);

module.exports = BankAccounts;
