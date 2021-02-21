const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
let User = require("../models/user.model");

const title = "User";
const roleTitle = "customers";

// get all items
router.route("/").get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
   User.find({ username: req.user.username }).then((data) => {
      const rolesControl = data[0].role;
      if (rolesControl[roleTitle + "list"]) {
         User.find({ 'isCustomer': true },)
            .then((data) => { res.json(data); })
            .catch((err) =>
               res.json({
                  messagge: 'Error: ' + err,
                  variant: 'error',
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         User.find({
            $and: [
               { 'isCustomer': true },
               { "created_user.id": `${req.user._id}` },
            ],
         })

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
         new User(req.body)
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
         User.aggregate([
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
         User.findOne({
            $and: [
               { _id: req.params.id },
               { 'isCustomer': true },
            ],
         })
            .then((data) => res.json(data))
            .catch((err) =>
               res.status(400).json({
                  messagge: "Error: " + err,
                  variant: "error",
               })
            );
      } else if (rolesControl[roleTitle + "onlyyou"]) {
         User.findOne({
            _id: req.params.id,
            "created_user.id": `${req.user._id}`,
            'isCustomer': true,
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
         User.deleteOne({
            $and: [
               { _id: req.params.id },
               { 'isCustomer': true },
            ],
         })
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
         User.deleteOne({
            _id: req.params.id,
            "created_user.id": `${req.user._id}`,
            'isCustomer': true,
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
         User.findByIdAndUpdate(req.params.id, req.body)
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
         User.findOneAndUpdate(
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


router.post(
   '/updatePasswordCustomer',
   passport.authenticate('jwt', { session: false }),
   (req, res) => {
      User.find({ username: req.user.username }).then((data) => {
         const rolesControl = data[0].role;
         if (rolesControl['superadmin'] || req.body._id == req.user._id) {
            User.findOne({
               _id: req.body._id,
            }).then((user) => {
               if (user != null) {
                  console.log('user exists in db');
                  bcrypt
                     .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                     .then((hashedPassword) => {
                        User.findOneAndUpdate(
                           {
                              _id: req.body._id,
                           },
                           {
                              password: hashedPassword,
                           }
                        )
                           .then(() => {
                              res.json({
                                 messagge: title + ' Password Update',
                                 variant: 'success',
                              });
                           })
                           .catch((err) => {
                              console.log(err);
                              res.json({
                                 messagge: 'Error: ' + err,
                                 variant: 'error',
                              });
                           });
                     });
               } else {
                  console.error('no user exists in db to update');
                  res.status(401).json('no user exists in db to update');
               }
            });
         } else {
            res.json({
               messagge: ' You are not authorized, go away!',
               variant: 'error',
            });
         }
      });
   }
);


module.exports = router;
