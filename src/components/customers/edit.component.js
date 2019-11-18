import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory} from 'react-router-dom'

import Select from 'react-select';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useTranslation } from 'react-i18next';

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


export default function CustomerEdit(props){

  const [t] = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [state, seTstate] = useState({
    selectedDefaultStateArray:[],
    selectedDefaultAddressCountryEdit:[],
    selectedDefaultAddressStateEdit:[],
    selectedBillingAddressCountryEdit2:[],
    selectedBillingAddressStateEdit3:[],
    selectedShippingStateArray:[],
    selectedShippingAddressCountryEdit2:[],
    selectedShippingAddressStateEdit2:[],
    selectedBillingStateArray:[],
    selectedGroupItems:[],
    _id:0,
    selected1Town:'',
    selected2Town:'',
    selected3Town:'',
    selected1Address:'',
    selected2Address:'',
    selected3Address:'',
    selected1Zipcode:'',
    selected2Zipcode:'',
    selected3Zipcode:'',
    company:'',
    password:'',
    group_id:[],
    taxoffice:'',
    taxnumber:'',
    ssn:'',
    executive:'',
    phone:'',
    email:'',
    fax:'',
    web:'',
    default_payment_method:'',
    risk:0

  });
  const [dataPayments,seTdataPayments] = useState([]);
  const [findCustomersGroup,seTfindCustomersGroup] = useState([]);
  const [dataCountry,seTdataCountry ] = useState([]);
  const [changeNewGroupNameJust, seTchangeNewGroupNameJust] = useState('');
  const [openalert, seTopenalert] = useState(false);
  const [gropBoxOpen, seTgropBoxOpen] = useState(false);

  // default adress func

  const handleChangeCountry1 = (selectedOption) => {
    const details = [];
    for (const i in selectedOption.value[1]) {
      details.push({
        label: selectedOption.value[1][i].name,
        value: selectedOption.value[1][i].name,
      });
    }
      seTstate({ 
        ...state, 
        selectedDefaultStateArray:details,
        selectedDefaultAddressCountryEdit:[{ label: selectedOption.label, value: selectedOption.label }]
      })
  };

  // default adress func end


 // Billing adress func

const handleChangeCountry2 = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }

  seTstate({ 
    ...state, 
    selectedBillingStateArray: details,
    selectedBillingAddressCountryEdit2: [{ label: selectedOption.label, value: selectedOption.label }]
  })
};
  // Billing adress func end


// Shipping adress func

const handleChangeCountry3 = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }
  seTstate({ 
    ...state,
    selectedShippingStateArray:details,
    selectedShippingAddressCountryEdit2: [{ label: selectedOption.label, value: selectedOption.label }]
  })
};
// end Shipping adress func end


