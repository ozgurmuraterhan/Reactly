const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsAccountsSchema = new Schema(
   {
      created_user: {
         type: Object,
      },
      customer_id: {
         type: Object,
      },
      type: {
         type: Boolean,
         require: true,
      },
      expenses_id: {
         type: String,
      },
      invoices_id: {
         type: String,
      },
      amount: {
         type: Number,
         required: true
      },
      paid_date: {
         type: Date,
         required: true
      },
      account_name: {
         type: Object,
         required: true
      },
      created: {
         type: Date,
         required: true,
      },
      note: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

const PaymentsAccounts = mongoose.model("PaymentsAccounts", PaymentsAccountsSchema);

module.exports = PaymentsAccounts;
