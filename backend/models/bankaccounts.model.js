const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankAccountsSchema = new Schema({
    name:{
        required:true,
        type:String
    },

    branchbank:{
        required:true,
        type:String
    },

    account:{
        required:true,
        type:Number
    },

    iban:{
        required:true,
        type:String
    },
    

},{
    timestamps: true
})

const BankAccounts = mongoose.model('BankAccounts',BankAccountsSchema)

module.exports = BankAccounts