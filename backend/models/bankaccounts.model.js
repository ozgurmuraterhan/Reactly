const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankAccountsSchema = new Schema(
   {
      created_user: {
         required: true,
         type: Object,
      },
      type: {
         required: true,
         type: Boolean,
      },
      account_name: {
         type: String,
         required: true,

      },
      bank_name: {
         type: String,
      },
      branch_bank: {
         type: String,
      },
      status: {
         type: Boolean,
         require: true,
      },
      account_number: {
         type: Number,
      },
      swift_iban: {
         type: String,
      },
      total: {
         type: Number,
         required: true,
         default: 0
      },

   },
   {
      timestamps: true,
   }
);

const BankAccounts = mongoose.model("BankAccounts", BankAccountsSchema);

module.exports = BankAccounts;
