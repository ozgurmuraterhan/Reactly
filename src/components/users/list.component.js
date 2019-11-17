import React, { Component, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MaterialTable, { MTableToolbar } from 'material-table';

import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Tooltip from '@material-ui/core/Tooltip';


import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

export default class UsersList extends Component {
  constructor(props) {
    super(props);


    this.state = {
      data: [],
      columns: [
        { title: 'Username', field: 'username' },
        { title: 'Description', field: 'description' },
        {
          title: 'Actions',
          field: '_id',
          render: (rowData) => (
            <div>
              <a href="#/userslist" onClick={() => { this.deleteData(rowData._id); }}><Delete /></a>
              <Link to={`/users/edit/${rowData._id}`}><Edit /></Link>
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

  componentDidMount() {
    axios.get('http://localhost:5000/users')
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            data: response.data,
          });
        }
      })
      .catch((err) => console.log(err));
  }

    deleteData = (id) => {
      axios.delete(`http://localhost:5000/users/${id}`)
        .then((res) => console.log(res.data));

      this.setState({
        data: this.state.data.filter((del) => del._id !== id),
      });

      window.location = '#/userslist';
    }

    render() {
      return (

        <Paper style={{ margin: '30px' }}>
          <MaterialTable
            title="Users List"

            icons={this.state.tableIcons}
            columns={this.state.columns}
            data={this.state.data}
            components={{
              Toolbar: (props) => (
                <div style={{ backgroundColor: '#e8eaf5' }}>
                  <Link to="/usercreate" style={{ margin: '20px 10px', float: 'right' }}>
                    <Tooltip title="Create User">
                      <AddBoxIcon style={{ float: 'right', color: '#000' }} />
                    </Tooltip>
                  </Link>

                  <MTableToolbar {...props} />

                </div>
              ),
            }}
          />
        </Paper>


      );
    }
}
