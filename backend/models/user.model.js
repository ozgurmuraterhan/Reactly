const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    created_user: {
        required: true,
        type: Object,
    },
    isCustomer:{
        type:Boolean,
        required:true,
        default:true
    },
    name: {
        type: String,
     },
    surname: {
        type: String,
     },
    company: {
        type: String,
        required: true,
        trim: true,
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
    },

    group_id: {
        type: Array,
        trim: true,
    },

    taxoffice: {
        type: String,
        trim: true,
    },

    taxnumber: {
        type: String,
    },

    ssn: {
        type: String,
    },

    executive: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
    },
    fax: {
        type: String,
    },
    web: {
        type: String,
    },
    default_payment_method: {
        type: Array,
    },
    risk: {
        type: Number,
    },
    defaultAddress_country_id: {
        type: String,
    },
    defaultAddress_state_id: {
        type: String,
    },
    defaultAddress_town: {
        type: String,
    },
    defaultAddress_zipcode: {
        type: Number,
    },
    defaultAddress_address: {
        type: String,
    },
    billingAddress_country_id: {
        type: String,
    },
    billingAddress_state_id: {
        type: String,
    },
    billingAddress_town: {
        type: String,
        trim: true,
    },
    billingAddress_zipcode: {
        type: Number,
        trim: true,
    },
    billingAddress_address: {
        type: String,
        trim: true,
    },
    shippingAddress_country_id: {
        type: String,
    },
    shippingAddress_state_id: {
        type: String,
    },
    shippingAddress_town: {
        type: String,
        trim: true,
    },
    shippingAddress_zipcode: {
        type: Number,
        trim: true,
    },
    shippingAddress_address: {
        type: String,
        trim: true,
    },
    spesific_id: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 15,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Object,
        required: true,
        default: {
            staffonlyyou: true,
            staffcreate: false,
            staffedit: false,
            stafflist: false,
            staffdelete: false,

            customersonlyyou: true,
            customerscreate: false,
            customersedit: false,
            customerslist: false,
            customersdelete: false,

            productsonlyyou: true,
            productscreate: false,
            productsedit: false,
            productslist: false,
            productsdelete: false,

            bankaccountsonlyyou: true,
            bankaccountscreate: false,
            bankaccountsedit: false,
            bankaccountslist: false,
            bankaccountsdelete: false,

            customersgrouponlyyou: true,
            customersgroupcreate: false,
            customersgroupedit: false,
            customersgrouplist: false,
            customersgroupdelete: false,

            invoicesonlyyou: true,
            invoicescreate: false,
            invoicesedit: false,
            invoiceslist: false,
            invoicesdelete: false,

            paymentsonlyyou: true,
            paymentscreate: false,
            paymentsedit: false,
            paymentslist: false,
            paymentsdelete: false,

            productsCategoriesonlyyou: true,
            productsCategoriescreate: false,
            productsCategoriesedit: false,
            productsCategorieslist: false,
            productsCategoriesdelete: false,

            expensesonlyyou: true,
            expensescreate: false,
            expensesedit: false,
            expenseslist: false,
            expensesdelete: false,

            expensescategoriesonlyyou: true,
            expensescategoriescreate: false,
            expensescategoriesedit: false,
            expensescategorieslist: false,
            expensescategoriesdelete: false,

            paymentsaccountsonlyyou: true,
            paymentsaccountscreate: false,
            paymentsaccountsedit: false,
            paymentsaccountslist: false,
            paymentsaccountsdelete: false,
        }
    },
    resetPasswordToken: {
        type: String,
        default: "asdasdasdas--example--6yhjkoıu7654esxcvbhythbvfde45ty",
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now(),
    },
});

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err) return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        else {
            if (!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
