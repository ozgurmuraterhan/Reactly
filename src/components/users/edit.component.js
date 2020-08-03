import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { withSnackbar, useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { withNamespaces, useTranslation } from "react-i18next";

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
    Grid,
} from "@material-ui/core";

import { AddBox, GroupAdd, Delete, Save } from "@material-ui/icons";

import "../../assets/css/style.css";

export default function ProductEdit(props) {
    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [gropBoxOpen, seTgropBoxOpen] = useState(false);
    const [openalert, seTopenalert] = useState(false);
    const [findProductsCategories, seTfindProductsCategories] = useState([]);

    const [state, seTstate] = useState({
        username: "",
    });

    function getUserData() {
        axios.get(`/staff/${props.match.params.id}`).then((response) => {
            seTstate({
                ...state,
                username: response.data.username,
                _id: response.data._id,
            });
        });
    }

    // componentDidMount = useEffect
    useEffect(() => {
        getUserData();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const Product = {
            username: state.username,
        };
        axios
            .post(`/user/${props.match.params.id}`, Product)
            .then((res) => {
                if (res.data.variant == "error") {
                    enqueueSnackbar(
                        t("Staff Not Updated") + res.data.messagge,
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
        axios.delete(`/user/${id}`).then((res) => {
            enqueueSnackbar(t("Staf Deleted"), {
                variant: res.data.variant,
            });
            history.push("/stafflist");
        });
    };

    return (
        <div className="containerP">
            <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
                <Grid item container spacing={3}>
                    <Grid item container md={9} className="panelGridRelative">
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
                                <Tooltip title={t("Delete User")}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={{
                                            float: "right",
                                            marginRight: "115px",
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
                                <Grid container item sm={4} spacing={0}>
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
                                                        product_name:
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
                            </Grid>

                            <Grid item container sm={12}>
                                <Grid container item sm={4} spacing={0}>
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
                                                        product_name:
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
                </Grid>
            </ValidatorForm>
        </div>
    );
}
