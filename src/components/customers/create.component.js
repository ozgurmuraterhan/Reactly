import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory} from 'react-router-dom'

import Select from 'react-select';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { useTranslation } from 'react-i18next';

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
  Grid,
} from '@material-ui/core';

import {
  AddBox,
  ExpandMore,
  FileCopy,
  GroupAdd,
  ContactMail,

  Save,
} from '@material-ui/icons';

import '../../assets/css/style.css';


export default function CustomerCreate() {
 const getRandomPass = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const [t] = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [gropBoxOpen, seTgropBoxOpen] = useState(false);
  const [changeNewGroupNameJust, seTchangeNewGroupNameJust] = useState('');
  const [dataPayments,seTdataPayments] = useState([]);
  const [findCustomersGroup,seTfindCustomersGroup] = useState([]);
  const [dataCountry,seTdataCountry ] = useState([]);

 
  const [state, seTstate] = useState({
    selectedDefaultStateArray:[],
    selectedbillingAddressStateArray:[],
    selectedshippingAddressState2Array:[],
    selectedDefaultState:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedDefaultCountry:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedbillingAddressCountry:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedbillingAddressState:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedshippingAddressCountry2:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedshippingAddressState2:[{ label: 'Not Selected', value: 'Not Selected' }],
    selectedGroupItems:[],
    selected1Zipcode:'',
    selected2Zipcode:'',
    selected3Zipcode:'',
    selected1Town:'',
    selected2Town:'',
    selected3Town:'',
    company:'',
    email:'',
    password:getRandomPass(8),
    taxoffice:'',
    taxnumber:'',
    ssn:'',
    executive:'',
    phone:'',
    fax:'',
    default_payment_method:'',
    risk:80,
    selected2Address:'',
    selected1Address:'',
    selected3Address:'',
    fax:'',
    fax:'',
  });



  // default adress func
 const handleChangeCountry = (selectedOption) => {
    console.log(selectedOption);
    const details = [];
    for (const i in selectedOption.value[1]) {
      details.push({
        label: selectedOption.value[1][i].name,
        value: selectedOption.value[1][i].name,
      });
    }

      seTstate({
        ...state,
        selectedDefaultStateArray: details,
        selectedDefaultCountry: [{ label: selectedOption.label, value: selectedOption.label }]
      })
  };
  // default adress func end


 // Billing adress func

const onChangeFbillingAddressCountry = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }

    seTstate({
      ...state,
      selectedbillingAddressStateArray: details,
      selectedbillingAddressCountry: [{ label: selectedOption.label, value: selectedOption.label }]
    })
 };

// Billing adress func end


// Shipping adress func
const onChangeFshippingAddressCountry = (selectedOption) => {
  const details = [];
  for (const i in selectedOption.value[1]) {
    details.push({
      label: selectedOption.value[1][i].name,
      value: selectedOption.value[1][i].name,
    });
  }
    seTstate({
      ...state,
      selectedshippingAddressState2Array: details,
      selectedshippingAddressCountry2: [{ label: selectedOption.label, value: selectedOption.label }]
    })
};
// Shipping adress func end


// open new group dialog save
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

  seTgropBoxOpen(false) 
};

  // end open new group dialog save


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

