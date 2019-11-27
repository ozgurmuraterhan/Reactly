import React, { forwardRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory} from 'react-router-dom'
import Select from 'react-select';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { useTranslation } from 'react-i18next';

import MaterialTable, { MTableToolbar } from 'material-table';
import Select2 from '@material-ui/core/Select';

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
  Slider,
  Tooltip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from '@material-ui/core';

import {
  AddBox,
  ExpandMore,
  FileCopy,
  GroupAdd,
  PlaylistAddCheck,
  ContactMail,
  Settings,
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
} from '@material-ui/icons';


import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


import '../../assets/css/style.css';


export default function InvoiceCreate(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [dataCustomers, seTdataCustomers] = useState([]);
  const [dataProducts, seTdataProducts] = useState([]);
  const [dataCountry, seTdataCountry] = useState([]);
  const [selectedbillingAddressStateArray, seTselectedbillingAddressStateArray] = useState([]);
  const [selectedshippingAddressStateArray, seTselectedshippingAddressStateArray] = useState([]);

  const [selectedDefaultCustomer, seTselectedDefaultCustomer] = useState([]);
  const [serie, seTserie] = useState('A');
  const [no, seTno] = useState('');
  const [default_payment_method, seTdefault_payment_method] = useState('');
  const [created, seTcreated] = useState(Date.now());
  const [dataPayments, seTdataPayments] = useState('');
  const [bank_account, seTbank_account] = useState('');


  const [dataBankAccount, seTdataBankAccount] = useState('');
  const [selectedBankAccount, seTselectedBankAccount] = useState('');
  const [dua_note, seTdua_note] = useState('');
  const [paid, seTpaid] = useState(false);
  const [due_note, seTdue_note] = useState('');
  const [due_date, seTdue_date] = useState(Date.now());
  const [paid_date, seTpaid_date] = useState(Date.now());
  const [selectedDefaultProduct, seTselectedDefaultProduct] = useState([]);
  const [product_description, seTproduct_description] = useState('');
  const [product_name, seTproduct_name] = useState('');
  const [quantity, seTquantity] = useState(1);
  const [unit, seTunit] = useState('');
  const [sale_price, seTsale_price] = useState(0);
  const [product_vat, seTproduct_vat] = useState(0);
  const [amount, seTamount] = useState(0);
  const [quantity_name, seTquantity_name] = useState(t('Qty'));
  const [items, seTitems] = useState([]);
  const [total, seTtotal] = useState(0);
  const [anyAmount, seTanyAmount] = useState(0);
  const [subtotal, seTsubtotal] = useState(0);
  const [taxtotal, seTtaxtotal] = useState(0);
  const [discountType, seTdiscountType] = useState('%');
  const [discount, seTdiscount] = useState(0);
  const [discountValue, seTdiscountValue] = useState(0);

  const [selectedbillingAddressState, seTselectedbillingAddressState] = useState([{ label: '', value: '' }]);
  const [selectedbillingAddressCountry, seTselectedbillingAddressCountry] = useState([{ label: '', value: '' }]);
  const [selectedshippingAddressState, seTselectedshippingAddressState] = useState([{ label: '', value: '' }]);
  const [selectedshippingAddressCountry, seTselectedshippingAddressCountry] = useState([{ label: '', value: '' }]);
  const [selected2Address, seTselected2Address] = useState('');
  const [selected2Town, seTselected2Town] = useState('');
  const [selected2Zipcode, seTselected2Zipcode] = useState('');
  const [selected3Address, seTselected3Address] = useState('');
  const [selected3Town, seTselected3Town] = useState('');
  const [selected3Zipcode, seTselected3Zipcode] = useState('');
  const [edit1Address, seTedit1Address] = useState(true);
  const [edit2Address, seTedit2Address] = useState(true);

  const columns = [
    {
      title: t('productName'),
      field: 'product_name',
      editComponent: (props) => (
        <TextValidator
          multiline
          required
          margin="dense"
          type="text"
          value={props.value}
          onChange={(e) => { props.onChange(e.target.value); }}
        />
      ),
    }, {
      title: t('productDescription'),
      field: 'product_description',
      editComponent: (props) => (
        <TextValidator
          multiline
          required
          margin="dense"
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    }, {
      title: t('quantity'),
      field: 'quantity',
      type: 'numeric',
      render: (rowData) => (
        <div>
          {`${rowData.quantity} ${rowData.quantity_name} ${rowData.unit}`}
        </div>
      ),
      editComponent: (props) => (
        <TextValidator
          margin="dense"
          type="number"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
            seTanyAmount(props.rowData.price * e.target.value * (1 + (props.rowData.tax / 100)));
          }}
          validators={['isNumber']}
          errorMessages={[t('thisIsNotNumber')]}
        />
      ),
    }, {
      title: t('salePrice'),
      field: 'price',
      type: 'numeric',
      editComponent: (props) => (
        <TextValidator
          margin="dense"
          type="number"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);

            seTanyAmount(e.target.value * props.rowData.quantity * (1 + (props.rowData.tax / 100)));
          }}
          validators={['isNumber']}
          errorMessages={[t('thisIsNotNumber')]}
        />
      ),
    }, {
      title: t('productVat'),
      field: 'tax',
      type: 'numeric',
      render: (rowData) => (
        <div>
          {`${rowData.tax} %`}
        </div>
      ),
      editComponent: (props) => (
        <TextValidator
          margin="dense"
          type="number"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);

            seTanyAmount(props.rowData.price * props.rowData.quantity * (1 + (e.target.value / 100)));
          }}
          validators={['isNumber']}
          errorMessages={[t('thisIsNotNumber')]}
        />
      ),
    }, {
      title: t('amount'),
      field: 'amount',
      type: 'numeric',
      editComponent: (props) => (
        <TextValidator
          margin="dense"
          type="text"
          disabled
          value={anyAmount ? (anyAmount).toFixed(0) : props.value}
          onChange={(e) => props.onChange(e.target.value)}
          validators={['isNumber']}
          errorMessages={[t('thisIsNotNumber')]}
        />
      ),
    },
  ];

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  function getCustomersF() {
    axios.get('http://localhost:5000/customers')
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
    axios.get(`http://localhost:5000/customers/${selectedOption.value}`)
      .then((response) => {
       
        seTselectedbillingAddressState([{ label: response.data.billingAddress_state_id || '', value: response.data.billingAddress_state_id || '' }]);
        seTselectedbillingAddressCountry([{ label: response.data.billingAddress_country_id || '', value: response.data.billingAddress_country_id || '' }]);
        seTselected2Address(response.data.billingAddress_address || '');
        seTselected2Town(response.data.billingAddress_town || '');
        seTselected2Zipcode(response.data.billingAddress_zipcode || 0);
        seTselectedshippingAddressState([{ label: response.data.shippingAddress_state_id, value: response.data.shippingAddress_state_id }]);
        seTselectedshippingAddressCountry([{ label: response.data.shippingAddress_country_id, value: response.data.shippingAddress_country_id }]);
        seTselected3Address(response.data.shippingAddress_address || '');
        seTselected3Town(response.data.shippingAddress_town || '');
        seTselected3Zipcode(response.data.shippingAddress_zipcode || 0);
        seTdefault_payment_method(response.data.default_payment_method);

        getStatesF1(response.data.billingAddress_country_id);
        getStatesF2(response.data.shippingAddress_country_id);
        
      })
      .catch((err) => console.log(err));
    seTselectedDefaultCustomer({ label: selectedOption.label, value: selectedOption.value });
  };

  const handleChangeDiscountType = (selectedOption) => {
    if (selectedOption.target.value == '%') {
      seTdiscountValue(((taxtotal + subtotal) * (1 + (discount / 100))) - (taxtotal + subtotal));
      seTtotal((taxtotal + subtotal) - (((taxtotal + subtotal) * (1 + (discount / 100))) - (taxtotal + subtotal)));
      seTdiscountType(selectedOption.target.value);
    } else {
      seTdiscountValue(discount);
      seTtotal((taxtotal + subtotal) - (discount));
      seTdiscountType(selectedOption.target.value);
    }
  };

  const onChangeFquantity = (e) => {
    const amount = (sale_price * e.target.value * (1 + (product_vat / 100))).toFixed(0);
    seTquantity(e.target.value);
    seTamount(amount);
  };

  const onChangeFprice = (e) => {
    const amount = (e.target.value * quantity * (1 + (product_vat / 100))).toFixed(0);
    seTsale_price(e.target.value);
    seTamount(amount);
  };

  const onChangeFproduct_vat = (e) => {
    const amount = (sale_price * quantity * (1 + (e.target.value / 100))).toFixed(0);
    seTproduct_vat(e.target.value);
    seTamount(amount);
  };

  const onChangeFdiscount = (e) => {
    totalCebirItems();

    if (discountType == '%') {
      seTdiscountValue(((taxtotal + subtotal) * (1 + (e.target.value / 100))) - (taxtotal + subtotal));
      seTtotal((taxtotal + subtotal) - (((taxtotal + subtotal) * (1 + (e.target.value / 100))) - (taxtotal + subtotal)));
      seTdiscount(e.target.value);
    } else {
      seTdiscountValue(e.target.value);
      seTtotal((taxtotal + subtotal) - (e.target.value));
      seTdiscount(e.target.value);
    }
  };

  function getPaymentsF() {
    axios.get('http://localhost:5000/payments')
      .then((response) => {
        if (response.data.length > 0) {
          const details = [];
          for (const i in response.data) {
            details.push({
              label: response.data[i].name,
              value: response.data[i]._id,
            });
          }
          seTdataPayments(details);
        }
      })
      .catch((err) => console.log(err));
  }

  function getBankAccountF() {
    axios.get('http://localhost:5000/bankaccounts')
      .then((response) => {
        if (response.data.length > 0) {
          const details = [];
          for (const i in response.data) {
            details.push({
              label: response.data[i].name,
              value: response.data[i]._id,
            });
          }
          seTdataBankAccount(details);
        }
      })
      .catch((err) => console.log(err));
  }

  const handleChangeProduct = (selectedOption) => {
    axios.get(`http://localhost:5000/products/${selectedOption.value}`)
      .then((response) => {
        const productData = response.data;
        const amount = productData.sale_price * quantity * (1 + (productData.product_vat / 100));
        seTproduct_description(productData.product_description);
        seTproduct_name(productData.product_name);
        seTsale_price(productData.sale_price);
        seTproduct_vat(productData.product_vat);
        seTamount(amount);
      })
      .catch((err) => console.log(err));
    seTselectedDefaultProduct({ label: selectedOption.label, value: selectedOption.value });
  };

  function getProductsF() {
    axios.get('http://localhost:5000/products')
      .then((response) => {
        if (response.data.length > 0) {
          const details = [];
          for (const i in response.data) {
            details.push({
              label: response.data[i].product_name,
              value: response.data[i]._id,
            });
          }

          seTdataProducts(details);
        }
      })
      .catch((err) => console.log(err));
  }

  const onClickAddItem = (e) => {
    e.preventDefault();
    items.push({
      product_name,
      product_description,
      quantity_name,
      quantity,
      unit,
      price: sale_price,
      tax: product_vat,
      amount,
    });

    seTitems(items);

    items.map((item) => (
      seTtotal(Number(total) + Number(item.amount)),
      seTsubtotal(Number(subtotal) + (Number(item.price) * Number(item.quantity))),
      seTtaxtotal(((Number(total) + Number(item.amount)) - (Number(subtotal) + (Number(item.price) * Number(item.quantity)))))
    ));
    totalCebirItems();
  };

  function totalCebirItems() {
    let total2 = 0;
    let subtotal2 = 0;
    let taxtotal2 = 0;
    const items2 = [];
    seTtaxtotal(0);

    items.map((item) => {
      total2 = (Number(total2) + item.price * item.quantity * (1 + (item.tax / 100))).toFixed(0);
      subtotal2 = Number(subtotal2) + (Number(item.price) * Number(item.quantity));
      taxtotal2 = (total2 - subtotal2);

      items2.push({
        product_name: item.product_name,
        product_description: item.product_description,
        quantity_name: item.quantity_name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        tax: item.tax,
        amount: (item.price * item.quantity * (1 + (item.tax / 100))).toFixed(0),
      });
    });

    seTtaxtotal(taxtotal2);
    seTsubtotal(subtotal2);
    seTitems(items2);

    if (discountType == '%') {
      seTdiscountValue(((taxtotal2 + subtotal2) * (1 + (discount / 100))) - (taxtotal2 + subtotal2));
      seTtotal((taxtotal2 + subtotal2) - (((taxtotal2 + subtotal2) * (1 + (discount / 100))) - (taxtotal2 + subtotal2)));
      seTdiscount(discount);
    } else {
      seTdiscountValue(discountValue);
      seTtotal((taxtotal2 + subtotal2) - (discountValue));
      seTdiscount(discount);
    }
  }

  function getCountryF() {
    axios.get('http://localhost:5000/country')
      .then((response) => {
        if (response.data.length > 0) {
          const details = [];
          for (const i in response.data) {
            details.push({
              label: response.data[i].name,
              value: [response.data[i].name, response.data[i].states],
            });
          }
          seTdataCountry(details);
        }
      })
      .catch((err) => console.log(err));
  }

  function getStatesF1(id) {
    axios.get(`http://localhost:5000/country/${id}`)
      .then((response) => {
        if (response.data[0].states.length > 0) {
          const details = [];
          for (const i in response.data[0].states) {
            details.push({
              label: response.data[0].states[i].name,
              value: response.data[0].states[i].name,
            });
          }
          seTselectedbillingAddressStateArray(details);
        }
      })
      .catch((err) => console.log(err));
  }

  function getStatesF2(id) {
    axios.get(`http://localhost:5000/country/${id}`)
      .then((response) => {
        if (response.data[0].states.length > 0) {
          const details = [];
          for (const i in response.data[0].states) {
            details.push({
              label: response.data[0].states[i].name,
              value: response.data[0].states[i].name,
            });
          }
          seTselectedshippingAddressStateArray(details);
        }
      })
      .catch((err) => console.log(err));
  }

  const onChangeFbillingAddressCountry = (selectedOption) => {
    const details = [];
    for (const i in selectedOption.value[1]) {
      details.push({
        label: selectedOption.value[1][i].name,
        value: selectedOption.value[1][i].name,
      });
    }
    seTselectedbillingAddressStateArray(details);
    seTselectedbillingAddressCountry([{ label: selectedOption.label, value: selectedOption.label }]);
  };

  const onChangeFshippingAddressCountry = (selectedOption) => {
    const details = [];
    for (const i in selectedOption.value[1]) {
      details.push({
        label: selectedOption.value[1][i].name,
        value: selectedOption.value[1][i].name,
      });
    }
    seTselectedshippingAddressStateArray(details);
    seTselectedshippingAddressCountry([{ label: selectedOption.label, value: selectedOption.label }]);
  };


  // componentDidMount = useEffect
  useEffect(() => {
    getCustomersF();
    getPaymentsF();
    getBankAccountF();
    getProductsF();
    getCountryF();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const Invoices = {
      customer_id: selectedDefaultCustomer.value,
      serie,
      no,
      created,
    };
    
    
    axios.post('http://localhost:5000/invoices/add', Invoices)
      .then((res) => {
        if (res.data.variant == 'error') {
          enqueueSnackbar(t('invoiceNotAdded') + res.data.messagge, { variant: res.data.variant });
        } else {
          enqueueSnackbar(t('invoiceAdded') + res.data.messagge, { variant: res.data.variant });
          // navigate
          history.push('/invoiceslist');
        }
      });
  };

  return (
    <div className="containerP">
      <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
        <Grid item container spacing={3}>
          <Grid item container md={10} className="panelGridRelative">
            <Card className="panelLargeIcon">
              <Receipt fontSize="large" />
            </Card>
            <Card className="listViewPaper">
              <Typography component="h1" variant="h6" color="inherit" noWrap className="typography">
                {t('invoiceCreate')}
              </Typography>
              <FormControlLabel
                style={{ float: 'right' }}
                control={
                    <Switch checked={paid} onChange={ () => { seTpaid(!paid); }} color="primary" />
                      }
                label={t('paid')}
              />
              <Grid item container sm={12}>
                <Grid container item sm={4} spacing={0}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <label className="selectLabel">{t('customer')}</label>
                            <Select
                              placeholder={t('selectCustomer')}
                              value={selectedDefaultCustomer}
                              options={dataCustomers}
                              onChange={handleChangeCustomer}
                            />
                            <FormHelperText>{t('youNeedaCustomerName')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={2} spacing={0}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                          <TextValidator
                            required
                            label={t('serie')}
                            variant="outlined"
                            margin="dense"
                            value={serie}
                            onChange={(e) => {
                              seTserie(e.target.value);
                            }}
                          />
                          <FormHelperText>{t('youNeedaSerieName')}</FormHelperText>
                        </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={3} spacing={0}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <TextValidator
                              required
                              label={t('invoiceNumber')}
                              variant="outlined"
                              margin="dense"
                              value={no}
                              onChange={(e) => { seTno(e.target.value); }}
                              validators={['isNumber']}
                              errorMessages={[t('thisIsNotNumber')]}
                            />
                            <FormHelperText>{t('youNeedaInvoiceNumber')}</FormHelperText>
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
                                label={t('createdDate')}
                                format="dd/MM/yyyy"
                                value={created}
                                onChange={(date) => seTcreated(date)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{t('youNeedaCreatedDate')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>

       <Grid container item sm={6} spacing={0} style={{ display: paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <TextValidator
                              required
                              multiline
                              label={t('duenote')}
                              variant="outlined"
                              margin="dense"
                              value={due_note}
                              onChange={(e) => {seTdue_note(e.target.value) }}
                            />
                            <FormHelperText>{t('youNeedaDueNote')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={3} spacing={0} style={{ display: paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <label className="selectLabel">{t('defaultPaymentMethod')}</label>
                            <Select
                              placeholder={t('defaultPaymentMethod')}
                              value={default_payment_method}
                              options={dataPayments}
                              onChange={(selectedOption) => { seTdefault_payment_method(selectedOption); }}
                            />
                            <FormHelperText>{t('youNeedaDefaultPaymentMethod')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={3} spacing={0} style={{ display: paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                inputVariant="outlined"
                                margin="dense"
                                id="date-picker-dialog"
                                label={t('dueDate')}
                                format="dd/MM/yyyy"
                                value={due_date}
                                onChange={(date) => {
                                  seTdue_date(date);
                                }}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{t('youNeedaDueDate')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={6} spacing={0} style={{ display: paid ? 'flex' : 'none' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <label className="selectLabel">{t('selectBankAccount')}</label>
                            <Select
                              placeholder={t('selectBankAccount')}
                              value={bank_account}
                              style={{ width: '100%', marginTop: '-6px' }}
                              options={dataBankAccount}
                              onChange={(selectedOption) => { seTbank_account(selectedOption); }}
                            />
                            <FormHelperText>{t('youNeedaselectBankAccount')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid container item sm={6} spacing={0} style={{ display: paid ? 'flex' : 'none' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                inputVariant="outlined"
                                margin="dense"
                                id="date-picker-dialog"
                                label={t('paidDate')}
                                format="dd/MM/yyyy"
                                value={paid_date}
                                onChange={(date) => {
                                  seTpaid_date(date);
                                }}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{t('youNeedaDueDate')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>
                <Grid item container sm={12} spacing={0} style={{ borderTop: '1px solid #ddd', marginTop: '25px' }}>
                  <Grid item container sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <Select
                                placeholder={t('addProduct')}
                                value={selectedDefaultProduct}
                                options={dataProducts}
                                onChange={handleChangeProduct}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    color: 'white',
                                    width: '100%',
                                    border: 0,
                                    borderBottom: '1px solid #949494',
                                    borderRadius: 0,
                                    marginTop: '10px',
                                  }),
                                }}
                              />
                              <FormHelperText>{t('youNeedaProductName')}</FormHelperText>
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid item container sm={4} spacing={0} />
                  <Grid item container sm={5} spacing={0}>
                    <RadioGroup value={quantity_name} onChange={(event) => { seTquantity_name(event.target.value); }} row>
                            <label style={{ marginTop: '31px', marginRight: '10px' }}> {t('showQuantityAs')} : </label>
                            <FormControlLabel value="Qty" control={<Radio />} label="Qty" />
                            <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                            <FormControlLabel value="Qty/Hours" control={<Radio />} label="Qty/Hours" />
                          </RadioGroup>
                  </Grid>
                  <Grid container item sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                multiline
                                label={t('productName')}
                                value={product_name}

                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={3} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                multiline
                                label={t('description')}
                                value={product_description}
                                onChange={(e) => { seTproduct_description(e.target.value); }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                type="number"
                                label={t(quantity_name)}

                                value={quantity}
                                onChange={onChangeFquantity}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                label={t('unit')}
                                value={unit}
                                onChange={(e) => { seTunit(e.target.value); }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              <FormHelperText>{t('youNeedaProductUnit')}</FormHelperText>
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                type="number"
                                label={t('price')}
                                value={sale_price}
                                onChange={onChangeFprice}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                            <FormControl>
                              <TextValidator
                                type="number"
                                label={t('tax')}
                                value={product_vat}
                                onChange={onChangeFproduct_vat}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </FormControl>
                          </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            disabled
                            type="number"
                            label={t('amount')}
                            value={amount}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </FormControl>
                      </FormGroup>
                  </Grid>
                  <Grid container item sm={1} spacing={0}>
                    <FormGroup className="FormGroup">
                      <FormControl>
                        <Button color="primary" onClick={onClickAddItem} disabled={!amount}>
                          <Tooltip title={t('Add Product')}>
                            <PlaylistAddCheck fontSize="large" />
                          </Tooltip>
                        </Button>
                      </FormControl>
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container item sm={12} spacing={0}>
                  <MaterialTable
                    title="Editable Preview"
                    columns={columns}
                    data={items}
                    icons={tableIcons}
                    style={{ width: '100%', boxShadow: '1px -2px 5px 0px #0000000f' }}
                    components={{
                            Toolbar: (props) => (
                              <div />
                            ),
                          }}
                    options={{
                            actionsColumnIndex: -1,
                            paging: false,
                          }}
                    editable={{
                                onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                                  {
                                    const index = items.indexOf(oldData);
                                    items[index] = newData;
                                    seTitems(items);
                                    totalCebirItems();
                                  }
                                  resolve();
                                }),
                                onRowDelete: (oldData) => new Promise((resolve, reject) => {
                                  {
                                    const index = items.indexOf(oldData);
                                    items.splice(index, 1);
                                    seTitems(items);
                                    totalCebirItems();
                                  }
                                  resolve();
                                }),
                            }}
                  />
                </Grid>
                <Grid container item sm={6} spacing={0} />
                <Grid container item sm={6} spacing={0}>
                  <Table style={{ marginTop: '20px' }} aria-label="spanning table">
                    <TableBody>
                      <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">{(subtotal).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>Tax</TableCell>
                        <TableCell align="right">{(taxtotal).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Discont</TableCell>
                        <TableCell>
                          <TextValidator
                            margin="dense"
                            type="number"
                            style={{ width: '200px', marginLeft: '70px' }}
                            value={discount}
                            onChange={onChangeFdiscount}
                            InputProps={{
                              endAdornment:
                                <FormControl>
                                  <Select2
                                    value={discountType}
                                    onChange={handleChangeDiscountType}
                                  >
                                    <MenuItem value="%">%</MenuItem>
                                    <MenuItem value="-">{t('fixedAmount')}</MenuItem>
                                  </Select2>
                                </FormControl>
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">{ Number(discountValue).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>{t('Total')}</TableCell>
                        <TableCell align="right">{Number(total).toFixed(2) }</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Card>
            <div className="saveButtonPlace">
              <Button type="submit" className="glow-on-hover">
                <Save fontSize="small" style={{ marginRight: '15px' }} />
                {t('save')}
              </Button>
            </div>
          </Grid>
          <Grid container item md={2} className="panelGridRelative">
            <Card className="panelLargeIcon">
              <ContactMail fontSize="large" />
            </Card>
            <Card className="listViewPaper" style={{ marginBottom: '0' }}>
              <Typography component="h5" variant="h6" color="inherit" noWrap className="typography">
                {t('addresses')}
              </Typography>
              <Grid item container sm={12} className="gridRightPlace">
                <FormControl component="fieldset" className="addressFormControll">
                  <FormLabel component="legend" style={{ width: '100%' }}>
                    {t('billingAddress')}
                    <Button style={{ float: 'right', padding: '5px', minWidth: '0' }} onClick={() => { seTedit1Address(!edit1Address); }}>
                      <Edit fontSize="small" />
                    </Button>
                  </FormLabel>
                  <div style={{ fontSize: '9pt', marginTop: '15px' }}>
                    {selected2Address || ' ------------------------------------------------------------------------ '}
                    {` ${selected2Zipcode} ` || ' ------------ '}
                    {selected2Town || ' ------------ '}
                    <br />
                    {selectedbillingAddressState[0].label || ' ------------ ' } / {selectedbillingAddressCountry[0].label || ' ------------ '}
                  </div>
                  <div style={{ display: edit1Address ? 'none' : 'flex' }}>
                    <FormLabel component="legend" />
                    <FormGroup>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="outlined-textarea"
                        label={t('address')}
                        multiline
                        margin="normal"
                        variant="outlined"
                        style={{ width: '100%', float: 'left' }}
                        value={selected2Address}
                        onChange={(e) => { seTselected2Address(e.target.value); }}
                      />
                      <FormHelperText>{t('youNeedaBillingAddress')}</FormHelperText>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <label className="selectLabel">{t('country')}</label>
                          <Select
                            placeholder={t('selectCountry')}
                            value={selectedbillingAddressCountry}
                            options={dataCountry}
                            onChange={onChangeFbillingAddressCountry}
                          />
                          <FormHelperText>{t('youNeedaCountryName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <label className="selectLabel">{t('state')}</label>
                          <Select
                            placeholder={t('selectState')}
                            value={selectedbillingAddressState}
                            options={selectedbillingAddressStateArray}
                            onChange={(selectedOption) => { seTselectedbillingAddressState([selectedOption]); }}
                          />
                          <FormHelperText>{t('youNeedaStateName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <TextValidator
                            label={t('zipcode')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            margin="dense"
                            variant="outlined"
                            value={selected2Zipcode}
                            onChange={(e) => { seTselected2Zipcode(e.target.value); }}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaZipcode')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <TextField
                            margin="dense"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            label={t('town')}
                            id="town"
                            value={selected2Town}
                            onChange={(e) => { seTselected2Town(e.target.value); }}
                          />
                          <FormHelperText>{t('youNeedaTownName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </FormGroup>
                  </div>
                </FormControl>
                <FormControl component="fieldset" style={{ width: '100%', marginTop: '25px' }}>
                  <FormLabel component="legend" style={{ width: '100%' }}>
                    {t('shippingAddress')}
                    <Button style={{ float: 'right', padding: '5px', minWidth: '0' }} onClick={() => { seTedit2Address(!edit2Address); }}>
                      <Edit fontSize="small" />
                    </Button>
                  </FormLabel>
                  <div style={{ fontSize: '9pt', marginTop: '15px' }}>
                    {selected3Address || ' ------------------------------------------------------------------------ ' } 
                    {` ${selected3Zipcode} ` || ' ------------ '} {selected3Town || ' ------------ '}
                    <br />
                    {selectedshippingAddressState[0].label || ' ------------ ' } / {selectedshippingAddressCountry[0].label || ' ------------ '}
                  </div>
                  <div style={{ display: edit2Address ? 'none' : 'flex' }}>
                    <FormGroup>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="outlined-textarea"
                        label={t('address')}
                        multiline
                        margin="normal"
                        variant="outlined"
                        style={{ width: '100%', float: 'left' }}
                        value={selected3Address}
                        onChange={(e) => { seTselected3Address(e.target.value); }}
                      />
                      <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <label className="selectLabel">{t('country')}</label>
                          <Select
                            placeholder={t('selectCountry')}
                            value={selectedshippingAddressCountry}
                            options={dataCountry}
                            onChange={onChangeFshippingAddressCountry}
                          />
                          <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <label className="selectLabel">{t('state')}</label>
                          <Select
                            placeholder={t('selectState')}
                            style={{ width: '100%' }}
                            value={selectedshippingAddressState}
                            options={selectedshippingAddressStateArray}
                            onChange={(selectedOption) => { seTselectedshippingAddressState([selectedOption]); }}
                          />
                          <FormHelperText>{t('youNeedaStateName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <TextValidator
                            label={t('zipcode')}
                            margin="dense"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={selected3Zipcode}
                            onChange={(e) => { seTselected3Zipcode(e.target.value); }}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaZipcode')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                      <FormGroup className="FormGroupAddress">
                        <FormControl>
                          <TextField
                            id="town"
                            label={t('town')}
                            margin="dense"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={selected3Town}
                            onChange={(e) => { seTselected3Town(e.target.value); }}
                          />
                          <FormHelperText>{t('youNeedaTownName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </FormGroup>
                  </div>
                </FormControl>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </ValidatorForm>
    </div>


  );
}
