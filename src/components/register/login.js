import React, { useState, useContext, useEffect } from 'react';
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';

import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useTranslation } from 'react-i18next';

import {
    FormControl,
    FormGroup,
    FormHelperText,
    Grid,
    Button,
    Container,
    InputAdornment,
    Typography,
} from '@material-ui/core';

import { ContactMail } from '@material-ui/icons';
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
        <div>
            <div>
                <ValidatorForm autoComplete="off" onSubmit={onSubmit}>
                    <Grid item container sm={12}>
                        <Grid container item md={6} spacing={0} sm={6}>
                            <Container maxWidth="sm">
                                <Typography
                                    variant="h2"
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '100px',
                                    }}
                                >
                                    ReactLY
                                </Typography>
                                <Typography
                                    variant="caption"
                                    display="block"
                                    gutterBottom
                                    style={{
                                        textAlign: 'center',
                                        marginBottom: '100px',
                                    }}
                                >
                                    Fortune favors the bold.
                                </Typography>
                                <FormGroup className="FormGroupLogin">
                                    <FormControl>
                                        <TextValidator
                                            variant="outlined"
                                            required
                                            label={t('Username or E-mail')}
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
                                            required
                                            variant="outlined"
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
                                <FormGroup className="FormGroupLogin">
                                    <FormControl>
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            margin="dense"
                                            color="primary"
                                        >
                                            Log in
                                        </Button>
                                    </FormControl>
                                </FormGroup>
                                <Button>{t('Forgot Passport ?')}</Button>
                            </Container>
                        </Grid>

                        <Grid container item md={6} sm={6} spacing={0}>
                            <div className="loginBanner"></div>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </div>
    );
};

export default Login;
