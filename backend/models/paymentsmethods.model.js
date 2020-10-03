const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsMethodSchema = new Schema(
   {
      created_user: {
         required: true,
         type: Object,
      },
      name: {
         required: true,
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

const PaymentsMethod = mongoose.model("PaymentsMethod", PaymentsMethodSchema);

module.exports = PaymentsMethod;
