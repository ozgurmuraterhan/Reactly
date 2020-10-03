const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let PaymentsMethod = require("../models/paymentsmethods.model");
let User = require("../models/user.model");

const title = "PaymentsMethod";
const roleTitle = "payments";

// get all items
router.route("/").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         PaymentsMethod.find()
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
         PaymentsMethod.find({ "created_user.id": `${req.user._id}` })
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
         new PaymentsMethod(req.body)
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
         PaymentsMethod.aggregate([
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
         PaymentsMethod.findById(req.params.id)
            .then((data) => res.json(data))
            .catch((err) =>
               res.status(400).json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         PaymentsMethod.findOne({
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
         PaymentsMethod.findByIdAndDelete(req.params.id)
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
         PaymentsMethod.deleteOne({
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
         PaymentsMethod.findByIdAndUpdate(req.params.id, req.body)
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
         PaymentsMethod.findOneAndUpdate(
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
