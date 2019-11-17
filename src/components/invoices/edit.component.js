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
  Grid,
} from '@material-ui/core';

import {
  AddBox,
  ExpandMore,
  FileCopy,
  GroupAdd,
  Delete,
  ContactMail,
  Save,
} from '@material-ui/icons';

import '../../assets/css/style.css';


class CustomerEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {

      openalert: false,
      selectedOption: null,
      dataState: [],
      newDataState: [],
      selectedDefaultCountry: [],
      selectedDefaultStates: [],
      gropBoxOpen: false,
      changeNewGroupName: '',
      changeNewGroupNameJust: '',
      gropBoxOpenSpesific: false,

      selected1Town: '',
      selected2Town: '',
      selected3Town: '',

      selected1Address: '',
      selected2Address: '',
      Selected3Address: '',


      selected1Zipcode: '',
      selected2Zipcode: '',
      selected3Zipcode: '',

      company: '',
      email: '',
      password: '',
      group_id: '',
      taxoffice: '',
      taxnumber: '',
      ssn: '',
      executive: '',
      phone: '',
      fax: '',
      web: '',
      default_payment_method: '',
      risk: 0,


    };
  }


    onChangeFcompany = (e) => {
      this.setState({
        company: e.target.value,
      });
    }

    onChangeFweb = (e) => {
      this.setState({
        web: e.target.value,
      });
    }

    onChangeFemail = (e) => {
      this.setState({
        email: e.target.value,
      });
    }


    onChangeFgroup_id = (selectedOption) => {
      this.setState({
        selectedGroupItems: selectedOption,
      });
    }


    onChangeFnewGroup = (e) => {
      this.setState({
        changeNewGroupNameJust: e.target.value,
      });
    }


    onChangeFtaxoffice = (e) => {
      this.setState({
        taxoffice: e.target.value,
      });
    }

    onChangeFtaxnumber = (e) => {
      this.setState({
        taxnumber: e.target.value,
      });
    }

    onChangeFssn = (e) => {
      this.setState({
        ssn: e.target.value,
      });
    }

    onChangeFexecutive = (e) => {
      this.setState({
        executive: e.target.value,
      });
    }

    onChangeFphone = (e) => {
      this.setState({
        phone: e.target.value,
      });
    }

    onChangeFfax = (e) => {
      this.setState({
        fax: e.target.value,
      });
    }

    onChangeFrisk = (e, val) => {
      e.preventDefault();
      this.setState({
        risk: val,
      });
    }

    onChangeFdefaultPayment_Method= (selectedOption) => {
      this.setState({
        default_payment_method: selectedOption,
      });
    };

  // default adress func
  onChangeF1address =(e) => {
    this.setState({
      selected1Address: e.target.value,
    });
  }

  onChangeF1town =(e) => {
    this.setState({
      selected1Town: e.target.value,
    });
  }

  onChangeF1zipcode =(e) => {
    this.setState({
      selected1Zipcode: e.target.value,
    });
  }


  handleChangeCountry1 = (selectedOption) => {
    const details = [];
    for (const i in selectedOption.value[1]) {
      details.push({
        label: selectedOption.value[1][i].name,
        value: selectedOption.value[1][i].name,
      });
    }


    this.setState({
      selectedDefaultStateArray: details,
      selectedDefaultAddressCountryEdit: [{ label: selectedOption.label, value: selectedOption.label }],
      selectedDefaultState: ['Select State'],

    });
  };

  handleChangeStates1 = (selectedOption) => {
    this.setState({
      selectedDefaultAddressStateEdit: [selectedOption],
    });
  };
  // default adress func end


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


handleChangeCountry2 = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }


  this.setState({
    selectedBillingStateArray: details,
    selectedBillingAddressCountryEdit2: [{ label: selectedOption.label, value: selectedOption.label }],
    selectedBillingState: ['Select State'],

  });
};

  handleChangeStates2 = (selectedOption) => {
    this.setState({
      selectedBillingAddressStateEdit3: [selectedOption],
    });
  };

  // Billing adress func end


