/* eslint-disable no-console */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {
    LinkButtons,
    SubmitButtons,
    registerButton,
    homeButton,
    forgotButton,
    inputStyle,
    HeaderBar,
} from './components';

const title = {
    pageTitle: 'Forgot Password Screen',
};

class ForgotPassword extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            showError: false,
            messageFromServer: '',
            showNullError: false,
        };
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    sendEmail = async (e) => {
        e.preventDefault();
        const { username } = this.state;
        if (username === '') {
            this.setState({
                showError: false,
                messageFromServer: '',
                showNullError: true,
            });
        } else {
            try {
                const response = await axios.post(
                    'http://localhost:5000/user/forgotPassword',
                    {
                        username,
                    },
                );
                console.log(response.data);
                if (response.data === 'recovery email sent') {
                    this.setState({
                        showError: false,
                        messageFromServer: 'recovery email sent',
                        showNullError: false,
                    });
                }
            } catch (error) {
                console.log(error)
                if (error.response.data === 'email not in db') {
                    this.setState({
                        showError: true,
                        messageFromServer: '',
                        showNullError: false,
                    });
                }
            }
        }
    };

    render() {
        const {
            username, messageFromServer, showNullError, showError
        } = this.state;

        return (
            <div>
                <HeaderBar title={title} />
                <form className="profile-form" onSubmit={this.sendEmail}>
                    <TextField
                        style={inputStyle}
                        id="email"
                        label="email"
                        value={username}
                        onChange={this.handleChange('username')}
                        placeholder="Email Address"
                    />
                    <SubmitButtons
                        buttonStyle={forgotButton}
                        buttonText="Send Password Reset Email"
                    />
                </form>
                {showNullError && (
                    <div>
                        <p>The email address cannot be null.</p>
                    </div>
                )}
                {showError && (
                    <div>
                        <p>
                            That email address isn&apos;t recognized. Please try again or
                            register for a new account.
            </p>
                        <LinkButtons
                            buttonText="Register"
                            buttonStyle={registerButton}
                            link="/register"
                        />
                    </div>
                )}
                {messageFromServer === 'recovery email sent' && (
                    <div>
                        <h3>Password Reset Email Successfully Sent!</h3>
                    </div>
                )}
                <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
            </div>
        );
    }
}

export default ForgotPassword;