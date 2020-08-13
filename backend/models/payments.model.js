const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsSchema = new Schema(
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

const Payments = mongoose.model("Payments", PaymentsSchema);

module.exports = Payments;
