const router = require("express").Router();
let User = require('../models/user.model')

const title = "User"

router.route('/').get((req,res,next)=>{
    User.find()
    .then(users=> res.json(users))
    .catch(err=> res.json(
        { 
            messagge:'Error: ' + err,
            variant:'error'
        }
    ))})

router.route('/add').post((req,res,next)=>{

    const {username , description}     = req.body
    //or 
    //const username   = req.body.username
    //const description   = req.body.description
    //same thing

    const newUser = new User({
        username,
        description
    })
    
    newUser.save()
    .then(()=>res.json(
        { 
            messagge:title + ' Added',
            variant:'success'
            
        }
    ))
    .catch(err=> res.json(
        { 
            messagge:'Error: ' + err,
            variant:'error'
        }
    ))


})

router.route('/:id').get((req,res,next)=>{
    User.findById(req.params.id)
    .then(users=> res.json(users))
    .catch(err=> res.json(
        { 
            messagge:'Error: ' + err,
            variant:'error'
        }
    ))
})

router.route('/:id').delete((req,res)=>{
    User.findByIdAndDelete(req.params.id)
    .then(user=> res.json(
        { 
            messagge:title + ' Deleted',
            variant:'info'
            
        }
    ))
    .catch(err=> res.json(
        { 
            messagge:'Error: ' + err,
            variant:'error'
        }
    ))})

router.route('/:id').post((req,res,next)=>{
    User.findById(req.params.id)
    .then(users=> {
        users.username = req.body.username;
        users.description = req.body.description;
        users.save()
    })
    .then(()=> res.json(
        { 
            messagge:title + ' Updated',
            variant:'success'
            
        }
    ))
    .catch(err=> res.json(
        { 
            messagge:'Error: ' + err,
            variant:'error'
        }
    ))
})





module.exports = router