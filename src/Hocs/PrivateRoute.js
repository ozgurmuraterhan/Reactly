import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    const [t] = useTranslation();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const eqRoles = [roles, user.role].reduce((a, c) => a.filter(i => c.includes(i)))

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isAuthenticated) {
                    history.push('/login');
                }
                if (eqRoles.length == 0) {
                    enqueueSnackbar(t('Bu sayfayı görmek için yetkiniz yok, yöneticiniz ile iletişime geçin.'), { variant: 'error' });
                    // navigate
                    history.push('/');
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
