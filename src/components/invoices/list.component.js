import React, { Component, forwardRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation } from "react-i18next";
import Moment from "moment";
import Select from "react-select";
import { AuthContext } from "../../Context/AuthContext";

import { Doughnut } from "react-chartjs-2";

import { DialogActions, DialogContent, Button, Dialog, Card, Tooltip, Grid, Typography, FormGroup, FormControl, FormHelperText } from "@material-ui/core";

import {
   Settings,
   Edit,
   GroupAdd,
   AddBox,
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
} from "@material-ui/icons";

import "../../assets/css/style.css";

export default function InvoicesList(props) {
   const [t] = useTranslation();
   const history = useHistory();
   const pieColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#cc65fe",
      "#445ce2",
      "#e244b1",
      "#0c3836",
      "#51e4b5",
      "#ff0000",
      "#6eff00",
      "#00ffe7",
      "#28a743",
      "#ff00c8",
      "#063361",
      "#1f77b4",
      "#e377c2",
      "#ff7f0e",
      "#2ca02c",
      "#bcbd22",
      "#d62728",
      "#17becf",
      "#9467bd",
      "#7f7f7f",
      "#8c564b",
      "#3366cc",
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


   const customergroups_label = [{ title: t("groupName"), field: "name" }];
   const [state, seTstate] = useState({
      addaccountname: []
   });
   const [open, seTopen] = useState(false);
   const [customergroups, seTcustomergroups] = useState([]);
   const [data, seTdata] = useState([]);
   const [payments, seTpayments] = useState([]);
   const [payment_id, seTpayment_id] = useState(0);
   const [dataBankAccount, seTdataBankAccount] = useState("");
   const { user } = useContext(AuthContext);
   const { enqueueSnackbar } = useSnackbar();


   const columns = [
      {
         title: t("no"),
         field: "no",
      },
      {
         title: t("customer"),
         field: "created_user.name",
      },
      {
         title: t("Billing Date"),
         field: "created",
         render: (rowData) => {
            return <div>{Moment(rowData.due_date).format("DD/MM/YYYY")}</div>;
         },
      },
      {
         title: t("Due Date"),
         field: "due_date",
         render: (rowData) => {
            return <div>{Moment(rowData.due_date).format("DD/MM/YYYY")}</div>;
         },
      },
      {
         title: t("Add Payments"),
         render: (rowData) => {
            return <div onClick={() => getPaymentsMethodData(rowData._id)}>{t("Add Payments")}</div>;
         },
      },

      {
         title: t("Status"),
         render: (rowData) => {
            if (rowData.payments.length > 0) {
               let payment_amount = 0;
               for (const i in rowData.payments) {
                  payment_amount = parseFloat(payment_amount) + parseFloat(rowData.payments[i].amount);
               }

               let duadate = Date.parse(rowData.due_date);
               let nowdate = parseFloat(Date.now());

               if (rowData.total == payment_amount) {
                  return <span className="invoice_paid">{t("PAID")}</span>;
               } else if (rowData.total > payment_amount > 0) {
                  return <span className="invoice_partical">{t("PARTICAL")}</span>;
               } else if (rowData.total > payment_amount && duadate < nowdate) {
                  return <span className="invoice_unpaid">{t("UNPAID")}</span>;
               }
            }
         },
      },

      {
         title: t("actions"),
         field: "_id",
         render: (rowData) => (
            <div>
               <Link to={`/invoices/edit/${rowData._id}`}>
                  <Edit />
               </Link>
            </div>
         ),
      },
   ];


   const payments_label = [
      { title: t("Amount"), field: "amount" },
      {
         title: t("Paid Date"),
         field: "paid_date",
         render: (rowData) => {
            return <div>{Moment(rowData.paid_date).format("DD/MM/YYYY HH:mm:ss")}</div>;
         },
         editComponent: (props) => (
            <div>{Moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}</div>
         ),
      },

      {
         title: t("Note"),
         field: "note",
      },

      {
         title: t("Account"),
         field: "account_name.label",
         editComponent: (props) => (
            <div style={{ width: '150px' }}>
               <Select
                  placeholder={t("Select Account")}
                  value={state.addaccountname}
                  options={dataBankAccount}
                  onChange={(selectedInput) => {
                     seTstate({
                        ...state,
                        addaccountname: selectedInput
                     })
                  }}
               />
            </div>
         ),
      },
   ];
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

   const getPaymentsMethodData = (id) => {
      seTpayment_id(id);
      handleClickOpen();
      axios.get("/invoices/payments/" + id).then((response) => {
         seTpayments(response.data[0].payments);

      });
   };

   const getInvoicesData = () => {
      axios.get("/invoices").then((response) => {
         if (response.data.length > 0) {
            seTdata(response.data);
            // console.log(data)
            // console.log(columns)
         }
      });
   };

   // componentDidMount = useEffect
   useEffect(() => {
      getInvoicesData();
      getBankAccountF();
   }, []);

   const handleClickOpen = () => {
      seTopen(true);
   };

   const handleClose = () => {
      getInvoicesData();
      seTopen(false);
   };

   return (
      <>
         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent style={{ padding: "0" }}>
               <MaterialTable
                  title={t("PaymentsMethod")}
                  icons={tableIcons}
                  columns={payments_label}
                  data={payments}
                  options={{
                     actionsColumnIndex: -1,
                     addRowPosition: 'first'
                  }}
                  editable={{
                     onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {

                           let paymentsPrime = {
                              created_user: { name: user.name, id: user.id },
                              type: 1,
                              amount: newData.amount,
                              paid_date: Moment(newData.paid_date)._d,
                              account_name: state.addaccountname,
                              created: Moment(newData.paid_date)._d,
                              note: newData.note,
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
                                    // navigate history.push("/invoiceslist");

                                 }
                              })
                              .catch((err) => console.log(err));


                           axios.post(`/invoices/addpayments/${payment_id}`, {
                              amount: newData.amount,
                              account_name: state.addaccountname,
                              note: newData.note,

                           });
                           let setObj = {
                              amount: newData.amount,
                              account_name: state.addaccountname,
                              note: newData.note,
                           }


                           payments.push(setObj);
                           console.log(payments)

                           seTpayments(payments);
                           getInvoicesData();

                           resolve();
                        }),
                  }}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  {t("okey")}
               </Button>
            </DialogActions>
         </Dialog>
         <div className="containerP">
            <Grid item container spacing={3}>
               <Grid container item md={12} className="panelGridRelative">
                  <Card className="panelLargeIcon">
                     <Receipt fontSize="large" />
                  </Card>
                  <Card className="listViewPaper">
                     <MaterialTable
                        title=""
                        icons={tableIcons}
                        columns={columns}
                        data={data}
                        options={{
                           exportButton: true,
                           pageSize: 10,
                           grouping: true,
                        }}
                        components={{
                           Toolbar: (props) => (
                              <div>
                                 <Typography component="h5" variant="h6" color="inherit" noWrap className="typography">
                                    {t("invoicesList")}
                                 </Typography>
                                 <Link to="/invoicecreate" className="addButtonPlace">
                                    <Tooltip title={t("createInvoice")}>
                                       <AddBox fontSize="large" className="addButtonIcon" />
                                    </Tooltip>
                                 </Link>
                                 <MTableToolbar {...props} />
                                 <div style={{ clear: "both" }} />
                              </div>
                           ),
                        }}
                     />
                  </Card>
               </Grid>
            </Grid>
         </div>
      </>
   );
}
