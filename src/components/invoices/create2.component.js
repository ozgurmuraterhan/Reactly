import React, { Component, forwardRef } from 'react';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { withNamespaces } from 'react-i18next';
import MaterialTable, { MTableToolbar } from 'material-table';

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
import Select2 from '@material-ui/core/Select';
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


class InvoiceCreate extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      selectedOption: null,
      dataCustomers: [],
      selectedDefaultCustomer: [],
      serie: 'A',
      no: '',
      created: Date.now(),
      customerData: '',
      dataPayments: '',
      dataBankAccount: '',
      selectedBankAccount: '',
      dua_note: '',
      paid: false,
      due_note: '',
      due_date: Date.now(),
      paid_date: Date.now(),
      selectedDefaultProduct: [],

      product_description: '',
      quantity: 1,
      unit: '',
      sale_price: 0,
      product_vat: 0,

      amount: 0,
      quantity_name: t('Qty'),
      items: [],
      total: 0,
      anyAmount: 0,
      subtotal: 0,
      taxtotal: 0,
      discountType: '%',
      discount: 0,
      discountValue: 0,
      selectedbillingAddressState: [{ label: '', value: '' }],
      selectedbillingAddressCountry: [{ label: '', value: '' }],
      selected2Address: '',
      selected2Town: '',
      selected2Zipcode: '',

      selectedshippingAddressState: [{ label: '', value: '' }],
      selectedshippingAddressCountry: [{ label: '', value: '' }],
      selected3Address: '',
      selected3Town: '',
      selected3Zipcode: '',

      edit1Address: true,
      edit2Address: true,

      columns: [
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
                this.setState({
                  anyAmount: props.rowData.price * e.target.value * (1 + (props.rowData.tax / 100)),
                });
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
                this.setState({
                  anyAmount: e.target.value * props.rowData.quantity * (1 + (props.rowData.tax / 100)),
                });
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
                this.setState({
                  anyAmount: props.rowData.price * props.rowData.quantity * (1 + (e.target.value / 100)),
                });
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
              value={this.state.anyAmount ? (this.state.anyAmount).toFixed(0) : props.value}
              onChange={(e) => props.onChange(e.target.value)}
              validators={['isNumber']}
              errorMessages={[t('thisIsNotNumber')]}
            />
          ),


        },
      ],

      tableIcons: {
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
      },
    };
  }


  handleCreatedDateChange = (date) => {
    this.setState({
      created: date,
    });
  };


  handleDueDateChange = (date) => {
    this.setState({
      due_date: date,
    });
  };

  handlePaid_DateChange = (date) => {
    this.setState({
      paid_date: date,
    });
  };

  handleChangePaid = () => {
    this.setState({
      paid: !this.state.paid,
    });
  }

  onEdit1Address = () => {
    this.setState({
      edit1Address: !this.state.edit1Address,
    });
  }

  onEdit2Address = () => {
    this.setState({
      edit2Address: !this.state.edit2Address,
    });
  }


  getCustomersF() {
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
          this.setState({
            dataCustomers: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }


  handleChangeCustomer = (selectedOption) => {
    axios.get(`http://localhost:5000/customers/${selectedOption.value}`)
      .then((response) => {
        const customerData = response.data;


        this.getStatesF1(customerData.billingAddress_country_id);
        this.getStatesF2(customerData.shippingAddress_country_id);


        this.setState({
          selectedbillingAddressState: [{ label: customerData.billingAddress_state_id || '', value: customerData.billingAddress_state_id || '' }],
          selectedbillingAddressCountry: [{ label: customerData.billingAddress_country_id || '', value: customerData.billingAddress_country_id || '' }],
          selected2Address: customerData.billingAddress_address || '',
          selected2Town: customerData.billingAddress_town || '',
          selected2Zipcode: customerData.billingAddress_zipcode || 0,

          selectedshippingAddressState: [{ label: customerData.shippingAddress_state_id, value: customerData.shippingAddress_state_id }],
          selectedshippingAddressCountry: [{ label: customerData.shippingAddress_country_id, value: customerData.shippingAddress_country_id }],
          selected3Address: customerData.shippingAddress_address || '',
          selected3Town: customerData.shippingAddress_town || '',
          selected3Zipcode: customerData.shippingAddress_zipcode || 0,

          default_payment_method: customerData.default_payment_method,

        });
      })
      .catch((err) => console.log(err));
    this.setState({
      selectedDefaultCustomer: { label: selectedOption.label, value: selectedOption.value },
    });
  };

  onChangeFserie = (e) => {
    this.setState({
      serie: e.target.value,
    });
  }

  onChangeFdue_note = (e) => {
    this.setState({
      due_note: e.target.value,
    });
  }

  onChangeFno = (e) => {
    this.setState({
      no: e.target.value,
    });
  }

  onChangeFdefaultPayment_Method= (selectedOption) => {
    this.setState({
      customerData: { ...this.state.customerData, default_payment_method: selectedOption },
    });
  };

  handleChangeDiscountType = (selectedOption) => {
    if (selectedOption.target.value == '%') {
      this.setState({
        discountValue: ((this.state.taxtotal + this.state.subtotal) * (1 + (this.state.discount / 100))) - (this.state.taxtotal + this.state.subtotal),
        total: (this.state.taxtotal + this.state.subtotal) - (((this.state.taxtotal + this.state.subtotal) * (1 + (this.state.discount / 100))) - (this.state.taxtotal + this.state.subtotal)),
        discountType: selectedOption.target.value,
      });
    } else {
      this.setState({
        discountValue: this.state.discount,
        total: (this.state.taxtotal + this.state.subtotal) - (this.state.discount),
        discountType: selectedOption.target.value,

      });
    }
  };

  onChangeFproduct_description = (e) => {
    this.setState({
      product_description: e.target.value,

    });
  }

  onChangeFunit = (e) => {
    this.setState({
      unit: e.target.value,

    });
  }

  onChangeFquantity = (e) => {
    const amount = (this.state.sale_price * e.target.value * (1 + (this.state.product_vat / 100))).toFixed(0);

    this.setState({
      quantity: e.target.value,
      amount,

    });
  }


  onChangeFprice = (e) => {
    const amount = (e.target.value * this.state.quantity * (1 + (this.state.product_vat / 100))).toFixed(0);

    this.setState({
      sale_price: e.target.value,
      amount,
    });
  }

  onChangeFproduct_vat = (e) => {
    const amount = (this.state.sale_price * this.state.quantity * (1 + (e.target.value / 100))).toFixed(0);

    this.setState({
      product_vat: e.target.value,
      amount,

    });
  }


  onChangeFdiscount = (e) => {
    this.totalCebirItems();

    if (this.state.discountType == '%') {
      this.setState({
        discountValue: ((this.state.taxtotal + this.state.subtotal) * (1 + (e.target.value / 100))) - (this.state.taxtotal + this.state.subtotal),
        total: (this.state.taxtotal + this.state.subtotal) - (((this.state.taxtotal + this.state.subtotal) * (1 + (e.target.value / 100))) - (this.state.taxtotal + this.state.subtotal)),
        discount: e.target.value,
      });
    } else {
      this.setState({
        discountValue: e.target.value,
        total: (this.state.taxtotal + this.state.subtotal) - (e.target.value),
        discount: e.target.value,
      });
    }
  }


  onChangeFbankAccount= (selectedOption) => {
    this.setState({
      selectedBankAccount: selectedOption,
    });
  };

  getPaymentsF() {
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
          this.setState({
            dataPayments: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }


  getBankAccountF() {
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
          this.setState({
            dataBankAccount: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }


  handleChangeProduct = (selectedOption) => {
    axios.get(`http://localhost:5000/products/${selectedOption.value}`)
      .then((response) => {
        const productData = response.data;

        const amount = productData.sale_price * this.state.quantity * (1 + (productData.product_vat / 100));

        this.setState({
          product_description: productData.product_description,
          product_name: productData.product_name,
          sale_price: productData.sale_price,
          product_vat: productData.product_vat,
          amount,
        });
      })
      .catch((err) => console.log(err));

    this.setState({
      selectedDefaultProduct: { label: selectedOption.label, value: selectedOption.value },
    });
  };


  getProductsF() {
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
          this.setState({
            dataProducts: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleChangeQuantity_name = (event) => {
    this.setState({ quantity_name: event.target.value });
  };

  onClickAddItem= (e) => {
    e.preventDefault();

    const { items } = this.state;
    items.push({

      product_name: this.state.product_name,
      product_description: this.state.product_description,
      quantity_name: this.state.quantity_name,
      quantity: this.state.quantity,
      unit: this.state.unit,
      price: this.state.sale_price,
      tax: this.state.product_vat,
      amount: this.state.amount,
    });

    this.setState({
      items,
    });

    this.state.items.map((item) => (
      this.setState({
        total: Number(this.state.total) + Number(item.amount),
        subtotal: Number(this.state.subtotal) + (Number(item.price) * Number(item.quantity)),
        taxtotal: ((Number(this.state.total) + Number(item.amount)) - (Number(this.state.subtotal) + (Number(item.price) * Number(item.quantity)))),

      })
    ));


    this.totalCebirItems();
  }

  totalCebirItems() {
    let total = 0;
    let subtotal = 0;
    let taxtotal = 0;
    const items = [];

    this.setState({
      taxtotal: 0,
    });

    this.state.items.map((item) => {
      total = (Number(total) + item.price * item.quantity * (1 + (item.tax / 100))).toFixed(0);
      subtotal = Number(subtotal) + (Number(item.price) * Number(item.quantity));
      taxtotal = (total - subtotal);

      items.push({
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

    this.setState({
      taxtotal,
      subtotal,
      items,

    });

    if (this.state.discountType == '%') {
      this.setState({
        discountValue: ((taxtotal + subtotal) * (1 + (this.state.discount / 100))) - (taxtotal + subtotal),
        total: (taxtotal + subtotal) - (((taxtotal + subtotal) * (1 + (this.state.discount / 100))) - (taxtotal + subtotal)),
        discount: this.state.discount,
      });
    } else {
      this.setState({
        discountValue: this.state.discountValue,
        total: (taxtotal + subtotal) - (this.state.discountValue),
        discount: this.state.discount,
      });
    }
  }

  getCountryF() {
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
          this.setState({
            dataCountry: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getStatesF1(id) {
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
          this.setState({
            selectedbillingAddressStateArray: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getStatesF2(id) {
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
          this.setState({
            selectedshippingAddressStateArray: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getStatesF(id) {
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
          return details;
        }
      })
      .catch((err) => console.log(err));
  }


 // Billing adress func
 onChangeF2address =(e) => {
   this.setState({
     selected2Address: e.target.value,
   });
 }

onChangeF2town =(e) => {
  this.setState({
    selected2Town: e.target.value,
  });
}

onChangeF2zipcode =(e) => {
  this.setState({
    selected2Zipcode: e.target.value,
  });
}


onChangeFbillingAddressCountry = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }

  this.setState({
    selectedbillingAddressStateArray: details,
    selectedbillingAddressCountry: [{ label: selectedOption.label, value: selectedOption.label }],
  });
};

handleChangeStates2 = (selectedOption) => {
  this.setState({
    selectedbillingAddressState: [selectedOption],
  });
};

// Billing adress func end


// Shipping adress func
onChangeF3address =(e) => {
  this.setState({
    selected3Address: e.target.value,
  });
}

onChangeFpassword =(e) => {
  this.setState({
    password: e.target.value,
  });
}

onChangeF3town =(e) => {
  this.setState({
    selected3Town: e.target.value,
  });
}

onChangeF3zipcode =(e) => {
  this.setState({
    selected3Zipcode: e.target.value,
  });
}


onChangeFshippingAddressCountry = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }

  this.setState({
    selectedshippingAddressStateArray: details,
    selectedshippingAddressCountry: [{ label: selectedOption.label, value: selectedOption.label }],

  });
};

handleChangeStates3 = (selectedOption) => {
  this.setState({
    selectedshippingAddressState: [selectedOption],
  });
};

// Shipping adress func end

componentDidMount() {
  this.getCustomersF();
  this.getPaymentsF();
  this.getBankAccountF();
  this.getProductsF();
  this.getCountryF();
}


onSubmit = (e) => {
  e.preventDefault();
  const { t } = this.props;
  const Invoices = {
    customer_id: this.state.selectedDefaultCustomer.value,
    serie: this.state.serie,
    no: this.state.no,
    created: this.state.created,


  };

  axios.post('http://localhost:5000/invoices/add', Invoices)
    .then((res) => {
      if (res.data.variant == 'error') {
        this.key = this.props.enqueueSnackbar(t('invoiceNotAdded') + res.data.messagge, { variant: res.data.variant });
      } else {
        this.key = this.props.enqueueSnackbar(t('invoiceAdded'), { variant: res.data.variant });

        // navigate
        this.props.history.push('/invoiceslist');
      }
    });
}

render() {
  const { t } = this.props;
  return (

    <div className="containerP">
      <ValidatorForm autoComplete="off" onSubmit={this.onSubmit}>
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
                  <Switch checked={this.state.paid} onChange={this.handleChangePaid} color="primary" />
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
                              value={this.state.selectedDefaultCustomer}
                              options={this.state.dataCustomers}
                              onChange={this.handleChangeCustomer}
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
                              value={this.state.serie}
                              onChange={this.onChangeFserie}
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
                              value={this.state.no}
                              onChange={this.onChangeFno}
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
                                value={this.state.created}
                                onChange={this.handleCreatedDateChange}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{t('youNeedaCreatedDate')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>

                <Grid container item sm={6} spacing={0} style={{ display: this.state.paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <TextValidator
                              required
                              multiline
                              label={t('duenote')}
                              variant="outlined"
                              margin="dense"
                              value={this.state.due_note}
                              onChange={this.onChangeFdue_note}
                            />
                            <FormHelperText>{t('youNeedaDueNote')}</FormHelperText>

                          </FormControl>

                  </FormGroup>
                </Grid>

                <Grid container item sm={3} spacing={0} style={{ display: this.state.paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <label className="selectLabel">{t('defaultPaymentMethod')}</label>
                            <Select
                              placeholder={t('defaultPaymentMethod')}
                              value={this.state.default_payment_method}
                              options={this.state.dataPayments}
                              onChange={this.onChangeFdefaultPayment_Method}
                            />
                            <FormHelperText>{t('youNeedaDefaultPaymentMethod')}</FormHelperText>
                          </FormControl>
                  </FormGroup>

                </Grid>

                <Grid container item sm={3} spacing={0} style={{ display: this.state.paid ? 'none' : 'flex' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                              <KeyboardDatePicker
                                inputVariant="outlined"
                                margin="dense"
                                id="date-picker-dialog"
                                label={t('dueDate')}
                                format="dd/MM/yyyy"
                                value={this.state.due_date}
                                onChange={this.handleDueDateChange}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{t('youNeedaDueDate')}</FormHelperText>
                          </FormControl>
                  </FormGroup>
                </Grid>

                <Grid container item sm={6} spacing={0} style={{ display: this.state.paid ? 'flex' : 'none' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <label className="selectLabel">{t('selectBankAccount')}</label>
                            <Select
                              placeholder={t('selectBankAccount')}
                              value={this.state.bank_account}
                              style={{ width: '100%', marginTop: '-6px' }}
                              options={this.state.dataBankAccount}
                              onChange={this.onChangeFbankAccount}
                            />
                            <FormHelperText>{t('youNeedaselectBankAccount')}</FormHelperText>
                          </FormControl>
                  </FormGroup>

                </Grid>

                <Grid container item sm={6} spacing={0} style={{ display: this.state.paid ? 'flex' : 'none' }}>
                  <FormGroup className="FormGroup">
                    <FormControl>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                              <KeyboardDatePicker
                                inputVariant="outlined"
                                margin="dense"
                                id="date-picker-dialog"
                                label={t('paidDate')}
                                format="dd/MM/yyyy"
                                value={this.state.paid_date}
                                onChange={this.handlePaid_DateChange}
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
                                value={this.state.selectedDefaultProduct}
                                options={this.state.dataProducts}
                                onChange={this.handleChangeProduct}

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

                    <RadioGroup value={this.state.quantity_name} onChange={this.handleChangeQuantity_name} row>
                            <label style={{ marginTop: '31px', marginRight: '10px' }}>
                              {' '}
                              {t('showQuantityAs')}
:
                              {' '}
                            </label>
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
                                value={this.state.product_name}
                                onChange={this.onChangeFproduct_name}
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
                                value={this.state.product_description}
                                onChange={this.onChangeFproduct_description}
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
                                label={t(this.state.quantity_name)}

                                value={this.state.quantity}
                                onChange={this.onChangeFquantity}
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
                                value={this.state.unit}
                                onChange={this.onChangeFunit}
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
                                value={this.state.sale_price}
                                onChange={this.onChangeFprice}
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
                                value={this.state.product_vat}
                                onChange={this.onChangeFproduct_vat}
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
                                value={this.state.amount}
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

                              <Button color="primary" onClick={this.onClickAddItem} disabled={!this.state.amount}>
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
                    columns={this.state.columns}
                    data={this.state.items}
                    icons={this.state.tableIcons}

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
                                const { items } = this.state;
                                const index = items.indexOf(oldData);
                                items[index] = newData;
                                this.setState({ items }, () => resolve());
                                this.totalCebirItems();
                              }
                              resolve();
                            }),
                            onRowDelete: (oldData) => new Promise((resolve, reject) => {
                              {
                                const { items } = this.state;
                                const index = items.indexOf(oldData);
                                items.splice(index, 1);
                                this.setState({ items }, () => resolve());
                                this.totalCebirItems();
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
                              <TableCell align="right">{(this.state.subtotal).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2}>Tax</TableCell>
                              <TableCell align="right">{(this.state.taxtotal).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Discont</TableCell>
                              <TableCell>
                                <TextValidator
                                  margin="dense"

                                  type="number"
                                  style={{ width: '200px', marginLeft: '70px' }}
                                  value={this.state.discount}
                                  onChange={this.onChangeFdiscount}
                                  InputProps={{
                                    endAdornment:
  <FormControl>
    <Select2
      value={this.state.discountType}
      onChange={this.handleChangeDiscountType}
    >
      <MenuItem value="%">%</MenuItem>
      <MenuItem value="-">{t('fixedAmount')}</MenuItem>
    </Select2>
  </FormControl>,
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">{ Number(this.state.discountValue).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2}>{t('Total')}</TableCell>
                              <TableCell align="right">{Number(this.state.total).toFixed(2) }</TableCell>
                            </TableRow>
                          </TableBody>
                  </Table>
                </Grid>

              </Grid>
            </Card>
            <div className="saveButtonPlace">
              <Button type="submit" className="glow-on-hover">
                <Save fontSize="small" style={{ marginRight: '15px' }} />
                {' '}
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
                    {' '}
                    <Button style={{ float: 'right', padding: '5px', minWidth: '0' }} onClick={this.onEdit1Address}>
                            {' '}
                            <Edit fontSize="small" />
                            {' '}
                          </Button>
                  </FormLabel>

                  <div style={{ fontSize: '9pt', marginTop: '15px' }}>
                    {this.state.selected2Address || ' ------------------------------------------------------------------------ '}
                    {' '}
                    {` ${this.state.selected2Zipcode} ` || ' ------------ '}
                    {' '}
                    {this.state.selected2Town || ' ------------ '}
                    {' '}
                    <br />
                    {this.state.selectedbillingAddressState[0].label || ' ------------ ' }
                    {' '}
/
                    {this.state.selectedbillingAddressCountry[0].label || ' ------------ '}

                  </div>
                  <div style={{ display: this.state.edit1Address ? 'none' : 'flex' }}>
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
                              value={this.state.selected2Address}
                              onChange={this.onChangeF2address}
                            />
                            <FormHelperText>{t('youNeedaBillingAddress')}</FormHelperText>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('country')}</label>
                                <Select
                                  placeholder={t('selectCountry')}
                                  value={this.state.selectedbillingAddressCountry}
                                  options={this.state.dataCountry}
                                  onChange={this.onChangeFbillingAddressCountry}
                                />
                                <FormHelperText>{t('youNeedaCountryName')}</FormHelperText>
                              </FormControl>
                            </FormGroup>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('state')}</label>
                                <Select
                                  placeholder={t('selectState')}
                                  value={this.state.selectedbillingAddressState}
                                  options={this.state.selectedbillingAddressStateArray}
                                  onChange={this.handleChangeStates2}
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
                                  value={this.state.selected2Zipcode}
                                  onChange={this.onChangeF2zipcode}
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
                                  value={this.state.selected2Town}
                                  onChange={this.onChangeF2town}
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
                    {' '}
                    <Button style={{ float: 'right', padding: '5px', minWidth: '0' }} onClick={this.onEdit2Address}>
                            {' '}
                            <Edit fontSize="small" />
                            {' '}
                          </Button>
                  </FormLabel>

                  <div style={{ fontSize: '9pt', marginTop: '15px' }}>
                    {this.state.selected3Address || ' ------------------------------------------------------------------------ ' }
                    {' '}
                    {` ${this.state.selected3Zipcode} ` || ' ------------ '}
                    {' '}
                    {this.state.selected3Town || ' ------------ '}
                    {' '}
                    <br />
                    {this.state.selectedshippingAddressState[0].label || ' ------------ ' }
                    {' '}
/
                    {this.state.selectedshippingAddressCountry[0].label || ' ------------ '}

                  </div>
                  <div style={{ display: this.state.edit2Address ? 'none' : 'flex' }}>

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
                              value={this.state.selected3Address}
                              onChange={this.onChangeF3address}
                            />
                            <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('country')}</label>
                                <Select
                                  placeholder={t('selectCountry')}
                                  value={this.state.selectedshippingAddressCountry}
                                  options={this.state.dataCountry}
                                  onChange={this.onChangeFshippingAddressCountry}
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
                                  value={this.state.selectedshippingAddressState}
                                  options={this.state.selectedshippingAddressStateArray}
                                  onChange={this.handleChangeStates3}
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
                                  value={this.state.selected3Zipcode}
                                  onChange={this.onChangeF3zipcode}
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
                                  value={this.state.selected3Town}
                                  onChange={this.onChangeF3town}
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
}

export default withNamespaces()(withSnackbar(InvoiceCreate));
