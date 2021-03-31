import React, { forwardRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";

import Moment from "moment";

import MaterialTable from "material-table";
import Select2 from "@material-ui/core/Select";

import {
   FormControl,
   FormGroup,
   FormHelperText,
   Card,
   Button,
   Typography,
   TextField,
   Tooltip,
   FormLabel,
   Switch,
   FormControlLabel,
   InputAdornment,
   RadioGroup,
   Radio,
   TableRow,
   TableCell,
   TableBody,
   Table,
   MenuItem,
   Grid,
   InputLabel,
   Dialog,
   DialogTitle,
   Input,
   DialogContent,
   DialogActions,
} from "@material-ui/core";

import {
   AddBox,
   PlaylistAddCheck,
   ContactMail,
   Edit,
   ArrowUpward,
   Check,
   ChevronLeft,
   ChevronRight,
   Clear,
   DeleteOutline,
   FilterList,
   FirstPage,
   LastPage,
   Remove,
   SaveAlt,
   Search,
   ViewColumn,
   Receipt,
   Save,
} from "@material-ui/icons";

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import "../../assets/css/style.css";

export default function ExpenseCreate(props) {
   const [t] = useTranslation();
   const history = useHistory();
   const { enqueueSnackbar } = useSnackbar();
   const { user } = useContext(AuthContext);

   const [dataCustomers, seTdataCustomers] = useState([]);
   const [dataProducts, seTdataProducts] = useState([]);
   const [dataBankAccount, seTdataBankAccount] = useState("");

   const [changeNewGroupNameJust, seTchangeNewGroupNameJust] = useState("");
   const [findCustomersGroup, seTfindCustomersGroup] = useState([]);
   const [gropBoxOpen, seTgropBoxOpen] = useState(false);

   const [selectedDefaultCustomer, seTselectedDefaultCustomer] = useState(0);
   const [dataPaymentsMethod, seTdataPaymentsMethod] = useState("");
   const [selectedDefaultProduct, seTselectedDefaultProduct] = useState([]);

   const [product, seTproduct] = useState({
      product_description: "",
      product_name: "",
      sale_price: 0,
      product_vat: 0,
      product_discount: 0,
      amount: 0,
   });

   const [quantity, seTquantity] = useState(1);
   const [unit, seTunit] = useState("");
   const [quantity_name, seTquantity_name] = useState(t("Qty"));
   const [items, seTitems] = useState([]);
   const [anyAmount, seTanyAmount] = useState(0);

   const [totalAll, seTtotalAll] = useState({
      total: 0,
      subtotal: 0,
      taxtotal: 0,
      discountType: "%",
      discount: 0,
      discountValue: 0,
   });

   const [state, seTstate] = useState({
      serie: "A",
      no: "",
      created: Date.now(),
      bank_account: "",
      note: "",
      due_date: Date.now(),
      paid_date: Date.now(),
      selectedGroupItems: [],

      default_payment_method: "",
   });

   const columns = [
      {
         title: t("productName"),
         field: "product_name",

      },
      {
         title: t("Description"),
         field: "product_description",

      },
      {
         title: t("Quantity"),
         field: "quantity",
         type: "numeric",
         render: (rowData) => <div>{`${rowData.quantity} ${rowData.quantity_name} ${rowData.unit}`}</div>,

      },
      {
         title: t("Price"),
         field: "price",
         type: "numeric",

      },

      {
         title: t("Product Tax"),
         field: "tax",
         type: "numeric",
         render: (rowData) => <div>{`${rowData.tax} %`}</div>,

      },
      {
         title: t("Amount"),
         field: "amount",
         type: "numeric",
         editable: "never"
      },
   ];

   const tableIcons = {
      Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
      Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
      DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
      Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
      ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
      ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
   };

   function getProductsF() {
      axios
         .get("/products")
         .then((response) => {
            if (response.data.length > 0) {
               const details = [];
               for (const i in response.data) {
                  details.push({
                     label: response.data[i].product_name,
                     value: response.data[i]._id,
                  });
               }
               seTdataProducts(details);
            }
         })
         .catch((err) => console.log(err));
   }

   function getCustomersF() {
      axios
         .get("/customers")
         .then((response) => {
            if (response.data.length > 0) {
               const details = [];
               for (const i in response.data) {
                  details.push({
                     label: response.data[i].company,
                     value: response.data[i]._id,
                  });
               }
               seTdataCustomers(details);
            }
         })
         .catch((err) => console.log(err));
   }

   const handleChangeCustomer = (selectedOption) => {
      seTselectedDefaultCustomer({
         label: selectedOption.label,
         value: selectedOption.value,
      });
   };

   const onChangeFquantity = (e) => {
      const amount = Number(
         (product.sale_price * e.target.value - product.sale_price * e.target.value * (0 + product.product_discount / 100)) *
         (1 + product.product_vat / 100)
      ).toFixed(2);
      seTquantity(e.target.value);
      seTproduct({ ...product, amount: amount });
   };

   const onChangeFprice = (e) => {
      const amount = Number(
         (e.target.value * quantity - e.target.value * quantity * (0 + product.product_discount / 100)) * (1 + product.product_vat / 100)
      ).toFixed(2);
      seTproduct({ ...product, sale_price: e.target.value, amount: amount });
   };

   const onChangeFproduct_vat = (e) => {
      const amount = Number(
         (product.sale_price * quantity - product.sale_price * quantity * (0 + product.product_discount / 100)) * (1 + e.target.value / 100)
      ).toFixed(2);
      seTproduct({ ...product, product_vat: e.target.value, amount: amount });
   };

   function getBankAccountF() {
      axios
         .get("/bankaccounts")
         .then((response) => {
            if (response.data.length > 0) {
               const details = [];
               for (const i in response.data) {
                  details.push({
                     label: response.data[i].account_name,
                     value: response.data[i]._id,
                  });
               }
               seTdataBankAccount(details);
            }
         })
         .catch((err) => console.log(err));
   }
   const onClickAddItem = (e) => {
      e.preventDefault();
      items.push({
         product_name: product.product_name,
         product_description: product.product_description,
         quantity_name,
         quantity,
         unit,
         price: product.sale_price,
         tax: product.product_vat,
         discount: product.product_discount,
         amount: product.amount,
      });

      seTitems(items);

      items.map((item) =>
         seTtotalAll({
            ...totalAll,
            total: totalAll.total + item.amount,
            subtotal: totalAll.subtotal + (item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100)),
            taxtotal:
               (item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100)) * (1 + item.tax / 100) -
               (item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100)),
         })
      );
      totalCebirItems();
   };

   function getExpensesCategories() {
      axios
         .get("/expensescategories/")
         .then((res) => {
            if (res.data.length > 0) {
               const details = [];
               for (const i in res.data) {
                  details.push({
                     label: res.data[i].name,
                     value: res.data[i]._id,
                  });
               }

               seTfindCustomersGroup(details);
            }
         })
         .catch((err) => console.log(err));
   }

   function totalCebirItems() {
      let total2 = 0;
      let subtotal2 = 0;
      let taxtotal2 = 0;
      const items2 = [];

      seTtotalAll({
         ...totalAll,
         taxtotal: 0,
      });

      items.map((item) => {
         total2 = total2 + parseInt(item.amount).toFixed(2);
         subtotal2 = subtotal2 + (item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100));
         taxtotal2 =
            taxtotal2 +
            ((item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100)) * (1 + item.tax / 100) -
               (item.price * item.quantity - item.price * item.quantity * (0 + item.discount / 100)));

         items2.push({
            product_name: item.product_name,
            product_description: item.product_description,
            quantity_name: item.quantity_name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            discount: item.discount,
            tax: item.tax,
            amount: Number(
               item.price * item.quantity * (1 + item.tax / 100) -
               (item.price * item.quantity * (0 + item.discount / 100) * (1 + item.tax / 100)).toFixed(0)
            ).toFixed(2),
         });
      });

      seTitems(items2);

      if (totalAll.discountType === "%") {
         seTtotalAll({
            ...totalAll,
            taxtotal: taxtotal2,
            subtotal: subtotal2,
            discountValue: (taxtotal2 + subtotal2) * (1 + totalAll.discount / 100) - (taxtotal2 + subtotal2),
            total: taxtotal2 + subtotal2 - ((taxtotal2 + subtotal2) * (1 + totalAll.discount / 100) - (taxtotal2 + subtotal2)),
            discount: totalAll.discount,
         });
      } else {
         seTtotalAll({
            ...totalAll,
            taxtotal: taxtotal2,
            subtotal: subtotal2,
            discountValue: totalAll.discountValue,
            total: taxtotal2 + subtotal2 - totalAll.discountValue,
            discount: totalAll.discount,
         });
      }
   }

   // open new group dialog save
   const saveHandleNewGroup = () => {
      const data = {
         created_user: { name: user.name, id: user.id },
         name: changeNewGroupNameJust,
      };

      axios
         .post("/expensescategories/add", data)
         .then((res) => {
            if (res.data.variant == "error") {
               enqueueSnackbar(t("Expenses Category Not Added") + res.data.messagge, { variant: res.data.variant });
            } else {
               enqueueSnackbar(t("Expenses Category Added"), {
                  variant: res.data.variant,
               });
            }

            getExpensesCategories();
         })
         .catch((err) => console.log(err));

      seTgropBoxOpen(false);
   };

   // componentDidMount = useEffect
   useEffect(() => {
      getCustomersF();
      getBankAccountF();
      getExpensesCategories();
      getProductsF();

   }, []);

   const onSubmit = (e) => {
      e.preventDefault();
      var paymentsArray = [
         {
            amount: totalAll.total.toFixed(2),
            paid_date: Moment(state.paid_date)._d,
            account_name: state.bank_account,
         },
      ];

      const Expense = {
         created_user: { name: user.name, id: user.id },
         billable: 0,
         no: state.no,
         created: Moment(state.created)._d,
         paid_date: Moment(state.paid_date)._d,
         category_id: state.selectedGroupItems,
         customer_id: selectedDefaultCustomer,
         note: state.note,
         subtotal: totalAll.subtotal.toFixed(2),
         taxtotal: totalAll.taxtotal.toFixed(2),
         total: totalAll.total.toFixed(2),
         discount: totalAll.discount,
         discountType: totalAll.discountType,
         discountValue: totalAll.discountValue,
         items: items,
         quantity,
         quantity_name,
         bank_account: state.bank_account,

         payments: paymentsArray,
      };

      axios
         .post("/expenses/add", Expense)
         .then((res) => {
            if (res.data.variant === "error") {
               enqueueSnackbar(t("Expense Not Added") + res.data.messagge, {
                  variant: res.data.variant,
               });
            } else {

               const paymentsPrime = {
                  created_user: { name: user.name, id: user.id },
                  customer_id: selectedDefaultCustomer[0],
                  type: 0,
                  amount: totalAll.total.toFixed(2),
                  paid_date: Moment(state.paid_date)._d,
                  account_name: state.bank_account,
                  created: Moment(state.created)._d,
                  note: state.note,
                  expenses_id: res.data._id,
                  invoices_id: ""
               }


               axios
                  .post(`/paymentsaccountsdetail/add`, paymentsPrime)
                  .then((res) => {
                     if (res.data.variant === "error") {
                        enqueueSnackbar(t("Not Added Payments") + res.data.messagge, {
                           variant: res.data.variant,
                        });
                     } else {
                        enqueueSnackbar(t("Add Payments") + res.data.messagge, {
                           variant: res.data.variant,
                        });
                        // navigate 
                        history.push("/expenseslist");

                     }
                  })
                  .catch((err) => console.log(err));

               enqueueSnackbar(t("Expense Added") + res.data.messagge, {
                  variant: res.data.variant,
               });
               // navigate
               //history.push("/expenseslist");
            }
         })
         .catch((err) => console.log(err));
   };

   const handleChangeProduct = (selectedOption) => {
      axios
         .get(`/products/${selectedOption.value}`)
         .then((response) => {
            const productData = response.data;
            const amount = productData.sale_price * quantity * (1 + productData.product_vat / 100);
            seTproduct({
               ...product,
               product_description: productData.product_description,
               product_name: productData.product_name,
               sale_price: productData.sale_price,
               product_vat: productData.product_vat,
               amount: amount,
            });
         })
         .catch((err) => console.log(err));
      seTselectedDefaultProduct({
         label: selectedOption.label,
         value: selectedOption.value,
      });
   };

   return (
      <div className="containerP">
         <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
            <Grid item container spacing={3}>
               <Grid item container md={10} className="panelGridRelative">
                  <Card className="panelLargeIcon">
                     <Receipt fontSize="large" />
                  </Card>
                  <Card className="listViewPaper">
                     <Typography component="h1" variant="h6" color="inherit" noWrap className="typography">
                        {t("Expense Create")}
                     </Typography>
                     <FormControlLabel
                        style={{ float: "right", display: selectedDefaultCustomer == 0 ? "none" : "block" }}
                        control={
                           <Switch
                              checked={state.billable}
                              onChange={() => {
                                 seTstate({ ...state, billable: !state.billable });
                              }}
                              color="primary"
                           />
                        }
                        label={t("Billable")}
                     />
                     <Grid item container sm={12}>
                        <Grid container item sm={4} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <label className="selectLabel">{t("customer")}</label>
                                 <Select
                                    required
                                    placeholder={t("selectCustomer")}
                                    value={selectedDefaultCustomer}
                                    options={dataCustomers}
                                    onChange={handleChangeCustomer}
                                 />
                                 <FormHelperText>{t("youNeedaCustomerName")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                        <Grid container item sm={4} spacing={0}>
                           <Grid container item sm={1} spacing={0}>
                              <Tooltip title={t("Create New Category")}>
                                 <AddBox
                                    onClick={() => {
                                       seTgropBoxOpen(true);
                                    }}
                                    fontSize="large"
                                    style={{
                                       margin: "13px 0px 0 9px",
                                       fontSize: "38pt",
                                    }}
                                 />
                              </Tooltip>
                           </Grid>
                           <Grid container item sm={11} spacing={0}>
                              <FormGroup className="FormGroup">
                                 <InputLabel htmlFor="group_id" className="InputLabel" style={{ margin: "3px" }}>
                                    {" "}
                                 </InputLabel>
                                 <FormControl>
                                    <Select
                                       isMulti
                                       styles={{
                                          singleValue: (base) => ({
                                             ...base,
                                             color: "white",
                                          }),
                                       }}
                                       placeholder={t("Selected Cateories")}
                                       value={state.selectedGroupItems}
                                       options={findCustomersGroup}
                                       onChange={(selectedOption) => {
                                          seTstate({
                                             ...state,
                                             selectedGroupItems: selectedOption,
                                          });
                                       }}
                                    />
                                 </FormControl>
                              </FormGroup>
                           </Grid>
                        </Grid>

                        <Grid container item sm={4} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                       inputVariant="outlined"
                                       margin="dense"
                                       id="date-picker-dialog"
                                       label={t("Paid Date")}
                                       format="dd/MM/yyyy"
                                       value={state.paid_date}
                                       disableFuture={true}
                                       onChange={(date) => {
                                          seTstate({
                                             ...state,
                                             paid_date: date,
                                          });
                                       }}
                                       KeyboardButtonProps={{
                                          "aria-label": "change date",
                                       }}
                                       InputLabelProps={{
                                          shrink: true,
                                       }}
                                    />
                                 </MuiPickersUtilsProvider>
                                 <FormHelperText>{t("You need Paid Date")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                        <Grid container item sm={4} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <label className="selectLabel">{t("selectBankAccount")}</label>
                                 <Select
                                    placeholder={t("selectBankAccount")}
                                    value={state.bank_account}
                                    style={{
                                       width: "100%",
                                       marginTop: "-6px",
                                    }}
                                    options={dataBankAccount}
                                    onChange={(selectedOption) => {
                                       seTstate({
                                          ...state,
                                          bank_account: selectedOption,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("youNeedaselectBankAccount")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                        <Grid container item sm={4} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    required
                                    label={t("Referance Number")}
                                    variant="outlined"
                                    margin="dense"
                                    value={state.no}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          no: e.target.value,
                                       });
                                    }}
                                    validators={["isNumber"]}
                                    errorMessages={[t("thisIsNotNumber")]}
                                 />
                                 <FormHelperText>{t("youNeedaInvoiceNumber")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                        <Grid container item sm={4} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    label={t("Note")}
                                    variant="outlined"
                                    margin="dense"
                                    value={state.note}
                                    multiline
                                    rows={1}
                                    rowsMax={4}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          note: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("Note")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                        <Grid
                           item
                           container
                           sm={12}
                           spacing={0}
                           style={{
                              borderTop: "1px solid #ddd",
                              margin: "15px 0",
                           }}
                        >
                           <Grid item container sm={3} spacing={0}>
                              <FormGroup className="FormGroup">
                                 <FormControl>
                                    <Select
                                       placeholder={t("addProduct")}
                                       value={selectedDefaultProduct}
                                       options={dataProducts}
                                       onChange={handleChangeProduct}
                                       styles={{
                                          control: (base) => ({
                                             ...base,
                                             color: "white",
                                             width: "100%",
                                             border: 0,
                                             borderBottom: "1px solid #949494",
                                             borderRadius: 0,
                                             marginTop: "10px",
                                          }),
                                       }}
                                    />
                                    <FormHelperText>{t("youNeedaProductName")}</FormHelperText>
                                 </FormControl>
                              </FormGroup>
                           </Grid>
                           <Grid item container sm={3} spacing={0} />

                           <Grid item container sm={6} spacing={0}>
                              <RadioGroup
                                 value={quantity_name}
                                 onChange={(event) => {
                                    seTquantity_name(event.target.value);
                                 }}
                                 row
                              >
                                 <label
                                    style={{
                                       marginTop: "31px",
                                       marginRight: "10px",
                                    }}
                                 >
                                    {" "}
                                    {t("showQuantityAs")} :{" "}
                                 </label>
                                 <FormControlLabel value="Qty" control={<Radio />} label="Qty" />
                                 <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                                 <FormControlLabel value="Qty/Hours" control={<Radio />} label="Qty/Hours" />
                              </RadioGroup>
                           </Grid>
                           <Grid
                              container
                              item
                              sm={12}
                              spacing={0}
                              style={{
                                 borderTop: "1px solid #ddd",
                                 marginBottom: "25px",
                              }}
                           />
                           <Grid container item sm={3} spacing={0}>
                              <FormControl
                                 style={{
                                    width: "90%",
                                    paddingLeft: "25px",
                                 }}
                              >
                                 <TextValidator
                                    multiline
                                    label={t("productName")}
                                    value={product.product_name}
                                    onChange={(e) => {
                                       seTproduct({
                                          ...product,
                                          product_name: e.target.value,
                                       });
                                    }}
                                 />
                              </FormControl>
                           </Grid>
                           <Grid container item sm={3} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator
                                    multiline
                                    label={t("description")}
                                    value={product.product_description}
                                    rows={1}
                                    rowsMax={4}
                                    onChange={(e) => {
                                       seTproduct({
                                          ...product,
                                          product_description: e.target.value,
                                       });
                                    }}
                                 />
                              </FormControl>
                           </Grid>
                           <Grid container item sm={1} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator type="number" label={t(quantity_name)} value={quantity} onChange={onChangeFquantity} />
                              </FormControl>
                           </Grid>
                           <Grid container item sm={1} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator
                                    label={t("unit")}
                                    value={unit}
                                    onChange={(e) => {
                                       seTunit(e.target.value);
                                    }}
                                 /*InputLabelProps={{
                                    shrink: true,
                                 }}*/
                                 />
                                 <FormHelperText>{t("youNeedaProductUnit")}</FormHelperText>
                              </FormControl>
                           </Grid>
                           <Grid container item sm={1} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator type="number" label={t("price")} value={product.sale_price} onChange={onChangeFprice} />
                              </FormControl>
                           </Grid>

                           <Grid container item sm={1} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator
                                    type="number"
                                    label={t("tax")}
                                    value={product.product_vat}
                                    onChange={onChangeFproduct_vat}
                                    InputProps={{
                                       endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                 />
                              </FormControl>
                           </Grid>
                           <Grid container item sm={1} spacing={0}>
                              <FormControl style={{ width: "90%" }}>
                                 <TextValidator disabled type="number" label={t("amount")} value={product.amount} />
                              </FormControl>
                           </Grid>
                           <Grid container item sm={1} spacing={0}>
                              <FormControl>
                                 <Button color="primary" onClick={onClickAddItem} disabled={!product.amount}>
                                    <Tooltip title={t("Add Expense item")}>
                                       <PlaylistAddCheck fontSize="large" />
                                    </Tooltip>
                                 </Button>
                              </FormControl>
                           </Grid>
                        </Grid>
                        <Grid container item sm={12} spacing={0}>
                           <MaterialTable
                              title="Cell Editable Preview"
                              columns={columns}
                              data={items}
                              icons={tableIcons}

                              cellEditable={{
                                 onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                                    return new Promise((resolve, reject) => {
                                       const data = [...items]
                                       data[rowData.tableData.id][columnDef.field] = newValue
                                       seTitems(data)
                                       totalCebirItems()
                                       setTimeout(resolve, 0);
                                    });
                                 }
                              }}

                              editable={{
                                 onRowDelete: (oldData) =>
                                    new Promise((resolve, reject) => {
                                       {
                                          const index = items.indexOf(oldData);
                                          items.splice(index, 1);
                                          seTitems(items);
                                          totalCebirItems();
                                       }
                                       resolve();
                                    }),
                              }}

                              style={{
                                 width: "100%",
                                 boxShadow: "1px -2px 5px 0px #0000000f",
                              }}
                              components={{
                                 Toolbar: (props) => <div />,
                              }}
                              options={{
                                 paging: false,
                              }}
                           />
                        </Grid>
                        <Grid container item sm={6} spacing={0} />
                        <Grid container item sm={6} spacing={0}>
                           <Table style={{ marginTop: "20px" }} aria-label="spanning table">
                              <TableBody>
                                 <TableRow>
                                    <TableCell rowSpan={4} />
                                    <TableCell colSpan={2}>Subtotal</TableCell>
                                    <TableCell align="right" className="textRight">
                                       {totalAll.subtotal.toFixed(2)}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell colSpan={2}>Tax</TableCell>
                                    <TableCell align="right" className="textRight">
                                       {" "}
                                       {totalAll.taxtotal.toFixed(2)}{" "}
                                    </TableCell>
                                 </TableRow>

                                 <TableRow>
                                    <TableCell colSpan={2}>{t("Total")}</TableCell>
                                    <TableCell align="right" className="textRight">
                                       {" "}
                                       {Number(totalAll.total).toFixed(2)}
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
                     </Grid>
                  </Card>
                  <div className="saveButtonPlace">
                     <Button type="submit" className="glow-on-hover">
                        <Save fontSize="small" style={{ marginRight: "15px" }} />
                        {t("save")}
                     </Button>
                  </div>
               </Grid>
               <Grid container item md={2} className="panelGridRelative">
                  <Card className="listViewPaper">sdas</Card>
               </Grid>
            </Grid>
            <Dialog
               disableBackdropClick
               disableEscapeKeyDown
               open={gropBoxOpen}
               onClose={() => {
                  seTgropBoxOpen(false);
               }}
            >
               <DialogTitle>{t("addNewCustomerGroupName")}</DialogTitle>
               <DialogContent>
                  <FormControl className="FormControl" style={{ width: "100%" }}>
                     <InputLabel htmlFor="group">{t("addGroupName")}</InputLabel>
                     <Input
                        id="group"
                        onChange={(e) => {
                           seTchangeNewGroupNameJust(e.target.value);
                        }}
                     />
                     <FormHelperText>{t("addNewGroupName")}</FormHelperText>
                  </FormControl>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={() => {
                        seTgropBoxOpen(false);
                     }}
                     color="primary"
                  >
                     {" "}
                     {t("cancel")}{" "}
                  </Button>
                  <Button onClick={saveHandleNewGroup} color="primary">
                     {" "}
                     {t("save")}{" "}
                  </Button>
               </DialogActions>
            </Dialog>
         </ValidatorForm>
      </div>
   );
}
