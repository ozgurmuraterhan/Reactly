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

    const [permissions, seTpermissions] = useState([
        {
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
        },
    ]);

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
                    enqueueSnackbar(
                        t("Password Not Updated ") + res.data.messagge,
                        {
                            variant: "error",
                        }
                    );
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
        if (user.role[0]["superadmin"]) {
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
                    enqueueSnackbar(
                        t("Staff Not Updated ") + res.data.messagge,
                        { variant: res.data.variant }
                    );
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
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                style={{ width: "100%" }}
                                className="typography"
                            >
                                {t("Edit User")}

                                <div
                                    style={{
                                        fontSize: "10pt",
                                        display: permissions[0].superadmin
                                            ? "block"
                                            : "none",
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
                                            display: permissions[0].superadmin
                                                ? "none"
                                                : "block",
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
                                    <DialogTitle>
                                        {t("Delete User")}
                                    </DialogTitle>
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
                                            <FormHelperText>
                                                {t("You need Name")}
                                            </FormHelperText>
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
                                            <FormHelperText>
                                                {t("You need Surname")}
                                            </FormHelperText>
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
                                                        username:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                            />
                                            <FormHelperText>
                                                {t("You need E-mail")}
                                            </FormHelperText>
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
                                            <FormHelperText>
                                                {t("You need Phone")}
                                            </FormHelperText>
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
                                                        password:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t(
                                                    "Note: if you populate this field, password will be changed on this member."
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="saveButtonPlace">
                            <Button
                                type="submit"
                                onClick={onSubmit}
                                className="glow-on-hover"
                            >
                                <Save
                                    fontSize="small"
                                    style={{ marginRight: "15px" }}
                                />
                                {t("save")}
                            </Button>
                        </div>
                    </Grid>

                    {user.role[0]["superadmin"] ? (
                        <Grid
                            item
                            container
                            md={5}
                            className="panelGridRelative"
                            style={{
                                display: permissions[0].superadmin
                                    ? "none"
                                    : "block",
                            }}
                        >
                            <div className="listViewPaperPadding">
                                <Typography
                                    component="h1"
                                    variant="h6"
                                    color="inherit"
                                    noWrap
                                    style={{ width: "100%" }}
                                >
                                    {t("Permissions")}
                                </Typography>
                                <Grid
                                    item
                                    container
                                    sm={12}
                                    className="permissions"
                                >
                                    <div className="permissions_div">
                                        <b>{t("Staff")}</b>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        permissions[0]
                                                            .staffonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].staffonlyyou = val;
                                                        deg[0].stafflist = false;
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
                                                    checked={
                                                        permissions[0].stafflist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].stafflist = val;
                                                        deg[0].staffonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .staffcreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].staffcreate = val;
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
                                                    checked={
                                                        permissions[0].staffedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].staffedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .staffdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].staffdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersonlyyou = val;
                                                        deg[0].customerslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .customerslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customerslist = val;
                                                        deg[0].customersonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .customerscreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customerscreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsonlyyou = val;
                                                        deg[0].productslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .productslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productslist = val;
                                                        deg[0].productsonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .productscreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productscreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .bankaccountsonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].bankaccountsonlyyou = val;
                                                        deg[0].bankaccountslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .bankaccountslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].bankaccountslist = val;
                                                        deg[0].bankaccountsonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .bankaccountscreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].bankaccountscreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .bankaccountsedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].bankaccountsedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .bankaccountsdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].bankaccountsdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersgrouponlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersgrouponlyyou = val;
                                                        deg[0].customersgrouplist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersgrouplist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersgrouplist = val;
                                                        deg[0].customersgrouponlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersgroupcreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersgroupcreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersgroupedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersgroupedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .customersgroupdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].customersgroupdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .invoicesonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].invoicesonlyyou = val;
                                                        deg[0].invoiceslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .invoiceslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].invoiceslist = val;
                                                        deg[0].invoicesonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .invoicescreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].invoicescreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .invoicesedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].invoicesedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .invoicesdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].invoicesdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .paymentsonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].paymentsonlyyou = val;
                                                        deg[0].paymentslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .paymentslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].paymentslist = val;
                                                        deg[0].paymentsonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .paymentscreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].paymentscreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .paymentsedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].paymentsedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .paymentsdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].paymentsdelete = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsCategoriesonlyyou
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsCategoriesonlyyou = val;
                                                        deg[0].productsCategorieslist = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsCategorieslist
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsCategorieslist = val;
                                                        deg[0].productsCategoriesonlyyou = false;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsCategoriescreate
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsCategoriescreate = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsCategoriesedit
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsCategoriesedit = val;
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
                                                    checked={
                                                        permissions[0]
                                                            .productsCategoriesdelete
                                                    }
                                                    onChange={(e, val) => {
                                                        const deg = [
                                                            ...permissions,
                                                        ];
                                                        deg[0].productsCategoriesdelete = val;
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
