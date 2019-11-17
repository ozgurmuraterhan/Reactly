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
  Receipt,
} from '@material-ui/icons';

import '../../assets/css/style.css';


class InvoicesList extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      customergroups: [],
      open: false,
      details_label: '',
      details_value: '',
      pieColors: ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#445ce2', '#e244b1', '#0c3836', '#51e4b5', '#ff0000', '#6eff00', '#00ffe7', '#28a743', '#ff00c8', '#063361', '#1f77b4', '#e377c2', '#ff7f0e', '#2ca02c', '#bcbd22', '#d62728', '#17becf', '#9467bd', '#7f7f7f', '#8c564b', '#3366cc'],

      data: [],
      customergroups_label: [{ title: t('groupName'), field: 'name' }],

      columns: [
        {
          title: t('no'),
          field: 'no',

        }, {
          title: t('customer'),
          render: (rowData) => rowData.customer_id[0].label,

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
              <Link to={`/invoices/edit/${rowData._id}`}><Edit /></Link>
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

  getInvoicesData = () => {
    axios.get('http://localhost:5000/invoices')
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


  componentWillMount() {
    this.getInvoicesData();
  }

  render() {
    const { t } = this.props;
    return (
      <>

        <div className="containerP">

          <Grid item container spacing={3}>
            <Grid container item md={12} className="panelGridRelative">
              <Card className="panelLargeIcon">
                <Receipt fontSize="large" />
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
                          {t('invoicesList')}
                        </Typography>
                        <Link to="/invoicecreate" className="addButtonPlace">
                          <Tooltip title={t('createInvoice')}>
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

          </Grid>

        </div>
      </>
    );
  }
}

export default withNamespaces()(InvoicesList);
