import React, { Component, useState, useEffect, useContext } from "react";
import axios from "axios";
import { withSnackbar, useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { withNamespaces, useTranslation } from "react-i18next";
import ImageUploader from "react-images-upload";

import { AuthContext } from "../../Context/AuthContext";

import {
   FormControl,
   DialogContentText,
   FormGroup,
   InputLabel,
   Input,
   FormHelperText,
   Card,
   Button,
   Typography,
   TextField,
   Tooltip,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Checkbox,
   FormControlLabel,
   Grid,
} from "@material-ui/core";

import { AddBox, GroupAdd, Delete, Save } from "@material-ui/icons";

import "../../assets/css/style.css";

export default function ProductEdit(props) {
   const [t] = useTranslation();
   const history = useHistory();
   const { enqueueSnackbar } = useSnackbar();
   const [openalert, seTopenalert] = useState(false);
   const { isAuthenticated, user } = useContext(AuthContext);

   const [state, seTstate] = useState({
      username: "",
      username: "",
      name: "",
      surname: "",
      password: "",
      phone: "",
      _id: "",
      created_user: "",
   });

   const [permissions, seTpermissions] = useState({
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
   });

   // componentDidMount = useEffect
   useEffect(() => {}, []);

   const onSubmit = (e) => {
      e.preventDefault();
      const Staff = {
         created_user: { name: user.name, id: user.id },
         username: state.username,
         name: state.name,
         surname: state.surname,
         phone: state.phone,
         password: state.password,
         role: permissions,
         isCustomer:false,
      };

      axios
         .post(`/staff/add`, Staff)
         .then((res) => {
            if (res.data.variant == "error") {
               enqueueSnackbar(t("Staff Not Updated ") + res.data.messagge, { variant: res.data.variant });
            } else {
               enqueueSnackbar(t("Staff Updated"), {
                  variant: res.data.variant,
               });
               history.push("/stafflist");
            }
         })
         .catch((err) => console.log(err));
   };

   return (
      <div className="containerP">
         <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
            <Grid item container spacing={3}>
               <Grid item container md={3} className="panelGridRelative">
                  <Card className="panelLargeIcon">
                     <GroupAdd fontSize="large" />
                  </Card>
                  <div className="listViewPaper">
                     <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: "100%" }} className="typography">
                        {t("Create User")}
                     </Typography>
                     <Grid item container sm={12}>
                        <div style={{ clear: "both" }}></div>

                        <Grid container item sm={12} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    InputLabelProps={{
                                       shrink: true,
                                    }}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Name")}
                                    value={state.name}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          name: e.target.value,
                                       });
                                    }}
                                    required
                                 />
                                 <FormHelperText>{t("You need Name")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>

                        <Grid container item sm={12} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    InputLabelProps={{
                                       shrink: true,
                                    }}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Surname")}
                                    value={state.surname}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          surname: e.target.value,
                                       });
                                    }}
                                    required
                                 />
                                 <FormHelperText>{t("You need Surname")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>

                        <Grid container item sm={12} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    InputLabelProps={{
                                       shrink: true,
                                    }}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("E-mail")}
                                    value={state.username}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          username: e.target.value,
                                       });
                                    }}
                                    required
                                 />
                                 <FormHelperText>{t("You need E-mail")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>

                        <Grid container item sm={12} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    InputLabelProps={{
                                       shrink: true,
                                    }}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Phone")}
                                    value={state.phone}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          phone: e.target.value,
                                       });
                                    }}
                                    required
                                 />
                                 <FormHelperText>{t("You need Phone")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>

                        <Grid container item sm={12} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    InputLabelProps={{
                                       shrink: true,
                                    }}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Password")}
                                    value={state.password}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          password: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("Note: if you populate this field, password will be changed on this member.")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>
                     </Grid>
                  </div>
                  <div className="saveButtonPlace">
                     <Button type="submit" onClick={onSubmit} className="glow-on-hover">
                        <Save fontSize="small" style={{ marginRight: "15px" }} />
                        {t("save")}
                     </Button>
                  </div>
               </Grid>

               {user.role["superadmin"] ? (
                  <Grid item container md={5} className="panelGridRelative">
                     <div className="listViewPaperPadding">
                        <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: "100%" }}>
                           {t("Permissions")}
                        </Typography>
                        <Grid item container sm={12} className="permissions">
                           <div className="permissions_div">
                              <b>{t("Staff")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.staffonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.staffonlyyou = val;
                                          deg.stafflist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                        }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.stafflist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                           deg.stafflist = val;
                                          deg.staffonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
 
                                        }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.staffcreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.staffcreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
 
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.staffedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.staffedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.staffdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.staffdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Customers")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersonlyyou = val;
                                          deg.customerslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customerslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customerslist = val;
                                          deg.customersonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customerscreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customerscreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Products")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsonlyyou = val;
                                          deg.productslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productslist = val;
                                          deg.productsonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productscreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productscreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Bank Accounts")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.bankaccountsonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.bankaccountsonlyyou = val;
                                          deg.bankaccountslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.bankaccountslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.bankaccountslist = val;
                                          deg.bankaccountsonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.bankaccountscreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.bankaccountscreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.bankaccountsedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.bankaccountsedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.bankaccountsdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.bankaccountsdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Customers Group")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersgrouponlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersgrouponlyyou = val;
                                          deg.customersgrouplist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersgrouplist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersgrouplist = val;
                                          deg.customersgrouponlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersgroupcreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersgroupcreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersgroupedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersgroupedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.customersgroupdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.customersgroupdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Invoices")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.invoicesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.invoicesonlyyou = val;
                                          deg.invoiceslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.invoiceslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.invoiceslist = val;
                                          deg.invoicesonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.invoicescreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.invoicescreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.invoicesedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.invoicesedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.invoicesdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.invoicesdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           

                           <div className="permissions_div">
                              <b>{t("PaymentsMethod")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsonlyyou = val;
                                          deg.paymentslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentslist = val;
                                          deg.paymentsonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentscreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentscreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Products Categories")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsCategoriesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsCategoriesonlyyou = val;
                                          deg.productsCategorieslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsCategorieslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsCategorieslist = val;
                                          deg.productsCategoriesonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsCategoriescreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsCategoriescreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsCategoriesedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsCategoriesedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.productsCategoriesdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.productsCategoriesdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Expenses")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensesonlyyou = val;
                                          deg.expenseslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expenseslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expenseslist = val;
                                          deg.expensesonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensesedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensesedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensesdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensesdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Expenses Categories")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescategoriesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescategoriesonlyyou = val;
                                          deg.expensescategorieslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescategorieslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescategorieslist = val;
                                          deg.expensescategoriesonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescategoriescreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescategoriescreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescategoriesedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescategoriesedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")} 
                               />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expensescategoriesdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.expensescategoriesdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>


                           <div className="permissions_div">
                              <b>{t("Payments Accounts")}</b>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsaccountsonlyyou}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsaccountsonlyyou = val;
                                          deg.paymentsaccountslist = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsaccountslist}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsaccountslist = val;
                                          deg.paymentsaccountsonlyyou = false;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsaccountscreate}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsaccountscreate = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsaccountsedit}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsaccountsedit = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")} 
                               />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsaccountsdelete}
                                       onChange={(e, val) => {
                                          const deg = permissions;
                                          deg.paymentsaccountsdelete = val;
                                          seTpermissions(deg);
                                          seTstate({...state})
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>
                        </Grid>
                     </div>
                  </Grid>
               ) : (
                  <div></div>
               )}
            </Grid>
         </ValidatorForm>
      </div>
   );
}
