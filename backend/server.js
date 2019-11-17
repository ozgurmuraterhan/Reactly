const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

app.use(cors());

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false  });

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("connection MongoDB")
})
  

const exerciseRouter = require("./routes/exercises")
const usersRouter = require("./routes/users")
const customerRouter = require("./routes/customers")
const countryRouter = require("./routes/country")
const customersGroupsRouter = require("./routes/customersGroups") 
const productCategoriesRouter = require("./routes/productCategories") 
const productsRouter = require("./routes/products") 
const invoicesRouter = require("./routes/invoices") 
const BankAccountsRouter = require("./routes/bankAccounts") 
const PaymentsRouter = require("./routes/payments") 


app.use(bodyParser.json());


app.use('/exercises', exerciseRouter);
app.use('/users', usersRouter);
app.use('/customers', customerRouter);
app.use('/country', countryRouter)
app.use('/customersgroups', customersGroupsRouter)
app.use('/productcategories', productCategoriesRouter)
app.use('/products', productsRouter)
app.use('/invoices', invoicesRouter)
app.use('/bankaccounts', BankAccountsRouter)
app.use('/payments', PaymentsRouter)
  

app.listen(port, ()=>{
    console.log("sever is runnin port: " + port) 
}) 
