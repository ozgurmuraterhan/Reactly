const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let Invoice = require("../models/invoice.model");
let User = require("../models/user.model");
const { dateFormat } = require("highcharts");
let ObjectId = require("mongodb").ObjectId;
const Moment = require("moment");

const title = "Invoice";
const roleTitle = "invoices";


// statistic
router.route("/statist222ic").get((req, res, next) => {
   Invoice.aggregate([
      { $unwind: "$group_id" },
      {
         $group: {
            _id: "$group_id.label",
            count: { $sum: 1 },
         },
      },
   ]).then((data) => res.json(data));

});

// get all items
router.route("/").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         Invoice.find()
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
         Invoice.find({ "created_user.id": `${req.user._id}` })
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
         new Invoice(req.body)
            .save(
               function (err, room) {
                  if (err) {
                     res.json({
                        messagge: " Error: " + err,
                        variant: "error",
                     })
                  } else {
                     res.json({
                        _id: room._id,
                        messagge: title + " Added",
                        variant: "success",
                     })
                  }
               })
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

// payments list
router.route("/payments/:id").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         Invoice.find({ _id: req.params.id })
            .then((data2) => {
               res.json(data2);
            })
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

// statistic
router.route("/statistic").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         Invoice.aggregate([
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
         Invoice.findById(req.params.id)
            .then((data) => res.json(data))
            .catch((err) =>
               res.status(400).json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         Invoice.findOne({
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
      if (rolesControl[roleTitle + "remove"]) {
         Invoice.findByIdAndDelete(req.params.id)
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
         Invoice.deleteOne({
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
         Invoice.findByIdAndUpdate(req.params.id, req.body)
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
         Invoice.findOneAndUpdate(
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

// update datapayments by id
router.route("/editpayments/:id").post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "edit"]) {
         Invoice.updateMany(
            {
               "payments._id": ObjectId(req.params.id),
            },
            { $set: { "payments.$.amount": req.body.amount } }
         ).catch((err) => console.log(err));
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

// add datapayments by id
router.route("/addpayments/:id").post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "create"]) {


         Invoice.updateMany(
            {
               _id: ObjectId(req.params.id),
            },
            {
               $push: {
                  payments: {
                     amount: req.body.amount,
                     account_name: req.body.account_name,
                     paid_data: Moment(Date.now())._d,
                     note: req.body.note,
                     _id: ObjectId(),
                  },
               },
            }
         ).catch((err) => console.log(err));
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

// update datapayments by id
router.route("/deletepayments/:id").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "edit"]) {
         Invoice.updateMany({}, { $pull: { payments: { _id: ObjectId(req.params.id) } } }, { multi: true }).catch((err) => console.log(err));
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
