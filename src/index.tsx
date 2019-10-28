import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { initializeApp } from 'firebase';

import { BrowserRouter } from 'react-router-dom';

initializeApp({
  apiKey: 'AIzaSyD8wEhnTKn49_7sTzZ7HjcmmdyEn5wU6wk',
  authDomain: 'bag-of-nuts.firebaseapp.com',
  databaseURL: 'https://bag-of-nuts.firebaseio.com',
  projectId: 'bag-of-nuts',
  storageBucket: 'bag-of-nuts.appspot.com',
  messagingSenderId: '835023127793',
  appId: '1:835023127793:web:f19df42304811e7aa85550',
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.querySelector('#root'),
);
