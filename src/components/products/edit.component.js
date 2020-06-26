import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { withSnackbar, useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withNamespaces, useTranslation } from 'react-i18next';

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
} from '@material-ui/core';

import { AddBox, GroupAdd, Delete, Save } from '@material-ui/icons';

import '../../assets/css/style.css';

export default function ProductEdit(props) {
    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [gropBoxOpen, seTgropBoxOpen] = useState(false);
    const [openalert, seTopenalert] = useState(false);
    const [findProductsCategories, seTfindProductsCategories] = useState([]);

    const [state, seTstate] = useState({
        selectedCategoryItems: [],
        changeNewCategoryNameJust: [],
        product_name: '',
        product_code: '',
        product_description: '',
        purchase_price: 0,
        sale_price: 0,
        product_vat: 0,
        product_stock: 0,
    });

    const saveHandleNewGroup = () => {
        const data = {
            name: state.changeNewCategoryNameJust,
        };
        axios
            .post('/productcategories/add', data)
            .then((res) => {
                if (res.data.variant == 'error') {
                    enqueueSnackbar(
                        t('customersGroupNotAdded') + res.data.messagge,
                        { variant: res.data.variant }
                    );
                } else {
                    enqueueSnackbar(t('customersGroupAdded'), {
                        variant: res.data.variant,
                    });
                }
                this.getProductsGroup();
            })
            .catch((err) => console.log(err));

        seTgropBoxOpen(false);
    };
    // end/ open new group dialog

    function getProductsGroup() {
        axios
            .get('/productcategories/')
            .then((res) => {
                if (res.data.length > 0) {
                    const details = [];
                    for (const i in res.data) {
                        details.push({
                            label: res.data[i].name,
                            value: res.data[i]._id,
                        });
                    }
                    seTfindProductsCategories(details);
                }
            })
            .catch((err) => console.log(err));
    }

    function getProductData() {
        axios.get(`/products/${props.match.params.id}`).then((response) => {
            const details = [];
            for (const i in response.data.category_id) {
                details.push({
                    label: response.data.category_id[i].label,
                    value: response.data.category_id[i].value,
                });
            }

            seTstate({
                ...state,
                selectedCategoryItems: details,
                _id: response.data._id,
                product_name: response.data.product_name,
                product_code: response.data.product_code,
                product_description: response.data.product_description,
                purchase_price: response.data.purchase_price,
                sale_price: response.data.sale_price,
                product_vat: response.data.product_vat,
                product_stock: response.data.product_stock,
            });
        });
    }

    // componentDidMount = useEffect
    useEffect(() => {
        getProductsGroup();
        getProductData();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const Product = {
            product_name: state.product_name,
            category_id: state.selectedCategoryItems,
            product_code: state.product_code,
            product_description: state.product_description,
            purchase_price: state.purchase_price,
            sale_price: state.sale_price,
            product_vat: state.product_vat,
            product_stock: state.product_stock,
        };
        axios
            .post(`/products/${props.match.params.id}`, Product)
            .then((res) => {
                if (res.data.variant == 'error') {
                    enqueueSnackbar(
                        t('customerNotUpdated') + res.data.messagge,
                        { variant: res.data.variant }
                    );
                } else {
                    enqueueSnackbar(t('customerUpdated'), {
                        variant: res.data.variant,
                    });
                    history.push('/productslist');
                }
            })
            .catch((err) => console.log(err));
    };

    const deleteData = (id) => {
        axios.delete(`/products/${id}`).then((res) => {
            enqueueSnackbar(t('customerDeleted'), {
                variant: res.data.variant,
            });
            history.push('/productslist');
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
                                style={{ width: '100%' }}
                                className="typography"
                            >
                                {t('editProduct')}
                                <Tooltip title={t('deleteProduct')}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={{
                                            float: 'right',
                                            marginRight: '115px',
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
                                        {t('deleteProduct')}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('deleteInfoText1')}
                                            <br />
                                            {t('deleteInfoText2')}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={() => {
                                                seTopenalert(false);
                                            }}
                                            color="primary"
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                deleteData(state._id);
                                            }}
                                            color="primary"
                                            autoFocus
                                        >
                                            {t('delete')}
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
                                                label={t('productName')}
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
                                                {t('youNeedaProductName')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={4} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                margin="dense"
                                                label={t('productCode')}
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
                                                {t('youNeedaProductCode')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item sm={4} spacing={0}>
                                    <Grid container item sm={1} spacing={0}>
                                        <Tooltip title={t('addNewCategory')}>
                                            <AddBox
                                                onClick={() => {
                                                    seTgropBoxOpen(true);
                                                }}
                                                fontSize="large"
                                                style={{
                                                    margin: '20px 10px 0 5px',
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid container item sm={11} spacing={0}>
                                        <div
                                            style={{
                                                marginTop: '0px',
                                                clear: 'both',
                                            }}
                                        />
                                        <FormGroup className="FormGroup">
                                            <FormControl>
                                                <label className="selectLabel">
                                                    {t('category')}
                                                </label>

                                                <Select
                                                    isMulti
                                                    placeholder={t(
                                                        'selectCategory'
                                                    )}
                                                    value={
                                                        state.selectedCategoryItems
                                                    }
                                                    options={
                                                        findProductsCategories
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
                                                        'youNeedSelectCategories'
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
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                margin="dense"
                                                label={t('purchasePrice')}
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
                                                validators={['isNumber']}
                                                errorMessages={[
                                                    t('thisIsNotNumber'),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t('youNeedaPurchasePrice')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                margin="dense"
                                                label={t('salePrice')}
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
                                                validators={['isNumber']}
                                                errorMessages={[
                                                    t('thisIsNotNumber'),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t('youNeedaSalePrice')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                margin="dense"
                                                label={t('productStock')}
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
                                                validators={['isNumber']}
                                                errorMessages={[
                                                    t('thisIsNotNumber'),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t('youNeedaProductStock')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={3} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextValidator
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                margin="dense"
                                                label={t('productVat')}
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
                                                validators={['isNumber']}
                                                errorMessages={[
                                                    t('thisIsNotNumber'),
                                                ]}
                                            />
                                            <FormHelperText>
                                                {t('youNeedaProductVat')}
                                            </FormHelperText>
                                        </FormControl>
                                    </FormGroup>
                                </Grid>

                                <Grid container item sm={12} spacing={0}>
                                    <FormGroup className="FormGroup">
                                        <FormControl>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                label={t('productDescription')}
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
                                                    'youNeedaProductDescription'
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
                                    style={{ marginRight: '15px' }}
                                />
                                {t('save')}
                            </Button>
                        </div>
                    </Grid>
                    <Grid container item md={3} className="panelGridRelative">
                        <div className="listViewPaper">
                            Update Images coming soon :)
                        </div>
                    </Grid>
                </Grid>
            </ValidatorForm>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={gropBoxOpen}
                onClose={() => {
                    seTgropBoxOpen(false);
                }}
            >
                <DialogTitle>{t('addNewCustomerGroupName')}</DialogTitle>
                <DialogContent>
                    <FormControl
                        className="FormControl"
                        style={{ width: '100%' }}
                    >
                        <InputLabel htmlFor="group">
                            {t('addGroupName')}
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
                        <FormHelperText>{t('addNewGroupName')}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            seTgropBoxOpen(false);
                        }}
                        color="primary"
                    >
                        {t('cancel')}
                    </Button>
                    <Button onClick={saveHandleNewGroup} color="primary">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
