import React, { Component } from 'react';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { withNamespaces } from 'react-i18next';

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
} from '@material-ui/core';

import {
  AddBox,
  GroupAdd,
  Save,
} from '@material-ui/icons';

import '../../assets/css/style.css';


class ProductCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      dataState: [],
      newDataState: [],
      gropBoxOpen: false,
      changeNewGroupName: [],
      selectedCategoryItems: [],
      changeNewCategoryNameJust: '',

      //
      product_name: '',
      category_id: [],
      product_code: '',
      product_description: '',
      purchase_price: 0,
      sale_price: 0,
      product_vat: 0,
      product_stock: 0,
      spesific_id: '',


    };
  }


  onChangeFproduct_name = (e) => {
    this.setState({
      product_name: e.target.value,
    });
  }

  onChangeFproduct_description = (e) => {
    this.setState({
      product_description: e.target.value,
    });
  }

  onChangeFproduct_stock = (e) => {
    this.setState({
      product_stock: e.target.value,
    });
  }

  onChangeFproduct_vat = (e) => {
    this.setState({
      product_vat: e.target.value,
    });
  }

  onChangeFsale_price = (e) => {
    this.setState({
      sale_price: e.target.value,
    });
  }

  onChangeFpurchase_price = (e) => {
    this.setState({
      purchase_price: e.target.value,
    });
  }


    onChangeFnewCategory = (e) => {
      this.setState({
        changeNewCategoryNameJust: e.target.value,
      });
    }

    onChangeFproduct_code = (e) => {
      this.setState({
        product_code: e.target.value,
      });
    }

    onChangeFcategory_id = (selectedOption) => {
      this.setState({
        selectedCategoryItems: selectedOption,
      });
    }


