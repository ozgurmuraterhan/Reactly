import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';

// import Language config file
import './i18n';


ReactDOM.render(

  <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <App />
  </SnackbarProvider>,

  document.getElementById('root'),
);
