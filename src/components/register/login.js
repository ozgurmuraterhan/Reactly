import React, { useState, useContext } from 'react';
import AuthService from '../../Services/AuthService';
import Message from '../register/message';
import { AuthContext } from '../../Context/AuthContext';

import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useTranslation } from 'react-i18next';

import {
    FormControl,
    FormGroup,
    FormHelperText,
    Grid,
    Button,
    Container,
} from '@material-ui/core';

import { AddBox, GroupAdd, Save } from '@material-ui/icons';
import '../../assets/css/style.css';

const Login = (props) => {
    const [user, setUser] = useState({ username: '', password: '' });
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        AuthService.login(user).then((data) => {
            const { isAuthenticated, user, message } = data;
            if (isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                enqueueSnackbar(t('Login Successfully'), {
                    variant: 'success',
                });
                props.history.push('/dashboard');
            } else {
                enqueueSnackbar(
                    t('Login information is incorrect. Try again.'),
                    {
                        variant: 'error',
                    }
                );
            }
        });
    };

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <div style={{ top: '50%', left: '50%', position: 'absolite' }}>
                <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
                    <Grid item container sm={12}>
                        <Grid container item md={6} spacing={0} sm={6}>
                            <Container maxWidth="sm">
                                <div className="logo"></div>
                                <FormGroup className="FormGroupLogin">
                                    <FormControl>
                                        <TextValidator
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            margin="dense"
                                            required
                                            label={t('Username')}
                                            name="username"
                                            onChange={onChange}
                                        />
                                        <FormHelperText>
                                            {t(
                                                'You need a username or e-mail.'
                                            )}
                                        </FormHelperText>
                                    </FormControl>
                                </FormGroup>

                                <FormGroup className="FormGroupLogin">
                                    <FormControl>
                                        <TextValidator
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                            variant="outlined"
                                            margin="dense"
                                            label={t('Password')}
                                            name="password"
                                            type="password"
                                            onChange={onChange}
                                        />
                                        <FormHelperText>
                                            {t('You need a Password')}
                                        </FormHelperText>
                                    </FormControl>
                                </FormGroup>
                                <Grid container item md={6} spacing={0} sm={6}>
                                    <FormGroup className="FormGroupLogin">
                                        <FormControl>
                                            <Button
                                                type="submit"
                                                variant="outlined"
                                                margin="dense"
                                                color="primary"
                                            >
                                                Log in
                                            </Button>{' '}
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                                <Grid container item md={6} spacing={0} sm={6}>
                                    <FormGroup className="FormGroupLogin">
                                        <FormControl>
                                            <Button>Forget Passport</Button>{' '}
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                            </Container>
                        </Grid>

                        <Grid container item md={6} sm={6} spacing={0}>
                            <div className="loginBanner">sdsd</div>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </div>
    );
};

export default Login;
