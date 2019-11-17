import React, { Component, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import MaterialTable, { MTableToolbar } from 'material-table';
import { withNamespaces } from 'react-i18next';


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
} from '@material-ui/icons';

import '../../assets/css/style.css';


class ProductsList extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      productcategories: [],
      open: false,
      details_label: '',
      details_value: '',
      pieColors: ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#445ce2', '#e244b1', '#0c3836', '#51e4b5', '#ff0000', '#6eff00', '#00ffe7', '#28a743', '#ff00c8', '#063361', '#1f77b4', '#e377c2', '#ff7f0e', '#2ca02c', '#bcbd22', '#d62728', '#17becf', '#9467bd', '#7f7f7f', '#8c564b', '#3366cc'],

      data: [],
      productcategories_label: [{ title: t('categoryName'), field: 'name' }],

      columns: [
        {
          title: t('productName'),
          field: 'product_name',

        },


        {
          title: t('category'),
          render: (rowData) => {
            const group_label = [];
            for (const i in rowData.category_id) {
              group_label.push(
                <button key={i}>
                  {rowData.category_id[i].label}
                </button>,
              );
            }
            return group_label;
          },
        },

        {
          title: t('productcode'),
          field: 'product_code',

        },

        {
          title: t('actions'),
          field: '_id',
          render: (rowData) => (
            <div>
              <Link to={`/products/edit/${rowData._id}`}><Edit /></Link>
            </div>
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

  getProductsData = () => {
    axios.get('http://localhost:5000/products')
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            data: response.data,
          });
          // console.log(this.state.data)
          // console.log(this.state.columns)
        }
      });
  }

  getProductsCatagoriesData= () => {
    axios.get('http://localhost:5000/productcategories')
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            productcategories: response.data,
          });
        }
      });
  }

  getProductsCategoriesStatistic= () => {
    // products catagories statistic data
    axios.get('http://localhost:5000/products/statistic')
      .then((response) => {
        if (response.data.length > 0) {
          const details_label = [];
          const details_value = [];
          for (const i in response.data) {
            details_label.push(response.data[i]._id);
            details_value.push(response.data[i].count);
          }
          this.setState({
            details_label,
            details_value,
          });
        }
      });
  }

  componentWillMount() {
    this.getProductsData();
    this.getProductsCatagoriesData();
    this.getProductsCategoriesStatistic();
  }

   handleClickOpen = () => {
     this.setState({ open: true });
   };

   handleClose = () => {
     this.getProductsData();
     this.getProductsCategoriesStatistic();

     this.setState({ open: false });
   };

   render() {
     const { t } = this.props;
     return (
       <>

         <div className="containerP">
           <Dialog
             open={this.state.open}
             onClose={this.handleClose}
             fullWidth
             maxWidth="md"
           >
             <DialogContent style={{ padding: '0' }}>
               <MaterialTable
                 title={t('productCatagories')}
                 icons={this.state.tableIcons}
                 columns={this.state.productcategories_label}
                 data={this.state.productcategories}
                 options={{
                   exportButton: true,
                 }}
                 editable={{
                   onRowAdd: (newData) => new Promise((resolve, reject) => {
                     axios.post('http://localhost:5000/productcategories/add', { name: newData.name })
                       .then((response) => {
                         const { productcategories } = this.state;
                         productcategories.push(newData);
                         this.setState({ productcategories }, () => resolve());
                       });
                   }),
                   onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                     axios.post(`http://localhost:5000/productcategories/${newData._id}`, { name: newData.name })
                       .then((response) => {
                         const { productcategories } = this.state;
                         const index = productcategories.indexOf(oldData);
                         productcategories[index] = newData;
                         this.setState({ productcategories }, () => resolve());
                       });
                   }),
                   onRowDelete: (oldData) => new Promise((resolve, reject) => {
                     axios.delete(`http://localhost:5000/productcategories/${oldData._id}`)
                       .then((response) => {
                         const { productcategories } = this.state;
                         const index = productcategories.indexOf(oldData);
                         productcategories.splice(index, 1);
                         this.setState({ productcategories }, () => resolve());
                       });
                   }),
                 }}
               />
             </DialogContent>
             <DialogActions>
               <Button onClick={this.handleClose} color="primary">
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
                   icons={this.state.tableIcons}
                   columns={this.state.columns}
                   data={this.state.data}
                   options={{
                     exportButton: true,
                     pageSize: 10,
                     grouping: true,

                   }}
                   components={{
                     Toolbar: (props) => (
                       <div>
                        <Typography component="h5" variant="h6" color="inherit" noWrap className="typography">
                          {t('productList')}
                        </Typography>
                        <Link to="/productcreate" className="addButtonPlace">
                          <Tooltip title={t('createProduct')}>
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
                   {t('productCatagories')}
                   <Tooltip title={t('manageCatagories')}>
                     <Button variant="outlined" style={{ float: 'right', marginRight: '15px' }} color="primary" onClick={this.handleClickOpen}>
                       <Settings />
                     </Button>
                   </Tooltip>
                 </Typography>
                 <div style={{ marginTop: '55px', textAlign: 'center' }}>
                   <Doughnut
                     height={350}
                     data={{
                       labels: this.state.details_label,
                       datasets: [{
                         data: this.state.details_value,
                         backgroundColor: this.state.pieColors,
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
}

export default withNamespaces()(ProductsList);