// componentDidMount = useEffect
  useEffect(() => {
    getCustomersGroup();
    getCountryF();
    getPaymentsF();
  }, []);


  const onCopyDefaultAdressTObillingAdress = (e) => {
    e.preventDefault();
      seTstate({
      ...state,
      selectedbillingAddressCountry:state.selectedDefaultCountry,
      selectedbillingAddressState:state.selectedDefaultState,
      selected2Address:state.selected1Address,
      selected2Town:state.selected1Town,
      selected2Zipcode:state.selected1Zipcode,
      })
  }

  const onCopyBillingAdressTOshippingAdress = (e) => {
      e.preventDefault();
      seTstate({
      ...state,
      selectedshippingAddressCountry2:state.selectedbillingAddressCountry,
      selectedshippingAddressState2:state.selectedbillingAddressState,
      selected3Address:state.selected2Address,
      selected3Town:state.selected2Town,
      selected3Zipcode:state.selected2Zipcode,
      })
  }


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

          defaultAddress_country_id: state.selectedDefaultCountry[0].label,
          defaultAddress_state_id: state.selectedDefaultState.label,
          defaultAddress_town: state.selected1Town,
          defaultAddress_zipcode: state.selected1Zipcode,
          defaultAddress_address: state.selected1Address,

          billingAddress_country_id: state.selectedbillingAddressCountry[0].label,
          billingAddress_state_id: state.selectedbillingAddressState.label,
          billingAddress_town: state.selected2Town,
          billingAddress_zipcode: state.selected2Zipcode,
          billingAddress_address: state.selected2Address,

          shippingAddress_country_id: state.selectedshippingAddressCountry2[0].label,
          shippingAddress_state_id: state.selectedshippingAddressState2.label,
          shippingAddress_town: state.selected3Town,
          shippingAddress_zipcode: state.selected3Zipcode,
          shippingAddress_address: state.selected3Address,


        };

        axios.post('http://localhost:5000/customers/add', Customers)
          .then((res) => {
            if (res.data.variant == 'error') {
               enqueueSnackbar(t('customerNotAdded') + res.data.messagge, { variant: res.data.variant });
            } else {
              enqueueSnackbar(t('customerAdded'), { variant: res.data.variant });
              // navigate
              history.push('/customerslist');
            }
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
                    <Typography component="h1" variant="h6" color="inherit" noWrap className="typography">
                      {t('customersCreate')}
                    </Typography>
                    <Grid item container sm={12}>
                      <Grid container item sm={4} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <TextValidator
                              label={t('company')}
                              value={state.company}
                              onChange={(e) => { seTstate({...state, company:e.target.value}) }}
                              required

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
                              label={t('email')}
                              value={state.email}
                              onChange={(e) => {  seTstate({...state, email: e.target.value }) }}
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
                            <TextValidator
                              required
                              label={t('password')}
                              value={state.password}
                              onChange={(e) => { seTstate({...state, password: e.target.value }) }}
                            />
                            <FormHelperText>{t('youNeedaPassword')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid container item sm={4} spacing={0}>
                        <Grid container item sm={1} spacing={0}>
                          <Tooltip title={t('addNewGroupName')}>
                            <AddBox onClick={() => { seTgropBoxOpen(true)  }} fontSize="large" style={{ margin: '25px 10px 0 5px' }} />
                          </Tooltip>
                        </Grid>
                        <Grid container item sm={11} spacing={0}>
                          <FormGroup className="FormGroup">
                            <InputLabel htmlFor="group_id" className="InputLabel" style={{ margin: '5px' }}> </InputLabel>
                            <FormControl>

                              <Select

                                isMulti
                                styles={{
                                  singleValue: (base) => ({ ...base, color: 'white' }),
                                  control: (base) => ({
                                    ...base,
                                    color: 'white',
                                    width: '100%',
                                    border: 0,
                                    borderBottom: '1px solid #949494',
                                    borderRadius: 0,
                                  }),
                                }}
                                placeholder={t('selectGropName')}
                                value={state.selectedGroupItems}
                                options={findCustomersGroup}
                                onChange={(selectedOption) => { seTstate({...state, selectedGroupItems:selectedOption }) }}
                              />

                            </FormControl>

                          </FormGroup>
                        </Grid>
                      </Grid>
                      <Grid container item sm={4} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <TextValidator
                              label={t('taxNumber')}
                              value={state.taxnumber}
                              onChange={(e) => { seTstate({...state, taxnumber: e.target.value }) }}
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
                            <InputLabel htmlFor="taxoffice" className="InputLabel">{t('taxOffice')}</InputLabel>
                            <Input
                              id="taxoffice"
                              value={state.taxoffice}
                              onChange={(e) => {seTstate({...state, taxoffice: e.target.value }) }}
                            />
                            <FormHelperText>{t('youNeedaTaxOfficeName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid container item sm={4} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <TextValidator
                              label={t('SSN')}
                              value={state.ssn}
                              onChange={(e) => { seTstate({...state, ssn:e.target.value }) }}
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
                            <InputLabel htmlFor="executive" className="InputLabel">{t('executive')}</InputLabel>
                            <Input
                              id="executive"

                              value={state.executive}
                              onChange={(e) => { seTstate({...state, executive:e.target.value }) }}
                            />
                            <FormHelperText>{t('youNeedaExecutiveName')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid container item sm={4} spacing={0}>
                        <FormGroup className="FormGroup">
                          <FormControl>
                            <TextValidator
                              required
                              label={t('phone')}
                              value={state.phone}
                              onChange={(e) => {seTstate({...state, phone: e.target.value }) }}
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
                              label={t('fax')}
                              value={state.fax}
                              onChange={(e) => {seTstate({...state, fax: e.target.value }) }}
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
                            <InputLabel htmlFor="web" className="InputLabel">{t('webSite')}</InputLabel>
                            <Input
                              id="web"
                              value={state.web}
                              onChange={(e) => { seTstate({...state, web:e.target.value}) }}
                            />
                            <FormHelperText>{t('youNeedaWebSiteUrl')}</FormHelperText>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid container item sm={4} spacing={0}>
                        <FormGroup className="FormGroup">
                          <InputLabel htmlFor="group_id" className="InputLabel" style={{ margin: '5px' }}> </InputLabel>

                          <FormControl>
                            <Select
                              label={t('defaultPaymentMethod')}
                              value={state.default_payment_method}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  color: 'white',
                                  width: '100%',
                                  border: 0,
                                  borderBottom: '1px solid #949494',
                                  borderRadius: 0,
                                }),
                              }}
                              options={dataPayments}
                              onChange={(selectedOption) => { seTstate({...state, default_payment_method: selectedOption}) }}
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
                              defaultValue={state.risk}
                              onChangeCommitted={(e, val) => { e.preventDefault(); seTstate({...state, risk:val }) }}
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
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="outlined-textarea"
                            label={t('address')}
                            multiline
                            margin="normal"
                            variant="outlined"
                            style={{ width: '100%', float: 'left' }}
                            value={state.selected1Address}
                            onChange={(e) => { seTstate({...state, selected1Address:e.target.value}) }}
                          />
                          <FormHelperText>{t('youNeedaAddress')}</FormHelperText>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                              <label className="selectLabel">{t('country')}</label>
                              <Select

                                placeholder={t('selectCountry')}
                                value={state.selectedDefaultCountry}
                                options={dataCountry}
                                onChange={handleChangeCountry}
                              />
                              <FormHelperText>{t('youNeedaCauntryName')}</FormHelperText>
                            </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                              <label className="selectLabel">{t('state')}</label>
                              <Select
                                placeholder={t('selectState')}
                                value={state.selectedDefaultState}
                                options={state.selectedDefaultStateArray}
                                onChange={(selectedOption) => { seTstate({...state, selectedDefaultState: selectedOption}) }}
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
                                value={state.selected1Zipcode}
                                onChange={(e) => { seTstate({...state, selected1Zipcode:e.target.value}) }}
                                validators={['isNumber']}
                                errorMessages={[t('thisIsNotNumber')]}
                              />
                              <FormHelperText>{t('youNeedaZipcode')}</FormHelperText>
                            </FormControl>
                          </FormGroup>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                              <TextField
                                label={t('town')}
                                id="town"
                                margin="dense"
                                variant="outlined"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={state.selected1Town}
                                onChange={(e) => {  seTstate({...state, selected1Town:e.target.value}) }}
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
                      <ExpansionPanelDetails style={{ padding: '9px', width: '100%' }}>
                        <FormControl component="fieldset" style={{ width: '95%' }}>
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
                              value={state.selected2Address}
                              onChange={(e) => { seTstate({...state, selected2Address:e.target.value}) }}
                            />
                            <FormHelperText>{t('youNeedaBillingAddress')}</FormHelperText>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('country')}</label>
                                <Select
                                  placeholder={t('selectCountry')}
                                  value={state.selectedbillingAddressCountry}
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
                                  value={state.selectedbillingAddressState}
                                  options={state.selectedbillingAddressStateArray}
                                  onChange={(selectedOption) => { seTstate({...state, selectedbillingAddressState: selectedOption}) }}
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
                                  value={state.selected2Zipcode}
                                  onChange={(e) => { seTstate({...state, selected2Zipcode:e.target.value}) }}
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
                                  value={state.selected2Town}
                                  onChange={(e) => { seTstate({...state, selected2Town:e.target.value}) }}
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
                              InputLabelProps={{
                                shrink: true,
                              }}
                              id="outlined-textarea"
                              label={t('address')}
                              multiline
                              margin="normal"
                              variant="outlined"
                              style={{ width: '100%', float: 'left' }}
                              value={state.selected3Address}
                              onChange={(e) => { seTstate({...state, selected3Address: e.target.value}) }}
                            />
                            <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('country')}</label>
                                <Select
                                  placeholder={t('selectCountry')}
                                  value={state.selectedshippingAddressCountry2}
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
                                  value={state.selectedshippingAddressState2}
                                  options={state.selectedshippingAddressState2Array}
                                  onChange={(selectedOption) => { seTstate({...state, selectedshippingAddressState2: selectedOption}) }}
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
                                  value={state.selected3Zipcode}
                                  onChange={(e) => { seTstate({...state, selected3Zipcode:e.target.value}) }}
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
                                  value={state.selected3Town}
                                  onChange={(e) => { seTstate({...state, selected3Town:e.target.value}) }}
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
              onClose={() => { seTgropBoxOpen(false)  }}
            >
              <DialogTitle>{t('addNewCustomerGroupName')}</DialogTitle>
              <DialogContent>
                <FormControl className="FormControl" style={{ width: '100%' }}>
                  <InputLabel htmlFor="group">{t('addGroupName')}</InputLabel>
                  <Input
                    id="group"
                    onChange={(e) => { seTchangeNewGroupNameJust( e.target.value) }}
                  />
                  <FormHelperText>{t('addNewGroupName')}</FormHelperText>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {seTgropBoxOpen(false) }} color="primary">  {t('cancel')} </Button>
                <Button onClick={saveHandleNewGroup} color="primary"> {t('save')} </Button>
              </DialogActions>
            </Dialog>


          </div>


        );
      }

