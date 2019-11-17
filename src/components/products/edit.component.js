import React, { Component } from 'react';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withNamespaces } from 'react-i18next';

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

import {
  AddBox,
  GroupAdd,
  Delete,
  Save,
} from '@material-ui/icons';

import '../../assets/css/style.css';


class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openalert: false,
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


// open dialog
saveHandleNewGroup = () => {
  const data = {
    name: this.state.changeNewCategoryNameJust,
  };
  const { t } = this.props;

  axios.post('http://localhost:5000/productcategories/add', data)
    .then((res) => {
      if (res.data.variant == 'error') {
        this.key = this.props.enqueueSnackbar(t('customersGroupNotAdded') + res.data.messagge, { variant: res.data.variant });
      } else {
        this.key = this.props.enqueueSnackbar(t('customersGroupAdded'), { variant: res.data.variant });
      }


      this.getProductsGroup();
    })
    .catch((err) => console.log(err));

  this.setState({ gropBoxOpen: false });
};

  handleClickOpenGroup = () => {
    this.setState({ gropBoxOpen: true });
  };

  handleGroupBoxClose = () => {
    this.setState({ gropBoxOpen: false });
  };
  // end/ open new group dialog


  getProductsGroup() {
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

  getProductData() {
    axios.get(`http://localhost:5000/products/${this.props.match.params.id}`)
      .then((response) => {
        const details = [];
        for (const i in response.data.category_id) {
          details.push({
            label: (response.data.category_id[i].label),
            value: (response.data.category_id[i].value),
          });
        }

        this.setState({
          ...response.data,

        });

        this.setState({
          selectedCategoryItems: details,
        });
      });
  }


  componentDidMount() {
    this.getProductData();
    this.getProductsGroup();
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


        axios.post(`http://localhost:5000/products/${this.props.match.params.id}`, Product)
          .then((res) => {
            if (res.data.variant == 'error') {
              this.key = this.props.enqueueSnackbar(t('customerNotUpdated') + res.data.messagge, { variant: res.data.variant });
            } else {
              this.key = this.props.enqueueSnackbar(t('customerUpdated'), { variant: res.data.variant });
            }
            this.props.history.push('/productslist');
          })
          .catch((err) => console.log(err));
      }

    deleteData = (id) => {
      const { t } = this.props;

      axios.delete(`http://localhost:5000/products/${id}`)
        .then((res) => {
          this.props.history.push('/productslist');
          this.key = this.props.enqueueSnackbar(t('customerDeleted'), { variant: res.data.variant });
        });
    }

    handleClickOpenAlert = () => {
      this.setState({
        openalert: true,
      });
    };

    handleCloseAlert = () => {
      this.setState({
        openalert: false,
      });
    };

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
                  <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: '100%' }} className="typography">
                    {t('editProduct')}
                    <Tooltip title={t('deleteProduct')}>
                      <Button variant="outlined" color="primary" style={{ float: 'right', marginRight: '115px' }} onClick={this.handleClickOpenAlert}>
                        <Delete />
                      </Button>
                    </Tooltip>
                    <Dialog open={this.state.openalert} onClose={this.handleCloseAlert}>
                      <DialogTitle>{t('deleteProduct')}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {t('deleteInfoText1')}
                          <br />
                          {t('deleteInfoText2')}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleCloseAlert} color="primary">
                          {' '}
                          {t('cancel')}
                          {' '}
                        </Button>
                        <Button onClick={() => { this.deleteData(this.state._id); }} color="primary" autoFocus>
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
                            InputLabelProps={{ shrink: true }}
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
                            InputLabelProps={{ shrink: true }}
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
                            <label className="selectLabel">{t('category')}</label>

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
                            InputLabelProps={{ shrink: true }}
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
                            InputLabelProps={{ shrink: true }}
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
                            InputLabelProps={{ shrink: true }}
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
                            InputLabelProps={{ shrink: true }}
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
                            InputLabelProps={{ shrink: true }}
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
            onClose={this.handleGroupBoxClose}
          >
            <DialogTitle>{t('addNewCustomerGroupName')}</DialogTitle>
            <DialogContent>
              <FormControl className="FormControl" style={{ width: '100%' }}>
                <InputLabel htmlFor="group">{t('addGroupName')}</InputLabel>
                <Input
                  id="group"
                  value={this.state.changeNewCategoryNameJust}
                  onChange={this.onChangeFnewCategory}
                />
                <FormHelperText>{t('addNewGroupName')}</FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleGroupBoxClose} color="primary">
                {t('cancel')}
              </Button>
              <Button onClick={this.saveHandleNewGroup} color="primary">
                {t('save')}
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      );
    }
}


export default withNamespaces()(withSnackbar(ProductEdit));