// open new category dialog
saveHandleNewCategory = () => {
  const data = {
    name: this.state.changeNewCategoryNameJust,
  };
  const { t } = this.props;

  axios.post('http://localhost:5000/productcategories/add', data)
    .then((res) => {
      if (res.data.variant == 'error') {
        this.key = this.props.enqueueSnackbar(t('productCategoryNotAdded') + res.data.messagge, { variant: res.data.variant });
      } else {
        this.key = this.props.enqueueSnackbar(t('productCategoryAdded'), { variant: res.data.variant });
      }

      this.getProductCategories();
    })
    .catch((err) => console.log(err));

  this.setState({ gropBoxOpen: false });
};

  handleClickOpenGroup = () => {
    this.setState({ gropBoxOpen: true });
  };

  handleCategoryBoxClose = () => {
    this.setState({ gropBoxOpen: false });
  };
  // end/ open  dialog


  getProductCategories() {
    axios.get('http://localhost:5000/productcategories/')
      .then((res) => {
        if (res.data.length > 0) {
          const details = [];
          for (const i in res.data) {
            details.push({
              label: res.data[i].name,
              value: res.data[i]._id,
            });
          }

          this.setState({
            findProductsCategories: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }


  componentDidMount() {
    this.getProductCategories();
  }


  onSubmit = (e) => {
    e.preventDefault();
    const { t } = this.props;
    const Product = {

      product_name: this.state.product_name,
      category_id: this.state.selectedCategoryItems,
      product_code: this.state.product_code,
      product_description: this.state.product_description,
      purchase_price: this.state.purchase_price,
      sale_price: this.state.sale_price,
      product_vat: this.state.product_vat,
      product_stock: this.state.product_stock,

    };

    axios.post('http://localhost:5000/products/add', Product)
      .then((res) => {
        if (res.data.variant == 'error') {
          this.key = this.props.enqueueSnackbar(t('productNotAdded') + res.data.messagge, { variant: res.data.variant });
        } else {
          this.key = this.props.enqueueSnackbar(t('productAdded'), { variant: res.data.variant });
        }

        // navigate
        this.props.history.push('/productslist');
      });
  }

  render() {
    const { t } = this.props;
    return (

      <div className="containerP">
        <ValidatorForm autoComplete="off" onSubmit={this.onSubmit}>
          <Grid item container spacing={3}>
            <Grid item container md={9} className="panelGridRelative">
              <Card className="panelLargeIcon">
                <GroupAdd fontSize="large" />
              </Card>
              <div className="listViewPaper">
                <Typography component="h1" variant="h6" color="inherit" noWrap className="typography">
                  {t('productCreate')}
                </Typography>
                <Grid item container sm={12}>
                  <Grid container item sm={4} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextValidator
                              variant="outlined"
                              margin="dense"
                              label={t('productName')}
                              value={this.state.product_name}
                              onChange={this.onChangeFproduct_name}
                              required
                            />
                            <FormHelperText>{t('youNeedaProductName')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>

                  <Grid container item sm={4} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextValidator
                              variant="outlined"
                              margin="dense"
                              label={t('productCode')}
                              value={this.state.product_code}
                              onChange={this.onChangeFproduct_code}
                              required

                            />
                            <FormHelperText>{t('youNeedaProductCode')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid container item sm={4} spacing={0}>

                    <Grid container item sm={1} spacing={0}>

                      <Tooltip title={t('addNewCategory')}>
                            <AddBox onClick={this.handleClickOpenGroup} fontSize="large" style={{ margin: '20px 10px 0 5px' }} />
                          </Tooltip>
                    </Grid>
                    <Grid container item sm={11} spacing={0}>
                      <div style={{ marginTop: '0px', clear: 'both' }} />
                      <FormGroup className="FormGroup">
                            <FormControl>

                              <Select
                                isMulti
                                placeholder={t('selectCategory')}
                                value={this.state.selectedCategoryItems}
                                options={this.state.findProductsCategories}
                                onChange={this.onChangeFcategory_id}
                              />
                              <FormHelperText>{t('youNeedSelectCategories')}</FormHelperText>

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
                              label={t('purchasePrice')}
                              value={this.state.purchase_price}
                              onChange={this.onChangeFpurchase_price}
                              required
                              type="number"
                              validators={['isNumber']}
                              errorMessages={[t('thisIsNotNumber')]}

                            />
                            <FormHelperText>{t('youNeedaPurchasePrice')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>

                  <Grid container item sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextValidator
                              variant="outlined"
                              margin="dense"
                              label={t('salePrice')}
                              value={this.state.sale_price}
                              onChange={this.onChangeFsale_price}
                              required
                              type="number"
                              validators={['isNumber']}
                              errorMessages={[t('thisIsNotNumber')]}

                            />
                            <FormHelperText>{t('youNeedaSalePrice')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>

                  <Grid container item sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextValidator
                              variant="outlined"
                              margin="dense"
                              label={t('productStock')}
                              value={this.state.product_stock}
                              onChange={this.onChangeFproduct_stock}
                              required
                              type="number"
                              validators={['isNumber']}
                              errorMessages={[t('thisIsNotNumber')]}

                            />
                            <FormHelperText>{t('youNeedaProductStock')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>


                  <Grid container item sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextValidator
                              variant="outlined"
                              margin="dense"
                              label={t('productVat')}
                              value={this.state.product_vat}
                              onChange={this.onChangeFproduct_vat}
                              required
                              type="number"
                              validators={['isNumber']}
                              errorMessages={[t('thisIsNotNumber')]}

                            />
                            <FormHelperText>{t('youNeedaProductVat')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>


                  <Grid container item sm={12} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                            <TextField
                              variant="outlined"
                              label={t('productDescription')}
                              multiline
                              margin="normal"
                              value={this.state.product_description}
                              onChange={this.onChangeFproduct_description}
                            />
                            <FormHelperText>{t('youNeedaProductDescription')}</FormHelperText>
                          </FormControl>
                    </FormGroup>
                  </Grid>

                </Grid>
              </div>
              <div className="saveButtonPlace">
                <Button type="submit" className="glow-on-hover">
                  <Save fontSize="small" style={{ marginRight: '15px' }} />
                  {' '}
                  {t('save')}
                </Button>
              </div>
            </Grid>
            <Grid container item md={3} className="panelGridRelative">

              <div className="listViewPaper">
                    ds
              </div>

            </Grid>
          </Grid>
        </ValidatorForm>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.gropBoxOpen}
          onClose={this.handleCategoryBoxClose}
        >

          <DialogTitle>{t('addNewProductCategoryName')}</DialogTitle>
          <DialogContent>
            <FormControl className="FormControl" style={{ width: '100%' }}>
              <InputLabel htmlFor="group">{t('addCategoryName')}</InputLabel>
              <Input
                id="group"
                value={this.state.changeNewCategoryNameJust}
                onChange={this.onChangeFnewCategory}
              />
              <FormHelperText>{t('addCategoryName')}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCategoryBoxClose} color="primary">
              {t('cancel')}
            </Button>
            <Button onClick={this.saveHandleNewCategory} color="primary">
              {t('save')}
            </Button>
          </DialogActions>
        </Dialog>


      </div>


    );
  }
}

export default withNamespaces()(withSnackbar(ProductCreate));
