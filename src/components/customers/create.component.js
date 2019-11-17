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

  
  
  const [findCustomersGroup, seTfindCustomersGroup] = useState([]);
  const [selectedDefaultStateArray, seTselectedDefaultStateArray] = useState([]);
  const [selectedbillingAddressStateArray, seTselectedbillingAddressStateArray] = useState([]);
  const [selectedshippingAddressState2Array, seTselectedshippingAddressState2Array] = useState([]);
  
  const [selectedDefaultState, seTselectedDefaultState] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedDefaultCountry, seTselectedDefaultCountry] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedbillingAddressCountry, seTselectedbillingAddressCountry] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedbillingAddressState, seTselectedbillingAddressState] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedshippingAddressCountry2, seTselectedshippingAddressCountry2] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedshippingAddressState2, seTselectedshippingAddressState2] = useState([{ label: 'Not Selected', value: 'Not Selected' }]);
  const [selectedGroupItems, seTselectedGroupItems] = useState([]);
  const [selected1Zipcode, seTselected1Zipcode] = useState('');
  const [selected2Zipcode, seTselected2Zipcode] = useState('');
  const [selected3Zipcode, seTselected3Zipcode] = useState('');
  const [selected1Town, seTselected1Town] = useState('');
  const [selected2Town, seTselected2Town] = useState('');
  const [selected3Town, seTselected3Town] = useState('');

  const [company, seTcompany] = useState('');
  const [email, seTemail] = useState('');
  const [password, seTpassword] = useState(getRandomPass(8));
  const [taxoffice, seTtaxoffice] = useState('');
  const [taxnumber, seTtaxnumber] = useState('');
  const [ssn, seTssn] = useState('');
  const [executive, seTexecutive] = useState('');
  const [phone, seTphone] = useState('');
  const [fax, seTfax] = useState('');
  const [web, seTweb] = useState('');
  const [default_payment_method, seTdefault_payment_method] = useState('');
  const [risk, seTrisk] = useState(80);
  const [dataPayments, seTdataPayments] = useState([]);
  const [selected2Address, seTselected2Address] = useState('');
  const [selected1Address, seTselected1Address] = useState('');
  const [selected3Address, seTselected3Address] = useState('');
  const [dataCountry, seTdataCountry] = useState('');



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

      seTselectedDefaultStateArray( details)
      seTselectedDefaultCountry( [{ label: selectedOption.label, value: selectedOption.label }])
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

    seTselectedbillingAddressStateArray( details)
    seTselectedbillingAddressCountry( [{ label: selectedOption.label, value: selectedOption.label }])
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
    seTselectedshippingAddressState2Array( details)
    seTselectedshippingAddressCountry2( [{ label: selectedOption.label, value: selectedOption.label }])
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
      seTselectedbillingAddressCountry(selectedDefaultCountry)
      seTselectedbillingAddressState(selectedDefaultState)
      seTselected2Address(selected1Address)
      seTselected2Town(selected1Town)
      seTselected2Zipcode(selected1Zipcode)
  }

  const onCopyBillingAdressTOshippingAdress = () => {
      seTselectedshippingAddressCountry2(selectedbillingAddressCountry)
      seTselectedshippingAddressState2(selectedbillingAddressState)
      seTselected3Address(selected2Address)
      seTselected3Town(selected2Town)
      seTselected3Zipcode(selected2Zipcode)
  }


     const onSubmit = (e) => {
        e.preventDefault();
        const Customers = {
          company: company,
          email: email,
          password: password,
          group_id: selectedGroupItems,
          taxoffice: taxoffice,
          taxnumber: taxnumber,
          ssn: ssn,
          executive: executive,
          phone: phone,
          fax: fax,
          web: web,
          default_payment_method: default_payment_method,
          risk: risk,

          defaultAddress_country_id: selectedDefaultCountry[0].label,
          defaultAddress_state_id: selectedDefaultState.label,
          defaultAddress_town: selected1Town,
          defaultAddress_zipcode: selected1Zipcode,
          defaultAddress_address: selected1Address,

          billingAddress_country_id: selectedbillingAddressCountry[0].label,
          billingAddress_state_id: selectedbillingAddressState.label,
          billingAddress_town: selected2Town,
          billingAddress_zipcode: selected2Zipcode,
          billingAddress_address: selected2Address,

          shippingAddress_country_id: selectedshippingAddressCountry2[0].label,
          shippingAddress_state_id: selectedshippingAddressState2.label,
          shippingAddress_town: selected3Town,
          shippingAddress_zipcode: selected3Zipcode,
          shippingAddress_address: selected3Address,


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
                              value={company}
                              onChange={(e) => { seTcompany (e.target.value) }}
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
                              value={email}
                              onChange={(e) => {  seTemail( e.target.value) }}
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
                              value={password}
                              onChange={(e) => { seTpassword( e.target.value) }}
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
                                value={selectedGroupItems}
                                options={findCustomersGroup}
                                onChange={(selectedOption) => { seTselectedGroupItems( selectedOption) }}
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
                              value={taxnumber}
                              onChange={(e) => { seTtaxnumber( e.target.value) }}
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
                              value={taxoffice}
                              onChange={(e) => {  seTtaxoffice( e.target.value) }}
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
                              value={ssn}
                              onChange={(e) => { seTssn(e.target.value) }}
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

                              value={executive}
                              onChange={(e) => { seTexecutive( e.target.value) }}
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
                              value={phone}
                              onChange={(e) => { seTphone( e.target.value) }}
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
                              value={fax}
                              onChange={(e) => {  seTfax( e.target.value) }}
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
                              value={web}
                              onChange={(e) => { seTweb( e.target.value) }}
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
                              value={default_payment_method}
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
                              onChange={(selectedOption) => { seTdefault_payment_method( selectedOption) }}
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
                              defaultValue={risk}
                              onChangeCommitted={(e, val) => { e.preventDefault(); seTrisk(val) }}
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
                            value={selected1Address}
                            onChange={(e) => { seTselected1Address(e.target.value) }}
                          />
                          <FormHelperText>{t('youNeedaAddress')}</FormHelperText>
                          <FormGroup className="FormGroupAddress">
                            <FormControl>
                              <label className="selectLabel">{t('country')}</label>
                              <Select

                                placeholder={t('selectCountry')}
                                value={selectedDefaultCountry}
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
                                value={selectedDefaultState}
                                options={selectedDefaultStateArray}
                                onChange={(selectedOption) => { seTselectedDefaultState( selectedOption) }}
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
                                value={selected1Zipcode}
                                onChange={(e) => { seTselected1Zipcode(e.target.value) }}
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
                                value={selected1Town}
                                onChange={(e) => {  seTselected1Town(e.target.value) }}
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
                              value={selected2Address}
                              onChange={(e) => { seTselected2Address( e.target.value) }}
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
                                  onChange={(selectedOption) => { seTselectedbillingAddressState( selectedOption) }}
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
                                  onChange={(e) => { seTselected2Zipcode( e.target.value) }}
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
                                  onChange={(e) => { seTselected2Town( e.target.value) }}
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
                              value={selected3Address}
                              onChange={(e) => { seTselected3Address( e.target.value) }}
                            />
                            <FormHelperText>{t('youNeedaShippingAddress')}</FormHelperText>
                            <FormGroup className="FormGroupAddress">
                              <FormControl>
                                <label className="selectLabel">{t('country')}</label>
                                <Select
                                  placeholder={t('selectCountry')}
                                  value={selectedshippingAddressCountry2}
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
                                  value={selectedshippingAddressState2}
                                  options={selectedshippingAddressState2Array}
                                  onChange={(selectedOption) => { seTselectedshippingAddressState2( selectedOption) }}
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
                                  onChange={(e) => { seTselected3Zipcode( e.target.value) }}
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
                                  onChange={(e) => { seTselected3Town( e.target.value) }}
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
                <Button onClick={() => {seTgropBoxOpen(false) }} color="primary">
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

