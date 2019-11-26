import React, { Component, forwardRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import MaterialTable, { MTableToolbar } from 'material-table';
import { useTranslation } from 'react-i18next';


import { Doughnut } from 'react-chartjs-2';

import {
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Card,
  Tooltip,
  Grid,
  Typography,
} from '@material-ui/core';

import {
  Settings,
  Edit,
  GroupAdd,
  AddBox,
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
} from '@material-ui/icons';

import '../../assets/css/style.css';


export default function  CustomersList() {

  const [t] = useTranslation();
  const history = useHistory();

  const [customergroups, seTcustomergroups] = useState([]);  
  const [open, seTopen] = useState(false);  
  const [details_label, seTdetails_label] = useState('');  
  const [details_value, seTdetails_value] = useState('');  
  const [data, seTdata] = useState([]);  
  const customergroups_label  =  [{ title: t('groupName'), field: 'name' }] ;  
  const pieColors =['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#445ce2', '#e244b1', '#0c3836', '#51e4b5', '#ff0000', '#6eff00', '#00ffe7', '#28a743', '#ff00c8', '#063361', '#1f77b4', '#e377c2', '#ff7f0e', '#2ca02c', '#bcbd22', '#d62728', '#17becf', '#9467bd', '#7f7f7f', '#8c564b', '#3366cc']
  
  const columns = [
    {
      title: t('company'),
      field: 'company',
      render: (rowData) => (
        <div>
          {rowData.company}
          <br />
          <a href={`tel:${rowData.phone}`} style={{ textDecoration: 'none', color: '#6f6e6e' }}>
            {rowData.phone}
          </a>
          {' - '}
          <a href={`mailto:${rowData.email}`} style={{ textDecoration: 'none', color: '#6f6e6e' }}>
            {rowData.email}
          </a>
        </div>
      ),
    },
    {
      title: t('groupName'),
      render: (rowData) => {
        const group_label = [];
        for (const i in rowData.group_id) {
          group_label.push(
            <button key={i}>
              {rowData.group_id[i].label}
            </button>,
          );
        }
        return group_label;
      },
    },
    {
      title: t('country'),
      field: 'defaultAddress_country_id',

    }, {
      title: t('state'),
      field: 'defaultAddress_state_id',

    },
    {
      title: t('actions'),
      field: '_id',
      render: (rowData) => (
        <div>
          <Link to={`/customers/edit/${rowData._id}`}><Edit /></Link>
        </div>
      ),
    },
  ]
  
    const  tableIcons = {
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
    }

    
  

  const getCustomersData = () => {
    axios.get('http://localhost:5000/customers')
      .then((response) => {
        if (response.data.length > 0) {
             seTdata(response.data)
           // console.log(data)
          // console.log(columns)
        }
      });
  }

  const getCustomersGroupData= () => {
    axios.get('http://localhost:5000/customersgroups')
      .then((response) => {
        if (response.data.length > 0) {
            seTcustomergroups(response.data)
        }
      });
  }

  const getGroupNameStatistic= () => {
    // group name statistic data
    axios.get('http://localhost:5000/customers/statistic')
      .then((response) => {
        if (response.data.length > 0) {
          const details_label = [];
          const details_value = [];
          for (const i in response.data) {
            details_label.push(response.data[i]._id);
            details_value.push(response.data[i].count);
          }
            seTdetails_label(details_label)
            seTdetails_value(details_value)
        }
      });
  }


  useEffect(() => {

    getCustomersData();
    getCustomersGroupData();
    getGroupNameStatistic();

  }, []);


   const handleClickOpen = () => {
     seTopen(true);
   };

   const handleClose = () => {
      getCustomersData();
      getGroupNameStatistic();

     seTopen(false);
   };

     return (
       <>

         <div className="containerP">
           <Dialog
             open={open}
             onClose={handleClose}
             fullWidth
             maxWidth="md"
           >
             <DialogContent style={{ padding: '0' }}>
               <MaterialTable
                 title={t('customersGroup')}
                 icons={tableIcons}
                 columns={customergroups_label}
                 data={customergroups}
                 options={{
                   exportButton: true,
                 }}
                 editable={{
                   onRowAdd: (newData) => new Promise((resolve, reject) => {
                     axios.post('http://localhost:5000/customersgroups/add', { name: newData.name })
                       .then((response) => {
                        customergroups.push(newData);
                        seTcustomergroups(customergroups)
                         getCustomersGroupData()
                       });
                       resolve()
                   }),
                   onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                     axios.post(`http://localhost:5000/customersgroups/${newData._id}`, { name: newData.name })
                       .then((response) => {
                         const index = customergroups.indexOf(oldData);
                         customergroups[index] = newData;
                         seTcustomergroups(customergroups)
                         getCustomersGroupData()
                        });
                        resolve()
                   }),
                   onRowDelete: (oldData) => new Promise((resolve, reject) => {
                     axios.delete(`http://localhost:5000/customersgroups/${oldData._id}`)
                       .then((response) => {
                         const index = customergroups.indexOf(oldData);
                         customergroups.splice(index, 1);
                         seTcustomergroups(customergroups)
                         getCustomersGroupData()
                       });
                       resolve()
                   }),
                 }}
               />
             </DialogContent>
             <DialogActions>
               <Button onClick={handleClose} color="primary">
                 {t('okey')}
               </Button>
             </DialogActions>
           </Dialog>
           <Grid item container spacing={3}>
             <Grid container item md={9} className="panelGridRelative">
               <Card className="panelLargeIcon">
                 <GroupAdd fontSize="large" />
               </Card>
               <Card className="listViewPaper">

                 <MaterialTable
                   title=""
                   icons={tableIcons}
                   columns={columns}
                   data={data}
                   options={{
                     exportButton: true,
                     pageSize: 10,
                     grouping: true,

                   }}
                   components={{
                     Toolbar: (props) => (
                       <div>
                        <Typography component="h5" variant="h6" color="inherit" noWrap className="typography">
                          {t('customersList')}
                        </Typography>
                        <Link to="/customercreate" className="addButtonPlace">
                          <Tooltip title={t('createCustomers')}>
                            <AddBox fontSize="large" className="addButtonIcon" />
                          </Tooltip>
                        </Link>
                        <MTableToolbar {...props} />
                        <div style={{ clear: 'both' }} />
                      </div>
                     ),
                   }}
                 />
               </Card>
             </Grid>
             <Grid item container md={3} className="panelGridRelative">
               <Card className="listViewPaper" style={{ padding: '10px' }}>
                 <Typography component="h1" variant="h6" color="inherit" noWrap style={{ width: '100%', paddingLeft: '10px' }} className="typography">
                   {t('customersGroup')}
                   <Tooltip title={t('manageGroups')}>
                     <Button variant="outlined" style={{ float: 'right', marginRight: '15px' }} color="primary" onClick={handleClickOpen}>
                       <Settings />
                     </Button>
                   </Tooltip>
                 </Typography>
                 <div style={{ marginTop: '55px', textAlign: 'center' }}>
                   
                   
                   <Doughnut
                     height={350}
                     data={{
                       labels: details_label,
                       datasets: [{
                         data: details_value,
                         backgroundColor: pieColors,
                       }],
                     }}
                   />

                   
                 </div>
               </Card>
             </Grid>
           </Grid>
         </div>
       </>
     );
   }

