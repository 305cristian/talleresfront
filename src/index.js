import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from '../src/setting/server_firebase';
import App from './App';
import Login from './components/Login'


ReactDOM.render(
//        React.StrictMode
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);