// Shipping adress func
onChangeF3address =(e) => {
  this.setState({
    Selected3Address: e.target.value,
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


handleChangeCountry3 = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }


  this.setState({
    selectedShippingStateArray: details,
    selectedShippingAddressCountryEdit2: [{ label: selectedOption.label, value: selectedOption.label }],
    selectedShippingState: ['Select State'],

  });
};

  handleChangeStates3 = (selectedOption) => {
    this.setState({
      selectedShippingAddressStateEdit2: [selectedOption],
    });
  };


  // end Shipping adress func end


// open new group dialog
saveHandleNewGroup = () => {
  const data = {
    name: this.state.changeNewGroupNameJust,
  };
  const { t } = this.props;

  axios.post('http://localhost:5000/customersgroups/add', data)
    .then((res) => {
      if (res.data.variant == 'error') {
        this.key = this.props.enqueueSnackbar(t('customersGroupNotAdded') + res.data.messagge, { variant: res.data.variant });
      } else {
        this.key = this.props.enqueueSnackbar(t('customersGroupAdded'), { variant: res.data.variant });
      }


      this.getCustomersGroup();
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


  getCustomersGroup() {
    axios.get('http://localhost:5000/customersgroups/')
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
            findCustomersGroup: details,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getCustomersData() {
    axios.get(`http://localhost:5000/customers/${this.props.match.params.id}`)
      .then((response) => {
        const details = [];
        for (const i in response.data.group_id) {
          details.push({
            label: (response.data.group_id[i].label),
            value: (response.data.group_id[i].value),
          });
        }

        this.setState({
          ...response.data,

        });

        this.setState({
          selected1Address: response.data.defaultAddress_address,
          selected2Address: response.data.billingAddress_address,
          Selected3Address: response.data.shippingAddress_address,

          selected1Town: response.data.defaultAddress_town,
          selected2Town: response.data.billingAddress_town,
          selected3Town: response.data.shippingAddress_town,
          risk: response.data.risk,

          selected1Zipcode: response.data.defaultAddress_zipcode,
          selected2Zipcode: response.data.billingAddress_zipcode,
          selected3Zipcode: response.data.shippingAddress_zipcode,


          selectedDefaultAddressCountryEdit: [{ label: response.data.defaultAddress_country_id, value: response.data.defaultAddress_country_id }],
          selectedDefaultAddressStateEdit: [{ label: response.data.defaultAddress_state_id, value: response.data.defaultAddress_state_id }],

          selectedBillingAddressCountryEdit2: [{ label: response.data.billingAddress_country_id, value: response.data.billingAddress_country_id }],
          selectedBillingAddressStateEdit3: [{ label: response.data.billingAddress_state_id, value: response.data.billingAddress_state_id }],

          selectedShippingAddressCountryEdit2: [{ label: response.data.shippingAddress_country_id, value: response.data.shippingAddress_country_id }],
          selectedShippingAddressStateEdit2: [{ label: response.data.shippingAddress_state_id, value: response.data.shippingAddress_state_id }],
          selectedGroupItems: details,
        });
      });
  }

      onCopyDefaultAdressTObillingAdress = () => {
        this.setState({
          selectedBillingAddressCountryEdit2: this.state.selectedDefaultAddressCountryEdit,
          selectedBillingAddressStateEdit3: this.state.selectedDefaultAddressStateEdit,
          selected2Address: this.state.selected1Address,
          selected2Town: this.state.selected1Town,
          selected2Zipcode: this.state.selected1Zipcode,
        });
      }

      onCopyBillingAdressTOshippingAdress = () => {
        this.setState({
          selectedShippingAddressCountryEdit2: this.state.selectedBillingAddressCountryEdit2,
          selectedShippingAddressStateEdit2: this.state.selectedBillingAddressStateEdit3,
          selected3Address: this.state.selected2Address,
          selected3Town: this.state.selected2Town,
          selected3Zipcode: this.state.selected2Zipcode,
        });
      }

      componentDidMount() {
        this.getCustomersData();
        this.getCustomersGroup();
        this.getCountryF();
      }


      onSubmit = (e) => {
        e.preventDefault();
        const { t } = this.props;

        const Customers = {
          company: this.state.company,
          email: this.state.email,
          password: this.state.password,
          group_id: this.state.selectedGroupItems,
          taxoffice: this.state.taxoffice,
          taxnumber: this.state.taxnumber,
          ssn: this.state.ssn,
          executive: this.state.executive,
          phone: this.state.phone,
          fax: this.state.fax,
          web: this.state.web,
          default_payment_method: this.state.default_payment_method,
          risk: this.state.risk,

          defaultAddress_country_id: this.state.selectedDefaultAddressCountryEdit[0].label,
          defaultAddress_state_id: this.state.selectedDefaultAddressStateEdit[0].label,
          defaultAddress_town: this.state.selected1Town,
          defaultAddress_zipcode: this.state.selected1Zipcode,
          defaultAddress_address: this.state.selected1Address,

          billingAddress_country_id: this.state.selectedBillingAddressCountryEdit2[0].label,
          billingAddress_state_id: this.state.selectedBillingAddressStateEdit3[0].label,
          billingAddress_town: this.state.selected2Town,
          billingAddress_zipcode: this.state.selected2Zipcode,
          billingAddress_address: this.state.selected2Address,

          shippingAddress_country_id: this.state.selectedShippingAddressCountryEdit2[0].label,
          shippingAddress_state_id: this.state.selectedShippingAddressStateEdit2[0].label,
          shippingAddress_town: this.state.selected3Town,
          shippingAddress_zipcode: this.state.selected3Zipcode,
          shippingAddress_address: this.state.Selected3Address,


        };

        axios.post(`http://localhost:5000/customers/${this.props.match.params.id}`, Customers)
          .then((res) => {
            if (res.data.variant == 'error') {
              this.key = this.props.enqueueSnackbar(t('customerNotUpdated') + res.data.messagge, { variant: res.data.variant });
            } else {
              this.key = this.props.enqueueSnackbar(t('customerUpdated'), { variant: res.data.variant });
            }


            this.props.history.push('/customerslist');
          })
          .catch((err) => console.log(err));
      }

    deleteData = (id) => {
      const { t } = this.props;

      axios.delete(`http://localhost:5000/customers/${id}`)
        .then((res) => {
          this.props.history.push('/customerslist');
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
                <Card className="listViewPaper">
                  <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: '100%' }} className="typography">
                    {t('editCustomer')}

                    <Tooltip title={t('deleteCustomer')}>
                      <Button variant="outlined" color="primary" style={{ float: 'right', marginRight: '115px' }} onClick={this.handleClickOpenAlert}>
                        <Delete />
                      </Button>
                    </Tooltip>

                    <Dialog open={this.state.openalert} onClose={this.handleCloseAlert}>
                      <DialogTitle>{t('deleteCustomer')}</DialogTitle>
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
                  <Grid item container sm={12} style={{ background: '#fff', float: 'left' }}>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            required
                            variant="outlined"
                            margin="dense"
                            label={t('company')}
                            value={this.state.company}
                            onChange={this.onChangeFcompany}
                          />
                          <FormHelperText>{t('youNeedaCompanyName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            required
                            variant="outlined"
                            margin="dense"
                            label={t('email')}
                            value={this.state.email}
                            onChange={this.onChangeFemail}
                            validators={['isEmail']}
                            errorMessages={[t('emailIsNotValid')]}
                          />
                          <FormHelperText>{t('youNeedaEmail')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextField
                            variant="outlined"
                            margin="dense"
                            label={t('password')}
                            required
                            value={this.state.password}
                            onChange={this.onChangeFpassword}
                          />
                          <FormHelperText>{t('youNeedaPassword')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <Grid container item sm={1} spacing={0}>
                        <Tooltip title={t('addNewGroupName')}>
                          <AddBox onClick={this.handleClickOpenGroup} fontSize="large" style={{ margin: '20px 10px 0 5px' }} />
                        </Tooltip>
                      </Grid>
                      <Grid container item sm={11} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <label className="selectLabel">{t('selectGropName')}</label>
                            <Select
                            isMulti
                            placeholder={t('selectGropName')}
                            value={this.state.selectedGroupItems}
                            style={{ width: '100%', marginTop: '-6px' }}
                            options={this.state.findCustomersGroup}
                            onChange={this.onChangeFgroup_id}
                          />
                          </FormControl>
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            variant="outlined"
                            margin="dense"
                            label={t('taxNumber')}
                            value={this.state.taxnumber}
                            onChange={this.onChangeFtaxnumber}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaTaxnumber')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextField
                            variant="outlined"
                            margin="dense"
                            label={t('taxOffice')}
                            value={this.state.taxoffice}
                            onChange={this.onChangeFtaxoffice}
                          />
                          <FormHelperText>{t('youNeedaTaxOfficeName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            variant="outlined"
                            margin="dense"
                            label={t('SSN')}
                            value={this.state.ssn}
                            onChange={this.onChangeFssn}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaSSN')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextField
                            variant="outlined"
                            margin="dense"
                            label={t('executive')}
                            value={this.state.executive}
                            onChange={this.onChangeFexecutive}
                          />
                          <FormHelperText>{t('youNeedaExecutiveName')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            variant="outlined"
                            margin="dense"
                            label={t('phone')}
                            value={this.state.phone}
                            onChange={this.onChangeFphone}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaPhone')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextValidator
                            variant="outlined"
                            margin="dense"
                            label={t('fax')}
                            value={this.state.fax}
                            onChange={this.onChangeFfax}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                          <FormHelperText>{t('youNeedaFax')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <TextField
                            variant="outlined"
                            margin="dense"
                            label={t('webSite')}
                            value={this.state.web}
                            onChange={this.onChangeFweb}
                          />
                          <FormHelperText>{t('youNeedaWebSiteUrl')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <FormGroup className="FormGroup">
                        <FormControl>
                          <label className="selectLabel">{t('defaultPaymentMethod')}</label>
                          <Select
                            placeholder={t('defaultPaymentMethod')}
                            style={{ width: '100%', marginTop: '-6px' }}
                            options={[
                            { label: 'Paypal', value: 1 },
                            { label: 'Bank', value: 2 },
                          ]}
                            onChange={this.onChangeFdefaultPayment_Method}
                          />
                          <FormHelperText>{t('youNeedaDefaultPaymentMethod')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={12}>
                      <FormGroup className="FormGroup" style={{ margin: '50px' }}>
                        <InputLabel htmlFor="risk" className="InputLabel">{t('riskSource')}</InputLabel>
                        <FormControl>
                          <Slider
                            color="secondary"
                            value={this.state.risk}
                            onChangeCommitted={this.onChangeFrisk}
                            passive={0}
                            valueLabelDisplay="on"
                            step={5}
                            min={0}
                            max={100}
                          />
                          <FormHelperText>{t('pleaseSelectRiskSource')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
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
              <Grid container item md={3} className="panelGridRelative">
                <Card className="panelLargeIcon">
                  <ContactMail fontSize="large" />
                </Card>
                <Card className="listViewPaper" style={{ marginBottom: '0' }}>
                  <Typography component="h5" variant="h6" color="inherit" noWrap className="typography">
                    {t('addresses')}
                  </Typography>
                  <Grid item container sm={12} className="gridRightPlace">
                    <FormControl component="fieldset" className="addressFormControll">
                      <FormLabel component="legend">{t('defaultAddress')}</FormLabel>
                      <FormGroup>
                        <TextField
                          id="outlined-textarea"
                          label={t('address')}
                          multiline
                          margin="normal"
                          variant="outlined"
                          style={{ width: '100%', float: 'left' }}
                          value={this.state.selected1Address}
                          onChange={this.onChangeF1address}
                        />
                        <FormHelperText>{t('youNeedaAddress')}</FormHelperText>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <label className="selectLabel">{t('country')}</label>
                            <Select
                            placeholder={t('selectCountry')}
                            value={this.state.selectedDefaultAddressCountryEdit}
                            options={this.state.dataCountry}
                            onChange={this.handleChangeCountry1}
                          />
                            <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                            placeholder={t('selectState')}
                            value={this.state.selectedDefaultAddressStateEdit}
                            options={this.state.selectedDefaultStateArray}
                            onChange={this.handleChangeStates1}
                          />
                            <FormHelperText>{t('youNeedaStateName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <TextValidator
                            variant="outlined"
                            margin="dense"
                            label={t('zipcode')}
                            value={this.state.selected1Zipcode}
                            onChange={this.onChangeF1zipcode}
                            validators={['isNumber']}
                            errorMessages={[t('thisIsNotNumber')]}
                          />
                            <FormHelperText>{t('youNeedaZipcode')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <TextField
                            variant="outlined"
                            margin="dense"
                            label={t('town')}
                            value={this.state.selected1Town}
                            onChange={this.onChangeF1town}
                          />
                            <FormHelperText>{t('youNeedaTownName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Card>
                <Grid item container sm={12} style={{ float: 'left' }}>
                  <div className="copyAddressPlace">
                    <Tooltip title={t('copyDefaultAdress')} placement="left">
                      <FileCopy onClick={this.onCopyDefaultAdressTObillingAdress} fontSize="large" style={{ marginBottom: '-5px' }} />
                    </Tooltip>
                  </div>
                  <ExpansionPanel style={{ width: '100%' }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <Typography style={{ paddingLeft: '15px' }}>
                        {' '}
                        {t('billingAddress')}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{ padding: '9px', width: '95%' }}>
                      <FormControl component="fieldset" style={{ width: '100%' }}>
                        <FormGroup>
                          <TextField
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
                                  value={this.state.selectedBillingAddressCountryEdit2}
                                  options={this.state.dataCountry}
                                  onChange={this.handleChangeCountry2}
                                />
                            <FormHelperText>{t('youNeedaCountryName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                                  placeholder={t('selectState')}
                                  value={this.state.selectedBillingAddressStateEdit3}
                                  options={this.state.selectedBillingStateArray}
                                  onChange={this.handleChangeStates2}
                                />
                            <FormHelperText>{t('youNeedaStateName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <TextValidator
                                  variant="outlined"
                                  margin="dense"
                                  label={t('zipcode')}
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
                                  variant="outlined"
                                  margin="dense"
                                  label={t('town')}
                                  value={this.state.selected2Town}
                                  onChange={this.onChangeF2town}
                                />
                            <FormHelperText>{t('youNeedaTownName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                        </FormGroup>
                      </FormControl>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
                <Grid item container sm={12} style={{ float: 'left' }}>
                  <div className="copyAddressPlace">
                    <Tooltip title={t('copyBillingAdress')} placement="left">
                      <FileCopy onClick={this.onCopyBillingAdressTOshippingAdress} fontSize="large" style={{ marginBottom: '-5px' }} />
                    </Tooltip>
                  </div>
                  <ExpansionPanel style={{ width: '100%' }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <Typography style={{ paddingLeft: '15px' }}>
                        {t('shippingAddress')}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{ padding: '9px', width: '95%' }}>
                      <FormControl component="fieldset" style={{ width: '100%' }}>
                        <FormGroup>
                          <TextField
                            id="outlined-textarea"
                            label={t('address')}
                            multiline
                            margin="normal"
                            variant="outlined"
                            style={{ width: '100%', float: 'left' }}
                            value={this.state.Selected3Address}
                            onChange={this.onChangeF3address}
                          />
                          <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('country')}</label>
                            <Select
                                  placeholder={t('selectCountry')}
                                  value={this.state.selectedShippingAddressCountryEdit2}
                                  options={this.state.dataCountry}
                                  onChange={this.handleChangeCountry3}
                                />
                            <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                                  placeholder={t('selectState')}
                                  value={this.state.selectedShippingAddressStateEdit2}
                                  options={this.state.selectedShippingStateArray}
                                  onChange={this.handleChangeStates3}
                                />
                            <FormHelperText>{t('youNeedaStateName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <TextValidator
                                  variant="outlined"
                                  margin="dense"
                                  label={t('zipcode')}
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
                                  variant="outlined"
                                  margin="dense"
                                  label={t('town')}
                                  value={this.state.selected3Town}
                                  onChange={this.onChangeF3town}
                                />
                            <FormHelperText>{t('youNeedaTownName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                        </FormGroup>
                      </FormControl>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
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
                  onChange={this.onChangeFnewGroup}
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


export default withNamespaces()(withSnackbar(CustomerEdit));
