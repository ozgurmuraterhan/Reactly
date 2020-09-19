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
   });

   function getUserData() {
      axios.get(`/staff/${props.match.params.id}`).then((response) => {
         seTstate({
            ...state,
            username: response.data.username,
            name: response.data.name,
            surname: response.data.surname,
            phone: response.data.phone,
            _id: response.data._id,
         });

         seTpermissions(response.data.role);
      });
   }

   function updatePassword() {
      const { _id, password } = state;

      axios
         .post(`/staff/updatePasswordSuperadmin`, { _id, password })
         .then((res) => {
            if (res.data.variant == "success") {
               enqueueSnackbar(t("Password Updated "), {
                  variant: "success",
               });
            } else {
               enqueueSnackbar(t("Password Not Updated ") + res.data.messagge, {
                  variant: "error",
               });
            }
         })
         .catch((err) => console.log(err));
   }

   // componentDidMount = useEffect
   useEffect(() => {
      getUserData();
   }, []);

   const onSubmit = (e) => {
      e.preventDefault();

      const Staff = {
         username: state.username,
         name: state.name,
         surname: state.surname,
         phone: state.phone,
         role: permissions,
      };
      if (user.role["superadmin"]) {
         const Staff = {
            username: state.username,
            name: state.name,
            surname: state.surname,
            phone: state.phone,
            role: permissions,
         };
      } else {
         const Staff = {
            username: state.username,
            name: state.name,
            surname: state.surname,
            phone: state.phone,
         };
      }

      if (state.password) {
         updatePassword();
      }

      axios
         .post(`/staff/${props.match.params.id}`, Staff)
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

   const deleteData = (id) => {
      axios.delete(`/staff/${id}`).then((res) => {
         enqueueSnackbar(res.data.messagge, {
            variant: res.data.variant,
         });
         history.push("/stafflist");
      });
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
                        {t("Edit User")}

                        <div
                           style={{
                              fontSize: "10pt",
                              display: permissions.superadmin ? "block" : "none",
                           }}
                        >
                           You are Süperadmin
                        </div>

                        <Tooltip title={t("Delete User")}>
                           <Button
                              variant="outlined"
                              color="primary"
                              style={{
                                 float: "right",
                                 marginRight: "115px",
                                 display: permissions.superadmin ? "none" : "block",
                              }}
                              onClick={() => {
                                 seTopenalert(true);
                              }}
                           >
                              <Delete />
                           </Button>
                        </Tooltip>
                        <Dialog
                           open={openalert}
                           onClose={() => {
                              seTopenalert(false);
                           }}
                        >
                           <DialogTitle>{t("Delete User")}</DialogTitle>
                           <DialogContent>
                              <DialogContentText>
                                 {t("deleteInfoText1")}
                                 <br />
                                 {t("deleteInfoText2")}
                              </DialogContentText>
                           </DialogContent>
                           <DialogActions>
                              <Button
                                 onClick={() => {
                                    seTopenalert(false);
                                 }}
                                 color="primary"
                              >
                                 {t("cancel")}
                              </Button>
                              <Button
                                 onClick={() => {
                                    deleteData(state._id);
                                 }}
                                 color="primary"
                                 autoFocus
                              >
                                 {t("delete")}
                              </Button>
                           </DialogActions>
                        </Dialog>
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
                  <Grid
                     item
                     container
                     md={5}
                     className="panelGridRelative"
                     style={{
                        display: permissions.superadmin ? "none" : "block",
                     }}
                  >
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
                                          const deg = [...permissions];
                                          deg.staffonlyyou = val;
                                          deg.stafflist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.stafflist = val;
                                          deg.staffonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.staffcreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.staffedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.staffdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersonlyyou = val;
                                          deg.customerslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customerslist = val;
                                          deg.customersonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customerscreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsonlyyou = val;
                                          deg.productslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productslist = val;
                                          deg.productsonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productscreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.bankaccountsonlyyou = val;
                                          deg.bankaccountslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.bankaccountslist = val;
                                          deg.bankaccountsonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.bankaccountscreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.bankaccountsedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.bankaccountsdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersgrouponlyyou = val;
                                          deg.customersgrouplist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersgrouplist = val;
                                          deg.customersgrouponlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersgroupcreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersgroupedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.customersgroupdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.invoicesonlyyou = val;
                                          deg.invoiceslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.invoiceslist = val;
                                          deg.invoicesonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.invoicescreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.invoicesedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.invoicesdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.expensesonlyyou = val;
                                          deg.expenseslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.expenseslist = val;
                                          deg.expensesonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.expensescreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.expensesedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.expensesdelete = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Payments")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.paymentsonlyyou}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.paymentsonlyyou = val;
                                          deg.paymentslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.paymentslist = val;
                                          deg.paymentsonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.paymentscreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.paymentsedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.paymentsdelete = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsCategoriesonlyyou = val;
                                          deg.productsCategorieslist = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsCategorieslist = val;
                                          deg.productsCategoriesonlyyou = false;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsCategoriescreate = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsCategoriesedit = val;
                                          seTpermissions(deg);
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
                                          const deg = [...permissions];
                                          deg.productsCategoriesdelete = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Expanses")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansesonlyyou = val;
                                          deg.expanseslist = false;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expanseslist}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expanseslist = val;
                                          deg.expansesonlyyou = false;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescreate}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescreate = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansesedit}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansesedit = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansesdelete}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansesdelete = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Delete")}
                              />
                           </div>

                           <div className="permissions_div">
                              <b>{t("Expanses Categories")}</b>

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescategoriesonlyyou}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescategoriesonlyyou = val;
                                          deg.expansescategorieslist = false;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Own)")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescategorieslist}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescategorieslist = val;
                                          deg.expansescategoriesonlyyou = false;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("View (Global)")}
                              />

                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescategoriescreate}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescategoriescreate = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Create")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescategoriesedit}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescategoriesedit = val;
                                          seTpermissions(deg);
                                       }}
                                       color="primary"
                                    />
                                 }
                                 label={t("Edit")}
                              />
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={permissions.expansescategoriesdelete}
                                       onChange={(e, val) => {
                                          const deg = [...permissions];
                                          deg.expansescategoriesdelete = val;
                                          seTpermissions(deg);
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
