const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsMethodsSchema = new Schema(
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

const PaymentsMethods = mongoose.model("PaymentsMethods", PaymentsMethodsSchema);

module.exports = PaymentsMethods;
