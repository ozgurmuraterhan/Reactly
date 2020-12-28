const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path")
const compression = require('compression');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
   console.log("connection MongoDB");
});

const userRouter = require("./routes/user");
const staffRouter = require("./routes/staff");
//const customerRouter = require("./routes/customers");
const countryRouter = require("./routes/country");
const customersGroupsRouter = require("./routes/customersGroups");
const productCategoriesRouter = require("./routes/productCategories");
const productsRouter = require("./routes/products");
const invoicesRouter = require("./routes/invoices");
const BankAccountsRouter = require("./routes/bankAccounts");
const PaymentsMethodsRouter = require("./routes/paymentsmethods");
const PaymentsAccounts = require("./routes/paymentsaccounts");
const Expensescategories = require("./routes/expensescategories");
const Expenses = require("./routes/expenses");

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/staff", staffRouter);
//app.use("/customers", customerRouter);
app.use("/country", countryRouter);
app.use("/customersgroups", customersGroupsRouter);
app.use("/productcategories", productCategoriesRouter);
app.use("/products", productsRouter);
app.use("/invoices", invoicesRouter);
app.use("/bankaccounts", BankAccountsRouter);
app.use("/paymentsmethods", PaymentsMethodsRouter);
app.use("/paymentsaccounts", PaymentsAccounts);
app.use("/expensescategories", Expensescategories);
app.use("/expenses", Expenses);


app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


app.listen(port, () => {
   console.log("sever is runnin port: " + port);
});
