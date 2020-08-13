import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import {
    ValidatorForm,
    TextValidator,
    SelectValidator,
} from "react-material-ui-form-validator";
import { useTranslation } from "react-i18next";

import {
    FormControl,
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

import { AddBox, GroupAdd, Save } from "@material-ui/icons";
import { AuthContext } from "../../Context/AuthContext";

export default function ProductCreate() {
    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [gropBoxOpen, seTgropBoxOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const [state, seTstate] = useState({
        selectedCategoryItems: [],
        changeNewCategoryNameJust: [],
        product_name: "",
        product_code: "",
        product_description: "",
        purchase_price: 0,
        sale_price: 0,
        product_vat: 0,
        product_stock: 0,
        findProductsCategories: [],
    });

    // open new category dialog
    const saveHandleNewCategory = () => {
        const data = {
            name: state.changeNewCategoryNameJust,
        };

        axios
            .post("/productcategories/add", data)
            .then((res) => {
                if (res.data.variant == "error") {
                    enqueueSnackbar(
                        t("productCategoryNotAdded") + res.data.messagge,
                        { variant: res.data.variant }
                    );
                } else {
                    enqueueSnackbar(t("productCategoryAdded"), {
                        variant: res.data.variant,
                    });
                }

                this.getProductCategories();
            })
            .catch((err) => console.log(err));

        seTgropBoxOpen(false);
    };

    const handleClickOpenGroup = () => {
        seTgropBoxOpen(true);
    };

    const handleCategoryBoxClose = () => {
        seTgropBoxOpen(false);
    };
    // end/ open  dialog

    function getProductCategories() {
        axios
            .get("/productcategories/")
            .then((res) => {
                if (res.data.length > 0) {
                    const details = [];
                    for (const i in res.data) {
                        details.push({
                            label: res.data[i].name,
                            value: res.data[i]._id,
                        });
                    }
                    seTstate({ ...state, findProductsCategories: details });
                }
            })
            .catch((err) => console.log(err));
    }

    // componentDidMount = useEffect
    useEffect(() => {
        getProductCategories();
        console.log(user);
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const Product = {
            created_user: { name: user.name, id: user.id },
            product_name: state.product_name,
            category_id: state.selectedCategoryItems,
            product_code: state.product_code,
            product_description: state.product_description,
            purchase_price: state.purchase_price,
            sale_price: state.sale_price,
            product_vat: state.product_vat,
            product_stock: state.product_stock,
        };

        axios.post("/products/add", Product).then((res) => {
            if (res.data.variant == "error") {
                enqueueSnackbar(t("productNotAdded") + res.data.messagge, {
                    variant: res.data.variant,
                });
            } else {
                enqueueSnackbar(t("productAdded"), {
                    variant: res.data.variant,
                });
                // navigate
                history.push("/productslist");
            }
        });
    };

    return (
        <div className="containerP">
            <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
                <Grid item container spacing={3} style={{ display: "flex" }}>
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
                                className="typography"
                            >
                                {t("productCreate")}
                            </Typography>
                            <Grid item container sm={12}>
                                <Grid container item sm={4} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("productName")}
                                                value={state.product_name}
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
                                                {t("youNeedaProductName")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={4} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("productCode")}
                                                value={state.product_code}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        product_code:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                            />
                                            <FormHelperText>
                                                {t("youNeedaProductCode")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item sm={4} spacing={0}>
                                    <Grid container item sm={1} spacing={0}>
                                        <Tooltip title={t("addNewCategory")}>
                                            <AddBox
                                                onClick={handleClickOpenGroup}
                                                fontSize="large"
                                                style={{
                                                    margin: "20px 10px 0 5px",
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid container item sm={11} spacing={0}>
                                        <div
                                            style={{
                                                marginTop: "0px",
                                                clear: "both",
                                            }}
                                        />
                                        <FormGroup className="FormGroup">
                                            <FormControl>
                                                <Select
                                                    isMulti
                                                    placeholder={t(
                                                        "selectCategory"
                                                    )}
                                                    value={
                                                        state.selectedCategoryItems
                                                    }
                                                    options={
                                                        state.findProductsCategories
                                                    }
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        seTstate({
                                                            ...state,
                                                            selectedCategoryItems: selectedOption,
                                                        });
                                                    }}
                                                />
                                                <FormHelperText>
                                                    {t(
                                                        "youNeedSelectCategories"
                                                    )}
                                                </FormHelperText>
                                            </FormControl>
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("purchasePrice")}
                                                value={state.purchase_price}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        purchase_price:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                                type="number"
                                                validators={["isNumber"]}
                                                errorMessages={[
                                                    t("thisIsNotNumber"),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaPurchasePrice")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("salePrice")}
                                                value={state.sale_price}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        sale_price:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                                type="number"
                                                validators={["isNumber"]}
                                                errorMessages={[
                                                    t("thisIsNotNumber"),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaSalePrice")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("productStock")}
                                                value={state.product_stock}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        product_stock:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                                type="number"
                                                validators={["isNumber"]}
                                                errorMessages={[
                                                    t("thisIsNotNumber"),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaProductStock")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                variant="outlined"
                                                margin="dense"
                                                label={t("productVat")}
                                                value={state.product_vat}
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        product_vat:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                                type="number"
                                                validators={["isNumber"]}
                                                errorMessages={[
                                                    t("thisIsNotNumber"),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t("youNeedaProductVat")}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={12} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextField
                                                variant="outlined"
                                                label={t("productDescription")}
                                                multiline
                                                margin="normal"
                                                value={
                                                    state.product_description
                                                }
                                                onChange={(e) => {
                                                    seTstate({
                                                        ...state,
                                                        product_description:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText>
                                                {t(
                                                    "youNeedaProductDescription"
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="saveButtonPlace">
                            <Button type="submit" className="glow-on-hover">
                                <Save
                                    fontSize="small"
                                    style={{ marginRight: "15px" }}
                                />{" "}
                                {t("save")}
                            </Button>
                        </div>
                    </Grid>
                    <Grid container item md={3} className="panelGridRelative">
                        <div className="listViewPaper">
                            <br /> <br /> <br /> <br />
                            Update Images coming soon :)
                        </div>
                    </Grid>
                </Grid>
            </ValidatorForm>

            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={gropBoxOpen}
                onClose={handleCategoryBoxClose}
            >
                <DialogTitle>{t("addNewProductCategoryName")}</DialogTitle>
                <DialogContent>
                    <FormControl
                        className="FormControl"
                        style={{ width: "100%" }}
                    >
                        <InputLabel htmlFor="group">
                            {t("addCategoryName")}
                        </InputLabel>
                        <Input
                            id="group"
                            value={state.changeNewCategoryNameJust}
                            onChange={(e) => {
                                seTstate({
                                    ...state,
                                    changeNewCategoryNameJust: e.target.value,
                                });
                            }}
                        />
                        <FormHelperText>{t("addCategoryName")}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCategoryBoxClose} color="primary">
                        {t("cancel")}
                    </Button>
                    <Button onClick={saveHandleNewCategory} color="primary">
                        {t("save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
