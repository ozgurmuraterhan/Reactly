import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

import Select from "react-select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useTranslation } from "react-i18next";

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
   Slider,
   Tooltip,
   ExpansionPanel,
   ExpansionPanelSummary,
   ExpansionPanelDetails,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   FormControlLabel,
   Switch,
   FormLabel,
   Grid,
} from "@material-ui/core";

import { AddBox, ExpandMore, FileCopy, GroupAdd, Delete, ContactMail, Save } from "@material-ui/icons";

import "../../assets/css/style.css";
import MaterialTable from "material-table";

export default function PaymentsAccountsEdit(props) {
   const [t] = useTranslation();
   const history = useHistory();
   const { user } = useContext(AuthContext);

   const { enqueueSnackbar } = useSnackbar();
   const [state, seTstate] = useState({
      type: false,
      account_name: "",
      bank_name: "",
      branch_bank: "",
      account_number: 0,
      swift_iban: "",
      status: false
   });


   // componentDidMount = useEffect
   useEffect(() => {
   }, []);

   const onSubmit = (e) => {
      e.preventDefault();

      const BankAcounts = {
         created_user: { name: user.name, id: user.id },
         type: state.type,
         account_name: state.account_name,
         bank_name: state.bank_name,
         branch_bank: state.branch_bank,
         account_number: state.account_number,
         swift_iban: state.swift_iban,
         status: state.status
      };

      axios
         .post(`/bankaccounts/${props.match.params.id}`, BankAcounts)
         .then((res) => {
            if (res.data.variant == "error") {
               enqueueSnackbar(t("Account Not Added") + res.data.messagge, { variant: res.data.variant });
            } else {
               enqueueSnackbar(t("Account Added"), {
                  variant: res.data.variant,
               });
               // navigate
               history.push("/paymentsaccountslist");
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
                  <Card className="listViewPaper">
                     <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: "100%" }} className="typography">
                        {t("Edit Accounts")}
                     </Typography>

                     <Grid item container sm={12} style={{ background: "#fff", float: "left" }}>
                        <FormGroup className="FormGroup"  >
                           <FormControlLabel
                              control={
                                 <Switch
                                    checked={state.status}
                                    onChange={() => {
                                       seTstate({ ...state, status: !state.status });
                                    }}
                                    color="primary"
                                    name="checkedA"
                                 />
                              }
                              label="Status"
                           />
                        </FormGroup>

                        <FormGroup className="FormGroup">
                           <FormControl>
                              <TextValidator
                                 required
                                 variant="outlined"
                                 margin="dense"
                                 label={t("Account Name")}
                                 value={state.account_name}
                                 onChange={(e) => {
                                    seTstate({
                                       ...state,
                                       account_name: e.target.value,
                                    });
                                 }}
                              />
                              <FormHelperText>{t("You need Account name")}</FormHelperText>
                           </FormControl>
                        </FormGroup>
                        <FormGroup className="FormGroup"  >
                           <FormControlLabel
                              control={
                                 <Switch
                                    checked={state.type}
                                    onChange={() => {
                                       seTstate({ ...state, type: !state.type });
                                    }}
                                    color="primary"
                                    name="checkedA"
                                 />
                              }
                              label="Bank Account"
                           />
                        </FormGroup>
                        <div style={{ width: "93%", float: 'left', display: state.type ? 'block' : 'none' }}>

                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    required={state.type ? true : false}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Bank Name")}
                                    value={state.bank_name}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          bank_name: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("You need Bank Name")}</FormHelperText>
                              </FormControl>
                           </FormGroup>


                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    required={state.type ? true : false}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Branch Bank Name")}
                                    value={state.branch_bank}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          branch_bank: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("You need Branch Bank Name")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    required={state.type ? true : false}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Account Number ")}
                                    value={state.account_number}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          account_number: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("You need Account Number")}</FormHelperText>
                              </FormControl>
                           </FormGroup>

                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    required={state.type ? true : false}
                                    variant="outlined"
                                    margin="dense"
                                    label={t("Swift or Iban ")}
                                    value={state.swift_iban}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          swift_iban: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("You need Swift or Iban")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </div>
                     </Grid>
                  </Card>
                  <div className="saveButtonPlace">
                     <Button type="submit" className="glow-on-hover">
                        <Save fontSize="small" style={{ marginRight: "15px" }} /> {t("save")}
                     </Button>
                  </div>
               </Grid>

               <Grid item container md={9} className="panelGridRelative">
                  <Card className="panelLargeIcon">
                     <GroupAdd fontSize="large" />
                  </Card>
                  <Card className="listViewPaper">
                     <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: "100%" }} className="typography">
                        {t("Account Activities")}
                     </Typography>

                     <Grid item container sm={12} style={{ background: "#fff", float: "left" }}>
                        sds

                     </Grid>
                  </Card>
                   
               </Grid>
            </Grid>
         </ValidatorForm>

      </div>
   );
}
