import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import AuthProvider from './Context/AuthContext';

// import Language config file
import './i18n';

ReactDOM.render(
    <AuthProvider>
        <SnackbarProvider
            maxSnack={2}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <App />
        </SnackbarProvider>
    </AuthProvider>,

    document.getElementById('root')
);
