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

export default function ExpensesCreate(props) {
   const [t] = useTranslation();
   const history = useHistory();
   const { enqueueSnackbar } = useSnackbar();
   const { user } = useContext(AuthContext);

   const [billable, seTbillable] = useState(false);
   const [dataCustomers, seTdataCustomers] = useState([]);
   const [selectedDefaultCustomer, seTselectedDefaultCustomer] = useState([{ label: t("Please Select"), value: t("Not Selected") }]);

   const [state, seTstate] = useState({
      created: Date.now(),
      name: "",
      note: "",
      category_id: [],
      expense_date: Date.now(),
      expense: 0,
      customer_id: [],
      billable: false,
   });

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
      axios
         .get(`/customers/${selectedOption.value}`)
         .then((response) => {
            seTstate({
               ...state,
            });
         })
         .catch((err) => console.log(err));
      seTselectedDefaultCustomer({
         label: selectedOption.label,
         value: selectedOption.value,
      });
   };

   // componentDidMount = useEffect
   useEffect(() => {
      getCustomersF();
   }, []);

   const onSubmit = (e) => {
      e.preventDefault();

      const Expenses = {
         created_user: { name: user.name, id: user.id },
         created: Moment(state.created)._d,
         customer_id: selectedDefaultCustomer,
         name: state.name,
         note: state.note,
         category_id: state.category_id,
         expense_date: Moment(state.expense_date)._d,
         expense: state.expense,
         billable: state.billable,
      };

      axios
         .post("/expenses/add", Expenses)
         .then((res) => {
            if (res.data.variant === "error") {
               enqueueSnackbar(t("Expenses Not Added") + res.data.messagge, {
                  variant: res.data.variant,
               });
            } else {
               enqueueSnackbar(t("Expenses Added") + res.data.messagge, {
                  variant: res.data.variant,
               });
               // navigate
               history.push("/expenseslist");
            }
         })
         .catch((err) => console.log(err));
   };

   return (
      <div className="containerP">
         <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
            <Grid item container spacing={3}>
               <Grid item container md={6} className="panelGridRelative">
                  <Card className="panelLargeIcon">
                     <Receipt fontSize="large" />
                  </Card>
                  <Card className="listViewPaper">
                     <Typography component="h1" variant="h6" color="inherit" noWrap className="typography">
                        {t("Expenses Add")}
                     </Typography>
                     <FormControlLabel
                        style={{ float: "right" }}
                        control={
                           <Switch
                              checked={billable}
                              onChange={() => {
                                 seTbillable(!billable);
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
                        <Grid container item sm={3} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                       inputVariant="outlined"
                                       margin="dense"
                                       id="date-picker-dialog"
                                       label={t("createdDate")}
                                       format="dd/MM/yyyy"
                                       value={state.created}
                                       onChange={(date) =>
                                          seTstate({
                                             ...state,
                                             created: date,
                                          })
                                       }
                                       KeyboardButtonProps={{
                                          "aria-label": "change date",
                                       }}
                                    />
                                 </MuiPickersUtilsProvider>
                                 <FormHelperText>{t("youNeedaCreatedDate")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
                        </Grid>

                        <Grid container item sm={6} spacing={0}>
                           <FormGroup className="FormGroup">
                              <FormControl>
                                 <TextValidator
                                    multiline
                                    label={t("duenote")}
                                    variant="outlined"
                                    margin="dense"
                                    value={state.due_note}
                                    onChange={(e) => {
                                       seTstate({
                                          ...state,
                                          due_note: e.target.value,
                                       });
                                    }}
                                 />
                                 <FormHelperText>{t("youNeedaDueNote")}</FormHelperText>
                              </FormControl>
                           </FormGroup>
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
               <Grid container item md={6} className="panelGridRelative">
                  <Card className="listViewPaper" style={{ marginBottom: "0" }}>
                     <Typography component="h5" variant="h6" color="inherit" style={{ paddingLeft: "10px" }} noWrap className="typography">
                        {t("addresses")}
                     </Typography>
                     sds
                  </Card>
               </Grid>
            </Grid>
         </ValidatorForm>
      </div>
   );
}
