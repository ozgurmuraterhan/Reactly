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
         required: true,
         type: String,
      },

      bank_name: {
         required: true,
         type: String,
      },
      branch_bank: {
         required: true,
         type: String,
      },

      account_number: {
         required: true,
         type: Number,
      },
      swift_iban: {
         required: true,
         type: String,
      },
      payments: [
         {
            amount: { type: Number, required: true },
            paid_date: { type: Date, required: true },
            account_name: { type: Object, required: true },
            _id: { type: mongoose.ObjectId },
         },
      ],
   },
   {
      timestamps: true,
   }
);

const BankAccounts = mongoose.model("BankAccounts", BankAccountsSchema);

module.exports = BankAccounts;
