import React, { Component } from 'react';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

export default class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      description: '',
    };
  }

    onChangeUsername = (e) => {
      this.setState({
        username: e.target.value,
      });
    }

    onChangeDescription = (e) => {
      this.setState({
        description: e.target.value,
      });
    }

    onSubmit = (e) => {
      e.preventDefault();
      const user = {
        username: this.state.username,
        description: this.state.description,


      };
      console.log(user);

      axios.post('http://localhost:5000/users/add', user)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      this.setState({
        username: '',
        description: '',
      });
    }

    render() {
      return (


        <div>
          <>

            <FormControl>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                aria-describedby="my-helper-text"
                value={this.state.username}
                onChange={this.onChangeUsername}
              />
              <FormHelperText id="my-helper-text">You need a username.</FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="description">Description</InputLabel>
              <Input
                id="description"
                aria-describedby="my-helper-text"
                value={this.state.description}
                onChange={this.onChangeDescription}
              />
              <FormHelperText id="my-helper-text">You need a description.</FormHelperText>
            </FormControl>

            <FormControl>
              <Button variant="contained" color="primary" onClick={this.onSubmit}>
                            Save
              </Button>
            </FormControl>
          </>

        </div>


      );
    }
}
