const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let BankAccounts = require("../models/bankaccounts.model");
let User = require("../models/user.model");

const title = "Bank Accounts";
const roleTitle = "bankaccounts";


// statistic
router.route("/deneme").get((req, res, next) => {
   BankAccounts.aggregate(
      [{ "$addFields": { "userId": { "$toString": "$_id" } } },
      { "$addFields": { "userId2": "account_name" } },

      {
         "$lookup": {
            "from": "paymentsaccounts",
            "localField": "userId",
            "foreignField": "account_name.value",
            "as": "output"
         }
      },
      { $unwind: "$output" },

      {
         "$project": {
            account_name: 1,
            amount: { $sum: "$output.amount" },
            status: 1,
            type: { $cond: { if: "$output.type", then: { "giren": { "$sum": "$output.amount" } }, else: { "cikan": { "$sum": "$output.amount" } } } }
         }
      },
      {
         $group: {
            _id: { "account_name": "$account_name", "_id": "$_id", "status": "$status" },
            in: { $sum: "$type.giren" },
            out: { $sum: "$type.cikan" },
         },
      },
      { $unwind: "$_id.account_name" },
      {
         "$project": {
            _id: "$_id._id",
            account_name: "$_id.account_name",
            status: "$_id.status",
            in: "$in",
            out: "$out",
            total: {
               $subtract: ["$in", "$out"]
            }
         }
      },


      ]
   ).then((data) => res.json(data));
});



// get all items
router.route("/").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         BankAccounts.aggregate(
            [{ "$addFields": { "userId": { "$toString": "$_id" } } },
            {
               "$lookup": {
                  "from": "paymentsaccounts",
                  "localField": "userId",
                  "foreignField": "account_name.value",
                  "as": "output"
               }
            },
            { $unwind: "$output" },
            {
               "$project": {
                  account_name: 1,
                  amount: { $sum: "$output.amount" },
                  status: 1,
                  type: { $cond: { if: "$output.type", then: { "inn": { "$sum": "$output.amount" } }, else: { "outt": { "$sum": "$output.amount" } } } }
               }
            },
            {
               $group: {
                  _id: { "account_name": "$account_name", "_id": "$_id", "status": "$status" },
                  in: { $sum: "$type.inn" },
                  out: { $sum: "$type.outt" },
               },
            },
            { $unwind: "$_id.account_name" },
            {
               "$project": {
                  _id: "$_id._id",
                  account_name: "$_id.account_name",
                  status: "$_id.status",
                  in: "$in",
                  out: "$out",
                  total: {
                     $subtract: ["$in", "$out"]
                  }
               }
            },
            ]
         )
            .then((data) => {
               res.json(data);
            })
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         BankAccounts.find({ "created_user.id": `${req.user._id}` })
            .then((data) => {
               res.json(data);
            })
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else {
         res.status(403).json({
            message: {
               messagge: "You are not authorized, go away!",
               variant: "error",
            },
         });
      }
   });
});

// post new items
router.route("/add").post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "create"]) {
         new BankAccounts(req.body)
            .save()
            .then(() =>
               res.json({
                  messagge: title + " Added",
                  variant: "success",
               })
            )
            .catch((err) =>
               res.json({
                  messagge: " Error: " + err,
                  variant: "error",
               })
            );
      } else {
         res.status(403).json({
            message: {
               messagge: "You are not authorized, go away!",
               variant: "error",
            },
         });
      }
   });
});

//group name statistic
router.route("/statistic").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         BankAccounts.aggregate([
            { $unwind: "$group_id" },
            {
               $group: {
                  _id: "$group_id.label",
                  count: { $sum: 1 },
               },
            },
         ]).then((data) => res.json(data));
      }
   });
});

// fetch data by id
router.route("/:id").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         BankAccounts.findById(req.params.id)
            .then((data) => res.json(data))
            .catch((err) =>
               res.status(400).json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         BankAccounts.findOne({
            _id: req.params.id,
            "created_user.id": `${req.user._id}`,
         })
            .then((data) => {
               if (data) {
                  res.json(data);
               } else {
                  res.status(403).json({
                     message: {
                        messagge: "You are not authorized, go away!",
                        variant: "error",
                     },
                  });
               }
            })
            .catch((err) =>
               res.status(400).json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else {
         res.status(403).json({
            message: {
               messagge: "You are not authorized, go away!",
               variant: "error",
            },
         });
      }
   });
});

// delete data by id
router.route("/:id").delete(passport.authenticate("jwt", { session: false }), (req, res) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "delete"]) {
         BankAccounts.findByIdAndDelete(req.params.id)
            .then((data) =>
               res.json({
                  messagge: title + " Deleted",
                  variant: "info",
               })
            )
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         BankAccounts.deleteOne({
            _id: req.params.id,
            "created_user.id": `${req.user._id}`,
         })
            .then((resdata) => {
               if (resdata.deletedCount > 0) {
                  res.json({
                     messagge: title + " delete",
                     variant: "success",
                  });
               } else {
                  res.status(403).json({
                     message: {
                        messagge: "You are not authorized, go away!",
                        variant: "error",
                     },
                  });
               }
            })
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else {
         res.status(403).json({
            message: {
               messagge: "You are not authorized, go away!",
               variant: "error",
            },
         });
      }
   });
});

// update data by id
router.route("/:id").post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "edit"]) {
         BankAccounts.findByIdAndUpdate(req.params.id, req.body)
            .then(() =>
               res.json({
                  messagge: title + " Update",
                  variant: "success",
               })
            )
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         BankAccounts.findOneAndUpdate(
            {
               _id: req.params.id,
               "created_user.id": `${req.user._id}`,
            },
            req.body
         )
            .then((resdata) => {
               if (resdata) {
                  res.json({
                     messagge: title + " Update",
                     variant: "success",
                  });
               } else {
                  res.json({
                     messagge: " You are not authorized, go away!",
                     variant: "error",
                  });
               }
            })
            .catch((err) =>
               res.json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else {
         res.status(403).json({
            message: {
               messagge: "You are not authorized, go away!",
               variant: "error",
            },
         });
      }
   });
});

module.exports = router;
