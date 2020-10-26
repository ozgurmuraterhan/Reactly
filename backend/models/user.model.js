const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
   created_user: {
      required: true,
      type: Object,
   },
   name: {
      type: String,
      required: true,
   },
   surname: {
      type: String,
      required: true,
   },
   phone: {
      type: String,
      required: true,
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
