const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpensesSchema = new Schema(
   {
      created_user: {
         required: true,
         type: Object,
      },
      billable: {
         required: true,
         type: Boolean,
      },
      category_id: {
         type: Array,
         trim: true,
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
      paid_date: {
         type: Date,
         required: true,
      },
      customer_id: {
         type: Array,
      },
      due_note: {
         type: String,
      },

      bank_account: {
         type: Object,
         required: true
      },

      payments: [
         {
            amount: { type: Number, required: true },
            paid_date: { type: Date, required: true },
            account_name: { type: Object, required: true },

         },
      ],

      subtotal: {
         type: Number,
      },
      taxtotal: {
         type: Number,
      },

      total: {
         type: Number,
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
   },
   {
      timestamps: true,
   }
);

const Expenses = mongoose.model("Expenses", ExpensesSchema);

module.exports = Expenses;