// open new group dialog
const saveHandleNewGroup = () => {
  const data = {
    name: changeNewGroupNameJust,
  };

  axios.post('http://localhost:5000/customersgroups/add', data)
    .then((res) => {
      if (res.data.variant == 'error') {
        enqueueSnackbar(t('customersGroupNotAdded') + res.data.messagge, { variant: res.data.variant });
      } else {
        enqueueSnackbar(t('customersGroupAdded'), { variant: res.data.variant });
      }
      getCustomersGroup();
    })
    .catch((err) => console.log(err));

  seTgropBoxOpen (false );
};

  // end/ open new group dialog

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
          seTdataCountry( details)
        }
      })
      .catch((err) => console.log(err));
  }


  function getCustomersGroup() {
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
        seTfindCustomersGroup( details)
        }
      })
      .catch((err) => console.log(err));
  }

  function getCustomersData() {    
    axios.get(`http://localhost:5000/customers/${props.match.params.id}`)
      .then((response) => {
        const details = [];
        for (const i in response.data.group_id) {
          details.push({
            label: (response.data.group_id[i].label),
            value: (response.data.group_id[i].value),
          });
        }
        seTstate({ 
          _id:response.data._id,
          company:response.data.company,
          email:response.data.email,
          password:response.data.password,
          group_id:response.data.group_id,
          taxoffice:response.data.taxoffice,
          taxnumber:response.data.taxnumber,
          ssn:response.data.ssn,
          executive:response.data.executive,
          phone:response.data.phone,
          fax:response.data.fax,
          web:response.data.web,
          risk:response.data.risk,

          default_payment_method: [{ label: response.data.default_payment_method[0].label, value: response.data.default_payment_method[0]._id }],
          selected1Address:response.data.defaultAddress_address,
          selected2Address:response.data.billingAddress_address,
          selected3Address: response.data.shippingAddress_address,
          selected1Town: response.data.defaultAddress_town,
          selected2Town: response.data.billingAddress_town,
          selected3Town:response.data.shippingAddress_town,
          risk:response.data.risk,
          selected1Zipcode:response.data.defaultAddress_zipcode,
          selected2Zipcode: response.data.billingAddress_zipcode,
          selected3Zipcode: response.data.shippingAddress_zipcode,
          selectedDefaultAddressCountryEdit: [{ label: response.data.defaultAddress_country_id, value: response.data.defaultAddress_country_id }],
          selectedDefaultAddressStateEdit:[{ label: response.data.defaultAddress_state_id, value: response.data.defaultAddress_state_id }],
          selectedBillingAddressCountryEdit2: [{ label: response.data.billingAddress_country_id, value: response.data.billingAddress_country_id }],
          selectedBillingAddressStateEdit3: [{ label: response.data.billingAddress_state_id, value: response.data.billingAddress_state_id }],
          selectedShippingAddressCountryEdit2: [{ label: response.data.shippingAddress_country_id, value: response.data.shippingAddress_country_id }],
          selectedShippingAddressStateEdit2: [{ label: response.data.shippingAddress_state_id, value: response.data.shippingAddress_state_id }],
          selectedGroupItems: details,
          })
      });

  }

      const onCopyDefaultAdressTObillingAdress = (e) => {
        e.preventDefault();
        seTstate({ 
          ...state,
          selectedBillingAddressCountryEdit2: state.selectedDefaultAddressCountryEdit,
          selectedBillingAddressStateEdit3:state.selectedDefaultAddressStateEdit,
          selected2Address:state.selected1Address,
          selected2Town:state.selected1Town,
          selected2Zipcode: state.selected1Zipcode,
        })
      }

     const onCopyBillingAdressTOshippingAdress = (e) => {
       e.preventDefault();
        seTstate({ 
          ...state,
          selectedShippingAddressCountryEdit2:state.selectedBillingAddressCountryEdit2,
          selectedShippingAddressStateEdit2:state.selectedBillingAddressStateEdit3,
          selected3Address:state.selected2Address,
          selected3Town:state.selected2Town,
          selected3Zipcode:state.selected2Zipcode,

        })
      }

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
              seTdataPayments(details)
            }
          })
          .catch((err) => console.log(err));
      }

    // componentDidMount = useEffect
    useEffect(() => {
      getCustomersData();    
      getCountryF();
      getCustomersGroup();
      getPaymentsF();

    }, []);

   const onSubmit = (e) => {
        e.preventDefault();

        const Customers = {
          company: state.company,
          email: state.email,
          password: state.password,
          group_id: state.selectedGroupItems,
          taxoffice: state.taxoffice,
          taxnumber: state.taxnumber,
          ssn: state.ssn,
          executive: state.executive,
          phone: state.phone,
          fax: state.fax,
          web: state.web,
          default_payment_method: state.default_payment_method,
          risk: state.risk,

          defaultAddress_country_id: state.selectedDefaultAddressCountryEdit[0].label,
          defaultAddress_state_id: state.selectedDefaultAddressStateEdit[0].label,
          defaultAddress_town: state.selected1Town,
          defaultAddress_zipcode: state.selected1Zipcode,
          defaultAddress_address: state.selected1Address,

          billingAddress_country_id: state.selectedBillingAddressCountryEdit2[0].label,
          billingAddress_state_id: state.selectedBillingAddressStateEdit3[0].label,
          billingAddress_town: state.selected2Town,
          billingAddress_zipcode: state.selected2Zipcode,
          billingAddress_address: state.selected2Address,

          shippingAddress_country_id: state.selectedShippingAddressCountryEdit2[0].label,
          shippingAddress_state_id: state.selectedShippingAddressStateEdit2[0].label,
          shippingAddress_town: state.selected3Town,
          shippingAddress_zipcode: state.selected3Zipcode,
          shippingAddress_address: state.selected3Address,


        };


        axios.post(`http://localhost:5000/customers/${props.match.params.id}`, Customers)
          .then((res) => {
            if (res.data.variant == 'error') {
              enqueueSnackbar(t('customerNotUpdated') + res.data.messagge, { variant: res.data.variant });
            } else {
              enqueueSnackbar(t('customerUpdated'), { variant: res.data.variant });
              // navigate
              history.push('/customerslist');            
            }

          })
          .catch((err) => console.log(err));
      }

  const  deleteData = (id) => {

      axios.delete(`http://localhost:5000/customers/${id}`)
        .then((res) => {
          history.push('/customerslist');
          enqueueSnackbar(t('customerDeleted'), { variant: res.data.variant });
        });
    }


      return (
        <div className="containerP">
          <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
            <Grid item container spacing={3}>
              <Grid item container md={9} className="panelGridRelative">
                <Card className="panelLargeIcon">
                  <GroupAdd fontSize="large" />
                </Card>
                <Card className="listViewPaper">
                  <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: '100%' }} className="typography">
                    {t('editCustomer')}

                    <Tooltip title={t('deleteCustomer')}>
                      <Button variant="outlined" color="primary" style={{ float: 'right', marginRight: '115px' }} onClick={() => {seTopenalert(true) }}>
                        <Delete />
                      </Button>
                    </Tooltip>

                    <Dialog open={openalert} onClose={() => {seTopenalert(false) }}>
                      <DialogTitle>{t('deleteCustomer')}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {t('deleteInfoText1')}
                          <br />
                          {t('deleteInfoText2')}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => { seTopenalert(false) }} color="primary">
                          {' '}
                          {t('cancel')}
                          {' '}
                        </Button>
                        <Button onClick={() => {deleteData(state._id); }} color="primary" autoFocus>
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
                            value={state.company}
                            onChange={(e) => { seTstate({...state, company:e.target.value})  }}
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
                            value={state.email}
                            onChange={(e) => { seTstate({...state, email:e.target.value})  }}
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
                            value={state.password}
                            onChange={(e) => { seTstate({...state, password:e.target.value})}}
                          />
                          <FormHelperText>{t('youNeedaPassword')}</FormHelperText>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid container item sm={4} spacing={0}>
                      <Grid container item sm={1} spacing={0}>
                        <Tooltip title={t('addNewGroupName')}>
                          <AddBox onClick={() => { seTgropBoxOpen (true )}} fontSize="large" style={{ margin: '20px 10px 0 5px' }} />
                        </Tooltip>
                      </Grid>
                      <Grid container item sm={11} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <label className="selectLabel">{t('selectGropName')}</label>
                            <Select
                            isMulti
                            placeholder={t('selectGropName')}
                            value={state.selectedGroupItems}
                            style={{ width: '100%', marginTop: '-6px' }}
                            options={findCustomersGroup}
                            onChange={(selectedOption) => { seTstate({...state, selectedGroupItems:selectedOption}) }}
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
                            value={state.taxnumber}
                            onChange={(e) => { seTstate({...state, taxnumber:e.target.value})}}
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
                            value={state.taxoffice}
                            onChange={(e) => { seTstate({...state, taxoffice:e.target.value}) }}
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
                            value={state.ssn}
                            onChange={(e) => { seTstate({...state, ssn:e.target.value}) }}
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
                            value={state.executive}
                            onChange={(e) => { seTstate({...state, executive:e.target.value})}}
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
                            value={state.phone}
                            onChange={(e) => { seTstate({...state, phone:e.target.value}) }}
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
                            value={state.fax}
                            onChange={(e) => { seTstate({...state, fax:e.target.value})}}
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
                            value={state.web}
                            onChange={(e) => { seTstate({...state, web:e.target.value})}}
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
                            value={state.default_payment_method}
                            style={{ width: '100%', marginTop: '-6px' }}
                            options={dataPayments}
                            onChange={(selectedOption) => { seTstate({...state, default_payment_method:selectedOption})}}
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
                            value={state.risk}
                            onChange={(e, val) => { e.preventDefault(); seTstate({...state, risk:val})}}
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
                          value={state.selected1Address}
                          onChange={(e) => { seTstate({...state, selected1Address:e.target.value})}}
                        />
                        <FormHelperText>{t('youNeedaAddress')}</FormHelperText>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <label className="selectLabel">{t('country')}</label>
                            <Select
                            placeholder={t('selectCountry')}
                            value={state.selectedDefaultAddressCountryEdit}
                            options={dataCountry}
                            onChange={handleChangeCountry1}
                          />
                            <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                        <FormGroup className="FormGroupAddress">
                          <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                            placeholder={t('selectState')}
                            value={state.selectedDefaultAddressStateEdit}
                            options={state.selectedDefaultStateArray}
                            onChange={(selectedOption) => {seTstate({...state, selectedDefaultAddressStateEdit:[selectedOption]}) }}
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
                            value={state.selected1Zipcode}
                            onChange={(e) => {seTstate({...state, selected1Zipcode:e.target.value})}}
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
                            value={state.selected1Town}
                            onChange={(e) => { seTstate({...state, selected1Town:e.target.value})}}
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
                      <FileCopy onClick={onCopyDefaultAdressTObillingAdress} fontSize="large" style={{ marginBottom: '-5px' }} />
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
                            value={state.selected2Address}
                            onChange={(e) => { seTstate({...state, selected2Address:e.target.value})}}
                          />
                          <FormHelperText>{t('youNeedaBillingAddress')}</FormHelperText>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('country')}</label>
                            <Select
                                  placeholder={t('selectCountry')}
                                  value={state.selectedBillingAddressCountryEdit2}
                                  options={dataCountry}
                                  onChange={handleChangeCountry2}
                                />
                            <FormHelperText>{t('youNeedaCountryName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                                  placeholder={t('selectState')}
                                  value={state.selectedBillingAddressStateEdit3}
                                  options={state.selectedBillingStateArray}
                                  onChange={(selectedOption) => { seTstate({...state, selectedBillingAddressStateEdit3:[selectedOption]})}}
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
                                  value={state.selected2Zipcode}
                                  onChange={(e) => { seTstate({...state, selected2Zipcode:e.target.value})}}
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
                                  value={state.selected2Town}
                                  onChange={(e) => { seTstate({...state, selected2Town:e.target.value})}}
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
                      <FileCopy onClick={onCopyBillingAdressTOshippingAdress} fontSize="large" style={{ marginBottom: '-5px' }} />
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
                            value={state.selected3Address}
                            onChange={(e) => { seTstate({...state, selected3Address:e.target.value})}}
                          />
                          <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('country')}</label>
                            <Select
                                  placeholder={t('selectCountry')}
                                  value={state.selectedShippingAddressCountryEdit2}
                                  options={dataCountry}
                                  onChange={handleChangeCountry3}
                                />
                            <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                          </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                            <label className="selectLabel">{t('state')}</label>
                            <Select
                                  placeholder={t('selectState')}
                                  value={state.selectedShippingAddressStateEdit2}
                                  options={state.selectedShippingStateArray}
                                  onChange={(selectedOption) => { seTstate({...state, selectedShippingAddressStateEdit2:[selectedOption]})}}
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
                                  value={state.selected3Zipcode}
                                  onChange={(e) => { seTstate({...state, selected3Zipcode:e.target.value})}}
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
                                  value={state.selected3Town}
                                  onChange={(e) => { seTstate({...state, selected3Town:e.target.value})}}
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
            open={gropBoxOpen}
            onClose={() => { seTgropBoxOpen (false ) }}
          >
            <DialogTitle>{t('addNewCustomerGroupName')}</DialogTitle>
            <DialogContent>
              <FormControl className="FormControl" style={{ width: '100%' }}>
                <InputLabel htmlFor="group">{t('addGroupName')}</InputLabel>
                <Input
                  id="group"
                  onChange={(e) => { seTchangeNewGroupNameJust(e.target.value) }}
                />
                <FormHelperText>{t('addNewGroupName')}</FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { seTgropBoxOpen (false )}} color="primary"> {t('cancel')} </Button>
              <Button onClick={saveHandleNewGroup} color="primary"> {t('save')} </Button>
            </DialogActions>
          </Dialog>

        </div>
      );
    }

